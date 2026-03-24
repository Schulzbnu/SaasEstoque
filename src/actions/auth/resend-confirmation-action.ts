'use server'

/**
 * Resend Confirmation Email Server Action
 *
 * Resends the email confirmation link to the user
 */

import { emailSchema } from '@/lib/validations'
import { resendConfirmationEmail as resendConfirmationService } from '@/lib/services/auth-service'

export interface ResendConfirmationResult {
  success: boolean
  error?: {
    type: string
    message: string
  }
}

export async function resendConfirmationEmail(email: string) {
  // Validate input
  const validationResult = emailSchema.safeParse(email)

  if (!validationResult.success) {
    return {
      success: false,
      error: {
        type: 'validation',
        message: 'Email inválido',
      },
    }
  }

  const validatedEmail = validationResult.data

  // Resend confirmation email
  const result = await resendConfirmationService(validatedEmail)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  return {
    success: true,
  }
}
