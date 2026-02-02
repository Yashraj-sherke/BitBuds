import Joi from 'joi';
import ApiError from '../utils/ApiError.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Validate request data against Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Request property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown keys
      convert: true, // Convert types
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      throw ApiError.badRequest(errors.join(', '));
    }

    // Replace request property with validated and sanitized value
    req[property] = value;
    next();
  };
};

/**
 * Validate request body
 */
export const validateBody = (schema) => validate(schema, 'body');

/**
 * Validate request query parameters
 */
export const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validate request URL parameters
 */
export const validateParams = (schema) => validate(schema, 'params');

export default {
  validate,
  validateBody,
  validateQuery,
  validateParams,
};
