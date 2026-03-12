import { Request, Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import ApiError from "../utils/ApiError";

/**
 * Standard headers for rate limiting (RFC 6585 compliant)
 * - X-RateLimit-Limit: Maximum number of requests allowed
 * - X-RateLimit-Remaining: Number of requests remaining in current window
 * - X-RateLimit-Reset: Time when the rate limit window resets
 */

/**
 * Create a standardized rate limit exceeded response
 */
const createRateLimitHandler = (req: Request, res: Response) => {
  const retryAfter = res.getHeader("Retry-After") || 60;
  res.status(429).json(
    new ApiError(
      429,
      `Too many requests. Please try again after ${retryAfter} seconds.`,
    ),
  );
};

/**
 * Key generator function - uses IP address by default
 * Can be extended to use user ID for authenticated requests
 */
const keyGenerator = (req: Request): string => {
  // Use user ID if authenticated, otherwise use IP
  if (req.user?._id) {
    return req.user._id.toString();
  }
  const ip = req.ip || req.socket.remoteAddress || "";
  return ipKeyGenerator(ip);
};

/**
 * Skip successful requests option
 * Set to true to not count successful requests toward the limit
 */
const skipSuccessfulRequests = false;

/**
 * Standard API rate limiter
 * General purpose limiter for most API endpoints
 * 100 requests per minute per user/IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // 100 requests per window
  standardHeaders: "draft-7", // Use draft-7 standard headers
  legacyHeaders: false, // Disable X-RateLimit headers
  keyGenerator,
  skipSuccessfulRequests,
  handler: createRateLimitHandler,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please slow down.",
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks on login/register
 * 5 attempts per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 5 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator,
  skipSuccessfulRequests: true, // Don't count successful logins
  handler: createRateLimitHandler,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts. Please try again later.",
  },
});

/**
 * Medium strict rate limiter for sensitive operations
 * For password changes, email verification, etc.
 * 10 requests per 15 minutes
 */
export const sensitiveOpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator,
  skipSuccessfulRequests,
  handler: createRateLimitHandler,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests for this sensitive operation.",
  },
});

/**
 * Relaxed rate limiter for public endpoints
 * For browsing, searching photographers (public data)
 * 300 requests per minute
 */
export const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 300, // 300 requests per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator,
  skipSuccessfulRequests,
  handler: createRateLimitHandler,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please slow down.",
  },
});

/**
 * Upload rate limiter
 * For file upload endpoints (Cloudinary uploads)
 * 10 uploads per minute to prevent abuse
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 uploads per window
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator,
  skipSuccessfulRequests: false,
  handler: createRateLimitHandler,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many uploads. Please wait before uploading more files.",
  },
});

/**
 * Custom rate limiter factory
 * Create a custom rate limiter with specific settings
 */
export const createRateLimiter = (options: {
  windowMs?: number;
  limit?: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs || 60 * 1000,
    limit: options.limit || 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    handler: createRateLimitHandler,
    message: {
      success: false,
      statusCode: 429,
      message: options.message || "Too many requests. Please try again later.",
    },
  });
};

// Backward compatibility - export the old rateLimiter function name
export { apiRateLimiter as rateLimiter };
