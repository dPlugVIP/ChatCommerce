"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, CloudUploadIcon, ImagePlusIcon, SaveIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories, products } from "@/lib/mock/chatcommerce";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const statusItems = [
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export default function ProductEditorPage({ product = products[5] }: { product?: Product }) {
  const categoryItems = categories
    .filter((item) => item !== "All Categories")
    .map((item) => ({ label: item, value: item }));

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href="/admin/products" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-2")}>
            <ArrowLeftIcon data-icon="inline-start" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold tracking-normal md:text-4xl">Edit Product</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button>
            <SaveIcon data-icon="inline-start" />
            Publish Product
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
                  <Input id="title" defaultValue={product.title} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea id="description" rows={5} defaultValue={product.description} />
                </Field>
              </FieldGroup>
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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {product.images.concat(product.images).slice(0, 3).map((image, index) => (
                  <div key={`${image.src}-${index}`} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    <Image src={image.src} alt={image.alt} fill sizes="25vw" className="object-cover" />
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
                  <Select items={categoryItems} defaultValue={product.category}>
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
                  <Select items={statusItems} defaultValue={product.status}>
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
                <Input id="price" type="number" defaultValue={product.price} />
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
