import crypto from "crypto";

/**
 * Generates a cryptographically secure random token.
 */
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString("base64url");
};

/**
 * Generates deterministic SHA-256 hash for indexed token lookup.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Constant-time comparison between a token and stored hash.
 */
export const verifyTokenHash = (token: string, storedHash: string): boolean => {
  const inputHash = hashToken(token);
  const inputBuffer = Buffer.from(inputHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (inputBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
};
