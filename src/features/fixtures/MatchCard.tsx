import { LiveDot, Pill } from "@/components/ui/pill";
import { Label } from "@/components/ui/typography";
import type { Match } from "@/types";
import { formatKickoff, statusLabel } from "./utils/matches";

interface MatchCardProps {
  match: Match & {
    homeTeam: NonNullable<Match["homeTeam"]>;
    awayTeam: NonNullable<Match["awayTeam"]>;
  };
  isActive?: boolean;
  isPredicted?: boolean;
  onClick?: () => void;
}

export default function MatchCard({
  match,
  isActive = false,
  isPredicted = false,
  onClick,
}: MatchCardProps) {
  const { date, time } = formatKickoff(match.utcDate);
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isPostponed =
    match.status === "POSTPONED" || match.status === "CANCELLED";
  const label = statusLabel(match.status);
  const showScore = isFinished || isLive;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative block w-full text-left transition-colors cursor-pointer",
        "px-5 py-3.5",
        isActive ? "bg-surface-2" : "hover:bg-surface-5 active:bg-surface-4",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Top row — date + time/status */}
      <div className="flex items-center justify-between mb-2.5">
        <Label>{date}</Label>
        <div className="flex items-center gap-2">
          {isPredicted && <Pill variant="neutral">Predicted</Pill>}
          {isLive && label ? (
            <Pill variant="success">
              <LiveDot className="animate-pulse" />
              {label}
            </Pill>
          ) : isPostponed && label ? (
            <Pill variant="neutral">{label}</Pill>
          ) : (
            <Label className={isFinished ? "" : "text-foreground"}>
              {time}
            </Label>
          )}
        </div>
      </div>

      {/* Teams + scores */}
      <div className="flex flex-col gap-1">
        {/* Home */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={match.homeTeam.crest ?? ""}
              alt={match.homeTeam.shortName ?? ""}
              className="w-5 h-5 object-contain flex-shrink-0"
            />
            <span className="text-sm text-foreground truncate">
              {match.homeTeam.shortName}
            </span>
          </div>
          {showScore && (
            <span
              className={`text-sm tabular-nums flex-shrink-0 ${
                isLive ? "text-success" : "text-foreground"
              }`}
            >
              {match.score.fullTime.home ?? 0}
            </span>
          )}
        </div>

        {/* Away */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={match.awayTeam.crest ?? ""}
              alt={match.awayTeam.shortName ?? ""}
              className="w-5 h-5 object-contain flex-shrink-0"
            />
            <span className="text-sm text-foreground truncate">
              {match.awayTeam.shortName}
            </span>
          </div>
          {showScore && (
            <span
              className={`text-sm tabular-nums flex-shrink-0 ${
                isLive ? "text-success" : "text-foreground"
              }`}
            >
              {match.score.fullTime.away ?? 0}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
