import Joi from 'joi';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Update user validation schema
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters',
    }),
  
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name cannot exceed 50 characters',
    }),
  
  phoneNumber: Joi.string()
    .trim()
    .pattern(/^\+?[\d\s-()]+$/)
    .optional()
    .allow(null, '')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number',
    }),
  
  profilePicture: Joi.string()
    .uri()
    .optional()
    .allow(null, '')
    .messages({
      'string.uri': 'Please provide a valid URL for profile picture',
    }),
});

/**
 * Get users query validation schema
 */
export const getUsersQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1',
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  
  role: Joi.string()
    .valid(...Object.values(USER_ROLES))
    .optional()
    .messages({
      'any.only': 'Invalid role',
    }),
  
  isActive: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'isActive must be a boolean',
    }),
  
  search: Joi.string()
    .trim()
    .optional()
    .messages({
      'string.base': 'Search must be a string',
    }),
  
  sortBy: Joi.string()
    .valid('createdAt', 'lastLogin', 'email', 'firstName', 'lastName')
    .optional()
    .default('createdAt')
    .messages({
      'any.only': 'Invalid sort field',
    }),
  
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .optional()
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc',
    }),
});

/**
 * User ID param validation schema
 */
export const userIdSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'string.empty': 'User ID is required',
    }),
});

export default {
  updateUserSchema,
  getUsersQuerySchema,
  userIdSchema,
};
