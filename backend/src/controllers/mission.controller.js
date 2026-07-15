import Mission from '../models/Mission.model.js';
import User from '../models/User.model.js';
import Stats from '../models/Stats.model.js';
import Badge from '../models/Badge.model.js';
import ApiError, { asyncHandler } from '../utils/ApiError.js';
import { sendSuccess } from '../middleware/error.middleware.js';
import { evaluateJS } from '../utils/sandbox.js';
import { updateLeaderboardScore } from '../config/redis.js';
import { emitToUser } from '../socket/connection.js';
import logger from '../utils/logger.js';

const XP_PER_LEVEL = 1000;
const DEFAULT_XP_REWARD = 50;
const DEFAULT_COIN_REWARD = 50;

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const daysBetween = (a, b) => {
  const ms = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
};

const calculateLevel = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

const ensureStats = async (userId) => {
  let stats = await Stats.findOne({ userId });
  if (!stats) {
    stats = await Stats.create({ userId });
  }
  return stats;
};

const updateStreak = (stats) => {
  const today = startOfDay();
  const last = stats.lastActiveDate ? startOfDay(stats.lastActiveDate) : null;

  if (!last) {
    stats.currentStreak = 1;
  } else {
    const diff = daysBetween(today, last);
    if (diff === 0) {
      // same day — keep streak
    } else if (diff === 1) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }
  }

  stats.lastActiveDate = new Date();
  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }
};

const checkBadgeEligibility = async (user, stats) => {
  const allBadges = await Badge.find({ isActive: true });
  const earnedIds = new Set(user.badges.map((b) => b.toString()));
  const newlyUnlocked = [];

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
      newlyUnlocked.push(badge);
      if (badge.xpReward > 0) {
        user.xp += badge.xpReward;
        stats.totalXP += badge.xpReward;
      }
    }
  }

  return newlyUnlocked;
};

const enrichMissionForUser = (mission, stats) => {
  const m = mission.toObject ? mission.toObject() : { ...mission };
  const completed = stats.completedMissions?.some((id) => id.toString() === m._id.toString());
  m.isCompleted = completed;
  m.progress = completed ? 100 : 0;
  m.isLocked = false;
  m.status = completed ? 'completed' : 'available';
  return m;
};

export const getAllMissions = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const missions = await Mission.find(filter).sort({ order: 1, createdAt: 1 });
  sendSuccess(res, 200, { missions, count: missions.length }, 'Missions retrieved successfully');
});

export const getUserMissions = asyncHandler(async (req, res) => {
  const stats = await ensureStats(req.user.id);
  const missions = await Mission.find({ isActive: true }).sort({ order: 1 });
  const enriched = missions.map((m) => enrichMissionForUser(m, stats));
  sendSuccess(res, 200, { missions: enriched, count: enriched.length }, 'User missions retrieved successfully');
});

export const getMissionById = asyncHandler(async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    throw new ApiError(404, 'Mission not found');
  }
  sendSuccess(res, 200, { mission }, 'Mission retrieved successfully');
});

export const getMissionsByCategory = asyncHandler(async (req, res) => {
  const missions = await Mission.find({ category: req.params.category, isActive: true }).sort({ order: 1 });
  sendSuccess(res, 200, { missions, count: missions.length }, 'Category missions retrieved successfully');
});

export const startMission = asyncHandler(async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    throw new ApiError(404, 'Mission not found');
  }

  sendSuccess(
    res,
    200,
    {
      mission,
      startedAt: new Date().toISOString(),
      codeTemplate: mission.codeTemplate,
    },
    'Mission started successfully'
  );
});

export const submitMission = asyncHandler(async (req, res) => {
  const mission = await Mission.findById(req.params.id);
  if (!mission) {
    throw new ApiError(404, 'Mission not found');
  }

  const userCode = req.body.userCode || req.body.code || '';
  const evaluation = evaluateJS(userCode, mission.testCases);

  if (!evaluation.correct) {
    return sendSuccess(
      res,
      200,
      {
        passed: false,
        isCompleted: false,
        correct: false,
        error: evaluation.error,
        testResults: evaluation.results || [],
      },
      evaluation.error || 'Submission incorrect'
    );
  }

  const user = await User.findById(req.user.id);
  const stats = await ensureStats(req.user.id);

  const alreadyCompleted = stats.completedMissions.some((id) => id.toString() === mission._id.toString());
  const xpReward = mission.xpReward || DEFAULT_XP_REWARD;
  const coinReward = DEFAULT_COIN_REWARD;

  let leveledUp = false;
  let previousLevel = user.level;
  const unlockedBadges = [];

  if (!alreadyCompleted) {
    user.xp += xpReward;
    user.coins += coinReward;
    stats.totalXP += xpReward;
    stats.missionsCompleted += 1;
    stats.completedMissions.push(mission._id);

    const catKey = mission.category || 'basics';
    const catProgress = stats.categoryProgress.get(catKey) || { completed: 0, total: 0 };
    catProgress.completed += 1;
    stats.categoryProgress.set(catKey, catProgress);

    stats.activityLog.unshift({
      type: 'mission_complete',
      message: `Completed "${mission.title}"`,
      xpEarned: xpReward,
    });
    if (stats.activityLog.length > 50) stats.activityLog = stats.activityLog.slice(0, 50);
  }

  updateStreak(stats);

  const newLevel = calculateLevel(user.xp);
  if (newLevel > user.level) {
    leveledUp = true;
    previousLevel = user.level;
    user.level = newLevel;
    stats.level = newLevel;
  }

  const badges = await checkBadgeEligibility(user, stats);
  unlockedBadges.push(...badges);

  await user.save();
  await stats.save();
  await updateLeaderboardScore(user._id, user.xp);

  const io = req.app.get('io');
  if (io) {
    if (leveledUp) {
      emitToUser(io, user._id.toString(), 'level:up', {
        previousLevel,
        newLevel: user.level,
        totalXP: user.xp,
      });
    }
    for (const badge of unlockedBadges) {
      emitToUser(io, user._id.toString(), 'achievement:unlocked', {
        badge: badge.toObject ? badge.toObject() : badge,
      });
    }
  }

  sendSuccess(
    res,
    200,
    {
      passed: true,
      correct: true,
      isCompleted: true,
      xpEarned: alreadyCompleted ? 0 : xpReward,
      coinsEarned: alreadyCompleted ? 0 : coinReward,
      totalXP: user.xp,
      level: user.level,
      leveledUp,
      unlockedBadges: unlockedBadges.map((b) => (b.toObject ? b.toObject() : b)),
      testResults: evaluation.results,
    },
    alreadyCompleted ? 'Mission already completed — tests passed!' : 'Mission completed!'
  );
});

export default {
  getAllMissions,
  getUserMissions,
  getMissionById,
  getMissionsByCategory,
  startMission,
  submitMission,
};
