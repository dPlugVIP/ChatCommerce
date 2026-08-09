"use client";

import { CheckIcon, SaveIcon, StoreIcon, UploadIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { businessSettings, products } from "@/lib/mock/chatcommerce";
import { TelemetryLabel } from "@/components/gui/system";

const colors = ["#004ac6", "#111c2d", "#006c49", "#93000a"];

export default function AdminSettingsPage() {
  const previewProduct = products[5];

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
      <div className="flex flex-col gap-8">
        <div>
          <TelemetryLabel>Configuration module</TelemetryLabel>
          <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">System configuration</h1>
          <p className="mt-2 max-w-2xl font-mono text-xs uppercase leading-6 tracking-[0.1em] text-muted-foreground">
            Manage operator identity and visual signals for the secure customer interface.
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
                      className="flex size-11 items-center justify-center border"
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
            <div className="gui-panel mx-auto flex h-[560px] max-w-sm flex-col overflow-hidden border-4 border-muted bg-background">
              <div className="flex items-center gap-2 border-b bg-card px-4 py-3">
                <div className="flex size-8 items-center justify-center border border-primary bg-primary/10 text-primary">
                  <StoreIcon />
                </div>
                <span className="font-bold">{businessSettings.name}</span>
              </div>
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                <div className="overflow-hidden border bg-card">
                  <div className="relative h-32 w-full">
                    <Image src={previewProduct.images[0].src} alt={previewProduct.images[0].alt} fill sizes="320px" className="image-tech object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold">{previewProduct.title}</p>
                    <p className="font-bold text-primary">$349.00</p>
                  </div>
                </div>
                <div className="max-w-[85%] border-l-2 border-primary bg-primary/15 px-4 py-3 font-mono text-xs">
                  Do you have these in slate gray?
                </div>
                <div className="max-w-[85%] self-end border-r-2 border-secondary bg-primary px-4 py-3 font-mono text-xs text-primary-foreground">
                  Yes, we do. I can hold one for you today.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
      <div className="fixed inset-x-0 bottom-0 flex justify-end gap-3 border-t bg-background/90 p-4 backdrop-blur md:left-64">
        <Button variant="outline" className="rounded-none font-mono text-xs uppercase">Discard</Button>
        <Button className="chamfer rounded-none font-mono text-xs uppercase">
          <SaveIcon data-icon="inline-start" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
