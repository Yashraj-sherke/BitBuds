import express from 'express';
import * as badgeController from '../controllers/badge.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { badgeSchema } from '../validators/badge.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/badges
 * @desc Get all badges
 * @access Private
 */
router.get('/', badgeController.getAllBadges);

/**
 * @route GET /api/v1/badges/my-badges
 * @desc Get current user's badges
 * @access Private
 */
router.get('/my-badges', badgeController.getUserBadges);

/**
 * @route GET /api/v1/badges/available
 * @desc Get available badges with eligibility status
 * @access Private
 */
router.get('/available', badgeController.getAvailableBadges);

/**
 * @route POST /api/v1/badges/check-eligibility
 * @desc Check and award eligible badges
 * @access Private
 */
router.post('/check-eligibility', badgeController.checkEligibility);

/**
 * @route GET /api/v1/badges/:id
 * @desc Get badge by ID
 * @access Private
 */
router.get('/:id', badgeController.getBadgeById);

/**
 * @route GET /api/v1/badges/:id/stats
 * @desc Get badge statistics
 * @access Private (Admin)
 */
router.get(
    '/:id/stats',
    authorize('admin'),
    badgeController.getBadgeStats
);

/**
 * @route POST /api/v1/badges
 * @desc Create new badge
 * @access Private (Admin)
 */
router.post(
    '/',
    authorize('admin'),
    validateBody(badgeSchema),
    badgeController.createBadge
);

/**
 * @route PATCH /api/v1/badges/:id
 * @desc Update badge
 * @access Private (Admin)
 */
router.patch(
    '/:id',
    authorize('admin'),
    badgeController.updateBadge
);

/**
 * @route DELETE /api/v1/badges/:id
 * @desc Delete badge
 * @access Private (Admin)
 */
router.delete(
    '/:id',
    authorize('admin'),
    badgeController.deleteBadge
);

export default router;
