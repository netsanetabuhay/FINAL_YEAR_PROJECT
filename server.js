import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Add this
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Add this

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});