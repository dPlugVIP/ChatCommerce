"use client";

import Link from "next/link";
import { FingerprintIcon, KeyRoundIcon, LockKeyholeIcon, UserRoundIcon } from "lucide-react";

import { GuiPanel, SystemBrand, SystemFooter, SystemStatus, TelemetryLabel } from "@/components/gui/system";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function AccessTerminal({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

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
            <form className="flex flex-col gap-6">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><UserRoundIcon /> Operative ID</FieldLabel>
                  <Input id="email" type="email" placeholder="ENTER IDENTIFICATION CODE" className="h-12 rounded-none font-mono text-xs uppercase" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><KeyRoundIcon /> Decryption key</FieldLabel>
                  <Input id="password" type="password" placeholder="••••••••••••" className="h-12 rounded-none font-mono" />
                </Field>
                {isRegister ? (
                  <Field>
                    <FieldLabel htmlFor="confirm-password" className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary"><LockKeyholeIcon /> Verify key</FieldLabel>
                    <Input id="confirm-password" type="password" placeholder="REPEAT DECRYPTION KEY" className="h-12 rounded-none font-mono text-xs uppercase" />
                  </Field>
                ) : null}
                {isRegister ? (
                  <Field orientation="horizontal" className="items-start">
                    <Checkbox id="terms" />
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
              <Button className="chamfer h-13 rounded-none font-mono text-xs uppercase tracking-[0.18em]" type="button">
                {isRegister ? "Request clearance" : "Initialize uplink"}
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
