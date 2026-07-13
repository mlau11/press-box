import { Pill } from "@/components/ui/pill";
import { Label } from "@/components/ui/typography";
import type { RecentPick } from "./hooks/useProfile";

const outcomeVariant = (points: number) => {
  if (points === 3) return "success";
  if (points === 1) return "neutral";
  return "destructive";
};

const outcomeLabel = (points: number) => {
  if (points === 3) return "+3";
  if (points === 1) return "+1";
  return "0";
};

function ScoreCol({ score, label }: { score: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 min-w-[52px]">
      <Label className="text-[12px] leading-none">{label}</Label>
      <span className="text-sm tracking-[0.02em] tabular-nums text-foreground leading-none">
        {score}
      </span>
    </div>
  );
}

export default function RecentPicks({ picks }: { picks: RecentPick[] }) {
  if (picks.length === 0) return null;

  return (
    <div className="px-[18px] py-4">
      <div className="flex justify-between items-center pb-[10px] border-b border-dashed border-border">
        <span className="text-sm font-medium text-foreground">
          Recent picks
        </span>
        <Label>{picks.length} SCORED</Label>
      </div>

      <div className="flex flex-col">
        {picks.map((pick) => {
          const m = pick.matches;
          if (!m) return null;
          const hasScore = m.home_score != null && m.away_score != null;

          return (
            <div
              key={pick.id}
              className="py-[10px] border-b border-dashed border-border"
            >
              <div className="grid grid-cols-[1fr_auto_auto_1fr_46px] items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {m.home_crest && (
                    <img
                      src={m.home_crest}
                      alt={m.home_short_name}
                      className="w-5 h-5 object-contain shrink-0"
                    />
                  )}
                  <span className="text-sm font-medium text-foreground truncate">
                    {m.home_short_name}
                  </span>
                </div>

                <ScoreCol
                  score={`${pick.predicted_home}–${pick.predicted_away}`}
                  label="CALLED"
                />

                {hasScore ? (
                  <ScoreCol
                    score={`${m.home_score}–${m.away_score}`}
                    label="FINAL"
                  />
                ) : (
                  <div className="min-w-[52px]" />
                )}

                <div className="flex items-center gap-2 justify-end min-w-0">
                  <span className="text-sm font-medium text-foreground truncate">
                    {m.away_short_name}
                  </span>
                  {m.away_crest && (
                    <img
                      src={m.away_crest}
                      alt={m.away_short_name}
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
