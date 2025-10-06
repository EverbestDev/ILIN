import admin from "firebase-admin";
import User from "../models/User.js";

export const setClaimsAndGetProfile = async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = req.user; // From protect middleware

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Set custom claims
    await admin
      .auth()
      .setCustomUserClaims(user.uid, { role: role || "client" });

    // Update or create user in MongoDB
    let dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      dbUser = new User({
        firebaseUid: user.uid,
        email: user.email,
        name: name || user.name || user.email.split("@")[0],
        role: role || "client",
      });
      await dbUser.save();
    } else {
      dbUser.name = name || dbUser.name;
      dbUser.role = role || dbUser.role;
      await dbUser.save();
    }

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
    const user = req.user; // From protect middleware
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
