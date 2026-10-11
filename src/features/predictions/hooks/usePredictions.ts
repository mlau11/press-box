import { supabase } from "@/lib/supabase";
import type { Prediction } from "@/types";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const submitPrediction = async ({
  matchId,
  predictedHome,
  predictedAway,
}: {
  matchId: number;
  predictedHome: number;
  predictedAway: number;
}): Promise<Prediction> => {
  const { data, error } = await supabase.functions.invoke<Prediction>(
    "submit-prediction",
    { body: { matchId, predictedHome, predictedAway } },
  );

  if (error) {
    const body =
      error instanceof FunctionsHttpError
        ? await error.context.json().catch(() => null)
        : null;
    throw new Error(body?.error ?? "Couldn't submit prediction. Try again.");
  }
  if (!data) throw new Error("Couldn't submit prediction. Try again.");

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
