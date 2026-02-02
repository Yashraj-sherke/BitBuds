import jwt from 'jsonwebtoken';

/**
 * Optional authentication middleware
 * Attaches user to request if token is valid, but doesn't reject if missing
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;

        next();
    } catch (error) {
        // Token invalid or expired, but we don't reject the request
        next();
    }
};

export default optionalAuth;
