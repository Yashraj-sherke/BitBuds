import UserStats from '../models/UserStats.model.js';
import Progress from '../models/Progress.model.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

class StatsService {
    /**
     * Get user stats
     */
    async getUserStats(userId) {
        let userStats = await UserStats.findOne({ user: userId }).populate('badges.badge');

        if (!userStats) {
            // Create stats if they don't exist
            userStats = new UserStats({ user: userId });
            await userStats.save();
        }

        return userStats;
    }

    /**
     * Get user dashboard data
     */
    async getUserDashboard(userId) {
        const stats = await this.getUserStats(userId);
        const inProgressMissions = await Progress.getInProgressMissions(userId);
        const recentCompletions = await Progress.find({
            user: userId,
            isCompleted: true
        })
            .sort({ completedAt: -1 })
            .limit(5)
            .populate('mission');

        const rank = await UserStats.getUserRank(userId);

        return {
            stats: stats.toObject(),
            rank,
            inProgressMissions,
            recentCompletions,
        };
    }

    /**
     * Get leaderboard
     */
    async getLeaderboard(limit = 10, skip = 0) {
        const leaderboard = await UserStats.find()
            .sort({ totalXP: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'firstName lastName profilePicture');

        const total = await UserStats.countDocuments();

        return {
            leaderboard,
            total,
            page: Math.floor(skip / limit) + 1,
            pages: Math.ceil(total / limit),
        };
    }

    /**
     * Get user rank
     */
    async getUserRank(userId) {
        const rank = await UserStats.getUserRank(userId);
        const total = await UserStats.countDocuments();

        return {
            rank,
            total,
            percentile: total > 0 ? ((total - rank + 1) / total) * 100 : 0,
        };
    }

    /**
     * Add XP to user
     */
    async addXP(userId, xp, source = 'manual') {
        let userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            userStats = new UserStats({ user: userId });
        }

        const result = await userStats.addXP(xp);

        return {
            ...result,
            source,
        };
    }

    /**
     * Update streak
     */
    async updateStreak(userId) {
        let userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            userStats = new UserStats({ user: userId });
            await userStats.save();
        }

        const streak = await userStats.updateStreak();

        return {
            currentStreak: streak,
            longestStreak: userStats.longestStreak,
        };
    }

    /**
     * Get category progress
     */
    async getCategoryProgress(userId) {
        const userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            return {};
        }

        return userStats.categoryProgress;
    }

    /**
     * Get user achievements
     */
    async getUserAchievements(userId) {
        const userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            return {};
        }

        return userStats.achievements;
    }

    /**
     * Get global statistics
     */
    async getGlobalStats() {
        const totalUsers = await UserStats.countDocuments();

        const totalXPAwarded = await UserStats.aggregate([
            { $group: { _id: null, total: { $sum: '$totalXP' } } }
        ]);

        const totalMissionsCompleted = await UserStats.aggregate([
            { $group: { _id: null, total: { $sum: '$missionsCompleted' } } }
        ]);

        const totalBadgesEarned = await UserStats.aggregate([
            { $group: { _id: null, total: { $sum: { $size: '$badges' } } } }
        ]);

        const avgLevel = await UserStats.aggregate([
            { $group: { _id: null, avg: { $avg: '$level' } } }
        ]);

        const longestStreak = await UserStats.findOne().sort({ longestStreak: -1 });

        return {
            totalUsers,
            totalXPAwarded: totalXPAwarded[0]?.total || 0,
            totalMissionsCompleted: totalMissionsCompleted[0]?.total || 0,
            totalBadgesEarned: totalBadgesEarned[0]?.total || 0,
            averageLevel: avgLevel[0]?.avg || 1,
            longestStreak: longestStreak?.longestStreak || 0,
        };
    }

    /**
     * Get user activity timeline
     */
    async getUserActivity(userId, limit = 20) {
        const completions = await Progress.find({
            user: userId,
            isCompleted: true,
        })
            .sort({ completedAt: -1 })
            .limit(limit)
            .populate('mission');

        const userStats = await UserStats.findOne({ user: userId }).populate('badges.badge');

        const activities = [];

        // Add mission completions
        completions.forEach(completion => {
            activities.push({
                type: 'mission_completed',
                mission: completion.mission,
                xpEarned: completion.xpEarned,
                timestamp: completion.completedAt,
            });
        });

        // Add badge earnings
        if (userStats) {
            userStats.badges.forEach(badge => {
                activities.push({
                    type: 'badge_earned',
                    badge: badge.badge,
                    timestamp: badge.earnedAt,
                });
            });
        }

        // Sort by timestamp
        activities.sort((a, b) => b.timestamp - a.timestamp);

        return activities.slice(0, limit);
    }

    /**
     * Compare users
     */
    async compareUsers(userId1, userId2) {
        const stats1 = await this.getUserStats(userId1);
        const stats2 = await this.getUserStats(userId2);

        return {
            user1: {
                stats: stats1.toObject(),
                rank: await UserStats.getUserRank(userId1),
            },
            user2: {
                stats: stats2.toObject(),
                rank: await UserStats.getUserRank(userId2),
            },
        };
    }
}

export default new StatsService();
