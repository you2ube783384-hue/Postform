import Link from "next/link";
import { CATEGORIES } from "@/lib/types";

export function SiteFooter({ storeEmail }: { storeEmail: string }) {
  return (
    <footer className="mt-auto border-t-2 border-pf-black bg-pf-black text-pf-cream">
      <div className="mx-auto max-w-[1600px]">
        {/* Top: wordmark + statement */}
        <div className="grid gap-8 border-b-2 border-pf-cream/20 px-5 py-10 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
          <div>
            <p className="font-display text-4xl leading-none text-pf-cream md:text-5xl">
              POSTFORM<span className="text-pf-yellow">▮</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-pf-cream/70">
              A curated-stock fashion store. We acquire available clothing,
              footwear and accessories — new, used, vintage — and resell them
              worldwide. Nothing stays forever.
            </p>
            <p className="mt-4 font-mono-tech text-[11px] uppercase tracking-[0.2em] text-pf-yellow">
              FREE INTERNATIONAL SHIPPING
            </p>
          </div>

          <nav aria-label="Shop categories">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-cream/50">
              Shop
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-pf-cream/90 underline-offset-4 hover:text-pf-yellow hover:underline">
                  Shop All
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/shop/${c.slug}`}
                    className="text-sm text-pf-cream/90 underline-offset-4 hover:text-pf-yellow hover:underline"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Store information">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-cream/50">
              Store
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-pf-cream/90 underline-offset-4 hover:text-pf-yellow hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-sm text-pf-cream/90 underline-offset-4 hover:text-pf-yellow hover:underline">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-pf-cream/90 underline-offset-4 hover:text-pf-yellow hover:underline">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${storeEmail}`}
                  className="text-sm text-pf-purple-soft underline-offset-4 hover:text-pf-yellow hover:underline"
                >
                  {storeEmail}
                </a>
              </li>
              <li>
                <Link href="/admin" className="font-mono-tech text-[11px] uppercase tracking-widest text-pf-cream/40 underline-offset-4 hover:text-pf-yellow hover:underline">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-2 px-5 py-4 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-cream/50 md:flex-row md:items-center md:justify-between md:px-10">
          <span>© {new Date().getFullYear()} POSTFORM — ALL RIGHTS RESERVED</span>
          <span className="flex items-center gap-4">
            <span>PAYPAL / VISA / PREPAID ACCEPTED</span>
            <span className="text-pf-yellow" aria-hidden>
              ▮▮▮
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
