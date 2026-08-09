"use client";

import Image from "next/image";
import { ImageIcon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { uploadBrandAsset, type BrandAssetKind, type BrandAssetUpload } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type BrandAssetFieldProps = {
  kind: BrandAssetKind;
  label: string;
  description: string;
  value?: string;
  onUploaded: (asset: BrandAssetUpload) => void;
};

export function BrandAssetField({ kind, label, description, value, onUploaded }: BrandAssetFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function choose(file?: File) {
    if (!file) return;
    setPending(true);
    setError(null);
    try {
      onUploaded(await uploadBrandAsset(file, kind));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <div className="grid gap-4 border border-border bg-muted/20 p-4 sm:grid-cols-[112px_1fr] sm:items-center">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-primary/40 bg-[#040a0f] text-primary">
          {value ? <Image src={value} alt={`${label} preview`} fill unoptimized sizes="112px" className="object-contain p-3" /> : <ImageIcon className="size-8" />}
          <span className="absolute bottom-1 right-1 size-2 bg-secondary" />
        </div>
        <div className="flex flex-col items-start gap-3">
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/x-icon,.ico"
            onChange={(event) => void choose(event.target.files?.[0])}
          />
          <button
            type="button"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-none font-mono text-xs uppercase")}
            disabled={pending}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon data-icon="inline-start" />
            {pending ? "Uploading signal..." : value ? "Replace asset" : "Upload asset"}
          </button>
          <FieldDescription>{description}</FieldDescription>
          {error ? <p role="alert" className="font-mono text-xs text-destructive">{error}</p> : null}
        </div>
      </div>
    </Field>
  );
}
