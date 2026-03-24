/**
 * Organization Service
 *
 * Business logic for organization management
 * All methods are server-side only
 */

import { getSupabaseServerClient } from '@/lib/supabase/server'

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  plan: 'free' | 'pro' | 'enterprise'
  max_users: number
  max_products: number
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
  updated_at: string
}

export interface OrganizationWithRole extends Organization {
  role: 'owner' | 'admin' | 'member'
}

/**
 * Get user's default organization (first one created)
 */
export async function getUserOrganization() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não autenticado',
      },
    }
  }

  // Get user's organizations
  const { data: memberships, error: memberError } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      role,
      organizations (
        id,
        name,
        slug,
        logo_url,
        plan,
        max_users,
        max_products,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)

  if (memberError) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message: memberError.message,
      },
    }
  }

  if (!memberships || memberships.length === 0) {
    return {
      success: false,
      error: {
        type: 'organization_not_found',
        message: 'Organização não encontrada',
      },
    }
  }

  const membership = memberships[0]

  // Handle both array and single object from Supabase join
  const orgData = Array.isArray(membership.organizations)
    ? membership.organizations[0]
    : membership.organizations

  if (!orgData) {
    return {
      success: false,
      error: {
        type: 'organization_not_found',
        message: 'Organização não encontrada',
      },
    }
  }

  const organization = orgData as Organization

  return {
    success: true,
    data: {
      organization: {
        ...organization,
        role: membership.role,
      } as OrganizationWithRole,
    },
  }
}

/**
 * Ensure user has an organization (create if missing)
 * This is a fallback in case the trigger failed
 */
export async function ensureUserOrganization() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não autenticado',
      },
    }
  }

  // Check if user already has an organization
  const { data: existingOrg } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (existingOrg) {
    return {
      success: true,
      data: {
        alreadyExisted: true,
      },
    }
  }

  // Create personal organization
  const { data: newOrg, error } = await supabase.rpc('create_personal_organization', {
    user_id: user.id,
    user_email: user.email!,
  })

  if (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message: error.message,
      },
    }
  }

  return {
    success: true,
    data: {
      organizationId: newOrg,
      alreadyExisted: false,
    },
  }
}

/**
 * Get all organizations user is member of
 */
export async function getUserOrganizations() {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não autenticado',
      },
    }
  }

  const { data: memberships, error } = await supabase
    .from('organization_members')
    .select(`
      organization_id,
      role,
      organizations (
        id,
        name,
        slug,
        logo_url,
        plan,
        created_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message: error.message,
      },
    }
  }

  const organizations = memberships?.map((membership: any) => {
    // Handle both array and single object from Supabase join
    const orgData = Array.isArray(membership.organizations)
      ? membership.organizations[0]
      : membership.organizations

    return {
      ...orgData,
      role: membership.role,
    }
  }) || []

  return {
    success: true,
    data: {
      organizations,
    },
  }
}

/**
 * Update organization details
 */
export async function updateOrganization(organizationId: string, updates: {
  name?: string
  logoUrl?: string
}) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não autenticado',
      },
    }
  }

  // Check if user is owner or admin
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return {
      success: false,
      error: {
        type: 'permission_denied',
        message: 'Você não tem permissão para atualizar esta organização',
      },
    }
  }

  // Update organization
  const { data: org, error } = await supabase
    .from('organizations')
    .update({
      name: updates.name,
      logo_url: updates.logoUrl,
    })
    .eq('id', organizationId)
    .select()
    .single()

  if (error) {
    return {
      success: false,
      error: {
        type: 'database_error',
        message: error.message,
      },
    }
  }

  return {
    success: true,
    data: org,
  }
}

/**
 * Invite user to organization
 */
export async function inviteToOrganization(
  organizationId: string,
  email: string,
  role: 'admin' | 'member' = 'member'
) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      error: {
        type: 'user_not_found',
        message: 'Usuário não autenticado',
      },
    }
  }

  // Check if user is owner or admin
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single()

  if (!membership || !['owner', 'admin'].includes(membership.role)) {
    return {
      success: false,
      error: {
        type: 'permission_denied',
        message: 'Você não tem permissão para convidar usuários',
      },
    }
  }

  // Check if organization has reached user limit
  const { data: org } = await supabase
    .from('organizations')
    .select('max_users')
    .eq('id', organizationId)
    .single()

  if (!org) {
    return {
      success: false,
      error: {
        type: 'organization_not_found',
        message: 'Organização não encontrada',
      },
    }
  }

  const { count } = await supabase
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', organizationId)

  if (count && count >= org.max_users) {
    return {
      success: false,
      error: {
        type: 'limit_reached',
        message: 'Limite de usuários da organização atingido',
      },
    }
  }

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    // Add existing user to organization
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        user_id: existingUser.id,
        role,
      })

    if (memberError) {
      return {
        success: false,
        error: {
          type: 'database_error',
          message: memberError.message,
        },
      }
    }

    return {
      success: true,
      data: {
        invited: false,
        message: 'Usuário adicionado à organização',
      },
    }
  }

  // TODO: Send invitation email for new users
  // For now, return success
  return {
    success: true,
    data: {
      invited: true,
      message: 'Convite enviado com sucesso',
    },
  }
}
