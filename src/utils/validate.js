/**
 * Validation utility functions for the Stase fintech application
 * Provides input validation for email, username, and other user data
 */

/**
 * Validates email format using regex
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates username format
 * - 3-20 characters
 * - Letters, numbers, and underscores only
 * - Cannot start or end with underscore
 * @param {string} username - Username to validate
 * @returns {boolean} True if username is valid, false otherwise
 */
export function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$/;
  return usernameRegex.test(username);
}
