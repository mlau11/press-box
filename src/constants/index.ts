export type WCStage =
  | { label: string; matchday: number; stage?: never }
  | { label: string; stage: string; matchday?: never };

export const WC_STAGES: WCStage[] = [
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

export const CL_STAGES: WCStage[] = [
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
  { code: "WC", label: "World Cup" },
  { code: "PL", label: "Premier League" },
  { code: "CL", label: "Champions League" },
  { code: "BL1", label: "Bundesliga" },
  { code: "SA", label: "Serie A" },
  { code: "FL1", label: "Ligue 1" },
];

export const leagueLabel: Record<string, string> = Object.fromEntries(
  LEAGUES.map((l) => [l.code, l.label]),
);

export const PAGE_SIZE = 50;

export const BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-fixtures`;

export const HEADERS = {
  "x-internal-secret": import.meta.env.VITE_INTERNAL_SECRET,
};

export const STORAGE_KEY = "pressbox_onboarding_seen";

export const NAV_LINKS = [
  { label: "Fixtures", path: "/" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Feed", path: "/feed" },
];
