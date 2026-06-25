import { AppShell } from "@/components/shell";
import { requireAdminContext } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin/dealer-accounts", label: "Dealer Accounts" },
  { href: "/admin/dealer-users", label: "Dealer Users" },
  { href: "/admin/product-cache-status", label: "Product Cache Status" },
  { href: "/admin/order-requests", label: "Order Requests" },
  { href: "/admin/sync-logs", label: "Odoo Sync Logs" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
  { href: "/admin/integration-settings", label: "Integration Settings" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, adminRole } = await requireAdminContext("admin:read");
  return (
    <AppShell navItems={navItems} userName={user.name} userRole={`Thomas Supply · ${adminRole}`} mode="admin">
      {children}
    </AppShell>
  );
}
