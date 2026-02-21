// Create car validation
export const validateCreateCar = (data) => {
  const { 
    title, description, price, listing_type,
    location, brand, model, year, mileage,
    fuel_type, transmission, seats, color
  } = data;
  const errors = [];

  // Title validation
  if (!title) {
    errors.push('Title is required');
  } else if (title.trim() === '') {
    errors.push('Title cannot be empty');
  }

  // Description validation
  if (!description) {
    errors.push('Description is required');
  } else if (description.trim() === '') {
    errors.push('Description cannot be empty');
  }

  // Price validation
  if (!price) {
    errors.push('Price is required');
  } else if (isNaN(price) || price < 0) {
    errors.push('Price must be a positive number');
  }

  // Listing type validation
  if (!listing_type) {
    errors.push('Listing type is required');
  } else if (!['sale', 'rent'].includes(listing_type)) {
    errors.push('Listing type must be sale or rent');
  }

  // Location validation
  if (!location) {
    errors.push('Location is required');
  } else {
    if (!location.address) errors.push('Address is required');
    if (!location.city) errors.push('City is required');
    if (!location.state) errors.push('State is required');
    if (!location.country) errors.push('Country is required');
    if (!location.pincode) errors.push('Pincode is required');
  }

  // Brand validation
  if (!brand) {
    errors.push('Brand is required');
  }

  // Model validation
  if (!model) {
    errors.push('Model is required');
  }

  // Year validation
  if (!year) {
    errors.push('Year is required');
  } else if (year < 1900 || year > new Date().getFullYear() + 1) {
    errors.push('Please enter a valid year');
  }

  // Mileage validation
  if (!mileage) {
    errors.push('Mileage is required');
  } else if (mileage < 0) {
    errors.push('Mileage cannot be negative');
  }

  // Fuel type validation
  if (!fuel_type) {
    errors.push('Fuel type is required');
  } else if (!['petrol', 'diesel', 'electric', 'hybrid'].includes(fuel_type)) {
    errors.push('Fuel type must be petrol, diesel, electric, or hybrid');
  }

  // Transmission validation
  if (!transmission) {
    errors.push('Transmission is required');
  } else if (!['manual', 'automatic'].includes(transmission)) {
    errors.push('Transmission must be manual or automatic');
  }

  // Seats validation
  if (!seats) {
    errors.push('Number of seats is required');
  } else if (seats < 1 || seats > 50) {
    errors.push('Seats must be between 1 and 50');
  }

  // Color validation
  if (!color) {
    errors.push('Color is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Update car validation
export const validateUpdateCar = (data) => {
  const { 
    title, description, price, listing_type,
    location, brand, model, year, mileage,
    fuel_type, transmission, seats, color, status
  } = data;
  const errors = [];

  // Optional fields validation (only check if provided)
  if (title !== undefined && title.trim() === '') {
    errors.push('Title cannot be empty');
  }

  if (description !== undefined && description.trim() === '') {
    errors.push('Description cannot be empty');
  }

  if (price !== undefined && (isNaN(price) || price < 0)) {
    errors.push('Price must be a positive number');
  }

  if (listing_type !== undefined && !['sale', 'rent'].includes(listing_type)) {
    errors.push('Listing type must be sale or rent');
  }

  if (status !== undefined && !['active', 'sold', 'rented', 'inactive'].includes(status)) {
    errors.push('Status must be active, sold, rented, or inactive');
  }

  if (location !== undefined) {
    if (location.address !== undefined && location.address.trim() === '') {
      errors.push('Address cannot be empty');
    }
    if (location.city !== undefined && location.city.trim() === '') {
      errors.push('City cannot be empty');
    }
    if (location.state !== undefined && location.state.trim() === '') {
      errors.push('State cannot be empty');
    }
    if (location.country !== undefined && location.country.trim() === '') {
      errors.push('Country cannot be empty');
    }
    if (location.pincode !== undefined && location.pincode.trim() === '') {
      errors.push('Pincode cannot be empty');
    }
  }

  if (brand !== undefined && brand.trim() === '') {
    errors.push('Brand cannot be empty');
  }

  if (model !== undefined && model.trim() === '') {
    errors.push('Model cannot be empty');
  }

  if (year !== undefined && (year < 1900 || year > new Date().getFullYear() + 1)) {
    errors.push('Please enter a valid year');
  }

  if (mileage !== undefined && mileage < 0) {
    errors.push('Mileage cannot be negative');
  }

  if (fuel_type !== undefined && !['petrol', 'diesel', 'electric', 'hybrid'].includes(fuel_type)) {
    errors.push('Fuel type must be petrol, diesel, electric, or hybrid');
  }

  if (transmission !== undefined && !['manual', 'automatic'].includes(transmission)) {
    errors.push('Transmission must be manual or automatic');
  }

  if (seats !== undefined && (seats < 1 || seats > 50)) {
    errors.push('Seats must be between 1 and 50');
  }

  if (color !== undefined && color.trim() === '') {
    errors.push('Color cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};