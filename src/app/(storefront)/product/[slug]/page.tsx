import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { StickyBuyBar } from "@/components/product/sticky-buy-bar";
import { ProductGrid, SectionHeading } from "@/components/storefront/product-grid";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  const title = `${product.brand ? product.brand + " - " : ""}${product.name}`;
  return {
    title,
    description:
      product.description?.slice(0, 160) ??
      `${product.name}, ${product.condition} condition. Curated resale by POSTFORM.`,
    openGraph: {
      title: `${title} - POSTFORM`,
      description: product.description?.slice(0, 200) ?? undefined,
      images: product.images[0]?.url ? [{ url: product.images[0].url }] : undefined,
      type: "website",
    },
    twitter: {
      card: product.images[0]?.url ? "summary_large_image" : "summary",
      title: `${title} - POSTFORM`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 pb-60 sm:px-8 sm:pb-12 lg:px-12">
      <Breadcrumbs
        items={[
          { label: "SHOP", href: "/shop" },
          { label: product.category.toUpperCase(), href: `/shop/${product.category.toLowerCase().replace(/ /g, "-")}` },
          { label: product.name.toUpperCase() },
        ]}
      />

      {/* Main split */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
        <ProductGallery product={product} />

        {/* Info column */}
        <div className="flex flex-col gap-5">
          <div>
            {product.brand && (
              <p className="font-mono-tech text-xs font-bold uppercase tracking-[0.25em] text-pf-muted">
                {product.brand}
              </p>
            )}
            <h1 className="mt-1 font-display text-3xl uppercase leading-[0.95] text-pf-black sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 font-mono-tech text-[11px] uppercase tracking-[0.2em] text-pf-muted">
              {product.category} / RESALE STOCK / {product.material ?? "MATERIAL UNSPECIFIED"}
            </p>
          </div>

          <PurchasePanel product={product} />

          {/* Details */}
          <div className="border-t-2 border-pf-black pt-5">
            <p className="font-mono-tech text-[10px] font-bold uppercase tracking-[0.3em] text-pf-muted">
              The Details
            </p>
            {product.description && (
              <p className="mt-3 text-sm leading-relaxed text-pf-ink">{product.description}</p>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-2 border-pf-black bg-pf-paper p-4 text-xs">
              <div className="contents">
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">Condition</dt>
                <dd className="font-bold text-pf-black">{product.condition}</dd>
              </div>
              <div className="contents">
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">Material</dt>
                <dd className="font-bold text-pf-black">{product.material ?? "-"}</dd>
              </div>
              <div className="contents">
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">Category</dt>
                <dd className="font-bold text-pf-black">{product.category}</dd>
              </div>
              <div className="contents">
                <dt className="font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted">Listed</dt>
                <dd className="font-bold text-pf-black">
                  {new Date(product.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                </dd>
              </div>
            </dl>
            {product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/shop?q=${encodeURIComponent(tag)}`}
                    className="border border-pf-black/30 bg-pf-paper px-2 py-0.5 font-mono-tech text-[10px] uppercase tracking-widest text-pf-muted transition-colors hover:border-pf-black hover:text-pf-black"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-label="Related products" className="mt-16">
          <SectionHeading
            kicker="FROM THE SAME PILE"
            title="You Might Also Wear"
            link={`/shop/${product.category.toLowerCase().replace(/ /g, "-")}`}
            linkLabel={`MORE ${product.category.toUpperCase()}`}
          />
          <div className="mt-6">
            <ProductGrid products={related} columns={4} priorityCount={0} />
          </div>
        </section>
      )}

      {/* Mobile sticky purchase bar */}
      <StickyBuyBar product={product} />
    </div>
  );
}
