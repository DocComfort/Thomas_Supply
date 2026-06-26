import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { dealerRoleLabel } from "@thomas-supply/shared/permissions";
import {
  getAdminDealerAccounts,
  getAdminDealerUsers,
} from "@/lib/services/admin";
import {
  inviteDealerUserAction,
  setMembershipActiveAction,
  setMembershipRoleAction,
} from "../actions";

export const dynamic = "force-dynamic";

const ROLES = ["owner", "purchaser", "technician", "viewer"] as const;
const selectClass =
  "focus-ring h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

export default async function AdminDealerUsersPage({
  searchParams,
}: {
  searchParams?: { error?: string; ok?: string };
}) {
  const [users, accounts] = await Promise.all([
    getAdminDealerUsers(),
    getAdminDealerAccounts(),
  ]);
  const activeAccounts = accounts.filter((account) => account.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-normal">Dealer Users</h1>
        <p className="text-muted-foreground">
          The logins for each contractor account, and what they can do.
        </p>
      </div>

      {searchParams?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          {searchParams.error}
        </div>
      )}
      {searchParams?.ok && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          {searchParams.ok}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Invite a dealer user</CardTitle>
        </CardHeader>
        {activeAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add an active dealer account first, then you can invite its users.
          </p>
        ) : (
          <form
            action={inviteDealerUserAction}
            className="grid gap-3 sm:grid-cols-2"
          >
            <Field label="Email">
              <Input name="email" type="email" placeholder="tech@acme.com" required />
            </Field>
            <Field label="Full name">
              <Input name="name" placeholder="Jordan Tech" required />
            </Field>
            <Field label="Dealer account">
              <select
                name="dealerAccountId"
                className={selectClass}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select an account…
                </option>
                {activeAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.accountNumber})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Role">
              <select
                name="dealerRole"
                className={selectClass}
                defaultValue="purchaser"
                required
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {dealerRoleLabel(role)}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit">Send invite</Button>
            </div>
          </form>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          The invited person receives an email with a link to set their own
          password, then they can sign in.
        </p>
      </Card>

      <div className="grid gap-4">
        {users.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{entry.user?.name ?? "(unknown user)"}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {entry.user?.email} · {entry.dealerAccount?.name}
                  </p>
                </div>
                <Badge tone={entry.isActive ? "success" : "danger"}>
                  {entry.isActive ? "Active" : "Revoked"}
                </Badge>
              </div>
            </CardHeader>

            <div className="flex flex-wrap items-end gap-3">
              <form
                action={setMembershipRoleAction}
                className="flex items-end gap-2"
              >
                <input type="hidden" name="membershipId" value={entry.id} />
                <label className="grid gap-1.5 text-sm font-medium">
                  Role
                  <select
                    name="role"
                    defaultValue={entry.role}
                    className={`${selectClass} sm:w-44`}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {dealerRoleLabel(role)}
                      </option>
                    ))}
                  </select>
                </label>
                <Button type="submit" variant="secondary">
                  Update role
                </Button>
              </form>

              <form action={setMembershipActiveAction}>
                <input type="hidden" name="membershipId" value={entry.id} />
                <input
                  type="hidden"
                  name="isActive"
                  value={entry.isActive ? "false" : "true"}
                />
                <Button
                  type="submit"
                  variant={entry.isActive ? "danger" : "primary"}
                >
                  {entry.isActive ? "Revoke access" : "Restore access"}
                </Button>
              </form>
            </div>
          </Card>
        ))}
        {users.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No dealer users yet. Invite one above.
          </p>
        )}
      </div>
    </div>
  );
}
