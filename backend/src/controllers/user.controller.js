import userService from '../services/user.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * Get all users
 * @route GET /api/v1/users
 * @access Private (Admin)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const result = await userService.getUsers(req.query);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    result.users,
    'Users retrieved successfully',
    { pagination: result.pagination }
  );
});

/**
 * Get user by ID
 * @route GET /api/v1/users/:id
 * @access Private
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    { user },
    'User retrieved successfully'
  );
});

/**
 * Update user
 * @route PATCH /api/v1/users/:id
 * @access Private
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    { user },
    SUCCESS_MESSAGES.USER_UPDATED
  );
});

/**
 * Delete user (soft delete)
 * @route DELETE /api/v1/users/:id
 * @access Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    null,
    SUCCESS_MESSAGES.USER_DELETED
  );
});

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
