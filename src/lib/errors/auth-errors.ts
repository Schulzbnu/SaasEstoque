/**
 * Authentication Error Handler
 *
 * Converts Supabase Auth errors to user-friendly messages
 */

export type AuthErrorType =
  | 'email_not_confirmed'
  | 'invalid_credentials'
  | 'weak_password'
  | 'email_already_exists'
  | 'user_not_found'
  | 'invalid_token'
  | 'token_expired'
  | 'too_many_requests'
  | 'unknown_error'

export interface AuthError {
  type: AuthErrorType
  message: string
  originalError?: string
}

/**
 * Map Supabase error codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<string, { type: AuthErrorType; message: string }> = {
  // Email not confirmed
  'Email not confirmed': {
    type: 'email_not_confirmed',
    message: 'Por favor, confirme seu email antes de fazer login.',
  },

  // Invalid credentials
  'Invalid login credentials': {
    type: 'invalid_credentials',
    message: 'Email ou senha incorretos.',
  },

  // Email already exists
  'User already registered': {
    type: 'email_already_exists',
    message: 'Este email já está cadastrado.',
  },
  'duplicate key': {
    type: 'email_already_exists',
    message: 'Este email já está cadastrado.',
  },

  // Weak password
  'Password should be at least 8 characters': {
    type: 'weak_password',
    message: 'A senha deve ter no mínimo 8 caracteres.',
  },
  'Password is too short': {
    type: 'weak_password',
    message: 'A senha é muito curta.',
  },

  // User not found
  'User not found': {
    type: 'user_not_found',
    message: 'Usuário não encontrado.',
  },

  // Invalid token
  'Invalid token': {
    type: 'invalid_token',
    message: 'Token inválido.',
  },

  // Token expired
  'Token has expired': {
    type: 'token_expired',
    message: 'Este link expirou. Solicite uma nova recuperação de senha.',
  },

  // Rate limiting
  'Too many requests': {
    type: 'too_many_requests',
    message: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
  },

  // Sign up disabled
  'Signups not allowed': {
    type: 'unknown_error',
    message: 'O cadastro está temporariamente desabilitado.',
  },
}

/**
 * Convert a Supabase error to a user-friendly AuthError
 */
export function handleAuthError(error: unknown): AuthError {
  // Default error
  const defaultError: AuthError = {
    type: 'unknown_error',
    message: 'Ocorreu um erro inesperado. Tente novamente.',
  }

  // If error is a string
  if (typeof error === 'string') {
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return { ...value, originalError: error }
      }
    }
    return { ...defaultError, originalError: error }
  }

  // If error is an Error object
  if (error instanceof Error) {
    const errorMessage = error.message

    // Check for specific error messages
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return { ...value, originalError: errorMessage }
      }
    }

    // Check for error status
    const authError = error as any
    if (authError.status === 400) {
      if (errorMessage.includes('Email not confirmed')) {
        return ERROR_MESSAGES['Email not confirmed']
      }
    }
    if (authError.status === 422) {
      if (errorMessage.includes('User already registered')) {
        return ERROR_MESSAGES['User already registered']
      }
    }
    if (authError.status === 429) {
      return ERROR_MESSAGES['Too many requests']
    }

    return { ...defaultError, originalError: errorMessage }
  }

  // If error is an object with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return handleAuthError((error as any).message)
  }

  return defaultError
}

/**
 * Check if an error indicates that email is not confirmed
 */
export function isEmailNotConfirmedError(error: AuthError): boolean {
  return error.type === 'email_not_confirmed'
}

/**
 * Check if an error is about duplicate email
 */
export function isDuplicateEmailError(error: AuthError): boolean {
  return error.type === 'email_already_exists'
}

/**
 * Check if an error is about weak password
 */
export function isWeakPasswordError(error: AuthError): boolean {
  return error.type === 'weak_password'
}
