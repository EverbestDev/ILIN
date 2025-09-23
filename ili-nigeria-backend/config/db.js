import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // 👀 Make sure we are reading from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Stop app if DB fails
  }
};

export default connectDB;
