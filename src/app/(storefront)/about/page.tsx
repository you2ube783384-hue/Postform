import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = {
  title: "About",
  description:
    "POSTFORM is an international curated-stock fashion store — streetwear, sneakers and accessories sourced, graded and resold worldwide.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "ABOUT" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
          THE OPERATION
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          About
          <br />
          Postform<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 grid gap-10 sm:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5 text-sm leading-relaxed text-pf-ink sm:text-base">
          <p>
            POSTFORM is an international reseller and curated-stock fashion store. We acquire available
            clothing, footwear and accessories — new, used, vintage and everything in between — and resell
            them to a worldwide audience. The business is deliberately simple: find the pieces worth
            wearing, grade them honestly, price them fairly, ship them anywhere.
          </p>
          <p>
            Our inventory rotates with whatever the market makes available. That means no endless
            catalogue, no manufactured hype drops, and no pretending a piece is rare when it isn&apos;t.
            What you see on the rack is what exists. When it&apos;s gone, it&apos;s gone — and something
            else takes its place.
          </p>
          <p>
            Every item carries an honest condition grade — NEW, LIKE NEW, EXCELLENT, USED or VINTAGE —
            decided by inspection, not marketing. We photograph what we sell and describe what we see. If
            a product arrives defective or significantly different from its description, we make it
            right; that&apos;s the deal.
          </p>
          <div className="border-l-4 border-pf-yellow pl-4">
            <p className="font-display text-xl uppercase leading-tight text-pf-black">
              Sourced. Graded. Resold.
            </p>
            <p className="mt-1 font-mono-tech text-[11px] uppercase tracking-[0.2em] text-pf-muted">
              FREE INTERNATIONAL SHIPPING ON EVERY ORDER
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="border-2 border-pf-black bg-pf-black p-5 text-pf-cream">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-yellow">
              FACTS
            </p>
            <dl className="mt-4 space-y-3 font-mono-tech text-xs">
              {[
                ["FOCUS", "STREETWEAR / SNEAKERS / ACCESSORIES"],
                ["AUDIENCE", "MEN 18–30 + WORLDWIDE"],
                ["SHIPPING", "FREE — INTERNATIONAL"],
                ["CONDITIONS", "NEW → VINTAGE"],
                ["RETURNS", "DEFECT / MISMATCH + VIDEO"],
                ["ACCOUNTS", "NONE — GUEST ONLY"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-pf-cream/50">{k}</dt>
                  <dd className="text-right font-bold text-pf-cream">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-2 border-pf-black bg-pf-paper p-5">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
              TALK TO US
            </p>
            <a
              href="mailto:postformproducts@haren.uk"
              className="mt-2 block break-all font-mono-tech text-sm font-bold text-pf-purple underline underline-offset-4"
            >
              postformproducts@haren.uk
            </a>
            <p className="mt-3 text-xs leading-relaxed text-pf-muted">
              Orders, returns and general questions all go through email — a human reads every one.
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
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
          Return &amp; refund
        </Link>
      </div>
    </div>
  );
}
