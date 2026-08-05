"use client";

import Link from "next/link";
import { StoreIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
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
          <Tabs defaultValue="login">
            <TabsList variant="line" className="grid h-16 w-full grid-cols-2 rounded-none border-b">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register" render={<Link href="/register" />}>Register</TabsTrigger>
            </TabsList>
          </Tabs>
          <CardHeader className="items-center gap-3 pt-12 text-center">
            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground">Sign in to continue your conversation.</p>
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
              </FieldGroup>
              <div className="flex items-center justify-between gap-4">
                <Link href="/register" className="text-sm text-muted-foreground hover:text-primary">Create account</Link>
                <Link href="/forgot-password" className="text-sm text-primary">Forgot password?</Link>
              </div>
              <Button className="h-12 text-lg" type="button">Login</Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
