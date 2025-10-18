import admin from "firebase-admin";
import User from "../models/User.js"; // Adjust path if your User model is elsewhere

export const getProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const userRecord = await admin.auth().getUser(uid);
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    res.json({
      user: {
        name:
          user.name || userRecord.displayName || userRecord.email.split("@")[0],
        email: userRecord.email,
        role: userRecord.customClaims?.role || "client",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const setClaimsAndGetProfile = async (req, res) => {
  try {
    const { uid } = req.user;
    const { role } = req.body;

    // Optionally set custom claims (restrict to admin or specific logic)
    if (role) {
      await admin.auth().setCustomUserClaims(uid, { role });
    }

    const userRecord = await admin.auth().getUser(uid);
    const user = (await User.findOne({ firebaseUid: uid })) || {};

    res.json({
      user: {
        name:
          user.name || userRecord.displayName || userRecord.email.split("@")[0],
        email: userRecord.email,
        role: userRecord.customClaims?.role || "client",
      },
    });
  } catch (error) {
    console.error("Set claims error:", error);
    res.status(500).json({ message: "Failed to set claims or fetch profile" });
  }
};
