import admin from "firebase-admin";

export const protect = async (req, res, next) => {
  try {
    // Skip token verification for OPTIONS requests (CORS preflight)
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    console.error("Firebase auth middleware error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    // Skip role check for OPTIONS requests
    if (req.method === "OPTIONS") {
      return next();
    }

    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
