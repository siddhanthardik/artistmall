import { z } from 'zod';

export const RoleEnum = z.enum([
  'SUPER_ADMIN',
  'SUB_ADMIN',
  'INTERNAL_OPS',
  'FINANCE',
  'SUPPORT'
]);

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  passwordHash: z.string().optional(), // Omitted in frontend
  role: RoleEnum,
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  lastLoginAt: z.date().optional(),
  mustChangePassword: z.boolean().default(false),
});

export type RoleType = z.infer<typeof RoleEnum>;
export type UserType = z.infer<typeof UserSchema>;
