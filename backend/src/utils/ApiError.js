import { HTTP_STATUS } from './constants.js';

/**
 * Custom API Error class
 * @extends Error
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {boolean} isOperational - Whether error is operational
   * @param {string} stack - Error stack trace
   */
  constructor(
    statusCode,
    message,
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Static factory methods for common errors
  static badRequest(message = 'Bad Request') {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message = 'Not Found') {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message = 'Conflict') {
    return new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  static unprocessableEntity(message = 'Unprocessable Entity') {
    return new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, message);
  }

  static tooManyRequests(message = 'Too Many Requests') {
    return new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, message);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, false);
  }

  static serviceUnavailable(message = 'Service Unavailable') {
    return new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, message);
  }
}

export default ApiError;
