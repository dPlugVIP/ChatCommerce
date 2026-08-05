"use client";

import { CheckIcon, SaveIcon, StoreIcon, UploadIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { businessSettings, products } from "@/lib/mock/chatcommerce";

const colors = ["#004ac6", "#111c2d", "#006c49", "#93000a"];

export default function AdminSettingsPage() {
  const previewProduct = products[5];

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-normal md:text-4xl">Business Settings</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Manage your store identity and visual branding for the customer chat interface.
          </p>
        </div>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="store-name">Store Name</FieldLabel>
                <Input id="store-name" defaultValue={businessSettings.name} />
              </Field>
              <Field>
                <FieldLabel>Store Logo</FieldLabel>
                <div className="flex items-center gap-5">
                  <div className="flex size-24 items-center justify-center rounded-lg border bg-muted text-primary">
                    <StoreIcon />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button variant="outline">
                      <UploadIcon data-icon="inline-start" />
                      Change Logo
                    </Button>
                    <FieldDescription>Recommended size: 512x512px. Max 2MB.</FieldDescription>
                  </div>
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="support-email">Support Email</FieldLabel>
                <Input id="support-email" type="email" defaultValue={businessSettings.supportEmail} />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Visual Branding</CardTitle>
            <CardDescription>Used for primary actions, active navigation, and business chat bubbles.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Primary Brand Color</FieldLabel>
                <div className="flex flex-wrap items-center gap-4">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="flex size-11 items-center justify-center rounded-full border"
                      style={{ backgroundColor: color }}
                      aria-label={`Select ${color}`}
                    >
                      {color === businessSettings.primaryColor ? <CheckIcon className="text-white" /> : null}
                    </button>
                  ))}
                  <Input className="w-32 uppercase" defaultValue={businessSettings.primaryColor} />
                </div>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="show-stock">Show stock count publicly</FieldLabel>
                <Switch id="show-stock" defaultChecked />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
      <aside className="xl:sticky xl:top-8 xl:h-fit">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto flex h-[560px] max-w-sm flex-col overflow-hidden rounded-3xl border-8 border-muted bg-background shadow-inner">
              <div className="flex items-center gap-2 border-b bg-card px-4 py-3">
                <div className="flex size-8 items-center justify-center rounded bg-primary/10 text-primary">
                  <StoreIcon />
                </div>
                <span className="font-bold">{businessSettings.name}</span>
              </div>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="overflow-hidden rounded-xl border bg-card">
                  <div className="relative h-32 w-full">
                    <Image src={previewProduct.images[0].src} alt={previewProduct.images[0].alt} fill sizes="320px" className="object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold">{previewProduct.title}</p>
                    <p className="font-bold text-primary">$349.00</p>
                  </div>
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-primary/15 px-4 py-3 text-sm">
                  Do you have these in slate gray?
                </div>
                <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm text-primary-foreground">
                  Yes, we do. I can hold one for you today.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
      <div className="fixed inset-x-0 bottom-0 flex justify-end gap-3 border-t bg-background/90 p-4 backdrop-blur md:left-64">
        <Button variant="outline">Discard</Button>
        <Button>
          <SaveIcon data-icon="inline-start" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
