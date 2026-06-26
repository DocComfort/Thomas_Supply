import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminDealerAccounts } from "@/lib/services/admin";
import {
  createDealerAccountAction,
  setDealerAccountActiveAction,
  updateDealerAccountAction,
} from "../actions";

export const dynamic = "force-dynamic";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export default async function DealerAccountsPage({
  searchParams,
}: {
  searchParams?: { error?: string; ok?: string };
}) {
  const accounts = await getAdminDealerAccounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Dealer Accounts</h1>
        <p className="text-muted-foreground">
          The contractor companies that can access the dealer portal.
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
          <CardTitle>Add a contractor account</CardTitle>
        </CardHeader>
        <form
          action={createDealerAccountAction}
          className="grid gap-3 sm:grid-cols-2"
        >
          <Field label="Company name">
            <Input name="name" placeholder="Acme Mechanical" required />
          </Field>
          <Field label="Account number">
            <Input name="accountNumber" placeholder="TS-1234" required />
          </Field>
          <Field label="Odoo partner ID">
            <Input name="odooPartnerId" placeholder="odoo_partner_1234" required />
          </Field>
          <label className="flex items-end gap-2 pb-2.5 text-sm font-medium">
            <input type="checkbox" name="allowExactInventory" /> Show exact
            inventory quantities
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Add account</Button>
          </div>
        </form>
      </Card>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{account.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {account.accountNumber} · {account.odooPartnerId}
                  </p>
                </div>
                <Badge tone={account.isActive ? "success" : "danger"}>
                  {account.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <p className="text-sm text-muted-foreground">
              Exact inventory:{" "}
              {account.allowExactInventory ? "Enabled" : "Hidden by default"}
            </p>

            <div className="mt-4 flex flex-wrap items-start gap-3">
              <details className="flex-1">
                <summary className="cursor-pointer text-sm font-semibold text-primary">
                  Edit details
                </summary>
                <form
                  action={updateDealerAccountAction}
                  className="mt-3 grid gap-3 sm:grid-cols-2"
                >
                  <input type="hidden" name="id" value={account.id} />
                  <Field label="Company name">
                    <Input name="name" defaultValue={account.name} required />
                  </Field>
                  <Field label="Account number">
                    <Input
                      name="accountNumber"
                      defaultValue={account.accountNumber}
                      required
                    />
                  </Field>
                  <Field label="Odoo partner ID">
                    <Input
                      name="odooPartnerId"
                      defaultValue={account.odooPartnerId}
                      required
                    />
                  </Field>
                  <label className="flex items-end gap-2 pb-2.5 text-sm font-medium">
                    <input
                      type="checkbox"
                      name="allowExactInventory"
                      defaultChecked={account.allowExactInventory}
                    />{" "}
                    Show exact inventory quantities
                  </label>
                  <div className="sm:col-span-2">
                    <Button type="submit" variant="secondary">
                      Save changes
                    </Button>
                  </div>
                </form>
              </details>

              <form action={setDealerAccountActiveAction}>
                <input type="hidden" name="id" value={account.id} />
                <input
                  type="hidden"
                  name="isActive"
                  value={account.isActive ? "false" : "true"}
                />
                <Button type="submit" variant={account.isActive ? "danger" : "primary"}>
                  {account.isActive ? "Deactivate" : "Activate"}
                </Button>
              </form>
            </div>
          </Card>
        ))}
        {accounts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No contractor accounts yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}
