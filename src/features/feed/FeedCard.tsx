import { Pill } from "@/components/ui/pill";
import { Ticker } from "@/components/ui/typography";
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
  const initial = item.username?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="border-t-1 border-t-border first:border-t-0 last:border-b-1 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-3 border-b border-border">
        <Link
          to={`/profile/${item.username}`}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0"
        >
          <span className="flex-shrink-0 grid place-items-center w-9 h-9 rounded-full bg-surface-1 border border-border  text-sm leading-none text-foreground">
            {initial}
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[20px] tracking-[0.04em] uppercase text-foreground leading-none">
              {item.username}
            </span>
            <Ticker className="uppercase truncate">
              {leagueLabel[item.league_code] ?? item.league_code} · MD&nbsp;
              {item.matchday} · {formatDate(item.created_at)}
            </Ticker>
          </div>
        </Link>
        {item.is_scored ? (
          <div className="flex justify-center items-center gap-2">
            <Pill variant={outcomeVariant(item.outcome)} size="md">
              {outcomeLabel[item.outcome ?? "wrong"] ?? "WRONG"}
            </Pill>
            <div className="flex justify-center items-baseline gap-1">
              <Ticker className="uppercase truncate text-foreground text-[18px]">
                {pointsLabel[item.outcome ?? "wrong"] ?? "0"}
              </Ticker>
              <Ticker className="uppercase truncate text-sm">Pts</Ticker>
            </div>
          </div>
        ) : (
          <Ticker>PENDING</Ticker>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <img
              src={item.home_crest}
              alt={item.home_short_name}
              className="w-9 h-9 object-contain"
            />
            <Ticker className="uppercase">{item.home_short_name}</Ticker>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Ticker>PREDICTED</Ticker>
            <div className="flex items-baseline gap-2">
              <span className="text-[32px] leading-none tabular-nums">
                {item.predicted_home}
              </span>
              <span className="text-[20px] text-foreground-dim leading-none">
                –
              </span>
              <span className="text-[32px] leading-none tabular-nums">
                {item.predicted_away}
              </span>
            </div>
            {item.is_scored &&
              item.home_score != null &&
              item.away_score != null && (
                <div className="flex flex-col items-center gap-0.5 mt-1">
                  <Ticker>FINAL</Ticker>
                  <span className="text-sm text-foreground-muted tabular-nums">
                    {item.home_score} – {item.away_score}
                  </span>
                </div>
              )}
          </div>

          <div className="flex flex-col items-center gap-1.5 text-center">
            <img
              src={item.away_crest}
              alt={item.away_short_name}
              className="w-9 h-9 object-contain"
            />
            <Ticker className="uppercase">{item.away_short_name}</Ticker>
          </div>
        </div>
      </div>
    </div>
  );
}
