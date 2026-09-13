"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { StoreSettings } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart, cartSubtotal, useHydrated } from "@/lib/store";
import { PFButton } from "@/components/pf/button";

export function CartView({ settings }: { settings: StoreSettings }) {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);

  const subtotal = cartSubtotal(items);
  const shipping = settings.shippingMode === "flat" ? settings.shippingFee : 0;
  const total = subtotal + shipping;

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
            YOUR SELECTION
          </p>
          <h1 className="font-display text-4xl uppercase leading-none text-pf-black sm:text-5xl">
            The Cart{" "}
            {items.length > 0 && (
              <span className="font-mono-tech text-lg align-middle text-pf-muted">
                ({items.length})
              </span>
            )}
          </h1>
        </div>
        <Link
          href="/shop"
          className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-black underline-offset-4 hover:underline"
        >
          ← CONTINUE SHOPPING
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-5 border-2 border-dashed border-pf-black/30 px-6 py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-pf-muted" strokeWidth={1.5} />
          <p className="font-display text-3xl uppercase text-pf-black">Your cart is empty</p>
          <p className="max-w-sm text-sm text-pf-muted">
            Nothing selected yet. The rack is rotating. Go find something worth wearing.
          </p>
          <Link
            href="/shop"
            className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
          >
            Shop the catalogue
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <ul className="divide-y-2 border-2 border-pf-black bg-pf-paper">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 p-4">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative block h-28 w-24 shrink-0 overflow-hidden border-2 border-pf-black bg-pf-sand sm:h-32 sm:w-28"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center font-mono-tech text-[9px] uppercase text-pf-muted">
                      NO IMG
                    </span>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {item.brand && (
                        <p className="font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-muted">
                          {item.brand}
                        </p>
                      )}
                      <Link
                        href={`/product/${item.slug}`}
                        className="text-sm font-bold text-pf-black underline-offset-4 hover:underline sm:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 font-mono-tech text-[11px] uppercase tracking-wider text-pf-muted">
                        {item.size ? `SIZE ${item.size}` : ""}
                        {item.size && item.color ? " / " : ""}
                        {item.color ?? ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeItem(item.key);
                        toast.success("REMOVED", { description: item.name });
                      }}
                      aria-label={`Remove ${item.name} from cart`}
                      className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-pf-black bg-pf-paper text-pf-black transition-colors hover:bg-pf-red hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                    <div className="flex items-stretch border-2 border-pf-black">
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                        className="w-11 border-r-2 border-pf-black bg-pf-paper font-mono-tech font-bold transition-colors hover:bg-pf-yellow disabled:opacity-30"
                      >
                        <Minus className="mx-auto h-3.5 w-3.5" strokeWidth={3} />
                      </button>
                      <span className="flex w-10 items-center justify-center font-mono-tech text-sm font-bold">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        disabled={item.qty >= item.maxStock}
                        aria-label="Increase quantity"
                        className="w-11 border-l-2 border-pf-black bg-pf-paper font-mono-tech font-bold transition-colors hover:bg-pf-yellow disabled:opacity-30"
                      >
                        <Plus className="mx-auto h-3.5 w-3.5" strokeWidth={3} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
                        {formatPrice(item.price, settings.currency)} EACH
                      </p>
                      <p className="font-mono-tech text-base font-bold text-pf-black">
                        {formatPrice(item.price * item.qty, settings.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <aside className="lg:sticky lg:top-[136px] lg:self-start" aria-label="Order summary">
            <div className="border-2 border-pf-black bg-pf-black text-pf-cream">
              <div className="border-b-2 border-pf-cream/20 px-5 py-4">
                <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-yellow">
                  ORDER SUMMARY
                </p>
              </div>
              <div className="space-y-3 px-5 py-5 font-mono-tech text-sm">
                <div className="flex justify-between">
                  <span className="text-pf-cream/70">SUBTOTAL</span>
                  <span className="font-bold">{formatPrice(subtotal, settings.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pf-cream/70">SHIPPING</span>
                  <span className="font-bold text-pf-yellow">
                    {shipping === 0 ? "FREE WORLDWIDE" : formatPrice(shipping, settings.currency)}
                  </span>
                </div>
                <div className="border-t-2 border-pf-cream/20 pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="uppercase tracking-widest">TOTAL</span>
                    <span className="text-xl font-bold text-pf-yellow">
                      {formatPrice(total, settings.currency)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Link
                  href="/checkout"
                  className="flex h-14 w-full items-center justify-center gap-2 border-2 border-pf-black bg-pf-yellow font-mono-tech text-sm font-bold uppercase tracking-wider text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
                  style={{ boxShadow: "4px 4px 0 0 #ffd02e" }}
                >
                  Proceed to checkout <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                </Link>
                <p className="mt-3 text-center font-mono-tech text-[10px] uppercase tracking-widest text-pf-cream/50">
                  NO ACCOUNT NEEDED / GUEST CHECKOUT
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
