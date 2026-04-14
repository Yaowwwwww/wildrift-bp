# Cloud sync setup (Supabase)

The app stays 100% offline-friendly without any of this. Follow these steps only if you want **optional sign-in with multi-device sync** working.

## 1. Create the Supabase project

1. Sign up at https://supabase.com (free tier).
2. New Project → pick a region close to your main audience (`us-east-1` / `ap-southeast-1` are reasonable global picks).
3. Set a database password (you won't need it for the web app, but save it).
4. Wait ~2 min for provisioning.

## 2. Configure Auth

Dashboard → Authentication → Providers:
- **Email**: enabled by default. Confirm "Enable Email provider" is on. "Confirm email" can stay on; the magic link handles it.

Dashboard → Authentication → URL Configuration:
- **Site URL**: the URL where you host the static site (e.g. `https://yourname.github.io/wildrift-bp/` or `http://localhost:8000` for local dev).
- **Redirect URLs**: add both your production URL and `http://localhost:*` for local testing.

Dashboard → Authentication → Email Templates → **Magic Link**: optionally customize subject/body (supports HTML; include both Chinese and English copy if desired).

## 3. Create the table + RLS

Dashboard → SQL Editor → New query → paste this and Run:

```sql
create table public.user_state (
  user_id           uuid        primary key references auth.users(id) on delete cascade,
  pool              jsonb       not null default '[]'::jsonb,
  junglers          jsonb       not null default '[]'::jsonb,
  starred           jsonb       not null default '[]'::jsonb,
  champ_data        jsonb       not null default '{}'::jsonb,
  extra_tags        jsonb       not null default '[]'::jsonb,
  client_updated_at bigint      not null default 0,
  client_id         text,
  updated_at        timestamptz not null default now()
);

alter table public.user_state enable row level security;

create policy "own row select" on public.user_state for select using (auth.uid() = user_id);
create policy "own row insert" on public.user_state for insert with check (auth.uid() = user_id);
create policy "own row update" on public.user_state for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own row delete" on public.user_state for delete using (auth.uid() = user_id);

create or replace function public.touch_user_state() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger user_state_touch before update on public.user_state for each row execute function public.touch_user_state();
```

## 4. Wire your keys into the client

Dashboard → Project Settings → API. Copy:
- **Project URL** (e.g. `https://abcdefghijkl.supabase.co`)
- **anon / public** key (the long JWT-looking string — NOT the service_role key)

Open [js/sync.js](js/sync.js) and replace the two placeholders at the top:

```js
const SUPABASE_URL      = 'https://abcdefghijkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```

Both values are **public** by design — RLS enforces security. Safe to commit them to git.

**NEVER** put the `service_role` key in this file. It bypasses RLS.

## 5. Test locally

```bash
cd /Users/jameswang/Desktop/wildrift-bp
python3 -m http.server 8000
```

Open http://localhost:8000 → click "Sign in" → enter your email → check inbox → click magic link. You should land back signed in, and your local data (if any) pushes to the cloud.

## 6. Verify RLS

Dashboard → SQL Editor:

```sql
-- As your signed-in user; should return only your own row
select * from public.user_state;

-- Should return 0 rows affected (trying to overwrite someone else's row)
update public.user_state set pool = '[]'::jsonb where user_id <> auth.uid();
```

## Optional: Google OAuth (later)

Authentication → Providers → Google → enable and paste OAuth client id/secret from Google Cloud Console. Then add a second button in the sign-in modal that calls `supabase.auth.signInWithOAuth({ provider: 'google' })`. Everything else in the app already supports this — no DB changes needed.

## Free-tier limits (as of 2026)

- 50,000 monthly active users
- 500MB database
- 5GB bandwidth
- Email rate-limited by Supabase's shared SMTP; switch to custom SMTP (SendGrid / Resend / etc.) if you outgrow it.

---

Troubleshooting:

- **Magic link doesn't arrive** — check spam; ensure Site URL matches where you're opening the app.
- **Button says "Sign in" but clicking does nothing** — open DevTools; you'll see `[sync] Supabase not configured` if the keys aren't filled in.
- **Cross-device sync lag** — pushes are debounced 1.5s. Pull only runs on sign-in. Reload the second device or use Supabase Realtime (Phase 7).
