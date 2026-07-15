import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Label } from "@/components/ui/typography";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useProfileStats } from "@/features/profile/hooks/useProfile";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useLeaderboard, type LeaderboardEntry } from "./hooks/useLeaderboard";
import LeaderboardRow from "./LeaderboardRow";
import LeaderboardSkeleton from "./LeaderboardSkeleton";

function PodiumCard({
  entry,
  rank,
  isCurrentUser,
}: {
  entry: LeaderboardEntry;
  rank: 1 | 2 | 3;
  isCurrentUser: boolean;
}) {
  const sizeClasses = {
    1: "py-8 px-6",
    2: "py-6 px-6",
    3: "py-6 px-6",
  }[rank];

  const pointsSize = { 1: 64, 2: 44, 3: 44 }[rank];
  const iconSize = { 1: "w-8 h-8", 2: "w-6 h-6", 3: "w-6 h-6" }[rank];

  return (
    <div
      className={cn(
        "relative bg-surface-1 border rounded-lg overflow-hidden",
        sizeClasses,
        "flex flex-col items-center text-center",
        rank === 1 ? "md:scale-105 md:-translate-y-2" : "",
        isCurrentUser ? "border-2 border-foreground" : "border-border",
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -top-8 -right-4 text-[180px] leading-none opacity-[0.05] pointer-events-none select-none"
      >
        {rank}
      </span>

      {isCurrentUser && (
        <div className="absolute top-3 left-3">
          <Pill>You</Pill>
        </div>
      )}

      <div className="relative flex flex-col items-center gap-2">
        <Trophy
          className={cn(iconSize, "text-foreground-muted")}
          aria-hidden="true"
        />
        <div className="font-medium">{entry.username}</div>
        <div className="flex items-baseline gap-2">
          <span
            className="tabular-nums leading-none"
            style={{ fontSize: pointsSize }}
          >
            {entry.total_points}
          </span>
          <Label>PTS</Label>
        </div>
        <Label>
          <span>{entry.avg_points_per_prediction.toFixed(1)}</span> avg per pick
        </Label>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { data: leaderboardData, isLoading, isError } = useLeaderboard();
  const { user } = useAuthContext();

  const isOnLeaderboard = leaderboardData?.some(
    (entry) => entry.user_id === user?.id,
  );
  const { data: profileStats } = useProfileStats(
    user && !isOnLeaderboard ? user.id : undefined,
  );

  const scoredPredictions = profileStats?.scored_predictions ?? 0;
  const totalPredictions = profileStats?.total_predictions ?? 0;

  const renderProgressBanner = () => {
    if (!user || isOnLeaderboard) return null;
    if (totalPredictions === 0) return null;

    if (scoredPredictions === 0) {
      return (
        <div className="text-center py-6 mb-4 rounded-lg border border-dashed border-border">
          <Label className="block mb-1">YOU'RE IN</Label>
          <p className="text-sm text-foreground-muted">
            Your predictions will count toward your score once those matches
            finish.
          </p>
        </div>
      );
    }

    if (scoredPredictions < 5) {
      return (
        <div className="text-center py-6 mb-4 rounded-lg border border-dashed border-border">
          <p className="text-sm font-medium mb-1">
            {5 - scoredPredictions} more scored prediction
            {5 - scoredPredictions === 1 ? "" : "s"} and you'll be eligible for
            the leaderboard
          </p>
          <p className="text-sm text-foreground-muted">
            {scoredPredictions} of 5 scored so far.
          </p>
        </div>
      );
    }

    return null;
  };

  const data = leaderboardData ?? [];
  const podium = data.slice(0, 3);
  const podiumOrder: Array<[(typeof podium)[0] | undefined, 1 | 2 | 3]> = [
    [podium[1], 2],
    [podium[0], 1],
    [podium[2], 3],
  ];
  const rest = data.slice(3);

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8 flex flex-col gap-6">
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : isError ? (
        <p className="py-12 text-center">
          <Label>Failed to load leaderboard. Please try again later.</Label>
        </p>
      ) : (
        <>
          {renderProgressBanner()}

          {data.length === 0 ? (
            <div className="text-center py-24">
              <Trophy className="w-8 h-8 text-foreground-muted mx-auto mb-3" />
              <p className="text-sm font-medium mb-1">No rankings yet</p>
              <p className="text-sm text-foreground-muted mb-4">
                Make at least 5 predictions to start climbing the leaderboard.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/">Go to fixtures</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 my-2 md:hidden">
                {podium.map((entry, i) => (
                  <PodiumCard
                    key={entry.user_id}
                    entry={entry}
                    rank={(i + 1) as 1 | 2 | 3}
                    isCurrentUser={entry.user_id === user?.id}
                  />
                ))}
              </div>

              <div className="hidden md:grid md:grid-cols-3 gap-4 my-2">
                {podiumOrder.map(([entry, rank]) =>
                  entry ? (
                    <PodiumCard
                      key={entry.user_id}
                      entry={entry}
                      rank={rank}
                      isCurrentUser={entry.user_id === user?.id}
                    />
                  ) : null,
                )}
              </div>

              {rest.length > 0 && (
                <div className="rounded-sm overflow-hidden bg-surface-2">
                  <div className="grid grid-cols-[72px_1fr_150px_150px_150px] gap-x-px gap-y-0 bg-border-stronger">
                    <div className="grid grid-cols-subgrid col-span-5 border-b">
                      <span className="text-sm text-foreground-dim px-4 py-3 bg-surface-2">
                        Rank
                      </span>
                      <span className="text-sm text-foreground px-4 py-3 bg-surface-2">
                        Predictor
                      </span>
                      <span className="text-sm text-foreground px-4 py-3 bg-surface-1 text-right">
                        Accuracy
                      </span>
                      <span className="text-sm text-foreground px-4 py-3 bg-surface-1 text-right">
                        Average
                      </span>
                      <span className="text-sm text-foreground px-4 py-3 bg-surface-2 text-right font-medium">
                        Points
                      </span>
                    </div>
                    {rest.map((entry, idx) => {
                      const rank = idx + 4;
                      return (
                        <LeaderboardRow
                          key={entry.user_id}
                          entry={entry}
                          rank={idx + 4}
                          isCurrentUser={entry.user_id === user?.id}
                          showBottomBorder={rank % 10 === 0}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Label>
                  Showing {data.length} predictor
                  {data.length !== 1 ? "s" : ""} · Five predictions minimum
                </Label>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
