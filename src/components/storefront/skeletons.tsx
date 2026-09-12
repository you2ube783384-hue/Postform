import React from "react";

/**
 * POSTFORM-style skeleton states (spec §30): lightweight, brutalist,
 * no flashy loaders — simple pulse blocks on the sand/paper palette.
 */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border-2 border-pf-black/15 bg-pf-paper" aria-hidden="true">
      <div className="aspect-[4/5] animate-pulse border-b-2 border-pf-black/15 bg-pf-sand" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="h-2.5 w-16 animate-pulse bg-pf-sand" />
        <div className="h-3.5 w-full animate-pulse bg-pf-sand" />
        <div className="h-3.5 w-2/3 animate-pulse bg-pf-sand" />
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="h-4 w-20 animate-pulse bg-pf-sand" />
          <div className="h-3 w-12 animate-pulse bg-pf-sand" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ShopPageSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12">
      <div className="border-b-2 border-pf-black/15 pb-4">
        <div className="h-2.5 w-24 animate-pulse bg-pf-sand" />
        <div className="mt-2 h-10 w-56 animate-pulse bg-pf-sand" />
      </div>
      <div className="mt-6 h-11 animate-pulse border-2 border-pf-black/15 bg-pf-sand" />
      <div className="mt-6">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}

export function ProductPageSkeleton() {
  return (
    <div
      className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div className="aspect-[4/5] animate-pulse border-2 border-pf-black/15 bg-pf-sand" />
        {/* Info column */}
        <div className="flex flex-col gap-4">
          <div className="h-2.5 w-20 animate-pulse bg-pf-sand" />
          <div className="h-9 w-3/4 animate-pulse bg-pf-sand" />
          <div className="h-6 w-28 animate-pulse bg-pf-sand" />
          <div className="h-4 w-40 animate-pulse bg-pf-sand" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full animate-pulse bg-pf-sand" />
            <div className="h-3 w-11/12 animate-pulse bg-pf-sand" />
            <div className="h-3 w-4/5 animate-pulse bg-pf-sand" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-11 w-14 animate-pulse bg-pf-sand" />
            <div className="h-11 w-14 animate-pulse bg-pf-sand" />
            <div className="h-11 w-14 animate-pulse bg-pf-sand" />
          </div>
          <div className="mt-6 h-14 w-full animate-pulse bg-pf-sand" />
        </div>
      </div>
    </div>
  );
}
