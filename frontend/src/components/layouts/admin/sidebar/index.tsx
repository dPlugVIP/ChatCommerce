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
    <div>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <AdminPlatformName />
        </SidebarHeader>
        <SidebarContent className="border-t border-sidebar-border pt-4">
          <NavGroup items={MAIN_NAV} />
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border">
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
