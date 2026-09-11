"use client";

import React from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, WishlistItem, LocalProfile, SavedAddress } from "./types";

// ---------------- CART ----------------

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
}

function cartKey(productId: string, size: string | null, color: string | null) {
  return `${productId}::${size ?? "-"}::${color ?? "-"}`;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const key = cartKey(item.productId, item.size, item.color);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key
                  ? { ...i, qty: Math.min(i.qty + item.qty, Math.max(1, item.maxStock)) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, key }] };
        }),
      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      setQty: (key, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, qty: Math.max(1, Math.min(qty, Math.max(1, i.maxStock))) } : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "pf-cart", storage: createJSONStorage(() => localStorage) }
  )
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((n, i) => n + i.price * i.qty, 0);
}

// ---------------- WISHLIST ----------------

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.productId === item.productId);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== item.productId) });
        } else {
          set({ items: [item, ...get().items] });
        }
      },
      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: "pf-wishlist", storage: createJSONStorage(() => localStorage) }
  )
);

// ---------------- PROFILE (local only) ----------------

const emptyProfile: LocalProfile = { name: "", email: "", phone: "", addresses: [] };

interface ProfileState {
  profile: LocalProfile;
  setPersonal: (p: Partial<Pick<LocalProfile, "name" | "email" | "phone">>) => void;
  addAddress: (a: SavedAddress) => void;
  updateAddress: (a: SavedAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  clearAll: () => void;
}

export const useProfile = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: emptyProfile,
      setPersonal: (p) =>
        set({ profile: { ...get().profile, ...p } }),
      addAddress: (a) => {
        const addresses = a.isDefault
          ? [...get().profile.addresses.map((x) => ({ ...x, isDefault: false })), a]
          : [...get().profile.addresses, a];
        set({ profile: { ...get().profile, addresses } });
      },
      updateAddress: (a) =>
        set({
          profile: {
            ...get().profile,
            addresses: a.isDefault
              ? get().profile.addresses.map((x) => (x.id === a.id ? a : { ...x, isDefault: false }))
              : get().profile.addresses.map((x) => (x.id === a.id ? a : x)),
          },
        }),
      removeAddress: (id) =>
        set({
          profile: {
            ...get().profile,
            addresses: get().profile.addresses.filter((x) => x.id !== id),
          },
        }),
      setDefaultAddress: (id) =>
        set({
          profile: {
            ...get().profile,
            addresses: get().profile.addresses.map((x) => ({ ...x, isDefault: x.id === id })),
          },
        }),
      clearAll: () => set({ profile: emptyProfile }),
    }),
    { name: "pf-profile", storage: createJSONStorage(() => localStorage) }
  )
);

// Hydration guard for persisted stores (avoid SSR mismatch)
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  return hydrated;
}
