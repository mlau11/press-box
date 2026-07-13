import { BASE_URL, HEADERS } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface StandingEntry {
  position: number;
  team: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

interface StandingsResponse {
  standings: Array<{
    type: string;
    group?: string;
    table: StandingEntry[];
  }>;
}

export interface FormMatch {
  id: number;
  utcDate: string;
  competition: { name: string };
  homeTeam: {
    id: number;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    shortName: string;
    crest: string;
  };
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
  };
}

export interface H2HMatch {
  id: number;
  utcDate: string;
  homeTeam: { id: number; shortName: string };
  awayTeam: { id: number; shortName: string };
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
  };
}

export interface H2HResponse {
  aggregates: {
    numberOfMatches: number;
    homeTeam: {
      id: number;
      name: string;
      wins: number;
      draws: number;
      losses: number;
    };
    awayTeam: {
      id: number;
      name: string;
      wins: number;
      draws: number;
      losses: number;
    };
  };
  matches: H2HMatch[];
}

const fetchTeamForm = async (teamId: number): Promise<FormMatch[]> => {
  const params = new URLSearchParams({
    type: "form",
    teamId: teamId.toString(),
  });
  const response = await fetch(`${BASE_URL}?${params}`, { headers: HEADERS });
  if (!response.ok) throw new Error("Failed to fetch team form");
  const data = await response.json();
  return data.matches ?? [];
};

const fetchStandings = async (
  leagueCode: string,
): Promise<StandingEntry[][]> => {
  const params = new URLSearchParams({ type: "standings", league: leagueCode });
  const response = await fetch(`${BASE_URL}?${params}`, { headers: HEADERS });
  if (!response.ok) throw new Error("Failed to fetch standings");
  const data: StandingsResponse = await response.json();
  return data.standings.filter((s) => s.type === "TOTAL").map((s) => s.table);
};

export const useStandings = (leagueCode: string | undefined) => {
  return useQuery({
    queryKey: ["standings", leagueCode],
    queryFn: () => fetchStandings(leagueCode!),
    enabled: !!leagueCode,
    staleTime: 1000 * 60 * 60,
  });
};

export const useTeamForm = (teamId: number | undefined) => {
  return useQuery({
    queryKey: ["form", teamId],
    queryFn: () => fetchTeamForm(teamId!),
    enabled: !!teamId,
    staleTime: 1000 * 60 * 30,
  });
};
