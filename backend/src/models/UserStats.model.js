import mongoose from 'mongoose';

const userStatsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true,
        },
        totalXP: {
            type: Number,
            default: 0,
            min: [0, 'XP cannot be negative'],
        },
        level: {
            type: Number,
            default: 1,
            min: [1, 'Level must be at least 1'],
        },
        currentStreak: {
            type: Number,
            default: 0,
            min: [0, 'Streak cannot be negative'],
        },
        longestStreak: {
            type: Number,
            default: 0,
            min: [0, 'Longest streak cannot be negative'],
        },
        lastActivityDate: {
            type: Date,
            default: Date.now,
        },
        missionsCompleted: {
            type: Number,
            default: 0,
            min: [0, 'Missions completed cannot be negative'],
        },
        badges: [{
            badge: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Badge',
            },
            earnedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        categoryProgress: {
            basics: {
                completed: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
            loops: {
                completed: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
            conditionals: {
                completed: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
            functions: {
                completed: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
            arrays: {
                completed: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
            objects: {
                completed: { type: Number, default: 0 },
                total: { type: Number, default: 0 },
            },
        },
        achievements: {
            firstMissionCompleted: { type: Boolean, default: false },
            firstBadgeEarned: { type: Boolean, default: false },
            reachedLevel5: { type: Boolean, default: false },
            reachedLevel10: { type: Boolean, default: false },
            weekStreak: { type: Boolean, default: false },
            monthStreak: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
userStatsSchema.index({ totalXP: -1 }); // For leaderboard
userStatsSchema.index({ level: -1 });
userStatsSchema.index({ currentStreak: -1 });
userStatsSchema.index({ lastActivityDate: -1 });

// Virtual for XP needed for next level
userStatsSchema.virtual('xpForNextLevel').get(function () {
    return this.calculateXPForLevel(this.level + 1);
});

// Virtual for progress to next level
userStatsSchema.virtual('progressToNextLevel').get(function () {
    const currentLevelXP = this.calculateXPForLevel(this.level);
    const nextLevelXP = this.calculateXPForLevel(this.level + 1);
    const xpInCurrentLevel = this.totalXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    return Math.floor((xpInCurrentLevel / xpNeededForLevel) * 100);
});

// Calculate XP required for a specific level
userStatsSchema.methods.calculateXPForLevel = function (level) {
    // Formula: XP = 100 * level^2
    return 100 * Math.pow(level, 2);
};

// Add XP and check for level up
userStatsSchema.methods.addXP = async function (xp) {
    this.totalXP += xp;

    // Check for level up
    const newLevel = this.calculateLevel(this.totalXP);
    const leveledUp = newLevel > this.level;

    if (leveledUp) {
        this.level = newLevel;

        // Check for level achievements
        if (this.level >= 5 && !this.achievements.reachedLevel5) {
            this.achievements.reachedLevel5 = true;
        }
        if (this.level >= 10 && !this.achievements.reachedLevel10) {
            this.achievements.reachedLevel10 = true;
        }
    }

    await this.save();

    return {
        leveledUp,
        newLevel: this.level,
        totalXP: this.totalXP,
    };
};

// Calculate level based on total XP
userStatsSchema.methods.calculateLevel = function (totalXP) {
    // Inverse of XP formula: level = sqrt(XP / 100)
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

// Update streak
userStatsSchema.methods.updateStreak = async function () {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(this.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) {
        // Same day, no change
        return this.currentStreak;
    } else if (daysDifference === 1) {
        // Consecutive day, increment streak
        this.currentStreak += 1;

        if (this.currentStreak > this.longestStreak) {
            this.longestStreak = this.currentStreak;
        }

        // Check for streak achievements
        if (this.currentStreak >= 7 && !this.achievements.weekStreak) {
            this.achievements.weekStreak = true;
        }
        if (this.currentStreak >= 30 && !this.achievements.monthStreak) {
            this.achievements.monthStreak = true;
        }
    } else {
        // Streak broken
        this.currentStreak = 1;
    }

    this.lastActivityDate = new Date();
    await this.save();

    return this.currentStreak;
};

// Award badge
userStatsSchema.methods.awardBadge = async function (badgeId) {
    // Check if badge already earned
    const alreadyHas = this.badges.some(b => b.badge.toString() === badgeId.toString());

    if (alreadyHas) {
        return { awarded: false, message: 'Badge already earned' };
    }

    this.badges.push({
        badge: badgeId,
        earnedAt: new Date(),
    });

    if (this.badges.length === 1 && !this.achievements.firstBadgeEarned) {
        this.achievements.firstBadgeEarned = true;
    }

    await this.save();

    return { awarded: true, message: 'Badge earned!' };
};

// Static method to get leaderboard
userStatsSchema.statics.getLeaderboard = function (limit = 10) {
    return this.find()
        .sort({ totalXP: -1 })
        .limit(limit)
        .populate('user', 'firstName lastName profilePicture');
};

// Static method to get user rank
userStatsSchema.statics.getUserRank = async function (userId) {
    const userStats = await this.findOne({ user: userId });
    if (!userStats) return null;

    const rank = await this.countDocuments({ totalXP: { $gt: userStats.totalXP } });
    return rank + 1;
};

const UserStats = mongoose.model('UserStats', userStatsSchema);

export default UserStats;
