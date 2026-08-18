"use client";

import { useState } from "react";
import { X, Download, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePWA } from "@/lib/providers/pwa-provider";
import { useBranding } from "@/lib/providers/branding";
import { cn } from "@/lib/utils";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, promptInstall, isBannerDismissed, dismissBanner } =
    usePWA();
  const { branding } = useBranding();
  const [showAndroidTip, setShowAndroidTip] = useState(false);

  if (isInstalled || !isInstallable || isBannerDismissed) return null;

  const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent);

  const handleInstall = () => {
    if (isIOS) {
      toast.info(`Tap the Share button, then "Add to Home Screen" to install ${branding.name}.`);
      return;
    }
    if (isAndroid) {
      setShowAndroidTip(true);
      return;
    }
    promptInstall();
  };

  const handleConfirmInstall = () => {
    setShowAndroidTip(false);
    promptInstall();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none">
      <div className="mx-auto max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-xl pointer-events-auto">
        {showAndroidTip && (
          <div className="flex items-start gap-3 border-b border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p className="flex-1 text-xs leading-relaxed text-amber-400">
              Android may show a security warning — it&apos;s safe to ignore. Tap{" "}
              <span className="font-semibold">&quot;Install anyway&quot;</span> to proceed.
            </p>
            <button
              onClick={() => setShowAndroidTip(false)}
              className="shrink-0 text-amber-500 hover:text-amber-400"
              aria-label="Close tip"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Download className="size-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Install {branding.name}</p>
            <p className="text-xs text-muted-foreground">
              {showAndroidTip
                ? "Ready — tap Install to continue."
                : "Get a faster, app-like experience on your device."}
            </p>
          </div>
          <Button
            size="sm"
            onClick={showAndroidTip ? handleConfirmInstall : handleInstall}
            className={cn("shrink-0 font-semibold", showAndroidTip && "bg-amber-500 text-white hover:bg-amber-600")}
          >
            Install
          </Button>
          <button
            onClick={dismissBanner}
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
