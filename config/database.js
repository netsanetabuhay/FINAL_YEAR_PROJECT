import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const verifyConected = await mongoose.connect(process.env.MONGO_URI);
    console.log(verifyConected.name);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;