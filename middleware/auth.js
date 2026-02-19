import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../utils/env.js';

export const protect = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password_hash');
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized' });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.roles.includes('admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};