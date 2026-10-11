export type CompetitionStage =
  | { label: string; matchday: number; stage?: never }
  | { label: string; stage: string; matchday?: never };

// WC_STAGES is unused until the next WC
export const WC_STAGES: CompetitionStage[] = [
  { label: "Group Stage MD1", matchday: 1 },
  { label: "Group Stage MD2", matchday: 2 },
  { label: "Group Stage MD3", matchday: 3 },
  { label: "Round of 32", stage: "LAST_32" },
  { label: "Round of 16", stage: "LAST_16" },
  { label: "Quarter Finals", stage: "QUARTER_FINALS" },
  { label: "Semi Finals", stage: "SEMI_FINALS" },
  { label: "3rd Place", stage: "THIRD_PLACE" },
  { label: "Final", stage: "FINAL" },
];

export const CL_STAGES: CompetitionStage[] = [
  { label: "League Phase MD1", matchday: 1 },
  { label: "League Phase MD2", matchday: 2 },
  { label: "League Phase MD3", matchday: 3 },
  { label: "League Phase MD4", matchday: 4 },
  { label: "League Phase MD5", matchday: 5 },
  { label: "League Phase MD6", matchday: 6 },
  { label: "League Phase MD7", matchday: 7 },
  { label: "League Phase MD8", matchday: 8 },
  { label: "Round of 16", stage: "LAST_16" },
  { label: "Quarter Finals", stage: "QUARTER_FINALS" },
  { label: "Semi Finals", stage: "SEMI_FINALS" },
  { label: "Final", stage: "FINAL" },
];

export const LEAGUES = [
  { code: "PL", label: "Premier League" },
  { code: "PD", label: "La Liga" },
  { code: "BL1", label: "Bundesliga" },
  { code: "SA", label: "Serie A" },
  { code: "FL1", label: "Ligue 1" },
  { code: "CL", label: "Champions League" },
  { code: "ELC", label: "Championship" },
  { code: "DED", label: "Eredivisie" },
  { code: "PPL", label: "Primeira Liga" },
  { code: "BSA", label: "Campeonato Brasileiro Serie A" },
];

export const leagueLabel: Record<string, string> = Object.fromEntries(
  LEAGUES.map((l) => [l.code, l.label]),
);

export const PAGE_SIZE = 50;

export const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/football-data-proxy`;

export const STORAGE_KEY = "pressbox_onboarding_seen";

export const NAV_LINKS = [
  { label: "Fixtures", path: "/" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Feed", path: "/feed" },
];
