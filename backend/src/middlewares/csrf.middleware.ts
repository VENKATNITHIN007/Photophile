import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/core/ApiError";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";

const isCsrfPathExempt = (path: string): boolean => {
  return path.endsWith("/auth/csrf");
};

const safeEqual = (a: string, b: string): boolean => {
  const aBuffer = Buffer.from(a, "utf8");
  const bBuffer = Buffer.from(b, "utf8");

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

export const csrfProtection = (req: Request, _res: Response, next: NextFunction) => {
  if (SAFE_METHODS.has(req.method.toUpperCase()) || isCsrfPathExempt(req.path)) {
    return next();
  }

  // Only enforce CSRF for cookie-authenticated requests.
  const hasAuthCookie = Boolean(req.cookies?.accessToken || req.cookies?.refreshToken);
  if (!hasAuthCookie) {
    return next();
  }

  const csrfCookie = req.cookies?.[CSRF_COOKIE_NAME];
  const csrfHeader = req.headers[CSRF_HEADER_NAME] as string | undefined;

  if (!csrfCookie || !csrfHeader || !safeEqual(csrfCookie, csrfHeader)) {
    throw new ApiError(403, "Invalid CSRF token");
  }

  next();
};

export const csrfCookieName = CSRF_COOKIE_NAME;
