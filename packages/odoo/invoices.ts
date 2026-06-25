import { createOdooClient } from "./client";
import { mockInvoices } from "./mock-data";
import type { OdooInvoice } from "./types";

export async function getDealerInvoices(_dealerAccountNumber: string): Promise<OdooInvoice[]> {
  const client = createOdooClient();
  if (client.mode === "mock") return mockInvoices;

  throw new Error("Real Odoo invoice lookup is not implemented.");
}
