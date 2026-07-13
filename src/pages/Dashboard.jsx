import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../store.jsx"
import { Card, Badge, Button, Avatar, Stat } from "../components/ui.jsx"
import {
  IconSearch, IconSpark, IconChevron, IconCompass, IconBookmark,
  IconChart, IconPlus,
} from "../components/icons.jsx"
import {
  RECENT_SEARCHES, CONTACTS, EXAMPLE_SEARCHES, formatFollowers,
} from "../data/mock.js"

const LIST_COLOR = {
  brand: "bg-brand-50 text-brand-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
}

export default function Dashboard() {
  const { searchesUsed, searchQuota, saved, lists: SAVED_LISTS, competitors: COMPETITORS } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState("")

  const go = (query) => navigate(`/discover${query ? `?q=${encodeURIComponent(query)}` : ""}`)

  return (
    <div className="space-y-6">
      {/* Hero search */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 p-6 text-white shadow-lg shadow-brand-600/20 sm:p-8">
        <div className="max-w-2xl">
          <Badge className="!bg-white/15 !text-white !ring-white/20">
            <IconSpark size={13} /> Good afternoon, Chhavi
          </Badge>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Find the right creators &amp; journalists to pitch — in seconds.
          </h1>
          <p className="mt-1.5 text-sm text-brand-100">
            Search 12,000+ verified India-focused influencer &amp; press contacts.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); go(q) }}
            className="mt-5 flex items-center gap-2 rounded-2xl bg-surface p-1.5 shadow-lg"
          >
            <IconSearch size={19} className="ml-2 text-ink-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by niche, city or platform…"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
            />
            <Button type="submit" size="md">Search</Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLE_SEARCHES.map((ex) => (
              <button
                key={ex}
                onClick={() => go(ex)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/20"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stat row */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-4"><Stat label="Searches this month" value={`${searchesUsed}/${searchQuota}`} sub="Free plan" tone="brand" /></Card>
        <Card className="p-4"><Stat label="Saved contacts" value={saved.size} sub="Across all lists" /></Card>
        <Card className="p-4"><Stat label="Active lists" value={SAVED_LISTS.length} sub="Campaigns" tone="emerald" /></Card>
        <Card className="p-4"><Stat label="Competitors tracked" value={COMPETITORS.length} sub="Live monitoring" tone="amber" /></Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent searches */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-ink-900">Recent searches</h2>
              <Link to="/discover" className="text-xs font-medium text-brand-600 hover:text-brand-700">Open Discover →</Link>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {RECENT_SEARCHES.map((s) => (
                <button
                  key={s.q}
                  onClick={() => go(s.q)}
                  className="group flex flex-col items-start rounded-xl border border-ink-200 bg-surface p-3 text-left transition hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <IconSearch size={16} className="text-ink-400 group-hover:text-brand-500" />
                  <span className="mt-2 text-sm font-medium text-ink-800">{s.q}</span>
                  <span className="mt-0.5 text-xs text-ink-400">{s.city} · {s.platform}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Suggested contacts */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-ink-900">Suggested for you</h2>
                <p className="text-xs text-ink-400">High-engagement creators matching your niche</p>
              </div>
              <Link to="/discover"><Button variant="ghost" size="sm">See all <IconChevron size={14} /></Button></Link>
            </div>
            <div className="divide-y divide-ink-100">
              {CONTACTS.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  to={`/contact/${c.id}`}
                  className="flex items-center gap-3 py-2.5 transition hover:bg-ink-50/60 -mx-2 px-2 rounded-lg"
                >
                  <Avatar src={c.avatar} name={c.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink-900">{c.name}</div>
                    <div className="truncate text-xs text-ink-400">{c.handle} · {c.city}</div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <div className="text-sm font-bold text-ink-900">{formatFollowers(c.followers)}</div>
                    <div className="text-xs text-ink-400">followers</div>
                  </div>
                  <Badge tone="emerald">{c.engagement}% eng.</Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Saved lists */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-ink-900">Your lists</h2>
              <Link to="/lists" className="text-xs font-medium text-brand-600 hover:text-brand-700">Manage →</Link>
            </div>
            <div className="space-y-2">
              {SAVED_LISTS.map((l) => (
                <Link
                  key={l.id}
                  to="/lists"
                  className="flex items-center gap-3 rounded-xl border border-ink-200 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${LIST_COLOR[l.color]}`}>
                    <IconBookmark size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink-900">{l.name}</div>
                    <div className="text-xs text-ink-400">{l.contactIds.length} contacts · {l.updated}</div>
                  </div>
                  <IconChevron size={16} className="text-ink-300" />
                </Link>
              ))}
              <Link to="/discover">
                <button className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink-300 py-2.5 text-sm font-medium text-ink-500 transition hover:border-brand-300 hover:text-brand-600">
                  <IconPlus size={15} /> New list
                </button>
              </Link>
            </div>
          </Card>

          {/* Competitor snapshot */}
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold text-ink-900">Competitor snapshot</h2>
              <Link to="/competitors" className="text-xs font-medium text-brand-600 hover:text-brand-700">View →</Link>
            </div>
            <div className="space-y-3">
              {COMPETITORS.map((k) => (
                <div key={k.id} className="rounded-xl border border-ink-200 p-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={k.avatar} name={k.brand} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-ink-900">{k.brand}</div>
                      <div className="text-xs text-ink-400">{k.category}</div>
                    </div>
                    <Badge tone="amber"><IconChart size={12} /> {k.metrics.collabs30d} collabs</Badge>
                  </div>
                  <p className="mt-2 line-clamp-1 text-xs text-ink-500">
                    Latest: {k.timeline[0].title}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
