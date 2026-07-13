export interface User {
  id: string;
  username: string;
  email: string;
  scoring_window: number;
  created_at: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  api_league_id: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  match_id: number;
  league_code: string;
  matchday: number;
  predicted_home: number;
  predicted_away: number;
  outcome: string | null;
  points_earned: number;
  is_scored: boolean;
  created_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

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
