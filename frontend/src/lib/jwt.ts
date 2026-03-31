import { decodeJwt, JWTPayload } from "jose";

export function decodeAuthToken(token: string): JWTPayload | null {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}
