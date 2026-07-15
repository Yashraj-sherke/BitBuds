import { createClient } from 'redis';
import logger from '../utils/logger.js';

let client = null;
let isConnected = false;

export const getRedisClient = () => client;

export const isRedisAvailable = () => isConnected;

export const connectRedis = async () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';

  client = createClient({
    url,
    socket: {
      connectTimeout: 2000,
      reconnectStrategy: false,
    },
  });

  client.on('error', (err) => {
    isConnected = false;
    logger.warn('Redis client error — falling back to MongoDB for rankings', { error: err.message });
  });

  client.on('connect', () => {
    isConnected = true;
    logger.info('Redis connected');
  });

  client.on('end', () => {
    isConnected = false;
  });

  try {
    await Promise.race([
      client.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Redis connection timed out')), 3000)),
    ]);
    isConnected = client.isOpen;
  } catch (err) {
    isConnected = false;
    logger.warn('Redis unavailable — leaderboard will use MongoDB fallback', { error: err.message });
    if (client?.isOpen) {
      await client.disconnect().catch(() => {});
    }
  }

  return client;
};

/** Update global leaderboard sorted set */
export const updateLeaderboardScore = async (userId, xp) => {
  if (!isConnected || !client?.isOpen) return false;

  try {
    await client.zAdd('leaderboard:global', { score: xp, value: String(userId) });
    return true;
  } catch (err) {
    logger.warn('Redis ZADD failed', { error: err.message });
    return false;
  }
};

/** Fetch top N from Redis sorted set */
export const getLeaderboardFromRedis = async (limit = 10, offset = 0) => {
  if (!isConnected || !client?.isOpen) return null;

  try {
    const entries = await client.zRangeWithScores('leaderboard:global', offset, offset + limit - 1, {
      REV: true,
    });
    return entries.map(({ value, score }) => ({ userId: value, xp: score }));
  } catch (err) {
    logger.warn('Redis leaderboard read failed', { error: err.message });
    return null;
  }
};

/** Get user rank from Redis (1-based) */
export const getUserRankFromRedis = async (userId) => {
  if (!isConnected || !client?.isOpen) return null;

  try {
    const rank = await client.zRevRank('leaderboard:global', String(userId));
    return rank === null ? null : rank + 1;
  } catch (err) {
    logger.warn('Redis rank lookup failed', { error: err.message });
    return null;
  }
};

export default connectRedis;
