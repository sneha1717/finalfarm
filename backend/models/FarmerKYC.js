import mongoose from 'mongoose';

// Farmer KYC Schema
const farmerKYCSchema = new mongoose.Schema({
  // Personal Information
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/
    },
    state: {
      type: String,
      default: 'Kerala'
    },
    district: {
      type: String,
      required: true
    }
  },

  // Farm Information
  farmInfo: {
    farmSize: {
      type: String,
      required: true
    },
    cropTypes: {
      type: String,
      required: true
    },
    farmLocation: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    }
  },

  // Documents
  documents: {
    aadhar: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    panCard: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    landRecords: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    bankPassbook: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    }
  },

  // KYC Status
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },

  // Verification Details
  verificationDetails: {
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: String,
    rejectionReason: String,
    approvalNotes: String
  },

  // Login Credentials (created after KYC approval)
  loginCredentials: {
    isActive: {
      type: Boolean,
      default: false
    },
    password: String,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
farmerKYCSchema.index({ 'personalInfo.phone': 1 });
farmerKYCSchema.index({ 'personalInfo.email': 1 });
farmerKYCSchema.index({ status: 1 });
farmerKYCSchema.index({ 'verificationDetails.submittedAt': -1 });

// Virtual for display name
farmerKYCSchema.virtual('displayName').get(function() {
  return this.personalInfo.fullName;
});

// Method to check if KYC is complete
farmerKYCSchema.methods.isKYCComplete = function() {
  return this.status === 'approved' && this.loginCredentials.isActive;
};

// Static method to find by phone or email
farmerKYCSchema.statics.findByCredentials = async function(identifier) {
  const farmer = await this.findOne({
    $or: [
      { 'personalInfo.phone': identifier },
      { 'personalInfo.email': identifier }
    ],
    status: 'approved',
    'loginCredentials.isActive': true
  });
  return farmer;
};

export default mongoose.model('FarmerKYC', farmerKYCSchema);
