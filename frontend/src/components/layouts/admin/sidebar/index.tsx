"use client";

import { InboxIcon, LayoutDashboardIcon, LogOutIcon, PackageIcon, SettingsIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import AdminPlatformName from "./name";
import { NavGroup, type NavItem } from "./nav-group";

const MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/admin/products", label: "Products", icon: PackageIcon },
  { href: "/admin/inbox", label: "Inbox", icon: InboxIcon },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <div
      style={
        {
          "--sidebar": "#eef3ff",
          "--sidebar-foreground": "#111c2d",
          "--sidebar-accent": "#dbe7ff",
          "--sidebar-accent-foreground": "#004ac6",
          "--sidebar-border": "#c3c6d7",
          "--sidebar-primary": "#004ac6",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-ring": "#004ac6",
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AdminPlatformName />
        </SidebarHeader>
        <SidebarContent>
          <NavGroup items={MAIN_NAV} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Logout">
                <LogOutIcon />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}
