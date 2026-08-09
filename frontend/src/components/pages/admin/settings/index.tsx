"use client";

import Image from "next/image";
import { CheckIcon, RadioIcon, SaveIcon, StoreIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { BrandAssetField } from "@/components/gui/brand-asset-field";
import { TelemetryLabel } from "@/components/gui/system";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  getAdminBranding,
  saveAdminBranding,
  type BrandAssetKind,
  type BrandAssetUpload,
} from "@/lib/api/admin";
import { fallbackBranding } from "@/lib/api/branding";
import { brandingQueryKey } from "@/lib/providers/branding";
import type { BusinessSettings } from "@/types";

const colors = ["#00e7f2", "#93ff00", "#ff3df2", "#ff4d00"];

function withAsset(settings: BusinessSettings, asset: BrandAssetUpload): BusinessSettings {
  const fields: Record<BrandAssetKind, Partial<BusinessSettings>> = {
    logo: { logoUrl: asset.url, logoPublicId: asset.public_id },
    brand_mark: { brandMarkUrl: asset.url, brandMarkPublicId: asset.public_id },
    favicon: { faviconUrl: asset.url, faviconPublicId: asset.public_id },
  };
  return { ...settings, ...fields[asset.kind] };
}

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState<BusinessSettings>(fallbackBranding);
  const [draft, setDraft] = useState<BusinessSettings>(fallbackBranding);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminBranding()
      .then((settings) => {
        setSaved(settings);
        setDraft(settings);
      })
      .catch((caught) => toast.error(caught instanceof Error ? caught.message : "Unable to load branding."))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    try {
      const next = await saveAdminBranding(draft);
      setSaved(next);
      setDraft(next);
      await queryClient.invalidateQueries({ queryKey: brandingQueryKey });
      toast.success("Brand signals synchronized.");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Unable to save branding.");
    } finally {
      setSaving(false);
    }
  }

  const previewMark = draft.brandMarkUrl ?? draft.logoUrl;

  return (
    <div className="grid gap-8 pb-24 xl:grid-cols-[1fr_420px]">
      <div className="flex flex-col gap-8">
        <div>
          <TelemetryLabel>Identity transmission module</TelemetryLabel>
          <h1 className="mt-2 font-heading text-3xl font-black uppercase tracking-[-0.04em] md:text-5xl">Brand control</h1>
          <p className="mt-2 max-w-2xl font-mono text-xs uppercase leading-6 tracking-[0.1em] text-muted-foreground">
            Upload the identity assets propagated to access terminals, navigation chrome, admin nodes, and browser metadata.
          </p>
        </div>

        <Card className="rounded-none">
          <CardHeader className="border-b">
            <CardTitle className="font-heading uppercase">Operator identity</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="store-name">Business name</FieldLabel>
                <Input id="store-name" disabled={loading} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
              </Field>
              <Field>
                <FieldLabel htmlFor="support-email">Support email</FieldLabel>
                <Input id="support-email" disabled={loading} type="email" value={draft.supportEmail} onChange={(event) => setDraft({ ...draft, supportEmail: event.target.value })} />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="border-b">
            <CardTitle className="font-heading uppercase">Asset matrix</CardTitle>
            <CardDescription>Files upload immediately to secured media storage. Save changes to activate them across the network.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <BrandAssetField kind="logo" label="Primary logo" description="Transparent PNG, WebP, or JPEG. Used as the primary brand source and fallback mark. Maximum 4MB." value={draft.logoUrl} onUploaded={(asset) => setDraft((current) => withAsset(current, asset))} />
              <BrandAssetField kind="brand_mark" label="Compact brand mark" description="Square transparent asset recommended. Replaces the terminal placeholder in headers and the admin sidebar." value={draft.brandMarkUrl} onUploaded={(asset) => setDraft((current) => withAsset(current, asset))} />
              <BrandAssetField kind="favicon" label="Browser favicon" description="Square PNG, ICO, or WebP. Used by browser tabs and app metadata." value={draft.faviconUrl} onUploaded={(asset) => setDraft((current) => withAsset(current, asset))} />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="border-b">
            <CardTitle className="font-heading uppercase">Signal color</CardTitle>
            <CardDescription>Updates primary actions, active navigation, telemetry rails, and system brackets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Primary color</FieldLabel>
              <div className="flex flex-wrap items-center gap-3">
                {colors.map((color) => (
                  <button key={color} type="button" className="flex size-11 items-center justify-center border border-white/20" style={{ backgroundColor: color }} aria-label={`Select ${color}`} onClick={() => setDraft({ ...draft, primaryColor: color })}>
                    {color === draft.primaryColor ? <CheckIcon className="text-black" /> : null}
                  </button>
                ))}
                <Input className="w-32 uppercase" value={draft.primaryColor} onChange={(event) => setDraft({ ...draft, primaryColor: event.target.value })} />
              </div>
            </Field>
          </CardContent>
        </Card>
      </div>

      <aside className="xl:sticky xl:top-8 xl:h-fit">
        <Card className="rounded-none border-primary/40 bg-[#040a0f]">
          <CardHeader className="border-b border-primary/30">
            <TelemetryLabel>Live identity scan</TelemetryLabel>
            <CardTitle className="font-heading uppercase">Deployment preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="hud-grid flex min-h-72 flex-col items-center justify-center border border-border bg-background p-8 text-center">
              <div className="relative flex size-32 items-center justify-center overflow-hidden border border-primary bg-primary/5">
                {previewMark ? <Image src={previewMark} alt="Brand mark preview" fill unoptimized sizes="128px" className="object-contain p-4" /> : <StoreIcon className="size-12 text-primary" />}
                <span className="absolute bottom-2 right-2 size-3 bg-secondary" />
              </div>
              <p className="mt-5 font-heading text-3xl font-black uppercase tracking-[-0.05em]">{draft.name}</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">Identity node synchronized</p>
            </div>
            <div className="flex items-center justify-between border border-border px-4 py-3 font-mono text-[10px] uppercase">
              <span className="text-muted-foreground">Favicon signal</span>
              <span className="flex items-center gap-2 text-secondary"><RadioIcon className="size-3" />{draft.faviconUrl ? "Configured" : "Fallback"}</span>
            </div>
          </CardContent>
        </Card>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-end gap-3 border-t bg-background/90 p-4 backdrop-blur md:left-64">
        <Button variant="outline" className="rounded-none font-mono text-xs uppercase" disabled={saving} onClick={() => setDraft(saved)}>Discard</Button>
        <Button className="chamfer rounded-none font-mono text-xs uppercase" disabled={saving || loading} onClick={() => void save()}>
          <SaveIcon data-icon="inline-start" />
          {saving ? "Synchronizing..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
