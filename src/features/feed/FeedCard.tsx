import { Pill } from "@/components/ui/pill";
import { Label } from "@/components/ui/typography";
import { leagueLabel } from "@/constants";
import { formatDate } from "@/utils/formatDate";
import { Link } from "react-router-dom";
import type { FeedItem } from "./hooks/useFeed";

const outcomeVariant = (outcome: string | null) => {
  if (outcome === "exact") return "success";
  if (outcome === "correct_result") return "neutral";
  return "destructive";
};

const outcomeLabel: Record<string, string> = {
  exact: "Exact",
  correct_result: "Correct",
  wrong: "Wrong",
};

const pointsLabel: Record<string, string> = {
  exact: "+3",
  correct_result: "+1",
  wrong: "0",
};

export default function FeedCard({ item }: { item: FeedItem }) {
  const hasOutcome = item.is_scored && item.outcome != null;

  return (
    <div className="bg-surface-1 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
        <Link
          to={`/profile/${item.username}`}
          className="flex flex-col min-w-0 hover:opacity-80 transition-opacity"
        >
          <span className="text-sm font-medium text-foreground truncate">
            {item.username}
          </span>
          <Label className="truncate">
            {leagueLabel[item.league_code] ?? item.league_code} · MD{" "}
            {item.matchday} · {formatDate(item.created_at)}
          </Label>
        </Link>

        {item.is_scored ? (
          hasOutcome ? (
            <div className="flex items-center gap-2 shrink-0">
              <Pill variant={outcomeVariant(item.outcome)} size="sm">
                {outcomeLabel[item.outcome as string]}
              </Pill>
              <span className="text-sm font-medium text-foreground tabular-nums">
                {pointsLabel[item.outcome as string]} pts
              </span>
            </div>
          ) : (
            <Label className="shrink-0">Scoring…</Label>
          )
        ) : (
          <Label className="shrink-0">Pending</Label>
        )}
      </div>

      {/* Score section */}
      <div className="px-4 py-4 border-t border-border">
        <div className="grid grid-cols-[1fr_180px_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <img
              src={item.home_crest}
              alt={item.home_short_name}
              className="w-9 h-9 object-contain"
            />
            <Label>{item.home_short_name}</Label>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-0.5">
                <Label className="text-2xs">Predicted</Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl leading-none tabular-nums text-foreground">
                    {item.predicted_home}
                  </span>
                  <span className="text-xl text-foreground-dim leading-none mb-0.5">
                    –
                  </span>
                  <span className="text-xl leading-none tabular-nums text-foreground">
                    {item.predicted_away}
                  </span>
                </div>
              </div>

              {item.is_scored &&
                item.home_score != null &&
                item.away_score != null && (
                  <>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex flex-col items-center gap-0.5">
                      <Label className="text-2xs">Final</Label>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl leading-none tabular-nums text-foreground-muted">
                          {item.home_score}
                        </span>
                        <span className="text-xl text-foreground-dim leading-none mb-0.5">
                          –
                        </span>
                        <span className="text-xl leading-none tabular-nums text-foreground-muted">
                          {item.away_score}
                        </span>
                      </div>
                    </div>
                  </>
                )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <img
              src={item.away_crest}
              alt={item.away_short_name}
              className="w-9 h-9 object-contain"
            />
            <Label>{item.away_short_name}</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
