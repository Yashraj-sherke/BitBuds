import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Badge name is required'],
            unique: true,
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Badge description is required'],
            trim: true,
            maxlength: [300, 'Description cannot exceed 300 characters'],
        },
        icon: {
            type: String, // URL or emoji
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                'mission_completion',
                'streak',
                'xp_milestone',
                'skill_mastery',
                'special_achievement',
                'social',
            ],
        },
        rarity: {
            type: String,
            enum: ['Common', 'Rare', 'Epic', 'Legendary'],
            default: 'Common',
        },
        criteria: {
            type: {
                type: String,
                enum: [
                    'complete_missions',
                    'earn_xp',
                    'maintain_streak',
                    'master_category',
                    'complete_all_beginner',
                    'complete_all_intermediate',
                    'complete_all_advanced',
                    'custom',
                ],
                required: true,
            },
            value: {
                type: Number, // e.g., 10 missions, 1000 XP, 7 days streak
            },
            category: {
                type: String, // For category-specific badges
            },
            customLogic: {
                type: String, // For complex achievement logic
            },
        },
        xpReward: {
            type: Number,
            default: 50,
            min: [0, 'XP reward cannot be negative'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
badgeSchema.index({ category: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1 });
badgeSchema.index({ order: 1 });

// Static method to get badges by category
badgeSchema.statics.findByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ order: 1 });
};

// Static method to get badges by rarity
badgeSchema.statics.findByRarity = function (rarity) {
    return this.find({ rarity, isActive: true }).sort({ order: 1 });
};

// Method to check if user earned this badge
badgeSchema.methods.checkEligibility = async function (userId) {
    const UserStats = mongoose.model('UserStats');
    const Progress = mongoose.model('Progress');

    const stats = await UserStats.findOne({ user: userId });
    if (!stats) return false;

    switch (this.criteria.type) {
        case 'earn_xp':
            return stats.totalXP >= this.criteria.value;

        case 'maintain_streak':
            return stats.currentStreak >= this.criteria.value;

        case 'complete_missions':
            return stats.missionsCompleted >= this.criteria.value;

        case 'master_category':
            const categoryProgress = await Progress.find({
                user: userId,
                isCompleted: true,
            }).populate('mission');

            const categoryMissions = categoryProgress.filter(
                p => p.mission.category === this.criteria.category
            );

            const Mission = mongoose.model('Mission');
            const totalCategoryMissions = await Mission.countDocuments({
                category: this.criteria.category,
                isActive: true,
            });

            return categoryMissions.length === totalCategoryMissions;

        case 'complete_all_beginner':
        case 'complete_all_intermediate':
        case 'complete_all_advanced':
            const difficulty = this.criteria.type.replace('complete_all_', '');
            const difficultyCapitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

            const completedDifficulty = await Progress.find({
                user: userId,
                isCompleted: true,
            }).populate('mission');

            const difficultyMissions = completedDifficulty.filter(
                p => p.mission.difficulty === difficultyCapitalized
            );

            const Mission2 = mongoose.model('Mission');
            const totalDifficultyMissions = await Mission2.countDocuments({
                difficulty: difficultyCapitalized,
                isActive: true,
            });

            return difficultyMissions.length === totalDifficultyMissions;

        default:
            return false;
    }
};

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;
