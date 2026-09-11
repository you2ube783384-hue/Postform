import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductAdmin } from "@/lib/admin-queries";
import { getSettings } from "@/lib/queries";
import { AdminProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, settings] = await Promise.all([getProductAdmin(id), getSettings()]);
  if (!product) notFound();
  return <AdminProductForm product={product} currency={settings.currency} />;
}
