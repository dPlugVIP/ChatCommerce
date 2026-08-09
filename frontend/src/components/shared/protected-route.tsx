"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FingerprintIcon, LockIcon } from "lucide-react";

import { GuiPanel, SystemBrand, SystemFooter, SystemStatus, TelemetryLabel } from "@/components/gui/system";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useAdminAuth } from "@/lib/providers/auth";
import { useCustomerAuth } from "@/lib/providers/customer-auth";
import { withReturnTo } from "@/lib/routing";
import { cn } from "@/lib/utils";

type ProtectedRouteProps = {
  children: React.ReactNode;
  area: "admin" | "customer";
};

function currentReturnTo(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function LoadingState() {
  return (
    <div className="hud-grid flex min-h-screen items-center justify-center px-6">
      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-primary">
        <Spinner />
        <span><span className="sr-only">Checking your session...</span>Verifying clearance...</span>
      </div>
    </div>
  );
}

function UnauthorizedState({ area, returnTo }: { area: ProtectedRouteProps["area"]; returnTo: string }) {
  const loginHref = withReturnTo("/login", returnTo);
  const registerHref = withReturnTo("/register", returnTo);
  const isAdmin = area === "admin";

  return (
    <div className="system-scanlines flex min-h-screen flex-col bg-background">
      <header className="flex h-18 items-center justify-between border-b-2 border-primary px-4 md:px-8">
        <SystemBrand />
        <SystemStatus />
      </header>
      <div className="hud-grid flex flex-1 items-center justify-center px-4 py-10">
      <GuiPanel className="w-full max-w-xl p-0 bg-background/95" label="Access boundary">
      <Empty className="border-0 px-6 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            {isAdmin ? <LockIcon aria-hidden="true" /> : <FingerprintIcon aria-hidden="true" />}
          </EmptyMedia>
          <TelemetryLabel>Authorization required</TelemetryLabel>
          <EmptyTitle>{isAdmin ? "Admin access required" : "Sign in to continue"}</EmptyTitle>
          <EmptyDescription>
            {isAdmin
              ? "Present command credentials to access inventory, configuration, and transmission controls."
              : "This catalog is not public. Present an authorized identity before browsing restricted inventory."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href={loginHref} className={cn(buttonVariants(), "chamfer rounded-none font-mono text-xs uppercase tracking-[0.14em]")}>Login</Link>
            {!isAdmin ? (
              <Link href={registerHref} className={cn(buttonVariants({ variant: "outline" }), "rounded-none font-mono text-xs uppercase tracking-[0.14em]")}>
                Register
              </Link>
            ) : null}
          </div>
        </EmptyContent>
      </Empty>
      </GuiPanel>
      </div>
      <SystemFooter />
    </div>
  );
}

export function ProtectedRoute({ children, area }: ProtectedRouteProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const admin = useAdminAuth();
  const customer = useCustomerAuth();
  const session = area === "admin" ? admin : customer;
  const returnTo = currentReturnTo(pathname, searchParams);

  if (session.isLoading) return <LoadingState />;
  if (!session.isAuthenticated) return <UnauthorizedState area={area} returnTo={returnTo} />;

  return children;
}
