import { cn } from "@/lib/utils";

export const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn("text-xs text-foreground-muted tracking-[0.02em]", className)}
  >
    {children}
  </span>
);
