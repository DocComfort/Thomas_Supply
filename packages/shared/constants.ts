export const APP_NAME = "Thomas Supply Dealer Portal";

export const DEALER_ROLES = ["owner", "purchaser", "technician", "viewer"] as const;
export const ADMIN_ROLES = ["admin", "sales", "warehouse", "accounting"] as const;

export const ORDER_REQUEST_STATUSES = [
  "draft",
  "submitted",
  "sent_to_odoo",
  "confirmed",
  "rejected",
  "failed"
] as const;

export const INVENTORY_STATUSES = ["in_stock", "limited_stock", "out_of_stock"] as const;

export const BRANCH_LOCATIONS = [
  { code: "LC", name: "Lake Charles", address: "625 15th Street, Lake Charles, LA" },
  { code: "ALX", name: "Alexandria", address: "3224 Industrial Street, Alexandria, LA" },
  { code: "LFT", name: "Lafayette", address: "210 North Luke Street, Lafayette, LA" },
  { code: "BMT", name: "Beaumont", address: "350 North MLK Drive, Beaumont, TX" },
  { code: "BRI", name: "Baton Rouge Industriplex", address: "11811 Dunlay Ave, Baton Rouge, LA" },
  { code: "BRC", name: "Baton Rouge Choctaw", address: "9170 S. Choctaw, Baton Rouge, LA" }
] as const;

export type DealerRole = (typeof DEALER_ROLES)[number];
export type AdminRole = (typeof ADMIN_ROLES)[number];
export type OrderRequestStatus = (typeof ORDER_REQUEST_STATUSES)[number];
export type InventoryStatus = (typeof INVENTORY_STATUSES)[number];
