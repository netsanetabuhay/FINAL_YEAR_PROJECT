import express from 'express';
import { 
  registerUser, loginUser, getUserProfile, 
  updateUserProfile, logoutUser, getUsers 
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);

export default router;