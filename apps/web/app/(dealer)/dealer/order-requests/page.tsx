import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getDealerOrderRequests } from "@/lib/services/dealer";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default async function DealerOrderRequestsPage() {
  const { dealerAccount, orders } = await getDealerOrderRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Order Requests</h1>
        <p className="text-muted-foreground">Submitted quote/order requests for {dealerAccount.name}.</p>
      </div>
      <div className="grid gap-4">
        {orders.length === 0 && <Card>No order requests yet.</Card>}
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)} · {formatMoney(order.subtotalCents)}</p>
                </div>
                <Badge>{order.status}</Badge>
              </div>
            </CardHeader>
            <div className="space-y-2 text-sm">
              {order.odooReferenceId && <p><span className="font-semibold">Odoo ref:</span> {order.odooReferenceId}</p>}
              {order.items.map((item) => (
                <p key={item.sku}>{item.quantity} × {item.sku} · {item.name}</p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
