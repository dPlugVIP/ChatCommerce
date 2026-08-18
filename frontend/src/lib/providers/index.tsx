"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import { AdminAuthProvider } from "./auth";
import { BrandingProvider } from "./branding";
import { CustomerAuthProvider } from "./customer-auth";
import { PWAProvider } from "./pwa-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AdminAuthProvider>
        <CustomerAuthProvider>
          <BrandingProvider>
            <PWAProvider>
              <TooltipProvider>
                {children}
                <Toaster position="top-right" toastOptions={{ classNames: { toast: "font-sans" } }} richColors />
              </TooltipProvider>
            </PWAProvider>
          </BrandingProvider>
        </CustomerAuthProvider>
      </AdminAuthProvider>
    </QueryProvider>
  );
}
