import { InboxIcon, PackageIcon, RadioIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { conversations, products } from "@/lib/mock/chatcommerce";

const stats = [
  { label: "Active products", value: products.filter((product) => product.status === "published").length, icon: PackageIcon },
  { label: "Unread messages", value: conversations.reduce((sum, item) => sum + item.unreadCount, 0), icon: InboxIcon },
  { label: "Open conversations", value: conversations.filter((item) => item.status === "open").length, icon: RadioIcon },
];

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Overview" description="Track the storefront and conversations from one admin workspace." />
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{stat.label}</CardTitle>
                <Icon className="text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
