/**
 * Account helper utilities for generating bank account details
 * Provides functions to create account numbers, IBANs, sort codes, and bank information
 */

/**
 * Supported account currencies
 */
export const SUPPORTED_CURRENCIES = ["USD", "CAD", "EUR", "GBP"];

/**
 * Generates a unique account number for a specific currency
 * @param {string} currency - Currency code (USD, CAD, EUR, GBP)
 * @returns {string} Generated account number
 */
export function generateAccountNumber(currency) {
  const prefix = {
    USD: "1234",
    CAD: "5678",
    EUR: "9012",
    GBP: "3456",
  };

  const randomDigits = Math.random().toString().substr(2, 8);
  return `${prefix[currency]}${randomDigits}`;
}

/**
 * Generates a random IBAN (International format note: this is for demo purposes only)
 * @returns {string} Generated IBAN
 */
export function generateIBAN() {
  const countryCode = "DE";
  const checkDigits = Math.random().toString().substr(2, 2);
  const bankCode = "12345678";
  const accountNumber = Math.random().toString().substr(2, 10);
  return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
}

/**
 * Generates a random UK sort code
 * @returns {string} Generated sort code in format XX-XX-XX
 */
export function generateSortCode() {
  return `${Math.random().toString().substr(2, 2)}-${Math.random().toString().substr(2, 2)}-${Math.random().toString().substr(2, 2)}`;
}

/**
 * Gets the bank name for a specific currency
 * @param {string} currency - Currency code
 * @returns {string} Bank name
 */
export function getBankName(currency) {
  const banks = {
    USD: "Stase Bank USA",
    CAD: "Stase Bank Canada",
    EUR: "Stase Bank Europe",
    GBP: "Stase Bank UK",
  };
  return banks[currency];
}

/**
 * Gets the bank address for a specific currency
 * @param {string} currency - Currency code
 * @returns {string} Bank address
 */
export function getBankAddress(currency) {
  const addresses = {
    USD: "123 Wall Street, New York, NY 10005",
    CAD: "456 Bay Street, Toronto, ON M5V 2V6",
    EUR: "789 Friedrichstraße, Berlin, 10117",
    GBP: "321 Threadneedle Street, London, EC2R 8AY",
  };
  return addresses[currency];
}

/**
 * Gets the SWIFT code for a specific currency
 * @param {string} currency - Currency code
 * @returns {string} SWIFT code
 */
export function getSwiftCode(currency) {
  const swiftCodes = {
    USD: "STASEUS33",
    CAD: "STASECA33",
    EUR: "STASEDE33",
    GBP: "STASEGB33",
  };
  return swiftCodes[currency];
}
