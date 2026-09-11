"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heart, Share2, ShoppingBag, Zap, Truck, Undo2, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatPrice, primaryImage, totalStock, availableSizes, availableColors, stockState } from "@/lib/format";
import { useCart, useWishlist, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";
import { PFButton } from "@/components/pf/button";
import { ConditionBadge, StockBadge } from "@/components/pf/badges";

export function PurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const addItem = useCart((s) => s.addItem);
  const wishlistItems = useWishlist((s) => s.items);
  const toggleWishlist = useWishlist((s) => s.toggle);

  const sizes = availableSizes(product);
  const colors = availableColors(product);
  const hasSizes = sizes.length > 0;
  const multiColor = colors.length > 1;

  const [size, setSize] = React.useState<string | null>(hasSizes ? null : null);
  const [color, setColor] = React.useState<string | null>(multiColor ? null : (colors[0]?.color ?? null));
  const [qty, setQty] = React.useState(1);
  const [chartOpen, setChartOpen] = React.useState(false);

  const state = stockState(product);
  const soldOut = state === "SOLD OUT";

  // Variant-level stock for the current selection
  const selectedStock = React.useMemo(() => {
    if (!hasSizes && !multiColor) return totalStock(product);
    if (hasSizes && !size) return 0;
    return product.variants
      .filter(
        (v) =>
          (size === null || v.size === size) &&
          (color === null || v.color === color)
      )
      .reduce((sum, v) => sum + v.stock, 0);
  }, [product, size, color, hasSizes, multiColor]);

  const needsSize = hasSizes && !size;
  const canPurchase = !soldOut && !needsSize && selectedStock > 0;
  const image = primaryImage(product);
  const inWishlist = hydrated && wishlistItems.some((i) => i.productId === product.id);

  function doAddToCart(): boolean {
    if (!canPurchase) {
      if (needsSize) toast.error("SELECT A SIZE", { description: "Choose an available size first." });
      else if (soldOut) toast.error("SOLD OUT", { description: "This piece is no longer available." });
      else toast.error("OUT OF STOCK", { description: "This variant has no stock left." });
      return false;
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
      variantId: product.variants.find(
        (v) =>
          (size === null || v.size === size) &&
          (color === null || v.color === color)
      )?.id ?? null,
      qty: Math.min(qty, selectedStock),
      maxStock: selectedStock,
    });
    toast.success("ADDED TO CART", {
      description: `${product.name}${hasSizes ? ` — ${size}` : ""} × ${Math.min(qty, selectedStock)}`,
    });
    return true;
  }

  function handleBuyNow() {
    if (doAddToCart()) router.push("/checkout");
  }

  async function handleShare() {
    const url = window.location.href;
    const title = `${product.brand ?? "POSTFORM"} — ${product.name}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("LINK COPIED", { description: "Share it anywhere." });
    }
  }

  function handleWishlist() {
    toggleWishlist({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image,
      price: product.price,
      condition: product.condition,
      addedAt: new Date().toISOString(),
    });
    toast.success(inWishlist ? "REMOVED FROM WISHLIST" : "SAVED TO WISHLIST", {
      description: product.name,
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Price + stock */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono-tech text-3xl font-bold text-pf-black">
          {formatPrice(product.price)}
        </span>
        {product.originalPrice && (
          <span className="font-mono-tech text-base text-pf-muted line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
        {product.originalPrice && (
          <span className="border border-pf-red px-1.5 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-red">
            −{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <StockBadge state={state} />
        <ConditionBadge condition={product.condition} />
        {canPurchase && selectedStock <= 2 && (
          <span className="font-mono-tech text-[11px] font-bold uppercase tracking-wider text-pf-red">
            Only {selectedStock} left
          </span>
        )}
      </div>

      {/* Size selector */}
      {hasSizes && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black">
              Size {size && <span className="text-pf-purple">— {size}</span>}
            </p>
            {product.sizeChart && (
              <button
                type="button"
                onClick={() => setChartOpen(!chartOpen)}
                aria-expanded={chartOpen}
                className="flex items-center gap-1 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-purple hover:underline"
              >
                <FileText className="h-3 w-3" /> Size chart
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
            {sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                role="radio"
                aria-checked={size === s.size}
                disabled={!s.available}
                onClick={() => setSize(s.size)}
                className={cn(
                  "min-w-12 border-2 border-pf-black px-3 py-2 font-mono-tech text-sm font-bold transition-colors",
                  size === s.size
                    ? "bg-pf-black text-pf-yellow"
                    : s.available
                      ? "bg-pf-paper text-pf-black hover:bg-pf-yellow"
                      : "cursor-not-allowed pf-stripes bg-pf-sand text-pf-muted line-through"
                )}
              >
                {s.size}
              </button>
            ))}
          </div>
          {chartOpen && product.sizeChart && (
            <pre className="mt-3 overflow-x-auto border-2 border-pf-black bg-pf-paper p-3 font-mono-tech text-[11px] leading-relaxed text-pf-ink">
              {product.sizeChart}
            </pre>
          )}
        </div>
      )}

      {/* Colour selector — only when more than one colour exists */}
      {multiColor && (
        <div>
          <p className="mb-2 font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black">
            Colour {color && <span className="text-pf-purple">— {color}</span>}
          </p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select colour">
            {colors.map((c) => (
              <button
                key={c.color}
                type="button"
                role="radio"
                aria-checked={color === c.color}
                disabled={!c.available}
                onClick={() => setColor(c.color)}
                className={cn(
                  "border-2 border-pf-black px-3 py-2 font-mono-tech text-sm font-bold transition-colors",
                  color === c.color
                    ? "bg-pf-black text-pf-yellow"
                    : c.available
                      ? "bg-pf-paper text-pf-black hover:bg-pf-yellow"
                      : "cursor-not-allowed pf-stripes bg-pf-sand text-pf-muted line-through"
                )}
              >
                {c.color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="mb-2 font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black">Quantity</p>
        <div className="inline-flex items-stretch border-2 border-pf-black">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
            className="w-11 border-r-2 border-pf-black bg-pf-paper font-mono-tech text-lg font-bold transition-colors hover:bg-pf-yellow disabled:opacity-30"
          >
            −
          </button>
          <span className="flex w-14 items-center justify-center font-mono-tech text-base font-bold" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(selectedStock || 1, q + 1))}
            disabled={!canPurchase || qty >= selectedStock}
            aria-label="Increase quantity"
            className="w-11 border-l-2 border-pf-black bg-pf-paper font-mono-tech text-lg font-bold transition-colors hover:bg-pf-yellow disabled:opacity-30"
          >
            +
          </button>
        </div>
        {canPurchase && selectedStock > 0 && (
          <span className="ml-3 font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
            {selectedStock} available
          </span>
        )}
      </div>

      {/* Primary actions — desktop/tablet */}
      <div className="hidden flex-col gap-3 sm:flex">
        <div className="grid grid-cols-2 gap-3">
          <PFButton size="lg" variant="primary" onClick={doAddToCart} disabled={soldOut} className="h-14">
            <ShoppingBag className="h-5 w-5" strokeWidth={2.5} /> Add to cart
          </PFButton>
          <PFButton size="lg" variant="dark" onClick={handleBuyNow} disabled={soldOut} className="h-14">
            <Zap className="h-5 w-5" strokeWidth={2.5} /> Buy now
          </PFButton>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PFButton size="md" variant="outline" onClick={handleWishlist}>
            <Heart className="h-4 w-4" fill={inWishlist ? "currentColor" : "none"} /> {inWishlist ? "Saved" : "Wishlist"}
          </PFButton>
          <PFButton size="md" variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4" /> Share
          </PFButton>
        </div>
      </div>

      {/* Delivery info */}
      <div className="divide-y-2 border-2 border-pf-black bg-pf-paper">
        <div className="flex items-center gap-3 px-4 py-3">
          <Truck className="h-5 w-5 shrink-0 text-pf-purple" strokeWidth={2} />
          <div>
            <p className="text-sm font-bold text-pf-black">Free international shipping</p>
            <p className="text-xs text-pf-muted">Worldwide delivery on every order — no minimum.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <Undo2 className="h-5 w-5 shrink-0 text-pf-purple" strokeWidth={2} />
          <div>
            <p className="text-sm font-bold text-pf-black">Defect returns accepted</p>
            <p className="text-xs text-pf-muted">
              Unboxing video required.{" "}
              <a href="/refund" className="text-pf-purple underline underline-offset-2">
                Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
