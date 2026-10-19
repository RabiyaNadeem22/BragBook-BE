import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid resource id'),
});

export const optionalText = (max, field = 'Value') =>
  z
    .string()
    .trim()
    .max(max, `${field} cannot exceed ${max} characters`)
    .optional()
    .nullable()
    .transform((val) => (val ? val : null));

export const optionalDate = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return null;
  return val;
}, z.coerce.date().nullable().optional());
