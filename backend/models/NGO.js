import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ngoSchema = new mongoose.Schema({
  // Basic NGO Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [100, 'Organization name cannot exceed 100 characters']
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number']
  },
  
  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  
  // NGO Specific Details
  ngoRegistrationId: {
    type: String,
    required: [true, 'NGO Registration ID is required'],
    unique: true,
    trim: true
  },
  
  details: {
    type: String,
    required: [true, 'NGO details are required'],
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  },
  
  // Photo Upload
  photo: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    }
  },
  
  // Additional Information
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // NGO Categories/Focus Areas
  focusAreas: [{
    type: String,
    enum: [
      'Agriculture',
      'Environment',
      'Education',
      'Health',
      'Rural Development',
      'Women Empowerment',
      'Child Welfare',
      'Disaster Relief',
      'Animal Welfare',
      'Other'
    ]
  }],
  
  // Verification Status
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationDate: {
    type: Date
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Social Media Links
  socialMedia: {
    website: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
ngoSchema.index({ email: 1 });
ngoSchema.index({ ngoRegistrationId: 1 });
ngoSchema.index({ organizationName: 'text', details: 'text' });

// Hash password before saving
ngoSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
ngoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
ngoSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
ngoSchema.methods.getPublicProfile = function() {
  const ngo = this.toObject();
  delete ngo.password;
  return ngo;
};

// Static method to find NGO by email
ngoSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find verified NGOs
ngoSchema.statics.findVerified = function() {
  return this.find({ isVerified: true, isActive: true });
};

const NGO = mongoose.model('NGO', ngoSchema);

export default NGO;
