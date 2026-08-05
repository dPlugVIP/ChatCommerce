"use client";

import Link from "next/link";
import { StoreIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex h-20 items-center justify-between border-b px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-3xl font-bold text-primary md:text-4xl">
          <StoreIcon />
          <span>ChatCommerce</span>
        </Link>
        <Link href="/" className="text-sm text-muted-foreground hover:text-primary">Help</Link>
      </header>
      <section className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl p-0">
          <Tabs defaultValue="register">
            <TabsList variant="line" className="grid h-16 w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="login" render={<Link href="/login" />}>Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </Tabs>
          <CardHeader className="items-center gap-3 pt-12 text-center">
            <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
            <p className="text-muted-foreground">Join ChatCommerce to start messaging the business.</p>
          </CardHeader>
          <CardContent className="pb-10">
            <form className="flex flex-col gap-7">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" type="password" placeholder="Password" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <Input id="confirm-password" type="password" placeholder="Confirm password" />
                </Field>
                <Field orientation="horizontal" className="items-start">
                  <Checkbox id="terms" />
                  <FieldLabel htmlFor="terms" className="font-normal">
                    I agree to the <Link href="/terms" className="text-primary">Terms of Service</Link> and{" "}
                    <Link href="/privacy" className="text-primary">Privacy Policy</Link>.
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <Button className="h-12 text-lg" type="button">Register</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
