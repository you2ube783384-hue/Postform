import type { CSSProperties } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  className,
  columns = 4,
  priorityCount = 4,
}: {
  products: Product[];
  className?: string;
  columns?: 2 | 3 | 4;
  priorityCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 md:gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        columns === 2 && "sm:grid-cols-2",
        className
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}

/**
 * Horizontal scroll-snap rail of product cards. A distinct layout family
 * from ProductGrid: cards flick horizontally with snap points instead of
 * wrapping. Used for "fresh arrivals" breadth browsing.
 */
export function ProductRail({
  products,
  priorityCount = 2,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {products.map((p, i) => (
        <div
          key={p.id}
          className="flex w-[62vw] shrink-0 snap-start sm:w-[280px] lg:w-[300px]"
        >
          <ProductCard product={p} priority={i < priorityCount} />
        </div>
      ))}
    </div>
  );
}

export function SectionHeading({
  title,
  link,
  linkLabel = "VIEW ALL",
  className,
}: {
  title: string;
  link?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4 border-b-2 border-pf-black pb-3", className)}>
      <h2 className="font-display text-2xl uppercase leading-none text-pf-black sm:text-3xl">
        {title}
      </h2>
      {link && (
        <a
          href={link}
          className="hidden shrink-0 border-2 border-pf-black bg-pf-paper px-4 py-2 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-yellow sm:inline-block"
        >
          {linkLabel} →
        </a>
      )}
    </div>
  );
}
