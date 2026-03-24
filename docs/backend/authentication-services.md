# Backend Authentication Implementation

## Overview

Complete authentication backend implementation using Supabase Auth with TypeScript, Zod validation, and Next.js Server Actions.

---

## Architecture

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   ├── server.ts      # Server Supabase client (cookie-based)
│   │   └── admin.ts       # Admin Supabase client (service role)
│   ├── validations/
│   │   └── auth.ts        # Zod validation schemas
│   ├── errors/
│   │   └── auth-errors.ts # Error handling utilities
│   └── services/
│       └── auth-service.ts # Authentication service layer
├── actions/
│   └── auth/
│       ├── login-action.ts
│       ├── signup-action.ts
│       ├── forgot-password-action.ts
│       ├── reset-password-action.ts
│       └── resend-confirmation-action.ts
└── types/
    └── index.ts           # Type definitions
```

---

## Validation Schemas

### Login
```typescript
{
  email: string (valid email)
  password: string (required)
  remember?: boolean
}
```

### Sign Up
```typescript
{
  email: string (valid email, unique)
  password: string (min 8 chars, 1 letter, 1 number)
  confirmPassword: string (must match password)
  fullName: string (min 2 chars)
  acceptTerms: boolean (must be true)
}
```

### Forgot Password
```typescript
{
  email: string (valid email)
}
```

### Reset Password
```typescript
{
  password: string (min 8 chars, 1 letter, 1 number)
  confirmPassword: string (must match password)
}
```

---

## Server Actions

### `login(email, password)`
Validates credentials and creates session.

**Returns:**
- `success: true` - Redirects to `/dashboard`
- `success: false` - Returns error object

### `signUp(email, password, fullName, confirmPassword, acceptTerms)`
Creates new user account.

**Returns:**
- `success: true, requiresConfirmation: true` - Email confirmation required
- `success: true, requiresConfirmation: false` - Auto-confirmed (development)
- `success: false` - Returns error (duplicate email, weak password, etc.)

### `forgotPassword(email)`
Sends password reset email.

**Returns:**
- `success: true` - Email sent (always returns success to prevent email enumeration)

### `resetPassword(password, confirmPassword)`
Updates user password.

**Returns:**
- `success: true` - Password updated, redirects to `/login`
- `success: false` - Returns error

### `resendConfirmationEmail(email)`
Resends email confirmation link.

**Returns:**
- `success: true` - Email sent
- `success: false` - Returns error

---

## Error Handling

All Supabase errors are converted to user-friendly messages:

| Error Type | Message |
|------------|---------|
| `email_not_confirmed` | "Por favor, confirme seu email antes de fazer login." |
| `invalid_credentials` | "Email ou senha incorretos." |
| `email_already_exists` | "Este email já está cadastrado." |
| `weak_password` | "A senha deve ter no mínimo 8 caracteres, uma letra e um número." |
| `user_not_found` | "Usuário não encontrado." |
| `invalid_token` | "Token inválido." |
| `token_expired` | "Este link expirou. Solicite uma nova recuperação de senha." |
| `too_many_requests` | "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente." |
| `unknown_error` | "Ocorreu um erro inesperado. Tente novamente." |

---

## Supabase Client Usage

### Browser Client (Client Components)
```typescript
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

const supabase = getSupabaseBrowserClient()
```

### Server Client (Server Components/Actions)
```typescript
import { getSupabaseServerClient } from '@/lib/supabase/server'

const supabase = await getSupabaseServerClient()
```

### Admin Client (Server only, bypasses RLS)
```typescript
import { getSupabaseAdminClient } from '@/lib/supabase/admin'

const supabase = getSupabaseAdminClient()
```

---

## Helper Functions

### `getAuthenticatedUser()`
Returns the current authenticated user or `null`.

```typescript
import { getAuthenticatedUser } from '@/lib/supabase/server'

const user = await getAuthenticatedUser()
if (user) {
  console.log('User is authenticated:', user.email)
}
```

### `isAuthenticated()`
Returns `true` if user is authenticated.

```typescript
import { isAuthenticated } from '@/lib/supabase/server'

const isLoggedIn = await isAuthenticated()
```

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Next Steps (Frontend Developer)

1. Create authentication pages (Login, Sign Up, Forgot Password, Reset Password)
2. Create form components following the Design System
3. Implement form validation and error display
4. Add loading states
5. Connect forms to Server Actions
6. Implement navigation between auth flows
7. Add "resend confirmation email" option
