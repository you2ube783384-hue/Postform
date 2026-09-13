#!/usr/bin/env python3
"""Taste Skill pass 2: em-dash purge batch 2 + Color Consistency Lock.

Color lock: pf-yellow is THE page accent. Purple survives only as the
functional :focus-visible ring (a11y affordance, not decoration).
Kicker/eyebrow purple -> muted; links/icons/steps purple -> black;
footer email on black -> yellow; wishlist badge -> yellow.
"""
import pathlib
import re

ROOT = pathlib.Path("/home/z/my-project/src")

EDITS = [
    # ---------- types.ts sort labels ----------
    ("src/lib/types.ts", '{ value: "price-asc", label: "PRICE: LOW — HIGH" }', '{ value: "price-asc", label: "PRICE: LOW TO HIGH" }'),
    ("src/lib/types.ts", '{ value: "price-desc", label: "PRICE: HIGH — LOW" }', '{ value: "price-desc", label: "PRICE: HIGH TO LOW" }'),
    ("src/lib/types.ts", '{ value: "az", label: "A — Z" }', '{ value: "az", label: "A-Z" }'),
    # ---------- order email (visible in the customer's mail app) ----------
    ("src/lib/order-email.ts", 'lines.push(`[${i + 1}] ${item.brand ? item.brand + " — " : ""}${item.name}`);',
     'lines.push(`[${i + 1}] ${item.brand ? item.brand + " - " : ""}${item.name}`);'),
    ("src/lib/order-email.ts", "// POSTFORM order email generation — mailto: handoff (PRD §22, §42)",
     "// POSTFORM order email generation - mailto: handoff (PRD §22, §42)"),
    ("src/lib/order-email.ts", "tooLong: boolean; // exceeds safe mailto length — offer copy fallback",
     "tooLong: boolean; // exceeds safe mailto length - offer copy fallback"),
    ("src/lib/order-email.ts", 'const subject = `POSTFORM Order #${orderId.split("-")[1]} — New Order`;',
     'const subject = `POSTFORM Order #${orderId.split("-")[1]} - New Order`;'),
    # ---------- checkout view ----------
    ("src/components/checkout/checkout-view.tsx", "toast.success(`ADDRESS LOADED — ${a.label.toUpperCase()}`);",
     "toast.success(`ADDRESS LOADED - ${a.label.toUpperCase()}`);"),
    ("src/components/checkout/checkout-view.tsx", "// (programmatic anchor — mailto: navigation without mutating window.location)",
     "// (programmatic anchor - mailto: navigation without mutating window.location)"),
    ("src/components/checkout/checkout-view.tsx", 'description: "Your email app should have opened — press Send to complete the order request.",',
     'description: "Your email app should have opened. Press Send to complete the order request.",'),
    ("src/components/checkout/checkout-view.tsx", "`To: ${settings.storeEmail}\\nSubject: POSTFORM Order #${confirmation.orderId.split(\"-\")[1]} — New Order\\n\\n${body}`",
     "`To: ${settings.storeEmail}\\nSubject: POSTFORM Order #${confirmation.orderId.split(\"-\")[1]} - New Order\\n\\n${body}`"),
    ("src/components/checkout/checkout-view.tsx", "ORDER PREPARED — AWAITING YOUR SEND", "ORDER PREPARED / AWAITING YOUR SEND"),
    ("src/components/checkout/checkout-view.tsx", "⚠ This order is large — some email apps may truncate prefilled text.",
     "⚠ This order is large; some email apps may truncate prefilled text."),
    ("src/components/checkout/checkout-view.tsx", '{item.size ? ` — ${item.size}` : ""}', '{item.size ? ` - ${item.size}` : ""}'),
    ("src/components/checkout/checkout-view.tsx", "<span>TOTAL — {confirmation.paymentMethod.toUpperCase()}</span>",
     "<span>TOTAL / {confirmation.paymentMethod.toUpperCase()}</span>"),
    ("src/components/checkout/checkout-view.tsx", "Your cart is empty. Add something from the rack first — then come back.",
     "Your cart is empty. Add something from the rack first, then come back."),
    ("src/components/checkout/checkout-view.tsx", "GUEST CHECKOUT — NO ACCOUNT NEEDED", "GUEST CHECKOUT / NO ACCOUNT NEEDED"),
    ("src/components/checkout/checkout-view.tsx", "INTERNATIONAL — WORLDWIDE", "INTERNATIONAL / WORLDWIDE"),
    ("src/components/checkout/checkout-view.tsx", '<option value="">— SELECT COUNTRY —</option>', '<option value="">- SELECT COUNTRY -</option>'),
    ("src/components/checkout/checkout-view.tsx", '<span className="ml-2 font-normal text-pf-muted">— OPTIONAL</span>',
     '<span className="ml-2 font-normal text-pf-muted">/ OPTIONAL</span>'),
    ("src/components/checkout/checkout-view.tsx", "{/* ORDER SUMMARY — always visible */}", "{/* ORDER SUMMARY - always visible */}"),
    ("src/components/checkout/checkout-view.tsx", "YOUR ORDER — {items.length} ITEM{items.length === 1 ? \"\" : \"S\"}",
     "YOUR ORDER / {items.length} ITEM{items.length === 1 ? \"\" : \"S\"}"),
    ("src/components/checkout/checkout-view.tsx", '{item.color ?? ""} — ×{item.qty}', '{item.color ?? ""} ×{item.qty}'),
    ("src/components/checkout/checkout-view.tsx", '{shipping === 0 ? "FREE — WORLDWIDE" : formatPrice(shipping, settings.currency)}',
     '{shipping === 0 ? "FREE WORLDWIDE" : formatPrice(shipping, settings.currency)}'),
    ("src/components/checkout/checkout-view.tsx", "OPENS YOUR EMAIL APP WITH EVERYTHING PREFILLED — YOU PRESS SEND",
     "OPENS YOUR EMAIL APP WITH EVERYTHING PREFILLED / YOU PRESS SEND"),
    # ---------- about page ----------
    ("src/app/(storefront)/about/page.tsx",
     '"POSTFORM is an international curated-stock fashion store — streetwear, sneakers and accessories sourced, graded and resold worldwide."',
     '"POSTFORM is an international curated-stock fashion store. Streetwear, sneakers and accessories sourced, graded and resold worldwide."'),
    ("src/app/(storefront)/about/page.tsx",
     "clothing, footwear and accessories — new, used, vintage and everything in between — and resell\n            them to a worldwide audience.",
     "clothing, footwear and accessories (new, used, vintage and everything in between) and resell\n            them to a worldwide audience."),
    ("src/app/(storefront)/about/page.tsx",
     "What you see on the rack is what exists. When it&apos;s gone, it&apos;s gone — and something\n            else takes its place.",
     "What you see on the rack is what exists. When it&apos;s gone, it&apos;s gone. Something\n            else takes its place."),
    ("src/app/(storefront)/about/page.tsx",
     "Every item carries an honest condition grade — NEW, LIKE NEW, EXCELLENT, USED or VINTAGE —\n            decided by inspection, not marketing.",
     "Every item carries an honest condition grade (NEW, LIKE NEW, EXCELLENT, USED or VINTAGE),\n            decided by inspection, not marketing."),
    ("src/app/(storefront)/about/page.tsx", '["SHIPPING", "FREE — INTERNATIONAL"]', '["SHIPPING", "FREE INTERNATIONAL"]'),
    ("src/app/(storefront)/about/page.tsx", '["ACCOUNTS", "NONE — GUEST ONLY"]', '["ACCOUNTS", "NONE / GUEST ONLY"]'),
    ("src/app/(storefront)/about/page.tsx", "Orders, returns and general questions all go through email — a human reads every one.",
     "Orders, returns and general questions all go through email. A human reads every one."),
    # ---------- not-found ----------
    ("src/app/not-found.tsx", "ERROR 404 — FILE NOT FOUND", "ERROR 404 / FILE NOT FOUND"),
    ("src/app/not-found.tsx", "This page doesn&apos;t exist — or the piece you were looking for has already rotated out of stock.",
     "This page doesn&apos;t exist, or the piece you were looking for has already rotated out of stock."),
    # ---------- metadata titles/descriptions ----------
    ("src/app/layout.tsx", '"POSTFORM — Curated Streetwear Resale"', '"POSTFORM - Curated Streetwear Resale"'),
    ("src/app/layout.tsx", 'template: "%s — POSTFORM"', 'template: "%s - POSTFORM"'),
    ("src/app/admin/(panel)/layout.tsx", 'template: "%s — POSTFORM Admin"', 'template: "%s - POSTFORM Admin"'),
    ("src/app/(storefront)/privacy/page.tsx",
     '"POSTFORM privacy policy — no tracking cookies, no analytics, no third-party pixels. Only the data you voluntarily provide to process an order."',
     '"POSTFORM privacy policy: no tracking cookies, no analytics, no third-party pixels. Only the data you voluntarily provide to process an order."'),
    ("src/app/(storefront)/privacy/page.tsx", "LEGAL — PRIVACY", "LEGAL / PRIVACY"),
    ("src/app/(storefront)/terms/page.tsx",
     '"POSTFORM terms & conditions — brand protection, verified payment methods (Visa, PayPal), product authenticity and terms modifications."',
     '"POSTFORM terms & conditions: brand protection, verified payment methods (Visa, PayPal), product authenticity and terms modifications."'),
    ("src/app/(storefront)/terms/page.tsx", "LEGAL — TERMS", "LEGAL / TERMS"),
    ("src/app/(storefront)/refund/page.tsx",
     '"POSTFORM return & refund policy — defect and significant-mismatch returns with unboxing video proof. Defect return shipping covered by us. 5-7 business day refunds."',
     '"POSTFORM return & refund policy: defect and significant-mismatch returns with unboxing video proof. Defect return shipping covered by us. 5-7 business day refunds."'),
    ("src/app/(storefront)/refund/page.tsx", "LEGAL — REFUND", "LEGAL / REFUND"),
    ("src/app/(storefront)/wishlist/page.tsx", '"Your saved POSTFORM pieces — stored locally on this device."',
     '"Your saved POSTFORM pieces, stored locally on this device."'),
    ("src/app/(storefront)/shop/page.tsx",
     '"Browse the full POSTFORM catalogue — streetwear, sneakers and accessories, new, used and vintage. Free international shipping."',
     '"Browse the full POSTFORM catalogue. Streetwear, sneakers and accessories, new, used and vintage. Free international shipping."'),
    ("src/app/(storefront)/shop/[category]/page.tsx",
     "`Shop POSTFORM ${cat.name.toLowerCase()} — curated resale stock with free international shipping.`",
     "`Shop POSTFORM ${cat.name.toLowerCase()}, curated resale stock with free international shipping.`"),
    ("src/app/(storefront)/checkout/page.tsx", '"Complete your POSTFORM order — guest checkout, no account needed."',
     '"Complete your POSTFORM order. Guest checkout, no account needed."'),
    ("src/app/(storefront)/profile/page.tsx", '"Your local POSTFORM profile and saved addresses — stored in this browser only."',
     '"Your local POSTFORM profile and saved addresses, stored in this browser only."'),
    ("src/app/(storefront)/shop/page.tsx", '"Browse the full POSTFORM catalogue — streetwear, sneakers and accessories, new, used and vintage. Free international shipping."',
     '"Browse the full POSTFORM catalogue. Streetwear, sneakers and accessories, new, used and vintage. Free international shipping."'),
    # ---------- admin copy (visuals out of scope, copy normalized) ----------
    ("src/components/admin/admin-shell.tsx", "ORDERS ARRIVE BY EMAIL —", "ORDERS ARRIVE BY EMAIL."),
    ("src/components/admin/admin-shell.tsx", "{/* Sidebar — desktop */}", "{/* Sidebar - desktop */}"),
    ("src/components/admin/settings-form.tsx", 'desc: "Current business policy — every order ships free worldwide."',
     'desc: "Current business policy: every order ships free worldwide."'),
    ("src/components/admin/settings-form.tsx", "Shipping is deliberately a configurable setting — the current policy is free initial",
     "Shipping is deliberately a configurable setting. The current policy is free initial"),
    ("src/components/admin/settings-form.tsx", "<li>ADMIN_PASSWORD — admin login password</li>", "<li>ADMIN_PASSWORD: admin login password</li>"),
    ("src/components/admin/settings-form.tsx", "<li>ADMIN_SESSION_SECRET — session signing secret</li>", "<li>ADMIN_SESSION_SECRET: session signing secret</li>"),
    ("src/components/admin/settings-form.tsx", "<li>TURSO_DATABASE_URL / TURSO_AUTH_TOKEN — database</li>", "<li>TURSO_DATABASE_URL / TURSO_AUTH_TOKEN: database</li>"),
    ("src/components/admin/settings-form.tsx", "<li>PAYPAL_CLIENT_ID — payment provider (future)</li>", "<li>PAYPAL_CLIENT_ID: payment provider (future)</li>"),
    ("src/components/admin/product-form.tsx", 'title="01 — PRODUCT BASICS"', 'title="01. PRODUCT BASICS"'),
    ("src/components/admin/product-form.tsx", 'title="02 — PRICING"', 'title="02. PRICING"'),
    ("src/components/admin/product-form.tsx", 'title="03 — VARIANTS & STOCK"', 'title="03. VARIANTS & STOCK"'),
    ("src/components/admin/product-form.tsx", 'title="04 — MEDIA"', 'title="04. MEDIA"'),
    ("src/components/admin/product-form.tsx", 'title="05 — MERCHANDISING"', 'title="05. MERCHANDISING"'),
    ("src/components/admin/product-form.tsx", '<option value="">— SELECT —</option>', '<option value="">- SELECT -</option>'),
    ("src/components/admin/product-form.tsx", "SIZE CHART — OPTIONAL", "SIZE CHART / OPTIONAL"),
    ("src/components/admin/product-form.tsx", 'placeholder={"SIZE — CHEST — LENGTH\\nM — 50cm — 69cm"}',
     'placeholder={"SIZE / CHEST / LENGTH\\nM / 50cm / 69cm"}'),
    ("src/components/admin/product-form.tsx", "ORIGINAL / MRP ({currency}) — OPTIONAL", "ORIGINAL / MRP ({currency}) / OPTIONAL"),
    ("src/components/admin/product-form.tsx", "Stock is variant-aware — a size with 0 stock shows as visibly unavailable on the storefront",
     "Stock is variant-aware: a size with 0 stock shows as visibly unavailable on the storefront"),
    ("src/components/admin/product-form.tsx", "— FIRST IS PRIMARY", " / FIRST IS PRIMARY"),
    ("src/components/admin/product-form.tsx", 'placeholder="ALT TEXT — describe the image"', 'placeholder="ALT TEXT: describe the image"'),
    ("src/components/admin/product-form.tsx", "POSTFORM stores image URLs, not uploads — host images anywhere reachable (your own",
     "POSTFORM stores image URLs, not uploads. Host images anywhere reachable (your own"),
    ("src/components/admin/product-form.tsx", "TAGS — COMMA SEPARATED", "TAGS / COMMA SEPARATED"),
    ("src/components/admin/product-form.tsx", "{/* PREVIEW — sticky */}", "{/* PREVIEW - sticky */}"),
    ("src/components/admin/product-form.tsx", '{slugPreview || "—"}', '{slugPreview || "-"}'),
    ("src/components/admin/products-table.tsx", "{/* Table — desktop */}", "{/* Table - desktop */}"),
    ("src/components/admin/products-table.tsx", "{/* Cards — mobile */}", "{/* Cards - mobile */}"),
    ("src/components/admin/products-table.tsx", "{p.category} — {formatPrice(p.price, currency)} — {p.condition}",
     "{p.category} / {formatPrice(p.price, currency)} / {p.condition}"),
    ("src/components/admin/login-form.tsx", "RESTRICTED — ADMIN AREA", "RESTRICTED / ADMIN AREA"),
    ("src/components/pf/button.tsx", "// Yellow primary CTA — black text, black border", "// Yellow primary CTA - black text, black border"),
    ("src/components/pf/button.tsx", "// Paper secondary — white with black border", "// Paper secondary - white with black border"),
    ("src/app/admin/(panel)/page.tsx", "{p.category} — {formatPrice(p.price, settings.currency)} — {totalStock(p)} IN STOCK",
     "{p.category} / {formatPrice(p.price, settings.currency)} / {totalStock(p)} IN STOCK"),
    ("src/app/admin/(panel)/page.tsx", 'SOLD OUT —{" "}', 'SOLD OUT.{" "}'),
    ("src/app/admin/(panel)/page.tsx", 'LOW ({totalStock(p)}) —{" "}', 'LOW ({totalStock(p)}).{" "}'),
    ("src/app/admin/(panel)/page.tsx", "that inbox — there is no order dashboard by design.", "that inbox. There is no order dashboard by design."),
    # ---------- remaining comments ----------
    ("src/proxy.ts", "// Server-side protection for all admin routes — hiding links is not security.",
     "// Server-side protection for all admin routes - hiding links is not security."),
    ("src/proxy.ts", "// (Next.js 16: `middleware.ts` convention is deprecated — this is the `proxy.ts` replacement.)",
     "// (Next.js 16: `middleware.ts` convention is deprecated - this is the `proxy.ts` replacement.)"),
    ("src/app/api/admin/products/[id]/route.ts", "// PUT /api/admin/products/[id] — full update (replaces images + variants)",
     "// PUT /api/admin/products/[id] - full update (replaces images + variants)"),
    ("src/app/api/admin/products/[id]/route.ts", "// PATCH /api/admin/products/[id] — quick toggles (featured/active)",
     "// PATCH /api/admin/products/[id] - quick toggles (featured/active)"),
    ("src/app/api/admin/products/route.ts", "// POST /api/admin/products — create a product", "// POST /api/admin/products - create a product"),
    ("src/app/api/admin/products/route.ts", "// GET /api/admin/products — list all products (incl. inactive)",
     "// GET /api/admin/products - list all products (incl. inactive)"),
    ("src/lib/auth.ts", "// POSTFORM admin auth — HMAC-signed session tokens", "// POSTFORM admin auth - HMAC-signed session tokens"),
    ("src/app/sitemap.ts", "// DB unavailable — static pages still ship", "// DB unavailable - static pages still ship"),
]

changed, failures = 0, []
for rel, old, new in EDITS:
    p = ROOT.parent / rel
    text = p.read_text(encoding="utf-8")
    if old not in text:
        failures.append((rel, old[:60]))
        continue
    p.write_text(text.replace(old, new), encoding="utf-8")
    changed += 1

print(f"dash edits applied: {changed}/{len(EDITS)}")
for rel, frag in failures:
    print(f"  MISS: {rel}: {frag}")

# ---------- Color Consistency Lock: purple -> functional-only ----------
# Order matters: longer tokens first.
COLOR_RULES = [
    # footer email link on black background -> yellow accent
    ("src/components/storefront/site-footer.tsx", "text-pf-purple-soft", "text-pf-yellow"),
    # wishlist badge -> yellow block (matches condition-badge language)
    ("src/components/storefront/wishlist-view.tsx",
     "bg-pf-purple-soft px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-purple",
     "bg-pf-yellow px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-black"),
]

cc = 0
for rel, old, new in COLOR_RULES:
    p = ROOT.parent / rel
    text = p.read_text(encoding="utf-8")
    if old in text:
        p.write_text(text.replace(old, new), encoding="utf-8")
        cc += 1
    else:
        print(f"  COLOR MISS: {rel}: {old[:50]}")
print(f"color rules applied: {cc}/{len(COLOR_RULES)}")

# Kicker paragraphs (mono uppercase tracked labels) -> muted gray
KICKER_RE = re.compile(r'(<p className="font-mono-tech[^"]*?)text-pf-purple(")')
kc = 0
for p in ROOT.rglob("*.tsx"):
    text = p.read_text(encoding="utf-8")
    new = KICKER_RE.sub(r"\1text-pf-muted\2", text)
    if new != text:
        p.write_text(new, encoding="utf-8")
        kc += 1
print(f"kicker files normalized: {kc}")

# All remaining decorative purple text -> black (links, icons, step numbers)
rc = 0
for p in ROOT.rglob("*.tsx"):
    text = p.read_text(encoding="utf-8")
    new = text.replace("text-pf-purple", "text-pf-black").replace("hover:text-pf-purple", "hover:text-pf-black")
    if new != text:
        p.write_text(new, encoding="utf-8")
        rc += 1
print(f"purple->black files normalized: {rc}")
