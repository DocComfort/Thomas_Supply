import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageSearch, ShoppingCart, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@thomas-supply/shared";
import { logout } from "@/lib/auth";
import { marketingSiteUrl } from "@/lib/site-links";
import { Button } from "./ui/button";

type NavItem = {
  href: string;
  label: string;
};

async function logoutAction() {
  "use server";
  await logout();
  redirect("/login");
}

export function AppShell({
  children,
  navItems,
  userName,
  userRole,
  mode
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
  mode: "dealer" | "admin";
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href={mode === "admin" ? "/admin" : "/dealer/dashboard"} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              {mode === "admin" ? <ShieldCheck size={20} /> : <PackageSearch size={20} />}
            </span>
            <span>
              <span className="block text-sm font-bold">{APP_NAME}</span>
              <span className="block text-xs text-muted-foreground">{mode === "admin" ? "Admin" : "Dealer"} workspace</span>
            </span>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <a
              href={marketingSiteUrl}
              className="hidden rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground md:inline-flex"
            >
              Back to Thomas Supply
            </a>
            <span className="hidden text-right sm:block">
              <span className="block font-semibold">{userName}</span>
              <span className="block text-xs text-muted-foreground">{userRole}</span>
            </span>
            {mode === "dealer" && (
              <Link href="/dealer/cart" className="focus-ring rounded-md border border-border p-2 text-muted-foreground hover:bg-muted">
                <ShoppingCart size={18} />
                <span className="sr-only">Cart</span>
              </Link>
            )}
            <form action={logoutAction}>
              <Button variant="secondary" type="submit">Sign out</Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-lg border border-border bg-card p-3">
          <nav className="grid gap-1">
            <a
              href={marketingSiteUrl}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            >
              Back to Thomas Supply
            </a>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
