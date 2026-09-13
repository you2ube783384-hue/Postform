"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, PlusCircle, Settings, Store, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "DASHBOARD", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "PRODUCTS", icon: Package },
  { href: "/admin/products/new", label: "ADD PRODUCT", icon: PlusCircle },
  { href: "/admin/settings", label: "SETTINGS", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [navOpen, setNavOpen] = React.useState(false);

  React.useEffect(() => setNavOpen(false), [pathname]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("LOGGED OUT");
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href) && item.href !== "/admin";

  const nav = (
    <nav aria-label="Admin navigation" className="flex flex-col gap-1">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item) ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 border-2 px-4 py-3 font-mono-tech text-xs font-bold uppercase tracking-widest transition-colors",
            isActive(item)
              ? "border-pf-black bg-pf-yellow text-pf-black"
              : "border-transparent text-pf-cream/70 hover:border-pf-cream/30 hover:text-pf-cream"
          )}
        >
          <item.icon className="h-4 w-4" strokeWidth={2.5} />
          {item.label}
        </Link>
      ))}

      <div className="mt-4 border-t border-pf-cream/15 pt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-cream/50 transition-colors hover:text-pf-yellow"
        >
          <Store className="h-4 w-4" strokeWidth={2.5} /> VIEW STORE ↗
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-2.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-red/90 transition-colors hover:text-pf-red"
        >
          <LogOut className="h-4 w-4" strokeWidth={2.5} /> LOGOUT
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-pf-cream">
      {/* Sidebar - desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r-2 border-pf-black bg-pf-black p-4 lg:flex">
        <Link href="/admin" className="mb-8 block px-2">
          <p className="font-display text-xl text-pf-cream">
            POSTFORM<span className="text-pf-yellow">▮</span>
          </p>
          <p className="mt-1 font-mono-tech text-[9px] uppercase tracking-[0.3em] text-pf-cream/50">
            CONTROL ROOM
          </p>
        </Link>
        <div className="flex-1">{nav}</div>
        <p className="font-mono-tech text-[9px] uppercase tracking-widest text-pf-cream/30">
          ORDERS ARRIVE BY EMAIL.
          <br />
          NO ORDER CRM BY DESIGN
        </p>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b-2 border-pf-black bg-pf-black px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-display text-lg text-pf-cream">
          POSTFORM<span className="text-pf-yellow">▮</span>
          <span className="ml-2 font-mono-tech text-[9px] uppercase tracking-widest text-pf-cream/50">
            ADMIN
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle admin menu"
          aria-expanded={navOpen}
          className="flex h-9 w-9 items-center justify-center border-2 border-pf-cream/40 text-pf-cream"
        >
          {navOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {navOpen && (
        <div className="fixed inset-x-0 top-[57px] z-40 border-b-2 border-pf-black bg-pf-black p-4 lg:hidden">
          {nav}
        </div>
      )}

      {/* Content */}
      <main className="min-w-0 flex-1 pt-16 lg:pt-0">{children}</main>
    </div>
  );
}
