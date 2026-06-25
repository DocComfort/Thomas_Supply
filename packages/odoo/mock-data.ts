import type {
  OdooInventory,
  OdooInvoice,
  OdooOrderHistoryItem,
  OdooProduct
} from "./types";

export const mockOdooProducts: OdooProduct[] = [
  {
    id: "odoo_product_2001",
    sku: "KP-2T-16S",
    name: "KeepRite 2 Ton 16 SEER Condenser",
    description: "Residential split-system condenser for dealer quotation requests.",
    brand: "KeepRite",
    category: "Equipment",
    uom: "ea"
  },
  {
    id: "odoo_product_2002",
    sku: "FAST-CAP-45-5",
    name: "OEM Dual Run Capacitor 45/5 MFD",
    description: "OEM Fast Parts dual run capacitor for ICP-family equipment.",
    brand: "FAST Parts",
    category: "Electrical",
    uom: "ea"
  },
  {
    id: "odoo_product_2003",
    sku: "GF-M8-1625",
    name: "Glasfloss MERV 8 Filter 16x25x1",
    description: "Contractor pack replacement air filter.",
    brand: "Glasfloss",
    category: "Filters",
    uom: "case"
  },
  {
    id: "odoo_product_2004",
    sku: "LG-MINI-12K",
    name: "LG 12K BTU Mini-Split Indoor Unit",
    description: "Wall-mounted indoor mini-split unit for matched LG systems.",
    brand: "LG",
    category: "Ductless",
    uom: "ea"
  }
];

export const mockOdooInventory: Record<string, OdooInventory[]> = {
  "KP-2T-16S": [
    { sku: "KP-2T-16S", locationCode: "LC", locationName: "Lake Charles", status: "in_stock", quantity: 18 },
    { sku: "KP-2T-16S", locationCode: "LFT", locationName: "Lafayette", status: "limited_stock", quantity: 3 },
    { sku: "KP-2T-16S", locationCode: "BMT", locationName: "Beaumont", status: "limited_stock", quantity: 4 }
  ],
  "FAST-CAP-45-5": [
    { sku: "FAST-CAP-45-5", locationCode: "LC", locationName: "Lake Charles", status: "in_stock", quantity: 30 },
    { sku: "FAST-CAP-45-5", locationCode: "LFT", locationName: "Lafayette", status: "in_stock", quantity: 12 },
    { sku: "FAST-CAP-45-5", locationCode: "BMT", locationName: "Beaumont", status: "limited_stock", quantity: 2 }
  ],
  "GF-M8-1625": [
    { sku: "GF-M8-1625", locationCode: "LC", locationName: "Lake Charles", status: "in_stock", quantity: 48 },
    { sku: "GF-M8-1625", locationCode: "LFT", locationName: "Lafayette", status: "limited_stock", quantity: 8 },
    { sku: "GF-M8-1625", locationCode: "BMT", locationName: "Beaumont", status: "out_of_stock", quantity: 0 }
  ],
  "LG-MINI-12K": [
    { sku: "LG-MINI-12K", locationCode: "LC", locationName: "Lake Charles", status: "limited_stock", quantity: 2 },
    { sku: "LG-MINI-12K", locationCode: "LFT", locationName: "Lafayette", status: "limited_stock", quantity: 3 },
    { sku: "LG-MINI-12K", locationCode: "BMT", locationName: "Beaumont", status: "limited_stock", quantity: 1 }
  ]
};

export const mockInvoices: OdooInvoice[] = [
  {
    id: "invoice_demo_1",
    invoiceNumber: "INV-10442",
    status: "open",
    totalCents: 124900,
    issuedAt: "2026-06-01T14:00:00.000Z"
  }
];

export const mockOrderHistory: OdooOrderHistoryItem[] = [
  {
    id: "order_demo_1",
    orderNumber: "SO-88421",
    status: "fulfilled",
    totalCents: 24850,
    createdAt: "2026-05-28T16:30:00.000Z"
  }
];
