import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_points: number;
  avg_points_per_prediction: number;
  accuracy_pct: number;
}

const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase.rpc("get_leaderboard");
  if (error) throw error;
  return data ?? [];
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
    staleTime: 1000 * 60 * 5,
  });
};
