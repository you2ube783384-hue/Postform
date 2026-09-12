"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Undo2,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { useCart, useWishlist, cartCount, useHydrated } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";

function IconLink({
  href,
  label,
  children,
  badge,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  badge?: number;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center border-2 border-transparent text-pf-black transition-colors hover:border-pf-black hover:bg-pf-yellow",
        className
      )}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-5 items-center justify-center border border-pf-black bg-pf-black px-1 font-mono-tech text-[10px] font-bold text-pf-yellow">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const cartItems = useCart((s) => s.items);
  const wishlistItems = useWishlist((s) => s.items);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  const cartQty = hydrated ? cartCount(cartItems) : 0;
  const wishQty = hydrated ? wishlistItems.length : 0;

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  React.useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    setSearchOpen(false);
  }

  const isActiveCategory = (slug: string) =>
    pathname === `/shop/${slug}` || pathname === `/shop/${slug}/`;

  return (
    <header className="sticky top-0 z-50 bg-pf-cream">
      {/* Ticker strip — desktop/tablet only (mobile header stays compact) */}
      <div className="hidden border-b-2 border-pf-black bg-pf-black text-pf-cream overflow-hidden sm:block">
        <div className="flex whitespace-nowrap py-1.5 font-mono-tech text-[10px] tracking-[0.2em] uppercase pf-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {[
                "FREE INTERNATIONAL SHIPPING",
                "CURATED RESALE STOCK",
                "GLOBAL DELIVERY",
                "SOURCED — VERIFIED — RESOLD",
                "NEW / USED / VINTAGE",
                "DEFECT RETURNS ACCEPTED WITH VIDEO PROOF",
              ].map((t, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-4">{t}</span>
                  <span className="text-pf-yellow" aria-hidden>
                    ▮
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b-2 border-pf-black">
        <div className="mx-auto grid max-w-[1600px] grid-cols-[auto_1fr_auto] items-stretch">
          {/* Left — mobile menu / desktop marker */}
          <div className="flex items-center gap-1 px-3 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-yellow lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2.5} />
            </button>
            <span className="hidden font-mono-tech text-[10px] tracking-[0.25em] text-pf-muted uppercase lg:block">
              RESALE / WORLDWIDE
            </span>
          </div>

          {/* Center — wordmark */}
          <div className="flex items-center justify-center py-3">
            <Link
              href="/"
              className="font-display text-2xl leading-none tracking-tight text-pf-black sm:text-3xl lg:text-4xl"
              aria-label="POSTFORM — home"
            >
              POSTFORM<span className="text-pf-yellow" style={{ WebkitTextStroke: "1.5px #141310" }}>▮</span>
            </Link>
          </div>

          {/* Right — actions */}
          <div className="flex items-center justify-end gap-1 px-3 py-3 sm:gap-1.5 sm:px-5">
            {/* Desktop inline search */}
            <div className="hidden items-center sm:flex">
              {searchOpen ? (
                <form
                  onSubmit={submitSearch}
                  className="flex items-center border-2 border-pf-black bg-pf-paper"
                >
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH PRODUCTS…"
                    aria-label="Search products"
                    className="h-10 w-44 bg-transparent px-3 font-mono-tech text-xs uppercase tracking-wider outline-none placeholder:text-pf-muted md:w-56"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="flex h-10 w-10 items-center justify-center border-l-2 border-pf-black bg-pf-yellow transition-colors hover:bg-pf-soft-yellow"
                  >
                    <Search className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search"
                    className="flex h-10 w-10 items-center justify-center border-l-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-sand"
                  >
                    <X className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                  className="flex h-10 w-10 items-center justify-center border-2 border-transparent text-pf-black transition-colors hover:border-pf-black hover:bg-pf-yellow"
                >
                  <Search className="h-5 w-5" strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Refund & profile — desktop/tablet only (mobile: profile lives in
                the bottom nav, refund in the drawer) */}
            <IconLink
              href="/refund"
              label="Return & refund information"
              className="hidden sm:flex"
            >
              <Undo2 className="h-5 w-5" strokeWidth={2.5} />
            </IconLink>
            <IconLink href="/profile" label="Profile" className="hidden sm:flex">
              <User className="h-5 w-5" strokeWidth={2.5} />
            </IconLink>
            <IconLink href="/wishlist" label="Wishlist" badge={wishQty}>
              <Heart className="h-5 w-5" strokeWidth={2.5} />
            </IconLink>
            <IconLink href="/cart" label="Cart" badge={cartQty}>
              <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
            </IconLink>
          </div>
        </div>

        {/* Persistent mobile search — always visible on phones (spec §5) */}
        <div className="border-t-2 border-pf-black bg-pf-paper px-3 py-2 sm:hidden">
          <form onSubmit={submitSearch} className="flex border-2 border-pf-black">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SEARCH PRODUCTS…"
              aria-label="Search products"
              className="h-11 flex-1 bg-transparent px-3 font-mono-tech text-xs uppercase tracking-wider outline-none placeholder:text-pf-muted"
              enterKeyHint="search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex h-11 w-11 items-center justify-center border-l-2 border-pf-black bg-pf-paper text-pf-black"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            )}
            <button
              type="submit"
              aria-label="Submit search"
              className="flex h-11 w-12 items-center justify-center border-l-2 border-pf-black bg-pf-yellow"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      {/* Category strip — mobile/tablet: horizontal scroll (spec §6) */}
      <nav
        aria-label="Product categories"
        className="border-b-2 border-pf-black bg-pf-paper lg:hidden"
      >
        <div className="no-scrollbar flex items-stretch gap-0 overflow-x-auto">
          <Link
            href="/shop"
            className={cn(
              "flex shrink-0 items-center border-r-2 border-pf-black px-4 py-2.5 font-mono-tech text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
              pathname === "/shop" || pathname.startsWith("/shop?")
                ? "bg-pf-black text-pf-yellow"
                : "text-pf-black active:bg-pf-yellow"
            )}
          >
            SHOP ALL
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              aria-current={isActiveCategory(cat.slug) ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center whitespace-nowrap border-r-2 border-pf-black px-4 py-2.5 font-mono-tech text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
                isActiveCategory(cat.slug)
                  ? "bg-pf-black text-pf-yellow"
                  : "text-pf-black active:bg-pf-yellow"
              )}
            >
              {cat.short}
            </Link>
          ))}
        </div>
      </nav>

      {/* Category strip — desktop */}
      <nav aria-label="Product categories" className="hidden border-b-2 border-pf-black bg-pf-paper lg:block">
        <div className="mx-auto flex max-w-[1600px]">
          <Link
            href="/shop"
            className={cn(
              "flex items-center gap-2 border-r-2 border-pf-black px-6 py-2.5 font-mono-tech text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
              pathname === "/shop" ? "bg-pf-black text-pf-yellow" : "text-pf-black hover:bg-pf-yellow"
            )}
          >
            <span aria-hidden>▚</span> SHOP ALL
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              aria-current={isActiveCategory(cat.slug) ? "page" : undefined}
              className={cn(
                "border-r-2 border-pf-black px-5 py-2.5 font-mono-tech text-[11px] font-bold tracking-[0.15em] uppercase transition-colors",
                isActiveCategory(cat.slug)
                  ? "bg-pf-black text-pf-yellow"
                  : "text-pf-black hover:bg-pf-yellow"
              )}
            >
              {cat.short}
            </Link>
          ))}
          <div className="flex flex-1 items-center justify-end px-6 py-2.5 font-mono-tech text-[10px] tracking-[0.2em] text-pf-muted uppercase">
            STOCK ROTATES — MISS IT, LOSE IT
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div
            className="absolute inset-0 bg-pf-black/60"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col border-r-2 border-pf-black bg-pf-cream">
            <div className="flex items-center justify-between border-b-2 border-pf-black px-4 py-4">
              <span className="font-display text-xl text-pf-black">
                POSTFORM<span className="text-pf-yellow">▮</span>
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-yellow"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto">
              <p className="border-b-2 border-pf-black bg-pf-black px-4 py-2 font-mono-tech text-[10px] tracking-[0.25em] text-pf-yellow uppercase">
                Categories
              </p>
              <ul>
                <li>
                  <Link
                    href="/shop"
                    className="flex items-center justify-between border-b border-pf-black/20 px-4 py-3.5 font-mono-tech text-sm font-bold uppercase tracking-wider text-pf-black active:bg-pf-yellow"
                  >
                    SHOP ALL <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/shop/${cat.slug}`}
                      className="flex items-center justify-between border-b border-pf-black/20 px-4 py-3.5 font-mono-tech text-sm font-bold uppercase tracking-wider text-pf-black active:bg-pf-yellow"
                    >
                      {cat.name} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="border-y-2 border-pf-black bg-pf-black px-4 py-2 font-mono-tech text-[10px] tracking-[0.25em] text-pf-yellow uppercase">
                More
              </p>
              <ul>
                {[
                  { href: "/cart", label: "CART" },
                  { href: "/wishlist", label: `WISHLIST${wishQty ? ` (${wishQty})` : ""}` },
                  { href: "/profile", label: "PROFILE & ADDRESSES" },
                  { href: "/about", label: "ABOUT POSTFORM" },
                  { href: "/privacy", label: "PRIVACY POLICY" },
                  { href: "/terms", label: "TERMS & CONDITIONS" },
                  { href: "/refund", label: "RETURN & REFUND" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center justify-between border-b border-pf-black/20 px-4 py-3.5 font-mono-tech text-sm font-bold uppercase tracking-wider text-pf-black active:bg-pf-yellow"
                    >
                      {link.label} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div
              className="border-t-2 border-pf-black bg-pf-paper px-4 py-3 font-mono-tech text-[10px] tracking-[0.15em] text-pf-muted uppercase"
              style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
            >
              FREE INTL SHIPPING — WORLDWIDE
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
