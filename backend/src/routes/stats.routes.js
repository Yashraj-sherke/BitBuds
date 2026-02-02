import express from 'express';
import * as statsController from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /api/v1/stats/global
 * @desc Get global statistics
 * @access Public
 */
router.get('/global', statsController.getGlobalStats);

// All other routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/stats/me
 * @desc Get current user's stats
 * @access Private
 */
router.get('/me', statsController.getMyStats);

/**
 * @route GET /api/v1/stats/dashboard
 * @desc Get dashboard data for current user
 * @access Private
 */
router.get('/dashboard', statsController.getDashboard);

/**
 * @route GET /api/v1/stats/leaderboard
 * @desc Get leaderboard
 * @access Private
 */
router.get('/leaderboard', statsController.getLeaderboard);

/**
 * @route GET /api/v1/stats/rank
 * @desc Get current user's rank
 * @access Private
 */
router.get('/rank', statsController.getMyRank);

/**
 * @route GET /api/v1/stats/category-progress
 * @desc Get category progress for current user
 * @access Private
 */
router.get('/category-progress', statsController.getCategoryProgress);

/**
 * @route GET /api/v1/stats/achievements
 * @desc Get achievements for current user
 * @access Private
 */
router.get('/achievements', statsController.getAchievements);

/**
 * @route GET /api/v1/stats/activity
 * @desc Get activity timeline for current user
 * @access Private
 */
router.get('/activity', statsController.getActivity);

/**
 * @route POST /api/v1/stats/streak
 * @desc Update user's streak
 * @access Private
 */
router.post('/streak', statsController.updateStreak);

/**
 * @route GET /api/v1/stats/compare/:userId
 * @desc Compare current user with another user
 * @access Private
 */
router.get('/compare/:userId', statsController.compareUsers);

export default router;
