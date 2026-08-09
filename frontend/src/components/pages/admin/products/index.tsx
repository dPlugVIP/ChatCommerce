import Link from "next/link";
import Image from "next/image";
import { FilterIcon, PlusIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { PageHeader } from "@/components/shared/page-header";
import { formatMoney } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";
import { GuiPanel } from "@/components/gui/system";
import type { Product } from "@/types";

export default function AdminProductsPage({ products }: { products: Product[] }) {
  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your inventory and product listings."
        action={
          <Link href="/admin/products/new" className={cn(buttonVariants(), "chamfer h-11 rounded-none font-mono text-xs uppercase tracking-[0.14em]")}>
            <PlusIcon data-icon="inline-start" />
            Add Product
          </Link>
        }
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <InputGroup className="h-11 rounded-none bg-muted/50 font-mono text-xs md:max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search products..." />
        </InputGroup>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-none font-mono text-xs uppercase">
            <FilterIcon data-icon="inline-start" />
            Filter
          </Button>
          <Button variant="outline" className="rounded-none font-mono text-xs uppercase">
            <SlidersHorizontalIcon data-icon="inline-start" />
            Sort
          </Button>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Link href={`/admin/products/${product.id}`} key={product.id}>
            <GuiPanel className="h-full p-0 transition-colors hover:border-primary" label={`Asset ${product.id}`}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image src={product.images[0].src} alt={product.images[0].alt} fill unoptimized sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="image-tech object-cover" />
                <Badge className="absolute bottom-3 left-3 rounded-none font-mono text-[9px] uppercase" variant={product.status === "published" ? "default" : "secondary"}>
                  {product.status}
                </Badge>
              </div>
              <CardHeader>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{product.category}</p>
                <CardTitle className="line-clamp-2 font-heading text-lg font-bold uppercase">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between gap-4 pb-5">
                <p className="font-mono text-lg font-bold text-primary">{formatMoney(product.price)}</p>
                <p className="font-mono text-[10px] uppercase text-muted-foreground">Stock: {product.stock}</p>
              </CardContent>
            </GuiPanel>
          </Link>
        ))}
        <Link href="/admin/products/new">
          <Card className="flex h-full min-h-80 items-center justify-center rounded-none border-dashed bg-transparent text-center transition-colors hover:bg-muted/50">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center border border-primary bg-primary/10 text-primary">
                <PlusIcon />
              </div>
              <div>
                <p className="font-heading text-xl font-bold uppercase">Provision asset</p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">Register a new inventory record.</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
