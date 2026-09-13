"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import type { FilterOptions, CategoryDef } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PFButton } from "@/components/pf/button";

function useParamTools() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const get = (key: string): string[] => {
    const raw = params.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  };
  const getOne = (key: string): string => params.get(key) ?? "";

  const update = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("page"); // filters reset pagination
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleMulti = (key: string, value: string) => {
    update((p) => {
      const current = (p.get(key) ?? "").split(",").filter(Boolean);
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (next.length) p.set(key, next.join(","));
      else p.delete(key);
    });
  };

  return { get, getOne, update, toggleMulti, params, pathname };
}

function FilterGroup({
  label,
  count,
  children,
  defaultOpen = true,
}: {
  label: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border-b border-pf-black/15 pb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black"
      >
        <span>
          {label}
          {count !== undefined && count > 0 && (
            <span className="ml-2 inline-flex min-w-5 justify-center border border-pf-black bg-pf-yellow px-1 text-[10px]">
              {count}
            </span>
          )}
        </span>
        <span aria-hidden className="text-pf-black">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && <div className="space-y-2 pt-1">{children}</div>}
    </div>
  );
}

function CheckRow({
  checked,
  label,
  suffix,
  onChange,
}: {
  checked: boolean;
  label: string;
  suffix?: string | number;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-pf-ink hover:text-pf-black">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center border-2 border-pf-black text-[10px] font-bold text-pf-black transition-colors",
          checked ? "bg-pf-yellow" : "bg-pf-paper"
        )}
        aria-hidden
      >
        {checked ? "×" : ""}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex-1">{label}</span>
      {suffix !== undefined && (
        <span className="font-mono-tech text-[10px] text-pf-muted">{suffix}</span>
      )}
    </label>
  );
}

function ChipRow({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "border-2 border-pf-black px-2.5 py-1 font-mono-tech text-[11px] font-bold uppercase tracking-wider transition-colors",
        active ? "bg-pf-black text-pf-yellow" : "bg-pf-paper text-pf-black hover:bg-pf-yellow"
      )}
    >
      {label}
    </button>
  );
}

export function FilterPanel({
  options,
  activeCategory,
}: {
  options: FilterOptions;
  activeCategory?: CategoryDef;
}) {
  const { get, getOne, update, toggleMulti } = useParamTools();
  const router = useRouter();
  const pathname = usePathname();

  const [minInput, setMinInput] = React.useState(getOne("min"));
  const [maxInput, setMaxInput] = React.useState(getOne("max"));

  const selectedBrands = get("brand");
  const selectedSizes = get("size");
  const selectedColors = get("color");
  const selectedConditions = get("cond");

  const activeCount =
    selectedBrands.length +
    selectedSizes.length +
    selectedColors.length +
    selectedConditions.length +
    (getOne("min") ? 1 : 0) +
    (getOne("max") ? 1 : 0);

  function applyPrice() {
    update((p) => {
      if (minInput) p.set("min", minInput);
      else p.delete("min");
      if (maxInput) p.set("max", maxInput);
      else p.delete("max");
    });
  }

  function clearAll() {
    setMinInput("");
    setMaxInput("");
    router.push(pathname, { scroll: false });
  }

  const body = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b-2 border-pf-black px-4 py-3 lg:px-0 lg:pt-0">
        <p className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex justify-center border border-pf-black bg-pf-yellow px-1.5 text-[10px]">
              {activeCount}
            </span>
          )}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-black hover:underline"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 lg:px-0">
        {/* Category - only on /shop (not category pages) */}
        {!activeCategory && (
          <FilterGroup label="Category">
            <div className="flex flex-wrap gap-1.5 pb-2">
              {CATEGORIES.map((c) => {
                const active = pathname === `/shop/${c.slug}`;
                return (
                  <a
                    key={c.slug}
                    href={`/shop/${c.slug}`}
                    className={cn(
                      "border-2 border-pf-black px-2.5 py-1 font-mono-tech text-[11px] font-bold uppercase tracking-wider transition-colors",
                      active ? "bg-pf-black text-pf-yellow" : "bg-pf-paper text-pf-black hover:bg-pf-yellow"
                    )}
                  >
                    {c.short}
                  </a>
                );
              })}
            </div>
          </FilterGroup>
        )}

        {options.brands.length > 0 && (
          <FilterGroup label="Brand" count={selectedBrands.length}>
            {options.brands.map((b) => (
              <CheckRow
                key={b.value}
                checked={selectedBrands.includes(b.value)}
                label={b.value}
                suffix={b.count}
                onChange={() => toggleMulti("brand", b.value)}
              />
            ))}
          </FilterGroup>
        )}

        {options.sizes.length > 0 && (
          <FilterGroup label="Size" count={selectedSizes.length}>
            <div className="flex flex-wrap gap-1.5 pb-2">
              {options.sizes.map((s) => (
                <ChipRow
                  key={s.value}
                  active={selectedSizes.includes(s.value)}
                  label={s.value}
                  onClick={() => toggleMulti("size", s.value)}
                />
              ))}
            </div>
          </FilterGroup>
        )}

        {options.colors.length > 0 && (
          <FilterGroup label="Colour" count={selectedColors.length}>
            <div className="flex flex-wrap gap-1.5 pb-2">
              {options.colors.map((c) => (
                <ChipRow
                  key={c.value}
                  active={selectedColors.includes(c.value)}
                  label={c.value}
                  onClick={() => toggleMulti("color", c.value)}
                />
              ))}
            </div>
          </FilterGroup>
        )}

        {options.conditions.length > 0 && (
          <FilterGroup label="Condition" count={selectedConditions.length}>
            {options.conditions.map((c) => (
              <CheckRow
                key={c.value}
                checked={selectedConditions.includes(c.value)}
                label={c.value}
                suffix={c.count}
                onChange={() => toggleMulti("cond", c.value)}
              />
            ))}
          </FilterGroup>
        )}

        <FilterGroup label="Price">
          <div className="flex items-center gap-2 pb-2">
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="MIN"
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              aria-label="Minimum price"
              className="h-9 w-full border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-xs outline-none placeholder:text-pf-muted"
            />
            <span className="font-mono-tech text-xs text-pf-muted">-</span>
            <input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="MAX"
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              aria-label="Maximum price"
              className="h-9 w-full border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-xs outline-none placeholder:text-pf-muted"
            />
          </div>
          <PFButton size="sm" variant="outline" block onClick={applyPrice}>
            Apply price
          </PFButton>
        </FilterGroup>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block" aria-label="Product filters">
        <div className="sticky top-[136px] border-2 border-pf-black bg-pf-paper">{body}</div>
      </aside>
    </>
  );
}

// Toolbar with mobile filter trigger + sort + result count
export function ShopToolbar({
  total,
  sort,
  onOpenMobileFilters,
}: {
  total: number;
  sort: string;
  onOpenMobileFilters: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setSort(value: string) {
    const next = new URLSearchParams(params.toString());
    next.set("sort", value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-pf-black bg-pf-black px-3 py-2.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileFilters}
          aria-label="Open filters"
          className="flex items-center gap-2 border-2 border-pf-cream/40 px-3 py-2 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-cream transition-colors hover:border-pf-yellow hover:text-pf-yellow lg:hidden"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
        </button>
        <span className="font-mono-tech text-[11px] uppercase tracking-[0.2em] text-pf-cream/70">
          <span className="text-pf-yellow">{total}</span> RESULT{total === 1 ? "" : "S"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="hidden font-mono-tech text-[10px] uppercase tracking-widest text-pf-cream/50 sm:block">
          Sort
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 cursor-pointer border-2 border-pf-cream/40 bg-pf-black px-2 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-pf-cream outline-none hover:border-pf-yellow [&>option]:bg-pf-black [&>option]:text-pf-cream"
        >
          <option value="newest">NEWEST</option>
          <option value="price-asc">PRICE: LOW TO HIGH</option>
          <option value="price-desc">PRICE: HIGH TO LOW</option>
          <option value="az">A-Z</option>
        </select>
      </div>
    </div>
  );
}

// Mobile filter sheet (bottom drawer)
export function MobileFilterSheet({
  open,
  onClose,
  options,
  activeCategory,
}: {
  open: boolean;
  onClose: () => void;
  options: FilterOptions;
  activeCategory?: CategoryDef;
}) {
  return (
    <div className={`fixed inset-0 z-[70] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-pf-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden border-t-2 border-pf-black bg-pf-paper transition-transform duration-200 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ willChange: "transform", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex h-[82vh] max-h-[82vh] flex-col">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-yellow"
          >
            <X className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <FilterPanel options={options} activeCategory={activeCategory} />
          <div className="border-t-2 border-pf-black p-3">
            <PFButton block onClick={onClose}>
              Show results
            </PFButton>
          </div>
        </div>
      </div>
    </div>
  );
}
