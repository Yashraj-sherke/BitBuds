import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Mission title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Mission description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['basics', 'loops', 'conditionals', 'functions', 'arrays', 'objects', 'events', 'animations'],
            index: true,
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty is required'],
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner',
        },
        topics: [{
            type: String,
            trim: true,
        }],
        duration: {
            type: Number, // in minutes
            required: [true, 'Duration is required'],
            min: [5, 'Duration must be at least 5 minutes'],
            max: [120, 'Duration cannot exceed 120 minutes'],
        },
        xpReward: {
            type: Number,
            required: [true, 'XP reward is required'],
            min: [0, 'XP reward cannot be negative'],
            default: 100,
        },
        order: {
            type: Number,
            required: true,
            default: 0,
        },
        prerequisites: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mission',
        }],
        content: {
            instructions: {
                type: String,
                required: true,
            },
            hints: [{
                type: String,
            }],
            solution: {
                type: String, // JSON string of block configuration or code
            },
            testCases: [{
                input: mongoose.Schema.Types.Mixed,
                expectedOutput: mongoose.Schema.Types.Mixed,
            }],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        thumbnail: {
            type: String, // URL to mission thumbnail image
        },
        badgeReward: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for optimized queries
missionSchema.index({ category: 1, difficulty: 1 });
missionSchema.index({ order: 1 });
missionSchema.index({ isActive: 1 });
missionSchema.index({ xpReward: -1 });

// Virtual for formatted duration
missionSchema.virtual('formattedDuration').get(function () {
    if (this.duration < 60) {
        return `${this.duration} min`;
    }
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
});

// Static method to get missions by category
missionSchema.statics.findByCategory = function (category) {
    return this.find({ category, isActive: true }).sort({ order: 1 });
};

// Static method to get missions by difficulty
missionSchema.statics.findByDifficulty = function (difficulty) {
    return this.find({ difficulty, isActive: true }).sort({ order: 1 });
};

// Static method to get beginner missions
missionSchema.statics.getBeginnerMissions = function () {
    return this.find({ difficulty: 'Beginner', isActive: true }).sort({ order: 1 });
};

// Method to check if user can access this mission
missionSchema.methods.canUserAccess = async function (userId) {
    if (this.prerequisites.length === 0) {
        return true;
    }

    const Progress = mongoose.model('Progress');
    const completedMissions = await Progress.find({
        user: userId,
        mission: { $in: this.prerequisites },
        isCompleted: true,
    }).countDocuments();

    return completedMissions === this.prerequisites.length;
};

const Mission = mongoose.model('Mission', missionSchema);

export default Mission;
