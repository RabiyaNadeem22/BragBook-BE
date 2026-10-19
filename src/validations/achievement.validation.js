import { z } from 'zod';
import { optionalDate, optionalText } from './common.validation.js';

export const ACHIEVEMENT_CATEGORIES = [
  'TECHNICAL',
  'LEADERSHIP',
  'TEAMWORK',
  'PROBLEM_SOLVING',
  'LEARNING',
  'DELIVERY',
  'COMMUNICATION',
  'OTHER',
];

export const EVIDENCE_TYPES = [
  'URL',
  'GITHUB_PR',
  'JIRA_TICKET',
  'DEPLOYMENT',
  'DOCS',
  'SCREENSHOT',
  'OTHER',
];

const optionalUuid = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return null;
  return val;
}, z.string().uuid('Invalid project id').nullable().optional());

const tagsSchema = z.preprocess((val) => {
  if (val === undefined || val === null || val === '') return [];
  if (Array.isArray(val)) return val.map((item) => String(item).trim()).filter(Boolean);
  if (typeof val === 'string') {
    return val
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return val;
}, z.array(z.string().trim().min(1).max(40)).max(20, 'You can add up to 20 tags'));

const evidenceSchema = z
  .array(
    z.object({
      title: z.string().trim().min(1, 'Evidence title is required').max(200),
      url: z.string().trim().url('Evidence URL must be valid').max(500),
      type: z
        .enum(EVIDENCE_TYPES, {
          errorMap: () => ({ message: 'Invalid evidence type' }),
        })
        .default('URL'),
    })
  )
  .max(20, 'You can add up to 20 evidence items');

export const createAchievementSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  description: z.string().trim().min(1, 'Description is required').max(4000),
  date: optionalDate,
  category: z
    .enum(ACHIEVEMENT_CATEGORIES, {
      errorMap: () => ({ message: 'Invalid achievement category' }),
    })
    .default('TECHNICAL'),
  impact: optionalText(2000, 'Impact'),
  metrics: optionalText(300, 'Metrics'),
  projectId: optionalUuid,
  tags: tagsSchema.optional().default([]),
  evidence: evidenceSchema.optional().default([]),
});

export const updateAchievementSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200).optional(),
  description: z.string().trim().min(1, 'Description is required').max(4000).optional(),
  date: optionalDate,
  category: z
    .enum(ACHIEVEMENT_CATEGORIES, {
      errorMap: () => ({ message: 'Invalid achievement category' }),
    })
    .optional(),
  impact: optionalText(2000, 'Impact'),
  metrics: optionalText(300, 'Metrics'),
  projectId: optionalUuid,
  tags: tagsSchema.optional(),
  evidence: evidenceSchema.optional(),
});

export const achievementQuerySchema = z.object({
  category: z.enum(ACHIEVEMENT_CATEGORIES).optional(),
  projectId: z.string().uuid().optional(),
  search: z.string().trim().max(200).optional(),
});
