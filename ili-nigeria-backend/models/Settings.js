import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: "International Language Institute, Nigeria",
  },
  timezone: { type: String, default: "Africa/Lagos" },
  currency: { type: String, default: "NGN" },
  workingHours: { type: String, default: "9:00 AM - 5:00 PM" },
  updatedAt: { type: Date, default: Date.now },
});

export const AdminSettings = mongoose.model(
  "AdminSettings",
  adminSettingsSchema
);

const userSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

