import { verifyAccessToken } from '../utils/jwt.util.js';
import ApiError from '../utils/ApiError.js';
import { ERROR_MESSAGES, USER_ROLES } from '../utils/constants.js';
import asyncHandler from './asyncHandler.js';
import User from '../models/User.model.js';

/**
 * Authenticate user with JWT token
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_REQUIRED);
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      throw ApiError.unauthorized(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw ApiError.forbidden(ERROR_MESSAGES.ACCOUNT_DISABLED);
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_TOKEN);
  }
});

/**
 * Authorize user based on roles
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(ERROR_MESSAGES.FORBIDDEN);
    }

    next();
  };
};

/**
 * Optional authentication - attach user if token is valid, but don't throw error
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.isActive) {
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});

export default {
  authenticate,
  authorize,
  optionalAuth,
};
