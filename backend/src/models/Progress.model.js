import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        mission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mission',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started',
        },
        progress: {
            type: Number,
            default: 0,
            min: [0, 'Progress cannot be negative'],
            max: [100, 'Progress cannot exceed 100'],
        },
        isCompleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        completedAt: {
            type: Date,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        hintsUsed: {
            type: Number,
            default: 0,
        },
        timeSpent: {
            type: Number, // in seconds
            default: 0,
        },
        lastAttemptAt: {
            type: Date,
        },
        userCode: {
            type: String, // JSON string of user's code/blocks
        },
        testResults: [{
            testCase: {
                type: Number, // Index of test case
            },
            passed: {
                type: Boolean,
            },
            attemptedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        score: {
            type: Number,
            min: [0, 'Score cannot be negative'],
            max: [100, 'Score cannot exceed 100'],
        },
        xpEarned: {
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

// Compound indexes
progressSchema.index({ user: 1, mission: 1 }, { unique: true });
progressSchema.index({ user: 1, isCompleted: 1 });
progressSchema.index({ user: 1, status: 1 });

// Virtual for completion percentage
progressSchema.virtual('completionPercentage').get(function () {
    return this.progress;
});

// Method to start mission
progressSchema.methods.startMission = async function () {
    if (this.status === 'not_started') {
        this.status = 'in_progress';
        this.lastAttemptAt = new Date();
        await this.save();
    }
    return this;
};

// Method to update progress
progressSchema.methods.updateProgress = async function (newProgress) {
    this.progress = Math.min(100, Math.max(0, newProgress));
    this.status = this.progress === 100 ? 'completed' : 'in_progress';
    this.lastAttemptAt = new Date();

    if (this.progress === 100 && !this.isCompleted) {
        await this.completeMission();
    }

    await this.save();
    return this;
};

// Method to complete mission
progressSchema.methods.completeMission = async function () {
    if (this.isCompleted) {
        return { alreadyCompleted: true };
    }

    this.isCompleted = true;
    this.completedAt = new Date();
    this.progress = 100;
    this.status = 'completed';

    // Get mission to award XP
    const mission = await mongoose.model('Mission').findById(this.mission);
    if (!mission) {
        throw new Error('Mission not found');
    }

    // Calculate XP based on performance
    let xpMultiplier = 1.0;

    // Bonus for completing with fewer hints
    if (this.hintsUsed === 0) {
        xpMultiplier += 0.2; // 20% bonus
    } else if (this.hintsUsed <= 2) {
        xpMultiplier += 0.1; // 10% bonus
    }

    // Bonus for completing on first attempt
    if (this.attempts <= 1) {
        xpMultiplier += 0.3; // 30% bonus
    }

    this.xpEarned = Math.floor(mission.xpReward * xpMultiplier);

    // Update user stats
    const UserStats = mongoose.model('UserStats');
    let userStats = await UserStats.findOne({ user: this.user });

    if (!userStats) {
        userStats = new UserStats({ user: this.user });
    }

    // Add XP and update stats
    await userStats.addXP(this.xpEarned);
    userStats.missionsCompleted += 1;

    // Update category progress
    if (userStats.categoryProgress[mission.category]) {
        userStats.categoryProgress[mission.category].completed += 1;
    }

    // Update streak
    await userStats.updateStreak();

    // Check for first mission achievement
    if (userStats.missionsCompleted === 1 && !userStats.achievements.firstMissionCompleted) {
        userStats.achievements.firstMissionCompleted = true;
    }

    await userStats.save();
    await this.save();

    // Check for badge eligibility
    const Badge = mongoose.model('Badge');
    const badges = await Badge.find({ isActive: true });

    const newBadges = [];
    for (const badge of badges) {
        const eligible = await badge.checkEligibility(this.user);
        if (eligible) {
            const result = await userStats.awardBadge(badge._id);
            if (result.awarded) {
                newBadges.push(badge);
                // Add badge XP
                await userStats.addXP(badge.xpReward);
            }
        }
    }

    return {
        xpEarned: this.xpEarned,
        newLevel: userStats.level,
        newBadges,
        currentStreak: userStats.currentStreak,
    };
};

// Method to record attempt
progressSchema.methods.recordAttempt = async function (passed = false) {
    this.attempts += 1;
    this.lastAttemptAt = new Date();

    if (passed) {
        await this.completeMission();
    }

    await this.save();
    return this;
};

// Method to use hint
progressSchema.methods.useHint = async function () {
    this.hintsUsed += 1;
    await this.save();
    return this;
};

// Static method to get user progress
progressSchema.statics.getUserProgress = function (userId) {
    return this.find({ user: userId })
        .populate('mission')
        .sort({ updatedAt: -1 });
};

// Static method to get completed missions
progressSchema.statics.getCompletedMissions = function (userId) {
    return this.find({ user: userId, isCompleted: true })
        .populate('mission')
        .sort({ completedAt: -1 });
};

// Static method to get in-progress missions
progressSchema.statics.getInProgressMissions = function (userId) {
    return this.find({ user: userId, status: 'in_progress' })
        .populate('mission')
        .sort({ lastAttemptAt: -1 });
};

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
