import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, HeartIcon, MessageSquareIcon, PackageCheckIcon, SearchIcon, ShieldCheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { categories, formatMoney, products } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";

export default function CatalogPage() {
  const published = products.filter((product) => product.status === "published");

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 md:px-8">
      <section className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="relative overflow-hidden rounded-xl border bg-card p-6 md:p-10">
          <Image
            src="https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&w=1600&q=80"
            alt="Bright abstract commerce scene"
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative max-w-2xl">
            <Badge>Direct to Business</Badge>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-normal md:text-5xl">
              The marketplace for serious commerce.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
              Browse verified inventory, ask product questions in one thread, and close the deal directly with the business.
            </p>
            <Link href="#inventory" className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-full px-6")}>
              Start Browsing
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        </div>
        <div className="grid gap-5">
          <div className="rounded-xl bg-muted p-6">
            <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheckIcon />
            </div>
            <h2 className="text-2xl font-bold">Verified Sellers</h2>
            <p className="mt-2 text-base text-muted-foreground">
              Every deployment is owned by one business, so customers always know who they are chatting with.
            </p>
          </div>
          <div className="rounded-xl bg-secondary p-6 text-secondary-foreground">
            <div className="mb-8 flex size-12 items-center justify-center rounded-full bg-background/20">
              <MessageSquareIcon />
            </div>
            <h2 className="text-2xl font-bold">Instant Chat</h2>
            <p className="mt-2 text-base text-secondary-foreground/70">
              Negotiate and close deals in a single customer-to-business thread.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col gap-5 md:hidden">
        <InputGroup className="h-11 rounded-full bg-muted">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search products..." />
        </InputGroup>
      </section>
      <section className="flex flex-wrap gap-3" aria-label="Product categories">
        {categories.map((category, index) => (
          <Button key={category} variant={index === 0 ? "default" : "outline"} className="rounded-full">
            {category}
          </Button>
        ))}
      </section>
      <section id="inventory" className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-normal">Trending Inventory</h2>
          <Link href="/" className="text-sm font-medium text-primary">
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {published.map((product) => (
            <Card key={product.id} className="p-0">
              <Link href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={product.images[0].src}
                    alt={product.images[0].alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.tag ? <Badge className="absolute left-3 top-3">{product.tag}</Badge> : null}
                </div>
              </Link>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg font-bold">{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between pb-5">
                <p className="text-2xl font-bold text-primary">{formatMoney(product.price)}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm" aria-label={`Save ${product.title}`}>
                    <HeartIcon />
                  </Button>
                  <Link href="/chat" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full")}>
                    <MessageSquareIcon data-icon="inline-start" />
                    Chat
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <PackageCheckIcon />
          <span>Product payments and delivery are arranged directly with the business.</span>
        </div>
      </section>
    </main>
  );
}
