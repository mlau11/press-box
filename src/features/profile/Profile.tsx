import { StatCell } from "@/components/ui/stat-cell";
import { Ticker } from "@/components/ui/typography";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { formatJoinDate } from "@/utils/formatDate";
import { Link, useParams } from "react-router-dom";
import {
  useProfile,
  useProfileStats,
  useRecentPicks,
} from "./hooks/useProfile";
import ProfileSkeleton from "./ProfileSkeleton";
import RecentPicks from "./RecentPicks";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { profile: user } = useAuthContext();

  const { data: profile, isLoading: profileLoading } = useProfile(username);
  const { data: stats, isLoading: statsLoading } = useProfileStats(profile?.id);
  const { data: recentPicks } = useRecentPicks(profile?.id);

  const isOwnProfile = user?.username === username;
  const isLoading = profileLoading || statsLoading;
  const scoredPredictions = stats?.scored_predictions ?? 0;
  const totalPredictions = stats?.total_predictions ?? 0;

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-sm text-foreground-muted">User not found.</p>
      </div>
    );
  }

  const initial = profile.username?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-8">
      <div className="border-t-2 border-foreground pt-6 flex items-end gap-6">
        <span className="grid place-items-center w-20 h-20 rounded-full bg-surface-1 border border-border  text-[40px] leading-none text-foreground flex-shrink-0">
          {initial}
        </span>
        <div className="flex flex-col gap-1 min-w-0">
          <Ticker>PREDICTOR</Ticker>
          <h1 className=" text-[52px] leading-none tracking-[0.02em] uppercase truncate">
            {profile.username}
          </h1>
          <Ticker>Joined {formatJoinDate(profile.created_at)}</Ticker>
        </div>
      </div>

      {totalPredictions > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4">
            <StatCell
              topLabel="PREDICTIONS"
              value={totalPredictions}
              bottomLabel="SUBMITTED"
            />
            <StatCell
              topLabel="PREDICTIONS"
              value={scoredPredictions}
              bottomLabel="SCORED"
            />
            <StatCell
              topLabel="TOTAL POINTS"
              value={stats!.total_points}
              bottomLabel="LAST 100 PICKS"
            />
            <StatCell
              topLabel="AVG POINTS"
              value={stats!.avg_points_per_prediction}
              bottomLabel="PER PREDICTION"
            />
          </div>

          {recentPicks && recentPicks.length > 0 && (
            <RecentPicks picks={recentPicks} />
          )}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-lg">
          <p className="text-sm font-medium mb-1">No predictions yet</p>
          <p className="text-sm text-foreground-muted mb-4">
            {isOwnProfile
              ? "Head to fixtures to make your first prediction."
              : `${profile.username} hasn't made any predictions yet.`}
          </p>
          {isOwnProfile && (
            <Link
              to="/"
              className="inline-block  text-sm tracking-[0.06em] uppercase px-4 py-2 rounded-md border border-border hover:border-border-strong transition-colors"
            >
              Go to fixtures
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
