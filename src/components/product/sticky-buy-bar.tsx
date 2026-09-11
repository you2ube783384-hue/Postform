"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatPrice, primaryImage, stockState, availableSizes, availableColors } from "@/lib/format";
import { useCart } from "@/lib/store";

export function StickyBuyBar({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCart((s) => s.addItem);
  const sizes = availableSizes(product);
  const colors = availableColors(product);
  const hasSizes = sizes.length > 0;
  const multiColor = colors.length > 1;
  const [size, setSize] = React.useState<string | null>(null);
  const [color, setColor] = React.useState<string | null>(null);
  const [barVisible, setBarVisible] = React.useState(false);
  const soldOut = stockState(product) === "SOLD OUT";

  React.useEffect(() => {
    const t = window.setTimeout(() => setBarVisible(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  if (!barVisible) return null;

  const selectedStock = product.variants
    .filter(
      (v) =>
        (size === null || v.size === size) &&
        (color === null || v.color === color)
    )
    .reduce((sum, v) => sum + v.stock, 0);

  const ready = !soldOut && (!hasSizes || size !== null) && (!multiColor || color !== null) && selectedStock > 0;
  const image = primaryImage(product);

  function add(buyNow: boolean) {
    if (!ready) {
      toast.error(hasSizes && !size ? "SELECT A SIZE FIRST" : "NOT AVAILABLE", {
        description: hasSizes && !size ? "Pick your size above." : undefined,
      });
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image,
      price: product.price,
      size: hasSizes ? size : null,
      color: multiColor ? color : colors[0]?.color ?? null,
      variantId: null,
      qty: 1,
      maxStock: selectedStock,
    });
    if (buyNow) router.push("/checkout");
    else toast.success("ADDED TO CART", { description: product.name });
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-pf-black bg-pf-cream sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Inline size picker (appears when product has sizes) */}
      {hasSizes && !soldOut && (
        <div className="flex gap-1.5 overflow-x-auto border-b border-pf-black/15 px-3 py-2" style={{ scrollbarWidth: "none" }}>
          {sizes.map((s) => (
            <button
              key={s.size}
              type="button"
              disabled={!s.available}
              onClick={() => setSize(s.size)}
              aria-pressed={size === s.size}
              className={`shrink-0 border-2 border-pf-black px-3 py-1.5 font-mono-tech text-xs font-bold ${
                size === s.size
                  ? "bg-pf-black text-pf-yellow"
                  : s.available
                    ? "bg-pf-paper text-pf-black"
                    : "pf-stripes bg-pf-sand text-pf-muted line-through opacity-60"
              }`}
            >
              {s.size}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 px-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-pf-black">{product.name}</p>
          <p className="font-mono-tech text-base font-bold text-pf-black">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          onClick={() => add(false)}
          disabled={soldOut}
          className="flex h-12 items-center gap-2 border-2 border-pf-black bg-pf-yellow px-4 font-mono-tech text-xs font-bold uppercase tracking-wider text-pf-black disabled:opacity-40"
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
          <span className="hidden xs:inline">Add</span>
        </button>
        <button
          type="button"
          onClick={() => add(true)}
          disabled={soldOut}
          className="flex h-12 items-center gap-2 border-2 border-pf-black bg-pf-black px-4 font-mono-tech text-xs font-bold uppercase tracking-wider text-pf-cream disabled:opacity-40"
        >
          <Zap className="h-4 w-4 text-pf-yellow" strokeWidth={2.5} /> Buy now
        </button>
      </div>
    </div>
  );
}
