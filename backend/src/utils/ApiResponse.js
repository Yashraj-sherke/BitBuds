import { HTTP_STATUS } from './constants.js';

/**
 * Standard API Response class
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Response data
   * @param {string} message - Response message
   * @param {object} meta - Additional metadata (pagination, etc.)
   */
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) {
      this.meta = meta;
    }
    this.timestamp = new Date().toISOString();
  }

  // Static factory methods for common responses
  static success(data, message = 'Success', meta = null) {
    return new ApiResponse(HTTP_STATUS.OK, data, message, meta);
  }

  static created(data, message = 'Created successfully', meta = null) {
    return new ApiResponse(HTTP_STATUS.CREATED, data, message, meta);
  }

  static noContent(message = 'No content') {
    return new ApiResponse(HTTP_STATUS.NO_CONTENT, null, message);
  }

  /**
   * Send response to client
   * @param {Response} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {any} data - Response data
   * @param {string} message - Response message
   * @param {object} meta - Additional metadata
   */
  static send(res, statusCode, data, message = 'Success', meta = null) {
    const response = new ApiResponse(statusCode, data, message, meta);
    return res.status(statusCode).json(response);
  }
}

export default ApiResponse;
