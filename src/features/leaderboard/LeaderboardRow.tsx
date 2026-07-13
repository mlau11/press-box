import { Ticker } from "@/components/ui/typography";
import { Link } from "react-router-dom";
import type { LeaderboardEntry } from "./hooks/useLeaderboard";

export default function LeaderboardRow({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
}) {
  return (
    <Link
      to={`/profile/${entry.username}`}
      className={[
        "grid grid-cols-[40px_1fr_100px_80px] gap-3 px-4 py-3 items-center",
        "border-b border-border transition-colors",
        "hover:bg-surface-5",
        isCurrentUser
          ? "bg-[color-mix(in_oklch,var(--accent)_8%,transparent)] border-l-[3px] border-l-accent"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-lg leading-none tabular-nums text-foreground-dim">
        {rank}
      </span>

      <span className="text-sm font-medium text-foreground truncate">
        {entry.username}
        {isCurrentUser && <Ticker className="ml-2 text-accent">YOU</Ticker>}
      </span>

      <span className="tabular-nums text-sm text-right text-foreground-muted">
        {entry.avg_points_per_prediction}
      </span>

      <span className="text-lg leading-none tabular-nums text-right">
        {entry.total_points}
      </span>
    </Link>
  );
}
