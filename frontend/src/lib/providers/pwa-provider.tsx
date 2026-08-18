"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAContextValue {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  promptInstall: () => Promise<void>;
  isBannerDismissed: boolean;
  dismissBanner: () => void;
}

const PWAContext = createContext<PWAContextValue>({
  isInstallable: false,
  isInstalled: false,
  isIOS: false,
  promptInstall: async () => {},
  isBannerDismissed: true,
  dismissBanner: () => {},
});

const BANNER_DISMISSED_KEY = "dplugvip-pwa-banner-dismissed";

function detectStandalone() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function detectIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(detectStandalone);
  const [isIOS] = useState(detectIOS);
  // iOS has no beforeinstallprompt — treat it as installable via the manual Share sheet flow
  const [isInstallable, setIsInstallable] = useState(() => detectIOS() && !detectStandalone());
  const [isBannerDismissed, setIsBannerDismissed] = useState(
    () => typeof window === "undefined" || localStorage.getItem(BANNER_DISMISSED_KEY) === "true"
  );

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const onInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      deferredPrompt.current = null;
    };
    window.addEventListener("appinstalled", onInstalled);

    const mq =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(display-mode: standalone)")
        : null;
    const onDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) onInstalled();
    };
    mq?.addEventListener("change", onDisplayChange);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-critical — the app still works without offline caching
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
      mq?.removeEventListener("change", onDisplayChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    deferredPrompt.current = null;
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
    localStorage.setItem(BANNER_DISMISSED_KEY, "true");
  }, []);

  return (
    <PWAContext.Provider
      value={{
        isInstallable,
        isInstalled,
        isIOS,
        promptInstall,
        isBannerDismissed,
        dismissBanner,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
