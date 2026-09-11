"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Save, Truck } from "lucide-react";
import { toast } from "sonner";
import type { StoreSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PFButton } from "@/components/pf/button";

const inputClass =
  "h-11 w-full border-2 border-pf-black bg-pf-paper px-3 text-sm text-pf-black outline-none transition-colors placeholder:text-pf-muted/60 focus:bg-white";

export function AdminSettingsForm({ initial }: { initial: StoreSettings }) {
  const router = useRouter();
  const [shippingMode, setShippingMode] = React.useState(initial.shippingMode);
  const [shippingFee, setShippingFee] = React.useState(String(initial.shippingFee));
  const [currency, setCurrency] = React.useState(initial.currency);
  const [storeEmail, setStoreEmail] = React.useState(initial.storeEmail);
  const [saving, setSaving] = React.useState(false);

  async function save() {
    if (shippingMode === "flat" && (Number.isNaN(Number(shippingFee)) || Number(shippingFee) < 0)) {
      toast.error("INVALID SHIPPING FEE");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingMode, shippingFee: Number(shippingFee), currency, storeEmail }),
      });
      if (!res.ok) throw new Error();
      toast.success("SETTINGS SAVED");
      router.refresh();
    } catch {
      toast.error("SAVE FAILED");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-5 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
            STORE CONFIGURATION
          </p>
          <h1 className="font-display text-3xl uppercase leading-none text-pf-black sm:text-4xl">Settings</h1>
        </div>
        <PFButton variant="primary" onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "SAVING…" : "SAVE SETTINGS"}
        </PFButton>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Shipping */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="set-shipping">
          <div className="flex items-center gap-2 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <Truck className="h-4 w-4 text-pf-yellow" strokeWidth={2.5} />
            <h2 id="set-shipping" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              SHIPPING RULES
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5">
            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Shipping mode">
              {[
                { value: "free", title: "FREE SHIPPING", desc: "Current business policy — every order ships free worldwide." },
                { value: "flat", title: "FLAT FEE", desc: "One configured fee applied to every order." },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={shippingMode === opt.value}
                  onClick={() => setShippingMode(opt.value as StoreSettings["shippingMode"])}
                  className={cn(
                    "border-2 border-pf-black p-4 text-left transition-colors",
                    shippingMode === opt.value ? "bg-pf-yellow" : "bg-pf-cream hover:bg-pf-sand"
                  )}
                >
                  <span className="block font-mono-tech text-xs font-bold uppercase tracking-widest">
                    {opt.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-pf-black/70">{opt.desc}</span>
                </button>
              ))}
            </div>

            {shippingMode === "flat" && (
              <label className="block">
                <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                  FLAT SHIPPING FEE
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className={inputClass}
                />
              </label>
            )}
            <p className="text-xs leading-relaxed text-pf-muted">
              Shipping is deliberately a configurable setting — the current policy is free initial
              shipping, with defect-return shipping covered by POSTFORM. Changes here immediately update
              checkout totals and the storefront shipping page.
            </p>
          </div>
        </section>

        {/* Store identity */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="set-store">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="set-store" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              STORE IDENTITY
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5">
            <label className="block">
              <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                CURRENCY SYMBOL
              </span>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                maxLength={3}
                className={cn(inputClass, "w-24 font-mono-tech")}
                placeholder="$"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em]">
                ORDER EMAIL RECIPIENT
              </span>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className={cn(inputClass, "font-mono-tech text-xs")}
                placeholder="postformproducts@haren.uk"
              />
              <span className="mt-1 block text-xs text-pf-muted">
                Generated order emails are prefilled for this address.
              </span>
            </label>
            <div className="border-2 border-pf-black/20 bg-pf-cream p-3 text-xs leading-relaxed text-pf-muted">
              <p className="font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-black">
                ALSO CONFIGURED VIA ENVIRONMENT
              </p>
              <ul className="mt-1.5 space-y-1">
                <li>ADMIN_PASSWORD — admin login password</li>
                <li>ADMIN_SESSION_SECRET — session signing secret</li>
                <li>TURSO_DATABASE_URL / TURSO_AUTH_TOKEN — database</li>
                <li>PAYPAL_CLIENT_ID — payment provider (future)</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
