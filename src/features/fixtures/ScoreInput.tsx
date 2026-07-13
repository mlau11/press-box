import NumberFlow from "@number-flow/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreInputProps {
  value: string;
  onChange: (value: string) => void;
  isEditable: boolean;
  animated: boolean;
  onAnimationsStart?: () => void;
  onAnimationsFinish?: () => void;
  ariaLabel?: string;
}

export function ScoreInput({
  value,
  onChange,
  isEditable,
  ariaLabel,
}: ScoreInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCaret, setShowCaret] = useState(true);

  const numericValue = value === "" ? 0 : parseInt(value) || 0;

  const handleInput: React.FormEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    const val = el.value;
    if (val === "" || /^[0-9]{0,2}$/.test(val)) {
      onChange(val);
    } else {
      el.value = value;
    }
  };

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
