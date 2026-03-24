/**
 * Authentication Service
 *
 * Core authentication logic using Supabase Auth
 * All methods are server-side only
 */

import { getSupabaseServerClient } from '@/lib/supabase/server'
import { handleAuthError, type AuthError } from '@/lib/errors/auth-errors'

/**
 * Login with email and password
 */
export async function login(email: string, password: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
    data: {
      user: data.user,
      session: data.session,
    },
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await getSupabaseServerClient()

  // Check if user already exists BEFORE attempting signup
  // This prevents duplicate email issues
  const { data: existingUser, error: checkError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (checkError && checkError.code !== 'PGRST116') {
    // PGRST116 is "not found" which is what we want
    return {
      success: false,
      error: {
        type: 'unknown_error',
        message: 'Erro ao verificar email. Tente novamente.',
      },
    }
  }

  // If user exists, return error
  if (existingUser) {
    return {
      success: false,
      error: {
        type: 'email_already_exists',
        message: 'Este email já está cadastrado. Faça login ou recupere sua senha.',
      },
    }
  }

  // Attempt sign up
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  // Check if user was actually created
  // Supabase may return success without creating user if email already exists
  if (!data.user) {
    return {
      success: false,
      error: {
        type: 'email_already_exists',
        message: 'Este email já está cadastrado. Faça login ou recupere sua senha.',
      },
    }
  }

  // Check if email confirmation is required
  const requiresConfirmation = !data.session

  return {
    success: true,
    data: {
      user: data.user,
      session: data.session,
      requiresConfirmation,
    },
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
  }
}

/**
 * Request password reset email
 */
export async function forgotPassword(email: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  // Always return success to avoid email enumeration
  return {
    success: true,
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
  }
}

/**
 * Resend confirmation email
 */
export async function resendConfirmationEmail(email: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
  }
}

/**
 * Get current user profile
 */
export async function getUserProfile() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não encontrado',
      } as AuthError,
    }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
    data: {
      user,
      profile,
    },
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: {
  fullName?: string
  phone?: string
  avatarUrl?: string
}) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não encontrado',
      } as AuthError,
    }
  }

  // Update profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      full_name: updates.fullName,
      phone: updates.phone,
      avatar_url: updates.avatarUrl,
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
    data: profile,
  }
}

/**
 * Verify email confirmation token (for auth callback)
 */
export async function verifyEmailToken(token: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email',
  })

  if (error) {
    return {
      success: false,
      error: handleAuthError(error),
    }
  }

  return {
    success: true,
    data: {
      user: data.user,
      session: data.session,
    },
  }
}
