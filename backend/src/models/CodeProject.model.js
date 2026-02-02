import mongoose from 'mongoose';

const codeProjectSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        type: {
            type: String,
            enum: ['blocks', 'code', 'animation', 'game'],
            default: 'blocks',
        },
        content: {
            blocks: {
                type: String, // JSON string of block configuration
            },
            code: {
                type: String, // Generated or written code
            },
            assets: [{
                name: String,
                url: String,
                type: String, // image, sound, etc.
            }],
        },
        thumbnail: {
            type: String, // URL to project thumbnail
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        isTemplate: {
            type: Boolean,
            default: false,
        },
        tags: [{
            type: String,
            trim: true,
        }],
        likes: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        forkedFrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CodeProject',
        },
        forkCount: {
            type: Number,
            default: 0,
        },
        lastEditedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
codeProjectSchema.index({ user: 1, createdAt: -1 });
codeProjectSchema.index({ isPublic: 1, likes: -1 });
codeProjectSchema.index({ isPublic: 1, views: -1 });
codeProjectSchema.index({ tags: 1 });
codeProjectSchema.index({ type: 1 });

// Virtual for fork status
codeProjectSchema.virtual('isFork').get(function () {
    return !!this.forkedFrom;
});

// Method to like project
codeProjectSchema.methods.likeProject = async function (userId) {
    const alreadyLiked = this.likedBy.includes(userId);

    if (alreadyLiked) {
        // Unlike
        this.likedBy = this.likedBy.filter(id => id.toString() !== userId.toString());
        this.likes = Math.max(0, this.likes - 1);
    } else {
        // Like
        this.likedBy.push(userId);
        this.likes += 1;
    }

    await this.save();
    return { liked: !alreadyLiked, likes: this.likes };
};

// Method to increment views
codeProjectSchema.methods.incrementViews = async function () {
    this.views += 1;
    await this.save({ validateBeforeSave: false });
    return this.views;
};

// Method to fork project
codeProjectSchema.methods.forkProject = async function (userId, newTitle) {
    const forkedProject = new this.constructor({
        user: userId,
        title: newTitle || `${this.title} (Fork)`,
        description: this.description,
        type: this.type,
        content: {
            blocks: this.content.blocks,
            code: this.content.code,
            assets: this.content.assets,
        },
        tags: this.tags,
        forkedFrom: this._id,
        isPublic: false, // Forks start as private
    });

    await forkedProject.save();

    // Increment fork count on original
    this.forkCount += 1;
    await this.save({ validateBeforeSave: false });

    return forkedProject;
};

// Static method to get user projects
codeProjectSchema.statics.getUserProjects = function (userId) {
    return this.find({ user: userId }).sort({ lastEditedAt: -1 });
};

// Static method to get public projects
codeProjectSchema.statics.getPublicProjects = function (limit = 20, skip = 0) {
    return this.find({ isPublic: true })
        .sort({ likes: -1, views: -1 })
        .limit(limit)
        .skip(skip)
        .populate('user', 'firstName lastName profilePicture');
};

// Static method to get trending projects
codeProjectSchema.statics.getTrendingProjects = function (limit = 10) {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return this.find({
        isPublic: true,
        createdAt: { $gte: oneWeekAgo },
    })
        .sort({ likes: -1, views: -1 })
        .limit(limit)
        .populate('user', 'firstName lastName profilePicture');
};

// Static method to search projects
codeProjectSchema.statics.searchProjects = function (query, limit = 20) {
    return this.find({
        isPublic: true,
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
        ],
    })
        .limit(limit)
        .populate('user', 'firstName lastName profilePicture');
};

const CodeProject = mongoose.model('CodeProject', codeProjectSchema);

export default CodeProject;
