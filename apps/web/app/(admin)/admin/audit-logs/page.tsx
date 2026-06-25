import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminAuditLogs } from "@/lib/services/admin";
import { formatDateTime } from "@/lib/utils";

export default async function AuditLogsPage() {
  const logs = await getAdminAuditLogs();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Audit Logs</h1>
      <div className="grid gap-4">
        {logs.length === 0 && <Card>No audit logs yet. View pricing or submit an order to generate entries.</Card>}
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader>
              <CardTitle>{log.action}</CardTitle>
              <p className="text-sm text-muted-foreground">{log.actorType} · {log.resourceType} · {formatDateTime(log.createdAt)}</p>
            </CardHeader>
            {log.metadata && <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(log.metadata, null, 2)}</pre>}
          </Card>
        ))}
      </div>
    </div>
  );
}
