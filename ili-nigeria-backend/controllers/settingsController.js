// controllers/settingsController.js
import { AdminSettings, UserSettings } from "../models/Settings.js";
import admin from "firebase-admin";

// ==================== ADMIN SETTINGS ====================

// Get Admin Settings
export const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }

    // Get admin profile from Firebase
    const firebaseUser = await admin.auth().getUser(req.user.uid);

    res.json({
      ...settings.toObject(),
      adminEmail: firebaseUser.email,
      adminName: settings.adminName || firebaseUser.displayName || "Admin User",
      adminUsername: settings.adminUsername || "admin",
    });
  } catch (error) {
    console.error("Get admin settings error:", error);
    res.status(500).json({ message: "Failed to fetch admin settings" });
  }
};

// Update Admin Settings
export const updateAdminSettings = async (req, res) => {
  try {
    const {
      timezone,
      workingHours,
      adminName,
      adminUsername,
      adminPhone,
      notifications,
    } = req.body;

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    // Update business settings
    if (timezone) settings.timezone = timezone;
    if (workingHours) settings.workingHours = workingHours;

    // Update admin profile
    if (adminName) settings.adminName = adminName;
    if (adminUsername) settings.adminUsername = adminUsername;
    if (adminPhone) settings.adminPhone = adminPhone;

    // Update notifications
    if (notifications) {
      settings.notifications = {
        ...settings.notifications,
        ...notifications,
      };
    }

    // Update Firebase displayName if name changed
    if (adminName || adminUsername) {
      const displayName = adminUsername || adminName;
      await admin.auth().updateUser(req.user.uid, {
        displayName,
      });
    }

    await settings.save();

    res.json({
      message: "Admin settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update admin settings error:", error);
    res.status(500).json({ message: "Failed to update admin settings" });
  }
};

// ==================== USER SETTINGS ====================

// Get User Settings
export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.uid;

    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = await UserSettings.create({ userId });
    }

    // Get user profile from Firebase
    const firebaseUser = await admin.auth().getUser(userId);

    res.json({
      ...settings.toObject(),
      email: firebaseUser.email,
      name: settings.name || firebaseUser.displayName || "User",
      username:
        settings.username ||
        settings.name ||
        firebaseUser.displayName ||
        "User",
    });
  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({ message: "Failed to fetch user settings" });
  }
};

// Update User Settings
export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, username, phone, preferences } = req.body;

    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = new UserSettings({ userId });
    }

    // Update profile
    if (name) settings.name = name;
    if (username) settings.username = username;
    if (phone) settings.phone = phone;

    // Update preferences
    if (preferences) {
      settings.preferences = {
        ...settings.preferences,
        ...preferences,
      };
    }

    // Update Firebase displayName if username changed
    if (username) {
      await admin.auth().updateUser(userId, {
        displayName: username,
      });
    }

    await settings.save();

    res.json({
      message: "User settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update user settings error:", error);
    res.status(500).json({
      message: "Failed to update user settings",
    });
  }
};
