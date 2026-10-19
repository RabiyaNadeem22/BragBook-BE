import { ZodError } from 'zod';
import { apiResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} -`, err.message || err);

  // 1. Handle Zod validation errors
  if (err instanceof ZodError) {
    const issues = err.errors || err.issues || [];
    const formattedErrors = issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return apiResponse.error(res, 'Validation Error', 400, formattedErrors);
  }

  // 2. Handle Prisma specific errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return apiResponse.error(res, `A unique constraint violation occurred${target}`, 409);
  }

  if (err.code === 'P2025') {
    return apiResponse.error(res, 'Resource not found', 404);
  }

  // 3. Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return apiResponse.error(res, 'Invalid token. Please authenticate again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return apiResponse.error(res, 'Token has expired. Please log in again.', 401);
  }

  // 4. Handle custom errors with status code
  if (err.statusCode) {
    return apiResponse.error(res, err.message, err.statusCode, err.errors || null);
  }

  // 5. Default fallback 500 error
  const message = env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return apiResponse.error(res, message, 500);
};
