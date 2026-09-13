"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatPrice, primaryImage, stockState } from "@/lib/format";
import { useWishlist, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ConditionBadge } from "@/components/pf/badges";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const hydrated = useHydrated();
  const wishlist = useWishlist((s) => s.items);
  const toggleWishlist = useWishlist((s) => s.toggle);

  const inWishlist = hydrated && wishlist.some((i) => i.productId === product.id);
  const image = primaryImage(product);
  const state = stockState(product);
  const soldOut = state === "SOLD OUT";

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
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
      toast.success("REMOVED FROM WISHLIST", { description: product.name });
    } else {
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
      toast.success("SAVED TO WISHLIST", { description: product.name });
    }
  }

  return (
    <article className="group relative flex w-full flex-col border-2 border-pf-black bg-pf-paper transition-[box-shadow,transform] duration-200 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0">
      {/* Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden border-b-2 border-pf-black bg-pf-sand"
        aria-label={`${product.brand ?? ""} ${product.name}`.trim()}
      >
        {image ? (
          <Image
            src={image}
            alt={product.images[0]?.alt ?? product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-[1.04]",
              soldOut && "opacity-60 grayscale-[30%]"
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono-tech text-xs uppercase text-pf-muted pf-stripes">
            NO IMAGE
          </div>
        )}

        {/* Sold-out overlay */}
        {soldOut && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-6 border-y-2 border-pf-black bg-pf-black py-1.5 text-center font-mono-tech text-xs font-bold uppercase tracking-[0.3em] text-pf-yellow">
            Sold Out
          </div>
        )}

        {/* Condition badge */}
        <div className="absolute left-2 top-2">
          <ConditionBadge condition={product.condition} />
        </div>

        {/* Wishlist - color lock: yellow accent on active, never purple */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={inWishlist}
          className={cn(
            "absolute right-2 top-2 flex h-11 w-11 items-center justify-center border-2 border-pf-black transition-colors",
            inWishlist ? "bg-pf-black text-pf-yellow" : "bg-pf-paper text-pf-black hover:bg-pf-yellow"
          )}
        >
          <Heart className="h-4 w-4" strokeWidth={2.5} fill={inWishlist ? "currentColor" : "none"} />
        </button>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand && (
          <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-muted">
            {product.brand}
          </span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-bold leading-snug text-pf-black underline-offset-4 hover:underline"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-tech text-base font-bold text-pf-black">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="font-mono-tech text-xs text-pf-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {!soldOut && state !== "IN STOCK" && (
            <span className="font-mono-tech text-[10px] font-bold uppercase tracking-wider text-pf-red border border-pf-red px-1">
              {state}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
