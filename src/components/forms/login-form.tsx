'use client'

/**
 * Login Form Component
 *
 * Client component for user login with validation and error handling
 * Following the Design System
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { login, type LoginResult } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { loginSchema, type LoginInput } from '@/lib/validations'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  const [formData, setFormData] = useState<LoginInput>({
    email: '',
    password: '',
    remember: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof LoginInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error when user types
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Partial<Record<keyof LoginInput, string>> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LoginInput
        newErrors[field] = error.message
      })
      setErrors(newErrors)
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result: LoginResult = await login(formData)

      if (!result.success && result.error) {
        setSubmitError(result.error.message)

        // Special handling for email not confirmed
        if (result.error.type === 'email_not_confirmed') {
          setSubmitError(
            `${result.error.message} ` +
            `<Link href="/signup?email=${encodeURIComponent(formData.email)}" className="underline">Reenviar email de confirmação</Link>`
          )
        }
      }
      // If successful, login action will redirect to dashboard
    } catch (error) {
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card size="lg" className="w-full max-w-md">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Bem-vindo de volta</h1>
          <p className="text-lg text-muted-foreground">
            Entre com sua conta para continuar
          </p>
        </div>

        {/* Success message from redirect */}
        {message === 'password-reset-success' && (
          <Alert variant="success" className="mb-6">
            Senha redefinida com sucesso! Faça login com sua nova senha.
          </Alert>
        )}

        {/* Error alert */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            {submitError}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-foreground">
                Senha
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Esqueceu sua senha?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-md border bg-background text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-input rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-foreground">
              Lembrar-me
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
          >
            Entrar
          </Button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Não tem uma conta?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  )
}
