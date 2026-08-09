import { Suspense } from "react";

import LoginPage from "@/components/pages/auth/login";

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}><LoginPage /></Suspense>;
}
