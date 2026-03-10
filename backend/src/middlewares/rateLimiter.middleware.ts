import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting (e.g., express-rate-limit with redis store)
 */
export const rateLimiter = (
  windowMs: number = 60 * 1000, // 1 minute default
  maxRequests: number = 100,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    if (store[key].count >= maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader("Retry-After", retryAfter);
      return res
        .status(429)
        .json(
          new ApiError(
            429,
            `Too many requests. Please try again in ${retryAfter} seconds.`,
          ),
        );
    }

    store[key].count++;
    next();
  };
};

/**
 * Stricter rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimiter(60 * 1000, 100); // 100 requests per minute

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60 * 1000);


/**
 * Rate limiter for email-based endpoints
 * Uses email from request body as the key
 */
export const emailRateLimiter = (
  windowMs: number = 60 * 60 * 1000, // 1 hour default
  maxRequests: number = 3,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    
    if (!email || typeof email !== 'string') {
      return next(new ApiError(400, 'Email is required'));
    }
    
    const key = `email:${email.toLowerCase().trim()}`;
    const now = Date.now();

    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return next();
    }

    if (store[key].count >= maxRequests) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res
        .status(429)
        .json(
          new ApiError(
            429,
            `Too many requests for this email. Please try again in ${retryAfter} seconds.`,
          ),
        );
    }

    store[key].count++;
    next();
  };
};

/**
 * Rate limiter for email verification endpoint
 * 3 requests per hour per email
 */
export const emailVerificationLimiter = emailRateLimiter(60 * 60 * 1000, 3);

/**
 * Rate limiter for forgot password endpoint
 * 3 requests per hour per email
 */
export const forgotPasswordLimiter = emailRateLimiter(60 * 60 * 1000, 3);