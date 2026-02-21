import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Hash password
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Check if user exists by email
export const checkUserExistsByEmail = async (email) => {
  return await User.findOne({ email });
};

// Check if username exists
export const checkUsernameExists = async (username) => {
  return await User.findOne({ username });
};

// Get user by ID (without password)
export const getUserById = async (id) => {
  return await User.findById(id).select('-password_hash');
};

// Get user by username
export const getUserByUsername = async (username) => {
  return await User.findOne({ username }).select('-password_hash');
};

// Get user by email
export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select('-password_hash');
};

// Get all users (without passwords)
export const getAllUsers = async () => {
  return await User.find({}).select('-password_hash');
};

// Update user profile
export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(
    id, 
    { ...updateData, updated_at: Date.now() },
    { new: true, runValidators: true }
  ).select('-password_hash');
};

// Delete user
export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

// Format user response
export const formatUserResponse = (user) => {
  return {
    _id: user._id,
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    roles: user.roles,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
};