import mongoose from "mongoose";

const pendingSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("PendingSubscriber", pendingSubscriberSchema);
