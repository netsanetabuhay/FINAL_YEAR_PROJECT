import Car from '../models/Car.js';
import User from '../models/User.js';
import { 
  getCarsByUser as getCarsByUserService,
  getCarById as getCarByIdService,
  getAllCars,
  updateCar,
  deleteCar,
  formatCarResponse,
  incrementCarViews
} from '../services/carService.js';
import { validateCreateCar, validateUpdateCar } from '../validations/carValidation.js';

export const createCar = async (req, res) => {
  try {
    const { 
      title, description, price, listing_type,
      location, brand, model, year, mileage,
      fuel_type, transmission, seats, color, images
    } = req.body;
    
    const validation = validateCreateCar(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Car creation failed: ' + validation.errors.join(', ')
      });
    }
    
    const car = await Car.create({
      title,
      description,
      price,
      listing_type,
      user_id: req.user._id,
      location,
      brand,
      model,
      year,
      mileage,
      fuel_type,
      transmission,
      seats,
      color,
      images: images || []
    });

    res.status(201).json({
      message: "Car listing created successfully!",
      car: formatCarResponse(car)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const cars = await getAllCars(filters, page, limit);
    
    res.json({
      message: `Retrieved ${cars.length} cars successfully`,
      count: cars.length,
      cars: cars.map(car => formatCarResponse(car))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await getCarByIdService(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    await incrementCarViews(req.params.id);
    
    res.json({
      message: "Car retrieved successfully",
      car: formatCarResponse(car)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyCars = async (req, res) => {
  try {
    const cars = await getCarsByUserService(req.user._id);
    res.json({
      message: `Retrieved ${cars.length} of your cars successfully`,
      count: cars.length,
      cars: cars.map(car => formatCarResponse(car))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    if (car.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this car' });
    }
    
    const validation = validateUpdateCar(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Update failed: ' + validation.errors.join(', ')
      });
    }
    
    const updateData = { ...req.body, updated_at: Date.now() };
    const updatedCar = await updateCar(req.params.id, updateData);
    
    res.json({
      message: "Car updated successfully!",
      car: formatCarResponse(updatedCar)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    if (car.user_id.toString() !== req.user._id.toString() && !req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Not authorized to delete this car' });
    }
    
    await deleteCar(req.params.id);
    
    res.json({
      message: "Car deleted successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCarsByUser = async (req, res) => {
  try {
    const cars = await getCarsByUserService(req.params.userId);
    res.json({
      message: `Retrieved ${cars.length} cars for user successfully`,
      count: cars.length,
      cars: cars.map(car => formatCarResponse(car))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};