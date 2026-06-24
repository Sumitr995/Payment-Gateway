import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.get('/ready', (req, res, next) => {
  const dbState = mongoose.connection.readyState;
  if (dbState !== 1) {
    return res.status(503).json({
      status: 'error',
      message: 'Database not ready',
      dbState,
    });
  }
  res.json({
    status: 'ok',
    services: { database: 'connected' },
  });
});

export default router;
