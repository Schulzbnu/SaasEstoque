/**
 * Sign Up Page
 *
 * Page route for user registration
 */

import { Suspense } from 'react'
import { SignUpForm } from '@/components/forms/signup-form'

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-muted p-4">
        <div className="text-center text-muted-foreground">Carregando...</div>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  )
}
