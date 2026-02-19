import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getUsers,
  deleteUser,
  getUserById
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes (any logged in user)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin only routes
router.get('/users', protect, admin, getUsers);
router.get('/users/:id', protect, admin, getUserById);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;