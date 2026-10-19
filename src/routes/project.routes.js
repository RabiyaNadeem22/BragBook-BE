import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validations/common.validation.js';
import {
  createProjectSchema,
  updateProjectSchema,
  projectQuerySchema,
} from '../validations/project.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate({ query: projectQuerySchema }), projectController.list);
router.post('/', validate({ body: createProjectSchema }), projectController.create);
router.get('/:id', validate({ params: idParamSchema }), projectController.getById);
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateProjectSchema }),
  projectController.update
);
router.delete('/:id', validate({ params: idParamSchema }), projectController.remove);

export default router;
