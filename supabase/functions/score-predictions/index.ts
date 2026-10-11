import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const FOOTBALL_DATA_API_KEY = Deno.env.get("FOOTBALL_DATA_API_KEY");
const BASE_URL = "https://api.football-data.org/v4";

if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY)
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!FOOTBALL_DATA_API_KEY) console.warn("FOOTBALL_DATA_API_KEY missing");

interface MatchResult {
  id: number;
  score: {
    duration: string;
    fullTime: { home: number | null; away: number | null };
    regularTime?: { home: number | null; away: number | null };
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Scoring uses the 90 minute result; fullTime includes extra time and penalties.
// Returns null if unavailable so the prediction is retried next run rather than
// scored wrongly; scored rows are never revisited.
const judgedScore = (
  score: MatchResult["score"],
): { home: number; away: number } | null => {
  const wentBeyond90 =
    score.duration === "EXTRA_TIME" || score.duration === "PENALTY_SHOOTOUT";
  const source = wentBeyond90 ? score.regularTime : score.fullTime;
  if (!source || source.home === null || source.away === null) return null;
  return { home: source.home, away: source.away };
};

const calculatePoints = (
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number,
): { points: number; outcome: string } => {
  if (predictedHome === actualHome && predictedAway === actualAway) {
    return { points: 3, outcome: "exact" };
  }
  const predictedResult = Math.sign(predictedHome - predictedAway);
  const actualResult = Math.sign(actualHome - actualAway);
  if (predictedResult === actualResult) {
    return { points: 1, outcome: "correct_result" };
  }
  return { points: 0, outcome: "wrong" };
};

const fetchAllFinishedMatches = async (leagueCode: string, retries = 2) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `${BASE_URL}/competitions/${leagueCode}/matches?status=FINISHED`,
        {
          headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY ?? "" },
          signal: controller.signal,
        },
      );
      clearTimeout(timeout);
      if (!response.ok) {
        console.error(
          `fetchAllFinishedMatches got ${response.status} for ${leagueCode}`,
        );
        return [];
      }
      const data = await response.json();
      return data.matches ?? [];
    } catch (err) {
      clearTimeout(timeout);
      console.error(
        `fetchAllFinishedMatches failed for ${leagueCode} (attempt ${attempt + 1}/${retries + 1}):`,
        err,
      );
      if (attempt === retries) return [];
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return [];
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only the cron job (which holds the service role key) may invoke this.
  // The service role key never reaches the browser, unlike the anon key.
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: unscoredPredictions, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("is_scored", false)
      .not("league_code", "is", null)
      .order("created_at", { ascending: true })
      .limit(1000);

    if (error) throw error;
    if (!unscoredPredictions || unscoredPredictions.length === 0) {
      return new Response(JSON.stringify({ success: true, totalScored: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const groups = new Map<string, typeof unscoredPredictions>();
    for (const prediction of unscoredPredictions) {
      const key = prediction.league_code;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(prediction);
    }

    let totalScored = 0;
    const errors: string[] = [];

    for (const [leagueCode, predictions] of groups) {
      try {
        const matches = await fetchAllFinishedMatches(leagueCode);
        if (matches.length === 0) continue;

        const matchMap = new Map<number, MatchResult>(
          matches.map((m: any) => [m.id, m]),
        );

        // Only touch matches that already have a row in `matches`.
        // Rows are created on prediction submit, so anything outside this set
        // has no row to update.
        const predictionMatchIds = new Set(predictions.map((p) => p.match_id));

        const predictionUpdates: any[] = [];
        const matchUpdates: any[] = [];

        for (const match of matches) {
          if (!predictionMatchIds.has(match.id)) continue;
          const result = judgedScore(match.score);
          if (!result) continue;
          matchUpdates.push({
            id: match.id,
            home_score: result.home,
            away_score: result.away,
            status: "FINISHED",
          });
        }

        for (const prediction of predictions) {
          const match = matchMap.get(prediction.match_id);
          if (!match) continue;

          const result = judgedScore(match.score);
          if (!result) continue;

          const { points, outcome } = calculatePoints(
            prediction.predicted_home,
            prediction.predicted_away,
            result.home,
            result.away,
          );

          predictionUpdates.push({
            id: prediction.id,
            points_earned: points,
            outcome,
          });
        }

        if (matchUpdates.length > 0) {
          for (const update of matchUpdates) {
            const { error: matchError } = await supabase
              .from("matches")
              .update({
                home_score: update.home_score,
                away_score: update.away_score,
                status: update.status,
              })
              .eq("id", update.id);
            if (matchError) throw matchError;
          }
        }

        if (predictionUpdates.length > 0) {
          for (const update of predictionUpdates) {
            const { error: predictionError } = await supabase
              .from("predictions")
              .update({
                points_earned: update.points_earned,
                outcome: update.outcome,
                is_scored: true,
              })
              .eq("id", update.id)
              .eq("is_scored", false);
            if (predictionError) throw predictionError;
          }
          totalScored += predictionUpdates.length;
        }
      } catch (err) {
        console.error(`Failed processing league ${leagueCode}:`, err);
        errors.push(`${leagueCode}: ${String((err as any)?.message ?? err)}`);
        // continue to next league rather than aborting the whole run
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalScored,
        errors: errors.length ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("score-predictions failed:", err);
    return new Response(
      JSON.stringify({ error: String((err as any)?.message ?? err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
