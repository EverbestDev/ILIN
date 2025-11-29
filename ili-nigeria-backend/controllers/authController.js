import admin from "firebase-admin";
import User from "../models/User.js";

export const setClaimsAndGetProfile = async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user email is in the admin list
    const adminEmails = process.env.ADMIN_EMAIL.split(",").map((email) =>
      email.trim()
    );
    const assignedRole = adminEmails.includes(user.email)
      ? "admin"
      : role || "client";

    await admin.auth().setCustomUserClaims(user.uid, { role: assignedRole });

    const dbUser = await User.findOneAndUpdate(
      { firebaseUid: user.uid },
      {
        $set: {
          email: user.email,
          name: name || user.name || user.email.split("@")[0],
          role: assignedRole,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      user: {
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    });
  } catch (error) {
    console.error("Set claims error:", error);
    res.status(500).json({ message: "Failed to set claims or get profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};
