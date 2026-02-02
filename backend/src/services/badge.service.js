import Badge from '../models/Badge.model.js';
import UserStats from '../models/UserStats.model.js';
import ApiError from '../utils/ApiError.js';
import { HTTP_STATUS } from '../utils/constants.js';

class BadgeService {
    /**
     * Get all badges
     */
    async getAllBadges(filters = {}) {
        const { category, rarity, isActive = true } = filters;

        const query = { isActive };

        if (category) {
            query.category = category;
        }

        if (rarity) {
            query.rarity = rarity;
        }

        const badges = await Badge.find(query).sort({ order: 1 });
        return badges;
    }

    /**
     * Get badge by ID
     */
    async getBadgeById(badgeId) {
        const badge = await Badge.findById(badgeId);

        if (!badge) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Badge not found');
        }

        return badge;
    }

    /**
     * Get user badges
     */
    async getUserBadges(userId) {
        const userStats = await UserStats.findOne({ user: userId }).populate('badges.badge');

        if (!userStats) {
            return [];
        }

        return userStats.badges;
    }

    /**
     * Get available badges for user (with eligibility status)
     */
    async getAvailableBadges(userId) {
        const allBadges = await Badge.find({ isActive: true }).sort({ order: 1 });
        const userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            return allBadges.map(badge => ({
                ...badge.toObject(),
                earned: false,
                eligible: false,
            }));
        }

        const earnedBadgeIds = userStats.badges.map(b => b.badge.toString());

        const badgesWithStatus = await Promise.all(
            allBadges.map(async (badge) => {
                const earned = earnedBadgeIds.includes(badge._id.toString());
                let eligible = false;

                if (!earned) {
                    eligible = await badge.checkEligibility(userId);
                }

                return {
                    ...badge.toObject(),
                    earned,
                    eligible,
                    earnedAt: earned
                        ? userStats.badges.find(b => b.badge.toString() === badge._id.toString())?.earnedAt
                        : null,
                };
            })
        );

        return badgesWithStatus;
    }

    /**
     * Award badge to user
     */
    async awardBadge(userId, badgeId) {
        const badge = await this.getBadgeById(badgeId);

        let userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            userStats = new UserStats({ user: userId });
            await userStats.save();
        }

        const result = await userStats.awardBadge(badgeId);

        if (result.awarded) {
            // Add badge XP
            await userStats.addXP(badge.xpReward);
        }

        return {
            ...result,
            badge,
            xpEarned: badge.xpReward,
        };
    }

    /**
     * Check and award eligible badges for user
     */
    async checkAndAwardBadges(userId) {
        const badges = await Badge.find({ isActive: true });
        const userStats = await UserStats.findOne({ user: userId });

        if (!userStats) {
            return [];
        }

        const newBadges = [];

        for (const badge of badges) {
            const eligible = await badge.checkEligibility(userId);

            if (eligible) {
                const result = await userStats.awardBadge(badge._id);

                if (result.awarded) {
                    newBadges.push({
                        badge,
                        earnedAt: new Date(),
                    });

                    // Add badge XP
                    await userStats.addXP(badge.xpReward);
                }
            }
        }

        return newBadges;
    }

    /**
     * Create badge (Admin only)
     */
    async createBadge(badgeData) {
        const badge = new Badge(badgeData);
        await badge.save();
        return badge;
    }

    /**
     * Update badge (Admin only)
     */
    async updateBadge(badgeId, updateData) {
        const badge = await Badge.findByIdAndUpdate(
            badgeId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!badge) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Badge not found');
        }

        return badge;
    }

    /**
     * Delete badge (Admin only)
     */
    async deleteBadge(badgeId) {
        const badge = await Badge.findByIdAndDelete(badgeId);

        if (!badge) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Badge not found');
        }

        // Remove badge from all user stats
        await UserStats.updateMany(
            {},
            { $pull: { badges: { badge: badgeId } } }
        );

        return badge;
    }

    /**
     * Get badge statistics
     */
    async getBadgeStats(badgeId) {
        const totalUsers = await UserStats.countDocuments({});
        const usersWithBadge = await UserStats.countDocuments({
            'badges.badge': badgeId,
        });

        return {
            totalUsers,
            usersWithBadge,
            earnRate: totalUsers > 0 ? (usersWithBadge / totalUsers) * 100 : 0,
        };
    }
}

export default new BadgeService();
