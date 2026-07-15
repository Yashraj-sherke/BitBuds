import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: '' },
    emoji: { type: String, default: '🏅' },
    criteriaType: { type: String, enum: ['xp', 'missions', 'streak'], required: true },
    criteriaValue: { type: Number, required: true },
    category: { type: String, default: 'achievement' },
    rarity: { type: String, enum: ['Common', 'Rare', 'Epic', 'Legendary'], default: 'Common' },
    xpReward: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.icon = ret.emoji;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

badgeSchema.virtual('icon').get(function () {
  return this.emoji;
});

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;
