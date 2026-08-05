"use client";

import { BellIcon, SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center gap-3 border-b bg-background px-4 md:px-6">
      <SidebarTrigger />
      <div className="hidden w-full max-w-md md:block">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search products or conversations..." />
        </InputGroup>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <BellIcon />
        </Button>
        <Avatar className="size-9">
          <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" />
          <AvatarFallback>AP</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
