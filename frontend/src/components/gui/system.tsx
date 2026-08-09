import Link from "next/link";
import { RadioIcon, ShieldCheckIcon, TerminalIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function SystemBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex min-w-fit items-center gap-3" aria-label="DplugVIP command catalog">
      <span className="relative flex size-9 items-center justify-center border border-primary bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <TerminalIcon aria-hidden="true" />
        <span className="absolute -bottom-1 -right-1 size-2 bg-secondary" />
      </span>
      <span className={cn("font-heading font-black uppercase leading-none tracking-[-0.06em] text-foreground", compact ? "text-lg" : "text-2xl md:text-3xl")}>
        Dplug<span className="text-primary">VIP</span>
      </span>
    </Link>
  );
}

export function SystemStatus({ className }: { className?: string }) {
  return (
    <div className={cn("hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:flex", className)}>
      <span className="flex items-center gap-2 border border-border bg-card px-3 py-2 text-secondary">
        <RadioIcon aria-hidden="true" /> Uplink active
      </span>
      <span className="flex items-center gap-2 border border-primary/50 bg-primary/5 px-3 py-2 text-primary">
        <ShieldCheckIcon aria-hidden="true" /> Clearance 04
      </span>
    </div>
  );
}

export function GuiPanel({ className, children, label, ...props }: React.ComponentProps<typeof Card> & { label?: string }) {
  return (
    <Card className={cn("gui-panel relative rounded-none border-border bg-card/80 shadow-none", className)} {...props}>
      {label ? (
        <span className="absolute -top-px left-4 bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
          [ {label} ]
        </span>
      ) : null}
      {children}
    </Card>
  );
}

export function TelemetryLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary", className)}>[ {children} ]</span>;
}

export function SystemFooter() {
  return (
    <footer className="mt-auto flex flex-col gap-3 border-t border-border px-4 py-5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
      <p>© 2124 DplugVIP // Restricted commerce network</p>
      <div className="flex gap-5">
        <Link href="/terms" className="hover:text-primary">Terms</Link>
        <Link href="/privacy" className="hover:text-primary">Privacy</Link>
        <span className="text-secondary">System nominal</span>
      </div>
    </footer>
  );
}
