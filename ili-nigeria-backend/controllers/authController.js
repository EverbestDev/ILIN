import admin from "firebase-admin";
import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = req.user; // From protect middleware (Firebase verified)
    const dbUser = await User.findOne({ firebaseUid: user.uid });
    if (!dbUser) {
      return res.status(404).json({ message: "User not found in database" });
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

export const setClaimsAndGetProfile = async (req, res) => {
  try {
    const { name, role } = req.body;
    const firebaseUser = req.user; // From protect middleware

    let user = await User.findOne({ firebaseUid: firebaseUser.uid });
    if (!user) {
      user = new User({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || firebaseUser.displayName || "Guest",
        role: role || "client",
      });
      await user.save();
      console.log("New user created:", user.email, user.role);
    } else if (name) {
      user.name = name;
      await user.save();
    }

    // Set custom claims in Firebase
    await admin
      .auth()
      .setCustomUserClaims(firebaseUser.uid, { role: user.role });

    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Set claims error:", error);
    res.status(500).json({ message: "Failed to set claims or fetch profile" });
  }
};
