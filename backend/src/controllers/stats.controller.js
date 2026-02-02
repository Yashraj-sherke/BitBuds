import statsService from '../services/stats.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * Get user stats
 * @route GET /api/v1/stats/me
 * @access Private
 */
export const getMyStats = asyncHandler(async (req, res) => {
    const stats = await statsService.getUserStats(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { stats },
        'User stats retrieved successfully'
    );
});

/**
 * Get user dashboard
 * @route GET /api/v1/stats/dashboard
 * @access Private
 */
export const getDashboard = asyncHandler(async (req, res) => {
    const dashboard = await statsService.getUserDashboard(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        dashboard,
        'Dashboard data retrieved successfully'
    );
});

/**
 * Get leaderboard
 * @route GET /api/v1/stats/leaderboard
 * @access Private
 */
export const getLeaderboard = asyncHandler(async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const leaderboard = await statsService.getLeaderboard(parseInt(limit), parseInt(skip));

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        leaderboard,
        'Leaderboard retrieved successfully'
    );
});

/**
 * Get user rank
 * @route GET /api/v1/stats/rank
 * @access Private
 */
export const getMyRank = asyncHandler(async (req, res) => {
    const rank = await statsService.getUserRank(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { rank },
        'User rank retrieved successfully'
    );
});

/**
 * Get category progress
 * @route GET /api/v1/stats/category-progress
 * @access Private
 */
export const getCategoryProgress = asyncHandler(async (req, res) => {
    const progress = await statsService.getCategoryProgress(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { progress },
        'Category progress retrieved successfully'
    );
});

/**
 * Get user achievements
 * @route GET /api/v1/stats/achievements
 * @access Private
 */
export const getAchievements = asyncHandler(async (req, res) => {
    const achievements = await statsService.getUserAchievements(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { achievements },
        'Achievements retrieved successfully'
    );
});

/**
 * Get user activity
 * @route GET /api/v1/stats/activity
 * @access Private
 */
export const getActivity = asyncHandler(async (req, res) => {
    const { limit = 20 } = req.query;

    const activity = await statsService.getUserActivity(req.user.id, parseInt(limit));

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { activity, count: activity.length },
        'User activity retrieved successfully'
    );
});

/**
 * Get global statistics
 * @route GET /api/v1/stats/global
 * @access Public
 */
export const getGlobalStats = asyncHandler(async (req, res) => {
    const stats = await statsService.getGlobalStats();

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { stats },
        'Global statistics retrieved successfully'
    );
});

/**
 * Update streak
 * @route POST /api/v1/stats/streak
 * @access Private
 */
export const updateStreak = asyncHandler(async (req, res) => {
    const streak = await statsService.updateStreak(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { streak },
        'Streak updated successfully'
    );
});

/**
 * Compare users
 * @route GET /api/v1/stats/compare/:userId
 * @access Private
 */
export const compareUsers = asyncHandler(async (req, res) => {
    const comparison = await statsService.compareUsers(req.user.id, req.params.userId);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { comparison },
        'User comparison retrieved successfully'
    );
});

export default {
    getMyStats,
    getDashboard,
    getLeaderboard,
    getMyRank,
    getCategoryProgress,
    getAchievements,
    getActivity,
    getGlobalStats,
    updateStreak,
    compareUsers,
};
