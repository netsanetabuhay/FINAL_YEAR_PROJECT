import Car from '../models/Car.js';

// Get all cars with filters
export const getAllCars = async (filters = {}, page = 1, limit = 10) => {
  const query = {};
  
  // Apply filters
  if (filters.listing_type) query.listing_type = filters.listing_type;
  if (filters.status) query.status = filters.status;
  if (filters.brand) query.brand = filters.brand;
  if (filters.fuel_type) query.fuel_type = filters.fuel_type;
  if (filters.transmission) query.transmission = filters.transmission;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  if (filters.minYear || filters.maxYear) {
    query.year = {};
    if (filters.minYear) query.year.$gte = filters.minYear;
    if (filters.maxYear) query.year.$lte = filters.maxYear;
  }
  
  const skip = (page - 1) * limit;
  
  return await Car.find(query)
    .populate('user_id', 'username firstname lastname email phone')
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);
};

// Get car by ID
export const getCarById = async (id) => {
  return await Car.findById(id).populate('user_id', 'username firstname lastname email phone');
};

// Get cars by user ID
export const getCarsByUser = async (userId) => {
  return await Car.find({ user_id: userId })
    .populate('user_id', 'username firstname lastname email phone')
    .sort({ created_at: -1 });
};

// Update car
export const updateCar = async (id, updateData) => {
  return await Car.findByIdAndUpdate(
    id, 
    updateData,
    { new: true, runValidators: true }
  ).populate('user_id', 'username firstname lastname email phone');
};

// Delete car
export const deleteCar = async (id) => {
  return await Car.findByIdAndDelete(id);
};

// Increment views
export const incrementCarViews = async (id) => {
  return await Car.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
};

// Format car response
export const formatCarResponse = (car) => {
  return {
    _id: car._id,
    title: car.title,
    description: car.description,
    price: car.price,
    listing_type: car.listing_type,
    user: car.user_id ? {
      _id: car.user_id._id,
      username: car.user_id.username,
      firstname: car.user_id.firstname,
      lastname: car.user_id.lastname,
      email: car.user_id.email,
      phone: car.user_id.phone
    } : null,
    status: car.status,
    views: car.views,
    images: car.images,
    location: car.location,
    brand: car.brand,
    model: car.model,
    year: car.year,
    mileage: car.mileage,
    fuel_type: car.fuel_type,
    transmission: car.transmission,
    seats: car.seats,
    color: car.color,
    created_at: car.created_at,
    updated_at: car.updated_at
  };
};