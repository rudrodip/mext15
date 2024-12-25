import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { FolderIcon, FolderOpenIcon, FileIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FileProps = {
  name: string;
  className?: string;
};

export type FolderProps = {
  name: string;
  children: React.ReactNode;
  className?: string;
};

export const File: React.FC<FileProps> = ({ name, className }) => (
  <div className={cn("flex items-center space-x-2 py-1 text-sm hover:bg-muted rounded px-2 -translate-x-2 cursor-pointer", className)}>
    <FileIcon className="h-4 w-4 text-muted-foreground" />
    <span>{name}</span>
  </div>
);

const FolderTrigger: React.FC<{ name: string; className?: string; hasFiles: boolean }> = ({ name, className, hasFiles }) => (
  <AccordionPrimitive.Header className="flex">
    {hasFiles ? (
      <AccordionPrimitive.Trigger
        className={cn("flex flex-1 items-center py-1 text-sm font-medium transition-all hover:no-underline hover:bg-muted rounded px-2 -translate-x-2 group", className)}
      >
        <div className="relative flex items-center">
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90 mr-1" />
          <FolderIcon className="h-4 w-4 text-muted-foreground hidden group-data-[state=closed]:block" />
          <FolderOpenIcon className="h-4 w-4 text-muted-foreground group-data-[state=open]:block hidden" />
          <span className="ml-2">{name}</span>
        </div>
      </AccordionPrimitive.Trigger>
    ) : (
      <div className={cn("flex flex-1 items-center py-1 text-sm font-medium hover:bg-muted rounded px-2 -translate-x-2", className)}>
        <FolderIcon className="h-4 w-4 text-muted-foreground mr-2" />
        <span>{name}</span>
      </div>
    )}
  </AccordionPrimitive.Header>
);

const FolderContent: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => (
  <AccordionPrimitive.Content
    className={cn("pl-2 overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down", className)}
  >
    <div className="pl-4 border-l border-border">{children}</div>
  </AccordionPrimitive.Content>
);

export const Folder: React.FC<FolderProps> = ({ name, children, className }) => {
  const hasFiles = React.Children.count(children) > 0;

  return hasFiles ? (
    <AccordionPrimitive.Item value={name} className={className}>
      <FolderTrigger name={name} hasFiles={hasFiles} />
      <FolderContent>{children}</FolderContent>
    </AccordionPrimitive.Item>
  ) : (
    <FolderTrigger name={name} className={className} hasFiles={hasFiles} />
  );
};

type FilesProps = {
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
};

export const Files: React.FC<FilesProps> = ({ children, defaultValue, className }) => {
  const defaultOpenFolders = defaultValue ? defaultValue.split("/") : undefined;

  return (
    <AccordionPrimitive.Root 
      type="multiple" 
      className={cn("w-full min-w-[250px]", className)} 
      defaultValue={defaultOpenFolders}
    >
      {children}
    </AccordionPrimitive.Root>
  );
};
