import { supabase } from "@/lib/supabase";
import type { User } from "@/types/index";
import { useQuery } from "@tanstack/react-query";

export interface ProfileStats {
  total_points: number;
  scored_predictions: number;
  total_predictions: number;
  avg_points_per_prediction: number;
  accuracy_pct: number;
}

export interface RecentPick {
  id: string;
  predicted_home: number;
  predicted_away: number;
  points_earned: number;
  outcome: string | null;
  created_at: string;
  matches: {
    home_team: string;
    away_team: string;
    home_short_name: string;
    away_short_name: string;
    home_crest: string | null;
    away_crest: string | null;
    home_score: number | null;
    away_score: number | null;
  } | null;
}

const fetchProfile = async (username: string): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
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
      created_at,
      matches (
        home_team,
        away_team,
        home_short_name,
        away_short_name,
        home_crest,
        away_crest,
        home_score,
        away_score
      )
    `,
    )
    .eq("user_id", userId)
    .eq("is_scored", true)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return (data ?? []) as unknown as RecentPick[];
};

export const useRecentPicks = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["recent-picks", userId],
    queryFn: () => fetchRecentPicks(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
