import { cn } from "@/lib/utils";

export const Ticker = ({
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

export const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn("text-xs tracking-[0.16em] text-foreground-muted", className)}
  >
    {children}
  </span>
);
