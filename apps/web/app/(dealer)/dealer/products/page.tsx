import Link from "next/link";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchDealerProducts } from "@/lib/services/products";

export default async function ProductSearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? "";
  const products = await searchDealerProducts({ q });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Product Search</h1>
        <p className="text-muted-foreground">Search products from the Odoo-backed catalog cache.</p>
      </div>
      <Card>
        <form className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-muted-foreground" size={18} />
            <Input name="q" defaultValue={q} placeholder="Search by SKU, brand, category, or product name" className="pl-10" />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </Card>
      <div className="grid gap-3">
        {products.map((product) => (
          <Link key={product.sku} href={`/dealer/products/${encodeURIComponent(product.sku)}`} className="rounded-lg border border-border bg-card p-4 shadow-sm hover:border-primary/40">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">{product.sku}</p>
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-muted-foreground">{product.brand} · {product.category}</p>
              </div>
              <span className="text-sm font-semibold text-primary">View detail</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
