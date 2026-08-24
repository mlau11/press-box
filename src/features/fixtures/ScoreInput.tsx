import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";

interface ScoreInputProps {
  value: number;
  isEditable: boolean;
}

export function ScoreInput({ value, isEditable }: ScoreInputProps) {
  return (
    <NumberFlow
      value={value}
      format={{ useGrouping: false }}
      animated={true}
      willChange
      className={cn(
        "w-32 h-[112px] rounded-xs bg-surface-4 py-6",
        "flex items-center justify-center text-center text-[56px]",
        "leading-none tabular-nums text-foreground cursor-default",
        !isEditable && "opacity-60",
      )}
      style={{ fontKerning: "none" }}
    />
  );
}
