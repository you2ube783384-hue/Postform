# POSTFORM — Curated Streetwear Resale Store

A production-ready e-commerce storefront for **POSTFORM**, an international reseller / curated-stock fashion store. Built to a Neo-Brutalist + Fashion Editorial design language: warm milky background, strong black borders, yellow primary actions, controlled purple accents, editorial display type paired with monospace UI type.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma + Turso (libsql) driver adapter · Zustand (local cart/wishlist/profile) · sonner toasts.

---

## 1. Local Development

```bash
bun install        # install dependencies
bun run dev        # dev server on port 3000
bun run lint       # ESLint
```

The app expects the environment variables below (see `.env`):

```env
TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-token>
DATABASE_URL=file:./db/custom.db        # placeholder for Prisma CLI; runtime uses the Turso adapter
ADMIN_PASSWORD=<your admin password>
ADMIN_SESSION_SECRET=<random long string>
NEXT_PUBLIC_STORE_EMAIL=postformproducts@haren.uk
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # used for SEO metadata/sitemap
```

### Database (Turso)

- Schema lives in `prisma/schema.prisma`.
- Tables were created by applying `prisma/migration.sql` to Turso (script: `scripts/apply_migration.ts`).
- The runtime client (`src/lib/db.ts`) connects through the **Prisma LibSQL driver adapter**, so no local SQLite file is used.
- To re-apply the schema after model changes: generate DDL with
  `bunx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migration.sql`, then `bun scripts/apply_migration.ts`.
- Seed data: `bun scripts/seed.ts` inserts 14 demo products + default settings (clears existing products first).

---

## 2. Admin Panel

- URL: **`/admin`** — everything under `/admin/*` and `/api/admin/*` is protected **server-side** by the proxy (`src/proxy.ts` — Next.js 16's replacement for the deprecated `middleware.ts`) using an HMAC-signed, httpOnly session cookie (7-day expiry). Hiding the footer link is never the security mechanism.
- Login: `/admin/login` with `ADMIN_PASSWORD` from the environment.
- **Change the password and `ADMIN_SESSION_SECRET` before deploying publicly.**

### Managing products (Admin → Products)

- **Create:** Admin → Add Product. The form covers: basics (name/category/brand/condition/description/material/size chart), pricing (selling price + optional original/MRP), variants & stock (size + colour + per-variant stock, with quick-add presets), media (image URLs with validation, alt text, reorder, primary image), merchandising (tags, featured, live/hidden) and a live storefront card preview with a publish checklist.
- **Edit:** Products → EDIT. Saving replaces images/variants atomically.
- **Quick toggles:** the products table lets you feature/unfeature and hide/publish with one click.
- **Delete:** removes the product with its images and variants (cascades in DB).
- **Dashboard:** totals, stock warnings (sold out / low stock), category coverage.

### Images

POSTFORM stores **image URLs, not uploads** — no writable disk is assumed (Vercel-safe). Host imagery on any reachable CDN / your own hosting / Git-backed assets and paste the URL in the admin media section. URLs are validated (http/https) and the first image is the product card's primary.

### Settings (Admin → Settings)

- Shipping rules: **Free worldwide** (current business policy) or a **flat fee** — immediately reflected in checkout totals.
- Currency symbol and order-email recipient are also editable there.

---

## 3. How Ordering Works (email handoff — by design)

POSTFORM intentionally receives orders **by email**, not through an order-management CRM:

1. Customer adds to cart / uses **Buy Now** (skips the cart entirely).
2. Checkout collects customer info, international delivery address, payment method (PayPal / Visa-prepaid) and an optional note — with the order summary always visible.
3. On submit, an order ID (`POSTFORM-####`) is generated and a **mailto: link opens the customer's email app** fully prefilled for `postformproducts@haren.uk` (recipient, subject, plain-text body with all order details).
4. The customer reviews and **presses Send** — the UI never claims the email was sent automatically.
5. If the mailto is too long or the app doesn't open, a **Copy Order Details** fallback is provided.

The email body (`src/lib/order-email.ts`) contains: order number, date/time, customer block, full delivery address, every item (variant/size/colour/qty/unit price/line total), subtotal, shipping, total, payment method and the customer note.

### Payments

The checkout records the chosen method (PayPal or Visa/prepaid card) and includes it in the order email. **No card details are ever collected or stored** — no fake payment forms. The architecture is prepared for a real provider integration:

- `PAYPAL_CLIENT_ID` / payment-provider secrets should be added as **environment variables on the server only** when the merchant account is ready (see `src/components/checkout/checkout-view.tsx`, section `03 — PAYMENT METHOD`).
- Preferred production flow once configured: Checkout → provider-hosted secure payment → confirmation → order email.

No payment credentials were invented for this build, per the PRD's open-configuration items.

---

## 4. Local Customer Data (no accounts)

There is **no customer account system and no server-side customer database**:

- **Cart** (`pf-cart`), **Wishlist** (`pf-wishlist`) and **Profile + saved addresses** (`pf-profile`) live in browser `localStorage` via Zustand persist.
- The profile (name/email/phone + Home/Work/Other addresses with default selection) prefills checkout; addresses can be saved during checkout too.
- `/profile` includes a "Clear Local Data" action; the page clearly states data is device/browser-specific.

---

## 5. Storefront Map

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, curated rack, category index, manifesto, newest |
| `/shop` | Full catalogue with search, filters (brand/size/colour/condition/price) and sorting |
| `/shop/[category]` | Category listing (same engine) |
| `/product/[slug]` | Product detail — gallery + lightbox, variant-aware stock, size chart, Buy Now |
| `/cart` | Cart with quantity controls and order summary |
| `/checkout` | Guest checkout → order email generation |
| `/wishlist`, `/profile` | Local-only wishlist and profile/addresses |
| `/about` | Brand info |
| `/privacy`, `/terms`, `/refund` | Legal pages — Privacy Policy, Terms & Conditions, Return & Refund (verbatim content from postform.neocities.org) |
| `/admin/*` | Protected product & inventory management |

**Variant behaviour:** sizes with zero stock render visibly unavailable and cannot be selected; single-colour products show no meaningless colour selector; sold-out products show an overlay state.

---

## 6. Branding: Colours & Fonts

All brand tokens are CSS variables + Tailwind theme tokens in **`src/app/globals.css`**:

- `--color-pf-cream: #f5f0e6` — warm milky background
- `--color-pf-black: #141310` — text & structural borders
- `--color-pf-yellow: #ffd02e` — primary CTAs/highlights
- `--color-pf-purple: #6c4cf1` — links, secondary states, accents
- (plus `pf-paper`, `pf-sand`, `pf-muted`, `pf-red`)

Fonts are loaded in `src/app/layout.tsx` via `next/font/google`: **Archivo Black** (display), **Archivo** (body), **Space Mono** (technical UI). Swap any of the three `next/font` registrations to change the identity; no other file needs editing.

Buttons (`src/components/pf/button.tsx`) and badges (`src/components/pf/badges.tsx`) centralise the brutalist component language (2px black borders, hard offset shadows, press micro-interactions, sharp corners, `prefers-reduced-motion` respected).

## 7. Changing Store Policies

- **Shipping:** Admin → Settings (free vs flat fee + amount) — no code changes needed.
- **Legal pages** (Privacy / Terms / Return & Refund): `src/app/(storefront)/privacy|terms|refund/page.tsx` — copied verbatim from `postform.neocities.org`. To change policy wording, edit the text in those three files.
- **Contact email:** Admin → Settings (order recipient) / footer reads it from settings.

## 8. SEO & Performance

- Per-page metadata incl. Open Graph + Twitter cards, dynamic product-page metadata with images.
- `src/app/sitemap.ts` (auto-includes active products + categories) and `src/app/robots.ts` (admin/api/personal routes disallowed).
- Semantic HTML, keyboard-navigable components, visible focus states, alt text, ARIA labelling, lazy-loaded below-fold imagery, `next/image` optimization.

## 9. Deployment (Vercel)

The app stores all data in **Turso** (hosted libsql/SQLite) — a local `db/custom.db` file will **not** work on Vercel's serverless filesystem. If you see `Error: Failed to connect to database: ./db/custom.db` in the Vercel logs, the Turso env vars are missing (step 2 below).

1. **Push the repository to GitHub and import it in Vercel.** `next.config.ts` already uses the standalone output expected by Vercel. The admin guard is `src/proxy.ts` (Next.js 16 `proxy` convention — deploying `middleware.ts` triggers a deprecation warning on Vercel).

2. **Create a Turso database and migrate the local data** (from a machine with the repo checked out):

   ```bash
   # a) Create a free database: https://turso.tech → sign up, or:
   #    curl or chisel CLI: turso db create postform && turso db show postform --url
   #    then create a token: turso db tokens create postform

   # b) Copy schema + all data (products, images, variants, settings):
   TURSO_DATABASE_URL=libsql://<db>-<org>.turso.io \
   TURSO_AUTH_TOKEN=eyJ... \
   node scripts/push-to-turso.mjs
   # re-runs are safe (INSERT OR REPLACE); add --reset to drop target tables first
   ```

3. **Set environment variables** in Vercel → Settings → Environment Variables (Production + Preview):

   | Variable | Value |
   |---|---|
   | `TURSO_DATABASE_URL` | `libsql://<db>-<org>.turso.io` |
   | `TURSO_AUTH_TOKEN` | Turso auth token |
   | `ADMIN_PASSWORD` | strong password (**never** ship the dev default `postform-admin-2026`) |
   | `ADMIN_SESSION_SECRET` | random long string (`openssl rand -hex 32`) |
   | `NEXT_PUBLIC_STORE_EMAIL` | `postformproducts@haren.uk` |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |

   `DATABASE_URL` is only used by the Prisma CLI locally — not needed on Vercel.

4. **Redeploy** (Vercel → Deployments → … → Redeploy). Product images stay on their external hosts, so no writable filesystem is needed.

> Note: serverless deploys share one Turso database, so admin edits (products, settings) persist across deployments and regions.

---

## Project Structure

```
src/
├── app/
│   ├── (storefront)/        # public storefront routes + header/footer layout
│   ├── admin/               # login + protected (panel) group (dashboard/products/settings)
│   ├── api/admin/           # login/logout/products/settings route handlers
│   ├── layout.tsx           # fonts + root metadata
│   ├── sitemap.ts, robots.ts, not-found.tsx
├── components/
│   ├── pf/                  # brutalist primitives (buttons, badges)
│   ├── storefront/          # header, footer, product card/grid, wishlist/profile views
│   ├── shop/                # filter panel, shop chrome, shop view
│   ├── product/             # gallery + lightbox, purchase panel, sticky buy bar
│   ├── cart/ checkout/      # cart view, checkout flow + order email confirmation
│   └── admin/               # admin shell, products table, product form, settings
├── lib/                     # db (Turso adapter), queries, types, stores, order-email, auth
└── proxy.ts                 # server-side admin protection (Next.js 16 proxy convention)
scripts/                     # seed, migration apply, image fetchers (build tooling)
prisma/                      # schema + generated migration SQL
```
