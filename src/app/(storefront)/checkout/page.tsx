import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your POSTFORM order — guest checkout, no account needed.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const settings = await getSettings();
  return <CheckoutView settings={settings} />;
}
