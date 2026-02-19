import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import env from '../utils/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpire });
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

// REGISTER - with success message
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone: phone || '',
      password_hash: hashedPassword,
      roles: ['user']
    });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: ' Registration successful! Welcome to our platform.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message 
    });
  }
};

// LOGIN - with success message
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email (exact match first)
    let user = await User.findOne({ email });
    
    // If not found, try replacing gmail.com with email.com and vice versa
    if (!user) {
      if (email.includes('gmail.com')) {
        const alternativeEmail = email.replace('gmail.com', 'email.com');
        user = await User.findOne({ email: alternativeEmail });
      } else if (email.includes('email.com')) {
        const alternativeEmail = email.replace('email.com', 'gmail.com');
        user = await User.findOne({ email: alternativeEmail });
      }
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: ' No account found with this email. Please register first.' 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Incorrect password. Please try again.' 
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message 
    });
  }
};

// LOGOUT - with success message
export const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.json({ 
    success: true,
    message: ' Logged out successfully. See you again!' 
  });
};

// GET USER PROFILE - with success message
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash');
    
    res.json({
      success: true,
      message: ' Profile retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message 
    });
  }
};

// UPDATE USER PROFILE - with success message
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: ' User not found' 
      });
    }
    
    // Track what was updated
    const updates = [];
    
    if (req.body.name && req.body.name !== user.name) {
      user.name = req.body.name;
      updates.push('name');
    }
    
    if (req.body.phone && req.body.phone !== user.phone) {
      user.phone = req.body.phone;
      updates.push('phone');
    }
    
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(req.body.password, salt);
      updates.push('password');
    }
    
    user.updated_at = Date.now();
    const updatedUser = await user.save();
    
    const token = generateToken(updatedUser._id);
    setTokenCookie(res, token);

    let updateMessage = 'Profile updated successfully';
    if (updates.length > 0) {
      updateMessage += ` (${updates.join(', ')} updated)`;
    } else {
      updateMessage = 'ℹNo changes were made to your profile';
    }

    res.json({
      success: true,
      message: updateMessage,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        roles: updatedUser.roles
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update profile',
      error: error.message 
    });
  }
};

// GET ALL USERS (Admin only) - with success message
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password_hash');
    
    res.json({
      success: true,
      message: `Retrieved ${users.length} user(s) successfully`,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve users',
      error: error.message 
    });
  }
};

// DELETE USER (Admin only) - with success message
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: ' User not found' 
      });
    }

    // Don't allow admin to delete themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: ' You cannot delete your own account'
      });
    }
    
    const userName = user.name;
    await user.deleteOne();
    
    res.json({
      success: true,
      message: ` User "${userName}" has been deleted successfully`
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: ' Failed to delete user',
      error: error.message 
    });
  }
};

// GET USER BY ID (Admin only) - with success message
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password_hash');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: ' User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve user',
      error: error.message 
    });
  }
};