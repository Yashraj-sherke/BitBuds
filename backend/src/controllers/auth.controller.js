import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import Stats from '../models/Stats.model.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';
import { sendSuccess } from '../middleware/error.middleware.js';
import { updateLeaderboardScore } from '../config/redis.js';
import logger from '../utils/logger.js';

const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

const signAccessToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });

const signRefreshToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

const parseDurationMs = (duration) => {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (multipliers[unit] || 86400000);
};

const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const expiresAt = new Date(Date.now() + parseDurationMs(REFRESH_EXPIRES));
  await User.findByIdAndUpdate(user._id, {
    $push: {
      refreshTokens: {
        $each: [{ token: refreshToken, expiresAt }],
        $slice: -5,
      },
    },
    lastLogin: new Date(),
  });

  return { accessToken, refreshToken };
};

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

const splitDisplayName = (displayName) => {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: 'Student' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
};

const ensureStats = async (userId) => {
  let stats = await Stats.findOne({ userId });
  if (!stats) {
    stats = await Stats.create({ userId });
  }
  return stats;
};

export const register = asyncHandler(async (req, res) => {
  let { firstName, lastName, email, password, role, displayName } = req.body;

  if (displayName && (!firstName || !lastName)) {
    ({ firstName, lastName } = splitDisplayName(displayName));
  }

  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, 'firstName, lastName, email, and password are required');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const allowedRoles = ['user', 'admin', 'parent'];
  const userRole = allowedRoles.includes(role) ? role : 'user';

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: userRole,
  });

  await ensureStats(user._id);
  await updateLeaderboardScore(user._id, user.xp);

  const tokens = await issueTokens(user);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseDurationMs(REFRESH_EXPIRES),
  });

  sendSuccess(res, 201, { user: sanitizeUser(user), tokens }, 'Registration successful');
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated');
  }

  const tokens = await issueTokens(user);

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: parseDurationMs(REFRESH_EXPIRES),
  });

  sendSuccess(res, 200, { user: sanitizeUser(user), tokens }, 'Login successful');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'Refresh token required');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokens');
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const stored = user.refreshTokens?.find((rt) => rt.token === token);
  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token expired or revoked');
  }

  const accessToken = signAccessToken(user);
  sendSuccess(res, 200, { tokens: { accessToken, refreshToken: token } }, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;

  if (token && req.user?.id) {
    await User.findByIdAndUpdate(req.user.id, { $pull: { refreshTokens: { token } } });
  }

  res.clearCookie('refreshToken');
  sendSuccess(res, 200, null, 'Logged out successfully');
});

export const logoutAll = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { refreshTokens: [] });
  res.clearCookie('refreshToken');
  sendSuccess(res, 200, null, 'Logged out from all devices');
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('badges');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  sendSuccess(res, 200, { user: sanitizeUser(user) }, 'User retrieved successfully');
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).populate('badges');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  sendSuccess(res, 200, { user: sanitizeUser(user) }, 'User retrieved successfully');
});

export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const allowed = ['firstName', 'lastName', 'profilePicture', 'phoneNumber'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).populate('badges');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendSuccess(res, 200, { user: sanitizeUser(user) }, 'Profile updated successfully');
});

export const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(403, 'Admin access required');
  }

  const users = await User.find().sort({ createdAt: -1 }).limit(100);
  sendSuccess(res, 200, { users: users.map(sanitizeUser), count: users.length }, 'Users retrieved');
});

export default {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getCurrentUser,
  getUserById,
  updateUser,
  getAllUsers,
};
