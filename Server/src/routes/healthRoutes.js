import { Router } from 'express';
import mongoose from 'mongoose';
import redis from '../config/redis.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/ready', async (req, res, next) => {
  const dbState = mongoose.connection.readyState;
  const services = { database: dbState === 1 ? 'connected' : 'disconnected' };

  try {
    await redis.ping();
    services.redis = 'connected';
  } catch {
    services.redis = 'disconnected';
  }

  const allOk = services.database === 'connected' && services.redis === 'connected';
  res.status(allOk ? 200 : 503).json({ status: allOk ? 'ok' : 'error', services });
});

export default router;
