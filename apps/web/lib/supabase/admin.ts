import { createClient } from "@supabase/supabase-js";

/**
 * Privileged, server-only Supabase client using the service_role key. It
 * bypasses row-level security and can use the Auth admin API (inviting users,
 * etc.), so it must NEVER be imported into client components. All dealer/user
 * data writes and invitations go through this client, behind the app's own
 * permission checks.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
