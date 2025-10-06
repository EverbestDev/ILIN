// src/middleware/auth.js
import { auth, requiredScopes } from "express-oauth2-jwt-bearer";
import User from "../models/User.js"; // Import your simplified User model

// --- 1. JWT Validation Middleware ---
// This checks the token's signature, issuer (iss), and audience (aud) using the env variables.
export const checkJwt = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  audience: process.env.AUTH0_AUDIENCE,
});

// --- 2. Role Verification Middleware ---
/**
 * Middleware to check if the user is in the MongoDB and assign the user object to req.user.
 * Also verifies if the user has the required roles.
 * @param {string[]} allowedRoles - An array of roles (e.g., ['admin', 'client']).
 */
export const checkRole = (allowedRoles) => async (req, res, next) => {
  try {
    // 1. JWT has been verified by checkJwt and its payload is in req.auth.payload
    // The subject (sub) claim is the unique Auth0 user ID (e.g., "auth0|...")
    const auth0Id = req.auth.payload.sub;

    // 2. Look up the user in your MongoDB
    // NOTE: This assumes you have already updated User.js to include auth0Id
    let user = await User.findOne({ auth0Id: auth0Id });

    if (!user) {
      // --- SCENARIO: New User (Just-in-Time Provisioning) ---
      // If the user doesn't exist in your DB, create a new entry.
      const email = req.auth.payload.email || "unknown@ilin.com"; // Get email from token

      user = new User({
        auth0Id: auth0Id,
        email: email,
        role: "client", // Default role for all new signups
      });
      await user.save();
      console.log(`JIT User Provisioned: ${email} (${user.role})`);
    }

    // 3. Attach the user object to the request
    req.user = user;

    // 4. Role Check
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: `Forbidden: User role '${user.role}' is not allowed to access this resource.`,
        });
      }
    }

    // 5. Proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    // If the token is valid but DB fails, this catches it
    res
      .status(500)
      .json({ message: "Internal server error during authorization." });
  }
};
