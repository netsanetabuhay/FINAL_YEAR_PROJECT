import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getProviderDashboard, 
  getTenantDashboard 
} from '../Controllers/userController.js';
import { protect, isProvider, isTenant, isActive } from '../Middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);        
router.post('/login', loginUser);                 

// 🟡 PROTECTED ROUTES (authentication required)
router.use(protect);      
router.use(isActive);     

// Profile route (accessible by both tenant and provider)
router.get('/profile', getUserProfile);

// Provider only route
router.get('/provider-dashboard', isProvider, getProviderDashboard);

// Tenant only route
router.get('/tenant-dashboard', isTenant, getTenantDashboard);

export default router;