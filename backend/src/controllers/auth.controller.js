import authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.CREATED,
    result,
    SUCCESS_MESSAGES.REGISTRATION_SUCCESS
  );
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userAgent = req.get('user-agent');
  const ipAddress = req.ip;
  
  const result = await authService.login(email, password, userAgent, ipAddress);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    result,
    SUCCESS_MESSAGES.LOGIN_SUCCESS
  );
});

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  const tokens = await authService.refreshToken(refreshToken);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    { tokens },
    SUCCESS_MESSAGES.TOKEN_REFRESHED
  );
});

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Private
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  await authService.logout(refreshToken);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    null,
    SUCCESS_MESSAGES.LOGOUT_SUCCESS
  );
});

/**
 * Get current user
 * @route GET /api/v1/auth/me
 * @access Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    { user },
    'User retrieved successfully'
  );
});

/**
 * Logout from all devices
 * @route POST /api/v1/auth/logout-all
 * @access Private
 */
export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);
  
  ApiResponse.send(
    res,
    HTTP_STATUS.OK,
    null,
    'Logged out from all devices successfully'
  );
});

export default {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  logoutAll,
};
