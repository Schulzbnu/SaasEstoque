'use server'

/**
 * Sign Up Server Action
 *
 * Validates input and creates a new user account
 */

import { signUpSchema, type SignUpInput } from '@/lib/validations'
import { signUp as signUpService } from '@/lib/services/auth-service'

export interface SignUpResult {
  success: boolean
  requiresConfirmation?: boolean
  error?: {
    type: string
    message: string
  }
}

export async function signUp(formData: SignUpInput) {
  // Validate input
  const validationResult = signUpSchema.safeParse(formData)

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

  const { email, password, fullName } = validationResult.data

  // Attempt sign up
  const result = await signUpService(email, password, fullName)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  return {
    success: true,
    requiresConfirmation: result.data?.requiresConfirmation ?? false,
  }
}
