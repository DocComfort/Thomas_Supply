import type { AdminRole, DealerRole } from "../constants";

export type DealerPermission =
  | "dealer:read"
  | "dealer:manage_users"
  | "product:read"
  | "pricing:read"
  | "inventory:read"
  | "cart:write"
  | "order:create"
  | "order:read";

export type AdminPermission =
  | "admin:read"
  | "admin:manage_dealers"
  | "admin:manage_users"
  | "admin:orders"
  | "admin:sync"
  | "admin:audit"
  | "admin:integration";

const dealerPermissions: Record<DealerRole, DealerPermission[]> = {
  owner: [
    "dealer:read",
    "dealer:manage_users",
    "product:read",
    "pricing:read",
    "inventory:read",
    "cart:write",
    "order:create",
    "order:read"
  ],
  purchaser: [
    "dealer:read",
    "product:read",
    "pricing:read",
    "inventory:read",
    "cart:write",
    "order:create",
    "order:read"
  ],
  technician: ["dealer:read", "product:read", "inventory:read", "order:read"],
  viewer: ["dealer:read", "product:read", "inventory:read", "order:read"]
};

const adminPermissions: Record<AdminRole, AdminPermission[]> = {
  admin: [
    "admin:read",
    "admin:manage_dealers",
    "admin:manage_users",
    "admin:orders",
    "admin:sync",
    "admin:audit",
    "admin:integration"
  ],
  sales: ["admin:read", "admin:manage_dealers", "admin:manage_users", "admin:orders"],
  warehouse: ["admin:read", "admin:orders", "admin:sync"],
  accounting: ["admin:read", "admin:orders", "admin:audit"]
};

export function hasDealerPermission(role: DealerRole, permission: DealerPermission): boolean {
  return dealerPermissions[role].includes(permission);
}

export function hasAdminPermission(role: AdminRole, permission: AdminPermission): boolean {
  return adminPermissions[role].includes(permission);
}

export function dealerRoleLabel(role: DealerRole): string {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
