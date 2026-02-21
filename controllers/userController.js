import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';
import generateToken, { setTokenCookie, clearTokenCookie } from '../utils/tokenGenerator.js';
import { 
  hashPassword, 
  comparePassword, 
  checkUserExistsByEmail, 
  checkUsernameExists,
  getUserById, 
  getAllUsers, 
  updateUser, 
  formatUserResponse 
} from '../services/userService.js';
import { validateRegister, validateLogin, validateProfileUpdate } from '../validations/userValidation.js';

export const registerUser = async (req, res) => {
  try {
    const { username, firstname, lastname, email, phone, password } = req.body;
    
    const validation = validateRegister(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Registration failed: ' + validation.errors.join(', ')
      });
    }
    
    const emailExists = await checkUserExistsByEmail(email);
    if (emailExists) {
      return res.status(400).json({ 
        message: 'Registration failed: A user with this email already exists.' 
      });
    }

    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      return res.status(400).json({ 
        message: 'Registration failed: Username already taken.' 
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      username,
      firstname,
      lastname,
      email, 
      phone, 
      password_hash: hashedPassword, 
      roles: [validation.role]
    });

    res.status(201).json({
      message: "Congratulations! You have successfully registered. Welcome aboard! Please login to continue.",
      user: formatUserResponse(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const validation = validateLogin(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Login failed: ' + validation.errors.join(', ')
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Login failed: Invalid email or password.' 
      });
    }

    const isPasswordMatch = await comparePassword(password, user.password_hash);
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        message: 'Login failed: Invalid email or password.' 
      });
    }
     
    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({ 
      message: "Great to see you again! You have successfully logged in.",
      ...formatUserResponse(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user._id);
    res.json({
      message: `Welcome to your profile, ${user.firstname || user.username}!`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const validation = validateProfileUpdate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Update failed: ' + validation.errors.join(', ')
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updateData = {};
    if (req.body.firstname !== undefined) updateData.firstname = req.body.firstname;
    if (req.body.lastname !== undefined) updateData.lastname = req.body.lastname;
    if (req.body.phone !== undefined) updateData.phone = req.body.phone;
    if (req.body.password) {
      updateData.password_hash = await hashPassword(req.body.password);
    }

    const updatedUser = await updateUser(req.user._id, updateData);
    
    const token = generateToken(updatedUser._id);
    setTokenCookie(res, token);

    res.json({
      message: "Your profile has been successfully updated!",
      ...formatUserResponse(updatedUser)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  clearTokenCookie(res);
  res.json({ message: 'You have been successfully logged out. See you again soon!' });
};

export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({
      message: `Retrieved ${users.length} users successfully`,
      count: users.length,
      users: users.map(user => formatUserResponse(user))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};