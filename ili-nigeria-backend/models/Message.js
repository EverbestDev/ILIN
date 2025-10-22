import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  threadId: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ["client", "admin"], required: true },
  name: { type: String }, // new
  email: { type: String }, // new
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
