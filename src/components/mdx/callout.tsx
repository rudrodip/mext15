import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface CalloutProps {
  children?: React.ReactNode;
  type?: "default" | "warning" | "danger" | "info";
}

const CalloutIcon = {
  default: null,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
};

export const CalloutTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="font-medium leading-none tracking-tight">{children}</h5>
);

export const CalloutDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="text-sm [&_p]:leading-relaxed">{children}</div>;

export function Callout({
  children,
  type = "default",
  ...props
}: CalloutProps) {
  const Icon = CalloutIcon[type];

  return (
    <div
      className={cn(
        "my-6 flex items-start rounded-lg border border-l-4 p-3 gap-2",
        {
          "border-red-900 bg-red-50 dark:bg-red-950/50": type === "danger",
          "border-yellow-900 bg-yellow-50 dark:bg-yellow-950/50":
            type === "warning",
          "border-blue-900/50 bg-blue-100 dark:bg-blue-950/50": type === "info",
        }
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn("flex-shrink-0", {
            "stroke-red-900": type === "danger",
            "stroke-yellow-900": type === "warning",
            "stroke-blue-900": type === "info",
          })}
          size={18}
        />
      )}
      <div>{children}</div>
    </div>
  );
}

Callout.Title = CalloutTitle;
Callout.Description = CalloutDescription;
