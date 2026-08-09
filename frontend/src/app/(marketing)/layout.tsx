import { Suspense } from "react";

import MarketingLayout from "@/components/layouts/marketing";
import { ProtectedRoute } from "@/components/shared/protected-route";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ProtectedRoute area="customer">
        <MarketingLayout>{children}</MarketingLayout>
      </ProtectedRoute>
    </Suspense>
  );
}
