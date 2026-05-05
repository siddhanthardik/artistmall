import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        console.warn('[REDIS] Maximum retries reached. Disabling Redis.');
        return false; // Stop retrying
      }
      return Math.min(retries * 100, 3000);
    }
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

let isRedisConnected = false;

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    isRedisConnected = true;
    console.log('[REDIS] Connected successfully');
  } catch (error) {
    console.error('[REDIS] Connection failed. Caching will be disabled.', error);
    isRedisConnected = false;
  }
};

export const getCache = async (key: string) => {
  if (!isRedisConnected) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const setCache = async (key: string, value: any, ttlSeconds = 3600) => {
  if (!isRedisConnected) return;
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttlSeconds
    });
  } catch (error) {
    console.error(`[REDIS] Set error for key ${key}:`, error);
  }
};

export const invalidateCache = async (pattern: string) => {
  if (!isRedisConnected) return;
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error(`[REDIS] Invalidation error for pattern ${pattern}:`, error);
  }
};

export default redisClient;
