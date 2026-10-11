-- Pin the search path of the SECURITY DEFINER signup function so name
-- lookups can't be redirected; the body already uses schema-qualified names.
alter function public.handle_new_user() set search_path = '';

-- Remove Supabase's default MAINTAIN grant; the app never needs it.
revoke maintain on public.users, public.matches, public.predictions from anon, authenticated;
