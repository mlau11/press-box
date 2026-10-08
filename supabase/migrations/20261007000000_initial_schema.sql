create table public.matches (
  id bigint not null,
  league_code text not null,
  matchday integer,
  home_team text not null,
  away_team text not null,
  home_crest text,
  away_crest text,
  home_short_name text,
  away_short_name text,
  kickoff_at timestamp with time zone not null,
  status text default 'scheduled'::text,
  home_score integer,
  away_score integer,
  created_at timestamp with time zone default now()
);

create table public.predictions (
  id uuid default uuid_generate_v4() not null,
  user_id uuid not null,
  match_id bigint not null,
  league_code text not null,
  matchday integer,
  predicted_home integer not null,
  predicted_away integer not null,
  outcome text,
  points_earned integer default 0,
  is_scored boolean default false not null,
  created_at timestamp with time zone default now() not null
);

create table public.users (
  id uuid not null,
  username text,
  email text not null,
  created_at timestamp with time zone default now() not null
);

alter table public.matches add constraint matches_pkey PRIMARY KEY (id);

alter table public.predictions add constraint predictions_pkey PRIMARY KEY (id);

alter table public.predictions add constraint predictions_user_id_match_id_key UNIQUE (user_id, match_id);

alter table public.predictions add constraint scored_rows_complete CHECK (((is_scored = false) OR ((points_earned IS NOT NULL) AND (outcome IS NOT NULL))));

alter table public.users add constraint users_email_key UNIQUE (email);

alter table public.users add constraint users_pkey PRIMARY KEY (id);

alter table public.users add constraint users_username_format CHECK ((username ~ '^[a-z0-9_]{3,20}$'::text));

alter table public.users add constraint users_username_key UNIQUE (username);

alter table public.predictions add constraint predictions_match_id_fkey FOREIGN KEY (match_id) REFERENCES matches(id);

alter table public.predictions add constraint predictions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

alter table public.users add constraint users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.get_feed(p_limit integer, p_offset integer)
 RETURNS TABLE(prediction_id uuid, user_id uuid, username text, match_id bigint, league_code text, matchday integer, predicted_home integer, predicted_away integer, points_earned integer, outcome text, is_scored boolean, created_at timestamp with time zone, home_team text, away_team text, home_short_name text, away_short_name text, home_crest text, away_crest text, home_score integer, away_score integer, kickoff_at timestamp with time zone, status text)
 LANGUAGE sql
 STABLE
AS $function$
  select
    p.id as prediction_id,
    p.user_id,
    u.username,
    p.match_id,
    p.league_code,
    p.matchday,
    p.predicted_home,
    p.predicted_away,
    p.points_earned,
    p.outcome,
    p.is_scored,
    p.created_at,
    m.home_team,
    m.away_team,
    m.home_short_name,
    m.away_short_name,
    m.home_crest,
    m.away_crest,
    m.home_score,
    m.away_score,
    m.kickoff_at,
    m.status
  from predictions p
  join users u on u.id = p.user_id
  join matches m on m.id = p.match_id
  order by p.created_at desc
  limit p_limit
  offset p_offset;
$function$
;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
 RETURNS TABLE(user_id uuid, username text, total_points numeric, avg_points_per_prediction numeric, accuracy_pct numeric)
 LANGUAGE sql
AS $function$
  SELECT
    u.id AS user_id,
    u.username,
    sum(p.points_earned) AS total_points,
    round(sum(p.points_earned)::numeric / nullif(count(*), 0), 2) AS avg_points_per_prediction,
    round(
      count(*) FILTER (WHERE p.points_earned > 0)::numeric / nullif(count(*), 0) * 100,
      0
    ) AS accuracy_pct
  FROM users u
  JOIN (
    SELECT
      p2.user_id,
      p2.points_earned,
      row_number() OVER (PARTITION BY p2.user_id ORDER BY p2.created_at DESC) AS rn
    FROM predictions p2
    WHERE p2.is_scored = true
  ) p ON p.user_id = u.id AND p.rn <= 100
  GROUP BY u.id, u.username
  HAVING count(*) >= 5
  ORDER BY total_points DESC, avg_points_per_prediction DESC
  LIMIT 100;
$function$
;

CREATE OR REPLACE FUNCTION public.get_profile_stats(p_user_id uuid)
 RETURNS TABLE(total_points numeric, scored_predictions bigint, total_predictions bigint, avg_points_per_prediction numeric, accuracy_pct numeric)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT
    sum(points_earned) AS total_points,
    count(*) AS scored_predictions,
    (
      SELECT count(*)
      FROM predictions
      WHERE user_id = p_user_id
    ) AS total_predictions,
    round(sum(points_earned)::numeric / nullif(count(*), 0), 2) AS avg_points_per_prediction,
    round(
      count(*) FILTER (WHERE points_earned > 0)::numeric / nullif(count(*), 0) * 100,
      0
    ) AS accuracy_pct
  FROM (
    SELECT
      points_earned,
      row_number() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
    FROM predictions
    WHERE user_id = p_user_id
      AND is_scored = true
  ) recent
  WHERE rn <= 100;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'username'
  );
  RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.lowercase_username()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF new.username IS NOT NULL THEN
    new.username := lower(new.username);
  END IF;
  RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.reject_late_predictions()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if current_user <> 'service_role' and exists (
    select 1 from public.matches m
    where m.id = new.match_id and m.kickoff_at <= now()
  ) then
    raise exception 'Predictions are closed for this match';
  end if;
  return new;
end $function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TRIGGER predictions_before_kickoff BEFORE INSERT OR UPDATE OF predicted_home, predicted_away, match_id ON public.predictions FOR EACH ROW EXECUTE FUNCTION reject_late_predictions();

CREATE TRIGGER users_lowercase_username BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION lowercase_username();

alter table public.matches enable row level security;

alter table public.predictions enable row level security;

alter table public.users enable row level security;

create policy "Logged-in users can insert matches" on public.matches as permissive for insert to authenticated with check (true);

create policy "Logged-in users can update matches" on public.matches as permissive for update to authenticated using (true);

create policy "Matches are viewable by everyone" on public.matches as permissive for select to public using (true);

create policy "Predictions are viewable by everyone" on public.predictions as permissive for select to public using (true);

create policy "Users can insert own predictions" on public.predictions as permissive for insert to public with check ((auth.uid() = user_id));

create policy "Users can update own predictions" on public.predictions as permissive for update to public using (((auth.uid() = user_id) AND (is_scored = false))) with check (((auth.uid() = user_id) AND (is_scored = false)));

create policy "Public profiles are viewable by everyone" on public.users as permissive for select to public using (true);

create policy "Users can update own profile" on public.users as permissive for update to public using ((auth.uid() = id));

revoke all on public.matches from anon, authenticated;

grant maintain on public.matches to anon, authenticated;

grant select on public.matches to anon, authenticated;

grant insert (id, league_code, matchday, home_team, away_team, home_crest, away_crest, home_short_name, away_short_name, kickoff_at, status) on public.matches to authenticated;

grant update (id, league_code, matchday, home_team, away_team, home_crest, away_crest, home_short_name, away_short_name, kickoff_at, status) on public.matches to authenticated;

revoke all on public.predictions from anon, authenticated;

grant maintain on public.predictions to anon, authenticated;

grant select on public.predictions to anon, authenticated;

grant insert (user_id, match_id, league_code, matchday, predicted_home, predicted_away) on public.predictions to authenticated;

grant update (user_id, match_id, league_code, matchday, predicted_home, predicted_away) on public.predictions to authenticated;

revoke all on public.users from anon, authenticated;

grant maintain on public.users to anon, authenticated;

grant select (id, username, created_at) on public.users to anon;

grant select (id, username, created_at) on public.users to authenticated;

grant update (username) on public.users to authenticated;

grant execute on function public.get_feed(p_limit integer, p_offset integer) to anon;

grant execute on function public.get_feed(p_limit integer, p_offset integer) to authenticated;

grant execute on function public.get_leaderboard() to anon;

grant execute on function public.get_leaderboard() to authenticated;

grant execute on function public.get_profile_stats(p_user_id uuid) to anon;

grant execute on function public.get_profile_stats(p_user_id uuid) to authenticated;

grant execute on function public.handle_new_user() to anon;

grant execute on function public.handle_new_user() to authenticated;

grant execute on function public.lowercase_username() to anon;

grant execute on function public.lowercase_username() to authenticated;

grant execute on function public.reject_late_predictions() to anon;

grant execute on function public.reject_late_predictions() to authenticated;

grant execute on function public.rls_auto_enable() to anon;

grant execute on function public.rls_auto_enable() to authenticated;
