import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { validateBody, validateParams } from '../middleware/validation.middleware.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { updateUserSchema } from '../validators/user.validator.js';
import { USER_ROLES } from '../utils/constants.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/users
 * @desc Get all users
 * @access Private (Admin only)
 */
router.get(
  '/',
  authorize(USER_ROLES.ADMIN),
  userController.getUsers
);

/**
 * @route GET /api/v1/users/:id
 * @desc Get user by ID
 * @access Private
 */
router.get(
  '/:id',
  userController.getUserById
);

/**
 * @route PATCH /api/v1/users/:id
 * @desc Update user
 * @access Private (Own profile or Admin)
 */
router.patch(
  '/:id',
  validateBody(updateUserSchema),
  userController.updateUser
);

/**
 * @route DELETE /api/v1/users/:id
 * @desc Delete user (soft delete)
 * @access Private (Admin only)
 */
router.delete(
  '/:id',
  authorize(USER_ROLES.ADMIN),
  userController.deleteUser
);

export default router;
