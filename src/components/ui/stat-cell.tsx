import { cn } from "@/lib/utils";
import { Ticker } from "./typography";

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
    <div
      className={cn(
        "border-r-1 last:border-r-0 border-t-2 border-t-foreground border-b-1 border-b-border border-r-border p-5 flex flex-col gap-1.5",
        className,
      )}
    >
      <Ticker>{topLabel}</Ticker>
      <div className="text-[56px] leading-none tabular-nums">{value}</div>
      {bottomLabel && <Ticker>{bottomLabel}</Ticker>}
    </div>
  );
}
