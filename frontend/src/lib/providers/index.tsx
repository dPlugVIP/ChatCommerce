"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { AdminAuthProvider } from "./auth";
import { CustomerAuthProvider } from "./customer-auth";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ classNames: { toast: "font-sans" } }} richColors />
          </TooltipProvider>
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </QueryProvider>
  );
}
