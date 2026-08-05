import Link from "next/link";
import { SearchIcon, StoreIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export default function CommerceChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-20 items-center gap-4 border-b px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary md:text-4xl">
          <StoreIcon aria-hidden="true" />
          <span>ChatCommerce</span>
        </Link>
        <div className="ml-auto hidden w-full max-w-sm md:block">
          <InputGroup className="rounded-full bg-muted">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search..." />
          </InputGroup>
        </div>
        <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "hidden text-primary md:inline-flex")}>
          Login
        </Link>
        <Link href="/register" className={cn(buttonVariants(), "hidden rounded-sm uppercase tracking-normal md:inline-flex")}>
          Register
        </Link>
      </header>
      {children}
    </div>
  );
}
