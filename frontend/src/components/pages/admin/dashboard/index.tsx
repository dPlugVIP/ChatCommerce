import { InboxIcon, PackageIcon, RadioIcon } from "lucide-react";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { GuiPanel, TelemetryLabel } from "@/components/gui/system";
import type { Conversation, Product } from "@/types";

export default function AdminDashboardPage({ products, conversations }: { products: Product[]; conversations: Conversation[] }) {
  const stats = [
    { label: "Active products", value: products.filter((product) => product.status === "published").length, icon: PackageIcon },
    { label: "Messages", value: conversations.reduce((sum, item) => sum + item.messages.length, 0), icon: InboxIcon },
    { label: "Open conversations", value: conversations.filter((item) => item.status === "open").length, icon: RadioIcon },
  ];
  return (
    <>
      <PageHeader title="Overview" description="Track the storefront and conversations from one admin workspace." />
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GuiPanel key={stat.label} label="Live metric">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="font-mono text-xs uppercase tracking-[0.14em]">{stat.label}</CardTitle>
                <Icon className="text-primary" />
              </CardHeader>
              <CardContent>
                <p className="font-heading text-5xl font-black text-primary">{String(stat.value).padStart(2, "0")}</p>
              </CardContent>
            </GuiPanel>
          );
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <GuiPanel className="hud-grid flex min-h-96 items-center justify-center p-8" label="Commerce sensor array">
          <div className="max-w-xl border border-border bg-background/90 p-8 text-center">
            <RadioIcon className="mx-auto size-12 text-primary signal-pulse" />
            <h2 className="mt-5 font-heading text-2xl font-bold uppercase">Network operational</h2>
            <p className="mt-3 font-mono text-xs uppercase leading-6 text-muted-foreground">Catalog telemetry is synchronized. Secure customer channels are accepting transmissions.</p>
            <TelemetryLabel className="mt-6 inline-block text-secondary">System ready</TelemetryLabel>
          </div>
        </GuiPanel>
        <GuiPanel className="p-6" label="Diagnostics">
          <div className="flex flex-col gap-5 pt-3 font-mono text-xs uppercase">
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Uplink strength</span><span className="text-primary">99.8%</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Catalog node</span><span className="text-secondary">Online</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Threat scan</span><span className="text-secondary">Clear</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Data stream</span><span className="text-primary">Active</span></div>
          </div>
        </GuiPanel>
      </div>
    </>
  );
}
