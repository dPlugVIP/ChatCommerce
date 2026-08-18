import type { MetadataRoute } from "next";

import { getPublicBrandingServer } from "@/lib/api/server-data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const branding = await getPublicBrandingServer();
  const name = branding?.name ?? "DplugVIP";

  return {
    name: `${name} // Restricted Commerce Network`,
    short_name: name,
    description: `Protected access to ${name} inventory and secure commerce uplinks.`,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#080a0f",
    theme_color: "#080a0f",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
