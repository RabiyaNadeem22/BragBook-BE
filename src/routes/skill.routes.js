import { Router } from 'express';
import { skillController } from '../controllers/skill.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { idParamSchema } from '../validations/common.validation.js';
import { createSkillSchema, updateSkillSchema, skillQuerySchema } from '../validations/skill.validation.js';

const router = Router();

router.use(requireAuth);

router.get('/', validate({ query: skillQuerySchema }), skillController.getSkills);
router.post('/', validate({ body: createSkillSchema }), skillController.createSkill);
router.get('/:id', validate({ params: idParamSchema }), skillController.getSkill);
router.patch(
  '/:id',
  validate({ params: idParamSchema, body: updateSkillSchema }),
  skillController.updateSkill
);
router.delete('/:id', validate({ params: idParamSchema }), skillController.deleteSkill);

export default router;
