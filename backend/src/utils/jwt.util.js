import jwt from 'jsonwebtoken';
import { TOKEN_TYPES } from './constants.js';

/**
 * Generate JWT access token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {string} JWT token
 */
export const generateAccessToken = (userId, email, role) => {
  return jwt.sign(
    {
      id: userId,
      email,
      role,
      type: TOKEN_TYPES.ACCESS,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m',
    }
  );
};

/**
 * Generate JWT refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: TOKEN_TYPES.REFRESH,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    }
  );
};

/**
 * Verify JWT access token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

/**
 * Verify JWT refresh token
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

/**
 * Generate token pair (access + refresh)
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {object} Token pair
 */
export const generateTokenPair = (userId, email, role) => {
  return {
    accessToken: generateAccessToken(userId, email, role),
    refreshToken: generateRefreshToken(userId),
  };
};

/**
 * Decode token without verification
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  decodeToken,
};
