import Link from "next/link";
import Image from "next/image";
import { CheckCircle2Icon, MessageSquareIcon, ShieldCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatMoney } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetailPage({ product }: { product: Product }) {
  const images = product.images.length > 1 ? product.images : [product.images[0], product.images[0], product.images[0]];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            <Image src={product.images[0].src} alt={product.images[0].alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 3).map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                className="relative aspect-square overflow-hidden rounded-lg border bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                type="button"
              >
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 20vw, 33vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-3xl font-bold tracking-normal md:text-4xl">{product.title}</h1>
            <p className="text-3xl font-bold text-primary">{formatMoney(product.price)}</p>
            <p className="text-base leading-7 text-muted-foreground">{product.description}</p>
          </div>
          <Link href="/chat" className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-xl text-base")}>
            <MessageSquareIcon data-icon="inline-start" />
            Chat about this product
          </Link>
          <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheckIcon />
            Secure conversation via ChatCommerce
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Business response</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">DV</div>
              <div>
                <p className="font-semibold">DplugVIP Business</p>
                <p className="text-sm text-muted-foreground">Typically replies in 5 minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Separator />
      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Key Features</h2>
          <ul className="flex flex-col gap-3 text-muted-foreground">
            {(product.features ?? ["Required price", "Available for direct chat", "Nationwide fulfillment coordination"]).map((feature) => (
              <li key={feature} className="flex gap-2">
                <CheckCircle2Icon className="mt-0.5 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            {(product.specs ?? [
              { label: "Status", value: product.status },
              { label: "Stock", value: String(product.stock) },
              { label: "Category", value: product.category },
            ]).map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 border-b py-3 last:border-b-0">
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
