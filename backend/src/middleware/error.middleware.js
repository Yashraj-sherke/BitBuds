import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

/**
 * Convert error to ApiError instance
 */
const convertToApiError = (err) => {
  if (err instanceof ApiError) {
    return err;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiError.badRequest(errors.join(', '));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return ApiError.conflict(`${field} already exists`);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Token expired');
  }

  // Default to internal server error
  return ApiError.internal(err.message);
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  const apiError = convertToApiError(err);

  // Log error
  if (apiError.statusCode >= 500) {
    logger.error(`${err.message}`, {
      error: err,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn(`${err.message}`, {
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  // Send error response
  const response = {
    success: false,
    statusCode: apiError.statusCode,
    message: apiError.message,
    timestamp: apiError.timestamp,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = apiError.stack;
  }

  res.status(apiError.statusCode).json(response);
};

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Handle unhandled promise rejections
 */
export const unhandledRejectionHandler = () => {
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit in production, just log
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  });
};

/**
 * Handle uncaught exceptions
 */
export const uncaughtExceptionHandler = () => {
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
};

export default errorHandler;
