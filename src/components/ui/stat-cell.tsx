import { cn } from "@/lib/utils";
import { Label } from "./typography";

export function StatCell({
  topLabel,
  value,
  bottomLabel,
  className,
}: {
  topLabel: string;
  value: React.ReactNode;
  bottomLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("p-5 flex flex-col gap-1.5", className)}>
      <Label>{topLabel}</Label>
      <div className="text-[40px] leading-none tabular-nums">{value}</div>
      {bottomLabel && <Label>{bottomLabel}</Label>}
    </div>
  );
}
