import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { getDealerCart } from "@/lib/services/cart";
import { formatMoney } from "@/lib/utils";
import { submitOrderRequestAction, updateCartItemAction } from "./actions";

export default async function CartPage() {
  const cart = await getDealerCart();
  const subtotal = cart.items.reduce((sum, item) => sum + (item.quotedUnitPriceCents ?? 0) * item.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Cart</h1>
        <p className="text-muted-foreground">Build a quote/order request. Pricing and inventory are re-checked at submission.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>{cart.items.length} active cart item{cart.items.length === 1 ? "" : "s"}</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {cart.items.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
          {cart.items.map((item) => (
            <div key={item.sku} className="grid gap-3 rounded-md border border-border p-4 md:grid-cols-[1fr_130px_130px] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">{item.sku}</p>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{formatMoney(item.quotedUnitPriceCents)} each</p>
              </div>
              <form action={updateCartItemAction} className="flex gap-2">
                <input type="hidden" name="sku" value={item.sku} />
                <Input name="quantity" type="number" min="0" max="999" defaultValue={item.quantity} aria-label={`Quantity for ${item.sku}`} />
                <Button type="submit" variant="secondary">Update</Button>
              </form>
              <p className="text-right font-semibold">{formatMoney((item.quotedUnitPriceCents ?? 0) * item.quantity)}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Submit request</CardTitle>
          <CardDescription>Thomas Supply staff can review this in the admin dashboard.</CardDescription>
        </CardHeader>
        <form action={submitOrderRequestAction} className="space-y-4">
          <Textarea name="notes" placeholder="Optional job name, preferred pickup branch, or special instructions" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-bold">Estimated subtotal: {formatMoney(subtotal)}</p>
            <Button type="submit" disabled={cart.items.length === 0}>Submit order request</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
