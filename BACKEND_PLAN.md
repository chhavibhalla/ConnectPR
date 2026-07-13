# connectPR — Real Backend Plan

This is the architecture plan for turning the current **frontend-only mock** into
a real product with authentication, a database, billing, and live data. Nothing
here is built yet — it's the blueprint we execute in phases.

The guiding principle: **the UI already defines the data model.** Every screen
maps cleanly onto a table + an API call, so we build backwards from what the app
already shows.

---

## 1. Recommended stack

Chosen for an India-first, small-team SaaS that needs to ship fast and stay cheap
until there's traction.

| Concern | Choice | Why |
|---|---|---|
| **Auth** | **Clerk** | Drop-in React components, Google + email/OTP, India-friendly. Handles sessions, JWT, and a hosted user table so we don't. Auth0 is the alternative (more enterprise, more setup). |
| **Database + API** | **Supabase (Postgres)** | Managed Postgres + auto-generated REST/Realtime + Row-Level Security. We get a real SQL DB without running one. Realtime powers live competitor alerts. |
| **Backend logic** | **Supabase Edge Functions** (Deno) or a thin **Node/Express** service | For anything that can't be a plain query: CSV enrichment, competitor scraping jobs, webhooks, AI matching. |
| **Payments** | **Razorpay** (primary, India) + optional **Stripe** (intl.) | Razorpay = UPI, cards, netbanking, INR, GST invoicing. The Pricing page is already built for INR. |
| **Hosting** | **Vercel** (frontend) + Supabase (data) | Zero-config deploy of this Vite app; preview URLs per PR. |
| **Background jobs** | **Supabase cron** / **Inngest** | Nightly competitor-activity scans, "new collab" alert generation, quota resets. |

**Why not a custom Node+Mongo backend from scratch?** We'd rebuild auth, RLS,
realtime, and a REST layer that Supabase gives for free. Revisit only if we
outgrow it.

---

## 2. Data model (Postgres)

Derived directly from today's `mock.js` + `store.jsx`.

```
users                      (managed by Clerk; mirror id + plan into Postgres)
  id            text  pk   -- Clerk user id
  email         text
  full_name     text
  brand_name    text
  city          text
  plan          text  default 'free'   -- free | pro | team
  searches_used int   default 0
  created_at    timestamptz

contacts                   -- the influencer/journalist database (shared, read-only to users)
  id            uuid  pk
  name, handle, type, platform, city   text
  niches        text[]
  followers     int
  engagement    numeric
  email         text
  price         text
  outlet        text
  languages     text[]
  collabs       text[]
  verified      bool
  updated_at    timestamptz

lists                      -- a user's saved shortlists
  id            uuid  pk
  user_id       text  fk -> users.id
  name, color, note   text
  created_at, updated_at

list_contacts              -- membership (many-to-many)
  list_id       uuid  fk
  contact_id    uuid  fk
  added_at      timestamptz
  primary key (list_id, contact_id)

saved_contacts             -- the bookmark/star set
  user_id       text  fk
  contact_id    uuid  fk
  primary key (user_id, contact_id)

competitors                -- brands a user is tracking
  id            uuid  pk
  user_id       text  fk
  brand, handle, category, avatar   text
  tracked_since timestamptz
  metrics       jsonb            -- {collabs30d, prMentions30d, avgEngagement, share}

competitor_events          -- the activity timeline (collabs / press)
  id            uuid  pk
  competitor_id uuid  fk
  type          text            -- collab | press | track
  title, detail, tag   text
  event_date    date
  detected_at   timestamptz

alerts                     -- the notification feed
  id            uuid  pk
  user_id       text  fk
  competitor_id uuid  fk
  event_id      uuid  fk
  read          bool  default false
  created_at    timestamptz
```

**Row-Level Security:** `lists`, `saved_contacts`, `competitors`, `alerts`,
`competitor_events` are all filtered by `user_id = auth.uid()`. `contacts` is
world-readable (it's the product's core dataset). This makes the "team
collaboration" v2 feature a small change: add an `org_id` and scope by org
instead of user.

---

## 3. How today's mock maps to real APIs

The frontend barely changes — we swap the `store.jsx` functions from
`localStorage` to Supabase calls. Same function signatures, same components.

| Current (mock) | Becomes |
|---|---|
| `usePersisted("saved", …)` | `select/insert/delete` on `saved_contacts` |
| `SAVED_LISTS` seed + `createList/addToList` | `lists` + `list_contacts` tables |
| `COMPETITORS` seed + `trackCompetitor` | `competitors` insert → triggers first scan |
| `seedAlerts()` | `alerts` table, streamed via Supabase Realtime |
| `bumpSearch()` client counter | server-side increment on `users.searches_used`, enforced in the search API |
| `downloadContactsCsv()` | **stays client-side** — already real; just feed it DB rows |
| Discover filter (in-memory `.filter`) | Postgres query: `where niches && $1 and city = $2 …`, full-text search on name/handle/niches |

**Search quota enforcement** moves server-side: the search endpoint checks
`plan` + `searches_used` before returning results, so it can't be bypassed from
the client (today's counter is honest-user-only).

---

## 4. Where the real data comes from

The one genuinely hard part — the mock has a clean contact DB; production needs
to fill it.

- **Contacts dataset (v1):** seed from a licensed/scraped starter set + manual
  curation for the launch niches (beauty, fitness, tech, food). Public profile
  fields (handle, platform, follower count, bio) via the Instagram Graph /
  YouTube Data APIs where permitted; email via opt-in + partnerships. Accuracy is
  the paid promise, so this is a data-ops investment, not just code.
- **Competitor activity (v1):** scheduled job that, given a competitor handle,
  checks recent tagged posts / mentions from public sources and writes
  `competitor_events`. New events → `alerts` rows → Realtime push to the bell.
- **Engagement / authenticity score (v2):** compute from follower growth curve,
  like/comment ratios, comment quality — a batch job writing back to `contacts`.

---

## 5. Payments (Razorpay)

1. Pricing page "Upgrade" → create a Razorpay **Subscription** (plans: Pro
   ₹1,499/mo & ₹14,990/yr, Team ₹3,999/mo & ₹39,990/yr — already in the UI).
2. Razorpay Checkout modal (UPI/card/netbanking) → on success, client gets a
   `payment_id`.
3. **Webhook** (`subscription.charged`, `subscription.cancelled`) → Edge Function
   verifies signature → updates `users.plan`. Never trust the client for plan
   state.
4. GST invoice via Razorpay's invoicing. Stripe added later for non-INR cards.

---

## 6. Phased rollout

**Phase 1 — Auth + persistence (make it a real account)**
Clerk login/signup, gated app shell, migrate `store.jsx` from localStorage to
Supabase for saved/lists/competitors/alerts. Ship the contact DB v1 seed.
→ *Result: real accounts, real saved data, real search over a real DB.*

**Phase 2 — Billing**
Razorpay subscriptions + webhook + server-side quota enforcement. Free tier
capped at 20 searches; Pro/Team unlock.
→ *Result: it makes money.*

**Phase 3 — Live competitor tracking**
Scheduled scan jobs → `competitor_events` → Realtime alerts. The bell and
Competitor page go live instead of seeded.
→ *Result: the second core feature is real.*

**Phase 4 — v2 intelligence**
Authenticity/engagement scoring, AI-suggested matches (embeddings over
contacts + brand profile), in-app outreach + response tracking, team seats
(org scoping).

---

## 7. Env / secrets checklist

```
# frontend (.env, VITE_ prefix = exposed to browser — publishable keys only)
VITE_CLERK_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_RAZORPAY_KEY_ID=

# server only (Edge Functions / never in the client bundle)
CLERK_SECRET_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

`.env*` is already gitignored. Anon/publishable keys are safe in the client; the
service-role and secret keys must live only in server functions.

---

### TL;DR
Clerk (auth) + Supabase/Postgres (data + realtime) + Razorpay (billing) +
Vercel (hosting). The UI already encodes the schema, so Phase 1 is mostly
swapping `store.jsx`'s localStorage calls for Supabase queries behind the same
function signatures. The real work is **data operations** — sourcing and keeping
the influencer/journalist dataset accurate, which is the actual product.
