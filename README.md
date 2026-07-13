# Press Box

Predict football scores. Build a reputation.

Press Box is a full-stack football score prediction app covering the top 5 European leagues and the FIFA World Cup. Users submit scoreline predictions before kickoff, earn points for accuracy, and build a persistent public reputation over time. The leaderboard is rolling — good predictors rise, bad ones don't hide behind a seasonal reset.

Live: [press-box-xi.vercel.app](https://press-box-xi.vercel.app)

---

## Stack

| Layer         | Technology                                               |
| ------------- | -------------------------------------------------------- |
| Frontend      | React + TypeScript + Vite                                |
| Styling       | Tailwind CSS v4 + Shadcn (Nova preset, Radix primitives) |
| Backend       | Supabase — Postgres, Auth, Edge Functions                |
| Scheduling    | pg_cron                                                  |
| Football data | football-data.org API                                    |
| Hosting       | Vercel                                                   |

---

## Features

- **Fixtures** — Top 5 leagues and World Cup, with matchday navigation and a master-detail layout
- **Predictions** — Submit and edit scoreline predictions before kickoff; auth-gated with quick-pick shortcuts for common scorelines
- **Auto-scoring** — Supabase Edge Function triggered by pg_cron every 30 minutes; evaluates unscored predictions against live match results
- **Leaderboard** — Global ranking by total points over last 100 scored predictions; minimum 5 predictions to appear; podium styling for top 3
- **User profiles** — Per-user stats (total points, prediction count, points per prediction) and recent picks visible to any visitor
- **Community feed** — Paginated feed of recent predictions across all users; final scores surfaced on scored cards
- **Auth** — Email/password and Google OAuth via Supabase Auth; modal-based with password recovery; profile row created automatically on signup via Postgres trigger

---

## Architecture decisions

### Edge Function as API proxy

All football-data.org requests are routed through a single Supabase Edge Function (`get-fixtures`) rather than called directly from the client. This solves two problems: CORS (the API does not allow browser requests) and key exposure. A `type` query param routes the function to the correct upstream endpoint — fixtures, standings, team form, or match metadata — keeping the client interface simple and the API key server-side only.

### Scoring via pg_cron

Predictions are scored by a `score-predictions` Edge Function scheduled to run every 30 minutes via pg_cron. Each invocation processes one league + matchday group of unscored predictions, fetching the current result from football-data.org and writing `outcome` and `points_earned` back to the predictions table. Stats (total points, average, rank) are derived at query time via Supabase RPC functions rather than stored as columns — keeping the source of truth in the predictions table and avoiding sync bugs.

### Schema design

Three tables: `users`, `matches`, `predictions`. Match data is written to the `matches` table when a user submits a prediction — not via a scheduled sync — keeping the free-tier footprint light. The scoring cron updates `home_score`, `away_score`, and `status` on the matches row when a result comes in, which powers final score display in the feed without a second API call.

`league_code` and `matchday` are stored directly on each prediction row so the scoring function knows which API endpoint to call without joining back to matches.

### Reputation mechanic

A user's score is their total points over their last 100 scored predictions (configurable via `scoring_window` on the users table). This is a rolling window, not a lifetime total — it weights recent form over historical volume and prevents early predictions from locking in a score permanently. Secondary metric is average points per prediction, surfaced on profiles.

## Scoring system

| Outcome                | Points |
| ---------------------- | ------ |
| Exact scoreline        | 3      |
| Correct result (W/D/L) | 1      |
| Wrong                  | 0      |

A user's displayed score is their total points over their last 100 scored predictions. Minimum 5 scored predictions to appear on the leaderboard.
