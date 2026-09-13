"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Star, EyeOff, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatPrice, totalStock, stockState } from "@/lib/format";
import { cn } from "@/lib/utils";

export function AdminProductsTable({
  products: initial,
  currency,
}: {
  products: Product[];
  currency: string;
}) {
  const router = useRouter();
  const [products, setProducts] = React.useState(initial);
  const [query, setQuery] = React.useState("");
  const [deleting, setDeleting] = React.useState<string | null>(null);

  React.useEffect(() => setProducts(initial), [initial]);

  const filtered = products.filter((p) =>
    query
      ? `${p.name} ${p.brand ?? ""} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      : true
  );

  async function toggle(id: string, patch: { featured?: boolean; active?: boolean }) {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts((ps) => ps.map((p) => (p.id === id ? data.product : p)));
      toast.success("UPDATED");
    } catch {
      toast.error("UPDATE FAILED");
    }
  }

  async function remove(product: Product) {
    if (!window.confirm(`DELETE “${product.name}”?\n\nThis removes the product, its images and variants permanently.`)) return;
    setDeleting(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((ps) => ps.filter((p) => p.id !== product.id));
      toast.success("PRODUCT DELETED", { description: product.name });
    } catch {
      toast.error("DELETE FAILED");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="font-display text-3xl uppercase leading-none text-pf-black sm:text-4xl">
            Products{" "}
            <span className="font-mono-tech text-base align-middle text-pf-muted">({filtered.length})</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border-2 border-pf-black bg-pf-paper">
            <span className="flex w-9 items-center justify-center border-r-2 border-pf-black text-pf-muted">
              <Search className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="FILTER…"
              aria-label="Filter products"
              className="h-10 w-40 bg-transparent px-2 font-mono-tech text-xs uppercase tracking-wider outline-none placeholder:text-pf-muted/60 sm:w-52"
            />
          </div>
          <Link
            href="/admin/products/new"
            className="flex h-10 items-center gap-2 border-2 border-pf-black bg-pf-yellow px-4 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
          >
            <PlusCircle className="h-4 w-4" strokeWidth={2.5} /> NEW
          </Link>
        </div>
      </div>

      {/* Table - desktop */}
      <div className="mt-6 hidden overflow-x-auto border-2 border-pf-black bg-pf-paper md:block">
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-pf-black bg-pf-black font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-cream">
              <th className="px-3 py-3 font-bold">PRODUCT</th>
              <th className="px-3 py-3 font-bold">CATEGORY</th>
              <th className="px-3 py-3 font-bold">PRICE</th>
              <th className="px-3 py-3 font-bold">CONDITION</th>
              <th className="px-3 py-3 font-bold">STOCK</th>
              <th className="px-3 py-3 font-bold text-center">FEAT</th>
              <th className="px-3 py-3 font-bold text-center">LIVE</th>
              <th className="px-3 py-3 font-bold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const stock = totalStock(p);
              const state = stockState(p);
              return (
                <tr key={p.id} className="border-b border-pf-black/15 align-middle hover:bg-pf-cream">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden border border-pf-black bg-pf-sand">
                        {p.images[0] && (
                          <Image src={p.images[0].url} alt={p.name} fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-pf-black">{p.name}</p>
                        <p className="truncate font-mono-tech text-[10px] uppercase text-pf-muted">
                          {p.brand ?? "NO BRAND"} / {p.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 font-mono-tech text-[11px] uppercase tracking-wider text-pf-ink">
                    {p.category}
                  </td>
                  <td className="px-3 py-2.5 font-mono-tech text-sm font-bold">
                    {formatPrice(p.price, currency)}
                  </td>
                  <td className="px-3 py-2.5 font-mono-tech text-[11px] uppercase tracking-wider">{p.condition}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "inline-block border px-2 py-0.5 font-mono-tech text-[11px] font-bold",
                        state === "SOLD OUT"
                          ? "border-pf-black bg-pf-black text-pf-cream"
                          : state.startsWith("LOW")
                            ? "border-pf-red text-pf-red"
                            : "border-pf-black/30 text-pf-ink"
                      )}
                    >
                      {stock} UNITS
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => toggle(p.id, { featured: !p.featured })}
                      aria-label={p.featured ? "Unfeature product" : "Feature product"}
                      aria-pressed={p.featured}
                      className={cn(
                        "inline-flex h-8 w-8 items-center justify-center border-2 border-pf-black transition-colors",
                        p.featured ? "bg-pf-yellow text-pf-black" : "bg-pf-paper text-pf-muted hover:text-pf-black"
                      )}
                    >
                      <Star className="h-4 w-4" fill={p.featured ? "currentColor" : "none"} strokeWidth={2.5} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => toggle(p.id, { active: !p.active })}
                      aria-label={p.active ? "Hide product from store" : "Make product live"}
                      aria-pressed={p.active}
                      className={cn(
                        "inline-flex items-center gap-1.5 border-2 border-pf-black px-2 py-1 font-mono-tech text-[10px] font-bold uppercase tracking-widest transition-colors",
                        p.active ? "bg-pf-black text-pf-yellow" : "bg-pf-paper text-pf-muted"
                      )}
                    >
                      {p.active ? "LIVE" : <><EyeOff className="h-3 w-3" /> HIDDEN</>}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        aria-label={`Edit ${p.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-sand"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(p)}
                        disabled={deleting === p.id}
                        aria-label={`Delete ${p.name}`}
                        className="inline-flex h-8 w-8 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-red hover:text-white disabled:opacity-40"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-12 text-center font-mono-tech text-xs uppercase tracking-widest text-pf-muted">
            NO PRODUCTS MATCH
          </p>
        )}
      </div>

      {/* Cards - mobile */}
      <ul className="mt-6 space-y-3 md:hidden">
        {filtered.map((p) => (
          <li key={p.id} className="border-2 border-pf-black bg-pf-paper p-3">
            <div className="flex gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-pf-black bg-pf-sand">
                {p.images[0] && <Image src={p.images[0].url} alt={p.name} fill sizes="64px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-pf-black">{p.name}</p>
                <p className="font-mono-tech text-[10px] uppercase text-pf-muted">
                  {p.category} / {formatPrice(p.price, currency)} / {p.condition}
                </p>
                <p className="mt-1 font-mono-tech text-[11px] font-bold">
                  {totalStock(p)} UNITS {p.active ? "· LIVE" : "· HIDDEN"} {p.featured ? "· FEATURED" : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/admin/products/${p.id}/edit`}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 border-2 border-pf-black bg-pf-paper font-mono-tech text-[11px] font-bold uppercase tracking-widest"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                type="button"
                onClick={() => toggle(p.id, { active: !p.active })}
                className="h-9 border-2 border-pf-black bg-pf-paper px-3 font-mono-tech text-[11px] font-bold uppercase tracking-widest"
              >
                {p.active ? "HIDE" : "LIVE"}
              </button>
              <button
                type="button"
                onClick={() => toggle(p.id, { featured: !p.featured })}
                aria-label="Toggle featured"
                className={cn(
                  "h-9 w-9 border-2 border-pf-black",
                  p.featured ? "bg-pf-yellow" : "bg-pf-paper"
                )}
              >
                <Star className="mx-auto h-4 w-4" fill={p.featured ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => remove(p)}
                aria-label="Delete"
                className="h-9 w-9 border-2 border-pf-black bg-pf-paper"
              >
                <Trash2 className="mx-auto h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
