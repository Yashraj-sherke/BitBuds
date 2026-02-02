import codeProjectService from '../services/codeProject.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../utils/constants.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * Create project
 * @route POST /api/v1/projects
 * @access Private
 */
export const createProject = asyncHandler(async (req, res) => {
    const project = await codeProjectService.createProject(req.user.id, req.body);

    ApiResponse.send(
        res,
        HTTP_STATUS.CREATED,
        { project },
        'Project created successfully'
    );
});

/**
 * Get user's projects
 * @route GET /api/v1/projects/my-projects
 * @access Private
 */
export const getMyProjects = asyncHandler(async (req, res) => {
    const projects = await codeProjectService.getUserProjects(req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { projects, count: projects.length },
        'Projects retrieved successfully'
    );
});

/**
 * Get project by ID
 * @route GET /api/v1/projects/:id
 * @access Public/Private
 */
export const getProjectById = asyncHandler(async (req, res) => {
    const project = await codeProjectService.getProjectById(req.params.id, req.user?.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { project },
        'Project retrieved successfully'
    );
});

/**
 * Update project
 * @route PATCH /api/v1/projects/:id
 * @access Private
 */
export const updateProject = asyncHandler(async (req, res) => {
    const project = await codeProjectService.updateProject(
        req.params.id,
        req.user.id,
        req.body
    );

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { project },
        'Project updated successfully'
    );
});

/**
 * Delete project
 * @route DELETE /api/v1/projects/:id
 * @access Private
 */
export const deleteProject = asyncHandler(async (req, res) => {
    await codeProjectService.deleteProject(req.params.id, req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        null,
        'Project deleted successfully'
    );
});

/**
 * Get public projects
 * @route GET /api/v1/projects/public
 * @access Public
 */
export const getPublicProjects = asyncHandler(async (req, res) => {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const result = await codeProjectService.getPublicProjects(parseInt(limit), parseInt(skip));

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        result,
        'Public projects retrieved successfully'
    );
});

/**
 * Get trending projects
 * @route GET /api/v1/projects/trending
 * @access Public
 */
export const getTrendingProjects = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const projects = await codeProjectService.getTrendingProjects(parseInt(limit));

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { projects, count: projects.length },
        'Trending projects retrieved successfully'
    );
});

/**
 * Search projects
 * @route GET /api/v1/projects/search
 * @access Public
 */
export const searchProjects = asyncHandler(async (req, res) => {
    const { q, limit = 20 } = req.query;

    if (!q) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Search query is required');
    }

    const projects = await codeProjectService.searchProjects(q, parseInt(limit));

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { projects, count: projects.length },
        'Search results retrieved successfully'
    );
});

/**
 * Like/unlike project
 * @route POST /api/v1/projects/:id/like
 * @access Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
    const result = await codeProjectService.toggleLike(req.params.id, req.user.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        result,
        result.liked ? 'Project liked' : 'Project unliked'
    );
});

/**
 * Fork project
 * @route POST /api/v1/projects/:id/fork
 * @access Private
 */
export const forkProject = asyncHandler(async (req, res) => {
    const { title } = req.body;

    const project = await codeProjectService.forkProject(
        req.params.id,
        req.user.id,
        title
    );

    ApiResponse.send(
        res,
        HTTP_STATUS.CREATED,
        { project },
        'Project forked successfully'
    );
});

/**
 * Get project statistics
 * @route GET /api/v1/projects/:id/stats
 * @access Public
 */
export const getProjectStats = asyncHandler(async (req, res) => {
    const stats = await codeProjectService.getProjectStats(req.params.id);

    ApiResponse.send(
        res,
        HTTP_STATUS.OK,
        { stats },
        'Project statistics retrieved successfully'
    );
});

export default {
    createProject,
    getMyProjects,
    getProjectById,
    updateProject,
    deleteProject,
    getPublicProjects,
    getTrendingProjects,
    searchProjects,
    toggleLike,
    forkProject,
    getProjectStats,
};
