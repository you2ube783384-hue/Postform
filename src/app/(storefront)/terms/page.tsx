import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "POSTFORM terms & conditions — brand protection, verified payment methods (Visa, PayPal), product authenticity and terms modifications.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "TERMS & CONDITIONS" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
          LEGAL — TERMS
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Terms
          <br />
          &amp; Conditions<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        {/* 1. Brand Protection */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-1">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="terms-1" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              1. Brand Protection
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              POSTFORM is a registered trademark. All designs, images, and verified stock tickets
              associated with Postform are the intellectual property of our brand.
            </p>
            <div className="border-l-4 border-pf-yellow bg-pf-yellow-soft/30 p-4">
              <p className="font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black">
                Prohibition
              </p>
              <p className="mt-1">
                We do not allow anyone to claim our name, logo, or assets to sell products on
                third-party platforms or other websites. Any unauthorized use of the Postform
                identity will be met with legal action.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Payments */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-2">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="terms-2" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              2. Payments
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              To ensure security and authenticity, we only accept payments through the following
              verified methods:
            </p>
            <ul className="space-y-2">
              {["Visa (Credit/Debit)", "PayPal"].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-3 w-3 shrink-0 border-2 border-pf-black bg-pf-yellow" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              We do not accept cryptocurrency, cash on delivery, or unverified bank transfers.
            </p>
          </div>
        </section>

        {/* 3. Product Authenticity */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-3">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="terms-3" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              3. Product Authenticity
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              All items listed are verified originals or clearly marked custom pieces. Each product
              comes with a digital verification ticket viewable on the product page.
            </p>
          </div>
        </section>

        {/* 4. Modifications */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-4">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="terms-4" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              4. Modifications
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              Postform reserves the right to modify these terms at any time. Continued use of the
              site constitutes acceptance of these terms.
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
            href="/privacy"
            className="border-2 border-pf-black bg-pf-paper px-6 py-3.5 font-mono-tech text-xs font-bold uppercase tracking-widest text-pf-black transition-colors hover:bg-pf-sand"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
