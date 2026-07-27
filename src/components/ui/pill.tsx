import { cn } from "@/lib/utils";

type PillVariant = "success" | "destructive" | "neutral";

type PillSize = "sm" | "md";

const variantClasses: Record<PillVariant, string> = {
  success: "bg-success/15 text-success border border-success/20",
  destructive:
    "bg-destructive/15 text-destructive border border-destructive/20",
  neutral: "bg-surface-1 text-foreground-muted border border-border",
};

const sizeClasses: Record<PillSize, string> = {
  sm: "px-2 py-0.5 text-2xs tracking-[0.02em]",
  md: "px-3 py-1 text-xs tracking-[0.02em]",
};

export function Pill({
  variant = "neutral",
  size = "sm",
  children,
  className,
}: {
  variant?: PillVariant;
  size?: PillSize;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full leading-none",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "w-1.5 h-1.5 rounded-full bg-current inline-block",
        className,
      )}
    />
  );
}
