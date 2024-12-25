"use client";

import React, { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";

export const CopyButton = ({ children }: { children: React.ReactNode }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    const sourceCode = extractSourceCode(children);
    await navigator.clipboard.writeText(sourceCode);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  };

  const extractSourceCode = (node: React.ReactNode): string => {
    if (typeof node === "string") {
      return node;
    }
    if (Array.isArray(node)) {
      return node.map(extractSourceCode).join("");
    }
    if (React.isValidElement(node)) {
      const { props } = node;
      // @ts-ignore
      const children = React.Children.map(props.children, extractSourceCode)?.join("");
      return `${children}`;
    }
    return "";
  };

  return (
    <button disabled={isCopied} onClick={copy} className="text-muted-foreground">
      {isCopied ? <CopyCheck size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
    </button>
  );
};
