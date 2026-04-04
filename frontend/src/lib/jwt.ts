import { decodeJwt, JWTPayload, jwtVerify } from "jose";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export async function verifyAuthToken(token: string): Promise<JWTPayload | null> {
  if (!accessTokenSecret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(accessTokenSecret));
    return payload;
  } catch {
    return null;
  }
}

export function decodeAuthToken(token: string): JWTPayload | null {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}
