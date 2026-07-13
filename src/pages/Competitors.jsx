import { useState, useEffect } from "react"
import { useStore } from "../store.jsx"
import { Card, Badge, Button, Avatar, PlatformPill } from "../components/ui.jsx"
import {
  IconPlus, IconChart, IconNews, IconUsers, IconSpark, IconBell, IconTrash,
} from "../components/icons.jsx"
import { YOUR_BRAND } from "../data/mock.js"

function TimelineIcon({ type }) {
  if (type === "press")
    return <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-50 text-sky-600"><IconNews size={16} /></span>
  return <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600"><IconUsers size={16} /></span>
}

function CompareBar({ label, you, them, suffix = "" }) {
  const max = Math.max(you, them, 1)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-ink-500">
        <span>{label}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-xs font-medium text-brand-700">You</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(you / max) * 100}%` }} />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-bold text-ink-800">{you}{suffix}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-14 shrink-0 truncate text-xs font-medium text-ink-400">Them</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
            <div className="h-full rounded-full bg-ink-400 transition-all" style={{ width: `${(them / max) * 100}%` }} />
          </div>
          <span className="w-10 shrink-0 text-right text-xs font-bold text-ink-600">{them}{suffix}</span>
        </div>
      </div>
    </div>
  )
}

export default function Competitors() {
  const { competitors, trackCompetitor, alerts, notify } = useStore()
  const [input, setInput] = useState("")
  const [activeId, setActiveId] = useState(competitors[0]?.id)
  const active = competitors.find((k) => k.id === activeId) || competitors[0]

  // if the tracked set changes (added/removed), keep a valid selection
  useEffect(() => {
    if (!competitors.find((k) => k.id === activeId)) setActiveId(competitors[0]?.id)
  }, [competitors, activeId])

  const submit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    const created = trackCompetitor(input)
    if (created) setActiveId(created.id)
    setInput("")
  }

  const recentAlerts = alerts.slice(0, 4)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink-900">Competitor Tracker</h1>
        <p className="text-sm text-ink-500">See who your competitors are collaborating with and where they're getting press.</p>
      </div>

      {/* Add competitor */}
      <Card className="p-4">
        <form
          onSubmit={submit}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-ink-200 bg-surface px-3 py-1">
            <IconChart size={17} className="text-ink-400" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a competitor — brand name or @handle (e.g. @mamaearth)"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
          <Button type="submit"><IconPlus size={16} /> Track brand</Button>
        </form>
      </Card>

      {!active ? (
        <Card className="flex flex-col items-center py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-100 text-ink-400"><IconChart size={26} /></div>
          <h3 className="mt-4 font-semibold text-ink-900">No competitors tracked yet</h3>
          <p className="mt-1 max-w-sm text-sm text-ink-500">Add a brand name or handle above to start monitoring their collabs and PR mentions.</p>
        </Card>
      ) : (
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Competitor list + timeline */}
        <div className="space-y-4 lg:col-span-2">
          {/* selector */}
          <div className="flex flex-wrap gap-2">
            {competitors.map((k) => (
              <button
                key={k.id}
                onClick={() => setActiveId(k.id)}
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 transition ${
                  activeId === k.id ? "border-brand-300 bg-brand-50/60 ring-1 ring-brand-200" : "border-ink-200 bg-surface hover:border-brand-200"
                }`}
              >
                <Avatar src={k.avatar} name={k.brand} size={30} />
                <div className="text-left">
                  <div className="text-sm font-semibold text-ink-900">{k.brand}</div>
                  <div className="text-[11px] text-ink-400">{k.category}</div>
                </div>
              </button>
            ))}
          </div>

          {/* metrics row */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3.5">
              <div className="text-xs text-ink-400">Collabs · 30d</div>
              <div className="mt-0.5 text-2xl font-bold text-ink-900">{active.metrics.collabs30d}</div>
            </Card>
            <Card className="p-3.5">
              <div className="text-xs text-ink-400">PR mentions</div>
              <div className="mt-0.5 text-2xl font-bold text-ink-900">{active.metrics.prMentions30d}</div>
            </Card>
            <Card className="p-3.5">
              <div className="text-xs text-ink-400">Avg. engagement</div>
              <div className="mt-0.5 text-2xl font-bold text-emerald-600">{active.metrics.avgEngagement}%</div>
            </Card>
          </div>

          {/* activity timeline */}
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-ink-900">Recent activity</h2>
              <Badge tone="emerald">Live · tracked since {active.trackedSince}</Badge>
            </div>
            <ol className="relative space-y-4 border-l-2 border-ink-100 pl-5">
              {active.timeline.map((ev, i) => (
                <li key={i} className="animate-fade-up relative" style={{ animationDelay: `${i * 50}ms` }}>
                  <span className="absolute -left-[27px] top-0.5 grid h-4 w-4 place-items-center rounded-full border-2 border-surface bg-brand-500" />
                  <div className="flex items-start gap-3">
                    <TimelineIcon type={ev.type} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-ink-900">{ev.title}</span>
                        <PlatformPill platform={ev.tag} />
                      </div>
                      <p className="mt-0.5 text-sm text-ink-500">{ev.detail}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-ink-400">{ev.date}</span>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Head-to-head compare */}
        <div className="space-y-4">
          {/* alerts feed */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <IconBell size={17} className="text-brand-600" />
              <h2 className="font-semibold text-ink-900">Recent alerts</h2>
            </div>
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-ink-400">No alerts yet — new collabs & mentions will appear here.</p>
            ) : (
              <ul className="space-y-3">
                {recentAlerts.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${a.type === "press" ? "bg-sky-50 text-sky-600" : "bg-brand-50 text-brand-600"}`}>
                      {a.type === "press" ? <IconNews size={15} /> : <IconUsers size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-ink-900">{a.brand}</span>
                        {!a.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />}
                        <span className="ml-auto shrink-0 text-[11px] text-ink-400">{a.date}</span>
                      </div>
                      <p className="truncate text-sm text-ink-600">{a.title}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <IconSpark size={17} className="text-brand-600" />
              <h2 className="font-semibold text-ink-900">You vs {active.brand}</h2>
            </div>
            <p className="mt-0.5 mb-4 text-xs text-ink-400">Last 30 days · side-by-side</p>
            <div className="space-y-4">
              <CompareBar label="Influencer collabs" you={YOUR_BRAND.metrics.collabs30d} them={active.metrics.collabs30d} />
              <CompareBar label="PR mentions" you={YOUR_BRAND.metrics.prMentions30d} them={active.metrics.prMentions30d} />
              <CompareBar label="Avg. engagement" you={YOUR_BRAND.metrics.avgEngagement} them={active.metrics.avgEngagement} suffix="%" />
              <CompareBar label="Share of voice" you={YOUR_BRAND.metrics.share} them={active.metrics.share} suffix="%" />
            </div>
          </Card>

          <Card className="bg-gradient-to-b from-brand-50 to-surface p-5">
            <h3 className="text-sm font-semibold text-ink-900">💡 Opportunity</h3>
            <p className="mt-1 text-sm text-ink-600">
              {active.brand} works heavily with <b>{active.category.toLowerCase()}</b> creators.
              You're behind on PR mentions — pitch 3 journalists this week to close the gap.
            </p>
            <Button variant="primary" size="sm" className="mt-3" onClick={() => notify("Opening matching creators…")}>
              Find similar creators
            </Button>
          </Card>
        </div>
      </div>
      )}
    </div>
  )
}
