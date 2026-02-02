import CodeProject from '../models/CodeProject.model.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

class CodeProjectService {
    /**
     * Create a new project
     */
    async createProject(userId, projectData) {
        const project = new CodeProject({
            ...projectData,
            user: userId,
        });

        await project.save();
        return project;
    }

    /**
     * Get user's projects
     */
    async getUserProjects(userId) {
        const projects = await CodeProject.getUserProjects(userId);
        return projects;
    }

    /**
     * Get project by ID
     */
    async getProjectById(projectId, userId = null) {
        const project = await CodeProject.findById(projectId).populate('user', 'firstName lastName profilePicture');

        if (!project) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
        }

        // Check if user can access this project
        if (!project.isPublic && userId && project.user._id.toString() !== userId.toString()) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Access denied to private project');
        }

        // Increment views if not the owner
        if (userId && project.user._id.toString() !== userId.toString()) {
            await project.incrementViews();
        }

        return project;
    }

    /**
     * Update project
     */
    async updateProject(projectId, userId, updateData) {
        const project = await CodeProject.findById(projectId);

        if (!project) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
        }

        // Check ownership
        if (project.user.toString() !== userId.toString()) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only update your own projects');
        }

        Object.assign(project, updateData);
        project.lastEditedAt = new Date();

        await project.save();
        return project;
    }

    /**
     * Delete project
     */
    async deleteProject(projectId, userId) {
        const project = await CodeProject.findById(projectId);

        if (!project) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
        }

        // Check ownership
        if (project.user.toString() !== userId.toString()) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'You can only delete your own projects');
        }

        await CodeProject.findByIdAndDelete(projectId);
        return project;
    }

    /**
     * Get public projects
     */
    async getPublicProjects(limit = 20, skip = 0) {
        const projects = await CodeProject.getPublicProjects(limit, skip);
        const total = await CodeProject.countDocuments({ isPublic: true });

        return {
            projects,
            total,
            page: Math.floor(skip / limit) + 1,
            pages: Math.ceil(total / limit),
        };
    }

    /**
     * Get trending projects
     */
    async getTrendingProjects(limit = 10) {
        const projects = await CodeProject.getTrendingProjects(limit);
        return projects;
    }

    /**
     * Search projects
     */
    async searchProjects(query, limit = 20) {
        const projects = await CodeProject.searchProjects(query, limit);
        return projects;
    }

    /**
     * Like/unlike project
     */
    async toggleLike(projectId, userId) {
        const project = await CodeProject.findById(projectId);

        if (!project) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
        }

        if (!project.isPublic) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot like private projects');
        }

        const result = await project.likeProject(userId);
        return result;
    }

    /**
     * Fork project
     */
    async forkProject(projectId, userId, newTitle) {
        const originalProject = await CodeProject.findById(projectId);

        if (!originalProject) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
        }

        if (!originalProject.isPublic) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Cannot fork private projects');
        }

        const forkedProject = await originalProject.forkProject(userId, newTitle);
        return forkedProject;
    }

    /**
     * Get project statistics
     */
    async getProjectStats(projectId) {
        const project = await CodeProject.findById(projectId);

        if (!project) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
        }

        return {
            views: project.views,
            likes: project.likes,
            forks: project.forkCount,
            isFork: !!project.forkedFrom,
        };
    }
}

export default new CodeProjectService();
