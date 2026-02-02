import missionService from '../services/mission.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * Get all missions
 * @route GET /api/v1/missions
 * @access Private
 */
export const getAllMissions = asyncHandler(async (req, res) => {
    const { category, difficulty } = req.query;

    const missions = await missionService.getAllMissions({
        category,
        difficulty,
    });

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { missions, count: missions.length },
        'Missions retrieved successfully'
    );
});

/**
 * Get missions for current user
 * @route GET /api/v1/missions/my-missions
 * @access Private
 */
export const getUserMissions = asyncHandler(async (req, res) => {
    const missions = await missionService.getUserMissions(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { missions, count: missions.length },
        'User missions retrieved successfully'
    );
});

/**
 * Get mission by ID
 * @route GET /api/v1/missions/:id
 * @access Private
 */
export const getMissionById = asyncHandler(async (req, res) => {
    const mission = await missionService.getMissionById(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { mission },
        'Mission retrieved successfully'
    );
});

/**
 * Get missions by category
 * @route GET /api/v1/missions/category/:category
 * @access Private
 */
export const getMissionsByCategory = asyncHandler(async (req, res) => {
    const missions = await missionService.getMissionsByCategory(req.params.category);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { missions, count: missions.length },
        'Category missions retrieved successfully'
    );
});

/**
 * Start a mission
 * @route POST /api/v1/missions/:id/start
 * @access Private
 */
export const startMission = asyncHandler(async (req, res) => {
    const result = await missionService.startMission(req.user.id, req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        result,
        'Mission started successfully'
    );
});

/**
 * Submit mission
 * @route POST /api/v1/missions/:id/submit
 * @access Private
 */
export const submitMission = asyncHandler(async (req, res) => {
    const result = await missionService.submitMission(
        req.user.id,
        req.params.id,
        req.body
    );

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        result,
        result.isCompleted ? 'Mission completed!' : 'Mission submitted'
    );
});

/**
 * Get mission statistics
 * @route GET /api/v1/missions/:id/stats
 * @access Private (Admin)
 */
export const getMissionStats = asyncHandler(async (req, res) => {
    const stats = await missionService.getMissionStats(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { stats },
        'Mission statistics retrieved successfully'
    );
});

/**
 * Create mission
 * @route POST /api/v1/missions
 * @access Private (Admin)
 */
export const createMission = asyncHandler(async (req, res) => {
    const mission = await missionService.createMission(req.body);

    ApiResponse.send(
        res,
        HTTP_STATUS.CREATED,
        { mission },
        'Mission created successfully'
    );
});

/**
 * Update mission
 * @route PATCH /api/v1/missions/:id
 * @access Private (Admin)
 */
export const updateMission = asyncHandler(async (req, res) => {
    const mission = await missionService.updateMission(req.params.id, req.body);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { mission },
        'Mission updated successfully'
    );
});

/**
 * Delete mission
 * @route DELETE /api/v1/missions/:id
 * @access Private (Admin)
 */
export const deleteMission = asyncHandler(async (req, res) => {
    await missionService.deleteMission(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        null,
        'Mission deleted successfully'
    );
});

export default {
    getAllMissions,
    getUserMissions,
    getMissionById,
    getMissionsByCategory,
    startMission,
    submitMission,
    getMissionStats,
    createMission,
    updateMission,
    deleteMission,
};
