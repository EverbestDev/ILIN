// src/models/User.js
import mongoose from "mongoose";
// import bcrypt from "bcryptjs"; // REMOVE bcrypt

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    // Add an index for faster lookups based on the email from the Auth0 token
    index: true,
  },
  // REMOVE password field entirely
  // password: { type: String, required: true },

  // Keep role for authorization checks
  role: {
    type: String,
    enum: ["admin", "client"],
    default: "client",
  },

  // Optional: Store the Auth0 User ID for linking purposes
  auth0Id: {
    type: String,
    unique: true,
    sparse: true, // Allows null values, but ensures uniqueness if present
  },

  createdAt: { type: Date, default: Date.now },
});

// REMOVE the password hashing middleware
/*
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// REMOVE the custom comparePassword method
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
*/

export default mongoose.model("User", userSchema);
