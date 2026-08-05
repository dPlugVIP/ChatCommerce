"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminHeader } from "./header";
import { AdminSidebar } from "./sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
