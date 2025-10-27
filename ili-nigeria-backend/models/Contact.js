// models/Contact.js
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    service: { type: String },
    urgency: { type: String, default: "standard" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "converted", "archived"],
      default: "new",
    },
    convertedThreadId: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contact", contactSchema);
