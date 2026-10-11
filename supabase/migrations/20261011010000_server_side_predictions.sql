-- Predictions are now written only by the submit-prediction edge function,
-- which fetches match details from football-data.org and checks kickoff
-- server-side. Remove all browser write access to matches and predictions.
-- Run only after submit-prediction is deployed and the frontend uses it.
drop policy "Logged-in users can insert matches" on public.matches;
drop policy "Logged-in users can update matches" on public.matches;
drop policy "Users can insert own predictions" on public.predictions;
drop policy "Users can update own predictions" on public.predictions;

revoke insert, update on public.matches, public.predictions from anon, authenticated;
