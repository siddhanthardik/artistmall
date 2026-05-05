/**
 * Redis Service
 * Centralised cache client for the Artist Mall platform.
 * Pattern: Cache-Aside (application controls cache population).
 *
 * In production, set REDIS_URI in environment variables.
 * Falls back to a no-op stub when Redis is unavailable, so the app
 * remains functional without Redis during local development.
 */
import { createClient } from 'redis';
import { logger } from '../utils/logger';

const REDIS_URI = process.env.REDIS_URI ?? 'redis://localhost:6379';
const DEFAULT_TTL_SECONDS = Number(process.env.REDIS_CACHE_TTL ?? 3600); // 1 hour

let client: ReturnType<typeof createClient> | null = null;

const initRedis = async () => {
  try {
    client = createClient({ url: REDIS_URI });
    client.on('error', (err: Error) => logger.error({ type: 'REDIS_ERROR', message: err.message }));
    await client.connect();
    logger.info('[Redis] Connected successfully');
  } catch (err) {
    logger.warn('[Redis] Could not connect — running without cache (degraded mode)');
    client = null;
  }
};

export const connectRedis = initRedis;

// ── Cache Operations ──────────────────────────────────────────────────────────

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  if (!client) return null;
  try {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
};

export const cacheSet = async (key: string, value: unknown, ttl = DEFAULT_TTL_SECONDS): Promise<void> => {
  if (!client) return;
  try {
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.warn(`[Redis] cacheSet failed for key "${key}"`);
  }
};

export const cacheDel = async (...keys: string[]): Promise<void> => {
  if (!client) return;
  try {
    await client.del(keys);
  } catch {
    // Fail silently — cache operation is non-critical
  }
};

export const cacheInvalidatePattern = async (pattern: string): Promise<void> => {
  if (!client) return;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) await client.del(keys);
  } catch {
    // Fail silently — cache operation is non-critical
  }
};

// ── Cache Key Builders ────────────────────────────────────────────────────────
export const CACHE_KEYS = {
  artistDiscovery: (query: string) => `discovery:${query}`,
  artistProfile: (id: string) => `artist:${id}`,
  adminKPIs: () => 'admin:kpis',
  reportingData: () => 'admin:reporting',
};
