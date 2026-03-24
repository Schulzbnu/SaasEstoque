'use client'

/**
 * Sign Up Form Component
 *
 * Modern signup form with split-screen layout
 * Following the Design System authentication patterns
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signUp, type SignUpResult } from '@/actions/auth'
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
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">Automatizar360</h1>
          <p className="text-white/80 mt-2">Controle de Estoque Inteligente</p>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Comece gratuitamente hoje
          </h2>
          <p className="text-xl text-white/80 leading-relaxed">
            Junte-se a mais de 1.200 lojas que já transformaram seu negócio.
            14 dias grátis, sem cartão de crédito.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90">Setup em 5 minutos</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90">Suporte via WhatsApp</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-white/90">Cancele quando quiser</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Automatizar360. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Criar conta
            </h1>
            <p className="text-base text-muted-foreground">
              Comece sua avaliação gratuita de 14 dias
            </p>
          </div>

          {/* Social Login (placeholder) */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-input rounded-md bg-background hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-foreground">
                Continuar com Google
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                ou continue com email
              </span>
            </div>
          </div>

          {/* Success message - needs confirmation */}
          {needsConfirmation && !submitError && (
            <div className="p-4 rounded-lg bg-success/10 text-success border border-success/20 flex items-start gap-3 mb-6">
              <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-success">Email de confirmação enviado!</p>
                <p className="text-sm text-success/80 mt-1">
                  Enviamos um link para <strong>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                  className="mt-2 text-sm font-medium underline hover:no-underline disabled:opacity-50"
                >
                  Reenviar email de confirmação
                </button>
              </div>
            </div>
          )}

          {/* Error alert */}
          {submitError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3 mb-6">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium">Erro ao criar conta</p>
                <p className="text-sm mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="João Silva"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${errors.fullName ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                autoComplete="name"
                required
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive mt-1.5">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${errors.email ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                autoComplete="email"
                required
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Senha
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${errors.password ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                autoComplete="new-password"
                required
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1.5">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                Mínimo 8 caracteres, incluindo letras e números
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Confirmar senha
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-md border bg-background text-foreground placeholder:text-muted-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 ${errors.confirmPassword ? 'border-destructive focus:ring-destructive' : 'border-input'}`}
                autoComplete="new-password"
                required
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1.5">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                id="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 text-primary border-input rounded focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                disabled={isLoading}
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-foreground">
                Eu concordo com os{' '}
                <Link href="/terms" className="text-primary hover:underline font-medium">
                  Termos de Serviço
                </Link>
                {' '}e{' '}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Política de Privacidade
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive -mt-4">{errors.acceptTerms}</p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Criando conta...
                </>
              ) : (
                'Criar conta grátis'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
