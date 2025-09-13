import Razorpay from 'razorpay';
import crypto from 'crypto';
import QRCode from 'qrcode';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createRazorpayOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes,
      payment_capture: 1 // Auto capture payment
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      order
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify Razorpay payment signature
export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  try {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Get payment details from Razorpay
export const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Create refund
export const createRefund = async (paymentId, amount, notes = {}) => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      notes
    });
    
    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error('Refund creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate UPI QR Code
export const generateUPIQRCode = async (amount, recipientUPI, recipientName, transactionNote) => {
  try {
    const upiString = `upi://pay?pa=${recipientUPI}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(upiString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    return {
      success: true,
      qrCode: qrCodeDataURL,
      upiString
    };
  } catch (error) {
    console.error('QR Code generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate UPI Intent URL
export const generateUPIIntent = (amount, recipientUPI, recipientName, transactionNote, transactionId) => {
  try {
    const upiString = `upi://pay?pa=${recipientUPI}&pn=${encodeURIComponent(recipientName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionId}`;
    
    return {
      success: true,
      intentUrl: upiString
    };
  } catch (error) {
    console.error('UPI Intent generation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Validate UPI ID format
export const validateUPIId = (upiId) => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
  return upiRegex.test(upiId);
};

// Get supported payment methods
export const getSupportedPaymentMethods = () => {
  return {
    upi: {
      enabled: true,
      apps: ['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Amazon Pay']
    },
    cards: {
      enabled: true,
      types: ['credit', 'debit']
    },
    netbanking: {
      enabled: true
    },
    wallets: {
      enabled: true,
      providers: ['Paytm', 'PhonePe', 'Amazon Pay', 'Airtel Money']
    }
  };
};

// Calculate processing fee (if applicable)
export const calculateProcessingFee = (amount, paymentMethod) => {
  // Razorpay charges (approximate)
  const fees = {
    upi: 0.02, // 2% for UPI
    card: 0.025, // 2.5% for cards
    netbanking: 0.02, // 2% for net banking
    wallet: 0.02 // 2% for wallets
  };

  const feePercentage = fees[paymentMethod] || 0.02;
  const processingFee = Math.round(amount * feePercentage * 100) / 100;
  
  return {
    originalAmount: amount,
    processingFee,
    totalAmount: amount + processingFee
  };
};

export default razorpay;
