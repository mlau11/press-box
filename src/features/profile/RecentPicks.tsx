import { Pill } from "@/components/ui/pill";
import { Label } from "@/components/ui/typography";
import type { RecentPick } from "./hooks/useProfile";

const outcomeVariant = (points: number) => {
  if (points === 3) return "success";
  if (points === 1) return "success";
  return "destructive";
};

const outcomeLabel = (points: number) => {
  if (points === 3) return "+3";
  if (points === 1) return "+1";
  return "0";
};

function ScoreCol({
  home,
  away,
  label,
}: {
  home: number;
  away: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Label className="leading-none pb-1">{label}</Label>
      <div className="flex items-center gap-1">
        <span className="text-sm tabular-nums text-foreground leading-none">
          {home}
        </span>
        <span className="text-sm text-foreground-dim leading-none">-</span>
        <span className="text-sm tabular-nums text-foreground leading-none">
          {away}
        </span>
      </div>
    </div>
  );
}

export default function RecentPicks({ picks }: { picks: RecentPick[] }) {
  if (picks.length === 0) return null;

  return (
    <div className="rounded-sm px-[18px] py-4">
      <div className="flex justify-between items-center pb-2xs">
        <span className="text-sm font-medium text-foreground">
          Recent picks
        </span>
        <Label>{picks.length} Scored</Label>
      </div>

      <div className="flex flex-col">
        {picks.map((pick) => {
          const m = pick.matches;
          if (!m) return null;
          const hasScore = m.home_score != null && m.away_score != null;

          return (
            <div key={pick.id} className="py-4">
              <div className="grid grid-cols-[1fr_190px_1fr_46px] items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {m.home_crest && (
                    <img
                      src={m.home_crest}
                      alt={m.home_short_name || m.home_team}
                      className="w-5 h-5 object-contain shrink-0"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground truncate">
                    {m.home_short_name}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <ScoreCol
                    home={pick.predicted_home}
                    away={pick.predicted_away}
                    label="Predicted"
                  />

                  {hasScore && (
                    <>
                      <div className="w-px h-7 bg-border" />
                      <ScoreCol
                        home={m.home_score as number}
                        away={m.away_score as number}
                        label="Final"
                      />
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 justify-end min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {m.away_short_name}
                  </span>
                  {m.away_crest && (
                    <img
                      src={m.away_crest}
                      alt={m.away_short_name || m.away_team}
                      className="w-5 h-5 object-contain shrink-0"
                    />
                  )}
                </div>

                <div className="flex justify-end">
                  <Pill
                    variant={outcomeVariant(pick.points_earned)}
                    className="w-[46px] justify-center"
                  >
                    {outcomeLabel(pick.points_earned)}
                  </Pill>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
