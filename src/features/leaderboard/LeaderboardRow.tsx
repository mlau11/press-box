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
    <>
      {/* Mobile */}
      <Link
        to={`/profile/${entry.username}`}
        className={cn(
          "md:hidden flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-5",
          isCurrentUser ? "bg-surface-4" : "bg-surface-2",
          showBottomBorder && "border-b border-border",
        )}
      >
        <span className="text-sm text-foreground-muted tabular-nums w-6 shrink-0">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground truncate">
            {entry.username}
            {isCurrentUser && <Pill className="ml-2">You</Pill>}
          </div>
          <div className="text-xs text-foreground-muted tabular-nums">
            {entry.accuracy_pct}% acc ·{" "}
            {entry.avg_points_per_prediction.toFixed(1)} avg
          </div>
        </div>
        <span className="text-base font-semibold tabular-nums shrink-0">
          {entry.total_points}
        </span>
      </Link>

      {/* Tablet + desktop */}
      <Link
        to={`/profile/${entry.username}`}
        className={cn(
          "hidden md:grid grid-cols-subgrid col-span-5 group",
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
    </>
  );
}
