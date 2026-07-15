import logger from '../utils/logger.js';
import ApiError, { sendSuccess } from '../utils/ApiError.js';

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  logger.error('Request error', {
    statusCode,
    message,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export { sendSuccess };
export default errorHandler;
