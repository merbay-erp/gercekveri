import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  ShieldCheck,
  ClipboardCheck,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAdminSession } from "@/lib/admin-auth";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: { default: "Admin · GerçekVeri", template: "%s · Admin · GerçekVeri" },
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/submissions", label: "Paylaşımlar", icon: ClipboardCheck },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (!session) {
    // Unauthenticated — login page renders itself; other admin pages redirect.
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span>Admin</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {session.email}
              <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                {session.role}
              </span>
            </span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-1 h-4 w-4" /> Çıkış
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
