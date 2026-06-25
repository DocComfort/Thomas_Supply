import { mockDb } from "@thomas-supply/db";
import { requireAdminContext } from "../auth";

export async function getAdminDashboard() {
  await requireAdminContext("admin:read");
  return {
    dealerAccounts: mockDb.listDealerAccounts(),
    users: mockDb.users,
    orders: mockDb.listOrderRequests(),
    syncJobs: mockDb.listSyncJobs(),
    auditLogs: mockDb.listAuditLogs()
  };
}

export async function getAdminOrderRequests() {
  await requireAdminContext("admin:orders");
  return mockDb.listOrderRequests().map((order) => ({
    ...order,
    dealerAccount: mockDb.findDealerAccount(order.dealerAccountId),
    user: mockDb.findUserById(order.userId)
  }));
}

export async function getAdminSyncJobs() {
  await requireAdminContext("admin:sync");
  return mockDb.listSyncJobs();
}

export async function getAdminAuditLogs() {
  await requireAdminContext("admin:audit");
  return mockDb.listAuditLogs();
}

export async function getAdminDealerAccounts() {
  await requireAdminContext("admin:manage_dealers");
  return mockDb.listDealerAccounts();
}

export async function getAdminDealerUsers() {
  await requireAdminContext("admin:manage_users");
  return mockDb.listDealerUsers();
}

export async function getAdminProductCacheStatus() {
  await requireAdminContext("admin:sync");
  return mockDb.products;
}
