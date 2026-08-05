"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
    <div className="flex min-h-[60svh] items-center justify-center px-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Checking your session...
      </div>
    </div>
  );
}

function UnauthorizedState({ area, returnTo }: { area: ProtectedRouteProps["area"]; returnTo: string }) {
  const loginHref = withReturnTo("/login", returnTo);
  const registerHref = withReturnTo("/register", returnTo);
  const isAdmin = area === "admin";

  return (
    <div className="flex min-h-[60svh] items-center justify-center px-4 py-10">
      <Empty className="max-w-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LockIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>{isAdmin ? "Admin access required" : "Sign in to continue"}</EmptyTitle>
          <EmptyDescription>
            {isAdmin
              ? "Use the seeded admin account to manage products, settings, and conversations."
              : "Customers need an account before starting or continuing a conversation."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button render={<Link href={loginHref} />}>Login</Button>
            {!isAdmin ? (
              <Button variant="outline" render={<Link href={registerHref} />}>
                Register
              </Button>
            ) : null}
          </div>
        </EmptyContent>
      </Empty>
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
