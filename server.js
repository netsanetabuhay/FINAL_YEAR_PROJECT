import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import env from './utils/env.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

// Routes
app.use('/api/users', userRoutes);
app.get('/', (req, res) => res.send('API is running...'));

// Only start server after database connects
const startServer = async () => {
  try {
    await connectDB(); // Wait for DB connection
    const PORT = env.port;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Database is ready to accept connections');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();