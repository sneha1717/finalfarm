import express from 'express';
import { body, validationResult } from 'express-validator';
import SimpleDonation from '../models/SimpleDonation.js';
import { DirectUPIPayment, BankTransferPayment, CryptoPayment } from '../utils/upiDirect.js';

const router = express.Router();

// Initialize payment methods
const upiPayment = new DirectUPIPayment(
  process.env.NGO_UPI_ID || '9439539498@axl',
  process.env.NGO_NAME || 'FarmVilla Foundation'
);

const bankTransfer = new BankTransferPayment({
  accountName: process.env.BANK_ACCOUNT_NAME || 'FarmVilla Foundation (Demo Account)',
  accountNumber: process.env.BANK_ACCOUNT_NUMBER || '1234567890123456',
  ifscCode: process.env.BANK_IFSC_CODE || 'SBIN0001234',
  bankName: process.env.BANK_NAME || 'State Bank of India',
  branch: process.env.BANK_BRANCH || 'Demo Branch'
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

    // Create mock recipient for testing
    const recipient = {
      _id: recipientId,
      organizationName: recipientId === 'water' ? 'Water Conservation Project' : 
                       recipientId === 'electricity' ? 'Solar Pump Initiative' :
                       recipientId === 'baler' ? 'Baler Machine Fund' : 'FarmVilla Foundation'
    };

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
    const donation = new SimpleDonation({
      transactionId: paymentRequest.transactionId,
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
  body('recipientId').notEmpty().withMessage('Recipient ID is required'),
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

    // Create mock recipient for testing
    const recipient = {
      _id: recipientId,
      organizationName: recipientId === 'water' ? 'Water Conservation Project' : 
                       recipientId === 'electricity' ? 'Solar Pump Initiative' :
                       recipientId === 'baler' ? 'Baler Machine Fund' : 'FarmVilla Foundation'
    };

    const transactionId = `TXN-BANK-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Generate bank transfer details
    const bankDetails = bankTransfer.generateBankTransferDetails(amount, transactionId);

    // Create donation record
    const donation = new SimpleDonation({
      transactionId,
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
  body('recipientId').notEmpty().withMessage('Recipient ID is required')
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

    const { amount, currency = 'USDT', recipientId, donorName, donorEmail } = req.body;

    // Create mock recipient for testing
    const recipient = {
      _id: recipientId,
      organizationName: recipientId === 'water' ? 'Water Conservation Project' : 
                       recipientId === 'electricity' ? 'Solar Pump Initiative' :
                       recipientId === 'baler' ? 'Baler Machine Fund' : 'FarmVilla Foundation'
    };

    const transactionId = `TXN-CRYPTO-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Mock crypto wallet addresses
    const walletAddresses = {
      USDT: 'TYour-USDT-Wallet-Address-Here',
      BTC: 'bc1your-btc-wallet-address-here',
      ETH: '0xYour-ETH-Wallet-Address-Here'
    };

    // Create donation record
    const donation = new SimpleDonation({
      transactionId,
      amount: amount,
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
        transactionId,
        amount,
        currency,
        walletAddress: walletAddresses[currency],
        qrCode: `${currency}:${walletAddresses[currency]}?amount=${amount}`,
        instructions: [
          `Send ${amount} ${currency} to the above address`,
          `Use transaction ID: ${transactionId} as memo/note`,
          `Confirmation required: 3 blocks`,
          `Payment verified automatically via blockchain`
        ],
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

// Get donation history for a specific recipient
router.get('/history/:recipientId', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const donations = await SimpleDonation.find({ recipient: recipientId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('transactionId amount donor.name donor.isAnonymous paymentMethod status createdAt completedAt');

    const totalDonations = await SimpleDonation.countDocuments({ recipient: recipientId });
    const stats = await SimpleDonation.getStats(recipientId);

    res.status(200).json({
      success: true,
      data: {
        donations: donations.map(donation => donation.toPublicJSON()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalDonations / limit),
          totalDonations,
          hasNext: page * limit < totalDonations,
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all recent donations (for global feed)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentDonations = await SimpleDonation.find({ status: { $in: ['completed', 'pending'] } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('transactionId amount donor.name donor.isAnonymous recipient paymentMethod status createdAt');

    res.status(200).json({
      success: true,
      data: recentDonations.map(donation => {
        const publicData = donation.toPublicJSON();
        // Add recipient name mapping
        const recipientNames = {
          'water': 'Water Conservation Project',
          'electricity': 'Solar Pump Initiative', 
          'baler': 'Baler Machine Fund'
        };
        publicData.recipientName = recipientNames[donation.recipient] || 'FarmVilla Foundation';
        return publicData;
      })
    });

  } catch (error) {
    console.error('Get recent donations error:', error);
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
          }
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
