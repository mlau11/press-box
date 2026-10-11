import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FOOTBALL_DATA_API_KEY = Deno.env.get("FOOTBALL_DATA_API_KEY");
const BASE_URL = "https://api.football-data.org/v4";

if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY)
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!FOOTBALL_DATA_API_KEY) console.warn("FOOTBALL_DATA_API_KEY missing");

// Keep in sync with LEAGUES in src/constants and football-data-proxy.
const LEAGUE_CODES = new Set([
  "PL",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "CL",
  "ELC",
  "DED",
  "PPL",
  "BSA",
  "WC",
]);
const OPEN_STATUSES = new Set(["SCHEDULED", "TIMED"]);
const MAX_GOALS = 20;

interface ApiTeam {
  name: string | null;
  shortName: string | null;
  crest: string | null;
}

interface ApiMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  competition: { code: string };
  homeTeam: ApiTeam;
  awayTeam: ApiTeam;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const isGoalCount = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) >= 0 && (value as number) <= MAX_GOALS;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  // The user comes from their verified session token, never from the body.
  const token = req.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token) return jsonResponse({ error: "Not signed in" }, 401);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);
  if (authError || !user) return jsonResponse({ error: "Not signed in" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }
  const { matchId, predictedHome, predictedAway } = body ?? {};
  if (
    !Number.isInteger(matchId) ||
    (matchId as number) <= 0 ||
    !isGoalCount(predictedHome) ||
    !isGoalCount(predictedAway)
  ) {
    return jsonResponse({ error: "Invalid prediction" }, 400);
  }

  try {
    // Match details are fetched here rather than sent by the browser, so the
    // kickoff time and status used for the check below can be trusted.
    const response = await fetch(`${BASE_URL}/matches/${matchId}`, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY ?? "" },
    });
    if (response.status === 429) {
      return jsonResponse({ error: "Busy right now. Try again in a minute." }, 503);
    }
    if (response.status === 404) {
      return jsonResponse({ error: "Match not found" }, 404);
    }
    if (!response.ok) {
      console.error(`football-data returned ${response.status} for match ${matchId}`);
      return jsonResponse({ error: "Couldn't load the match. Try again." }, 502);
    }
    const json = await response.json();
    const match: ApiMatch = json.match ?? json;

    if (!LEAGUE_CODES.has(match.competition?.code)) {
      return jsonResponse({ error: "Competition not supported" }, 400);
    }
    if (!match.homeTeam?.name || !match.awayTeam?.name) {
      return jsonResponse({ error: "Teams for this match aren't decided yet" }, 409);
    }
    if (!OPEN_STATUSES.has(match.status) || new Date(match.utcDate) <= new Date()) {
      return jsonResponse({ error: "Predictions are closed for this match" }, 409);
    }

    const { error: matchError } = await supabase.from("matches").upsert(
      {
        id: match.id,
        league_code: match.competition.code,
        matchday: match.matchday,
        home_team: match.homeTeam.name,
        away_team: match.awayTeam.name,
        home_short_name: match.homeTeam.shortName ?? match.homeTeam.name,
        away_short_name: match.awayTeam.shortName ?? match.awayTeam.name,
        home_crest: match.homeTeam.crest,
        away_crest: match.awayTeam.crest,
        kickoff_at: match.utcDate,
        status: match.status,
      },
      { onConflict: "id" },
    );
    if (matchError) throw matchError;

    const { data: prediction, error: predictionError } = await supabase
      .from("predictions")
      .upsert(
        {
          user_id: user.id,
          match_id: match.id,
          league_code: match.competition.code,
          matchday: match.matchday,
          predicted_home: predictedHome,
          predicted_away: predictedAway,
        },
        { onConflict: "user_id,match_id" },
      )
      .select()
      .single();
    if (predictionError) throw predictionError;

    return jsonResponse(prediction);
  } catch (err) {
    console.error("submit-prediction failed:", err);
    return jsonResponse({ error: "Couldn't save your prediction. Try again." }, 500);
  }
});
