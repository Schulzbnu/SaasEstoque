'use client'

/**
 * Forgot Password Form Component
 *
 * Modern forgot password form with split-screen layout
 * Following the Design System authentication patterns
 */

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword, type ForgotPasswordResult } from '@/actions/auth'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'

export function ForgotPasswordForm() {
  const [formData, setFormData] = useState<ForgotPasswordInput>({
    email: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof ForgotPasswordInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const result = forgotPasswordSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Partial<Record<keyof ForgotPasswordInput, string>> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ForgotPasswordInput
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
    setIsSuccess(false)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const result: ForgotPasswordResult = await forgotPassword(formData)

      if (!result.success && result.error) {
        setSubmitError(result.error.message)
      } else {
        setIsSuccess(true)
      }
    } catch (error) {
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
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
            Esqueceu sua senha?
          </h2>
          <p className="text-xl text-white/80 leading-relaxed">
            Sem problemas! Vamos ajudá-lo a recuperar o acesso à sua conta.
          </p>
        </div>

        <div className="relative z-10 text-white/60 text-sm">
          © 2026 Automatizar360. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Recuperar senha
            </h1>
            <p className="text-base text-muted-foreground">
              Digite seu email e enviaremos as instruções
            </p>
          </div>

          {/* Error alert */}
          {submitError && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 flex items-start gap-3 mb-6">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium">Erro ao enviar email</p>
                <p className="text-sm mt-0.5">{submitError}</p>
              </div>
            </div>
          )}

          {/* Success state */}
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Email enviado!
              </h2>
              <p className="text-muted-foreground mb-6">
                Enviamos as instruções para <strong>{formData.email}</strong>.
                <br />
                O link expira em 1 hora.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false)
                  setFormData({ email: '' })
                }}
                className="w-full px-4 py-2.5 border border-input rounded-md font-medium text-foreground bg-background hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Enviar para outro email
              </button>
            </div>
          ) : (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-md font-medium transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar instruções'
                  )}
                </button>
              </form>

              {/* Back to login link */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                Lembrou sua senha?{' '}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Voltar ao login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
