"use client";

import Image from "next/image";
import Link from "next/link";
import {LayoutDashboard, BookOpen, BarChart3, Mic} from "lucide-react";

import {authClient} from "@/lib/auth-client";

import {Skeleton} from "./ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Topics",
    href: "/topics",
    icon: BookOpen,
  },
  {
    label: "Learning Path",
    href: "/learning-path",
    icon: Mic,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

const AppSidebar = () => {
  const {data: session, isPending: loading} = authClient.useSession();

  if (loading) {
    return <Skeleton className="w-full h-20" />;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  src="/logo.png"
                  alt="logo"
                  height={40}
                  width={40}
                  className="size-4"
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">AI Interview Preparation</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {session !== null && (
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
