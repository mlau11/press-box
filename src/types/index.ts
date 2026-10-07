import type { Tables } from "@/types/supabase";

export type Profile = Tables<"users">;
export type Prediction = Tables<"predictions">;

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string | null;
  homeTeam: {
    id: number | null;
    name: string | null;
    shortName: string | null;
    crest: string | null;
  };
  awayTeam: {
    id: number | null;
    name: string | null;
    shortName: string | null;
    crest: string | null;
  };
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
  };
}
