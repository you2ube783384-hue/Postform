import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "POSTFORM Privacy Policy — data collection, usage, and contact details.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "PRIVACY POLICY" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
          POLICY — CURRENT
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Privacy
          <br />Policy<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="privacy-1">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">01</span>
            <h2 id="privacy-1" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Data Collection
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              Postform is privacy-focused. We do not use tracking cookies, analytics software, or
              third-party pixels on this website. You can browse our catalogue completely anonymously.
            </p>
          </div>
        </section>

        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="privacy-2">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">02</span>
            <h2 id="privacy-2" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Information We Receive
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We only collect data when you voluntarily provide it to process an order. This occurs
              exclusively when you send us an email to finalize a purchase. The only data we receive is:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Your Name</li>
              <li>Shipping Address</li>
              <li>Billing Details provided for the transaction</li>
            </ul>
          </div>
        </section>

        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="privacy-3">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">03</span>
            <h2 id="privacy-3" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Data Usage &amp; Selling
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We do not sell your data. The information you provide via email is used strictly for
              shipping your products and verifying the transaction. We do not build marketing profiles or
              share your details with ad networks.
            </p>
          </div>
        </section>

        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="privacy-4">
          <div className="flex items-center gap-3 border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <span className="font-display text-lg text-pf-yellow">04</span>
            <h2 id="privacy-4" className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-cream">
              Contact
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              For any privacy concerns, please contact us directly at:
              <br />
              <a href="mailto:postformproducts@haren.uk" className="font-mono-tech font-bold text-pf-purple underline underline-offset-4">
                postformproducts@haren.uk
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
