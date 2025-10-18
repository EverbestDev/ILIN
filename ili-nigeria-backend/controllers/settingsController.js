import { AdminSettings, UserSettings } from "../models/Settings.js";

// Admin Settings
export const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error("Get admin settings error:", error);
    res.status(500).json({ message: "Failed to fetch admin settings" });
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const { timezone, currency, workingHours } = req.body;
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }
    settings.timezone = timezone || settings.timezone;
    settings.currency = currency || settings.currency;
    settings.workingHours = workingHours || settings.workingHours;
    settings.updatedAt = Date.now();
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

// User Settings
export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user.uid;
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = await UserSettings.create({ userId });
    }
    res.json(settings);
  } catch (error) {
    console.error("Get user settings error:", error);
    res.status(500).json({ message: "Failed to fetch user settings" });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { name, phone } = req.body;
    let settings = await UserSettings.findOne({ userId });
    if (!settings) {
      settings = new UserSettings({ userId });
    }
    settings.name = name || settings.name;
    settings.phone = phone || settings.phone;
    settings.updatedAt = Date.now();
    await settings.save();
    res.json({ message: "User settings updated successfully", data: settings });
  } catch (error) {
    console.error("Update user settings error:", error);
    res
      .status(500)
      .json({ message: "Failed to update user settings, changes made" });
  }
};
