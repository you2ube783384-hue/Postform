import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";
import { MobileBottomNav } from "@/components/storefront/mobile-bottom-nav";
import { getSettings } from "@/lib/queries";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter storeEmail={settings.storeEmail} />
      {/* Spacer so content scrolls fully clear of the fixed bottom nav
          (phones + tablets; bottom nav is hidden on lg). */}
      <div
        aria-hidden="true"
        className="h-[68px] shrink-0 lg:hidden"
        style={{ height: "calc(68px + env(safe-area-inset-bottom))" }}
      />
      <MobileBottomNav />
    </div>
  );
}
