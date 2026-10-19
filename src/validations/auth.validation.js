import { z } from 'zod';

const optionalText = (max, field = 'Value') =>
  z
    .string()
    .trim()
    .max(max, `${field} cannot exceed ${max} characters`)
    .optional()
    .nullable()
    .transform((val) => (val ? val : null));

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password is too long')
  .regex(/[A-Za-z]/, 'Password must include at least one letter')
  .regex(/[0-9]/, 'Password must include at least one number');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(255)
    .transform((email) => email.toLowerCase()),
  password: passwordSchema,
  jobTitle: optionalText(100, 'Job title'),
  company: optionalText(100, 'Company'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .transform((email) => email.toLowerCase()),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  jobTitle: optionalText(100, 'Job title'),
  company: optionalText(100, 'Company'),
  bio: optionalText(500, 'Bio'),
  avatar: z
    .union([
      z.string().trim().url('Avatar must be a valid URL').max(500),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === undefined ? undefined : val || null)),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});
