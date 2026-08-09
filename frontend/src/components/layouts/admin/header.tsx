"use client";

import { BellIcon, SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SystemStatus } from "@/components/gui/system";

export function AdminHeader() {
  return (
    <header className="flex h-18 items-center gap-3 border-b-2 border-primary bg-background/90 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:block">Command console // admin node</span>
      <div className="hidden w-full max-w-md md:block">
        <InputGroup className="rounded-none bg-muted/40 font-mono text-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="QUERY SYSTEM RECORDS..." />
        </InputGroup>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <SystemStatus className="hidden xl:flex" />
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <BellIcon />
        </Button>
        <Avatar className="size-9 rounded-none border border-primary">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
