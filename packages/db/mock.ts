import type {
  AdminRole,
  DealerRole,
  InventoryStatus,
  OrderRequestStatus
} from "@thomas-supply/shared";

export type OrganizationRecord = {
  id: string;
  name: string;
  slug: string;
};

export type DealerAccountRecord = {
  id: string;
  organizationId: string;
  name: string;
  accountNumber: string;
  odooPartnerId: string;
  isActive: boolean;
  allowExactInventory: boolean;
};

export type UserRecord = {
  id: string;
  organizationId?: string;
  email: string;
  name: string;
  adminRole?: AdminRole;
  isActive: boolean;
};

export type DealerUserMembershipRecord = {
  id: string;
  dealerAccountId: string;
  userId: string;
  role: DealerRole;
  isActive: boolean;
};

export type ProductRecord = {
  id: string;
  sku: string;
  odooProductId: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  uom: string;
  isActive: boolean;
  lastSyncedAt: string;
};

export type InventoryRecord = {
  productId: string;
  locationCode: string;
  locationName: string;
  status: InventoryStatus;
  quantity?: number;
  allowExactQuantity: boolean;
  lastSyncedAt: string;
};

export type PriceRecord = {
  dealerAccountId: string;
  productId: string;
  currency: string;
  unitPriceCents: number;
  expiresAt: string;
  source: "mock_odoo" | "odoo";
};

export type CartItemRecord = {
  sku: string;
  productId: string;
  name: string;
  quantity: number;
  quotedUnitPriceCents?: number;
};

export type CartSessionRecord = {
  id: string;
  dealerAccountId: string;
  userId: string;
  status: "active" | "submitted";
  items: CartItemRecord[];
  updatedAt: string;
};

export type OrderRequestItemRecord = {
  sku: string;
  productId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
  inventorySummary: InventoryRecord[];
};

export type OrderRequestRecord = {
  id: string;
  dealerAccountId: string;
  userId: string;
  status: OrderRequestStatus;
  notes: string;
  odooReferenceId?: string;
  subtotalCents: number;
  items: OrderRequestItemRecord[];
  createdAt: string;
  updatedAt: string;
};

export type SyncJobRecord = {
  id: string;
  jobType: string;
  status: "queued" | "running" | "succeeded" | "failed";
  message?: string;
  recordsRead: number;
  recordsWritten: number;
  error?: string;
  createdAt: string;
  startedAt?: string;
  finishedAt?: string;
};

export type ApiAuditLogRecord = {
  id: string;
  actorType: "dealer_user" | "admin_user" | "system";
  userId?: string;
  dealerAccountId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const organizations: OrganizationRecord[] = [
  { id: "org_thomas", name: "Thomas Supply Inc.", slug: "thomas-supply" }
];

const dealerAccounts: DealerAccountRecord[] = [
  {
    id: "dealer_acme",
    organizationId: "org_thomas",
    name: "Acme Mechanical",
    accountNumber: "TS-1001",
    odooPartnerId: "odoo_partner_1001",
    isActive: true,
    allowExactInventory: false
  },
  {
    id: "dealer_delta",
    organizationId: "org_thomas",
    name: "Delta Cooling Services",
    accountNumber: "TS-2044",
    odooPartnerId: "odoo_partner_2044",
    isActive: true,
    allowExactInventory: true
  }
];

const users: UserRecord[] = [
  {
    id: "user_owner",
    organizationId: "org_thomas",
    email: "owner@acme.test",
    name: "Olivia Owner",
    isActive: true
  },
  {
    id: "user_purchaser",
    organizationId: "org_thomas",
    email: "purchaser@acme.test",
    name: "Pat Purchaser",
    isActive: true
  },
  {
    id: "user_tech",
    organizationId: "org_thomas",
    email: "tech@acme.test",
    name: "Terry Technician",
    isActive: true
  },
  {
    id: "user_admin",
    organizationId: "org_thomas",
    email: "admin@thomassupply.test",
    name: "Taylor Admin",
    adminRole: "admin",
    isActive: true
  },
  {
    id: "user_sales",
    organizationId: "org_thomas",
    email: "sales@thomassupply.test",
    name: "Sam Sales",
    adminRole: "sales",
    isActive: true
  }
];

const memberships: DealerUserMembershipRecord[] = [
  { id: "mem_owner", dealerAccountId: "dealer_acme", userId: "user_owner", role: "owner", isActive: true },
  { id: "mem_purchaser", dealerAccountId: "dealer_acme", userId: "user_purchaser", role: "purchaser", isActive: true },
  { id: "mem_tech", dealerAccountId: "dealer_acme", userId: "user_tech", role: "technician", isActive: true }
];

export const demoProducts: ProductRecord[] = [
  {
    id: "prod_kp_2t",
    sku: "KP-2T-16S",
    odooProductId: "odoo_product_2001",
    name: "KeepRite 2 Ton 16 SEER Condenser",
    description: "Residential split-system condenser for dealer quotation requests.",
    brand: "KeepRite",
    category: "Equipment",
    uom: "ea",
    isActive: true,
    lastSyncedAt: now()
  },
  {
    id: "prod_fast_cap",
    sku: "FAST-CAP-45-5",
    odooProductId: "odoo_product_2002",
    name: "OEM Dual Run Capacitor 45/5 MFD",
    description: "OEM Fast Parts dual run capacitor for ICP-family equipment.",
    brand: "FAST Parts",
    category: "Electrical",
    uom: "ea",
    isActive: true,
    lastSyncedAt: now()
  },
  {
    id: "prod_gf_filter",
    sku: "GF-M8-1625",
    odooProductId: "odoo_product_2003",
    name: "Glasfloss MERV 8 Filter 16x25x1",
    description: "Contractor pack replacement air filter.",
    brand: "Glasfloss",
    category: "Filters",
    uom: "case",
    isActive: true,
    lastSyncedAt: now()
  },
  {
    id: "prod_lg_mini",
    sku: "LG-MINI-12K",
    odooProductId: "odoo_product_2004",
    name: "LG 12K BTU Mini-Split Indoor Unit",
    description: "Wall-mounted indoor mini-split unit for matched LG systems.",
    brand: "LG",
    category: "Ductless",
    uom: "ea",
    isActive: true,
    lastSyncedAt: now()
  }
];

const inventory: InventoryRecord[] = demoProducts.flatMap((product, index) => [
  {
    productId: product.id,
    locationCode: "LC",
    locationName: "Lake Charles",
    status: index === 3 ? "limited_stock" : "in_stock",
    quantity: index === 3 ? 2 : 18,
    allowExactQuantity: false,
    lastSyncedAt: now()
  },
  {
    productId: product.id,
    locationCode: "LFT",
    locationName: "Lafayette",
    status: index === 1 ? "in_stock" : "limited_stock",
    quantity: index === 1 ? 12 : 3,
    allowExactQuantity: false,
    lastSyncedAt: now()
  },
  {
    productId: product.id,
    locationCode: "BMT",
    locationName: "Beaumont",
    status: index === 2 ? "out_of_stock" : "limited_stock",
    quantity: index === 2 ? 0 : 4,
    allowExactQuantity: false,
    lastSyncedAt: now()
  }
]);

const priceCache: PriceRecord[] = [];
const carts: CartSessionRecord[] = [];
const orders: OrderRequestRecord[] = [];
const syncJobs: SyncJobRecord[] = [
  {
    id: "sync_products_demo",
    jobType: "sync-products",
    status: "succeeded",
    message: "Loaded demo product cache from mock Odoo.",
    recordsRead: demoProducts.length,
    recordsWritten: demoProducts.length,
    createdAt: now(),
    startedAt: now(),
    finishedAt: now()
  }
];
const auditLogs: ApiAuditLogRecord[] = [];

export const mockDb = {
  organizations,
  dealerAccounts,
  users,
  memberships,
  products: demoProducts,
  inventory,
  priceCache,
  carts,
  orders,
  syncJobs,
  auditLogs,

  findUserByEmail(email: string) {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.isActive);
  },

  findUserById(userId: string) {
    return users.find((user) => user.id === userId && user.isActive);
  },

  listMembershipsForUser(userId: string) {
    return memberships.filter((membership) => membership.userId === userId && membership.isActive);
  },

  findMembership(userId: string, dealerAccountId: string) {
    return memberships.find(
      (membership) =>
        membership.userId === userId &&
        membership.dealerAccountId === dealerAccountId &&
        membership.isActive
    );
  },

  findDealerAccount(dealerAccountId: string) {
    return dealerAccounts.find((dealer) => dealer.id === dealerAccountId && dealer.isActive);
  },

  listDealerAccounts() {
    return dealerAccounts;
  },

  listDealerUsers(dealerAccountId?: string) {
    return memberships
      .filter((membership) => !dealerAccountId || membership.dealerAccountId === dealerAccountId)
      .map((membership) => ({
        ...membership,
        user: users.find((user) => user.id === membership.userId),
        dealerAccount: dealerAccounts.find((dealer) => dealer.id === membership.dealerAccountId)
      }));
  },

  searchProducts(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return demoProducts;
    return demoProducts.filter((product) =>
      [product.sku, product.name, product.brand, product.category]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  },

  findProductBySku(sku: string) {
    return demoProducts.find((product) => product.sku.toLowerCase() === sku.toLowerCase());
  },

  getInventory(productId: string) {
    return inventory.filter((item) => item.productId === productId);
  },

  upsertPrice(price: PriceRecord) {
    const existingIndex = priceCache.findIndex(
      (cached) => cached.dealerAccountId === price.dealerAccountId && cached.productId === price.productId
    );
    if (existingIndex >= 0) priceCache[existingIndex] = price;
    else priceCache.push(price);
    return price;
  },

  getActiveCart(userId: string, dealerAccountId: string) {
    let cart = carts.find(
      (candidate) =>
        candidate.userId === userId &&
        candidate.dealerAccountId === dealerAccountId &&
        candidate.status === "active"
    );
    if (!cart) {
      cart = {
        id: id("cart"),
        dealerAccountId,
        userId,
        status: "active",
        items: [],
        updatedAt: now()
      };
      carts.push(cart);
    }
    return cart;
  },

  addCartItem(userId: string, dealerAccountId: string, item: CartItemRecord) {
    const cart = this.getActiveCart(userId, dealerAccountId);
    const existing = cart.items.find((cartItem) => cartItem.sku === item.sku);
    if (existing) existing.quantity += item.quantity;
    else cart.items.push(item);
    cart.updatedAt = now();
    return cart;
  },

  updateCartItem(userId: string, dealerAccountId: string, sku: string, quantity: number) {
    const cart = this.getActiveCart(userId, dealerAccountId);
    if (quantity <= 0) cart.items = cart.items.filter((item) => item.sku !== sku);
    else {
      const existing = cart.items.find((item) => item.sku === sku);
      if (existing) existing.quantity = quantity;
    }
    cart.updatedAt = now();
    return cart;
  },

  createOrderRequest(input: Omit<OrderRequestRecord, "id" | "createdAt" | "updatedAt">) {
    const order: OrderRequestRecord = {
      ...input,
      id: id("ord"),
      createdAt: now(),
      updatedAt: now()
    };
    orders.unshift(order);
    return order;
  },

  markActiveCartSubmitted(userId: string, dealerAccountId: string) {
    const cart = carts.find(
      (candidate) =>
        candidate.userId === userId &&
        candidate.dealerAccountId === dealerAccountId &&
        candidate.status === "active"
    );
    if (cart) {
      cart.status = "submitted";
      cart.items = [];
      cart.updatedAt = now();
    }
    return cart;
  },

  updateOrderRequest(orderRequestId: string, patch: Partial<OrderRequestRecord>) {
    const order = orders.find((candidate) => candidate.id === orderRequestId);
    if (!order) return undefined;
    Object.assign(order, patch, { updatedAt: now() });
    return order;
  },

  listOrderRequests(dealerAccountId?: string) {
    return orders.filter((order) => !dealerAccountId || order.dealerAccountId === dealerAccountId);
  },

  createSyncJob(input: Omit<SyncJobRecord, "id" | "createdAt">) {
    const job: SyncJobRecord = { ...input, id: id("sync"), createdAt: now() };
    syncJobs.unshift(job);
    return job;
  },

  listSyncJobs() {
    return syncJobs;
  },

  createAuditLog(input: Omit<ApiAuditLogRecord, "id" | "createdAt">) {
    const log: ApiAuditLogRecord = { ...input, id: id("audit"), createdAt: now() };
    auditLogs.unshift(log);
    return log;
  },

  listAuditLogs() {
    return auditLogs;
  }
};
