import express from 'express';
import * as missionController from '../controllers/mission.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { missionSchema, missionSubmissionSchema } from '../validators/mission.validator.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route GET /api/v1/missions
 * @desc Get all missions
 * @access Private
 */
router.get('/', missionController.getAllMissions);

/**
 * @route GET /api/v1/missions/my-missions
 * @desc Get missions for current user with progress
 * @access Private
 */
router.get('/my-missions', missionController.getUserMissions);

/**
 * @route GET /api/v1/missions/category/:category
 * @desc Get missions by category
 * @access Private
 */
router.get('/category/:category', missionController.getMissionsByCategory);

/**
 * @route GET /api/v1/missions/:id
 * @desc Get mission by ID
 * @access Private
 */
router.get('/:id', missionController.getMissionById);

/**
 * @route POST /api/v1/missions/:id/start
 * @desc Start a mission
 * @access Private
 */
router.post('/:id/start', missionController.startMission);

/**
 * @route POST /api/v1/missions/:id/submit
 * @desc Submit mission attempt
 * @access Private
 */
router.post(
    '/:id/submit',
    validateBody(missionSubmissionSchema),
    missionController.submitMission
);

/**
 * @route GET /api/v1/missions/:id/stats
 * @desc Get mission statistics
 * @access Private (Admin)
 */
router.get(
    '/:id/stats',
    authorize('admin'),
    missionController.getMissionStats
);

/**
 * @route POST /api/v1/missions
 * @desc Create new mission
 * @access Private (Admin)
 */
router.post(
    '/',
    authorize('admin'),
    validateBody(missionSchema),
    missionController.createMission
);

/**
 * @route PATCH /api/v1/missions/:id
 * @desc Update mission
 * @access Private (Admin)
 */
router.patch(
    '/:id',
    authorize('admin'),
    missionController.updateMission
);

/**
 * @route DELETE /api/v1/missions/:id
 * @desc Delete mission
 * @access Private (Admin)
 */
router.delete(
    '/:id',
    authorize('admin'),
    missionController.deleteMission
);

export default router;
