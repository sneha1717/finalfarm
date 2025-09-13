import express from 'express';
import { body, validationResult } from 'express-validator';
import NGO from '../models/NGO.js';
import { authenticateToken, requireVerification } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/ngo/all
// @desc    Get all verified NGOs (public)
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 10, focusArea, search } = req.query;
    
    // Build query
    let query = { isVerified: true, isActive: true };
    
    if (focusArea) {
      query.focusAreas = { $in: [focusArea] };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const ngos = await NGO.find(query)
      .select('-password -email -mobile -ngoRegistrationId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await NGO.countDocuments(query);

    res.json({
      success: true,
      data: {
        ngos,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Fetch NGOs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching NGOs'
    });
  }
});

// @route   GET /api/ngo/:id
// @desc    Get single NGO details (public)
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id)
      .select('-password -email -mobile -ngoRegistrationId');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    if (!ngo.isVerified || !ngo.isActive) {
      return res.status(404).json({
        success: false,
        message: 'NGO not available'
      });
    }

    res.json({
      success: true,
      data: { ngo }
    });

  } catch (error) {
    console.error('Fetch NGO error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching NGO'
    });
  }
});

// @route   GET /api/ngo/dashboard/stats
// @desc    Get NGO dashboard statistics
// @access  Private
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const ngoId = req.ngo._id;
    
    // You can expand this with more statistics as needed
    const stats = {
      profileViews: 0, // Implement view tracking
      isVerified: req.ngo.isVerified,
      memberSince: req.ngo.createdAt,
      lastLogin: req.ngo.lastLogin,
      focusAreas: req.ngo.focusAreas.length
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats'
    });
  }
});

// @route   POST /api/ngo/request-verification
// @desc    Request NGO verification
// @access  Private
router.post('/request-verification', authenticateToken, async (req, res) => {
  try {
    const ngo = await NGO.findById(req.ngo._id);
    
    if (ngo.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'NGO is already verified'
      });
    }

    // In a real application, you would create a verification request
    // For now, we'll just send a success message
    res.json({
      success: true,
      message: 'Verification request submitted successfully. Our team will review your application.'
    });

  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting verification request'
    });
  }
});

// @route   GET /api/ngo/focus-areas
// @desc    Get all available focus areas
// @access  Public
router.get('/meta/focus-areas', (req, res) => {
  const focusAreas = [
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
  ];

  res.json({
    success: true,
    data: { focusAreas }
  });
});

export default router;
