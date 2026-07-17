# Connecting connectPR to Supabase

connectPR runs in **two modes**, with the *exact same UI* either way:

| Mode | When | Where data lives | Login? |
|------|------|------------------|--------|
| **Local** (default) | No Supabase keys in `.env` | Your browser's `localStorage` | No — instant guest access |
| **Cloud** | Real Supabase URL + anon key present | Postgres (per-user, secured by RLS) | Yes — email + password |

You can build and demo the whole app with **zero setup** in local mode. Follow the
steps below only when you want real accounts and cloud sync.

---

## 1. Create a Supabase project

1. Go to <https://supabase.com> → sign in → **New project**.
2. Pick a name (e.g. `connectpr`), a database password, and a region close to you.
3. Wait ~2 minutes for it to finish provisioning.

## 2. Create the database tables

1. In your project, open **SQL Editor** → **New query**.
2. Open [`supabase/schema.sql`](./supabase/schema.sql) from this repo, copy the
   **entire** file, paste it into the editor.
3. Click **Run**.

This creates the `profiles`, `saved_contacts`, `lists`, `list_contacts`,
`competitors`, and `alerts` tables, turns on **Row-Level Security** (so every
user can only read/write their own rows), and installs a trigger that
auto-creates a `profiles` row whenever someone signs up.

> The script is safe to re-run — it uses `if not exists` / `or replace` throughout.

## 3. Enable email login

1. Go to **Authentication → Providers → Email** and make sure it's **enabled**.
2. For local development you'll usually want to **turn off "Confirm email"**
   (Authentication → Providers → Email → *Confirm email*), so new signups can log
   in immediately without clicking a confirmation link.
   - If you leave it **on**, new users must confirm via email before they can log in.

## 4. Copy your API keys into `.env`

1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public** key.
3. In the repo root, copy the example env file and fill it in:

   ```bash
   cp .env.example .env
   ```

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...    # the long anon JWT
   ```

   > `.env` is gitignored — never commit it. The **anon** key is safe for the
   > browser (RLS protects the data); never put the **service_role** key here.

## 5. Run the app

```bash
npm install
npm run dev
```

Open the printed URL. Because keys are now present, the app boots into **cloud
mode** and shows the **login / sign-up** screen instead of going straight to the
dashboard.

---

## What happens on first login

- Signing up creates an `auth.users` row → the trigger creates a matching
  `profiles` row.
- The **first** time a user loads the app, the store seeds their account with the
  demo lists, competitors, and alerts (once only — tracked by `profiles.seeded`).
- After that, every save/list/track/alert action reads from and writes to Postgres
  with an optimistic UI (the screen updates instantly; the DB syncs in the
  background).

## Verifying it works

1. **Sign up** with a test email → you should land on the dashboard with demo data.
2. Save a contact / create a list / track a competitor.
3. In Supabase → **Table Editor**, open `saved_contacts` / `lists` / `competitors`
   → your new rows should be there.
4. **Settings → Profile → Log out**, then log back in → your data reloads from the DB.
5. Open the app in a different browser and sign up as a second user → confirm you
   **cannot** see the first user's rows (RLS working).

## Switching back to local mode

Blank out (or remove) the two `VITE_SUPABASE_*` values in `.env` and restart
`npm run dev`. The login screen disappears and the app runs as a local guest
again. (During dev you'll see a purple console hint confirming local mode.)

## Troubleshooting

- **Still seeing the login screen after adding keys?** Restart `npm run dev` — Vite
  only reads `.env` at startup.
- **"Backend not configured" on login?** The keys didn't load. Confirm they're in
  `.env` (not `.env.example`), the URL starts with `https://`, and the anon key is
  the long one (> 30 chars).
- **Signups succeed but can't log in?** "Confirm email" is on — either confirm via
  the email link or disable it (step 3).
- **Rows not appearing / permission errors?** Re-run `supabase/schema.sql` to make
  sure RLS policies are in place.
