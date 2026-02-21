import express from 'express';
import { 
  createCar,
  getCars,
  getCarById,
  getMyCars,
  updateCarById,
  deleteCarById,
  getCarsByUser
} from '../controllers/carController.js';
import { protect, admin, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create car - only service providers and admin
router.post('/', authorize('service_provider', 'admin'), createCar);

// Get all cars - any authenticated user
router.get('/', getCars);

// Get current user's cars - any authenticated user
router.get('/my-cars', getMyCars);

// Get cars by specific user - any authenticated user
router.get('/user/:userId', getCarsByUser);

// Get single car by ID - any authenticated user
router.get('/:id', getCarById);

// Update car - owner or admin
router.put('/:id', updateCarById);

// Delete car - owner or admin
router.delete('/:id', deleteCarById);

export default router;