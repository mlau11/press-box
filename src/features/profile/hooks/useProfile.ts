import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types";
import type { Tables } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";

export interface ProfileStats {
  total_points: number;
  scored_predictions: number;
  total_predictions: number;
  avg_points_per_prediction: number;
  accuracy_pct: number;
}

type PredictionRow = Tables<"predictions">;
type MatchRow = Tables<"matches">;

export type RecentPick = Pick<
  PredictionRow,
  "id" | "predicted_home" | "predicted_away"
> & {
  // guaranteed non-null by the .eq("is_scored", true) filter
  points_earned: NonNullable<PredictionRow["points_earned"]>;
  outcome: NonNullable<PredictionRow["outcome"]>;
  matches: Pick<
    MatchRow,
    | "home_team"
    | "away_team"
    | "home_short_name"
    | "away_short_name"
    | "home_crest"
    | "away_crest"
    | "home_score"
    | "away_score"
    | "kickoff_at"
  >;
};

const fetchProfile = async (username: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username.toLowerCase())
    .single();
  if (error) throw error;
  return data;
};

const fetchProfileStats = async (userId: string): Promise<ProfileStats> => {
  const { data, error } = await supabase.rpc("get_profile_stats", {
    p_user_id: userId,
  });
  if (error) throw error;
  return (
    data?.[0] ?? {
      total_points: 0,
      scored_predictions: 0,
      total_predictions: 0,
      avg_points_per_prediction: 0,
      accuracy_pct: 0,
    }
  );
};

export const useProfile = (username: string | undefined) => {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => fetchProfile(username!),
    enabled: !!username,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProfileStats = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile-stats", userId],
    queryFn: () => fetchProfileStats(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

const fetchRecentPicks = async (userId: string): Promise<RecentPick[]> => {
  const { data, error } = await supabase
    .from("predictions")
    .select(
      `
      id,
      predicted_home,
      predicted_away,
      points_earned,
      outcome, 
      matches (
        home_team,
        away_team,
        home_short_name,
        away_short_name,
        home_crest,
        away_crest,
        home_score,
        away_score,
        kickoff_at
      )
    `,
    )
    .eq("user_id", userId)
    .eq("is_scored", true)
    .order("kickoff_at", { referencedTable: "matches", ascending: false })
    .limit(10);

  if (error) throw error;
  // Scored rows always have points_earned and outcome (enforced by the
  // scored_rows_complete check constraint), which the .eq("is_scored", true)
  // filter above guarantees — but the query builder can't infer that.
  return (data ?? []) as RecentPick[];
};

export const useRecentPicks = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["recent-picks", userId],
    queryFn: () => fetchRecentPicks(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
