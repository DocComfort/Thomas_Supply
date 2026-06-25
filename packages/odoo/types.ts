import type { InventoryStatus } from "@thomas-supply/shared";

export type OdooProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  uom: string;
};

export type OdooPrice = {
  sku: string;
  dealerAccountNumber: string;
  currency: "USD";
  unitPriceCents: number;
  expiresAt: string;
};

export type OdooInventory = {
  sku: string;
  locationCode: string;
  locationName: string;
  status: InventoryStatus;
  quantity?: number;
};

export type OdooQuotationItem = {
  sku: string;
  quantity: number;
  unitPriceCents: number;
};

export type OdooQuotationRequest = {
  dealerAccountNumber: string;
  requestedByEmail: string;
  notes?: string;
  items: OdooQuotationItem[];
};

export type OdooQuotationResponse = {
  referenceId: string;
  status: "sent_to_odoo" | "failed";
  message: string;
};

export type OdooInvoice = {
  id: string;
  invoiceNumber: string;
  status: string;
  totalCents: number;
  issuedAt: string;
};

export type OdooOrderHistoryItem = {
  id: string;
  orderNumber: string;
  status: string;
  totalCents: number;
  createdAt: string;
};
