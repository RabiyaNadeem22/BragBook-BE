import { Router } from 'express';
import { apiResponse } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', (req, res) => {
  return apiResponse.success(
    res,
    {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
      version: '1.0.0',
    },
    'BragBook API is operating normally'
  );
});

export default router;
