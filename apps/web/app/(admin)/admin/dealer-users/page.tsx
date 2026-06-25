import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDealerUsers } from "@/lib/services/admin";

export default async function AdminDealerUsersPage() {
  const users = await getAdminDealerUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-normal">Dealer Users</h1>
      <div className="grid gap-4">
        {users.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <CardTitle>{entry.user?.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{entry.user?.email} · {entry.dealerAccount?.name} · {entry.role}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
