'use server'

/**
 * Forgot Password Server Action
 *
 * Sends a password reset email to the user
 */

import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'
import { forgotPassword as forgotPasswordService } from '@/lib/services/auth-service'

export interface ForgotPasswordResult {
  success: boolean
  error?: {
    type: string
    message: string
  }
}

export async function forgotPassword(formData: ForgotPasswordInput) {
  // Validate input
  const validationResult = forgotPasswordSchema.safeParse(formData)

  if (!validationResult.success) {
    const firstError = validationResult.error.errors[0]
    return {
      success: false,
      error: {
        type: 'validation',
        message: firstError.message,
      },
    }
  }

  const { email } = validationResult.data

  // Send password reset email
  const result = await forgotPasswordService(email)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  // Always return success to avoid email enumeration
  return {
    success: true,
  }
}
