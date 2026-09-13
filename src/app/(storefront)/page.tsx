import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Package, Globe2, ShieldCheck } from "lucide-react";
import { getFeaturedProducts, getCategoryCounts, getNewestProducts } from "@/lib/queries";
import { CATEGORIES } from "@/lib/types";
import { ProductGrid, ProductRail, SectionHeading } from "@/components/storefront/product-grid";
import { Reveal } from "@/components/storefront/reveal";

export const dynamic = "force-dynamic";

const HERO_IMAGES = [
  {
    src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/845e331c05cb.jpeg",
    alt: "Model wearing layered streetwear editorial",
  },
  {
    src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e404bf44161e.jpg",
    alt: "Streetwear outfit detail with cargo pant and sneaker",
  },
  {
    src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7d30bb5dd531.jpg",
    alt: "Oversized silhouette streetwear editorial",
  },
];

export default async function HomePage() {
  const [featured, counts, newest] = await Promise.all([
    getFeaturedProducts(4),
    getCategoryCounts(),
    getNewestProducts(8),
  ]);

  const totalProducts = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-background">
      {/* ============ HERO - asymmetric split, discipline: one eyebrow,
          two-line headline, 15-word subtext, one primary CTA ============ */}
      <section aria-label="Featured introduction" className="border-b-2 border-pf-black">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[1.1fr_1fr]">
          {/* Type block */}
          <div className="flex flex-col justify-between border-b-2 border-pf-black p-6 pb-10 sm:p-10 lg:border-b-0 lg:border-r-2 lg:p-14">
            <p
              className="pf-rise font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-muted"
              style={{ "--pf-i": 0 } as CSSProperties}
            >
              INTL. RESALE / EST. 2024
            </p>

            <div className="py-10 lg:py-14">
              <h1 className="font-display text-[13vw] leading-[0.9] tracking-tight text-pf-black sm:text-7xl lg:text-[5.2rem] xl:text-8xl">
                <span
                  className="pf-rise block"
                  style={{ "--pf-i": 1 } as CSSProperties}
                >
                  CURATION
                </span>
                <span
                  className="pf-rise block"
                  style={{ "--pf-i": 2 } as CSSProperties}
                >
                  OVER HYPE<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
                </span>
              </h1>
              <p
                className="pf-rise mt-6 max-w-md text-sm leading-relaxed text-pf-muted sm:text-base"
                style={{ "--pf-i": 3 } as CSSProperties}
              >
                Available stock, new to vintage, resold worldwide. No
                manufactured scarcity, no waiting rooms.
              </p>
            </div>

            <div
              className="pf-rise flex flex-wrap items-center gap-3"
              style={{ "--pf-i": 4 } as CSSProperties}
            >
              <Link
                href="/shop"
                className="inline-flex h-14 items-center gap-3 border-2 border-pf-black bg-pf-yellow px-8 font-mono-tech text-sm font-bold uppercase tracking-wider text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Shop all <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-14 items-center border-2 border-pf-black bg-pf-paper px-6 font-mono-tech text-xs font-bold uppercase tracking-wider text-pf-black transition-colors hover:bg-pf-sand"
              >
                The manifesto
              </Link>
            </div>
          </div>

          {/* Image collage - wipe reveal, no overlaid labels.
              Desktop: rows flex to the type-block height so the hero fits the
              initial viewport with CTAs above the fold (hero discipline). */}
          <div className="grid grid-cols-2 lg:grid-rows-[1.3fr_1fr]">
            <div
              className="pf-wipe relative col-span-2 h-56 border-b-2 border-pf-black sm:h-72 lg:h-auto"
              style={{ "--pf-i": 1 } as CSSProperties}
            >
              <Image
                src={HERO_IMAGES[0].src}
                alt={HERO_IMAGES[0].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {HERO_IMAGES.slice(1).map((img, i) => (
              <div
                key={img.src}
                className={`pf-wipe relative aspect-[3/4] border-pf-black lg:aspect-auto lg:h-full ${
                  i === 0 ? "border-r-2" : ""
                }`}
                style={{ "--pf-i": i + 2 } as CSSProperties}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ META STRIP - real data, directly under the hero ============ */}
      <section aria-label="Store statistics" className="border-b-2 border-pf-black bg-pf-black text-pf-cream">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 divide-y-2 divide-pf-cream/15 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          {[
            { icon: Package, value: `${totalProducts}+`, label: "PIECES IN ROTATION" },
            { icon: Globe2, value: "WORLDWIDE", label: "FREE INTL SHIPPING" },
            { icon: ShieldCheck, value: "VERIFIED STOCK", label: "DEFECT RETURNS + VIDEO PROOF" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 px-6 py-5 sm:px-8">
              <stat.icon className="h-6 w-6 shrink-0 text-pf-yellow" strokeWidth={2} />
              <div>
                <p className="font-display text-lg leading-none text-pf-cream sm:text-xl">{stat.value}</p>
                <p className="mt-1 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-pf-cream/60">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CURATED / FEATURED - product grid ============ */}
      <section aria-label="Curated products" className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-12">
        <SectionHeading title="The Curated Rack" link="/shop" linkLabel="SHOP ALL" />
        <div className="mt-6">
          {featured.length > 0 ? (
            <Reveal>
              <ProductGrid products={featured} columns={4} />
            </Reveal>
          ) : (
            <p className="border-2 border-dashed border-pf-black/30 p-10 text-center font-mono-tech text-xs uppercase tracking-widest text-pf-muted">
              The rack is being restocked. Check back shortly.
            </p>
          )}
        </div>
      </section>

      {/* ============ CATEGORY INDEX - editorial typographic list, hover invert ============ */}
      <section aria-label="Shop by category" className="border-y-2 border-pf-black bg-pf-paper">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-12">
          <SectionHeading title="Shop the Index" link="/shop" linkLabel="EVERYTHING" />
          <Reveal className="mt-6 border-t-2 border-pf-black">
            <ul className="divide-y-2 divide-pf-black/15">
              {CATEGORIES.map((cat) => {
                const count = counts[cat.name] ?? 0;
                return (
                  <li key={cat.slug}>
                    <Link
                      href={`/shop/${cat.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-4 transition-colors sm:py-5 hover:bg-pf-black hover:px-4"
                    >
                      <span className="font-display text-2xl uppercase leading-none text-pf-black transition-colors group-hover:text-pf-cream sm:text-4xl lg:text-5xl">
                        {cat.name}
                      </span>
                      <span className="flex shrink-0 items-center gap-3 font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-muted transition-colors group-hover:text-pf-yellow">
                        {count > 0 ? `${count} IN STOCK` : "AWAITING STOCK"}
                        <ArrowUpRight
                          className="h-5 w-5 text-pf-black transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pf-yellow"
                          strokeWidth={2.5}
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ MANIFESTO - stacked editorial composition ============ */}
      <section aria-label="Brand manifesto" className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
        <Reveal>
          <h2 className="max-w-5xl font-display text-3xl uppercase leading-[0.95] text-pf-black sm:text-5xl lg:text-6xl">
            We don&apos;t chase
            <br />
            drops. We find
            <br />
            <span className="bg-pf-yellow px-2 [box-decoration-break:clone]">what already exists.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 grid gap-8 border-t-2 border-pf-black pt-8 text-sm leading-relaxed text-pf-ink sm:grid-cols-2 sm:gap-12 lg:text-base">
          <p>
            Most stores manufacture desire. POSTFORM works differently: we
            acquire what the market already made and let the pieces speak.
            Heavyweight cotton, reverse weave fleece, broken-in denim, court
            sneakers with history in their soles.
          </p>
          <p>
            Every item is graded honestly, NEW to VINTAGE, and priced to move,
            not to sit. Stock rotates with whatever we can source. When it&apos;s
            gone, it&apos;s gone.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 border-2 border-pf-black bg-pf-paper px-6 py-3 font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            SOURCED / GRADED / RESOLD
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </Reveal>
      </section>

      {/* ============ FRESH ARRIVALS - horizontal scroll-snap rail ============ */}
      <section aria-label="Recently sourced products" className="border-t-2 border-pf-black bg-pf-paper">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-12">
          <SectionHeading title="Fresh Off the Pile" link="/shop?sort=newest" linkLabel="NEWEST FIRST" />
          <Reveal className="mt-6">
            <ProductRail products={newest} priorityCount={0} />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
