import { z } from 'zod';
import { optionalDate, optionalText } from './common.validation.js';

const PROJECT_STATUSES = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

const technologiesSchema = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return [];
  if (Array.isArray(val)) return val.map((item) => String(item).trim()).filter(Boolean);
  if (typeof val === 'string') {
    return val
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return val;
}, z.array(z.string().trim().min(1).max(50)).max(30, 'You can add up to 30 technologies'));

const withDateOrder = (schema) =>
  schema.refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    { message: 'End date cannot be before start date', path: ['endDate'] }
  );

export const createProjectSchema = withDateOrder(
  z.object({
    name: z.string().trim().min(1, 'Project name is required').max(200, 'Project name cannot exceed 200 characters'),
    description: optionalText(2000, 'Description'),
    role: optionalText(120, 'Role'),
    technologies: technologiesSchema.optional().default([]),
    startDate: optionalDate,
    endDate: optionalDate,
    status: z
      .enum(PROJECT_STATUSES, {
        errorMap: () => ({ message: 'Status must be PLANNED, IN_PROGRESS, COMPLETED, or ARCHIVED' }),
      })
      .default('IN_PROGRESS'),
  })
);

export const updateProjectSchema = withDateOrder(
  z.object({
    name: z.string().trim().min(1, 'Project name is required').max(200).optional(),
    description: optionalText(2000, 'Description'),
    role: optionalText(120, 'Role'),
    technologies: technologiesSchema.optional(),
    startDate: optionalDate,
    endDate: optionalDate,
    status: z
      .enum(PROJECT_STATUSES, {
        errorMap: () => ({ message: 'Status must be PLANNED, IN_PROGRESS, COMPLETED, or ARCHIVED' }),
      })
      .optional(),
  })
);

export const projectQuerySchema = z.object({
  status: z.enum(PROJECT_STATUSES).optional(),
});
