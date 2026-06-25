export type OdooClientMode = "mock" | "real";

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

export function createOdooClient(): OdooClient {
  const baseUrl = process.env.ODOO_BASE_URL;
  const database = process.env.ODOO_DATABASE;
  const username = process.env.ODOO_USERNAME;
  const apiKey = process.env.ODOO_API_KEY;
  const values = [baseUrl, database, username, apiKey];
  const hasAnyCredential = values.some(Boolean);
  const hasAllCredentials = values.every(Boolean);

  if (hasAnyCredential && !hasAllCredentials) {
    throw new OdooConfigurationError("Odoo credentials are partially configured. Set all ODOO_* variables or none.");
  }

  if (!hasAllCredentials) {
    if (process.env.NODE_ENV === "production" && process.env.ODOO_ALLOW_MOCK !== "true") {
      throw new OdooConfigurationError("Odoo credentials are required in production unless ODOO_ALLOW_MOCK=true.");
    }
    return { mode: "mock" };
  }

  return {
    mode: "real",
    baseUrl: baseUrl as string,
    database: database as string,
    username: username as string,
    apiKey: apiKey as string
  };
}

export async function callOdoo<T>(_client: OdooClient, _model: string, _method: string, _args: unknown[]): Promise<T> {
  throw new Error("Real Odoo RPC is not implemented yet. Add JSON-RPC/XML-RPC logic in packages/odoo/client.ts.");
}
