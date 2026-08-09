import { TerminalIcon } from "lucide-react";

export default function AdminPlatformName() {
  return (
    <div className="flex items-center gap-3 px-2 py-3">
      <div className="relative flex size-10 items-center justify-center border border-sidebar-primary bg-sidebar-primary/10 text-sidebar-primary">
        <TerminalIcon />
        <span className="absolute -bottom-1 -right-1 size-2 bg-secondary" />
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate font-heading text-lg font-black uppercase tracking-[-0.05em] text-sidebar-primary">DplugVIP</p>
        <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-sidebar-foreground/60">Command node</p>
      </div>
    </div>
  );
}
