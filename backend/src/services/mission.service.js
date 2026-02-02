import Mission from '../models/Mission.model.js';
import Progress from '../models/Progress.model.js';
import UserStats from '../models/UserStats.model.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

class MissionService {
    /**
     * Get all missions with optional filtering
     */
    async getAllMissions(filters = {}) {
        const { category, difficulty, isActive = true } = filters;

        const query = { isActive };

        if (category) {
            query.category = category;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        const missions = await Mission.find(query).sort({ order: 1 });
        return missions;
    }

    /**
     * Get mission by ID
     */
    async getMissionById(missionId) {
        const mission = await Mission.findById(missionId);

        if (!mission) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Mission not found');
        }

        return mission;
    }

    /**
     * Get missions for a specific user (with access control)
     */
    async getUserMissions(userId) {
        const missions = await Mission.find({ isActive: true }).sort({ order: 1 });
        const userProgress = await Progress.find({ user: userId });

        // Create a map of mission progress
        const progressMap = {};
        userProgress.forEach(p => {
            progressMap[p.mission.toString()] = p;
        });

        // Enhance missions with user progress and access status
        const enhancedMissions = await Promise.all(
            missions.map(async (mission) => {
                const missionObj = mission.toObject();
                const progress = progressMap[mission._id.toString()];

                // Check if user can access this mission
                const canAccess = await mission.canUserAccess(userId);

                return {
                    ...missionObj,
                    isLocked: !canAccess,
                    progress: progress ? progress.progress : 0,
                    isCompleted: progress ? progress.isCompleted : false,
                    status: progress ? progress.status : 'not_started',
                    attempts: progress ? progress.attempts : 0,
                };
            })
        );

        return enhancedMissions;
    }

    /**
     * Get missions by category
     */
    async getMissionsByCategory(category) {
        const missions = await Mission.findByCategory(category);
        return missions;
    }

    /**
     * Get missions by difficulty
     */
    async getMissionsByDifficulty(difficulty) {
        const missions = await Mission.findByDifficulty(difficulty);
        return missions;
    }

    /**
     * Create a new mission (Admin only)
     */
    async createMission(missionData) {
        const mission = new Mission(missionData);
        await mission.save();

        // Update category totals in all user stats
        await UserStats.updateMany(
            {},
            { $inc: { [`categoryProgress.${mission.category}.total`]: 1 } }
        );

        return mission;
    }

    /**
     * Update mission (Admin only)
     */
    async updateMission(missionId, updateData) {
        const mission = await Mission.findByIdAndUpdate(
            missionId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!mission) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Mission not found');
        }

        return mission;
    }

    /**
     * Delete mission (Admin only)
     */
    async deleteMission(missionId) {
        const mission = await Mission.findByIdAndDelete(missionId);

        if (!mission) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Mission not found');
        }

        // Delete associated progress records
        await Progress.deleteMany({ mission: missionId });

        return mission;
    }

    /**
     * Start a mission for a user
     */
    async startMission(userId, missionId) {
        // Check if mission exists
        const mission = await this.getMissionById(missionId);

        // Check if user can access this mission
        const canAccess = await mission.canUserAccess(userId);
        if (!canAccess) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, 'Prerequisites not completed');
        }

        // Find or create progress record
        let progress = await Progress.findOne({ user: userId, mission: missionId });

        if (!progress) {
            progress = new Progress({
                user: userId,
                mission: missionId,
            });
        }

        await progress.startMission();

        return {
            mission,
            progress,
        };
    }

    /**
     * Submit mission attempt
     */
    async submitMission(userId, missionId, submissionData) {
        const { userCode, testResults, passed = false } = submissionData;

        let progress = await Progress.findOne({ user: userId, mission: missionId });

        if (!progress) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Mission not started');
        }

        // Update progress with submission data
        if (userCode) {
            progress.userCode = userCode;
        }

        if (testResults) {
            progress.testResults.push(...testResults);
        }

        // Record attempt
        const result = await progress.recordAttempt(passed);

        return result;
    }

    /**
     * Get mission statistics
     */
    async getMissionStats(missionId) {
        const totalAttempts = await Progress.countDocuments({ mission: missionId });
        const completions = await Progress.countDocuments({
            mission: missionId,
            isCompleted: true
        });

        const avgProgress = await Progress.aggregate([
            { $match: { mission: missionId } },
            { $group: { _id: null, avgProgress: { $avg: '$progress' } } }
        ]);

        const avgAttempts = await Progress.aggregate([
            { $match: { mission: missionId, isCompleted: true } },
            { $group: { _id: null, avgAttempts: { $avg: '$attempts' } } }
        ]);

        return {
            totalAttempts,
            completions,
            completionRate: totalAttempts > 0 ? (completions / totalAttempts) * 100 : 0,
            averageProgress: avgProgress[0]?.avgProgress || 0,
            averageAttempts: avgAttempts[0]?.avgAttempts || 0,
        };
    }
}

export default new MissionService();
