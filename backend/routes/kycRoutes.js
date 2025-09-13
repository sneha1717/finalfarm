import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import FarmerKYC from '../models/FarmerKYC.js';
import NGOKYC from '../models/NGOKYC.js';

const router = express.Router();

// Farmer KYC Registration
router.post('/farmer/register', [
  body('personalInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('personalInfo.phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('personalInfo.email').optional().isEmail().withMessage('Valid email required'),
  body('personalInfo.address').notEmpty().withMessage('Address is required'),
  body('personalInfo.pincode').matches(/^[0-9]{6}$/).withMessage('Valid 6-digit pincode required'),
  body('personalInfo.district').notEmpty().withMessage('District is required'),
  body('farmInfo.farmSize').notEmpty().withMessage('Farm size is required'),
  body('farmInfo.cropTypes').notEmpty().withMessage('Crop types are required'),
  body('farmInfo.farmLocation').notEmpty().withMessage('Farm location is required'),
  body('farmInfo.experience').notEmpty().withMessage('Experience is required')
], async (req, res) => {
  try {
    console.log('Received KYC data:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { personalInfo, farmInfo } = req.body;

    // Check if farmer already exists
    const existingFarmer = await FarmerKYC.findOne({
      $or: [
        { 'personalInfo.phone': personalInfo.phone },
        { 'personalInfo.email': personalInfo.email }
      ]
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this phone number or email already exists'
      });
    }

    // Create new farmer KYC
    const farmerKYC = new FarmerKYC({
      personalInfo,
      farmInfo,
      status: 'pending'
    });

    await farmerKYC.save();

    res.status(201).json({
      success: true,
      message: 'Farmer KYC application submitted successfully',
      data: {
        id: farmerKYC._id,
        name: farmerKYC.personalInfo.fullName,
        phone: farmerKYC.personalInfo.phone,
        status: farmerKYC.status,
        submittedAt: farmerKYC.verificationDetails.submittedAt
      }
    });

  } catch (error) {
    console.error('Farmer KYC registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// NGO KYC Registration
router.post('/ngo/register', [
  body('organizationInfo.ngoName').notEmpty().withMessage('NGO name is required'),
  body('organizationInfo.registrationNumber').notEmpty().withMessage('Registration number is required'),
  body('organizationInfo.establishedYear').notEmpty().withMessage('Established year is required'),
  body('organizationInfo.phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number required'),
  body('organizationInfo.email').isEmail().withMessage('Valid email required'),
  body('organizationInfo.address').notEmpty().withMessage('Address is required'),
  body('organizationInfo.pincode').matches(/^[0-9]{6}$/).withMessage('Valid 6-digit pincode required'),
  body('organizationInfo.district').notEmpty().withMessage('District is required'),
  body('focusAreas.primaryFocus').notEmpty().withMessage('Primary focus is required'),
  body('focusAreas.targetBeneficiaries').notEmpty().withMessage('Target beneficiaries are required'),
  body('focusAreas.geographicalArea').notEmpty().withMessage('Geographical area is required'),
  body('focusAreas.experience').notEmpty().withMessage('Experience is required'),
  body('focusAreas.currentProjects').notEmpty().withMessage('Current projects are required'),
  body('legalInfo.registrationType').notEmpty().withMessage('Registration type is required'),
  body('legalInfo.panNumber').notEmpty().withMessage('PAN number is required'),
  body('legalInfo.trusteeDetails').notEmpty().withMessage('Trustee details are required')
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

    const { organizationInfo, focusAreas, legalInfo } = req.body;

    // Check if NGO already exists
    const existingNGO = await NGOKYC.findOne({
      $or: [
        { 'organizationInfo.phone': organizationInfo.phone },
        { 'organizationInfo.email': organizationInfo.email },
        { 'organizationInfo.registrationNumber': organizationInfo.registrationNumber }
      ]
    });

    if (existingNGO) {
      return res.status(400).json({
        success: false,
        message: 'NGO with this phone, email, or registration number already exists'
      });
    }

    // Create new NGO KYC
    const ngoKYC = new NGOKYC({
      organizationInfo,
      focusAreas,
      legalInfo,
      status: 'pending'
    });

    await ngoKYC.save();

    res.status(201).json({
      success: true,
      message: 'NGO KYC application submitted successfully',
      data: {
        id: ngoKYC._id,
        name: ngoKYC.organizationInfo.ngoName,
        email: ngoKYC.organizationInfo.email,
        phone: ngoKYC.organizationInfo.phone,
        status: ngoKYC.status,
        submittedAt: ngoKYC.verificationDetails.submittedAt
      }
    });

  } catch (error) {
    console.error('NGO KYC registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Login endpoint for both farmers and NGOs
router.post('/login', [
  body('identifier').notEmpty().withMessage('Phone number or email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { identifier, password } = req.body;

    // Try to find farmer first
    let user = await FarmerKYC.findByCredentials(identifier);
    let userType = 'farmer';

    // If not found in farmers, try NGOs
    if (!user) {
      user = await NGOKYC.findByCredentials(identifier);
      userType = 'ngo';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account not approved'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.loginCredentials.password);
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginCredentials.loginAttempts += 1;
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts and update last login
    user.loginCredentials.loginAttempts = 0;
    user.loginCredentials.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.displayName,
        email: userType === 'farmer' ? user.personalInfo.email : user.organizationInfo.email,
        phone: userType === 'farmer' ? user.personalInfo.phone : user.organizationInfo.phone,
        type: userType,
        status: user.status,
        lastLogin: user.loginCredentials.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
});

// Get KYC status
router.get('/status/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    let kyc;
    if (type === 'farmer') {
      kyc = await FarmerKYC.findById(id);
    } else if (type === 'ngo') {
      kyc = await NGOKYC.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be farmer or ngo'
      });
    }

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: kyc._id,
        status: kyc.status,
        submittedAt: kyc.verificationDetails.submittedAt,
        reviewedAt: kyc.verificationDetails.reviewedAt,
        rejectionReason: kyc.verificationDetails.rejectionReason
      }
    });

  } catch (error) {
    console.error('Get KYC status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
