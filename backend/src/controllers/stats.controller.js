import User from '../models/User.model.js';
import Stats from '../models/Stats.model.js';
import Badge from '../models/Badge.model.js';
import Mission from '../models/Mission.model.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';
import { sendSuccess } from '../middleware/error.middleware.js';
import {
  getLeaderboardFromRedis,
  getUserRankFromRedis,
  isRedisAvailable,
  updateLeaderboardScore,
} from '../config/redis.js';

const ensureStats = async (userId) => {
  let stats = await Stats.findOne({ userId });
  if (!stats) {
    stats = await Stats.create({ userId });
  }
  return stats;
};

const populateLeaderboardUsers = async (entries) => {
  const userIds = entries.map((e) => e.userId);
  const users = await User.find({ _id: { $in: userIds } }).select('firstName lastName xp level profilePicture');
  const userMap = new Map(users.map((u) => [u._id.toString(), u]));

  return entries.map((entry, index) => {
    const user = userMap.get(entry.userId.toString());
    return {
      rank: entry.rank ?? index + 1,
      userId: entry.userId,
      xp: entry.xp,
      level: user?.level ?? 1,
      firstName: user?.firstName ?? 'Unknown',
      lastName: user?.lastName ?? '',
      profilePicture: user?.profilePicture ?? null,
    };
  });
};

const getMongoLeaderboard = async (limit, skip) => {
  const users = await User.find({ isActive: true }).sort({ xp: -1 }).skip(skip).limit(limit);
  return users.map((user, index) => ({
    rank: skip + index + 1,
    userId: user._id,
    xp: user.xp,
    level: user.level,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicture: user.profilePicture,
  }));
};

export const getMyStats = asyncHandler(async (req, res) => {
  const stats = await ensureStats(req.user.id);
  const user = await User.findById(req.user.id).populate('badges');

  sendSuccess(
    res,
    200,
    {
      stats: {
        totalXP: stats.totalXP,
        level: user.level,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
        missionsCompleted: stats.missionsCompleted,
        badges: user.badges || [],
        categoryProgress: Object.fromEntries(stats.categoryProgress || []),
        achievements: { badgeCount: user.badges?.length || 0 },
      },
    },
    'User stats retrieved successfully'
  );
});

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await ensureStats(req.user.id);
  const user = await User.findById(req.user.id).populate('badges');
  const recentMissions = await Mission.find({ _id: { $in: stats.completedMissions.slice(-5) } });

  sendSuccess(
    res,
    200,
    {
      user: {
        firstName: user.firstName,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
      },
      stats: {
        totalXP: stats.totalXP,
        currentStreak: stats.currentStreak,
        missionsCompleted: stats.missionsCompleted,
        badges: user.badges,
      },
      recentActivity: stats.activityLog.slice(0, 5),
      recentMissions,
    },
    'Dashboard data retrieved successfully'
  );
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
  const page = parseInt(req.query.page, 10) || 1;
  const skip = (page - 1) * limit;

  let leaderboard;
  let source = 'mongodb';

  if (isRedisAvailable()) {
    const redisEntries = await getLeaderboardFromRedis(limit, skip);
    if (redisEntries) {
      source = 'redis';
      leaderboard = await populateLeaderboardUsers(
        redisEntries.map((e, i) => ({ ...e, rank: skip + i + 1 }))
      );
    }
  }

  if (!leaderboard) {
    leaderboard = await getMongoLeaderboard(limit, skip);
  }

  sendSuccess(
    res,
    200,
    { leaderboard, page, limit, source },
    'Leaderboard retrieved successfully'
  );
});

export const getMyRank = asyncHandler(async (req, res) => {
  let rank = null;

  if (isRedisAvailable()) {
    rank = await getUserRankFromRedis(req.user.id);
  }

  if (rank === null) {
    const user = await User.findById(req.user.id);
    const higherCount = await User.countDocuments({ xp: { $gt: user.xp } });
    rank = higherCount + 1;
  }

  sendSuccess(res, 200, { rank }, 'User rank retrieved successfully');
});

export const getCategoryProgress = asyncHandler(async (req, res) => {
  const stats = await ensureStats(req.user.id);
  const categories = await Mission.distinct('category', { isActive: true });

  const progress = {};
  for (const category of categories) {
    const total = await Mission.countDocuments({ category, isActive: true });
    const stored = stats.categoryProgress.get(category);
    progress[category] = {
      completed: stored?.completed || 0,
      total,
      percentage: total ? Math.round(((stored?.completed || 0) / total) * 100) : 0,
    };
  }

  sendSuccess(res, 200, { progress }, 'Category progress retrieved successfully');
});

export const getAchievements = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('badges');
  sendSuccess(
    res,
    200,
    { achievements: user.badges, count: user.badges.length },
    'Achievements retrieved successfully'
  );
});

export const getActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;
  const stats = await ensureStats(req.user.id);
  const activity = stats.activityLog.slice(0, limit);
  sendSuccess(res, 200, { activity, count: activity.length }, 'User activity retrieved successfully');
});

export const getGlobalStats = asyncHandler(async (_req, res) => {
  const [userCount, missionCount, badgeCount, totalXPResult] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Mission.countDocuments({ isActive: true }),
    Badge.countDocuments({ isActive: true }),
    User.aggregate([{ $group: { _id: null, total: { $sum: '$xp' } } }]),
  ]);

  sendSuccess(
    res,
    200,
    {
      stats: {
        totalUsers: userCount,
        totalMissions: missionCount,
        totalBadges: badgeCount,
        totalXPEarned: totalXPResult[0]?.total || 0,
      },
    },
    'Global statistics retrieved successfully'
  );
});

export const updateStreak = asyncHandler(async (req, res) => {
  const stats = await ensureStats(req.user.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const last = stats.lastActiveDate ? new Date(stats.lastActiveDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (!last || last.getTime() !== today.getTime()) {
    const diff = last ? Math.round((today - last) / (24 * 60 * 60 * 1000)) : 0;
    if (diff === 1) stats.currentStreak += 1;
    else if (diff > 1) stats.currentStreak = 1;
    else if (!last) stats.currentStreak = 1;

    stats.lastActiveDate = new Date();
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
    await stats.save();
  }

  sendSuccess(
    res,
    200,
    { streak: { current: stats.currentStreak, longest: stats.longestStreak } },
    'Streak updated successfully'
  );
});

export const syncGameProgress = asyncHandler(async (req, res) => {
  const xpEarned = Math.max(0, parseInt(req.body.xpEarned, 10) || 0);
  const unlockedLevel = Math.max(1, parseInt(req.body.unlockedLevel, 10) || 1);
  const currentLevel = Math.max(1, parseInt(req.body.currentLevel, 10) || 1);
  const selectedDomain = typeof req.body.selectedDomain === 'string' ? req.body.selectedDomain : 'robo-logic';
  const selectedDifficulty =
    typeof req.body.selectedDifficulty === 'string' ? req.body.selectedDifficulty : 'beginner';

  const user = await User.findById(req.user.id).populate('badges');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const stats = await ensureStats(req.user.id);

  if (xpEarned > 0) {
    user.xp += xpEarned;
    stats.totalXP += xpEarned;
    stats.activityLog.unshift({
      type: 'game_progress',
      message: `Completed BitBuds level ${currentLevel} in ${selectedDomain}`,
      xpEarned,
    });
    if (stats.activityLog.length > 50) stats.activityLog = stats.activityLog.slice(0, 50);
  }

  user.level = Math.max(user.level, unlockedLevel);
  stats.level = Math.max(stats.level, unlockedLevel);

  const categoryProgress = stats.categoryProgress.get(selectedDomain) || { completed: 0, total: 10 };
  categoryProgress.completed = Math.max(categoryProgress.completed || 0, Math.min(10, unlockedLevel - 1));
  categoryProgress.total = categoryProgress.total || 10;
  stats.categoryProgress.set(selectedDomain, categoryProgress);

  await user.save();
  await stats.save();
  await updateLeaderboardScore(user._id, user.xp);

  sendSuccess(
    res,
    200,
    {
      user,
      stats: {
        totalXP: stats.totalXP,
        level: stats.level,
        currentLevel,
        unlockedLevel,
        selectedDomain,
        selectedDifficulty,
      },
    },
    'Game progress synced successfully'
  );
});

/* ---- Badge endpoints (frontend /badges/* compatibility) ---- */

export const getAllBadges = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.rarity) filter.rarity = req.query.rarity;

  const badges = await Badge.find(filter).sort({ criteriaValue: 1 });
  sendSuccess(res, 200, { badges, count: badges.length }, 'Badges retrieved successfully');
});

export const getUserBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('badges');
  sendSuccess(res, 200, { badges: user.badges, count: user.badges.length }, 'User badges retrieved');
});

export const getAvailableBadges = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const stats = await ensureStats(req.user.id);
  const allBadges = await Badge.find({ isActive: true });
  const earned = new Set(user.badges.map((b) => b.toString()));

  const badges = allBadges.map((badge) => {
    const obj = badge.toObject();
    obj.earned = earned.has(badge._id.toString());
    let eligible = false;
    switch (badge.criteriaType) {
      case 'xp':
        eligible = stats.totalXP >= badge.criteriaValue;
        break;
      case 'missions':
        eligible = stats.missionsCompleted >= badge.criteriaValue;
        break;
      case 'streak':
        eligible = stats.currentStreak >= badge.criteriaValue;
        break;
      default:
        break;
    }
    obj.eligible = eligible && !obj.earned;
    return obj;
  });

  sendSuccess(res, 200, { badges, count: badges.length }, 'Available badges retrieved');
});

export const checkBadgeEligibility = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const stats = await ensureStats(req.user.id);
  const allBadges = await Badge.find({ isActive: true });
  const earnedIds = new Set(user.badges.map((b) => b.toString()));
  const newlyAwarded = [];

  for (const badge of allBadges) {
    if (earnedIds.has(badge._id.toString())) continue;

    let eligible = false;
    switch (badge.criteriaType) {
      case 'xp':
        eligible = stats.totalXP >= badge.criteriaValue;
        break;
      case 'missions':
        eligible = stats.missionsCompleted >= badge.criteriaValue;
        break;
      case 'streak':
        eligible = stats.currentStreak >= badge.criteriaValue;
        break;
      default:
        break;
    }

    if (eligible) {
      user.badges.push(badge._id);
      newlyAwarded.push(badge);
    }
  }

  if (newlyAwarded.length) await user.save();

  sendSuccess(
    res,
    200,
    { awarded: newlyAwarded, count: newlyAwarded.length },
    newlyAwarded.length ? 'New badges awarded!' : 'No new badges eligible'
  );
});

export const getBadgeById = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) {
    throw new ApiError(404, 'Badge not found');
  }
  sendSuccess(res, 200, { badge }, 'Badge retrieved successfully');
});

export default {
  getMyStats,
  getDashboard,
  getLeaderboard,
  getMyRank,
  getCategoryProgress,
  getAchievements,
  getActivity,
  getGlobalStats,
  updateStreak,
  getAllBadges,
  getUserBadges,
  getAvailableBadges,
  checkBadgeEligibility,
  getBadgeById,
  syncGameProgress,
};
