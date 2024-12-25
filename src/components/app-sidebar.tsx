"use client"

import { Book, FileText, GitFork, Home, ScrollText } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  {
    title: "Documentation",
    url: "/docs",
    icon: Book,
  },
  {
    title: "Installation",
    url: "/docs/installation",
    icon: FileText,
  },
  {
    title: "Components",
    url: "/docs/components",
    icon: Home,
  },
  {
    title: "License",
    url: "/docs/license",
    icon: ScrollText,
  },
  {
    title: "Contribute",
    url: "/docs/contribute",
    icon: GitFork,
  },
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Docs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.url === pathname}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
