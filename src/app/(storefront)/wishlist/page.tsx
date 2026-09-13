import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { WishlistView } from "@/components/storefront/wishlist-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved POSTFORM pieces, stored locally on this device.",
  robots: { index: false, follow: false },
};

export default async function WishlistPage() {
  const settings = await getSettings();
  return <WishlistView settings={settings} />;
}
