import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: [mongoose.Schema.Types.Mixed], default: [] },
    expected: { type: mongoose.Schema.Types.Mixed, required: true },
    functionName: { type: String, required: true },
  },
  { _id: false }
);

const missionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Beginner', 'Intermediate', 'Advanced'], default: 'Easy' },
    duration: { type: Number, default: 15 },
    xpReward: { type: Number, default: 50 },
    codeTemplate: { type: String, default: '' },
    testCases: { type: [testCaseSchema], default: [] },
    category: { type: String, default: 'basics' },
    topics: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

missionSchema.index({ category: 1, difficulty: 1, order: 1 });

const Mission = mongoose.model('Mission', missionSchema);
export default Mission;
