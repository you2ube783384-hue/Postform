"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { StoreSettings } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useWishlist, useCart, useHydrated } from "@/lib/store";

export function WishlistView({ settings }: { settings: StoreSettings }) {
  const hydrated = useHydrated();
  const items = useWishlist((s) => s.items);
  const remove = useWishlist((s) => s.remove);
  const clear = useWishlist((s) => s.clear);
  const addItem = useCart((s) => s.addItem);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 lg:px-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 bg-pf-sand" />
          <div className="h-40 border-2 border-pf-black/10 bg-pf-sand" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
            SAVED ON THIS DEVICE / NOT AN ACCOUNT
          </p>
          <h1 className="font-display text-4xl uppercase leading-none text-pf-black sm:text-5xl">
            Wishlist{" "}
            {items.length > 0 && (
              <span className="font-mono-tech text-lg align-middle text-pf-muted">({items.length})</span>
            )}
          </h1>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clear();
              toast.success("WISHLIST CLEARED");
            }}
            className="flex items-center gap-2 font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-muted transition-colors hover:text-pf-red"
          >
            <Trash2 className="h-4 w-4" /> CLEAR ALL
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-5 border-2 border-dashed border-pf-black/30 px-6 py-20 text-center">
          <Heart className="h-12 w-12 text-pf-muted" strokeWidth={1.5} />
          <p className="font-display text-3xl uppercase text-pf-black">Nothing saved yet</p>
          <p className="max-w-sm text-sm text-pf-muted">
            Tap the heart on any product to keep an eye on it. Your wishlist lives in this browser only,
            no account, no tracking.
          </p>
          <Link
            href="/shop"
            className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
          >
            Shop the catalogue
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {items.map((item) => (
            <li
              key={item.productId}
              className="group flex flex-col border-2 border-pf-black bg-pf-paper transition-shadow hover:pf-hard-shadow-sm"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative block aspect-[4/5] overflow-hidden border-b-2 border-pf-black bg-pf-sand"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center font-mono-tech text-xs uppercase text-pf-muted">
                    NO IMAGE
                  </span>
                )}
                <span className="absolute left-2 top-2 border border-pf-black bg-pf-yellow px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-black">
                  {item.condition}
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-1.5 p-3">
                {item.brand && (
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-muted">
                    {item.brand}
                  </span>
                )}
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-bold text-pf-black underline-offset-4 hover:underline"
                >
                  {item.name}
                </Link>
                <span className="font-mono-tech text-base font-bold text-pf-black">
                  {formatPrice(item.price, settings.currency)}
                </span>

                <div className="mt-auto flex gap-2 pt-3">
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex h-9 flex-1 items-center justify-center gap-1.5 border-2 border-pf-black bg-pf-yellow font-mono-tech text-[11px] font-bold uppercase tracking-wider text-pf-black transition-transform pf-press hover:-translate-x-[1px] hover:-translate-y-[1px]"
                  >
                    View <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      remove(item.productId);
                      toast.success("REMOVED FROM WISHLIST", { description: item.name });
                    }}
                    aria-label={`Remove ${item.name} from wishlist`}
                    className="flex h-9 w-9 items-center justify-center border-2 border-pf-black bg-pf-paper transition-colors hover:bg-pf-red hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                </div>
                <p className="font-mono-tech text-[9px] uppercase tracking-widest text-pf-muted">
                  SAVED {new Date(item.addedAt).toLocaleDateString("en-GB").toUpperCase()} / AVAILABILITY
                  CHECKED ON VIEW
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
