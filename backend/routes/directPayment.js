import express from 'express';
import { body, validationResult } from 'express-validator';
import Donation from '../models/Payment.js';
import NGO from '../models/NGO.js';
import { DirectUPIPayment, BankTransferPayment, CryptoPayment } from '../utils/upiDirect.js';
// import { sendNotifications } from '../utils/notifications.js';
// import { generateReceipt } from '../utils/receiptGenerator.js';

const router = express.Router();

// Initialize payment methods
const upiPayment = new DirectUPIPayment(
  process.env.NGO_UPI_ID || 'farmvilla@paytm',
  process.env.NGO_NAME || 'FarmVilla Foundation'
);

const bankTransfer = new BankTransferPayment({
  accountName: process.env.BANK_ACCOUNT_NAME || 'FarmVilla Foundation',
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
  ifscCode: process.env.BANK_IFSC_CODE || 'SBIN0001234',
  bankName: process.env.BANK_NAME || 'State Bank of India',
  branch: process.env.BANK_BRANCH || 'Main Branch'
});

const cryptoPayment = new CryptoPayment({
  USDT: process.env.USDT_WALLET || 'TYour-USDT-Wallet-Address',
  BTC: process.env.BTC_WALLET || 'bc1your-btc-wallet-address',
  ETH: process.env.ETH_WALLET || '0xYour-ETH-Wallet-Address'
});

// Create direct UPI payment
router.post('/upi/create', [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
  body('recipientId').notEmpty().withMessage('Recipient ID is required'),
  body('donorName').optional().isLength({ min: 2, max: 100 }).withMessage('Donor name must be between 2-100 characters'),
  body('donorEmail').optional().isEmail().withMessage('Invalid email format'),
  body('donorPhone').optional().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('isAnonymous').optional().isBoolean().withMessage('isAnonymous must be boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      amount,
      recipientId,
      donorName = 'Anonymous',
      donorEmail,
      donorPhone,
      isAnonymous = false,
      purpose = 'donation'
    } = req.body;

    // Verify recipient exists
    const recipient = await NGO.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Create payment request
    const paymentRequest = upiPayment.createPaymentRequest(
      { name: donorName, email: donorEmail, phone: donorPhone, isAnonymous },
      amount,
      purpose
    );

    // Generate UPI QR Code and payment links
    const qrResult = await upiPayment.generateUPIQRCode(
      amount,
      paymentRequest.transactionId,
      `Donation to ${recipient.organizationName}`
    );

    if (!qrResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate UPI QR code',
        error: qrResult.error
      });
    }

    // Generate app-specific payment intents
    const appIntents = upiPayment.generateAppIntents(
      amount,
      paymentRequest.transactionId,
      `Donation to ${recipient.organizationName}`
    );

    // Create donation record
    const donation = new Donation({
      transactionId: paymentRequest.transactionId,
      razorpayOrderId: null, // Not using Razorpay
      amount,
      donor: {
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
        isAnonymous
      },
      recipient: recipientId,
      paymentMethod: 'UPI_DIRECT',
      status: 'pending',
      upiDetails: {
        vpa: upiPayment.merchantVPA
      },
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        source: 'direct_upi'
      }
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'UPI payment request created successfully',
      data: {
        transactionId: paymentRequest.transactionId,
        amount,
        recipient: {
          id: recipient._id,
          name: recipient.organizationName
        },
        upiDetails: {
          merchantVPA: upiPayment.merchantVPA,
          merchantName: upiPayment.merchantName,
          qrCode: qrResult.qrCode,
          upiURL: qrResult.upiURL
        },
        appIntents,
        instructions: [
          'Scan the QR code with any UPI app',
          'Or click on your preferred UPI app below',
          'Complete the payment in your UPI app',
          'Share payment screenshot for verification'
        ]
      }
    });

  } catch (error) {
    console.error('UPI payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Create bank transfer payment
router.post('/bank/create', [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
  body('recipientId').isMongoId().withMessage('Invalid recipient ID'),
  body('donorName').notEmpty().withMessage('Donor name is required for bank transfers'),
  body('donorEmail').isEmail().withMessage('Valid email is required for bank transfers')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { amount, recipientId, donorName, donorEmail, donorPhone } = req.body;

    // Verify recipient exists
    const recipient = await NGO.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    const transactionId = `TXN-BANK-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate bank transfer details
    const bankDetails = bankTransfer.generateBankTransferDetails(amount, transactionId);

    // Create donation record
    const donation = new Donation({
      transactionId,
      razorpayOrderId: null,
      amount,
      donor: {
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
        isAnonymous: false
      },
      recipient: recipientId,
      paymentMethod: 'BANK_TRANSFER',
      status: 'pending_verification',
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        source: 'bank_transfer'
      }
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Bank transfer details generated successfully',
      data: {
        transactionId,
        amount,
        recipient: {
          id: recipient._id,
          name: recipient.organizationName
        },
        bankDetails: bankDetails.bankDetails,
        instructions: bankDetails.instructions,
        verificationNote: 'Please send payment screenshot to verify your donation'
      }
    });

  } catch (error) {
    console.error('Bank transfer creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create crypto payment
router.post('/crypto/create', [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
  body('currency').isIn(['USDT', 'BTC', 'ETH']).withMessage('Supported currencies: USDT, BTC, ETH'),
  body('recipientId').isMongoId().withMessage('Invalid recipient ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { amount, currency, recipientId, donorName, donorEmail } = req.body;

    // Verify recipient exists
    const recipient = await NGO.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Generate crypto payment details
    const cryptoDetails = cryptoPayment.generateCryptoPayment(amount, currency);

    // Create donation record
    const donation = new Donation({
      transactionId: cryptoDetails.transactionId,
      razorpayOrderId: null,
      amount: amount, // Store in USD equivalent
      currency: currency,
      donor: {
        name: donorName || 'Anonymous',
        email: donorEmail,
        isAnonymous: !donorName
      },
      recipient: recipientId,
      paymentMethod: `CRYPTO_${currency}`,
      status: 'pending_verification',
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        source: 'crypto'
      }
    });

    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Crypto payment details generated successfully',
      data: {
        transactionId: cryptoDetails.transactionId,
        amount,
        currency,
        walletAddress: cryptoDetails.walletAddress,
        qrCode: cryptoDetails.qrCode,
        instructions: cryptoDetails.instructions,
        recipient: {
          id: recipient._id,
          name: recipient.organizationName
        }
      }
    });

  } catch (error) {
    console.error('Crypto payment creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify manual payment (Admin only)
router.post('/verify/:transactionId', [
  body('paymentProof').notEmpty().withMessage('Payment proof is required'),
  body('verifiedAmount').isNumeric().withMessage('Verified amount must be a number')
], async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { paymentProof, verifiedAmount, adminNotes } = req.body;

    const donation = await Donation.findOne({ transactionId })
      .populate('recipient', 'organizationName email mobile');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Update donation status
    donation.status = 'completed';
    donation.completedAt = new Date();
    donation.metadata.paymentProof = paymentProof;
    donation.metadata.adminNotes = adminNotes;
    donation.metadata.verifiedBy = req.user?.id || 'admin'; // Assuming admin auth

    await donation.save();

    // Generate receipt (disabled for now)
    // try {
    //   const receiptUrl = await generateReceipt(donation);
    //   donation.receiptUrl = receiptUrl;
    //   donation.receiptGenerated = true;
    //   await donation.save();
    // } catch (receiptError) {
    //   console.error('Receipt generation error:', receiptError);
    // }

    // Send notifications (disabled for now)
    // try {
    //   await sendNotifications(donation);
    // } catch (notificationError) {
    //   console.error('Notification error:', notificationError);
    // }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        transactionId: donation.transactionId,
        status: donation.status,
        verifiedAmount,
        completedAt: donation.completedAt
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get payment methods available
router.get('/methods', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        upi: {
          enabled: true,
          merchantVPA: upiPayment.merchantVPA,
          merchantName: upiPayment.merchantName,
          supportedApps: ['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay']
        },
        bankTransfer: {
          enabled: true,
          bankDetails: {
            accountName: bankTransfer.bankDetails.accountName,
            bankName: bankTransfer.bankDetails.bankName,
            // Don't expose full account details in public API
          }
        },
        crypto: {
          enabled: true,
          supportedCurrencies: ['USDT', 'BTC', 'ETH']
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
