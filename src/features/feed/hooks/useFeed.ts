import { PAGE_SIZE } from "@/constants";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface FeedItem {
  prediction_id: string;
  user_id: string;
  username: string;
  match_id: number;
  league_code: string;
  matchday: number;
  predicted_home: number;
  predicted_away: number;
  points_earned: number;
  outcome: string | null;
  is_scored: boolean;
  created_at: string;
  home_team: string;
  away_team: string;
  home_short_name: string;
  away_short_name: string;
  home_crest: string;
  away_crest: string;
  home_score: number | null;
  away_score: number | null;
  kickoff_at: string;
  status: string;
}

const fetchFeed = async (offset: number): Promise<FeedItem[]> => {
  const { data, error } = await supabase.rpc("get_feed", {
    p_limit: PAGE_SIZE,
    p_offset: offset,
  });
  if (error) throw error;
  return data ?? [];
};

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 0 }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
  });
};
