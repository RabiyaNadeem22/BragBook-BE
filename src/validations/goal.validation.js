import { z } from 'zod';
import { optionalDate, optionalText } from './common.validation.js';

export const GOAL_STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
export const GOAL_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

const progressSchema = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined;
  return Number(val);
}, z.number().int().min(0, 'Progress cannot be below 0').max(100, 'Progress cannot exceed 100').optional());

export const createGoalSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: optionalText(2000, 'Description'),
  status: z
    .enum(GOAL_STATUSES, {
      errorMap: () => ({ message: 'Status must be NOT_STARTED, IN_PROGRESS, COMPLETED, or CANCELLED' }),
    })
    .default('NOT_STARTED'),
  priority: z
    .enum(GOAL_PRIORITIES, {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    })
    .default('MEDIUM'),
  progress: progressSchema,
  deadline: optionalDate,
});

export const updateGoalSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200).optional(),
  description: optionalText(2000, 'Description'),
  status: z
    .enum(GOAL_STATUSES, {
      errorMap: () => ({ message: 'Status must be NOT_STARTED, IN_PROGRESS, COMPLETED, or CANCELLED' }),
    })
    .optional(),
  priority: z
    .enum(GOAL_PRIORITIES, {
      errorMap: () => ({ message: 'Priority must be LOW, MEDIUM, or HIGH' }),
    })
    .optional(),
  progress: progressSchema,
  deadline: optionalDate,
});

export const goalQuerySchema = z.object({
  status: z.enum(GOAL_STATUSES).optional(),
  priority: z.enum(GOAL_PRIORITIES).optional(),
});
