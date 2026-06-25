import { createOdooClient } from "./client";
import { mockOrderHistory } from "./mock-data";
import type { OdooOrderHistoryItem, OdooQuotationRequest, OdooQuotationResponse } from "./types";

export async function createQuotationRequest(request: OdooQuotationRequest): Promise<OdooQuotationResponse> {
  const client = createOdooClient();
  if (client.mode === "mock") {
    return {
      referenceId: `MOCK-SO-${Date.now()}`,
      status: "sent_to_odoo",
      message: `Mock quotation request created for ${request.dealerAccountNumber}.`
    };
  }

  throw new Error("Real Odoo quotation creation is not implemented.");
}

export async function getDealerOrderHistory(_dealerAccountNumber: string): Promise<OdooOrderHistoryItem[]> {
  const client = createOdooClient();
  if (client.mode === "mock") return mockOrderHistory;

  throw new Error("Real Odoo order history is not implemented.");
}
