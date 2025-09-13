import express from 'express';
import { body, validationResult } from 'express-validator';
import NGO from '../models/NGO.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { uploadPhoto, handleUploadError, uploadBase64ToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// Validation rules for NGO registration
const registerValidation = [
  body('organizationName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Organization name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('mobile')
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit mobile number'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('ngoRegistrationId')
    .trim()
    .isLength({ min: 5 })
    .withMessage('NGO Registration ID must be at least 5 characters long'),
  
  body('details')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Details must be between 10 and 1000 characters'),
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// @route   POST /api/auth/register
// @desc    Register a new NGO
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      organizationName,
      email,
      mobile,
      password,
      ngoRegistrationId,
      details,
      address,
      focusAreas,
      socialMedia,
      photo // base64 string
    } = req.body;

    // Check if NGO already exists
    const existingNGO = await NGO.findOne({
      $or: [
        { email: email.toLowerCase() },
        { ngoRegistrationId }
      ]
    });

    if (existingNGO) {
      return res.status(400).json({
        success: false,
        message: 'NGO with this email or registration ID already exists'
      });
    }

    // Handle photo upload if provided
    let photoData = {};
    if (photo && photo.startsWith('data:image/')) {
      try {
        const uploadResult = await uploadBase64ToCloudinary(photo);
        photoData = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
      } catch (error) {
        console.error('Photo upload error:', error);
        // Continue without photo if upload fails
      }
    }

    // Create new NGO
    const ngo = new NGO({
      organizationName,
      email: email.toLowerCase(),
      mobile,
      password,
      ngoRegistrationId,
      details,
      address,
      focusAreas,
      socialMedia,
      photo: photoData
    });

    await ngo.save();

    // Generate JWT token
    const token = generateToken(ngo._id);

    // Return success response (without password)
    const ngoProfile = ngo.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'NGO registered successfully',
      data: {
        ngo: ngoProfile,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login NGO
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find NGO by email
    const ngo = await NGO.findByEmail(email);
    if (!ngo) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!ngo.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await ngo.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    ngo.lastLogin = new Date();
    await ngo.save();

    // Generate JWT token
    const token = generateToken(ngo._id);

    // Return success response
    const ngoProfile = ngo.getPublicProfile();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        ngo: ngoProfile,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/profile
// @desc    Get current NGO profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        ngo: req.ngo
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update NGO profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const {
      organizationName,
      mobile,
      details,
      address,
      focusAreas,
      socialMedia,
      photo
    } = req.body;

    const ngo = await NGO.findById(req.ngo._id);
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    // Update fields
    if (organizationName) ngo.organizationName = organizationName;
    if (mobile) ngo.mobile = mobile;
    if (details) ngo.details = details;
    if (address) ngo.address = { ...ngo.address, ...address };
    if (focusAreas) ngo.focusAreas = focusAreas;
    if (socialMedia) ngo.socialMedia = { ...ngo.socialMedia, ...socialMedia };

    // Handle photo update
    if (photo && photo.startsWith('data:image/')) {
      try {
        // Delete old photo if exists
        if (ngo.photo.publicId) {
          await deleteFromCloudinary(ngo.photo.publicId);
        }
        
        // Upload new photo
        const uploadResult = await uploadBase64ToCloudinary(photo);
        ngo.photo = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
      } catch (error) {
        console.error('Photo update error:', error);
      }
    }

    await ngo.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ngo: ngo.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout NGO (client-side token removal)
// @access  Private
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
