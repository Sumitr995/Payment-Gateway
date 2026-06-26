import AppError from '../utils/AppError.js';
import { tryAcquireLock, getCachedResponse, cacheResponse } from '../services/IdempotencyService.js';

const idempotency = (options = {}) => {
  const { methods = ['POST', 'PATCH'], ttl } = options;

  return async (req, res, next) => {
    if (!methods.includes(req.method)) {
      return next();
    }

    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) {
      return next(new AppError('Idempotency-Key header is required', 400));
    }

    if (typeof idempotencyKey !== 'string' || idempotencyKey.length < 1 || idempotencyKey.length > 255) {
      return next(new AppError('Invalid Idempotency-Key header', 400));
    }

    try {
      const cached = await getCachedResponse(idempotencyKey);
      if (cached) {
        return res.status(cached.statusCode).json(cached.body);
      }

      const acquired = await tryAcquireLock(idempotencyKey);
      if (!acquired) {
        return next(new AppError('Request is already being processed', 409));
      }

      const originalJson = res.json.bind(res);
      res.json = async function (body) {
        await cacheResponse(idempotencyKey, res.statusCode, body, ttl);
        return originalJson(body);
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default idempotency;
