import Image from "next/image";
import Link from "next/link";
import { CheckCircle2Icon, MessageSquareIcon, ShieldCheckIcon } from "lucide-react";

import { GuiPanel, TelemetryLabel } from "@/components/gui/system";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetailPage({ product }: { product: Product }) {
  const images = product.images.length > 1 ? product.images : [product.images[0], product.images[0], product.images[0]];

  return (
    <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-4 py-8 md:px-8">
      <nav className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <Link href="/" className="hover:text-primary">Catalog</Link><span>{"//"}</span><span>{product.category}</span><span>{"//"}</span><span className="text-foreground">{product.title}</span>
      </nav>
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="flex flex-col gap-3">
          <GuiPanel className="relative aspect-[4/3] overflow-hidden bg-muted p-0" label="Primary visual scan">
            <Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="image-tech object-cover" />
          </GuiPanel>
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((image, index) => (
              <button key={`${image.src}-${index}`} className="relative aspect-square overflow-hidden border bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50" type="button">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 20vw, 33vw" className="image-tech object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 border-b border-border pb-6">
            <TelemetryLabel>Asset file // {product.category}</TelemetryLabel>
            <h1 className="font-heading text-4xl font-black uppercase tracking-[-0.04em] md:text-5xl">{product.title}</h1>
            <p className="font-mono text-3xl font-bold text-primary">{formatMoney(product.price)}</p>
            <p className="font-mono text-sm leading-7 text-muted-foreground">{product.description}</p>
          </div>
          <Link href="/chat" className={cn(buttonVariants({ size: "lg" }), "chamfer h-13 rounded-none font-mono text-xs uppercase tracking-[0.16em]")}>
            <MessageSquareIcon data-icon="inline-start" /> Initialize secure inquiry
          </Link>
          <p className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <ShieldCheckIcon /> AES-256 operator channel
          </p>
          <GuiPanel label="Operator response">
            <CardHeader><CardTitle className="font-heading uppercase">DplugVIP operator</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center border border-primary bg-primary/10 font-mono font-bold text-primary">DV</div>
              <div><p className="font-semibold">Node PRX-92A</p><p className="font-mono text-xs text-muted-foreground">Median response: 00:05:12</p></div>
            </CardContent>
          </GuiPanel>
        </div>
      </section>
      <Separator />
      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <TelemetryLabel>Capability manifest</TelemetryLabel>
          <ul className="flex flex-col gap-3 font-mono text-sm text-muted-foreground">
            {(product.features ?? ["Required price", "Available for direct chat", "Nationwide fulfillment coordination"]).map((feature) => (
              <li key={feature} className="flex gap-2"><CheckCircle2Icon className="mt-0.5 text-secondary" /><span>{feature}</span></li>
            ))}
          </ul>
        </div>
        <GuiPanel label="Specifications">
          <CardContent className="flex flex-col pt-8">
            {(product.specs ?? [{ label: "Status", value: product.status }, { label: "Stock", value: String(product.stock) }, { label: "Category", value: product.category }]).map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 border-b py-3 font-mono text-xs last:border-b-0">
                <span className="uppercase text-muted-foreground">{spec.label}</span><Badge variant="outline" className="rounded-none">{spec.value}</Badge>
              </div>
            ))}
          </CardContent>
        </GuiPanel>
      </section>
    </main>
  );
}
