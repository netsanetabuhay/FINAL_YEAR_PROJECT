import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import env from '../utils/env.js';

export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password_hash');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized: User not found' });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized: Invalid token' });
    }
  }
  
  // Check cookies if no header token (if you're using cookies)
  if (req.cookies && req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, env.jwtSecret);
      req.user = await User.findById(decoded.id).select('-password_hash');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized: User not found' });
      }
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized: Invalid token' });
    }
  }

  // No token found in either place
  return res.status(401).json({ message: 'Not authorized: No token provided' });
};

export const admin = (req, res, next) => {
  if (req.user && req.user.roles && req.user.roles.includes('admin')) {
    return next();
  } else {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }
};