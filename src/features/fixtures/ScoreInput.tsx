import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";

interface ScoreInputProps {
  value: string;
  isEditable: boolean;
}

export function ScoreInput({ value, isEditable }: ScoreInputProps) {
  const numericValue = value === "" ? 0 : parseInt(value) || 0;

  return (
    <NumberFlow
      value={numericValue}
      format={{ useGrouping: false }}
      animated={true}
      willChange
      className={cn(
        "w-32 rounded-md bg-surface-4 py-6",
        "flex items-center justify-center",
        "h-[112px]",
        "text-center text-[56px] leading-none tabular-nums",
        "text-foreground cursor-default",
        !isEditable && "opacity-60",
      )}
      style={{ fontKerning: "none" }}
    />
  );
}
