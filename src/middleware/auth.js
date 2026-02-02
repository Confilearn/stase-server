import User from "../models/User.js";

/**
 * Authentication middleware for Express routes
 * Verifies the Authorization header and attaches the authenticated user to the request
 * Expects: Authorization: Bearer <clerkUserId>
 */

/**
 * Auth result status types
 */
const AUTH_STATUS = {
  SUCCESS: "success",
  UNAUTHORIZED: "unauthorized",
  SERVER_ERROR: "server_error"
};

/**
 * Verifies the Authorization header and returns the authenticated user
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
export async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Missing Authorization header",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Invalid Authorization format. Use: Bearer <token>",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Missing token",
      });
    }

    // Find user by clerkUserId
    const user = await User.findOne({ clerkUserId: token });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found",
      });
    }

    // Attach user to request object for use in subsequent middleware/routes
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth verification error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Authentication failed",
    });
  }
}
