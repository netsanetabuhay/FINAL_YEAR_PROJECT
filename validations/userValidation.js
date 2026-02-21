// Registration validation
export const validateRegister = (data) => {
  const { username, firstname, lastname, email, phone, password, role } = data;
  const errors = [];

  // Username validation
  if (!username) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters');
  }

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!email.includes('@') || !email.includes('.')) {
    errors.push('Please enter a valid email address');
  }

  // Phone validation (optional)
  if (phone && phone.trim() === '') {
    errors.push('Phone cannot be empty if provided');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 5) {
    errors.push('Password must be at least 5 characters');
  }

  // Firstname and Lastname are optional
  if (firstname && firstname.trim() === '') {
    errors.push('First name cannot be empty if provided');
  }
  
  if (lastname && lastname.trim() === '') {
    errors.push('Last name cannot be empty if provided');
  }

  // Role validation
  if (role) {
    const validRoles = ['tenant', 'admin', 'service_provider'];
    if (!validRoles.includes(role)) {
      errors.push('Invalid role. Role must be tenant, admin, or service_provider');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    role: role || 'tenant' // Return the role (default to tenant)
  };
};

// Login validation
export const validateLogin = (data) => {
  const { email, password } = data;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Profile update validation
export const validateProfileUpdate = (data) => {
  const { firstname, lastname, phone, password } = data;
  const errors = [];

  if (firstname !== undefined && firstname === '') {
    errors.push('First name cannot be empty');
  }

  if (lastname !== undefined && lastname === '') {
    errors.push('Last name cannot be empty');
  }

  if (phone !== undefined && phone === '') {
    errors.push('Phone cannot be empty');
  }

  if (password !== undefined) {
    if (password === '') {
      errors.push('Password cannot be empty');
    } else if (password.length < 5) {
      errors.push('Password must be at least 5 characters');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};