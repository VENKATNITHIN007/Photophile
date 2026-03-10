import crypto from "crypto";
import bcrypt from "bcrypt";

/**
 * Generates a cryptographically secure random token.
 * Uses crypto.randomBytes for CSPRNG quality randomness.
 * 
 * @returns {string} Base64url encoded token (43 characters)
 * @example
 * const token = generateSecureToken();
 * // Returns: "aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890AbCdE"
 */
export const generateSecureToken = (): string => {
  // Generate 32 bytes of random data (256 bits of entropy)
  const buffer = crypto.randomBytes(32);
  
  // Encode as base64url (URL-safe base64 without padding)
  // This produces a 43-character string
  return buffer.toString("base64url");
};

/**
 * Hashes a token using bcrypt for secure database storage.
 * Always hash tokens before storing in the database.
 * 
 * @param {string} token - The plain text token to hash
 * @returns {Promise<string>} The bcrypt hashed token
 * @example
 * const hashedToken = await hashToken(plainToken);
 */
export const hashToken = async (token: string): Promise<string> => {
  // Use 10 rounds of bcrypt hashing
  // This provides a good balance between security and performance
  return bcrypt.hash(token, 10);
};

/**
 * Verifies a plain text token against a bcrypt hash.
 * Uses bcrypt.compare for timing-safe comparison.
 * 
 * @param {string} token - The plain text token to verify
 * @param {string} hashedToken - The bcrypt hashed token from database
 * @returns {Promise<boolean>} True if token matches, false otherwise
 * @example
 * const isValid = await verifyToken(plainToken, hashedTokenFromDB);
 */
export const verifyToken = async (
  token: string,
  hashedToken: string
): Promise<boolean> => {
  // bcrypt.compare uses timing-safe comparison internally
  // This prevents timing attacks that could leak information
  return bcrypt.compare(token, hashedToken);
};
