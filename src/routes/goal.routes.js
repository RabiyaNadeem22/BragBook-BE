import { Router } from 'express';
import { goalController } from '../controllers/goal.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validations/common.validation.js';
import { createGoalSchema, updateGoalSchema, goalQuerySchema } from '../validations/goal.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate({ query: goalQuerySchema }), goalController.list);
router.post('/', validate({ body: createGoalSchema }), goalController.create);
router.get('/:id', validate({ params: idParamSchema }), goalController.getById);
router.patch('/:id', validate({ params: idParamSchema, body: updateGoalSchema }), goalController.update);
router.delete('/:id', validate({ params: idParamSchema }), goalController.remove);

export default router;
