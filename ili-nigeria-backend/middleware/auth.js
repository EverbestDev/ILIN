import admin from "firebase-admin";

export const protect = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Ensure custom claims are fetched
    const userRecord = await admin.auth().getUser(decodedToken.uid);
    req.user.role = userRecord.customClaims?.role || "client";

    next();
  } catch (error) {
    console.error("Firebase auth middleware error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (req.method === "OPTIONS") {
      return next();
    }

    const userRole = req.user.role || "client";
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
