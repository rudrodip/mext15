"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { type DialogProps, DialogTitle } from "@radix-ui/react-dialog";
import { CircleIcon, FileIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Fuse, { type FuseResultMatch } from "fuse.js";
import { docs } from "#site/content";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { marketingConfig } from "@/config/marketing.config";
import { useThemeToggle } from "@/components/theme/toggler";

function highlightFuseMatches(text: string, matches: readonly FuseResultMatch[] | undefined) {
  if (!matches) return text;
  let highlightedText = "";
  let lastIndex = 0;

  matches.forEach((match) => {
    const { indices } = match;
    indices.forEach(([start, end]) => {
      highlightedText += text.slice(lastIndex, start);
      highlightedText += `<span class="bg-foreground text-background">${text.slice(start, end + 1)}</span>`;
      lastIndex = end + 1;
    });
  });

  highlightedText += text.slice(lastIndex);
  return highlightedText;
}

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, toggleTheme } = useThemeToggle();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false);
    setSearchTerm("");
    command();
  }, []);

  const fuseOptions = {
    keys: ["title"],
    includeMatches: true,
    threshold: 0.3,
  };

  const fuseMarketing = new Fuse(marketingConfig.filter((navitem) => !navitem.external), fuseOptions);
  
  const docsWithHeadings = docs.map(doc => ({
    title: doc.title,
    href: `/docs/${doc.slugAsParams}`,
    description: doc.description,
    toc: doc.toc,
  }));

  const fuseDocs = new Fuse(docsWithHeadings, {
    ...fuseOptions,
    keys: ["title", "description"],
    minMatchCharLength: 3,
  });

  const allHeadings = docsWithHeadings.flatMap(doc => {
    const headings = doc.toc?.content.flatMap(heading => [
      heading,
      ...(heading.items || [])
    ]) || [];
    
    return headings.map(heading => ({
      ...heading,
      docTitle: doc.title,
      docHref: doc.href,
    }));
  });

  const fuseHeadings = new Fuse(allHeadings, {
    keys: ["title", "docTitle"],
    includeMatches: true,
    threshold: 0.3,
  });

  const filteredMarketingItems = searchTerm 
    ? fuseMarketing.search(searchTerm).map(result => ({
        ...result.item,
        matches: result.matches,
      }))
    : marketingConfig.filter((navitem) => !navitem.external).map(item => ({
        ...item,
        matches: undefined,
      }));

  const filteredDocsItems = searchTerm
    ? fuseDocs.search(searchTerm).map(result => {
        return {
          ...result.item,
          matches: result.matches,
        };
      })
    : docsWithHeadings.map(item => ({
        ...item,
        matches: undefined,
      }));

  const filteredHeadings = searchTerm
    ? fuseHeadings.search(searchTerm)
    : allHeadings.map(item => ({
        item,
        matches: undefined,
      }));

  const groupedHeadings = filteredHeadings.reduce((acc, heading) => {
    const docTitle = heading.item.docTitle;
    if (!acc[docTitle]) {
      acc[docTitle] = [];
    }
    acc[docTitle].push(heading);
    return acc;
  }, {} as Record<string, Array<typeof filteredHeadings[number]>>);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search documentation...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle>Command Menu</DialogTitle>
        </VisuallyHidden>
        <CommandInput
          ref={inputRef}
          placeholder="Search documentation"
          value={searchTerm}
          onValueChange={(value) => setSearchTerm(value)}
        />
        <CommandList ref={listRef}>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {filteredMarketingItems.length > 0 && (
            <CommandGroup heading="Links">
              {filteredMarketingItems.map((navItem) => (
                <CommandItem
                  key={`link-${navItem.href}`}
                  value={`link-${navItem.href}`}
                  onSelect={() => {
                    runCommand(() => router.push(navItem.href as string));
                  }}
                >
                  <FileIcon className="mr-2 h-4 w-4" />
                  <span dangerouslySetInnerHTML={{ __html: highlightFuseMatches(navItem.title, navItem.matches) }} />
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          
          {filteredDocsItems.length > 0 && (
            <CommandGroup heading="Documentation">
              {filteredDocsItems.map((doc) => (
                <CommandItem
                  key={`doc-${doc.href}`}
                  value={`doc-${doc.href}`}
                  onSelect={() => {
                    runCommand(() => router.push(doc.href));
                  }}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="flex items-center">
                    <FileIcon className="mr-2 h-4 w-4" />
                    <span 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightFuseMatches(doc.title, doc.matches) 
                      }} 
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Object.entries(groupedHeadings)
            .filter(([, headings]) => headings.length > 0)
            .map(([docTitle, headings]) => (
              <CommandGroup key={docTitle} heading={docTitle}>
                {headings.map((result) => (
                  <CommandItem
                    key={`heading-${result.item.docHref}-${result.item.url}-${result.item.title}`}
                    value={`heading-${result.item.docHref}${result.item.url}`}
                    onSelect={() => {
                      runCommand(() => {
                        router.push(result.item.docHref + result.item.url);
                        setOpen(false);
                      });
                    }}
                  >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                      <CircleIcon className="h-3 w-3" />
                    </div>
                    <span 
                      dangerouslySetInnerHTML={{ 
                        __html: highlightFuseMatches(result.item.title, result.matches) 
                      }} 
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => toggleTheme())}>
              {theme === "dark" ? (
                <SunIcon className="mr-2 h-4 w-4" />
              ) : (
                <MoonIcon className="mr-2 h-4 w-4" />
              )}
              Toggle Theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
