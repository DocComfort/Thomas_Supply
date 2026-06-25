import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDealerUsers } from "@/lib/services/dealer";

export default async function DealerUsersPage() {
  const { membership, dealerUsers } = await getDealerUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">User Management</h1>
        <p className="text-muted-foreground">Owners can later invite and manage dealer users.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dealer users</CardTitle>
          <CardDescription>Your current role is {membership.role}.</CardDescription>
        </CardHeader>
        <div className="space-y-2 text-sm">
          {dealerUsers.map((entry) => (
            <p key={entry.id}>{entry.user?.name} · {entry.user?.email} · {entry.role}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}
