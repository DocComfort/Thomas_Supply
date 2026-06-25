import { dealerRoleLabel } from "@thomas-supply/shared/permissions";
import { AppShell } from "@/components/shell";
import { requireDealerContext } from "@/lib/auth";

const navItems = [
  { href: "/dealer/dashboard", label: "Dashboard" },
  { href: "/dealer/products", label: "Product Search" },
  { href: "/dealer/cart", label: "Cart" },
  { href: "/dealer/order-requests", label: "Order Requests" },
  { href: "/dealer/order-history", label: "Order History" },
  { href: "/dealer/account", label: "Account Center" },
  { href: "/dealer/users", label: "User Management" },
  { href: "/dealer/settings", label: "Settings" }
];

export default async function DealerLayout({ children }: { children: React.ReactNode }) {
  const { user, membership, dealerAccount } = await requireDealerContext("dealer:read");
  return (
    <AppShell navItems={navItems} userName={user.name} userRole={`${dealerAccount.name} · ${dealerRoleLabel(membership.role)}`} mode="dealer">
      {children}
    </AppShell>
  );
}
