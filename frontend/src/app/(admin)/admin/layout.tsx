import { Suspense } from "react";

import AdminLayout from "@/components/layouts/admin";
import { ProtectedRoute } from "@/components/shared/protected-route";

function SessionFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-sm text-muted-foreground">
      Checking your session...
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SessionFallback />}>
      <ProtectedRoute area="admin">
        <AdminLayout>{children}</AdminLayout>
      </ProtectedRoute>
    </Suspense>
  );
}
