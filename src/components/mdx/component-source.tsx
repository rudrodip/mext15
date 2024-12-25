"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CodeBlockWrapper } from "@/components/mdx/code-block-wrapper"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
}

export function ComponentSource({
  children,
  className,
}: ComponentSourceProps) {
  return (
    <CodeBlockWrapper
      expandButtonTitle="Expand"
      className={cn("overflow-hidden rounded-xl", className)}
    >
      {children}
    </CodeBlockWrapper>
  )
}
