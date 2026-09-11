import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "POSTFORM Terms & Conditions — brand protection, payments, authenticity, and changes to terms.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "TERMS & CONDITIONS" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
          POLICY — CURRENT
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Terms &amp;
          <br />Conditions<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-1">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">01</span>
            <h2 id="terms-1" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Brand Protection
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              POSTFORM is a registered trademark. All designs, images, and verified stock tickets
              associated with Postform are the intellectual property of our brand.
            </p>
            <p>
              Prohibition: We do not allow anyone to claim our name, logo, or assets to sell products on
              third-party platforms or other websites. Any unauthorized use of the Postform identity will
              be met with legal action.
            </p>
          </div>
        </section>

        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-2">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">02</span>
            <h2 id="terms-2" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Payments
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              To ensure security and authenticity, we only accept payments through the following verified
              methods:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Visa (Credit/Debit)</li>
              <li>PayPal</li>
            </ul>
            <p>We do not accept cryptocurrency, cash on delivery, or unverified bank transfers.</p>
          </div>
        </section>

        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-3">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">03</span>
            <h2 id="terms-3" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Product Authenticity
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              All items listed are verified originals or clearly marked custom pieces. Each product comes
              with a digital verification ticket viewable on the product page.
            </p>
          </div>
        </section>

        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="terms-4">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">04</span>
            <h2 id="terms-4" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Modifications
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              Postform reserves the right to modify these terms at any time. Continued use of the site
              constitutes acceptance of these terms.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
