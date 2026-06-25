import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDealerAccounts } from "@/lib/services/admin";

export default async function DealerAccountsPage() {
  const accounts = await getAdminDealerAccounts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Dealer Accounts</h1>
      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{account.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{account.accountNumber} · {account.odooPartnerId}</p>
                </div>
                <Badge tone={account.isActive ? "success" : "danger"}>{account.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </CardHeader>
            <p className="text-sm text-muted-foreground">Exact inventory: {account.allowExactInventory ? "Enabled" : "Hidden by default"}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
