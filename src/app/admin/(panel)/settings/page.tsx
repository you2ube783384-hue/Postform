import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { AdminSettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <AdminSettingsForm initial={settings} />;
}
