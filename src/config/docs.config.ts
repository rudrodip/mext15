import { Book, FileText, Home, ScrollText, GitFork } from "lucide-react";
import type { SidebarItem } from "@/types";

export const docsConfig: SidebarItem[] = [
  {
    title: "Documentation",
    href: "/docs",
    icon: Book,
    items: [],
  },
  {
    title: "Installation",
    href: "/docs/installation",
    icon: FileText,
    items: [],
  },
  {
    title: "Components",
    href: "/docs/components",
    icon: Home,
    items: [],
  },
  {
    title: "License",
    href: "/docs/license",
    icon: ScrollText,
    items: [],
  },
  {
    title: "Contribute",
    href: "/docs/contribute",
    icon: GitFork,
    items: [],
  },
]