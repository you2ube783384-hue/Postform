import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView, parseFilters } from "@/components/shop/shop-view";
import { categoryFromSlug } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categoryFromSlug(category);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name}`,
    description: `Shop POSTFORM ${cat.name.toLowerCase()} — curated resale stock with free international shipping.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ category }, sp] = await Promise.all([params, searchParams]);
  const cat = categoryFromSlug(category);
  if (!cat) notFound();

  const filters = parseFilters(sp);
  filters.category = cat.name;
  return <ShopView filters={filters} activeCategory={cat} />;
}
