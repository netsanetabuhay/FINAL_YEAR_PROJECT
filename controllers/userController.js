import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import generateToken from '../utils/tokenGenerator.js'


export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Check for incomplete data
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: 'Registration failed: Please fill in all required fields (name, email, phone, and password)' 
      });
    }
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ 
      message: 'Registration failed: A user with this email already exists. Please use a different email or try logging in.' 
    });

    const user = await User.create({name, email, phone, password_hash: password,roles: ['user']  });

    res.status(201).json({
      message: "Congratulations! You have successfully registered. Welcome aboard!", 
      user
      
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for incomplete data
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Login failed: Please enter both email and password to continue.' 
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ 
      message: 'Login failed: We couldn\'t find an account with this email address. Please check your email or register for a new account.' 
    });

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(401).json({ 
      message: 'Login failed: The password you entered is incorrect. Please try again or click "Forgot Password" to reset it.' 
    });
     
    const token = generateToken(user._id);

    res.json({ 
      message: "Great to see you again! You have successfully logged in.",
      id: user._id, name: user.name, email: user.email,
      phone: user.phone, roles: user.roles,
    
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.password) user.password_hash = req.body.password;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id, name: updatedUser.name,
        email: updatedUser.email, phone: updatedUser.phone,
        roles: updatedUser.roles, token: generateToken(updatedUser._id)
      });
    } else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  res.json({ message: 'You have been successfully logged out. See you again soon!' });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};