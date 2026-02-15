// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next(); // User is authenticated, proceed to the route
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Middleware to check if user is a provider
export const isProvider = (req, res, next) => {
  if (req.user && req.user.role === 'provider') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Provider only.'
    });
  }
};

// Middleware to check if user is a tenant
export const isTenant = (req, res, next) => {
  if (req.user && req.user.role === 'tenant') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Tenant only.'
    });
  }
};

// Middleware to check if user is active
export const isActive = (req, res, next) => {
  if (req.user && req.user.status === 'active') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Your account is not active. Please contact support.'
    });
  }
};