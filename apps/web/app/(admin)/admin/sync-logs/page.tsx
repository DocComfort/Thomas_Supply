import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminSyncJobs } from "@/lib/services/admin";
import { formatDateTime } from "@/lib/utils";

export default async function SyncLogsPage() {
  const syncJobs = await getAdminSyncJobs();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Odoo Sync Logs</h1>
      <div className="grid gap-4">
        {syncJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{job.jobType}</CardTitle>
                  <p className="text-sm text-muted-foreground">{formatDateTime(job.createdAt)} · read {job.recordsRead} · wrote {job.recordsWritten}</p>
                </div>
                <Badge tone={job.status === "failed" ? "danger" : job.status === "succeeded" ? "success" : "warning"}>{job.status}</Badge>
              </div>
            </CardHeader>
            {job.message && <p className="text-sm text-muted-foreground">{job.message}</p>}
            {job.error && <p className="text-sm text-red-700">{job.error}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}
