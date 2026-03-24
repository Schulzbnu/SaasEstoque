/**
 * Supabase Client - Server
 *
 * Server-side Supabase client for use in Server Components and Server Actions
 * Uses cookies to maintain session
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Get a Supabase client for use in Server Components and Server Actions
 * Automatically handles cookie-based session management
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // In Server Components, this may be called from a Server Action
            // and we might not be able to set cookies
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Same as set, ignore errors in Server Actions
          }
        },
      },
    }
  )
}

/**
 * Get the current authenticated user from the server
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser() {
  const supabase = await getSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Check if the current session is valid
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthenticatedUser()
  return user !== null
}
