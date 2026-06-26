import express from 'express';
import cookieParser from 'cookie-parser';
import webhookRoutes from './routes/webhookRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/AuthRoutes.js';
import paymentRoutes from './routes/PaymentRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';
import idempotency from './middleware/idempotency.js';

const app = express();

app.use('/api/v1/webhooks', webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/payments', paymentRoutes);

export { idempotency };

app.use(errorHandler);

export default app;
