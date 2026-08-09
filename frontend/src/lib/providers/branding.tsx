"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { fallbackBranding, getPublicBranding } from "@/lib/api/branding";
import type { BusinessSettings } from "@/types";

type BrandingValue = {
  branding: BusinessSettings;
  isLoading: boolean;
};

const BrandingContext = createContext<BrandingValue>({
  branding: fallbackBranding,
  isLoading: true,
});

export const brandingQueryKey = ["public", "branding"] as const;

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = useQuery({
    queryKey: brandingQueryKey,
    queryFn: getPublicBranding,
    staleTime: 60_000,
    retry: 1,
  });
  const branding = data ?? fallbackBranding;

  useEffect(() => {
    document.documentElement.style.setProperty("--primary", branding.primaryColor);
    document.documentElement.style.setProperty("--sidebar-primary", branding.primaryColor);
  }, [branding.primaryColor]);

  return (
    <BrandingContext.Provider value={{ branding, isLoading: isPending }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
