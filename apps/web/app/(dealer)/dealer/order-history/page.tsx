import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDealerOrderHistoryData } from "@/lib/services/dealer";
import { formatDateTime, formatMoney } from "@/lib/utils";

export default async function OrderHistoryPage() {
  const { history } = await getDealerOrderHistoryData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Order History</h1>
        <p className="text-muted-foreground">Placeholder backed by the Odoo adapter contract.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Odoo orders</CardTitle>
          <CardDescription>Replace the mock adapter to show real historical orders.</CardDescription>
        </CardHeader>
        <div className="space-y-2 text-sm">
          {history.map((order) => (
            <p key={order.id}>{order.orderNumber} · {order.status} · {formatMoney(order.totalCents)} · {formatDateTime(order.createdAt)}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}
