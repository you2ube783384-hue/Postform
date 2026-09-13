import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "POSTFORM privacy policy: no tracking cookies, no analytics, no third-party pixels. Only the data you voluntarily provide to process an order.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-8">
      <Breadcrumbs items={[{ label: "PRIVACY POLICY" }]} />

      <div className="mt-6 border-b-2 border-pf-black pb-6">
        <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
          LEGAL / PRIVACY
        </p>
        <h1 className="mt-2 font-display text-5xl uppercase leading-[0.9] text-pf-black sm:text-6xl">
          Privacy
          <br />
          Policy<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
        </h1>
      </div>

      <div className="mt-8 space-y-8">
        {/* 1. Data Collection */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="priv-1">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="priv-1" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              1. Data Collection
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              Postform is privacy-focused. We do not use tracking cookies, analytics software, or
              third-party pixels on this website. You can browse our catalogue completely anonymously.
            </p>
          </div>
        </section>

        {/* 2. Information We Receive */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="priv-2">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="priv-2" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              2. Information We Receive
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              We only collect data when you voluntarily provide it to process an order. This occurs
              exclusively when you send us an email to finalize a purchase. The only data we receive
              is:
            </p>
            <ul className="space-y-2">
              {[
                "Your Name",
                "Shipping Address",
                "Billing Details provided for the transaction",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-3 w-3 shrink-0 border-2 border-pf-black bg-pf-yellow" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 3. Data Usage & Selling */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="priv-3">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="priv-3" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              3. Data Usage &amp; Selling
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              <strong>We do not sell your data.</strong> The information you provide via email is used
              strictly for shipping your products and verifying the transaction. We do not build
              marketing profiles or share your details with ad networks.
            </p>
          </div>
        </section>

        {/* 4. Contact */}
        <section className="border-2 border-pf-black bg-pf-paper" aria-labelledby="priv-4">
          <div className="border-b-2 border-pf-black bg-pf-black px-5 py-3">
            <h2 id="priv-4" className="font-mono-tech text-xs font-bold tracking-[0.25em] text-pf-cream">
              4. Contact
            </h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm leading-relaxed text-pf-ink sm:px-6">
            <p>
              For any privacy concerns, please contact us directly at:{" "}
              <a
                href="mailto:postformproducts@haren.uk"
                className="font-mono-tech font-bold text-pf-black underline underline-offset-4"
              >
                postformproducts@haren.uk
              </a>
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
