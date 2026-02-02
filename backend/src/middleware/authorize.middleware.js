import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

/**
 * Authorization middleware to check user roles
 * @param {...string} roles - Allowed roles
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    HTTP_STATUS.FORBIDDEN,
                    `Access denied. Required role: ${roles.join(' or ')}`
                )
            );
        }

        next();
    };
};

export default authorize;
