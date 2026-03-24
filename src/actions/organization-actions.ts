'use server'

/**
 * Organization Server Actions
 *
 * Server-side actions for organization management
 */

import { ensureUserOrganization, getUserOrganization } from '@/lib/services/organization-service'

export interface EnsureOrganizationResult {
  success: boolean
  data?: {
    organizationId?: string
    alreadyExisted?: boolean
  }
  error?: {
    type: string
    message: string
  }
}

export interface GetOrganizationResult {
  success: boolean
  data?: {
    organization: any
  }
  error?: {
    type: string
    message: string
  }
}

/**
 * Ensure user has an organization (create if missing)
 * Call this on first login or dashboard access
 */
export async function ensureOrganization(): Promise<EnsureOrganizationResult> {
  try {
    const result = await ensureUserOrganization()

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: {
        organizationId: result.data?.organizationId,
        alreadyExisted: result.data?.alreadyExisted,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'unknown_error',
        message: 'Ocorreu um erro inesperado',
      },
    }
  }
}

/**
 * Get user's current organization
 */
export async function getCurrentOrganization(): Promise<GetOrganizationResult> {
  try {
    const result = await getUserOrganization()

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      }
    }

    return {
      success: true,
      data: {
        organization: result.data.organization,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: {
        type: 'unknown_error',
        message: 'Ocorreu um erro inesperado',
      },
    }
  }
}
