/**
 * Health check controller for monitoring server status
 * Provides basic health endpoint for load balancers and monitoring systems
 */

/**
 * Simple health check endpoint
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export function healthCheck(req, res) {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
