import { createOdooClient } from "./client";
import { mockOdooInventory } from "./mock-data";
import type { OdooInventory } from "./types";

export async function getInventoryByLocation(sku: string): Promise<OdooInventory[]> {
  const client = createOdooClient();
  if (client.mode === "mock") {
    return mockOdooInventory[sku] ?? [];
  }

  throw new Error("Real Odoo inventory lookup is not implemented.");
}
