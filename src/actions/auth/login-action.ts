'use server'

/**
 * Login Server Action
 *
 * Validates input and authenticates user with email and password
 */

import { loginSchema, type LoginInput } from '@/lib/validations'
import { login as loginService } from '@/lib/services/auth-service'
import { redirect } from 'next/navigation'

export interface LoginResult {
  success: boolean
  error?: {
    type: string
    message: string
  }
}

export async function login(formData: LoginInput): Promise<LoginResult> {
  // Validate input
  const validationResult = loginSchema.safeParse(formData)

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

  const { email, password } = validationResult.data

  // Attempt login
  const result = await loginService(email, password)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  // Redirect to dashboard on success
  redirect('/dashboard')
}
