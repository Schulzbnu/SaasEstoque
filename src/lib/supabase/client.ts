/**
 * Supabase Client - Browser
 *
 * Client-side Supabase client for use in Client Components
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Get a Supabase client for use in Client Components
 * This creates a new client instance on every call to avoid stale data
 */
export function getSupabaseBrowserClient(): SupabaseClient {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Singleton Supabase client for browser
 * Use this when you need to maintain the same instance across multiple calls
 */
let browserClient: SupabaseClient | null = null

export function getSupabaseBrowserClientSingleton(): SupabaseClient {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return browserClient
}
