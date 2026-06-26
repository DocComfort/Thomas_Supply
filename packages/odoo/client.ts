export type OdooClientMode = "mock" | "real";

export type OdooCredentials = {
  baseUrl: string;
  database: string;
  username: string;
  apiKey: string;
};

export type OdooClient = {
  mode: OdooClientMode;
  baseUrl?: string;
  database?: string;
  username?: string;
  apiKey?: string;
};

export class OdooConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OdooConfigurationError";
  }
}

/**
 * Builds an Odoo client. Credentials come from the explicit `credentials`
 * argument when provided (e.g. the encrypted values an admin entered in the
 * portal's Integration Settings), otherwise from ODOO_* environment variables.
 */
export function createOdooClient(
  credentials?: Partial<OdooCredentials>
): OdooClient {
  const baseUrl = credentials?.baseUrl ?? process.env.ODOO_BASE_URL;
  const database = credentials?.database ?? process.env.ODOO_DATABASE;
  const username = credentials?.username ?? process.env.ODOO_USERNAME;
  const apiKey = credentials?.apiKey ?? process.env.ODOO_API_KEY;
  const values = [baseUrl, database, username, apiKey];
  const hasAnyCredential = values.some(Boolean);
  const hasAllCredentials = values.every(Boolean);

  if (hasAnyCredential && !hasAllCredentials) {
    throw new OdooConfigurationError(
      "Odoo credentials are partially configured. Provide all four values or none."
    );
  }

  if (!hasAllCredentials) {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.ODOO_ALLOW_MOCK !== "true"
    ) {
      throw new OdooConfigurationError(
        "Odoo credentials are required in production unless mock mode is allowed."
      );
    }
    return { mode: "mock" };
  }

  return {
    mode: "real",
    baseUrl: baseUrl as string,
    database: database as string,
    username: username as string,
    apiKey: apiKey as string,
  };
}

export type OdooConnectionResult = {
  ok: boolean;
  uid?: number;
  message: string;
};

/**
 * Verifies a set of Odoo credentials with a JSON-RPC `common.authenticate`
 * call. Returns the authenticated user id on success. Never throws — failures
 * come back as { ok: false, message }.
 */
export async function testOdooConnection(
  credentials: OdooCredentials
): Promise<OdooConnectionResult> {
  const endpoint = credentials.baseUrl.replace(/\/+$/, "") + "/jsonrpc";

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          service: "common",
          method: "authenticate",
          args: [
            credentials.database,
            credentials.username,
            credentials.apiKey,
            {},
          ],
        },
        id: 1,
      }),
      cache: "no-store",
    });
  } catch (error) {
    return {
      ok: false,
      message: `Couldn't reach Odoo at ${endpoint}: ${(error as Error).message}`,
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      message: `Odoo returned HTTP ${response.status} ${response.statusText}.`,
    };
  }

  let payload: {
    error?: { message?: string; data?: { message?: string } };
    result?: unknown;
  };
  try {
    payload = await response.json();
  } catch {
    return {
      ok: false,
      message: "Odoo returned a non-JSON response — check the base URL.",
    };
  }

  if (payload.error) {
    const message =
      payload.error.data?.message ||
      payload.error.message ||
      "Authentication error.";
    return { ok: false, message: `Odoo error: ${message}` };
  }

  const uid = payload.result;
  if (typeof uid === "number" && uid > 0) {
    return {
      ok: true,
      uid,
      message: `Connected — authenticated as Odoo user id ${uid}.`,
    };
  }

  return {
    ok: false,
    message:
      "Odoo rejected the credentials (check the database, username, or API key).",
  };
}

export async function callOdoo<T>(
  _client: OdooClient,
  _model: string,
  _method: string,
  _args: unknown[]
): Promise<T> {
  throw new Error(
    "Real Odoo RPC is not implemented yet. Add JSON-RPC/XML-RPC logic in packages/odoo/client.ts."
  );
}
