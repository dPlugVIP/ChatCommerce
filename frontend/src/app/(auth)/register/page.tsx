import { Suspense } from "react";

import RegisterPage from "@/components/pages/auth/register";

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-background" />}><RegisterPage /></Suspense>;
}
