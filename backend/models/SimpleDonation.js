import mongoose from 'mongoose';

// Simple Donation Schema for Direct Payments
const simpleDonationSchema = new mongoose.Schema({
  // Transaction Details
  transactionId: {
    type: String,
    required: true,
    unique: true,
    default: () => `TXN-AGRI-${Date.now()}-${Math.floor(100000 + Math.random() * 900000)}`
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
  
  // Donor Information
  donor: {
    name: {
      type: String,
      default: 'Anonymous'
    },
    email: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  },
  
  // Recipient Information
  recipient: {
    type: String, // Simple string ID for testing
    required: true
  },
  
  recipientType: {
    type: String,
    enum: ['NGO', 'Farmer', 'Project'],
    default: 'Project'
  },
  
  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['UPI_DIRECT', 'BANK_TRANSFER', 'CRYPTO_USDT', 'CRYPTO_BTC', 'CRYPTO_ETH'],
    required: true
  },
  
  upiDetails: {
    vpa: {
      type: String,
      default: null
    },
    qrCodeUrl: String
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'pending_verification'],
    default: 'pending'
  },
  
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    source: {
      type: String,
      default: 'direct_payment'
    },
    paymentProof: String,
    adminNotes: String,
    verifiedBy: String
  },
  
  // Receipt Information
  receiptUrl: String,
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  // Notification Status
  notificationsSent: {
    donor: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    recipient: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
simpleDonationSchema.index({ transactionId: 1 });
simpleDonationSchema.index({ recipient: 1 });
simpleDonationSchema.index({ status: 1 });
simpleDonationSchema.index({ createdAt: -1 });

// Virtual for formatted amount
simpleDonationSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount}`;
});

// Virtual for donor display name
simpleDonationSchema.virtual('donorDisplayName').get(function() {
  return this.donor.isAnonymous ? 'Anonymous' : this.donor.name;
});

// Method to mask sensitive data for public display
simpleDonationSchema.methods.toPublicJSON = function() {
  const obj = this.toObject();
  
  // Mask email and phone for privacy
  if (obj.donor.email) {
    const email = obj.donor.email;
    const [username, domain] = email.split('@');
    obj.donor.email = username.substring(0, 2) + '***@' + domain;
  }
  
  if (obj.donor.phone) {
    const phone = obj.donor.phone;
    obj.donor.phone = phone.substring(0, 2) + '****' + phone.substring(phone.length - 2);
  }
  
  // Remove sensitive metadata
  delete obj.metadata.userAgent;
  delete obj.metadata.ipAddress;
  
  return obj;
};

// Static method to get donation statistics
simpleDonationSchema.statics.getStats = async function(recipientId) {
  const stats = await this.aggregate([
    { $match: { recipient: recipientId } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const result = {
    totalDonations: 0,
    totalAmount: 0,
    completedDonations: 0,
    completedAmount: 0,
    pendingDonations: 0,
    pendingAmount: 0
  };

  stats.forEach(stat => {
    result.totalDonations += stat.count;
    result.totalAmount += stat.totalAmount;

    if (stat._id === 'completed') {
      result.completedDonations = stat.count;
      result.completedAmount = stat.totalAmount;
    } else if (stat._id === 'pending' || stat._id === 'pending_verification') {
      result.pendingDonations += stat.count;
      result.pendingAmount += stat.totalAmount;
    }
  });

  return result;
};

// Instance method for public JSON (hiding sensitive data)
simpleDonationSchema.methods.toPublicJSON = function() {
  return {
    _id: this._id,
    transactionId: this.transactionId,
    amount: this.amount,
    currency: this.currency,
    donor: {
      name: this.donor.isAnonymous ? 'Anonymous' : this.donor.name,
      isAnonymous: this.donor.isAnonymous
    },
    paymentMethod: this.paymentMethod,
    status: this.status,
    createdAt: this.createdAt,
    completedAt: this.completedAt
  };
};

// Export the model
export default mongoose.model('SimpleDonation', simpleDonationSchema);
