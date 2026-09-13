import Link from "next/link";
import { SearchX, X } from "lucide-react";
import { getProducts, getFilterOptions } from "@/lib/queries";
import type { CategoryDef, ShopFilters } from "@/lib/types";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ShopChrome } from "@/components/shop/shop-chrome";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

function buildHref(base: string, params: Record<string, string | undefined>, page: number): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) usp.set(k, v);
  }
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `${base}?${qs}` : base;
}

export async function ShopView({
  filters,
  activeCategory,
}: {
  filters: ShopFilters;
  activeCategory?: CategoryDef;
}) {
  const [{ items, total, page, pageCount }, options] = await Promise.all([
    getProducts(filters),
    getFilterOptions(),
  ]);

  const basePath = activeCategory ? `/shop/${activeCategory.slug}` : "/shop";
  const paramKeys: Record<string, string | undefined> = {
    q: filters.q,
    brand: filters.brands?.join(","),
    size: filters.sizes?.join(","),
    color: filters.colors?.join(","),
    cond: filters.conditions?.join(","),
    min: filters.minPrice !== undefined ? String(filters.minPrice) : undefined,
    max: filters.maxPrice !== undefined ? String(filters.maxPrice) : undefined,
    sort: filters.sort,
  };

  const title = activeCategory ? activeCategory.name : "All Products";
  const kicker = activeCategory ? `CATEGORY INDEX / ${activeCategory.slug.replace(/-/g, " ").toUpperCase()}` : "FULL CATALOGUE";

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12">
      {/* Heading */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "SHOP", href: "/shop" },
            ...(activeCategory ? [{ label: activeCategory.name.toUpperCase() }] : []),
          ]}
        />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
          <div>
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">{kicker}</p>
            <h1 className="font-display text-4xl uppercase leading-none text-pf-black sm:text-5xl">{title}</h1>
          </div>
          <p className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-pf-muted">
            STOCK ROTATES. MISS IT, LOSE IT.
          </p>
        </div>
      </div>

      {/* Active search chip */}
      {filters.q && (
        <div className="mb-4 flex items-center gap-2">
          <span className="flex items-center gap-2 border-2 border-pf-black bg-pf-purple-soft px-3 py-1.5 font-mono-tech text-xs font-bold uppercase tracking-wider text-pf-black">
            SEARCH: “{filters.q}”
            <Link href={basePath} aria-label="Clear search" className="text-pf-black hover:text-pf-black">
              <X className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </span>
        </div>
      )}

      {/* Chrome + grid */}
      <ShopChrome options={options} total={total} sort={filters.sort ?? "newest"} activeCategory={activeCategory}>
        {items.length > 0 ? (
          <>
            <ProductGrid products={items} columns={3} priorityCount={3} />
            {/* Pagination */}
            {pageCount > 1 && (
              <nav aria-label="Pagination" className="flex items-center justify-center gap-2 pt-8">
                {page > 1 && (
                  <Link
                    href={buildHref(basePath, paramKeys, page - 1)}
                    className="border-2 border-pf-black bg-pf-paper px-4 py-2 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-yellow"
                  >
                    ← PREV
                  </Link>
                )}
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildHref(basePath, paramKeys, p)}
                    aria-current={p === page ? "page" : undefined}
                    className={`border-2 border-pf-black px-3.5 py-2 font-mono-tech text-xs font-bold ${
                      p === page ? "bg-pf-black text-pf-yellow" : "bg-pf-paper text-pf-black hover:bg-pf-yellow"
                    }`}
                  >
                    {p}
                  </Link>
                ))}
                {page < pageCount && (
                  <Link
                    href={buildHref(basePath, paramKeys, page + 1)}
                    className="border-2 border-pf-black bg-pf-paper px-4 py-2 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-yellow"
                  >
                    NEXT →
                  </Link>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 border-2 border-dashed border-pf-black/30 px-6 py-16 text-center">
            <SearchX className="h-10 w-10 text-pf-muted" strokeWidth={2} />
            <p className="font-display text-2xl uppercase text-pf-black">Nothing matched</p>
            <p className="max-w-sm text-sm text-pf-muted">
              No products match the current filters. Clear them or try a different search. Stock rotates constantly.
            </p>
            <Link
              href={basePath}
              className="border-2 border-pf-black bg-pf-yellow px-6 py-3 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-transform pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
            >
              Clear all filters
            </Link>
          </div>
        )}
      </ShopChrome>
    </div>
  );
}

// Parse raw searchParams into ShopFilters
export function parseFilters(
  sp: Record<string, string | string[] | undefined>
): ShopFilters {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const multi = (k: string) => {
    const v = one(k);
    return v ? v.split(",").filter(Boolean) : undefined;
  };
  const min = one("min");
  const max = one("max");
  return {
    q: one("q") || undefined,
    brands: multi("brand"),
    sizes: multi("size"),
    colors: multi("color"),
    conditions: multi("cond"),
    minPrice: min ? Number(min) : undefined,
    maxPrice: max ? Number(max) : undefined,
    sort: one("sort") || "newest",
    page: one("page") ? Number(one("page")) : 1,
  };
}
