import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboard } from "@/lib/services/admin";

export default async function AdminDashboardPage() {
  const data = await getAdminDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Admin Dashboard</h1>
        <p className="text-muted-foreground">Thomas Supply staff workspace for dealer portal operations.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{data.dealerAccounts.length}</CardTitle>
            <CardDescription>Dealer accounts</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{data.orders.length}</CardTitle>
            <CardDescription>Order requests</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{data.syncJobs.length}</CardTitle>
            <CardDescription>Sync jobs</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{data.auditLogs.length}</CardTitle>
            <CardDescription>Audit entries</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
