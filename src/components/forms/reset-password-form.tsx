'use client'

/**
 * Reset Password Form Component
 *
 * Client component for password reset after email confirmation
 * Following the Design System
 */

import { useState } from 'react'
import { resetPassword, type ResetPasswordResult } from '@/actions/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/validations'

export function ResetPasswordForm() {
  const [formData, setFormData] = useState<ResetPasswordInput>({
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordInput, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof ResetPasswordInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const result = resetPasswordSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Partial<Record<keyof ResetPasswordInput, string>> = {}
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ResetPasswordInput
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
      const result: ResetPasswordResult = await resetPassword(formData)

      if (!result.success && result.error) {
        setSubmitError(result.error.message)
      }
      // If successful, action will redirect to login
    } catch (error) {
      setSubmitError('Ocorreu um erro inesperado. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card size="lg" className="w-full max-w-md">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Redefinir senha</h1>
          <p className="text-lg text-muted-foreground">
            Digite sua nova senha abaixo
          </p>
        </div>

        {/* Error alert */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            {submitError}
          </Alert>
        )}

        {/* Info alert */}
        <Alert variant="info" className="mb-6">
          <p className="text-sm">
            Lembre-se de escolher uma senha forte com pelo menos 8 caracteres,
            incluindo letras e números.
          </p>
        </Alert>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nova senha"
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
            label="Confirmar nova senha"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            className="w-full"
          >
            Redefinir senha
          </Button>
        </form>
      </Card>
    </div>
  )
}
