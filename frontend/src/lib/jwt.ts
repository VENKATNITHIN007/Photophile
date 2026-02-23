import { jwtVerify, decodeJwt, JWTPayload } from 'jose';

// Secret key for JWT verification if needed on the edge
// In production, this should match your backend's ACCESS_TOKEN_SECRET or Next.js specific secret
export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev';
  return new TextEncoder().encode(secret);
};

/**
 * Verify a JWT token using jose
 * Compatible with Next.js Edge Runtime (Middleware, Server Components)
 */
export async function verifyAuthToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Decode a JWT token without verifying the signature
 * Useful for extracting user data safely on the client without the secret
 */
export function decodeAuthToken(token: string): JWTPayload | null {
  try {
    return decodeJwt(token);
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return null;
  }
}
