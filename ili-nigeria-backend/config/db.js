// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     // 👀 Make sure we are reading from .env
//     const conn = await mongoose.connect(process.env.MONGO_URI);

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     process.exit(1); // Stop app if DB fails
//   }
// };

// export default connectDB;

// src/config/db.js
import mongoose from "mongoose";
import { startTaskReminder } from "../utils/taskReminder.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    startTaskReminder(); // Start cron job for task reminders
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;