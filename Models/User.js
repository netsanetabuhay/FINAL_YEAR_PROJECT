// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  
  role: {
    type: String,
    enum: ['provider', 'tenant'],
    required: [true, 'Role is required']
  },
  
  // Provider specific fields
  providerDetails: {
    businessName: String,
    serviceAreas: [String],
    paymentInfo: {
      preferredMethod: {
        type: String,
        enum: ['telebirr', 'chapa', 'bank']
      },
      telebirr: String,
      bankAccount: String
    }
  },
  
  // Tenant specific fields
  tenantDetails: {
    preferredLocations: [String],
    maxBudget: Number
  },
  
  status: {
    type: String,
    enum: ['active', 'pending', 'suspended'],
    default: 'active'
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;