import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../utils/env.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select('-password_hash');
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.roles.includes('admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};