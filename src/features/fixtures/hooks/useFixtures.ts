import { BASE_URL } from "@/constants";
import type { Match } from "@/types";
import { useQuery } from "@tanstack/react-query";

export interface FixturesResponse {
  matches: Match[];
}

const fetchFixtures = async (
  leagueCode: string,
  dateFrom: string,
  dateTo: string,
): Promise<FixturesResponse> => {
  const params = new URLSearchParams({ league: leagueCode, dateFrom, dateTo });
  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch fixtures");
  return response.json();
};

export const useFixtures = (
  leagueCode: string,
  dateFrom: string,
  dateTo: string,
) => {
  return useQuery({
    queryKey: ["fixtures", leagueCode, dateFrom, dateTo],
    queryFn: () => fetchFixtures(leagueCode, dateFrom, dateTo),
    staleTime: 1000 * 60 * 5,
  });
};
