"use client";

import Image from "next/image";
import { TerminalIcon } from "lucide-react";

import { useBranding } from "@/lib/providers/branding";

export default function AdminPlatformName() {
  const { branding } = useBranding();
  const mark = branding.brandMarkUrl ?? branding.logoUrl;

  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="relative flex size-10 items-center justify-center border border-sidebar-primary bg-sidebar-primary/10 text-sidebar-primary">
        {mark ? <Image src={mark} alt="" fill unoptimized sizes="40px" className="object-contain p-1" /> : <TerminalIcon />}
        <span className="absolute -bottom-1 -right-1 size-2 bg-secondary" />
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate font-heading text-lg font-black uppercase tracking-[-0.05em] text-sidebar-primary">{branding.name}</p>
        <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-sidebar-foreground/60">Command node</p>
      </div>
    </div>
  );
}
