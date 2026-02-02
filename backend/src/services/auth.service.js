import User from '../models/User.model.js';
import RefreshToken from '../models/RefreshToken.model.js';
import { generateTokenPair } from '../utils/jwt.util.js';
import ApiError from '../utils/ApiError.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants.js';
import cacheService from './cache.service.js';
import logger from '../utils/logger.js';

/**
 * Authentication Service
 * Handles all authentication-related business logic
 */
class AuthService {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Created user and tokens
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(userData.email);
      if (existingUser) {
        throw ApiError.conflict(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }

      // Create new user
      const user = await User.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        phoneNumber: userData.phoneNumber || null,
      });

      // Generate tokens
      const tokens = generateTokenPair(user._id, user.email, user.role);

      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
      
      await RefreshToken.createToken(
        user._id,
        tokens.refreshToken,
        expiresAt,
        null,
        null
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      logger.info(`User registered successfully: ${user.email}`);

      return {
        user: userResponse,
        tokens,
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} userAgent - User agent string
   * @param {string} ipAddress - IP address
   * @returns {Promise<object>} User and tokens
   */
  async login(email, password, userAgent = null, ipAddress = null) {
    try {
      // Find user with password field
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Check if account is active
      if (!user.isActive) {
        throw ApiError.forbidden(ERROR_MESSAGES.ACCOUNT_DISABLED);
      }

      // Compare passwords
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw ApiError.unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate tokens
      const tokens = generateTokenPair(user._id, user.email, user.role);

      // Save refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
      
      await RefreshToken.createToken(
        user._id,
        tokens.refreshToken,
        expiresAt,
        userAgent,
        ipAddress
      );

      // Update last login
      await user.updateLastLogin();

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      // Clear any cached user data
      await cacheService.del(`user:${user._id}`);

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: userResponse,
        tokens,
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<object>} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      // Find valid refresh token
      const tokenDoc = await RefreshToken.findValidToken(refreshToken);
      
      if (!tokenDoc) {
        throw ApiError.unauthorized(ERROR_MESSAGES.REFRESH_TOKEN_INVALID);
      }

      // Get user
      const user = await User.findById(tokenDoc.userId);
      
      if (!user) {
        throw ApiError.unauthorized(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      if (!user.isActive) {
        throw ApiError.forbidden(ERROR_MESSAGES.ACCOUNT_DISABLED);
      }

      // Generate new tokens
      const tokens = generateTokenPair(user._id, user.email, user.role);

      // Revoke old refresh token
      await RefreshToken.revokeToken(refreshToken);

      // Save new refresh token
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
      
      await RefreshToken.createToken(
        user._id,
        tokens.refreshToken,
        expiresAt,
        tokenDoc.userAgent,
        tokenDoc.ipAddress
      );

      logger.info(`Token refreshed for user: ${user.email}`);

      return tokens;
    } catch (error) {
      logger.error(`Token refresh error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Logout user
   * @param {string} refreshToken - Refresh token to revoke
   */
  async logout(refreshToken) {
    try {
      if (refreshToken) {
        await RefreshToken.revokeToken(refreshToken);
        logger.info('User logged out successfully');
      }
    } catch (error) {
      logger.error(`Logout error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Logout from all devices
   * @param {string} userId - User ID
   */
  async logoutAll(userId) {
    try {
      await RefreshToken.revokeAllUserTokens(userId);
      await cacheService.del(`user:${userId}`);
      logger.info(`User logged out from all devices: ${userId}`);
    } catch (error) {
      logger.error(`Logout all error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get current user
   * @param {string} userId - User ID
   * @returns {Promise<object>} User data
   */
  async getCurrentUser(userId) {
    try {
      // Try to get from cache
      const cachedUser = await cacheService.get(`user:${userId}`);
      if (cachedUser) {
        return cachedUser;
      }

      // Get from database
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Cache user data for 5 minutes
      await cacheService.set(`user:${userId}`, user, 300);

      return user;
    } catch (error) {
      logger.error(`Get current user error: ${error.message}`);
      throw error;
    }
  }
}

export default new AuthService();
