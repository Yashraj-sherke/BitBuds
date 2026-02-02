import { createClient } from 'redis';
import logger from '../utils/logger.js';

let redisClient = null;
let isRedisEnabled = false;

/**
 * Connect to Redis
 */
export const connectRedis = async () => {
  // Check if Redis is enabled
  if (process.env.ENABLE_REDIS !== 'true') {
    logger.info('Redis is disabled. Skipping Redis connection.');
    return null;
  }

  try {
    const redisConfig = {
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    };

    // Add password if provided
    if (process.env.REDIS_PASSWORD) {
      redisConfig.password = process.env.REDIS_PASSWORD;
    }

    redisClient = createClient(redisConfig);

    // Error handler
    redisClient.on('error', (err) => {
      logger.error(`Redis Client Error: ${err}`);
      isRedisEnabled = false;
    });

    // Connect handler
    redisClient.on('connect', () => {
      logger.info('Redis client connecting...');
    });

    // Ready handler
    redisClient.on('ready', () => {
      logger.info('Redis client connected and ready');
      isRedisEnabled = true;
    });

    // Reconnecting handler
    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting...');
    });

    // End handler
    redisClient.on('end', () => {
      logger.warn('Redis client connection closed');
      isRedisEnabled = false;
    });

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
    logger.warn('Continuing without Redis cache');
    isRedisEnabled = false;
    return null;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = () => {
  return redisClient;
};

/**
 * Check if Redis is available
 */
export const isRedisAvailable = () => {
  return isRedisEnabled && redisClient && redisClient.isReady;
};

/**
 * Disconnect from Redis
 */
export const disconnectRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis disconnected successfully');
    } catch (error) {
      logger.error(`Error disconnecting from Redis: ${error.message}`);
    }
  }
};

export default {
  connectRedis,
  getRedisClient,
  isRedisAvailable,
  disconnectRedis,
};
