"use client";

import React from "react";
import { marketingConfig } from "@/config/marketing.config";
import ThemeToggler from "@/components/theme/toggler";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { siteConfig } from "@/config/site.config";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full py-3 px-2 border-b">
      <div className="flex items-center">
        <div className="relative items-center hidden md:flex gap-2">
          <SidebarTrigger />
          {marketingConfig.map((item) => (
            <NavItemComponent
              key={item.title}
              title={item.title}
              href={item.href ?? ""}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" asChild>
            <a href={siteConfig.socials.github} target="_blank">
              <GitHubLogoIcon />
            </a>
          </Button>
          <Button size="icon" variant="ghost" asChild>
            <a href={siteConfig.socials.x} target="_blank">
              <svg
                viewBox="0 0 1200 1227"
                xmlns="http://www.w3.org/2000/svg"
                fill="hsl(var(--foreground))"
                className="size-3"
              >
                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
              </svg>
            </a>
          </Button>
          <ThemeToggler />
        </div>
      </div>
    </nav>
  );
}

const NavItemComponent = ({
  title,
  href,
}: {
  title: string;
  href: string;
}) => {
  const pathname = usePathname();
  const active =
    pathname === href || (pathname.startsWith(href) && href !== "/");

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 text-sm transition-colors",
        active 
          ? "text-foreground font-semibold"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {title}
    </Link>
  );
};
