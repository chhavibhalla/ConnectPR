# connectPR — UI/UX

Find PR & influencer contacts to pitch, and track what competitors are doing.
Clean, Notion/Linear-style SaaS UI for non-technical Indian founders & small marketing teams.

Built with **React 18 + Vite + Tailwind CSS v4**. Runs entirely on mock data — no API wiring needed.

## Run it

```bash
cd connectpr
npm install
npm run dev
```

Opens at http://localhost:5173

## What's included

| Page | Route | Highlights |
|------|-------|-----------|
| **Dashboard** | `/` | Hero quick-search, usage meter, recent searches, saved-list & competitor snapshots |
| **Search & Discover** | `/discover` | Filter sidebar (niche/city/platform/followers/engagement), **grid ↔ table toggle**, skeleton loaders, live-filtering feel, first-time onboarding empty state, no-results state |
| **Contact Profile** | `/contact/:id` | Bio, stats, past collabs, contact info, add-to-list, export, brand-fit score |
| **My Lists** | `/lists` | Campaign lists, create/delete, bulk select, **real CSV export**, per-list notes — all persisted |
| **Competitor Tracker** | `/competitors` | Add competitor (persisted), activity timeline, alerts feed, You-vs-Them compare bars |
| **Pricing** | `/pricing` | Free/Pro/Team, monthly-yearly toggle, comparison table, INR + Razorpay/Stripe |
| **Settings** | `/settings` | Profile, billing, team, notification toggles |

## What actually works (not just visual)

- **Real CSV export** (`src/lib/csv.js`) — downloads a proper `.csv` with a UTF-8
  BOM (so Excel renders ₹ and Hindi), RFC-4180 quote escaping, dated filenames.
  Wired into list export, bulk selection export, and single-contact export.
- **Local persistence** (`localStorage`, via `store.jsx`) — saved contacts,
  custom lists + membership, tracked competitors, alerts, and search usage all
  survive a page reload. Add-to-list from a profile really adds; new lists and
  new competitors stick.
- **Competitor alerts feed** — a bell in the top bar with an unread badge and
  dropdown, plus a "Recent alerts" card on the Competitor page. Tracking a new
  competitor generates a fresh alert.

See **[BACKEND_PLAN.md](./BACKEND_PLAN.md)** for the plan to make the rest real
(Clerk auth + Supabase/Postgres + Razorpay billing + live data).

## Design system

- **Brand:** violet (`brand-*`) + slate neutrals (`ink-*`), Inter font
- **Feedback:** save/bookmark buttons animate (fill + pop) and fire a toast
- **Modular components:** `SearchBar` (inline), `FilterSidebar`, `ContactCard`, `ContactRow` (table), `SavedListPanel` (Lists), `CompetitorCard`, plus shared primitives in `components/ui.jsx`

## Dark mode

Toggle with the sun/moon button in the top bar. The choice persists to
`localStorage` and defaults to your OS preference (`prefers-color-scheme`).
A tiny inline script in `index.html` applies the theme before first paint, so
there's no light-flash on reload.

**How it works:** colors are CSS custom-property tokens defined in `index.css`.
Dark mode is a single `.dark` class on `<html>` that *redefines the tokens* —
the neutral `ink` ramp is reversed (canvas ↔ text) and the accent tint pairs are
re-tuned for dark surfaces. Because Tailwind v4 utilities compile to
`var(--color-*)`, ~250 existing `bg-/text-/border-/ring-` classes flip
automatically with no per-element `dark:` variants. Raised surfaces use a
semantic `bg-surface` token (white → `#161f33`). Brand-600 was chosen to satisfy
both roles it plays — white-on-button label contrast **and** accent-text-on-dark
contrast (both pass WCAG AA for their text sizes).

## Structure

```
src/
  App.jsx            # shell: sidebar, topbar, routing, toast
  store.jsx          # saved contacts, toasts, usage counter (Context)
  data/mock.js       # all dummy data (12 contacts, lists, competitors)
  components/
    ui.jsx           # Button, Badge, Avatar, Card, Toggle, Skeleton, Stat
    icons.jsx        # inline SVG icon set (no icon lib dependency)
    ContactCard.jsx  # ContactCard + ContactRow
  pages/             # the 7 screens above
```

All classes are Tailwind utilities — no custom CSS framework.
