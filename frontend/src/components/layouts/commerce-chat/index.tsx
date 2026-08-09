import Link from "next/link";
import { LayoutGridIcon, MessageSquareIcon } from "lucide-react";

import { SystemBrand, SystemStatus } from "@/components/gui/system";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CommerceChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="system-scanlines flex min-h-screen flex-col bg-background">
      <header className="flex h-18 items-center gap-5 border-b-2 border-primary bg-background/90 px-4 backdrop-blur md:px-8">
        <SystemBrand />
        <nav className="hidden h-full items-stretch font-mono text-[10px] uppercase tracking-[0.16em] md:flex">
          <Link href="/" className="flex items-center gap-2 px-4 text-muted-foreground hover:text-primary"><LayoutGridIcon /> Catalog</Link>
          <Link href="/chat" className="flex items-center gap-2 border-b-2 border-primary px-4 text-primary"><MessageSquareIcon /> Uplink</Link>
        </nav>
        <SystemStatus className="ml-auto" />
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-auto rounded-none font-mono text-[10px] uppercase sm:ml-0")}>Exit channel</Link>
      </header>
      {children}
    </div>
  );
}
