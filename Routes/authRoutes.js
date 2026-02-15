// routes/userRoutes.js
import express from 'express';
import { protect, isProvider, isTenant, isActive } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, isActive, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Provider only route
// @route   GET /api/users/provider-dashboard
// @access  Private (Provider only)
router.get('/provider-dashboard', protect, isActive, isProvider, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Welcome to provider dashboard',
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
        providerDetails: req.user.providerDetails
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Tenant only route
// @route   GET /api/users/tenant-dashboard
// @access  Private (Tenant only)
router.get('/tenant-dashboard', protect, isActive, isTenant, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Welcome to tenant dashboard',
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        role: req.user.role,
        tenantDetails: req.user.tenantDetails
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

export default router;