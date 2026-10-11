const FOOTBALL_DATA_API_KEY = Deno.env.get("FOOTBALL_DATA_API_KEY");
const BASE_URL = "https://api.football-data.org/v4";

// Keep in sync with LEAGUES in src/constants (WC is dormant until 2030).
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

const PARAM_PATTERNS: Record<string, RegExp> = {
  teamId: /^\d{1,10}$/,
  matchday: /^\d{1,2}$/,
  stage: /^[A-Z0-9_]{1,40}$/,
  dateFrom: /^\d{4}-\d{2}-\d{2}$/,
  dateTo: /^\d{4}-\d{2}-\d{2}$/,
};

// Every param is interpolated into the upstream URL, so each one is checked
// against a strict pattern first.
const findInvalidParam = (params: URLSearchParams): string | null => {
  const league = params.get("league");
  if (league !== null && !LEAGUE_CODES.has(league)) return "league";
  for (const [name, pattern] of Object.entries(PARAM_PATTERNS)) {
    const value = params.get(name);
    if (value !== null && !pattern.test(value)) return name;
  }
  return null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const jsonResponse = (body: unknown, status = 200, cacheControl = "no-store") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": cacheControl,
    },
  });

// Retries transient network failures (connection resets, TLS handshake
// errors) which the football-data.org host produces intermittently.
const fetchWithRetry = async (
  url: string,
  init: RequestInit = {},
  retries = 2,
): Promise<Response> => {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeout);
      return response;
    } catch (err) {
      clearTimeout(timeout);
      lastErr = err;
      console.error(
        `fetch failed for ${url} (attempt ${attempt + 1}/${retries + 1}):`,
        err,
      );
      if (attempt === retries) break;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastErr;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    const invalidParam = findInvalidParam(url.searchParams);
    if (invalidParam) {
      return jsonResponse({ error: `Invalid ${invalidParam}` }, 400);
    }

    const type = url.searchParams.get("type");
    const leagueCode = url.searchParams.get("league");
    const matchday = url.searchParams.get("matchday");
    const stage = url.searchParams.get("stage");
    const teamId = url.searchParams.get("teamId");
    const dateFrom = url.searchParams.get("dateFrom");
    const dateTo = url.searchParams.get("dateTo");

    let endpoint: string;
    let cacheControl = "public, max-age=3600";

    if (type === "form" && teamId) {
      endpoint = `${BASE_URL}/teams/${teamId}/matches?status=FINISHED&limit=5`;
      cacheControl = "no-store";
    } else if (type === "competition" && leagueCode) {
      endpoint = `${BASE_URL}/competitions/${leagueCode}`;
    } else if (type === "standings" && leagueCode) {
      endpoint = `${BASE_URL}/competitions/${leagueCode}/standings`;
    } else if (leagueCode && dateFrom && dateTo) {
      endpoint = `${BASE_URL}/competitions/${leagueCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
      cacheControl = "public, max-age=300";
    } else if (leagueCode && stage) {
      endpoint = `${BASE_URL}/competitions/${leagueCode}/matches?stage=${stage}`;
    } else if (leagueCode && matchday) {
      endpoint = `${BASE_URL}/competitions/${leagueCode}/matches?matchday=${matchday}`;
    } else if (leagueCode) {
      endpoint = `${BASE_URL}/competitions/${leagueCode}/matches?status=SCHEDULED`;
    } else {
      return jsonResponse({ error: "Invalid parameters" }, 400);
    }

    const response = await fetchWithRetry(endpoint, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_API_KEY ?? "" },
    });

    if (!response.ok) {
      let error: unknown;
      try {
        error = await response.json();
      } catch {
        error = await response.text();
      }
      return jsonResponse({ error }, response.status);
    }

    const data = await response.json();
    return jsonResponse(data, 200, cacheControl);
  } catch (err) {
    console.error("football-data-proxy failed:", err);
    return jsonResponse({ error: String((err as any)?.message ?? err) }, 500);
  }
});
