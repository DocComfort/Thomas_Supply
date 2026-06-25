import { PackageSearch, ShoppingCart, Users } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/link-button";
import { getDealerDashboardData } from "@/lib/services/dealer";

export default async function DealerDashboardPage() {
  const { dealerAccount, membership, cart, orders } = await getDealerDashboardData();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-normal">Dealer Dashboard</h1>
          <p className="text-muted-foreground">{dealerAccount.name} · {dealerAccount.accountNumber}</p>
        </div>
        <LinkButton href="/dealer/products">Search products</LinkButton>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><PackageSearch size={18} /> Product access</CardTitle>
            <CardDescription>Role: {membership.role}</CardDescription>
          </CardHeader>
          <p className="text-sm text-muted-foreground">Search the Odoo-backed product catalog and view availability by Thomas Supply branch.</p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingCart size={18} /> Active cart</CardTitle>
            <CardDescription>{cart.items.length} item{cart.items.length === 1 ? "" : "s"}</CardDescription>
          </CardHeader>
          <LinkButton href="/dealer/cart" variant="secondary">Open cart</LinkButton>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users size={18} /> Order requests</CardTitle>
            <CardDescription>{orders.length} submitted locally</CardDescription>
          </CardHeader>
          <LinkButton href="/dealer/order-requests" variant="secondary">View requests</LinkButton>
        </Card>
      </div>
    </div>
  );
}
