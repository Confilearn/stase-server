/**
 * Transaction reference generator utility
 * Creates unique transaction references for tracking financial operations
 */

/**
 * Generates a unique transaction reference
 * Uses high-resolution timestamp with random component to avoid collisions
 * @returns {string} Unique transaction reference in format TXN{prefix}{timestamp}{suffix}
 */
export function generateTransactionReference() {
  // Use high-resolution timestamp with random component to avoid collisions
  const timestamp = Date.now().toString();
  const randomSuffix = Math.random().toString(36).substr(2, 12).toUpperCase();
  const randomPrefix = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TXN${randomPrefix}${timestamp}${randomSuffix}`;
}
