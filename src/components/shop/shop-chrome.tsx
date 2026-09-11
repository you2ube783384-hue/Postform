"use client";

import React from "react";
import type { FilterOptions, CategoryDef } from "@/lib/types";
import { FilterPanel, ShopToolbar, MobileFilterSheet } from "./filter-panel";

export function ShopChrome({
  options,
  total,
  sort,
  activeCategory,
  children,
}: {
  options: FilterOptions;
  total: number;
  sort: string;
  activeCategory?: CategoryDef;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex gap-6">
      {/* Desktop sidebar */}
      <FilterPanel options={options} activeCategory={activeCategory} />

      {/* Main column */}
      <div className="min-w-0 flex-1 space-y-4">
        <ShopToolbar total={total} sort={sort} onOpenMobileFilters={() => setMobileOpen(true)} />
        {children}
      </div>

      {/* Mobile bottom sheet */}
      <MobileFilterSheet
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        options={options}
        activeCategory={activeCategory}
      />
    </div>
  );
}
