import mongoose from 'mongoose';
import env from '../utils/env.js';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(env.mongoUri);
    
    console.log('MongoDB Connected Successfully');
    console.log('Database host:', mongoose.connection.host);
    console.log('Database name:', mongoose.connection.name);
    
    // Return connection for server to use
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error; // Throw so server knows connection failed
  }
};

export default connectDB;