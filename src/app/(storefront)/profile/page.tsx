import type { Metadata } from "next";
import { ProfileView } from "@/components/storefront/profile-view";

export const metadata: Metadata = {
  title: "Profile & Addresses",
  description: "Your local POSTFORM profile and saved addresses — stored in this browser only.",
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileView />;
}
