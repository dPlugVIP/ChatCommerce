"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePWA } from "@/lib/providers/pwa-provider";
import { useBranding } from "@/lib/providers/branding";
import { cn } from "@/lib/utils";

interface PWAInstallButtonProps {
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default";
  className?: string;
}

export function PWAInstallButton({
  variant = "ghost",
  size = "icon",
  className,
}: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, promptInstall } = usePWA();
  const { branding } = useBranding();

  if (isInstalled || !isInstallable) return null;

  const handleClick = () => {
    if (isIOS) {
      toast.info(`Tap the Share button, then "Add to Home Screen" to install ${branding.name}.`);
    } else {
      promptInstall();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("relative", className)}
      aria-label="Install app"
    >
      <Download className="size-5" />
    </Button>
  );
}
