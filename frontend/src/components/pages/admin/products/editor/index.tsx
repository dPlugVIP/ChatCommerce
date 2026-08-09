"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CloudUploadIcon, ImagePlusIcon, SaveIcon } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveProduct } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types";

const statusItems = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const emptyProduct: Product = {
  id: "",
  slug: "",
  title: "",
  description: "",
  category: "Electronics",
  price: 0,
  stock: 0,
  status: "draft",
  images: [{ src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", alt: "Product image" }],
};

const categoryItems = ["Electronics", "Fashion", "Home", "Industrial", "Audio"].map((item) => ({ label: item, value: item }));

export default function ProductEditorPage({ product = emptyProduct }: { product?: Product }) {
  const router = useRouter();
  const [draft, setDraft] = useState(product);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function persist(status: ProductStatus) {
    setError(null);
    setPending(true);
    try {
      const saved = await saveProduct({
        slug: draft.slug || draft.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title: draft.title,
        description: draft.description,
        category: draft.category,
        price: draft.price,
        stock: draft.stock,
        status,
        imageUrl: draft.images[0]?.src ?? emptyProduct.images[0].src,
        imageAlt: draft.images[0]?.alt ?? draft.title,
      }, product.id || undefined);
      router.push(`/admin/products/${saved.id}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save product.");
      setPending(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/admin/products" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-2")}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold tracking-normal md:text-4xl">{product.id ? "Edit Product" : "New Product"}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={pending} onClick={() => persist("draft")}>Save as Draft</Button>
          <Button disabled={pending} onClick={() => persist("published")}>
            <SaveIcon data-icon="inline-start" />
            {pending ? "Saving..." : "Publish Product"}
          </Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="title">Product Title</FieldLabel>
                  <Input id="title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea id="description" rows={5} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
                </Field>
              </FieldGroup>
              {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between border-b">
              <CardTitle>Media</CardTitle>
              <Button variant="ghost" size="icon-sm" aria-label="Add image">
                <ImagePlusIcon />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <button className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/40 text-center" type="button">
                <CloudUploadIcon className="text-muted-foreground" />
                <span className="font-medium">Drag and drop images here, or click to browse</span>
                <span className="text-sm text-muted-foreground">PNG, JPG up to 10MB</span>
              </button>
              <Field>
                <FieldLabel htmlFor="image-url">Image URL</FieldLabel>
                <Input id="image-url" type="url" value={draft.images[0]?.src ?? ""} onChange={(event) => setDraft({ ...draft, images: [{ src: event.target.value, alt: draft.images[0]?.alt ?? draft.title }] })} />
              </Field>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {product.images.concat(product.images).slice(0, 3).map((image, index) => (
                  <div key={`${image.src}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    <Image src={image.src} alt={image.alt} fill unoptimized sizes="25vw" className="object-cover" />
                    {index === 0 ? <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">MAIN</span> : null}
                  </div>
                ))}
                <button className="flex aspect-square items-center justify-center rounded-lg border border-dashed text-muted-foreground" type="button">
                  <ImagePlusIcon />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel>Category</FieldLabel>
                  <Select items={categoryItems} value={draft.category} onValueChange={(value) => value && setDraft({ ...draft, category: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoryItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select items={statusItems} value={draft.status} onValueChange={(value) => value && setDraft({ ...draft, status: value as ProductStatus })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statusItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <Field>
                <FieldLabel htmlFor="price">Retail Price</FieldLabel>
                <Input id="price" type="number" min="0" step="0.01" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} />
              </Field>
              <Field className="mt-4">
                <FieldLabel htmlFor="stock">Stock</FieldLabel>
                <Input id="stock" type="number" min="0" step="1" value={draft.stock} onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })} />
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
