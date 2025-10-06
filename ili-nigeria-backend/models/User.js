import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "Guest" },
  role: { type: String, enum: ["admin", "client"], default: "client" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
