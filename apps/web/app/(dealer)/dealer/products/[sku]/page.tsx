import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDealerProductDetail } from "@/lib/services/products";
import { formatMoney, inventoryLabel } from "@/lib/utils";
import { addToCartAction } from "./actions";

function inventoryTone(status: string) {
  if (status === "in_stock") return "success";
  if (status === "limited_stock") return "warning";
  return "danger";
}

export default async function ProductDetailPage({ params }: { params: { sku: string } }) {
  const detail = await getDealerProductDetail(decodeURIComponent(params.sku));
  const { product, price, inventory, canViewPricing } = detail;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">{product.sku}</p>
          <h1 className="text-2xl font-bold tracking-normal">{product.name}</h1>
          <p className="text-muted-foreground">{product.brand} · {product.category}</p>
        </div>
        {canViewPricing ? (
          <div className="rounded-lg border border-border bg-card px-4 py-3 text-right">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Dealer price</p>
            <p className="text-2xl font-bold text-primary">{formatMoney(price?.unitPriceCents)}</p>
          </div>
        ) : (
          <Badge tone="muted">Pricing hidden for this role</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Product detail</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="font-semibold">Unit</dt><dd className="text-muted-foreground">{product.uom}</dd></div>
            <div><dt className="font-semibold">Odoo product ID</dt><dd className="text-muted-foreground">{product.id}</dd></div>
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add to cart</CardTitle>
            <CardDescription>Order requests re-check price and inventory before submission.</CardDescription>
          </CardHeader>
          <form action={addToCartAction} className="space-y-3">
            <input type="hidden" name="sku" value={product.sku} />
            <label className="grid gap-2 text-sm font-medium">
              Quantity
              <Input name="quantity" type="number" min="1" max="999" defaultValue="1" />
            </label>
            <Button type="submit" className="w-full">Add to cart</Button>
          </form>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory availability</CardTitle>
          <CardDescription>Exact quantities are hidden unless enabled on the dealer account.</CardDescription>
        </CardHeader>
        <div className="grid gap-3 md:grid-cols-3">
          {inventory.map((item) => (
            <div key={item.locationCode} className="rounded-md border border-border p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-semibold">{item.locationName}</h3>
                <Badge tone={inventoryTone(item.status)}>{inventoryLabel(item.status)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {typeof item.quantity === "number" ? `${item.quantity} available` : "Quantity hidden"}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
