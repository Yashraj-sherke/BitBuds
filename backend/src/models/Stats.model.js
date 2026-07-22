import mongoose from 'mongoose';

const statsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    level: { type: Number, default: 1 },
    totalXP: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: null },
    missionsCompleted: { type: Number, default: 0 },
    completedMissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mission' }],
    categoryProgress: {
      type: Map,
      of: { completed: Number, total: Number },
      default: {},
    },
    activityLog: [
      {
        type: { type: String },
        message: String,
        xpEarned: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

statsSchema.index({ totalXP: -1 });
// userId index is created automatically due to unique: true in schema

const Stats = mongoose.model('Stats', statsSchema);
export default Stats;
