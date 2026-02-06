import connectDB from './config/database.js';
import express from 'express';
// import cors from 'cors';
import dotenv from 'dotenv';

const app = express();
dotenv.config();


connectDB();
console.log("Mongo URI:", process.env.MONGO_URI);


app.listen(process.env.PORT||4000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});