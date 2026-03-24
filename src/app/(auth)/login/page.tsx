/**
 * Login Page
 *
 * Page route for user login
 */

import { Suspense } from 'react'
import { LoginForm } from '@/components/forms/login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <div className="text-center text-muted-foreground">Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
