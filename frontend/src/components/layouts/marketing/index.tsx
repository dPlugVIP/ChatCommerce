import Link from "next/link";
import { MessageSquareIcon, SearchIcon } from "lucide-react";

import { SystemBrand, SystemFooter, SystemStatus } from "@/components/gui/system";
import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="system-scanlines flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b-2 border-primary bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 w-full max-w-[1600px] items-center gap-5 px-4 md:px-8">
          <SystemBrand />
          <nav className="hidden items-stretch self-stretch font-mono text-[11px] uppercase tracking-[0.16em] lg:flex">
            <Link href="/" className="flex items-center border-b-2 border-primary px-5 text-primary">Catalog</Link>
            <Link href="/chat" className="flex items-center px-5 text-muted-foreground hover:text-primary">Secure uplink</Link>
          </nav>
          <div className="mx-auto hidden w-full max-w-md md:block">
            <InputGroup className="h-10 rounded-none border-border bg-muted/40 font-mono text-xs">
              <InputGroupAddon><SearchIcon /></InputGroupAddon>
              <InputGroupInput placeholder="QUERY RESTRICTED INVENTORY..." />
            </InputGroup>
          </div>
          <SystemStatus />
          <Link href="/chat" aria-label="Open secure messages" className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-none")}>
            <MessageSquareIcon />
          </Link>
        </div>
      </header>
      {children}
      <SystemFooter />
    </div>
  );
}
