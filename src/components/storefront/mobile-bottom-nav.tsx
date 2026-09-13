"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Compass, Heart, User, ShoppingBag } from "lucide-react";
import { useCart, useWishlist, cartCount, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Persistent app-style bottom navigation for mobile & portrait tablets.
 *
 * - Home / Shop / Wishlist / Profile / Cart (spec §7: 5 destinations,
 *   wishlist chosen over "Categories" because categories are one tap away
 *   in the horizontal category strip + hamburger drawer)
 * - Cart quantity badge (99+ cap)
 * - Safe-area inset support (viewportFit: cover is set in root layout)
 * - 64px touch targets (min 44px spec §20)
 * - Hidden on ≥lg (desktop keeps conventional header navigation, spec §2)
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartItems = useCart((s) => s.items);
  const wishlistItems = useWishlist((s) => s.items);

  const cartQty = hydrated ? cartCount(cartItems) : 0;
  const wishQty = hydrated ? wishlistItems.length : 0;

  const items = [
    { href: "/", label: "Home", icon: House, badge: 0 },
    { href: "/shop", label: "Shop", icon: Compass, badge: 0 },
    { href: "/wishlist", label: "Saved", icon: Heart, badge: wishQty },
    { href: "/profile", label: "Profile", icon: User, badge: 0 },
    { href: "/cart", label: "Cart", icon: ShoppingBag, badge: cartQty },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-pf-black bg-pf-cream lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href);
          return (
            <li key={href} className="min-w-0">
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="flex min-h-[68px] flex-col items-center justify-center gap-1 px-1 py-1.5 active:bg-pf-sand"
              >
                <span
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center border-2 transition-colors",
                    active
                      ? "border-pf-black bg-pf-yellow text-pf-black"
                      : "border-transparent text-pf-black"
                  )}
                >
                  <Icon
                    className={active ? "h-5 w-5" : "h-[18px] w-[18px]"}
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden
                  />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-4 items-center justify-center border border-pf-black bg-pf-black px-0.5 font-mono-tech text-[9px] font-bold leading-[14px] text-pf-yellow">
                      {badge > 99 ? "99+" : badge}
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-mono-tech text-[9px] uppercase tracking-[0.12em]",
                    active ? "font-bold text-pf-black" : "text-pf-muted"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
