import Image from "next/image";
import Link from "next/link";
import { FilterIcon, MessageSquareIcon, PackageCheckIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

import { GuiPanel, TelemetryLabel } from "@/components/gui/system";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { formatMoney } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export default function CatalogPage({ products, categories }: { products: Product[]; categories: string[] }) {
  const published = products.filter((product) => product.status === "published");

  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-7 px-4 py-7 md:px-8">
      <section className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <TelemetryLabel>Authorized inventory node</TelemetryLabel>
          <h1 className="mt-3 font-heading text-4xl font-black uppercase tracking-[-0.04em] md:text-6xl">Asset catalog</h1>
          <p className="mt-2 max-w-3xl font-mono text-xs uppercase leading-6 tracking-[0.12em] text-muted-foreground">
            Encrypted repository // direct operator negotiation // all acquisitions require secure uplink confirmation
          </p>
        </div>
        <div className="grid grid-cols-3 gap-px border border-border bg-border text-center font-mono text-[10px] uppercase tracking-[0.14em]">
          <div className="bg-card px-4 py-3"><span className="block text-lg text-primary">{published.length}</span>Active assets</div>
          <div className="bg-card px-4 py-3"><span className="block text-lg text-secondary">01</span>Operator</div>
          <div className="bg-card px-4 py-3"><span className="block text-lg text-primary">AES</span>Channel</div>
        </div>
      </section>

      <section className="flex flex-col gap-4 md:hidden">
        <InputGroup className="h-11 rounded-none bg-muted">
          <InputGroupAddon><SearchIcon /></InputGroupAddon>
          <InputGroupInput placeholder="QUERY ASSETS..." />
        </InputGroup>
      </section>

      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between" aria-label="Product categories">
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Button key={category} variant={index === 0 ? "default" : "outline"} className="rounded-none font-mono text-[10px] uppercase tracking-[0.15em]">
              {index === 0 ? `[ ${category} ]` : category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none"><FilterIcon data-icon="inline-start" />Filter assets</Button>
          <Button variant="outline" className="rounded-none"><SlidersHorizontalIcon data-icon="inline-start" />Sort query</Button>
        </div>
      </section>

      <section id="inventory" className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-[-0.03em]">Available hardware / software</h2>
          <span className="signal-pulse font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">● Feed synchronized</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {published.map((product) => (
            <GuiPanel key={product.id} className="group p-0 transition-colors hover:border-primary" label={`DV-${product.id.padStart(3, "0")}`}>
              <Link href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted">
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    unoptimized
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="image-tech h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  {product.tag ? <Badge className="absolute right-2 top-2 rounded-none font-mono text-[9px] uppercase">{product.tag}</Badge> : null}
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="line-clamp-2 font-heading text-lg font-bold uppercase">{product.title}</CardTitle>
                <CardDescription className="line-clamp-2 font-mono text-xs leading-5">{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between border-t border-border pb-5 pt-4">
                <p className="font-mono text-lg font-bold text-primary">{formatMoney(product.price)}</p>
                <Link href="/chat" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-none font-mono text-[10px] uppercase")}>
                  <MessageSquareIcon data-icon="inline-start" /> Uplink
                </Link>
              </CardFooter>
            </GuiPanel>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <PackageCheckIcon />
          <span>Transactions and fulfillment remain operator-coordinated.</span>
        </div>
      </section>
    </main>
  );
}
