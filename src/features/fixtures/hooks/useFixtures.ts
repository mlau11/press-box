import { BASE_URL } from "@/constants";
import type { Match } from "@/types";
import { useQuery } from "@tanstack/react-query";

export interface FixturesResponse {
  matches: Match[];
}

export interface CompetitionResponse {
  currentSeason: {
    currentMatchday: number;
    endMatchday: number;
  };
}

const fetchCurrentMatchday = async (
  leagueCode: string,
): Promise<{ currentMatchday: number; endMatchday: number }> => {
  const params = new URLSearchParams({
    league: leagueCode,
    type: "competition",
  });
  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch competition info");
  const data: CompetitionResponse = await response.json();
  return {
    currentMatchday: data.currentSeason.currentMatchday,
    endMatchday: data.currentSeason.endMatchday,
  };
};

const fetchFixtures = async (
  leagueCode: string,
  matchday?: number,
  stage?: string,
  dateFrom?: string,
  dateTo?: string,
): Promise<FixturesResponse> => {
  const params = new URLSearchParams({ league: leagueCode });
  if (dateFrom && dateTo) {
    params.set("dateFrom", dateFrom);
    params.set("dateTo", dateTo);
  } else if (stage) {
    params.set("stage", stage);
  } else if (matchday) {
    params.set("matchday", matchday.toString());
  }
  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error("Failed to fetch fixtures");
  return response.json();
};

export const useCurrentMatchday = (leagueCode: string) => {
  return useQuery({
    queryKey: ["matchday", leagueCode],
    queryFn: () => fetchCurrentMatchday(leagueCode),
    staleTime: 1000 * 60 * 60,
  });
};

export const useFixtures = (
  leagueCode: string,
  matchday?: number,
  stage?: string,
  dateFrom?: string,
  dateTo?: string,
) => {
  return useQuery({
    queryKey: ["fixtures", leagueCode, dateFrom ?? matchday ?? stage],
    queryFn: () => fetchFixtures(leagueCode, matchday, stage, dateFrom, dateTo),
    staleTime: 1000 * 60 * 5,
    enabled: !!matchday || !!stage || (!!dateFrom && !!dateTo),
  });
};
