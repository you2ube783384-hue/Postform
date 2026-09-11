"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Copy, Check, ArrowLeft, ShieldCheck } from "lucide-react";
import type { StoreSettings, SavedAddress } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart, useProfile, cartSubtotal, useHydrated } from "@/lib/store";
import { buildOrderEmailBody, buildMailtoUrl, formatOrderDate, type OrderData } from "@/lib/order-email";
import { COUNTRIES, ADDRESS_LABELS } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { PFButton } from "@/components/pf/button";

interface FormState {
  name: string;
  email: string;
  phone: string;
  country: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
  note: string;
  saveAddress: boolean;
  addressLabel: string;
}

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  country: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  paymentMethod: "paypal",
  note: "",
  saveAddress: false,
  addressLabel: "Home",
};

function Field({
  label,
  error,
  children,
  hint,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between font-mono-tech text-[10px] font-bold uppercase tracking-[0.2em] text-pf-black">
        <span>
          {label}
          {required && <span className="text-pf-red"> *</span>}
        </span>
        {hint && <span className="font-normal text-pf-muted">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="mt-1 flex items-center gap-1 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-red">
          × {error}
        </span>
      )}
    </label>
  );
}

const inputClass =
  "h-11 w-full border-2 border-pf-black bg-pf-paper px-3 text-sm text-pf-black outline-none transition-colors placeholder:text-pf-muted/60 focus:bg-white";

export function CheckoutView({ settings }: { settings: StoreSettings }) {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);
  const profile = useProfile((s) => s.profile);
  const addAddress = useProfile((s) => s.addAddress);
  const setPersonal = useProfile((s) => s.setPersonal);

  const [form, setForm] = React.useState<FormState>(emptyForm);
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormState, string>>>({});
  const [confirmation, setConfirmation] = React.useState<OrderData | null>(null);
  const [mailtoUrl, setMailtoUrl] = React.useState("");
  const [emailTooLong, setEmailTooLong] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Prefill from local profile
  React.useEffect(() => {
    if (!hydrated) return;
    const def = profile.addresses.find((a) => a.isDefault) ?? profile.addresses[0];
    setForm((f) => ({
      ...f,
      name: f.name || profile.name,
      email: f.email || profile.email,
      phone: f.phone || profile.phone,
      country: def?.country ?? f.country,
      line1: def?.line1 ?? f.line1,
      line2: def?.line2 ?? f.line2,
      city: def?.city ?? f.city,
      state: def?.state ?? f.state,
      postalCode: def?.postalCode ?? f.postalCode,
    }));
  }, [hydrated, profile]);

  const subtotal = cartSubtotal(items);
  const shipping = settings.shippingMode === "flat" ? settings.shippingFee : 0;
  const total = subtotal + shipping;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "REQUIRED";
    if (!form.email.trim()) e.email = "REQUIRED";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "INVALID EMAIL";
    if (!form.phone.trim()) e.phone = "REQUIRED";
    if (!form.country) e.country = "REQUIRED";
    if (!form.line1.trim()) e.line1 = "REQUIRED";
    if (!form.city.trim()) e.city = "REQUIRED";
    if (!form.postalCode.trim()) e.postalCode = "REQUIRED";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("CHECK THE FORM", { description: "Some required fields are missing or invalid." });
      return false;
    }
    return true;
  }

  function applySavedAddress(a: SavedAddress) {
    setForm((f) => ({
      ...f,
      country: a.country,
      line1: a.line1,
      line2: a.line2,
      city: a.city,
      state: a.state ?? "",
      postalCode: a.postalCode,
    }));
    toast.success(`ADDRESS LOADED — ${a.label.toUpperCase()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    const orderId = `POSTFORM-${Math.floor(1000 + Math.random() * 9000)}`;
    const address: SavedAddress = {
      id: `order-${Date.now()}`,
      label: form.addressLabel,
      country: form.country,
      line1: form.line1.trim(),
      line2: form.line2.trim() || null,
      city: form.city.trim(),
      state: form.state.trim() || null,
      postalCode: form.postalCode.trim(),
      isDefault: false,
    };

    const order: OrderData = {
      orderId,
      date: formatOrderDate(),
      customer: {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      address,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod: form.paymentMethod === "paypal" ? "PayPal" : "Visa / Prepaid Card",
      note: form.note,
    };

    // Save to local profile (optional convenience)
    setPersonal({ name: order.customer.name, email: order.customer.email, phone: order.customer.phone });
    if (form.saveAddress) {
      addAddress({ ...address, id: `addr-${Date.now()}`, label: form.addressLabel });
    }

    const body = buildOrderEmailBody(order, settings);
    const email = buildMailtoUrl(body, orderId, settings.storeEmail);

    setConfirmation(order);
    setMailtoUrl(email.mailtoUrl);
    setEmailTooLong(email.tooLong);
    setCopied(false);
    clearCart();

    // Open the default email application with the prefilled order
    // (programmatic anchor — mailto: navigation without mutating window.location)
    const anchor = document.createElement("a");
    anchor.href = email.mailtoUrl;
    anchor.click();

    toast.success(`ORDER ${orderId} PREPARED`, {
      description: "Your email app should have opened — press Send to complete the order request.",
    });
  }

  async function copyOrderDetails() {
    if (!confirmation) return;
    const body = buildOrderEmailBody(confirmation, settings);
    try {
      await navigator.clipboard.writeText(
        `To: ${settings.storeEmail}\nSubject: POSTFORM Order #${confirmation.orderId.split("-")[1]} — New Order\n\n${body}`
      );
      setCopied(true);
      toast.success("ORDER DETAILS COPIED", {
        description: `Paste into an email to ${settings.storeEmail} and send.`,
      });
    } catch {
      toast.error("COPY FAILED", { description: "Your browser blocked clipboard access." });
    }
  }

  // ---------- Loading ----------
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 lg:px-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-72 bg-pf-sand" />
          <div className="h-96 border-2 border-pf-black/10 bg-pf-sand" />
        </div>
      </div>
    );
  }

  // ---------- Confirmation ----------
  if (confirmation) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8">
        <div className="border-2 border-pf-black bg-pf-paper">
          <div className="border-b-2 border-pf-black bg-pf-black px-6 py-8 text-center">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-yellow">
              ORDER PREPARED — AWAITING YOUR SEND
            </p>
            <p className="mt-3 font-display text-4xl uppercase text-pf-cream sm:text-5xl">
              {confirmation.orderId}
            </p>
            <p className="mt-2 font-mono-tech text-xs text-pf-cream/60">{confirmation.date}</p>
          </div>

          <div className="space-y-6 px-6 py-8 sm:px-8">
            <div className="flex gap-4 border-2 border-pf-black bg-pf-yellow-soft/40 p-4">
              <Mail className="h-8 w-8 shrink-0 text-pf-black" strokeWidth={2} />
              <div>
                <p className="text-sm font-bold leading-relaxed text-pf-black">
                  Your order details are ready in your email app. Review them and press{" "}
                  <span className="bg-pf-yellow px-1 font-mono-tech uppercase">Send</span> to complete the
                  order request.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-pf-muted">
                  The email is prefilled for {settings.storeEmail}. POSTFORM has not received anything
                  until you press Send. Nothing has been charged at this point.
                </p>
              </div>
            </div>

            {emailTooLong && (
              <p className="border-2 border-pf-red bg-pf-red/5 p-3 font-mono-tech text-[11px] font-bold uppercase tracking-wider text-pf-red">
                ⚠ This order is large — some email apps may truncate prefilled text. Use “Copy order
                details” below if anything looks cut off.
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <PFButton
                variant="dark"
                size="lg"
                onClick={() => {
                  const anchor = document.createElement("a");
                  anchor.href = mailtoUrl;
                  anchor.click();
                }}
              >
                <Mail className="h-5 w-5" /> Open email app again
              </PFButton>
              <PFButton variant="outline" size="lg" onClick={copyOrderDetails}>
                {copied ? <Check className="h-5 w-5 text-pf-purple" /> : <Copy className="h-5 w-5" />}
                {copied ? "Copied to clipboard" : "Copy order details"}
              </PFButton>
            </div>

            <div className="border-2 border-pf-black bg-pf-paper p-4">
              <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-muted">
                ORDER RECAP
              </p>
              <ul className="mt-3 space-y-2">
                {confirmation.items.map((item) => (
                  <li key={item.key} className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-pf-ink">
                      {item.qty}× {item.name}
                      {item.size ? ` — ${item.size}` : ""}
                    </span>
                    <span className="font-mono-tech font-bold">
                      {formatPrice(item.price * item.qty, settings.currency)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 border-t-2 border-pf-black pt-3 font-mono-tech">
                <div className="flex justify-between text-sm">
                  <span className="text-pf-muted">SHIPPING</span>
                  <span className="font-bold">
                    {confirmation.shipping === 0 ? "FREE" : formatPrice(confirmation.shipping, settings.currency)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-base font-bold">
                  <span>TOTAL — {confirmation.paymentMethod.toUpperCase()}</span>
                  <span>{formatPrice(confirmation.total, settings.currency)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="flex h-12 flex-1 items-center justify-center gap-2 border-2 border-pf-black bg-pf-paper font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-sand"
              >
                <ArrowLeft className="h-4 w-4" /> Back to the shop
              </Link>
              <Link
                href="/"
                className="flex h-12 flex-1 items-center justify-center border-2 border-pf-black bg-pf-yellow font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-transform pf-press hover:-translate-x-[2px] hover:-translate-y-[2px]"
              >
                HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Empty cart ----------
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 lg:px-12">
        <h1 className="font-display text-4xl uppercase text-pf-black">Checkout</h1>
        <div className="mt-10 flex flex-col items-center gap-5 border-2 border-dashed border-pf-black/30 px-6 py-20 text-center">
          <p className="font-display text-2xl uppercase text-pf-black">Nothing to check out</p>
          <p className="max-w-sm text-sm text-pf-muted">
            Your cart is empty. Add something from the rack first — then come back.
          </p>
          <Link
            href="/shop"
            className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black"
          >
            Shop the catalogue
          </Link>
        </div>
      </div>
    );
  }

  // ---------- Checkout form ----------
  const saved = profile.addresses ?? [];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b-2 border-pf-black pb-4">
        <div>
          <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
            GUEST CHECKOUT — NO ACCOUNT NEEDED
          </p>
          <h1 className="font-display text-4xl uppercase leading-none text-pf-black sm:text-5xl">Checkout</h1>
        </div>
        <Link
          href="/cart"
          className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-pf-purple underline-offset-4 hover:underline"
        >
          ← BACK TO CART
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* 01 CUSTOMER */}
          <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="sec-customer">
            <div className="flex items-center justify-between border-b-2 border-pf-black px-5 py-3">
              <h2 id="sec-customer" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
                <span className="mr-2 text-pf-purple">01</span> CUSTOMER
              </h2>
              <span className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
                ALL FIELDS REQUIRED
              </span>
            </div>
            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <Field label="FULL NAME" required error={errors.name}>
                <input
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass}
                  placeholder="JANE DOE"
                />
              </Field>
              <Field label="PHONE" required error={errors.phone}>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+44 7700 900000"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="EMAIL" required error={errors.email}>
                  <input
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass}
                    placeholder="YOU@EXAMPLE.COM"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* 02 DELIVERY ADDRESS */}
          <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="sec-address">
            <div className="flex items-center justify-between border-b-2 border-pf-black px-5 py-3">
              <h2 id="sec-address" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
                <span className="mr-2 text-pf-purple">02</span> DELIVERY ADDRESS
              </h2>
              <span className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
                INTERNATIONAL — WORLDWIDE
              </span>
            </div>

            {saved.length > 0 && (
              <div className="flex flex-wrap gap-2 border-b border-pf-black/15 px-5 py-3">
                <span className="w-full font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-muted">
                  SAVED ADDRESSES (THIS DEVICE)
                </span>
                {saved.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => applySavedAddress(a)}
                    className="border-2 border-pf-black bg-pf-cream px-3 py-1.5 font-mono-tech text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-pf-yellow"
                  >
                    {a.label}: {a.city}, {a.country}
                  </button>
                ))}
              </div>
            )}

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="COUNTRY" required error={errors.country}>
                  <select
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className={cn(inputClass, "cursor-pointer")}
                  >
                    <option value="">— SELECT COUNTRY —</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="ADDRESS LINE 1" required error={errors.line1}>
                  <input
                    type="text"
                    autoComplete="address-line1"
                    value={form.line1}
                    onChange={(e) => set("line1", e.target.value)}
                    className={inputClass}
                    placeholder="STREET AND NUMBER"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="ADDRESS LINE 2" hint="OPTIONAL">
                  <input
                    type="text"
                    autoComplete="address-line2"
                    value={form.line2}
                    onChange={(e) => set("line2", e.target.value)}
                    className={inputClass}
                    placeholder="APARTMENT, SUITE, UNIT…"
                  />
                </Field>
              </div>
              <Field label="CITY" required error={errors.city}>
                <input
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={inputClass}
                  placeholder="CITY"
                />
              </Field>
              <Field label="STATE / REGION / PROVINCE" hint="OPTIONAL">
                <input
                  type="text"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={inputClass}
                  placeholder="REGION"
                />
              </Field>
              <Field label="POSTAL / ZIP CODE" required error={errors.postalCode}>
                <input
                  type="text"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={(e) => set("postalCode", e.target.value)}
                  className={inputClass}
                  placeholder="POSTCODE"
                />
              </Field>

              {/* Save address */}
              <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-pf-ink">
                  <input
                    type="checkbox"
                    checked={form.saveAddress}
                    onChange={(e) => set("saveAddress", e.target.checked)}
                    className="h-4 w-4 accent-[#6c4cf1]"
                  />
                  Save this address to this device (profile)
                </label>
                {form.saveAddress && (
                  <select
                    value={form.addressLabel}
                    onChange={(e) => set("addressLabel", e.target.value)}
                    aria-label="Address label"
                    className="h-8 cursor-pointer border-2 border-pf-black bg-pf-paper px-2 font-mono-tech text-[11px] font-bold uppercase"
                  >
                    {ADDRESS_LABELS.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </section>

          {/* 03 PAYMENT */}
          <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="sec-payment">
            <div className="flex items-center justify-between border-b-2 border-pf-black px-5 py-3">
              <h2 id="sec-payment" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
                <span className="mr-2 text-pf-purple">03</span> PAYMENT METHOD
              </h2>
              <span className="flex items-center gap-1 font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">
                <ShieldCheck className="h-3.5 w-3.5" /> SECURE PROVIDER
              </span>
            </div>
            <div className="space-y-3 px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                {[
                  {
                    value: "paypal",
                    title: "PayPal",
                    desc: "Pay with your PayPal balance or linked account.",
                  },
                  {
                    value: "card",
                    title: "Visa / Prepaid Card",
                    desc: "Card payment via our secure payment provider.",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 border-2 p-4 transition-colors",
                      form.paymentMethod === opt.value
                        ? "border-pf-black bg-pf-yellow-soft/50"
                        : "border-pf-black/30 bg-pf-cream hover:border-pf-black"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={() => set("paymentMethod", opt.value)}
                      className="mt-1 h-4 w-4 accent-[#141310]"
                    />
                    <span>
                      <span className="block text-sm font-bold text-pf-black">{opt.title}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-pf-muted">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="border-2 border-pf-black/20 bg-pf-cream p-3 text-xs leading-relaxed text-pf-muted">
                POSTFORM never sees or stores your card details. Your selected method is included with
                the order request; a secure PayPal / card payment request follows once your order is
                reviewed.{" "}
                <Link href="/refund" className="text-pf-purple underline underline-offset-2">
                  Refund policy
                </Link>
              </p>
            </div>
          </section>

          {/* 04 NOTE */}
          <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="sec-note">
            <div className="border-b-2 border-pf-black px-5 py-3">
              <h2 id="sec-note" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em]">
                <span className="mr-2 text-pf-purple">04</span> CUSTOMER NOTE
                <span className="ml-2 font-normal text-pf-muted">— OPTIONAL</span>
              </h2>
            </div>
            <div className="px-5 py-5">
              <textarea
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Special delivery notes, size questions, anything we should know…"
                aria-label="Customer note"
                className="w-full border-2 border-pf-black bg-pf-paper p-3 text-sm outline-none placeholder:text-pf-muted/60 focus:bg-white"
              />
              <p className="mt-1 text-right font-mono-tech text-[10px] text-pf-muted">{form.note.length}/500</p>
            </div>
          </section>
        </div>

        {/* ORDER SUMMARY — always visible */}
        <aside className="lg:sticky lg:top-[136px] lg:self-start" aria-label="Order summary">
          <div className="border-2 border-pf-black bg-pf-black text-pf-cream">
            <div className="border-b-2 border-pf-cream/20 px-5 py-4">
              <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-yellow">
                YOUR ORDER — {items.length} ITEM{items.length === 1 ? "" : "S"}
              </p>
            </div>
            <ul className="max-h-72 divide-y divide-pf-cream/10 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-pf-cream/30 bg-pf-ink">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-pf-cream">{item.name}</p>
                    <p className="font-mono-tech text-[10px] uppercase tracking-wider text-pf-cream/50">
                      {item.size ? `SZ ${item.size}` : ""}
                      {item.size && item.color ? " / " : ""}
                      {item.color ?? ""} — ×{item.qty}
                    </p>
                  </div>
                  <p className="font-mono-tech text-xs font-bold text-pf-yellow">
                    {formatPrice(item.price * item.qty, settings.currency)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t-2 border-pf-cream/20 px-5 py-4 font-mono-tech text-sm">
              <div className="flex justify-between">
                <span className="text-pf-cream/70">SUBTOTAL</span>
                <span className="font-bold">{formatPrice(subtotal, settings.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-pf-cream/70">SHIPPING</span>
                <span className="font-bold text-pf-yellow">
                  {shipping === 0 ? "FREE — WORLDWIDE" : formatPrice(shipping, settings.currency)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-pf-cream/20 pt-3">
                <span className="uppercase tracking-widest">TOTAL</span>
                <span className="text-xl font-bold text-pf-yellow">
                  {formatPrice(total, settings.currency)}
                </span>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <PFButton
                type="submit"
                variant="primary"
                size="lg"
                block
                className="h-14 text-sm"
                style={{ boxShadow: "4px 4px 0 0 #fbf8f1" }}
              >
                <Mail className="h-5 w-5" strokeWidth={2.5} /> Generate order email
              </PFButton>
              <p className="text-center font-mono-tech text-[10px] leading-relaxed uppercase tracking-widest text-pf-cream/50">
                OPENS YOUR EMAIL APP WITH EVERYTHING PREFILLED — YOU PRESS SEND
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
