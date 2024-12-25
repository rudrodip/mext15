import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

export const CodeBlock = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) => {
  return (
    <div className="relative rounded-xl font-mono text-sm">
      <div className="absolute top-3 right-3 z-10">
        <CopyButton>{children}</CopyButton>
      </div>
      <div className="w-full p-[2px]">
        <pre
          className={cn("overflow-x-auto py-4 rounded-md font-mono", className)}
          {...props}
        >
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};
