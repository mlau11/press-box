import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { validateUsername } from "../utils/validateUsername";

const fetchIsAvailable = async (username: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return !data;
};

// Debounced "is this username free?" check shared by signup and the username
// gate. Results are keyed by username, so a slow response for an old value
// can't overwrite the answer for the current one.
export const useUsernameAvailability = (rawUsername: string, enabled: boolean) => {
  const username = rawUsername.trim().toLowerCase();
  const isCheckable = enabled && validateUsername(username) === null;
  const debounced = useDebouncedValue(username, 400);
  const isSettled = debounced === username;

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["username-available", debounced],
    queryFn: () => fetchIsAvailable(debounced),
    enabled: isCheckable && isSettled,
    staleTime: 30_000,
  });

  return {
    checking: isCheckable && (!isSettled || isFetching),
    // null when unknown, including after a failed lookup
    available: isCheckable && isSettled && isSuccess ? (data ?? null) : null,
  };
};
