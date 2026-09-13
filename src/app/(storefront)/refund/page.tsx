import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = {
  title: "Return & Refund",
  description:
    "POSTFORM return & refund policy: defect and significant-mismatch returns with unboxing video proof. Defect return shipping covered by us. 5-7 business day refunds.",
};

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "RETURN & REFUND" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
          LEGAL / REFUND
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Return
          <br />
          &amp; Refund<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        {/* 1. Return Policy */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="refund-1">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="refund-1" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              1. Return Policy
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We take pride in our verified stock. Returns are only accepted if the product received
              is defected or significantly different from the description.
            </p>
            <div className="border-l-4 border-pf-yellow bg-pf-yellow-soft/30 p-4">
              <p className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black">
                Requirement
              </p>
              <p className="mt-1">
                You must provide a clear, unedited video of the unboxing process showing the defect.
                Returns requested without video proof will be rejected.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Shipping Charges */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="refund-2">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="refund-2" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              2. Shipping Charges
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We do not charge for shipping on initial orders (Free Shipping). Furthermore, if a
              return is approved due to a defect, Postform will cover the return shipping costs.
            </p>
          </div>
        </section>

        {/* 3. Refund Process */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="refund-3">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="refund-3" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              3. Refund Process
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              Once your return is received and inspected (verified against your unboxing video), we
              will initiate a refund to your original method of payment (Visa or PayPal). Please allow
              5-7 business days for the transaction to process.
            </p>
          </div>
        </section>

        {/* 4. How to Initiate */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="refund-4">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="refund-4" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              4. How to Initiate
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              To start a return, email us at{" "}
              <a
                href="mailto:postformproducts@haren.uk"
                className="font-mono-tech font-bold text-pf-black underline underline-offset-4"
              >
                postformproducts@haren.uk
              </a>{" "}
              with your order details and the attached unboxing video.
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="border-2 border-pf-black bg-pf-yellow px-8 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm"
          >
            Back to shopping
          </Link>
          <Link
            href="/terms"
            className="border-2 border-pf-black bg-pf-paper px-6 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-sand"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
