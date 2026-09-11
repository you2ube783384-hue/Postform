import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { AdminProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Add Product",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const settings = await getSettings();
  return <AdminProductForm currency={settings.currency} />;
}
