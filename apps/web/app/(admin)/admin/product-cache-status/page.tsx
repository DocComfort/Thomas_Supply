import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminProductCacheStatus } from "@/lib/services/admin";
import { formatDateTime } from "@/lib/utils";

export default async function ProductCacheStatusPage() {
  const products = await getAdminProductCacheStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Product Cache Status</h1>
        <p className="text-muted-foreground">Local product cache populated from the Odoo adapter.</p>
      </div>
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.sku}>
            <CardHeader>
              <CardTitle>{product.sku} · {product.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{product.brand} · {product.category} · synced {formatDateTime(product.lastSyncedAt)}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
