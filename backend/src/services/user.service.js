import User from '../models/User.model.js';
import ApiError from '../utils/ApiError.js';
import { ERROR_MESSAGES, PAGINATION } from '../utils/constants.js';
import cacheService from './cache.service.js';
import logger from '../utils/logger.js';

/**
 * User Service
 * Handles all user-related business logic
 */
class UserService {
  /**
   * Get all users with pagination, filtering, and sorting
   * @param {object} options - Query options
   * @returns {Promise<object>} Paginated users
   */
  async getUsers(options = {}) {
    try {
      const {
        page = PAGINATION.DEFAULT_PAGE,
        limit = PAGINATION.DEFAULT_LIMIT,
        role,
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = options;

      // Build query
      const query = {};
      
      if (role) query.role = role;
      if (typeof isActive !== 'undefined') query.isActive = isActive;
      
      // Search across multiple fields
      if (search) {
        query.$or = [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

      // Execute query with pagination
      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort(sortOptions)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        User.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error(`Get users error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<object>} User data
   */
  async getUserById(userId) {
    try {
      // Try cache first
      const cachedUser = await cacheService.get(`user:${userId}`);
      if (cachedUser) {
        return cachedUser;
      }

      const user = await User.findById(userId).select('-password').lean();
      
      if (!user) {
        throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Cache for 5 minutes
      await cacheService.set(`user:${userId}`, user, 300);

      return user;
    } catch (error) {
      logger.error(`Get user by ID error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {object} updateData - Data to update
   * @returns {Promise<object>} Updated user
   */
  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Clear cache
      await cacheService.del(`user:${userId}`);

      logger.info(`User updated: ${userId}`);

      return user;
    } catch (error) {
      logger.error(`Update user error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete user (soft delete by setting isActive to false)
   * @param {string} userId - User ID
   */
  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );

      if (!user) {
        throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Clear cache
      await cacheService.del(`user:${userId}`);

      logger.info(`User deleted (soft): ${userId}`);

      return user;
    } catch (error) {
      logger.error(`Delete user error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Permanently delete user
   * @param {string} userId - User ID
   */
  async permanentlyDeleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        throw ApiError.notFound(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Clear cache
      await cacheService.del(`user:${userId}`);

      logger.info(`User permanently deleted: ${userId}`);
    } catch (error) {
      logger.error(`Permanently delete user error: ${error.message}`);
      throw error;
    }
  }
}

export default new UserService();
