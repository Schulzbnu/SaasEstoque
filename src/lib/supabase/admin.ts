/**
 * Supabase Client - Admin
 *
 * Admin client with service role key for privileged operations
 * NEVER expose this to the client!
 */

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Get a Supabase admin client with service role privileges
 * WARNING: This bypasses RLS! Use with extreme caution.
 *
 * Only use server-side for:
 * - Admin operations
 * - Background jobs
 * - User management without authentication context
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
