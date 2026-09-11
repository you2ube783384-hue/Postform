import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "POSTFORM return and refund policy — defect and significant-mismatch returns with unboxing video proof. Defect return shipping covered by us.",
};

export default async function ReturnsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "RETURNS & REFUNDS" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
          POLICY — CURRENT
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Return
          <br />& Refund<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        {/* 1. Return policy */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="ret-1">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">01</span>
            <h2 id="ret-1" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Return Policy
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We take pride in our verified stock. Returns are only accepted if the product received is
              defected or significantly different from the description.
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

        {/* 2. Shipping charges */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="ret-2">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">02</span>
            <h2 id="ret-2" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Shipping Charges
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We do not charge for shipping on initial orders (Free Shipping). Furthermore, if a return
              is approved due to a defect, Postform will cover the return shipping costs.
            </p>
          </div>
        </section>

        {/* 3. Refund process */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="ret-3">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">03</span>
            <h2 id="ret-3" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Refund Process
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              Once your return is received and inspected (verified against your unboxing video), we will
              initiate a refund to your original method of payment (Visa or PayPal). Please allow 5–7
              business days for the transaction to process.
            </p>
            <div className="grid grid-cols-3 gap-2 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-muted">
              <div className="border-2 border-pf-black bg-pf-cream p-3 text-center">
                <p className="text-pf-black">RECEIVED</p>
                <p className="mt-1">STEP 01</p>
              </div>
              <div className="border-2 border-pf-black bg-pf-cream p-3 text-center">
                <p className="text-pf-black">INSPECTED</p>
                <p className="mt-1">STEP 02</p>
              </div>
              <div className="border-2 border-pf-black bg-pf-yellow p-3 text-center">
                <p className="text-pf-black">REFUNDED 5–7 DAYS</p>
                <p className="mt-1">STEP 03</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. How to initiate */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="ret-4">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">04</span>
            <h2 id="ret-4" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              How to Initiate
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              To start a return, email us at{" "}
              <a
                href={`mailto:${settings.storeEmail}`}
                className="font-mono-tech font-bold text-pf-purple underline underline-offset-4"
              >
                {settings.storeEmail}
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
            href="/shipping"
            className="border-2 border-pf-black bg-pf-paper px-6 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-sand"
          >
            Shipping info
          </Link>
        </div>
      </div>
    </div>
  );
}
