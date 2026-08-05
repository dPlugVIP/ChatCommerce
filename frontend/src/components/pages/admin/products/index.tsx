import Link from "next/link";
import Image from "next/image";
import { FilterIcon, PlusIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { PageHeader } from "@/components/shared/page-header";
import { formatMoney, products } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your inventory and product listings."
        action={
          <Link href="/admin/products/new" className={cn(buttonVariants(), "h-11")}>
            <PlusIcon data-icon="inline-start" />
            Add Product
          </Link>
        }
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <InputGroup className="h-11 md:max-w-md">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search products..." />
        </InputGroup>
        <div className="flex gap-2">
          <Button variant="outline">
            <FilterIcon data-icon="inline-start" />
            Filter
          </Button>
          <Button variant="outline">
            <SlidersHorizontalIcon data-icon="inline-start" />
            Sort
          </Button>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.slice(5).concat(products.slice(0, 2)).map((product) => (
          <Link href={`/admin/products/${product.slug}`} key={product.id}>
            <Card className="h-full p-0 transition-shadow hover:shadow-md">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                <Badge className="absolute bottom-3 left-3" variant={product.status === "published" ? "default" : "secondary"}>
                  {product.status}
                </Badge>
              </div>
              <CardHeader>
                <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">{product.category}</p>
                <CardTitle className="line-clamp-2 text-lg font-bold">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between gap-4 pb-5">
                <p className="text-2xl font-bold text-primary">{formatMoney(product.price)}</p>
                <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
        <Link href="/admin/products/new">
          <Card className="flex h-full min-h-80 items-center justify-center border-dashed bg-transparent text-center transition-colors hover:bg-muted/50">
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <PlusIcon />
              </div>
              <div>
                <p className="text-xl font-bold">Add New Product</p>
                <p className="mt-2 text-muted-foreground">Start selling by adding your first item to the catalog.</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </>
  );
}
