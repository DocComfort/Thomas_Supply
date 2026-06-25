import { mockDb } from "@thomas-supply/db";
import type { ApiAuditLogRecord } from "@thomas-supply/db";

export async function writeAuditLog(input: Omit<ApiAuditLogRecord, "id" | "createdAt">) {
  return mockDb.createAuditLog(input);
}

export async function auditOdooFailure(input: {
  userId?: string;
  dealerAccountId?: string;
  action: string;
  error: unknown;
  metadata?: Record<string, unknown>;
}) {
  const message = input.error instanceof Error ? input.error.message : String(input.error);
  mockDb.createSyncJob({
    jobType: input.action,
    status: "failed",
    message: "Odoo adapter call failed.",
    recordsRead: 0,
    recordsWritten: 0,
    error: message,
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString()
  });
  return writeAuditLog({
    actorType: input.userId ? "dealer_user" : "system",
    userId: input.userId,
    dealerAccountId: input.dealerAccountId,
    action: "odoo.api_failure",
    resourceType: "odoo",
    metadata: { adapterAction: input.action, error: message, ...input.metadata }
  });
}
