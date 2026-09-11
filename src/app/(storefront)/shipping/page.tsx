import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Globe2, Package, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shipping",
  description:
    "POSTFORM shipping information — free worldwide delivery on every order. International coverage, no minimum spend.",
};

export default async function ShippingPage() {
  const settings = await getSettings();
  const freeShipping = settings.shippingMode === "free";

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "SHIPPING" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
          DELIVERY — WORLDWIDE
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Shipping
          <span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      {/* Current policy banner */}
      <div className={`mt-8 border-2 border-pf-black p-6 ${freeShipping ? "bg-pf-yellow" : "bg-pf-paper"}`}>
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-black/60">
          CURRENT POLICY
        </p>
        <p className="mt-2 font-display text-3xl uppercase leading-none text-pf-black sm:text-4xl">
          {freeShipping
            ? "Free international shipping"
            : `Flat ${settings.currency}${settings.shippingFee} worldwide shipping`}
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-pf-black/80">
          {freeShipping
            ? "Every order ships free, everywhere we deliver. No minimum spend, no hidden checkout fees."
            : "A flat shipping fee applies to every order, everywhere we deliver."}
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: Globe2,
              title: "International Coverage",
              body: "We deliver worldwide from our stock location. If a courier can reach you, we can ship to you — country and full address details are collected at checkout.",
            },
            {
              icon: Package,
              title: "How It's Packed",
              body: "Pieces ship in protective packaging suited to the item — apparel folded and sleeved, footwear and accessories boxed. Everything is inspected again before dispatch.",
            },
            {
              icon: Truck,
              title: "Tracking",
              body: "Once your order is confirmed and dispatched, tracking details are sent to the email address you provided at checkout.",
            },
            {
              icon: Clock,
              title: "Dispatch Timing",
              body: "Orders are reviewed and dispatched in the order they arrive. You'll hear from us by email if anything about your order needs clarifying.",
            },
          ].map((card) => (
            <div key={card.title} className="border-2 border-pf-black bg-pf-paper p-5">
              <card.icon className="h-6 w-6 text-pf-purple" strokeWidth={2} />
              <h2 className="mt-3 font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-pf-black">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-pf-muted">{card.body}</p>
            </div>
          ))}
        </div>

        <div className="border-2 border-pf-black bg-pf-paper p-5">
          <h2 className="font-mono-tech text-xs font-bold uppercase tracking-[0.2em] text-pf-black">
            Note on shipping rules
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-pf-muted">
            Shipping policy is a configurable store setting — the current free-shipping arrangement
            reflects business policy as it stands today. If the rules change, this page and checkout
            totals update from the store&apos;s admin settings, with no price surprises at the door.{" "}
            <Link href="/refund" className="text-pf-purple underline underline-offset-2">
              See return & refund policy
            </Link>{" "}
            for the defect-return shipping commitment.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
          >
            Shop the catalogue
          </Link>
          <Link
            href="/refund"
            className="border-2 border-pf-black bg-pf-paper px-6 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-sand"
          >
            Return & refund
          </Link>
        </div>
      </div>
    </div>
  );
}
