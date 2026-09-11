import type { Metadata } from "next";
import { getProductsAdmin } from "@/lib/admin-queries";
import { getSettings } from "@/lib/queries";
import { AdminProductsTable } from "@/components/admin/products-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const [products, settings] = await Promise.all([getProductsAdmin(), getSettings()]);
  return <AdminProductsTable products={products} currency={settings.currency} />;
}
