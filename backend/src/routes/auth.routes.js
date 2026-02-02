import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @route POST /api/v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
);

/**
 * @route POST /api/v1/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  authController.refreshToken
);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post(
  '/logout',
  authenticate,
  authController.logout
);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current user
 * @access Private
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

/**
 * @route POST /api/v1/auth/logout-all
 * @desc Logout from all devices
 * @access Private
 */
router.post(
  '/logout-all',
  authenticate,
  authController.logoutAll
);

export default router;
