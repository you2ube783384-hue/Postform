import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://postform.example.com"),
  title: {
    default: "POSTFORM — Curated Streetwear Resale",
    template: "%s — POSTFORM",
  },
  description:
    "POSTFORM is an international curated-stock fashion store. Streetwear, sneakers and accessories sourced, verified and resold worldwide. Free international shipping.",
  keywords: [
    "POSTFORM",
    "streetwear",
    "resale",
    "sneakers",
    "curated fashion",
    "vintage clothing",
    "oversized tees",
    "hoodies",
  ],
  openGraph: {
    title: "POSTFORM — Curated Streetwear Resale",
    description:
      "Curated streetwear, sneakers and accessories. Sourced, verified, resold worldwide.",
    siteName: "POSTFORM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "POSTFORM — Curated Streetwear Resale",
    description:
      "Curated streetwear, sneakers and accessories. Sourced, verified, resold worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${archivoBlack.variable} ${spaceMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
