import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { CartView } from "@/components/cart/cart-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your POSTFORM cart before checkout.",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const settings = await getSettings();
  return <CartView settings={settings} />;
}
