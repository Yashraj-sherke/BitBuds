import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new ApiError(500, 'JWT configuration missing');
    }

    const decoded = jwt.verify(token, secret);
    req.user = { id: decoded.sub, role: decoded.role, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }
    next(err);
  }
};

export const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }
  if (roles.length && !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Insufficient permissions'));
  }
  next();
};

export default { authenticate, authorize };
