'use client'

/**
 * Sign Up Form Component
 *
 * Client component for user registration with validation
 * Following the Design System
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUp, type SignUpResult } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { signUpSchema, type SignUpInput } from '@/lib/validations'

export function SignUpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const [formData, setFormData] = useState<SignUpInput>({
    email: emailParam || '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof SignUpInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    // Clear error when user types
    if (errors[name as keyof SignUpInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const result = signUpSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Partial<Record<keyof SignUpInput, string>> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof SignUpInput
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
    setNeedsConfirmation(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result: SignUpResult = await signUp(formData)

      if (!result.success && result.error) {
        setSubmitError(result.error.message)
      } else if (result.requiresConfirmation) {
        setNeedsConfirmation(true)
      } else {
        // Auto-confirmed (development), redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      const { resendConfirmationEmail } = await import('@/actions/auth')
      const result = await resendConfirmationEmail(formData.email)

      if (!result.success && result.error) {
        setSubmitError(result.error.message)
      } else {
        setSubmitError('Email de confirmação reenviado com sucesso!')
        setNeedsConfirmation(true)
      }
    } catch {
      setSubmitError('Ocorreu um erro ao reenviar o email.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card size="lg" className="w-full max-w-md">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Criar conta</h1>
          <p className="text-lg text-muted-foreground">
            Comece sua avaliação gratuita hoje
          </p>
        </div>

        {/* Success message - needs confirmation */}
        {needsConfirmation && !submitError && (
          <Alert variant="success" className="mb-6">
            <p className="font-medium mb-1">Email de confirmação enviado!</p>
            <p className="text-sm">
              Enviamos um link de confirmação para <strong>{formData.email}</strong>.
              Por favor, verifique sua caixa de entrada.
            </p>
            <button
              type="button"
              onClick={handleResendConfirmation}
              disabled={isLoading}
              className="mt-3 text-sm underline hover:no-underline disabled:opacity-50"
            >
              Reenviar email de confirmação
            </button>
          </Alert>
        )}

        {/* Error alert */}
        {submitError && (
          <Alert variant={needsConfirmation ? 'success' : 'destructive'} className="mb-6">
            {submitError}
          </Alert>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome completo"
            type="text"
            name="fullName"
            placeholder="João Silva"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            autoComplete="name"
            required
          />

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

          <Input
            label="Senha"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
            required
          />

          <Input
            label="Confirmar senha"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <div className="flex items-start">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 text-primary border-input rounded focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <label htmlFor="acceptTerms" className="ml-2 text-sm text-foreground">
              Eu concordo com os{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Termos de Serviço
              </Link>
              {' '}e{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive -mt-4">{errors.acceptTerms}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
          >
            Criar conta
          </Button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Fazer login
          </Link>
        </p>
      </Card>
    </div>
  )
}
