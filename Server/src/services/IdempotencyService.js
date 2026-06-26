import redis from '../config/redis.js';

const PREFIX = 'idemp';
const LOCK_TTL = 30;
const CACHE_TTL = 24 * 60 * 60;

const key = (k) => `${PREFIX}:${k}`;

export const tryAcquireLock = async (idempotencyKey) => {
  const result = await redis.set(key(idempotencyKey), 'pending', 'NX', 'EX', LOCK_TTL);
  return result === 'OK';
};

export const getCachedResponse = async (idempotencyKey) => {
  const data = await redis.get(key(idempotencyKey));
  if (!data || data === 'pending') return null;
  return JSON.parse(data);
};

export const cacheResponse = async (idempotencyKey, statusCode, body, ttl = CACHE_TTL) => {
  const payload = JSON.stringify({ statusCode, body });
  await redis.setex(key(idempotencyKey), ttl, payload);
};
