# Supabase setup

Vidya Quest uses Supabase for parent authentication and encrypted per-learner
data. This guide takes you from zero to a working sign-in.

## 1. Create the project

1. Sign in at [supabase.com](https://supabase.com) (free tier is plenty for dev).
2. Create a new project. Pick a region close to Pune (e.g. `ap-south-1`).
3. Wait for the project to provision (~2 min).

## 2. Wire env vars

Copy `.env.local.example` → `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in from **Project Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL` — the Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — the `sb_publishable_…` key (2025+ naming; replaces legacy `anon` key)
- `SUPABASE_SECRET_KEY` — the `sb_secret_…` key (server-only; replaces legacy `service_role` key). Optional for sign-in flow; needed only when an API route must bypass RLS.

Add the same three vars in **Vercel → Project → Settings → Environment Variables**
for production deploys. Use Vercel Preview vars too if you want preview branches
on their own dev Supabase project.

## 3. Run the migration

From the Supabase project dashboard:

1. **SQL Editor** → New query
2. Paste the contents of `supabase/migrations/0001_init.sql`
3. Click **Run**

You should see:
- `parents` table created (1 row per parent account)
- `learners` table (1 row per kid)
- `learner_states` table (JSONB GameState blob)
- An `on_auth_user_created` trigger that auto-creates a `parents` row on signup
- RLS policies on all three tables enforcing `parent_id = auth.uid()`

Verify in **Table Editor** → all three tables visible, all show "RLS enabled".

## 4. Configure auth

**Authentication → Providers → Email**:
- Enable email
- Disable password sign-in (we use magic links)
- Enable "Confirm email" — yes

**Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (dev) or `https://vidya-quest.vercel.app` (prod)
- Redirect URLs: add both `http://localhost:3000/auth/callback` and your prod
  callback URL.

## 5. Try it

```bash
npm run dev
```

Visit `http://localhost:3000/sign-in`, enter your email, click the link in
your inbox, and you should land on `/parent`.

## 6. What's stored where

| Data | Location | Notes |
|---|---|---|
| Parent account (email, id) | `auth.users` (Supabase) | Managed by Supabase Auth |
| Parent display name + PIN hash | `public.parents` | Mirrors auth.users 1:1 |
| Learner roster (name, grade, board, school) | `public.learners` | RLS: parent_id = auth.uid() |
| Game state (XP, badges, progress) | `public.learner_states` | RLS: through learners |
| Game state on the device | `localStorage` (Zustand) | Sync layer ships next |
| Anthropic API key (existing) | `.env` server-side | Will become BYOK per parent later |
| Future: medical advisories | `public.learner_health` (encrypted) | Migration 0002 |
| Future: BYOK AI keys | `public.parent_ai_keys` (Vault) | Migration 0003 |

## 7. The isolation contract (recap)

Every sensitive table follows the rule from
[docs/STRICT_ISOLATION.md](./STRICT_ISOLATION.md):
- Parent-owned tables: `parent_id = auth.uid()`
- Learner-owned tables: gated through `learners.parent_id = auth.uid()`

If you add a new table for parent or kid data, you MUST enable RLS and add
both `read` and `write` policies that follow this pattern. Service-role
queries that bypass RLS are reserved for backend-only admin work and should
never be triggered by a request from the client.
