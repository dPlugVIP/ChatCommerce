import { Suspense } from "react";

import CommerceChatLayout from "@/components/layouts/commerce-chat";
import { ProtectedRoute } from "@/components/shared/protected-route";

function SessionFallback() {
  return (
    <div className="flex min-h-[60svh] items-center justify-center px-6 text-sm text-muted-foreground">
      Checking your session...
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CommerceChatLayout>
      <Suspense fallback={<SessionFallback />}>
        <ProtectedRoute area="customer">{children}</ProtectedRoute>
      </Suspense>
    </CommerceChatLayout>
  );
}
