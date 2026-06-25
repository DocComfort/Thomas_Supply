import { createOdooClient } from "./client";
import type { OdooPrice } from "./types";

const basePrices: Record<string, number> = {
  "KP-2T-16S": 146500,
  "FAST-CAP-45-5": 1850,
  "GF-M8-1625": 6890,
  "LG-MINI-12K": 52300
};

const accountDiscounts: Record<string, number> = {
  "TS-1001": 0.88,
  "TS-2044": 0.92
};

export async function getDealerPrice(sku: string, dealerAccountNumber: string): Promise<OdooPrice> {
  const client = createOdooClient();
  if (client.mode === "mock") {
    const basePrice = basePrices[sku] ?? 9999;
    const multiplier = accountDiscounts[dealerAccountNumber] ?? 0.95;
    return {
      sku,
      dealerAccountNumber,
      currency: "USD",
      unitPriceCents: Math.round(basePrice * multiplier),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    };
  }

  throw new Error("Real Odoo dealer pricing is not implemented.");
}
