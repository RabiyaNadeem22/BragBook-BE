import { z } from 'zod';

export const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

const yearsOfExperience = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? null : Number(val)),
  z.number().min(0, 'Years of experience cannot be negative').max(50, 'Years of experience cannot exceed 50').nullable()
);

export const createSkillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100, 'Skill name cannot exceed 100 characters'),
  category: z.string().trim().min(1, 'Category is required').max(50, 'Category cannot exceed 50 characters'),
  level: z
    .enum(SKILL_LEVELS, {
      errorMap: () => ({ message: 'Skill level must be BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT' }),
    })
    .default('INTERMEDIATE'),
  yearsOfExperience: yearsOfExperience.optional(),
});

export const updateSkillSchema = z.object({
  name: z.string().trim().min(1, 'Skill name is required').max(100).optional(),
  category: z.string().trim().min(1, 'Category is required').max(50).optional(),
  level: z
    .enum(SKILL_LEVELS, {
      errorMap: () => ({ message: 'Skill level must be BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT' }),
    })
    .optional(),
  yearsOfExperience: yearsOfExperience.optional(),
});

export const skillQuerySchema = z.object({
  category: z.string().trim().min(1).max(50).optional(),
});
