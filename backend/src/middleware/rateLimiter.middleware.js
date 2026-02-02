import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { ERROR_MESSAGES } from '../utils/constants.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Very strict limiter for sensitive operations
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: 'Too many requests, please try again later',
  skipSuccessfulRequests: false,
});

/**
 * Speed limiter - slow down repeated requests
 */
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

/**
 * Create custom rate limiter
 */
export const createRateLimiter = (options) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000,
    max: options.max || 100,
    message: options.message || ERROR_MESSAGES.TOO_MANY_REQUESTS,
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });
};

export default {
  apiLimiter,
  authLimiter,
  strictLimiter,
  speedLimiter,
  createRateLimiter,
};
