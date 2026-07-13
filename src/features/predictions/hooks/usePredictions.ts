import { supabase } from "@/lib/supabase";
import type { Prediction } from "@/types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const submitPrediction = async ({
  userId,
  matchId,
  leagueCode,
  matchday,
  predictedHome,
  predictedAway,
  matchData,
}: {
  userId: string;
  matchId: number;
  leagueCode: string;
  matchday: number;
  predictedHome: number;
  predictedAway: number;
  matchData: {
    homeTeam: string;
    awayTeam: string;
    homeShortName: string;
    awayShortName: string;
    homeCrest: string;
    awayCrest: string;
    kickoffAt: string;
    status: string;
  };
}): Promise<Prediction> => {
  // upsert match data first
  await supabase.from("matches").upsert(
    {
      id: matchId,
      league_code: leagueCode,
      matchday,
      home_team: matchData.homeTeam,
      away_team: matchData.awayTeam,
      home_short_name: matchData.homeShortName,
      away_short_name: matchData.awayShortName,
      home_crest: matchData.homeCrest,
      away_crest: matchData.awayCrest,
      kickoff_at: matchData.kickoffAt,
      status: matchData.status,
    },
    { onConflict: "id" },
  );

  // then upsert the prediction
  const { data, error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_id: userId,
        match_id: matchId,
        league_code: leagueCode,
        matchday,
        predicted_home: predictedHome,
        predicted_away: predictedAway,
      },
      { onConflict: "user_id,match_id" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

const fetchUserPredictions = async (
  userId: string,
  matchIds: number[],
): Promise<Prediction[]> => {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("user_id", userId)
    .in("match_id", matchIds);

  if (error) throw error;
  return data ?? [];
};

export const useUserPredictions = (
  userId: string | undefined,
  matchIds: number[],
) => {
  return useQuery({
    queryKey: ["predictions", userId, matchIds],
    queryFn: () => fetchUserPredictions(userId!, matchIds),
    enabled: !!userId && matchIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubmitPrediction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitPrediction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
  });
};
