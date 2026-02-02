import mongoose from 'mongoose';
import crypto from 'crypto';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    userAgent: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for optimized queries
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });
refreshTokenSchema.index({ expiresAt: 1 });
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

// Compound index for token lookup
refreshTokenSchema.index({ token: 1, isRevoked: 1 });

// TTL index to automatically delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash token before saving
refreshTokenSchema.pre('save', function (next) {
  if (!this.isModified('token')) {
    return next();
  }

  // Hash the token for security
  this.token = crypto.createHash('sha256').update(this.token).digest('hex');
  next();
});

// Static method to create refresh token
refreshTokenSchema.statics.createToken = async function (userId, token, expiresAt, userAgent, ipAddress) {
  return await this.create({
    userId,
    token,
    expiresAt,
    userAgent,
    ipAddress,
  });
};

// Static method to find valid token
refreshTokenSchema.statics.findValidToken = async function (token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return await this.findOne({
    token: hashedToken,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  });
};

// Static method to revoke token
refreshTokenSchema.statics.revokeToken = async function (token) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  return await this.updateOne(
    { token: hashedToken },
    { isRevoked: true }
  );
};

// Static method to revoke all user tokens
refreshTokenSchema.statics.revokeAllUserTokens = async function (userId) {
  return await this.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

// Static method to clean expired tokens
refreshTokenSchema.statics.cleanExpiredTokens = async function () {
  return await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
