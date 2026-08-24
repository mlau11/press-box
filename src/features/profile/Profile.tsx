import { StatCell } from "@/components/ui/stat-cell";
import { Label } from "@/components/ui/typography";
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
  const { data: recentPicks, isLoading: recentPicksLoading } = useRecentPicks(
    profile?.id,
  );

  const isOwnProfile =
    !!user?.username && user.username.toLowerCase() === username?.toLowerCase();
  const isLoading = profileLoading || statsLoading || recentPicksLoading;
  const scoredPredictions = stats?.scored_predictions ?? 0;
  const totalPredictions = stats?.total_predictions ?? 0;

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-sm text-foreground-muted">User not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="bg-surface-1 rounded-xs overflow-hidden flex flex-col gap-2 p-8">
        <div className="p-4 flex flex-col gap-1">
          <Label>Predictor</Label>
          <h1 className="text-[52px] leading-[1.3] tracking-[0.02em] truncate">
            {profile.username}
          </h1>
          <Label>Joined {formatJoinDate(profile.created_at)}</Label>
        </div>

        {totalPredictions > 0 && stats ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 bg-surface-2">
              <StatCell
                topLabel="Predictions"
                value={totalPredictions}
                bottomLabel="Submitted"
              />
              <StatCell
                topLabel="Predictions"
                value={scoredPredictions}
                bottomLabel="Scored"
              />
              <StatCell
                topLabel="Total points"
                value={stats.total_points}
                bottomLabel="Last 100 picks"
              />
              <StatCell
                topLabel="Avg points"
                value={stats.avg_points_per_prediction}
                bottomLabel="Per prediction"
              />
              <StatCell
                topLabel="Accuracy"
                value={`${stats.accuracy_pct}%`}
                bottomLabel="Correct results"
              />
            </div>

            {recentPicks && recentPicks.length > 0 && (
              <RecentPicks picks={recentPicks} />
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-sm font-medium mb-1">No predictions yet</p>
            <p className="text-sm text-foreground-muted mb-4">
              {isOwnProfile
                ? "Head to fixtures to make your first prediction."
                : `${profile.username} hasn't made any predictions yet.`}
            </p>
            {isOwnProfile && (
              <Link
                to="/"
                className="inline-block text-sm px-4 py-2 rounded-md bg-surface-4 hover:bg-surface-5 transition-colors"
              >
                Go to fixtures
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
