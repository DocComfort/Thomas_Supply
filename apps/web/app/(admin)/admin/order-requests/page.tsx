import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminOrderRequests } from "@/lib/services/admin";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default async function AdminOrderRequestsPage() {
  const orders = await getAdminOrderRequests();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Order Requests</h1>
      <div className="grid gap-4">
        {orders.length === 0 && <Card>No submitted order requests yet.</Card>}
        {orders.map((order) => {
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{order.dealerAccount?.name ?? order.dealerAccountId}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.id} · {order.user?.email} · {formatDateTime(order.createdAt)}</p>
                  </div>
                  <Badge>{order.status}</Badge>
                </div>
              </CardHeader>
              <div className="space-y-2 text-sm">
                <p className="font-semibold">{formatMoney(order.subtotalCents)} · {order.items.length} item{order.items.length === 1 ? "" : "s"}</p>
                {order.odooReferenceId && <p>Odoo reference: {order.odooReferenceId}</p>}
                {order.items.map((item) => (
                  <p key={item.sku}>{item.quantity} × {item.sku} · {item.name}</p>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
