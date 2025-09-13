import express from 'express';
import { body, validationResult } from 'express-validator';
import Donation from '../models/Payment.js';
import NGO from '../models/NGO.js';
// Razorpay imports commented out - using direct payments
// import {
//   createOrder,
//   verifyPayment,
//   createRefund,
//   getSupportedMethods
// } from '../utils/razorpay.js';
import { generateReceipt } from '../utils/receiptGenerator.js';
import { sendNotifications } from '../utils/notifications.js';

const router = express.Router();

// Create donation order
router.post('/create-order', [
  body('amount').isNumeric().withMessage('Amount must be a number').isFloat({ min: 1 }).withMessage('Amount must be at least ₹1'),
  body('recipientId').isMongoId().withMessage('Invalid recipient ID'),
  body('donorName').optional().isLength({ min: 2, max: 100 }).withMessage('Donor name must be between 2-100 characters'),
  body('donorEmail').optional().isEmail().withMessage('Invalid email format'),
  body('donorPhone').optional().matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('isAnonymous').optional().isBoolean().withMessage('isAnonymous must be boolean'),
  body('isRecurring').optional().isBoolean().withMessage('isRecurring must be boolean'),
  body('recurringFrequency').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Invalid recurring frequency')
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
      isRecurring = false,
      recurringFrequency,
      paymentMethod = 'UPI'
    } = req.body;

    // Verify recipient exists
    const recipient = await NGO.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Generate unique transaction ID
    const transactionId = `TXN-AGRI-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Razorpay order
    const orderResult = await createRazorpayOrder(
      amount,
      'INR',
      transactionId,
      {
        donor_name: donorName,
        recipient_id: recipientId,
        is_recurring: isRecurring
      }
    );

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: orderResult.error
      });
    }

    // Calculate next payment date for recurring donations
    let nextPaymentDate = null;
    if (isRecurring && recurringFrequency) {
      const now = new Date();
      switch (recurringFrequency) {
        case 'monthly':
          nextPaymentDate = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case 'quarterly':
          nextPaymentDate = new Date(now.setMonth(now.getMonth() + 3));
          break;
        case 'yearly':
          nextPaymentDate = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
      }
    }

    // Create donation record
    const donation = new Donation({
      transactionId,
      razorpayOrderId: orderResult.order.id,
      amount,
      donor: {
        name: donorName,
        email: donorEmail,
        phone: donorPhone,
        isAnonymous
      },
      recipient: recipientId,
      paymentMethod,
      isRecurring,
      recurringFrequency,
      nextPaymentDate,
      metadata: {
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip,
        source: 'web'
      }
    });

    await donation.save();

    // Generate UPI QR code if needed
    let upiQRCode = null;
    let upiIntent = null;
    
    if (paymentMethod === 'UPI') {
      const recipientUPI = process.env.NGO_UPI_ID || 'farmvilla@paytm';
      const qrResult = await generateUPIQRCode(
        amount,
        recipientUPI,
        recipient.organizationName,
        `Donation to ${recipient.organizationName}`
      );
      
      if (qrResult.success) {
        upiQRCode = qrResult.qrCode;
      }

      const intentResult = generateUPIIntent(
        amount,
        recipientUPI,
        recipient.organizationName,
        `Donation to ${recipient.organizationName}`,
        transactionId
      );
      
      if (intentResult.success) {
        upiIntent = intentResult.intentUrl;
      }
    }

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        transactionId,
        orderId: orderResult.order.id,
        amount,
        currency: 'INR',
        recipient: {
          id: recipient._id,
          name: recipient.organizationName
        },
        upiQRCode,
        upiIntent,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Verify payment
router.post('/verify-payment', [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Signature is required')
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

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const isValidSignature = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find donation record
    const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id })
      .populate('recipient', 'organizationName email mobile');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation record not found'
      });
    }

    // Get payment details from Razorpay
    const paymentResult = await getPaymentDetails(razorpay_payment_id);
    
    if (!paymentResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment details'
      });
    }

    // Update donation record
    donation.razorpayPaymentId = razorpay_payment_id;
    donation.razorpaySignature = razorpay_signature;
    donation.status = 'completed';
    donation.completedAt = new Date();

    // Extract UPI details if available
    if (paymentResult.payment.method === 'upi') {
      donation.upiDetails = {
        vpa: paymentResult.payment.vpa || null
      };
    }

    await donation.save();

    // Generate receipt
    try {
      const receiptUrl = await generateReceipt(donation);
      donation.receiptUrl = receiptUrl;
      donation.receiptGenerated = true;
      await donation.save();
    } catch (receiptError) {
      console.error('Receipt generation error:', receiptError);
    }

    // Send notifications
    try {
      await sendNotifications(donation);
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        transactionId: donation.transactionId,
        status: donation.status,
        amount: donation.amount,
        completedAt: donation.completedAt,
        receiptUrl: donation.receiptUrl
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get donation details
router.get('/donation/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params;

    const donation = await Donation.findOne({ transactionId })
      .populate('recipient', 'organizationName photo');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: donation.getPublicInfo()
    });

  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get donations for a recipient (NGO)
router.get('/recipient/:recipientId/donations', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const query = { recipient: recipientId };
    if (status) query.status = status;

    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('recipient', 'organizationName');

    const total = await Donation.countDocuments(query);

    const publicDonations = donations.map(donation => donation.maskSensitiveData());

    res.status(200).json({
      success: true,
      data: {
        donations: publicDonations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get recipient donations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get supported payment methods
router.get('/payment-methods', (req, res) => {
  try {
    const methods = getSupportedPaymentMethods();
    
    res.status(200).json({
      success: true,
      data: methods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create refund (Admin only)
router.post('/refund/:transactionId', [
  body('reason').notEmpty().withMessage('Refund reason is required'),
  body('amount').optional().isNumeric().withMessage('Amount must be a number')
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

    const { transactionId } = req.params;
    const { reason, amount } = req.body;

    const donation = await Donation.findOne({ transactionId });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    if (donation.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }

    const refundAmount = amount || donation.amount;

    const refundResult = await createRefund(
      donation.razorpayPaymentId,
      refundAmount,
      { reason }
    );

    if (!refundResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create refund',
        error: refundResult.error
      });
    }

    // Update donation status
    donation.status = 'refunded';
    await donation.save();

    res.status(200).json({
      success: true,
      message: 'Refund created successfully',
      data: {
        refundId: refundResult.refund.id,
        amount: refundAmount,
        status: 'processing'
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
