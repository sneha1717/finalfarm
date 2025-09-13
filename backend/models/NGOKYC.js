import mongoose from 'mongoose';

// NGO KYC Schema
const ngoKYCSchema = new mongoose.Schema({
  // Organization Information
  organizationInfo: {
    ngoName: {
      type: String,
      required: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    establishedYear: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    website: String,
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

  // Focus Areas
  focusAreas: {
    primaryFocus: {
      type: String,
      required: true
    },
    targetBeneficiaries: {
      type: String,
      required: true
    },
    geographicalArea: {
      type: String,
      required: true
    },
    experience: {
      type: String,
      required: true
    },
    currentProjects: {
      type: String,
      required: true
    }
  },

  // Legal Information
  legalInfo: {
    registrationType: {
      type: String,
      required: true,
      enum: ['Trust', 'Society', 'Section 8 Company', 'Cooperative Society', 'Other']
    },
    fcraNumber: String,
    panNumber: {
      type: String,
      required: true
    },
    gstNumber: String,
    trusteeDetails: {
      type: String,
      required: true
    }
  },

  // Documents
  documents: {
    registrationCertificate: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    panCard: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    fcraRegistration: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    auditedFinancials: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    trustDeed: {
      filename: String,
      path: String,
      uploaded: { type: Boolean, default: false }
    },
    projectReports: {
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
ngoKYCSchema.index({ 'organizationInfo.phone': 1 });
ngoKYCSchema.index({ 'organizationInfo.email': 1 });
ngoKYCSchema.index({ 'organizationInfo.registrationNumber': 1 });
ngoKYCSchema.index({ status: 1 });
ngoKYCSchema.index({ 'verificationDetails.submittedAt': -1 });

// Virtual for display name
ngoKYCSchema.virtual('displayName').get(function() {
  return this.organizationInfo.ngoName;
});

// Method to check if KYC is complete
ngoKYCSchema.methods.isKYCComplete = function() {
  return this.status === 'approved' && this.loginCredentials.isActive;
};

// Static method to find by phone or email
ngoKYCSchema.statics.findByCredentials = async function(identifier) {
  const ngo = await this.findOne({
    $or: [
      { 'organizationInfo.phone': identifier },
      { 'organizationInfo.email': identifier }
    ],
    status: 'approved',
    'loginCredentials.isActive': true
  });
  return ngo;
};

export default mongoose.model('NGOKYC', ngoKYCSchema);
