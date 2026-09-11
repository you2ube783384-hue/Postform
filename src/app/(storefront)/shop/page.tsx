import type { Metadata } from "next";
import { ShopView, parseFilters } from "@/components/shop/shop-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse the full POSTFORM catalogue — streetwear, sneakers and accessories, new, used and vintage. Free international shipping.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  return <ShopView filters={filters} />;
}
