/**
 * Authentication Validation Schemas
 *
 * Zod schemas for authentication form validation
 */

import { z } from 'zod'

/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least one letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[a-zA-Z]/, 'A senha deve conter pelo menos uma letra')
  .regex(/[0-9]/, 'A senha deve conter pelo menos um número')

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido')

/**
 * Login form validation
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
  remember: z.boolean().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Sign up form validation
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar os termos de uso',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * Forgot password form validation
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

/**
 * Reset password form validation
 */
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

/**
 * Update profile form validation
 */
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
