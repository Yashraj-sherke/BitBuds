import badgeService from '../services/badge.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * Get all badges
 * @route GET /api/v1/badges
 * @access Private
 */
export const getAllBadges = asyncHandler(async (req, res) => {
    const { category, rarity } = req.query;

    const badges = await badgeService.getAllBadges({ category, rarity });

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { badges, count: badges.length },
        'Badges retrieved successfully'
    );
});

/**
 * Get user badges
 * @route GET /api/v1/badges/my-badges
 * @access Private
 */
export const getUserBadges = asyncHandler(async (req, res) => {
    const badges = await badgeService.getUserBadges(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { badges, count: badges.length },
        'User badges retrieved successfully'
    );
});

/**
 * Get available badges with eligibility status
 * @route GET /api/v1/badges/available
 * @access Private
 */
export const getAvailableBadges = asyncHandler(async (req, res) => {
    const badges = await badgeService.getAvailableBadges(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { badges, count: badges.length },
        'Available badges retrieved successfully'
    );
});

/**
 * Get badge by ID
 * @route GET /api/v1/badges/:id
 * @access Private
 */
export const getBadgeById = asyncHandler(async (req, res) => {
    const badge = await badgeService.getBadgeById(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { badge },
        'Badge retrieved successfully'
    );
});

/**
 * Check and award eligible badges
 * @route POST /api/v1/badges/check-eligibility
 * @access Private
 */
export const checkEligibility = asyncHandler(async (req, res) => {
    const newBadges = await badgeService.checkAndAwardBadges(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { newBadges, count: newBadges.length },
        newBadges.length > 0 ? 'New badges earned!' : 'No new badges available'
    );
});

/**
 * Get badge statistics
 * @route GET /api/v1/badges/:id/stats
 * @access Private (Admin)
 */
export const getBadgeStats = asyncHandler(async (req, res) => {
    const stats = await badgeService.getBadgeStats(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { stats },
        'Badge statistics retrieved successfully'
    );
});

/**
 * Create badge
 * @route POST /api/v1/badges
 * @access Private (Admin)
 */
export const createBadge = asyncHandler(async (req, res) => {
    const badge = await badgeService.createBadge(req.body);

    ApiResponse.send(
        res,
        HTTP_STATUS.CREATED,
        { badge },
        'Badge created successfully'
    );
});

/**
 * Update badge
 * @route PATCH /api/v1/badges/:id
 * @access Private (Admin)
 */
export const updateBadge = asyncHandler(async (req, res) => {
    const badge = await badgeService.updateBadge(req.params.id, req.body);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { badge },
        'Badge updated successfully'
    );
});

/**
 * Delete badge
 * @route DELETE /api/v1/badges/:id
 * @access Private (Admin)
 */
export const deleteBadge = asyncHandler(async (req, res) => {
    await badgeService.deleteBadge(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        null,
        'Badge deleted successfully'
    );
});

export default {
    getAllBadges,
    getUserBadges,
    getAvailableBadges,
    getBadgeById,
    checkEligibility,
    getBadgeStats,
    createBadge,
    updateBadge,
    deleteBadge,
};
