#!/usr/bin/env python3
"""Taste Skill em-dash purge (Section 9.G - zero em-dashes in output).

Replaces every em-dash in visible copy with skill-sanctioned separators:
plain hyphen "-", slash "/", period, or restructured sentence.
Comments are normalized to "-" for cleanliness too.
"""
import pathlib

ROOT = pathlib.Path("/home/z/my-project")

# (relative path, old, new) — exact-string replacements
EDITS = [
    # ---------- purchase-panel ----------
    ("src/components/product/purchase-panel.tsx",
     'description: `${product.name}${hasSizes ? ` — ${size}` : ""} × ${Math.min(qty, selectedStock)}`',
     'description: `${product.name}${hasSizes ? ` - ${size}` : ""} x ${Math.min(qty, selectedStock)}`'),
    ("src/components/product/purchase-panel.tsx",
     'const title = `${product.brand ?? "POSTFORM"} — ${product.name}`;',
     'const title = `${product.brand ?? "POSTFORM"} - ${product.name}`;'),
    ("src/components/product/purchase-panel.tsx",
     'Size {size && <span className="text-pf-purple">— {size}</span>}',
     'Size {size && <span className="text-pf-black">/ {size}</span>}'),
    ("src/components/product/purchase-panel.tsx",
     'Colour {color && <span className="text-pf-purple">— {color}</span>}',
     'Colour {color && <span className="text-pf-black">/ {color}</span>}'),
    ("src/components/product/purchase-panel.tsx",
     "{/* Colour selector — only when more than one colour exists */}",
     "{/* Colour selector - only when more than one colour exists */}"),
    ("src/components/product/purchase-panel.tsx",
     "{/* Primary actions — desktop/tablet */}",
     "{/* Primary actions - desktop/tablet */}"),
    ("src/components/product/purchase-panel.tsx",
     "Worldwide delivery on every order — no minimum.",
     "Worldwide delivery on every order, no minimum."),
    # ---------- product-gallery ----------
    ("src/components/product/product-gallery.tsx",
     "{/* Mobile — swipeable gallery */}",
     "{/* Mobile - swipeable gallery */}"),
    ("src/components/product/product-gallery.tsx",
     'aria-label="Product image gallery — swipe to browse"',
     'aria-label="Product image gallery, swipe to browse"'),
    ("src/components/product/product-gallery.tsx",
     "{/* Desktop — editorial gallery with thumbs */}",
     "{/* Desktop - editorial gallery with thumbs */}"),
    ("src/components/product/product-gallery.tsx",
     "{active + 1} / {images.length} — {current.alt ?? product.name}",
     "{active + 1} / {images.length} · {current.alt ?? product.name}"),
    # ---------- filter-panel ----------
    ("src/components/shop/filter-panel.tsx",
     "{/* Category — only on /shop (not category pages) */}",
     "{/* Category - only on /shop (not category pages) */}"),
    ("src/components/shop/filter-panel.tsx",
     '<span className="font-mono-tech text-xs text-pf-muted">—</span>',
     '<span className="font-mono-tech text-xs text-pf-muted">-</span>'),
    ("src/components/shop/filter-panel.tsx",
     '<option value="price-asc">PRICE: LOW — HIGH</option>',
     '<option value="price-asc">PRICE: LOW TO HIGH</option>'),
    ("src/components/shop/filter-panel.tsx",
     '<option value="price-desc">PRICE: HIGH — LOW</option>',
     '<option value="price-desc">PRICE: HIGH TO LOW</option>'),
    ("src/components/shop/filter-panel.tsx",
     '<option value="az">A — Z</option>',
     '<option value="az">A-Z</option>'),
    # ---------- shop-view ----------
    ("src/components/shop/shop-view.tsx",
     "STOCK ROTATES — MISS IT, LOSE IT",
     "STOCK ROTATES. MISS IT, LOSE IT."),
    ("src/components/shop/shop-view.tsx",
     "No products match the current filters. Clear them or try a different search — stock rotates constantly.",
     "No products match the current filters. Clear them or try a different search. Stock rotates constantly."),
    # ---------- cart-view ----------
    ("src/components/cart/cart-view.tsx",
     "Nothing selected yet. The rack is rotating — go find something worth wearing.",
     "Nothing selected yet. The rack is rotating. Go find something worth wearing."),
    ("src/components/cart/cart-view.tsx",
     '{shipping === 0 ? "FREE — WORLDWIDE" : formatPrice(shipping, settings.currency)}',
     '{shipping === 0 ? "FREE WORLDWIDE" : formatPrice(shipping, settings.currency)}'),
    ("src/components/cart/cart-view.tsx",
     "NO ACCOUNT NEEDED — GUEST CHECKOUT",
     "NO ACCOUNT NEEDED / GUEST CHECKOUT"),
    # ---------- product page ----------
    ("src/app/(storefront)/product/[slug]/page.tsx",
     'const title = `${product.brand ? product.brand + " — " : ""}${product.name}`;',
     'const title = `${product.brand ? product.brand + " - " : ""}${product.name}`;'),
    ("src/app/(storefront)/product/[slug]/page.tsx",
     "`${product.name} — ${product.condition} condition. Curated resale by POSTFORM.`",
     "`${product.name}, ${product.condition} condition. Curated resale by POSTFORM.`"),
    ("src/app/(storefront)/product/[slug]/page.tsx",
     "title: `${title} — POSTFORM`",
     "title: `${title} - POSTFORM`"),
    ("src/app/(storefront)/product/[slug]/page.tsx",
     "{product.category} — RESALE STOCK — {product.material ?? \"MATERIAL UNSPECIFIED\"}",
     "{product.category} / RESALE STOCK / {product.material ?? \"MATERIAL UNSPECIFIED\"}"),
    ("src/app/(storefront)/product/[slug]/page.tsx",
     '<dd className="font-bold text-pf-black">{product.material ?? "—"}</dd>',
     '<dd className="font-bold text-pf-black">{product.material ?? "-"}</dd>'),
    # ---------- error page ----------
    ("src/app/(storefront)/error.tsx",
     "ERROR {error.digest ? `— ${error.digest.slice(0, 8)}` : \"\"}",
     "ERROR {error.digest ? `- ${error.digest.slice(0, 8)}` : \"\"}"),
    ("src/app/(storefront)/error.tsx",
     "The rack jammed while loading this page. Please try again — your cart",
     "The rack jammed while loading this page. Please try again; your cart"),
    # ---------- wishlist-view ----------
    ("src/components/storefront/wishlist-view.tsx",
     "SAVED ON THIS DEVICE — NOT AN ACCOUNT",
     "SAVED ON THIS DEVICE / NOT AN ACCOUNT"),
    ("src/components/storefront/wishlist-view.tsx",
     "Tap the heart on any product to keep an eye on it. Your wishlist lives in this browser only —",
     "Tap the heart on any product to keep an eye on it. Your wishlist lives in this browser only,"),
    ("src/components/storefront/wishlist-view.tsx",
     'SAVED {new Date(item.addedAt).toLocaleDateString("en-GB").toUpperCase()} — AVAILABILITY',
     'SAVED {new Date(item.addedAt).toLocaleDateString("en-GB").toUpperCase()} / AVAILABILITY'),
    # ---------- profile-view ----------
    ("src/components/storefront/profile-view.tsx",
     'toast.success("ADDRESS UPDATED", { description: `${editing.label} — ${editing.city}` });',
     'toast.success("ADDRESS UPDATED", { description: `${editing.label} - ${editing.city}` });'),
    ("src/components/storefront/profile-view.tsx",
     'toast.success("ADDRESS SAVED", { description: `${editing.label} — ${editing.city}` });',
     'toast.success("ADDRESS SAVED", { description: `${editing.label} - ${editing.city}` });'),
    ("src/components/storefront/profile-view.tsx",
     'toast.success("DEFAULT ADDRESS SET", { description: `${a.label} — ${a.city}` });',
     'toast.success("DEFAULT ADDRESS SET", { description: `${a.label} - ${a.city}` });'),
    ("src/components/storefront/profile-view.tsx",
     "LOCAL PROFILE — NO ACCOUNT, NO SERVER",
     "LOCAL PROFILE / NO ACCOUNT, NO SERVER"),
    ("src/components/storefront/profile-view.tsx",
     "Everything here lives in <strong>this browser&apos;s local storage</strong> — it never leaves your",
     "Everything here lives in <strong>this browser&apos;s local storage</strong>. It never leaves your"),
    ("src/components/storefront/profile-view.tsx",
     '<option value="">— SELECT —</option>',
     '<option value="">- SELECT -</option>'),
    ("src/components/storefront/profile-view.tsx",
     "NO SAVED ADDRESSES — ADD ONE TO SPEED UP CHECKOUT",
     "NO SAVED ADDRESSES / ADD ONE TO SPEED UP CHECKOUT"),
    ("src/components/storefront/profile-view.tsx",
     "POSTFORM stores profiles in browser localStorage — device-specific by design. Order history is",
     "POSTFORM stores profiles in browser localStorage, device-specific by design. Order history is"),
    # ---------- header comments ----------
    ("src/components/storefront/site-header.tsx",
     "{/* Persistent mobile search — always visible on phones (spec §5) */}",
     "{/* Persistent mobile search - always visible on phones (spec §5) */}"),
    ("src/components/storefront/site-header.tsx",
     "{/* Category strip — mobile/tablet: horizontal scroll (spec §6) */}",
     "{/* Category strip - mobile/tablet: horizontal scroll (spec §6) */}"),
    ("src/components/storefront/site-header.tsx",
     "{/* Category strip — desktop */}",
     "{/* Category strip - desktop */}"),
    # ---------- skeleton comment ----------
    ("src/components/storefront/skeletons.tsx",
     "no flashy loaders — simple pulse blocks on the sand/paper palette.",
     "no flashy loaders - simple pulse blocks on the sand/paper palette."),
]

changed, failures = 0, []
for rel, old, new in EDITS:
    p = ROOT / rel
    text = p.read_text(encoding="utf-8")
    if old not in text:
        failures.append((rel, old[:60]))
        continue
    p.write_text(text.replace(old, new), encoding="utf-8")
    changed += 1

print(f"applied: {changed}/{len(EDITS)}")
for rel, frag in failures:
    print(f"  MISS: {rel}: {frag}")
