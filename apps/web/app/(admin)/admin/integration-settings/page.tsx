import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdminContext } from "@/lib/auth";

export default async function IntegrationSettingsPage() {
  await requireAdminContext("admin:integration");
  const hasOdooCredentials = Boolean(
    process.env.ODOO_BASE_URL &&
      process.env.ODOO_DATABASE &&
      process.env.ODOO_USERNAME &&
      process.env.ODOO_API_KEY
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Integration Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Odoo adapter</CardTitle>
          <CardDescription>
            Current mode: {hasOdooCredentials ? "real credentials configured, adapter implementation pending" : "mock Odoo responses"}
          </CardDescription>
        </CardHeader>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>Set ODOO_BASE_URL, ODOO_DATABASE, ODOO_USERNAME, and ODOO_API_KEY in Vercel to connect the real adapter later.</p>
          <p>Frontend code calls app services only; Odoo credentials never reach the browser.</p>
        </div>
      </Card>
    </div>
  );
}
