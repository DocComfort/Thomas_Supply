import { createOdooClient } from "./client";
import { mockOdooProducts } from "./mock-data";
import type { OdooProduct } from "./types";

export async function getProductBySku(sku: string): Promise<OdooProduct | null> {
  const client = createOdooClient();
  if (client.mode === "mock") {
    return mockOdooProducts.find((product) => product.sku.toLowerCase() === sku.toLowerCase()) ?? null;
  }

  throw new Error("Real Odoo product lookup is not implemented.");
}

export async function searchProducts(query: string): Promise<OdooProduct[]> {
  const client = createOdooClient();
  if (client.mode === "mock") {
    const q = query.trim().toLowerCase();
    if (!q) return mockOdooProducts;
    return mockOdooProducts.filter((product) =>
      [product.sku, product.name, product.brand, product.category].join(" ").toLowerCase().includes(q)
    );
  }

  throw new Error("Real Odoo product search is not implemented.");
}
