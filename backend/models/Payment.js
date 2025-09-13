import mongoose from 'mongoose';
import crypto from 'crypto';

// Donation Schema
const donationSchema = new mongoose.Schema({
  // Transaction Details
  transactionId: {
    type: String,
    required: true,
    unique: true,
    default: () => `TXN-AGRI-${Math.floor(100000 + Math.random() * 900000)}`
  },
  
  razorpayOrderId: {
    type: String,
    required: true
  },
  
  razorpayPaymentId: {
    type: String,
    sparse: true // Allow null for pending payments
  },
  
  razorpaySignature: {
    type: String,
    sparse: true
  },
  
  // Amount Details
  amount: {
    type: Number,
    required: true,
    min: [1, 'Amount must be at least ₹1']
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Donor Information (Encrypted)
  donor: {
    name: {
      type: String,
      default: 'Anonymous'
    },
    email: {
      type: String,
      set: function(email) {
        return email ? this.encrypt(email) : null;
      },
      get: function(encryptedEmail) {
        return encryptedEmail ? this.decrypt(encryptedEmail) : null;
      }
    },
    phone: {
      type: String,
      set: function(phone) {
        return phone ? this.encrypt(phone) : null;
      },
      get: function(encryptedPhone) {
        return encryptedPhone ? this.decrypt(encryptedPhone) : null;
      }
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  
  // Recipient Information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NGO',
    required: true
  },
  
  recipientType: {
    type: String,
    enum: ['NGO', 'Farmer'],
    default: 'NGO'
  },
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['UPI', 'Card', 'NetBanking', 'Wallet'],
    required: true
  },
  
  upiDetails: {
    vpa: {
      type: String,
      set: function(vpa) {
        return vpa ? this.encrypt(vpa) : null;
      },
      get: function(encryptedVpa) {
        return encryptedVpa ? this.decrypt(encryptedVpa) : null;
      }
    },
    qrCodeUrl: String
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Recurring Donation
  isRecurring: {
    type: Boolean,
    default: false
  },
  
  recurringFrequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: function() {
      return this.isRecurring;
    }
  },
  
  nextPaymentDate: {
    type: Date,
    required: function() {
      return this.isRecurring;
    }
  },
  
  // Receipt Information
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  
  receiptUrl: String,
  
  // Notification Status
  notifications: {
    emailSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    },
    whatsappSent: {
      type: Boolean,
      default: false
    }
  },
  
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: {
      type: String,
      set: function(ip) {
        return ip ? this.encrypt(ip) : null;
      },
      get: function(encryptedIp) {
        return encryptedIp ? this.decrypt(encryptedIp) : null;
      }
    },
    source: {
      type: String,
      default: 'web'
    }
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: Date,
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Encryption/Decryption methods
donationSchema.methods.encrypt = function(text) {
  if (!text) return null;
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.PAYMENT_ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, key);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

donationSchema.methods.decrypt = function(encryptedData) {
  if (!encryptedData || typeof encryptedData !== 'object') return null;
  
  try {
    const algorithm = 'aes-256-gcm';
    const key = Buffer.from(process.env.PAYMENT_ENCRYPTION_KEY, 'hex');
    const decipher = crypto.createDecipher(algorithm, key);
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Indexes for better performance
donationSchema.index({ transactionId: 1 });
donationSchema.index({ razorpayOrderId: 1 });
donationSchema.index({ razorpayPaymentId: 1 });
donationSchema.index({ recipient: 1, status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ nextPaymentDate: 1 }, { sparse: true });

// Pre-save middleware
donationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Static methods
donationSchema.statics.findByTransactionId = function(transactionId) {
  return this.findOne({ transactionId });
};

donationSchema.statics.findByRecipient = function(recipientId, status = null) {
  const query = { recipient: recipientId };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

donationSchema.statics.getPendingRecurringPayments = function() {
  return this.find({
    isRecurring: true,
    status: 'completed',
    nextPaymentDate: { $lte: new Date() }
  });
};

// Instance methods
donationSchema.methods.getPublicInfo = function() {
  return {
    transactionId: this.transactionId,
    amount: this.amount,
    currency: this.currency,
    donorName: this.donor.isAnonymous ? 'Anonymous' : this.donor.name,
    status: this.status,
    createdAt: this.createdAt,
    completedAt: this.completedAt,
    isRecurring: this.isRecurring,
    recurringFrequency: this.recurringFrequency
  };
};

donationSchema.methods.maskSensitiveData = function() {
  const donation = this.toObject();
  
  // Mask email
  if (donation.donor.email) {
    const email = donation.donor.email;
    const [username, domain] = email.split('@');
    donation.donor.email = `${username.substring(0, 2)}***@${domain}`;
  }
  
  // Mask phone
  if (donation.donor.phone) {
    const phone = donation.donor.phone;
    donation.donor.phone = `***${phone.slice(-4)}`;
  }
  
  // Remove sensitive fields
  delete donation.donor.email;
  delete donation.donor.phone;
  delete donation.metadata.ipAddress;
  delete donation.razorpaySignature;
  
  return donation;
};

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
