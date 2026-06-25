import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDealerAccountCenter } from "@/lib/services/dealer";

export default async function AccountCenterPage() {
  const { dealerAccount } = await getDealerAccountCenter();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Account Center</h1>
      <Card>
        <CardHeader>
          <CardTitle>{dealerAccount.name}</CardTitle>
          <CardDescription>Placeholder for account profile, invoice preferences, and Odoo account metadata.</CardDescription>
        </CardHeader>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-semibold">Account number</dt><dd className="text-muted-foreground">{dealerAccount.accountNumber}</dd></div>
          <div><dt className="font-semibold">Odoo partner ID</dt><dd className="text-muted-foreground">{dealerAccount.odooPartnerId}</dd></div>
        </dl>
      </Card>
    </div>
  );
}
