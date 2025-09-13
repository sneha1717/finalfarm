import QRCode from 'qrcode';
import crypto from 'crypto';

// Direct UPI Payment Integration (No Gateway Required)
export class DirectUPIPayment {
  constructor(merchantVPA, merchantName) {
    this.merchantVPA = merchantVPA; // Your UPI ID (e.g., farmvilla@paytm)
    this.merchantName = merchantName;
  }

  // Generate UPI Payment URL
  generateUPIURL(amount, transactionId, note = '') {
    const upiParams = new URLSearchParams({
      pa: this.merchantVPA,           // Payee Address (UPI ID)
      pn: this.merchantName,          // Payee Name
      am: amount.toString(),          // Amount
      cu: 'INR',                     // Currency
      tn: note || `Donation to ${this.merchantName}`, // Transaction Note
      tr: transactionId,             // Transaction Reference
      mc: '5411',                    // Merchant Category Code (NGO)
      mode: '02',                    // Transaction Mode
      purpose: '00'                  // Purpose Code
    });

    return `upi://pay?${upiParams.toString()}`;
  }

  // Generate UPI QR Code
  async generateUPIQRCode(amount, transactionId, note = '') {
    try {
      const upiURL = this.generateUPIURL(amount, transactionId, note);
      
      const qrCodeDataURL = await QRCode.toDataURL(upiURL, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      });

      return {
        success: true,
        qrCode: qrCodeDataURL,
        upiURL,
        paymentDetails: {
          merchantVPA: this.merchantVPA,
          merchantName: this.merchantName,
          amount,
          transactionId,
          note
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate payment intent for different UPI apps
  generateAppIntents(amount, transactionId, note = '') {
    const baseURL = this.generateUPIURL(amount, transactionId, note);
    
    return {
      // Google Pay
      googlePay: `tez://upi/pay?${baseURL.split('?')[1]}`,
      
      // PhonePe
      phonePe: `phonepe://pay?${baseURL.split('?')[1]}`,
      
      // Paytm
      paytm: `paytmmp://pay?${baseURL.split('?')[1]}`,
      
      // BHIM
      bhim: `bhim://pay?${baseURL.split('?')[1]}`,
      
      // Amazon Pay
      amazonPay: `amazonpay://pay?${baseURL.split('?')[1]}`,
      
      // Generic UPI
      generic: baseURL
    };
  }

  // Create payment request
  createPaymentRequest(donorDetails, amount, purpose = 'donation') {
    const transactionId = `TXN-AGRI-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    return {
      transactionId,
      amount,
      merchantVPA: this.merchantVPA,
      merchantName: this.merchantName,
      donorDetails,
      purpose,
      createdAt: new Date(),
      status: 'pending',
      paymentMethod: 'UPI_DIRECT'
    };
  }
}

// Bank Transfer Integration
export class BankTransferPayment {
  constructor(bankDetails) {
    this.bankDetails = bankDetails;
  }

  generateBankTransferDetails(amount, transactionId) {
    return {
      accountName: 'FarmVilla Foundation',
      accountNumber: '50200012345678',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branch: 'Agricultural Development Branch',
      amount: amount,
      transactionId: transactionId,
      instructions: [
        `Transfer ₹${amount} to the above account`,
        `Use transaction ID: ${transactionId} as reference`,
        'Add "FarmVilla Donation" in remarks',
        'Send screenshot to support@farmvilla.org',
        'Payment verified within 2-4 hours'
      ]
    };
  }
}

// Cryptocurrency Payment (Optional)
export class CryptoPayment {
  constructor(walletAddresses) {
    this.walletAddresses = walletAddresses;
  }

  generateCryptoPayment(amount, currency = 'USDT') {
    const transactionId = `CRYPTO-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    return {
      transactionId,
      amount,
      currency,
      walletAddress: this.walletAddresses[currency],
      qrCode: `${currency}:${this.walletAddresses[currency]}?amount=${amount}`,
      instructions: [
        `Send ${amount} ${currency} to the above address`,
        `Use transaction ID: ${transactionId} as memo/note`,
        `Confirmation required: 3 blocks`,
        `Payment verified automatically via blockchain`
      ]
    };
  }
}

export default {
  DirectUPIPayment,
  BankTransferPayment,
  CryptoPayment
};
