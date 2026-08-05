import Link from "next/link";
import { SearchIcon, StoreIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-5 px-4 md:px-8">
          <Link href="/" className="flex min-w-fit items-center gap-2 text-3xl font-bold text-primary md:text-4xl">
            <StoreIcon aria-hidden="true" />
            <span>DplugVIP</span>
          </Link>
          <div className="mx-auto hidden w-full max-w-xl md:block">
            <InputGroup className="h-11 rounded-full bg-muted">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search for products, brands..." />
            </InputGroup>
          </div>
          <nav className="ml-auto flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "text-primary")}>
              Login
            </Link>
            <Link href="/register" className={cn(buttonVariants(), "rounded-full px-5")}>
              Register
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
