import { getRedisClient, isRedisAvailable } from '../config/redis.js';
import logger from '../utils/logger.js';

/**
 * Cache Service
 * Provides caching functionality with fallback when Redis is unavailable
 */
class CacheService {
  constructor() {
    this.inMemoryCache = new Map();
    this.inMemoryTTL = new Map();
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any>} Cached value or null
   */
  async get(key) {
    try {
      if (isRedisAvailable()) {
        const client = getRedisClient();
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
      }
      
      // Fallback to in-memory cache
      const ttl = this.inMemoryTTL.get(key);
      if (ttl && ttl < Date.now()) {
        this.inMemoryCache.delete(key);
        this.inMemoryTTL.delete(key);
        return null;
      }
      
      return this.inMemoryCache.get(key) || null;
    } catch (error) {
      logger.error(`Cache get error: ${error.message}`);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds
   */
  async set(key, value, ttl = 300) {
    try {
      if (isRedisAvailable()) {
        const client = getRedisClient();
        await client.setEx(key, ttl, JSON.stringify(value));
      } else {
        // Fallback to in-memory cache
        this.inMemoryCache.set(key, value);
        this.inMemoryTTL.set(key, Date.now() + ttl * 1000);
      }
    } catch (error) {
      logger.error(`Cache set error: ${error.message}`);
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   */
  async del(key) {
    try {
      if (isRedisAvailable()) {
        const client = getRedisClient();
        await client.del(key);
      } else {
        this.inMemoryCache.delete(key);
        this.inMemoryTTL.delete(key);
      }
    } catch (error) {
      logger.error(`Cache delete error: ${error.message}`);
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * @param {string} pattern - Key pattern (e.g., 'user:*')
   */
  async delPattern(pattern) {
    try {
      if (isRedisAvailable()) {
        const client = getRedisClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
          await client.del(keys);
        }
      } else {
        // In-memory cache pattern matching
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of this.inMemoryCache.keys()) {
          if (regex.test(key)) {
            this.inMemoryCache.delete(key);
            this.inMemoryTTL.delete(key);
          }
        }
      }
    } catch (error) {
      logger.error(`Cache delete pattern error: ${error.message}`);
    }
  }

  /**
   * Clear all cache
   */
  async clear() {
    try {
      if (isRedisAvailable()) {
        const client = getRedisClient();
        await client.flushAll();
      } else {
        this.inMemoryCache.clear();
        this.inMemoryTTL.clear();
      }
    } catch (error) {
      logger.error(`Cache clear error: ${error.message}`);
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Cache key
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    try {
      if (isRedisAvailable()) {
        const client = getRedisClient();
        return await client.exists(key) === 1;
      }
      
      const ttl = this.inMemoryTTL.get(key);
      if (ttl && ttl < Date.now()) {
        this.inMemoryCache.delete(key);
        this.inMemoryTTL.delete(key);
        return false;
      }
      
      return this.inMemoryCache.has(key);
    } catch (error) {
      logger.error(`Cache exists error: ${error.message}`);
      return false;
    }
  }
}

export default new CacheService();
