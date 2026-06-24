import logger from '../utils/logger.js';
import AppError from '../utils/AppError.js';

const errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn({ err, path: req.path }, 'Operational error');
    return res.status(err.statusCode).json({
      error: {
        code: err.statusCode,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  logger.error({ err, path: req.path }, 'Unexpected error');

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  return res.status(statusCode).json({
    error: {
      code: statusCode,
      message,
    },
  });
};

export default errorHandler;
