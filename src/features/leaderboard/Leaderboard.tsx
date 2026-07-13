import { Button } from "@/components/ui/button";
import { Ticker } from "@/components/ui/typography";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useProfileStats } from "@/features/profile/hooks/useProfile";
import { Medal, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useLeaderboard } from "./hooks/useLeaderboard";
import LeaderboardRow from "./LeaderboardRow";
import LeaderboardSkeleton from "./LeaderboardSkeleton";

function PodiumCard({
  entry,
  rank,
}: {
  entry: {
    username: string;
    total_points: number;
    avg_points_per_prediction: number;
  };
  rank: 1 | 2 | 3;
}) {
  const medal =
    rank === 1 ? (
      <Trophy className="w-8 h-8 text-amber-400" />
    ) : rank === 2 ? (
      <Medal className="w-7 h-7 text-zinc-400" />
    ) : (
      <Medal className="w-7 h-7 text-amber-700" />
    );
  return (
    <div
      className={[
        "relative bg-surface-3 border border-border rounded-lg overflow-hidden",
        "p-6 flex flex-col items-center text-center",
        rank === 1 ? "md:scale-105 md:-translate-y-2 border-accent/30" : "",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="absolute -top-6 -right-3 text-[180px] leading-none opacity-[0.05] pointer-events-none select-none"
      >
        {rank}
      </span>
      <div className="relative flex flex-col items-center gap-2">
        <div className="text-3xl">{medal}</div>
        <div className="font-medium">{entry.username}</div>
        <div className="flex items-baseline gap-2">
          <span
            className="tabular-nums leading-none"
            style={{ fontSize: rank === 1 ? 64 : 48 }}
          >
            {entry.total_points}
          </span>
          <Ticker>PTS</Ticker>
        </div>
        <Ticker>
          <span>{entry.avg_points_per_prediction}</span> avg per pick
        </Ticker>
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

    if (totalPredictions >= 5 && scoredPredictions < 5) {
      return (
        <div className="text-center py-6 mb-4 rounded-lg border border-dashed border-border">
          <Ticker className="block mb-1">ALMOST THERE</Ticker>
          <p className="text-sm text-foreground-muted">
            You've made {totalPredictions} predictions. You'll appear once
            they're scored after matches finish.
          </p>
        </div>
      );
    }

    if (scoredPredictions > 0 && scoredPredictions < 5) {
      return (
        <div className="text-center py-6 mb-4 rounded-lg border border-dashed border-border">
          <p className="text-sm font-medium mb-1">
            You're {5 - scoredPredictions} prediction
            {5 - scoredPredictions === 1 ? "" : "s"} away from the leaderboard
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
          <Ticker>Failed to load leaderboard. Please try again later.</Ticker>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-2">
                {podiumOrder.map(([entry, rank]) =>
                  entry ? (
                    <PodiumCard
                      key={entry.username}
                      entry={entry}
                      rank={rank}
                    />
                  ) : null,
                )}
              </div>

              {rest.length > 0 && (
                <div className="border-t-2 border-foreground overflow-hidden">
                  <div className="grid grid-cols-[40px_1fr_100px_80px] gap-3 px-4 py-3 border-b border-border">
                    <span className="text-xs text-foreground-dim">#</span>
                    <span className="text-xs text-foreground-dim">
                      PREDICTOR
                    </span>
                    <span className="text-xs text-foreground-dim text-right">
                      AVG
                    </span>
                    <span className="text-xs text-foreground-dim text-right">
                      PTS
                    </span>
                  </div>
                  <div className="flex flex-col">
                    {rest.map((entry, idx) => (
                      <LeaderboardRow
                        key={entry.user_id}
                        entry={entry}
                        rank={idx + 4}
                        isCurrentUser={entry.user_id === user?.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Ticker>
                  Showing {data.length} predictor{data.length !== 1 ? "s" : ""}{" "}
                  · Five predictions minimum
                </Ticker>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
