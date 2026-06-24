import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

app.use('/api/v1', healthRoutes);
app.use('/api/v1/auth', authLimiter, authRoutes);

app.use(errorHandler);

export default app;