'use server'

/**
 * Reset Password Server Action
 *
 * Updates the user's password after reset confirmation
 */

import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations'
import { updatePassword as updatePasswordService } from '@/lib/services/auth-service'
import { signOut as signOutService } from '@/lib/services/auth-service'
import { redirect } from 'next/navigation'

export interface ResetPasswordResult {
  success: boolean
  error?: {
    type: string
    message: string
  }
}

export async function resetPassword(formData: ResetPasswordInput) {
  // Validate input
  const validationResult = resetPasswordSchema.safeParse(formData)

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

  const { password } = validationResult.data

  // Update password
  const result = await updatePasswordService(password)

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    }
  }

  // Sign out user after password reset
  await signOutService()

  // Redirect to login
  redirect('/login?message=password-reset-success')
}
