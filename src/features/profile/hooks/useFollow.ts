import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchIsFollowing = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .single();
  if (error) return false;
  return !!data;
};

const follow = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
  if (error) throw error;
};

const unfollow = async (followerId: string, followingId: string) => {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
};

export const useIsFollowing = (
  followerId: string | undefined,
  followingId: string | undefined,
) => {
  return useQuery({
    queryKey: ["following", followerId, followingId],
    queryFn: () => fetchIsFollowing(followerId!, followingId!),
    enabled: !!followerId && !!followingId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFollow = (followerId: string, followingId: string) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["following", followerId, followingId],
    });
  };

  const followMutation = useMutation({
    mutationFn: () => follow(followerId, followingId),
    onSuccess: invalidate,
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollow(followerId, followingId),
    onSuccess: invalidate,
  });

  return { followMutation, unfollowMutation };
};
