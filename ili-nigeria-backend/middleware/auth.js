// src/middleware/auth.js

import admin from "firebase-admin";

/**
 * Middleware to protect routes. Requires a valid token. (UNCHANGED)
 */
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

/**
 * NEW: Optional protection middleware.
 * Verifies token if present, but continues if not present.
 * This is for public routes like Quote Submission where a user might be logged in.
 */
export const optionalProtect = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    }

    const token = req.headers.authorization?.split("Bearer ")[1];
    if (token) {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
    }
    // If no token, req.user remains undefined, and we proceed.
    next();
  } catch (error) {
    // Treat invalid token as no token and allow submission, but log the error
    console.warn(
      "Optional auth failed (invalid token, proceeding as public):",
      error.message
    );
    req.user = undefined; // Ensure req.user is clean upon failure
    next();
  }
};

/**
 * Middleware to restrict access to certain roles. (UNCHANGED)
 */
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
