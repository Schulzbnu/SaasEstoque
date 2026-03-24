'use client'

/**
 * Forgot Password Form Component
 *
 * Client component for password reset request
 * Following the Design System
 */

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword, type ForgotPasswordResult } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
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
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card size="lg" className="w-full max-w-md">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Esqueceu sua senha?</h1>
          <p className="text-lg text-muted-foreground">
            Sem problemas! Digite seu email e enviaremos instruções para redefinir.
          </p>
        </div>

        {/* Success alert */}
        {isSuccess && (
          <Alert variant="success" className="mb-6">
            <p className="font-medium mb-1">Email enviado!</p>
            <p className="text-sm">
              Enviamos as instruções para <strong>{formData.email}</strong>.
              O link expira em 1 hora.
            </p>
          </Alert>
        )}

        {/* Error alert */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            {submitError}
          </Alert>
        )}

        {/* Forgot Password Form */}
        {!isSuccess ? (
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

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full"
            >
              Enviar instruções
            </Button>
          </form>
        ) : (
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setIsSuccess(false)
              setFormData({ email: '' })
            }}
            className="w-full"
          >
            Enviar para outro email
          </Button>
        )}

        {/* Back to login link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Lembrou sua senha?{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Voltar ao login
          </Link>
        </p>
      </Card>
    </div>
  )
}
