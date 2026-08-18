import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";
import { PWAInstallBanner } from "@/components/shared/pwa-install-banner";
import { getPublicBrandingServer } from "@/lib/api/server-data";

const geistSans = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-terminal",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getPublicBrandingServer();
  const name = branding?.name ?? "DplugVIP";
  const favicon = branding?.faviconUrl ?? branding?.brandMarkUrl;
  return {
    title: `${name} // Restricted Commerce Network`,
    description: `Protected access to ${name} inventory and secure commerce uplinks.`,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: favicon ?? "/icons/icon-192x192.png",
      shortcut: favicon ?? "/icons/icon-192x192.png",
      apple: favicon ?? "/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: name,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080a0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full dark", "antialiased", geistSans.variable, geistMono.variable, "font-sans")}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          {children}
          <PWAInstallBanner />
        </Providers>
      </body>
    </html>
  );
}
