import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Package, Star, Boxes, Tags, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice, totalStock } from "@/lib/format";
import { CATEGORIES } from "@/lib/types";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, settings, variantRows] = await Promise.all([
    db.product.findMany({
      include: { images: true, variants: true },
      orderBy: { updatedAt: "desc" },
    }),
    getSettings(),
    db.productVariant.findMany({ select: { stock: true } }),
  ]);

  const totalStockUnits = variantRows.reduce((sum, v) => sum + v.stock, 0);
  const activeCount = products.filter((p) => p.active).length;
  const featuredCount = products.filter((p) => p.featured).length;
  const soldOut = products.filter((p) => totalStock(p) === 0);
  const lowStock = products.filter((p) => {
    const s = totalStock(p);
    return s > 0 && s <= 2;
  });
  const recent = products.slice(0, 6);

  const stats = [
    { icon: Package, label: "TOTAL PRODUCTS", value: products.length },
    { icon: Boxes, label: "ACTIVE / LIVE", value: activeCount },
    { icon: Star, label: "FEATURED", value: featuredCount },
    { icon: Tags, label: "STOCK UNITS", value: totalStockUnits },
  ];

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
            CONTROL ROOM
          </p>
          <h1 className="font-display text-3xl uppercase leading-none text-pf-black sm:text-4xl">
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-11 items-center gap-2 border-2 border-pf-black bg-pf-yellow px-5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
        >
          <PlusCircle className="h-4 w-4" strokeWidth={2.5} /> Add product
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-2 border-pf-black bg-pf-paper p-4">
            <s.icon className="h-5 w-5 text-pf-purple" strokeWidth={2.5} />
            <p className="mt-3 font-display text-3xl leading-none text-pf-black">{s.value}</p>
            <p className="mt-1 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-muted">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        {/* Recent products */}
        <section aria-labelledby="recent-heading">
          <h2
            id="recent-heading"
            className="border-b-2 border-pf-black pb-2 font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-black"
          >
            RECENTLY UPDATED
          </h2>
          <ul className="mt-4 divide-y-2 border-2 border-pf-black bg-pf-paper">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-4 p-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden border border-pf-black bg-pf-sand">
                  {p.images[0] && (
                    <Image src={p.images[0].url} alt={p.name} fill sizes="48px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-pf-black">{p.name}</p>
                  <p className="font-mono-tech text-[10px] uppercase tracking-wider text-pf-muted">
                    {p.category} — {formatPrice(p.price, settings.currency)} — {totalStock(p)} IN STOCK
                  </p>
                </div>
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="shrink-0 border-2 border-pf-black bg-pf-paper px-3 py-1.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-pf-yellow"
                >
                  EDIT
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Attention column */}
        <section aria-labelledby="attention-heading" className="space-y-6">
          <div>
            <h2
              id="attention-heading"
              className="border-b-2 border-pf-black pb-2 font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-black"
            >
              NEEDS ATTENTION
            </h2>
            <div className="mt-4 space-y-3">
              {(soldOut.length > 0 || lowStock.length > 0) && (
                <div className="border-2 border-pf-red/50 bg-pf-red/5 p-4">
                  <p className="flex items-center gap-2 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-red">
                    <AlertTriangle className="h-4 w-4" /> STOCK WARNINGS
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-pf-ink">
                    {soldOut.map((p) => (
                      <li key={p.id}>
                        SOLD OUT —{" "}
                        <Link href={`/admin/products/${p.id}/edit`} className="font-bold underline underline-offset-2">
                          {p.name}
                        </Link>
                      </li>
                    ))}
                    {lowStock.map((p) => (
                      <li key={p.id}>
                        LOW ({totalStock(p)}) —{" "}
                        <Link href={`/admin/products/${p.id}/edit`} className="font-bold underline underline-offset-2">
                          {p.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {soldOut.length === 0 && lowStock.length === 0 && (
                <p className="border-2 border-dashed border-pf-black/20 p-4 text-center font-mono-tech text-[11px] uppercase tracking-widest text-pf-muted">
                  ALL STOCK HEALTHY
                </p>
              )}

              <div className="border-2 border-pf-black bg-pf-paper p-4">
                <p className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-black">
                  CATEGORY COVERAGE
                </p>
                <ul className="mt-2 grid grid-cols-2 gap-1 font-mono-tech text-[10px] uppercase tracking-wider">
                  {CATEGORIES.map((c) => {
                    const count = products.filter((p) => p.category === c.name).length;
                    return (
                      <li key={c.slug} className="flex items-center justify-between border border-pf-black/15 px-2 py-1">
                        <span className="text-pf-muted">{c.short}</span>
                        <span className={count === 0 ? "text-pf-red" : "font-bold text-pf-black"}>{count}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="border-2 border-pf-black bg-pf-black p-4 text-pf-cream">
                <p className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-yellow">
                  HOW ORDERS ARRIVE
                </p>
                <p className="mt-2 text-xs leading-relaxed text-pf-cream/70">
                  Customers submit orders via the generated order email to{" "}
                  <span className="break-all font-mono-tech text-pf-cream">{settings.storeEmail}</span>. Check
                  that inbox — there is no order dashboard by design.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
