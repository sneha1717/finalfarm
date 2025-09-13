import jwt from 'jsonwebtoken';
import NGO from '../models/NGO.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token is required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the NGO
    const ngo = await NGO.findById(decoded.id).select('-password');
    
    if (!ngo) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token - NGO not found' 
      });
    }

    if (!ngo.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    // Add NGO to request object
    req.ngo = ngo;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error during authentication' 
      });
    }
  }
};

// Middleware to check if NGO is verified
export const requireVerification = (req, res, next) => {
  if (!req.ngo.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'NGO verification required for this action'
    });
  }
  next();
};

// Generate JWT token
export const generateToken = (ngoId) => {
  return jwt.sign(
    { id: ngoId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};
