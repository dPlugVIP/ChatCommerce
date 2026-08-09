"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FingerprintIcon, KeyRoundIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";
import { useState, type FormEvent } from "react";

import { GuiPanel, SystemBrand, SystemFooter, SystemStatus, TelemetryLabel } from "@/components/gui/system";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, register } from "@/lib/api/customer";
import { normalizeReturnTo } from "@/lib/routing";

export function AccessTerminal({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirm-password") ?? "");
    if (isRegister && password !== confirmation) {
      setError("The decryption keys do not match.");
      return;
    }

    setPending(true);
    try {
      const result = isRegister
        ? await register(String(data.get("name") ?? ""), email, password)
        : await login(email, password);
      const requested = normalizeReturnTo(searchParams.get("next"));
      const destination = result.area === "admin"
        ? (requested.startsWith("/admin") ? requested : "/admin")
        : requested;
      window.location.assign(destination);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authorization failed.");
      setPending(false);
    }
  }

  return (
    <main className="system-scanlines flex min-h-screen flex-col bg-background">
      <header className="flex h-18 items-center justify-between border-b-2 border-primary px-4 md:px-8">
        <SystemBrand />
        <SystemStatus />
      </header>
      <section className="hud-grid relative flex flex-1 items-center justify-center overflow-hidden px-4 py-14">
        <div className="absolute left-6 top-6 font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-muted-foreground">Sector: NG-LAG-01<br />Node: Commerce gateway<br />Threat index: nominal</div>
        <GuiPanel className="w-full max-w-xl bg-background/95 p-0 backdrop-blur" label="Secure access">
          <CardHeader className="items-center gap-3 border-b border-border px-6 pb-7 pt-10 text-center">
            <FingerprintIcon className="size-12 text-primary" />
            <TelemetryLabel>{isRegister ? "New operative enrollment" : "Authorization required"}</TelemetryLabel>
            <CardTitle className="font-heading text-3xl font-black uppercase tracking-[-0.04em] md:text-4xl">
              {isRegister ? "Create clearance" : "Identify yourself"}
            </CardTitle>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Terminal ID: DPL-VIP-77 // Session encrypted</p>
          </CardHeader>
          <CardContent className="px-6 py-8 md:px-9">
            <form className="flex flex-col gap-6" onSubmit={submit}>
              <FieldGroup>
                {isRegister ? (
                  <Field>
                    <FieldLabel htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><UserRoundIcon /> Operative name</FieldLabel>
                    <Input id="name" name="name" required minLength={2} autoComplete="name" placeholder="ENTER DISPLAY NAME" className="h-12 rounded-none font-mono text-xs uppercase" />
                  </Field>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><UserRoundIcon /> Operative ID</FieldLabel>
                  <Input id="email" name="email" type="email" required autoComplete="email" placeholder="ENTER IDENTIFICATION CODE" className="h-12 rounded-none font-mono text-xs uppercase" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><KeyRoundIcon /> Decryption key</FieldLabel>
                  <Input id="password" name="password" type="password" required minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="••••••••••••" className="h-12 rounded-none font-mono" />
                </Field>
                {isRegister ? (
                  <Field>
                    <FieldLabel htmlFor="confirm-password" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><LockKeyholeIcon /> Verify key</FieldLabel>
                    <Input id="confirm-password" name="confirm-password" type="password" required minLength={8} autoComplete="new-password" placeholder="REPEAT DECRYPTION KEY" className="h-12 rounded-none font-mono text-xs uppercase" />
                  </Field>
                ) : null}
                {isRegister ? (
                  <Field orientation="horizontal" className="items-start">
                    <Checkbox id="terms" name="terms" required />
                    <FieldLabel htmlFor="terms" className="font-mono text-[10px] font-normal uppercase leading-5 text-muted-foreground">
                      I accept the <Link href="/terms" className="text-primary">network protocols</Link> and data policy.
                    </FieldLabel>
                  </Field>
                ) : null}
              </FieldGroup>
              {!isRegister ? (
                <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.12em]">
                  <span className="text-muted-foreground">Biometric override disabled</span>
                  <Link href="/forgot-password" className="text-primary hover:underline">Reset key</Link>
                </div>
              ) : null}
              {error ? <p role="alert" className="border border-destructive bg-destructive/10 p-3 font-mono text-xs text-destructive">{error}</p> : null}
              <Button className="chamfer h-13 rounded-none font-mono text-xs uppercase tracking-[0.18em]" type="submit" disabled={pending}>
                {pending ? "Verifying..." : isRegister ? "Request clearance" : "Initialize uplink"}
              </Button>
              <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <span className="border border-border px-2 py-1">SYS: LOCKED</span>
                <span className="border border-border px-2 py-1">IP: ENCRYPTED</span>
              </div>
              <p className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {isRegister ? "Existing clearance?" : "No clearance profile?"}{" "}
                <Link href={isRegister ? "/login" : "/register"} className="text-primary hover:underline">{isRegister ? "Authenticate" : "Enroll now"}</Link>
              </p>
            </form>
          </CardContent>
        </GuiPanel>
      </section>
      <SystemFooter />
    </main>
  );
}
