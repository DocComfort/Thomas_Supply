import { createSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Server-only access to the Odoo integration settings. The API key is stored
 * encrypted in Supabase Vault; these helpers read/write it through SECURITY
 * DEFINER functions that only the service role may call.
 */

export type OdooSettings = {
  baseUrl: string | null;
  database: string | null;
  username: string | null;
  hasApiKey: boolean;
  allowMock: boolean;
  updatedAt: string | null;
  updatedByEmail: string | null;
};

export type OdooConfig = OdooSettings & { apiKey: string | null };

async function readOdoo(): Promise<OdooConfig | null> {
  const db = createSupabaseAdminClient();
  const { data, error } = await db.rpc("get_odoo_integration");
  if (error) throw error;
  const row = (Array.isArray(data) ? data[0] : data) as
    | Record<string, unknown>
    | undefined;
  if (!row) return null;
  return {
    baseUrl: (row.base_url as string) ?? null,
    database: (row.odoo_database as string) ?? null,
    username: (row.odoo_username as string) ?? null,
    apiKey: (row.api_key as string) ?? null,
    hasApiKey: Boolean(row.has_api_key),
    allowMock: row.allow_mock === undefined ? true : Boolean(row.allow_mock),
    updatedAt: (row.updated_at as string) ?? null,
    updatedByEmail: (row.updated_by as string) ?? null,
  };
}

/** Full config including the decrypted API key — server-side use only. */
export async function getOdooConfig(): Promise<OdooConfig | null> {
  return readOdoo();
}

/** Masked settings for display — never includes the API key. */
export async function getOdooSettings(): Promise<OdooSettings | null> {
  const config = await readOdoo();
  if (!config) return null;
  return {
    baseUrl: config.baseUrl,
    database: config.database,
    username: config.username,
    hasApiKey: config.hasApiKey,
    allowMock: config.allowMock,
    updatedAt: config.updatedAt,
    updatedByEmail: config.updatedByEmail,
  };
}

export async function saveOdooSettings(input: {
  baseUrl: string;
  database: string;
  username: string;
  apiKey?: string | null;
  allowMock: boolean;
  updatedByEmail: string;
}): Promise<void> {
  const db = createSupabaseAdminClient();
  const { error } = await db.rpc("set_odoo_integration", {
    base_url: input.baseUrl,
    odoo_database: input.database,
    odoo_username: input.username,
    api_key: input.apiKey && input.apiKey.length > 0 ? input.apiKey : null,
    allow_mock: input.allowMock,
    updated_by: input.updatedByEmail,
  });
  if (error) throw error;
}
