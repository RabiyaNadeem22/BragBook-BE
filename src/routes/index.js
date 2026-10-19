import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import skillRoutes from './skill.routes.js';
import projectRoutes from './project.routes.js';
import achievementRoutes from './achievement.routes.js';
import goalRoutes from './goal.routes.js';
import { apiResponse } from '../utils/apiResponse.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/achievements', achievementRoutes);
apiRouter.use('/goals', goalRoutes);

// Placeholder message for unmounted endpoints
const placeholderHandler = (resource) => (req, res) => {
  return apiResponse.success(
    res,
    { resource, status: 'endpoint ready for implementation in next phase' },
    `${resource} service is configured`
  );
};

apiRouter.use('/feedback', placeholderHandler('Feedback'));
apiRouter.use('/analytics', placeholderHandler('Analytics'));

export default apiRouter;
