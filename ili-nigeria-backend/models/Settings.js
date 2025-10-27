// models/Settings.js
import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: "International Language Institute, Nigeria",
    },
    timezone: { type: String, default: "Africa/Lagos" },
    currency: { type: String, default: "NGN" },
    workingHours: { type: String, default: "9:00 AM - 5:00 PM" },

    // Admin profile
    adminName: { type: String },
    adminUsername: { type: String },
    adminPhone: { type: String },

    // Notification preferences
    notifications: {
      emailNewQuote: { type: Boolean, default: true },
      emailUrgent: { type: Boolean, default: true },
      emailNewSubscriber: { type: Boolean, default: false },
      emailContact: { type: Boolean, default: true },
      emailWeekly: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

export const AdminSettings = mongoose.model(
  "AdminSettings",
  adminSettingsSchema
);

const userSettingsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String },
    username: { type: String },
    phone: { type: String },

    // Notification preferences
    preferences: {
      emailUpdates: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
      smsAlerts: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export const UserSettings = mongoose.model("UserSettings", userSettingsSchema);
