import { Router } from 'express';
import { achievementController } from '../controllers/achievement.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validations/common.validation.js';
import {
  createAchievementSchema,
  updateAchievementSchema,
  achievementQuerySchema,
} from '../validations/achievement.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate({ query: achievementQuerySchema }), achievementController.list);
router.post('/', validate({ body: createAchievementSchema }), achievementController.create);
router.get('/:id', validate({ params: idParamSchema }), achievementController.getById);
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateAchievementSchema }),
  achievementController.update
);
router.delete('/:id', validate({ params: idParamSchema }), achievementController.remove);

export default router;
