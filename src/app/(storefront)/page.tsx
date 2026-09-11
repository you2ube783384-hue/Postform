import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, Globe2, ShieldCheck } from "lucide-react";
import { getFeaturedProducts, getCategoryCounts, getNewestProducts } from "@/lib/queries";
import { CATEGORIES } from "@/lib/types";
import { ProductGrid, SectionHeading } from "@/components/storefront/product-grid";

export const dynamic = "force-dynamic";

const HERO_IMAGES = [
  {
    src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/845e331c05cb.jpeg",
    alt: "Model wearing layered streetwear editorial",
  },
  {
    src: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e404bf44161e.jpg",
    alt: "Streetwear outfit detail — cargo and sneaker",
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
    getNewestProducts(4),
  ]);

  const totalProducts = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-background">
      {/* ============ HERO ============ */}
      <section aria-label="Featured introduction" className="border-b-2 border-pf-black">
        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[1.1fr_1fr]">
          {/* Type block */}
          <div className="flex flex-col justify-between border-b-2 border-pf-black p-6 pb-10 sm:p-10 lg:border-b-0 lg:border-r-2 lg:p-14">
            <div className="flex items-center justify-between font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-muted">
              <span>INTL. RESALE — EST. 2024</span>
              <span className="hidden text-pf-purple sm:block">FILE: 001 / OPEN</span>
            </div>

            <div className="py-10 lg:py-16">
              <h1 className="font-display text-[13vw] leading-[0.9] tracking-tight text-pf-black sm:text-7xl lg:text-[5.2rem] xl:text-8xl">
                CURATION
                <br />
                <span className="relative inline-block">
                  OVER
                  <span className="absolute -right-3 top-1 h-2 w-2 bg-pf-purple sm:-right-5 sm:h-3 sm:w-3" aria-hidden />
                </span>
                <br />
                HYPE<span className="text-pf-yellow" style={{ WebkitTextStroke: "2px #141310" }}>.</span>
              </h1>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-pf-muted sm:text-base">
                POSTFORM acquires available stock — new, used, vintage — and
                resells it worldwide. No manufactured scarcity, no waiting
                rooms. Just the pieces worth wearing, while they last.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex h-14 items-center gap-3 border-2 border-pf-black bg-pf-yellow px-8 font-mono-tech text-sm font-bold uppercase tracking-wider text-pf-black pf-press hover:-translate-x-[2px] hover:-translate-y-[2px] hover:pf-hard-shadow-sm active:translate-x-0 active:translate-y-0 active:shadow-none"
              >
                Shop the catalogue <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-14 items-center border-2 border-pf-black bg-pf-paper px-6 font-mono-tech text-xs font-bold uppercase tracking-wider text-pf-black transition-colors hover:bg-pf-sand"
              >
                The manifesto
              </Link>
            </div>
          </div>

          {/* Image collage */}
          <div className="grid grid-cols-2 grid-rows-[repeat(3,minmax(0,1fr))]">
            <div className="relative col-span-2 border-b-2 border-pf-black lg:border-b-0">
              <Image
                src={HERO_IMAGES[0].src}
                alt={HERO_IMAGES[0].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 border border-pf-black bg-pf-yellow px-2 py-0.5 font-mono-tech text-[10px] font-bold uppercase tracking-widest text-pf-black">
                LOOK 01 — HEAVYWEIGHT
              </span>
            </div>
            {HERO_IMAGES.slice(1).map((img, i) => (
              <div
                key={img.src}
                className={`relative aspect-[3/4] border-pf-black ${
                  i === 0 ? "border-r-2 lg:border-t-2" : "border-t-2 lg:border-t-0"
                }`}
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

      {/* ============ META STRIP ============ */}
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

      {/* ============ CURATED / FEATURED ============ */}
      <section aria-label="Curated products" className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-12">
        <SectionHeading
          kicker="HAND-PICKED / ROTATES OFTEN"
          title="The Curated Rack"
          link="/shop"
          linkLabel="SHOP ALL PRODUCTS"
        />
        <div className="mt-6">
          {featured.length > 0 ? (
            <ProductGrid products={featured} columns={4} />
          ) : (
            <p className="border-2 border-dashed border-pf-black/30 p-10 text-center font-mono-tech text-xs uppercase tracking-widest text-pf-muted">
              The rack is being restocked — check back shortly.
            </p>
          )}
        </div>
      </section>

      {/* ============ SHOP BY CATEGORY ============ */}
      <section aria-label="Shop by category" className="border-y-2 border-pf-black bg-pf-paper">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-12">
          <SectionHeading
            kicker="INDEX / 00"
            title="Shop the Index"
            link="/shop"
            linkLabel="EVERYTHING"
          />
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {CATEGORIES.map((cat, i) => {
              const count = counts[cat.name] ?? 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className="group flex flex-col justify-between border-2 border-pf-black bg-pf-cream p-5 transition-colors hover:bg-pf-yellow"
                >
                  <span className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.25em] text-pf-muted group-hover:text-pf-black/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-8">
                    <p className="font-display text-lg uppercase leading-none text-pf-black sm:text-xl">
                      {cat.name}
                    </p>
                    <p className="mt-2 font-mono-tech text-[11px] uppercase tracking-widest text-pf-muted group-hover:text-pf-black/70">
                      {count > 0 ? `${count} IN STOCK` : "AWAITING STOCK"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section aria-label="Brand manifesto" className="mx-auto max-w-[1600px] px-4 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-purple">
              THE POSTFORM MANIFESTO
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase leading-[0.95] text-pf-black sm:text-4xl lg:text-5xl">
              We don&apos;t chase
              <br />
              drops. We find
              <br />
              <span className="bg-pf-yellow px-2 [box-decoration-break:clone]">what already exists.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-5 border-l-2 border-pf-black pl-6 text-sm leading-relaxed text-pf-ink sm:pl-8 lg:text-base">
            <p>
              Most stores manufacture desire. POSTFORM works differently — we
              acquire what the market already made and let the pieces speak:
              heavyweight cotton, reverse weave fleece, broken-in denim,
              court sneakers with history in their soles.
            </p>
            <p>
              Every item is graded honestly — NEW to VINTAGE — and priced to
              move, not to sit. Stock rotates with whatever we can source.
              When it&apos;s gone, it&apos;s gone.
            </p>
            <div className="mt-2 flex items-center gap-3 font-mono-tech text-[11px] font-bold uppercase tracking-[0.2em] text-pf-black">
              <span className="inline-block h-3 w-3 bg-pf-black" aria-hidden />
              SOURCED — GRADED — RESOLD
            </div>
          </div>
        </div>
      </section>

      {/* ============ FRESH ARRIVALS ============ */}
      <section aria-label="Recently sourced products" className="border-t-2 border-pf-black bg-pf-paper">
        <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-8 lg:px-12">
          <SectionHeading
            kicker="MOST RECENTLY SOURCED"
            title="Fresh Off the Pile"
            link="/shop?sort=newest"
            linkLabel="SEE THE LATEST"
          />
          <div className="mt-6">
            <ProductGrid products={newest} columns={4} priorityCount={0} />
          </div>
        </div>
      </section>
    </div>
  );
}
