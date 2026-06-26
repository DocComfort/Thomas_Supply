import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireAdminContext } from "@/lib/auth";
import { getOdooSettings } from "@/lib/settings";
import {
  saveOdooSettingsAction,
  testOdooConnectionAction,
} from "./actions";

export const dynamic = "force-dynamic";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span className="flex items-center justify-between">
        {label}
        {hint && (
          <span className="text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}

export default async function IntegrationSettingsPage({
  searchParams,
}: {
  searchParams?: { error?: string; ok?: string };
}) {
  await requireAdminContext("admin:integration");
  const settings = await getOdooSettings();
  const configured = Boolean(
    settings?.baseUrl &&
      settings?.database &&
      settings?.username &&
      settings?.hasApiKey
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">
          Integration Settings
        </h1>
        <p className="text-muted-foreground">
          Connect the portal to your Odoo system. Credentials are entered here,
          encrypted, and never shown in the browser.
        </p>
      </div>

      {searchParams?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          {searchParams.error}
        </div>
      )}
      {searchParams?.ok && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          {searchParams.ok}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Odoo connection</CardTitle>
              <CardDescription>
                {settings?.updatedAt
                  ? `Last updated ${new Date(
                      settings.updatedAt
                    ).toLocaleString()}${
                      settings.updatedByEmail
                        ? ` by ${settings.updatedByEmail}`
                        : ""
                    }`
                  : "Not configured yet — the portal is using mock data."}
              </CardDescription>
            </div>
            <Badge tone={configured ? "success" : "muted"}>
              {configured ? "Configured" : "Using mock data"}
            </Badge>
          </div>
        </CardHeader>

        <form
          action={saveOdooSettingsAction}
          className="grid gap-3 sm:grid-cols-2"
        >
          <Field label="Odoo URL">
            <Input
              name="baseUrl"
              type="url"
              placeholder="https://yourcompany.odoo.com"
              defaultValue={settings?.baseUrl ?? ""}
              required
            />
          </Field>
          <Field label="Database">
            <Input
              name="database"
              placeholder="yourcompany"
              defaultValue={settings?.database ?? ""}
              required
            />
          </Field>
          <Field label="Username / email">
            <Input
              name="username"
              placeholder="integration@yourcompany.com"
              defaultValue={settings?.username ?? ""}
              required
            />
          </Field>
          <Field
            label="API key"
            hint={settings?.hasApiKey ? "Saved — leave blank to keep" : "Required"}
          >
            <Input
              name="apiKey"
              type="password"
              autoComplete="off"
              placeholder={
                settings?.hasApiKey ? "•••••••• (unchanged)" : "Odoo API key"
              }
            />
          </Field>
          <label className="flex items-center gap-2 pt-1 text-sm font-medium sm:col-span-2">
            <input
              type="checkbox"
              name="allowMock"
              defaultChecked={settings ? settings.allowMock : true}
            />
            Fall back to mock data when Odoo can&apos;t be reached
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Save settings</Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test connection</CardTitle>
          <CardDescription>
            Authenticates the saved credentials against Odoo so you know they
            work before relying on them.
          </CardDescription>
        </CardHeader>
        <form action={testOdooConnectionAction}>
          <Button type="submit" variant="secondary" disabled={!configured}>
            Test saved connection
          </Button>
        </form>
      </Card>

      <p className="text-xs text-muted-foreground">
        The API key is encrypted at rest in Supabase Vault and only decrypted on
        the server to talk to Odoo — it never reaches the browser, and the
        public keys can&apos;t read it.
      </p>
    </div>
  );
}
