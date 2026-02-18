import mongoose from 'mongoose';
import env from '../utils/env.js';

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;