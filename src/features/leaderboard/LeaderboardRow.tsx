import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { LeaderboardEntry } from "./hooks/useLeaderboard";

export default function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
  showBottomBorder,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
  showBottomBorder?: boolean;
}) {
  const baseCell = "transition-colors group-hover:bg-surface-5";
  const mutedBg = isCurrentUser ? "bg-surface-4" : "bg-surface-1";
  const prominentBg = isCurrentUser ? "bg-surface-4" : "bg-surface-2";

  return (
    <Link
      to={`/profile/${entry.username}`}
      className={cn(
        "grid grid-cols-subgrid col-span-5 group",
        showBottomBorder && "border-b border-border",
      )}
    >
      <span
        className={cn(
          "px-4 py-4 text-sm text-foreground-muted tabular-nums",
          baseCell,
          prominentBg,
        )}
      >
        {rank}
      </span>
      <span
        className={cn(
          "px-4 py-4 text-sm font-medium text-foreground truncate",
          baseCell,
          prominentBg,
        )}
      >
        {entry.username}
        {isCurrentUser && <Pill className="ml-2">You</Pill>}
      </span>
      <span
        className={cn(
          "px-4 py-4 text-sm text-right text-foreground tabular-nums",
          baseCell,
          mutedBg,
        )}
      >
        {entry.accuracy_pct}%
      </span>
      <span
        className={cn(
          "px-4 py-4 text-sm text-right text-foreground tabular-nums",
          baseCell,
          mutedBg,
        )}
      >
        {entry.avg_points_per_prediction.toFixed(1)}
      </span>
      <span
        className={cn(
          "px-4 py-4 text-sm text-right font-semibold tabular-nums",
          baseCell,
          prominentBg,
        )}
      >
        {entry.total_points}
      </span>
    </Link>
  );
}
