-- Requires a Vault secret named 'score_predictions_auth'
-- holding the key used to invoke score-predictions.
select cron.schedule(
  'score-predictions',
  '*/30 * * * *',
  $cmd$
  select net.http_post(
    url := 'https://rgeujahbgahwaffzviwo.supabase.co/functions/v1/score-predictions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret from vault.decrypted_secrets
        where name = 'score_predictions_auth'
      )
    ),
    body := '{}'::jsonb
  ) as request_id;
  $cmd$
);
