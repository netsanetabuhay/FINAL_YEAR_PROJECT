import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  firstname: { 
    type: String,
    required: false,
    trim: true
  },
  lastname: { 
    type: String,
    required: false,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String,
    required: false,
    trim: true
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  roles: { 
    type: [String], 
    default: ['tenant'] 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);
export default User;