import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import generateToken from '../utils/tokenGenerator.js'


export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

 const user = await User.create({name, email, phone, password_hash: password,roles: ['user']  });

    res.status(201).json({
     message: "registerd successfuly", user
      
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(401).json({ message: 'please enter correct password' });
     
    const   token = generateToken(user._id);

    res.json({ message: "login successfuly",
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
  res.json({ message: 'Logged out successfully' });
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password_hash');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};