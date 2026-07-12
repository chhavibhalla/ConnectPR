import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useStore } from "../store.jsx"
import { Button, Badge, Toggle, Skeleton, Card } from "../components/ui.jsx"
import { ContactCard, ContactRow } from "../components/ContactCard.jsx"
import {
  IconSearch, IconGrid, IconRows, IconSpark, IconCompass, IconCheck,
} from "../components/icons.jsx"
import { CONTACTS, NICHES, CITIES, PLATFORMS, EXAMPLE_SEARCHES } from "../data/mock.js"

const FOLLOWER_BANDS = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Nano · <10K", min: 0, max: 10000 },
  { label: "Micro · 10K–100K", min: 10000, max: 100000 },
  { label: "Mid · 100K–500K", min: 100000, max: 500000 },
  { label: "Macro · 500K+", min: 500000, max: Infinity },
]

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-ink-100 py-4 first:pt-0 last:border-0">
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400">{title}</h3>
      {children}
    </div>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset transition ${
        active
          ? "bg-brand-600 text-white ring-brand-600"
          : "bg-surface text-ink-600 ring-ink-200 hover:ring-brand-300 hover:text-brand-600"
      }`}
    >
      {children}
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-ink-200/80 bg-surface p-4">
      <div className="flex gap-3">
        <Skeleton className="h-13 w-13 !rounded-full" />
        <div className="flex-1 space-y-2 pt-1">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-24 !rounded-full" />
        </div>
      </div>
      <div className="mt-3 flex gap-1.5">
        <Skeleton className="h-5 w-16 !rounded-full" />
        <Skeleton className="h-5 w-14 !rounded-full" />
      </div>
      <Skeleton className="mt-4 h-16 w-full" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-8 flex-1" /><Skeleton className="h-8 flex-1" />
      </div>
    </div>
  )
}

export default function Discover() {
  const [params, setParams] = useSearchParams()
  const { bumpSearch } = useStore()
  const [query, setQuery] = useState(params.get("q") || "")
  const [niche, setNiche] = useState([])
  const [city, setCity] = useState("")
  const [platform, setPlatform] = useState([])
  const [band, setBand] = useState(0)
  const [minEng, setMinEng] = useState(0)
  const [view, setView] = useState("grid")
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(Boolean(params.get("q")))

  // simulate a fetch on any filter change (live-filtering feel)
  useEffect(() => {
    if (!hasSearched) return
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 550)
    return () => clearTimeout(t)
  }, [query, niche, city, platform, band, minEng, hasSearched])

  const runSearch = (q) => {
    setQuery(q)
    setParams(q ? { q } : {})
    setHasSearched(true)
    bumpSearch()
  }

  const toggleIn = (arr, set, val) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])

  const results = useMemo(() => {
    const b = FOLLOWER_BANDS[band]
    const q = query.trim().toLowerCase()
    return CONTACTS.filter((c) => {
      if (q) {
        const hay = `${c.name} ${c.handle} ${c.niches.join(" ")} ${c.city} ${c.platform} ${c.type}`.toLowerCase()
        if (!hay.includes(q)) {
          // loose token match so example searches still return something
          const tokens = q.split(/\s+/).filter((t) => t.length > 2)
          if (!tokens.some((t) => hay.includes(t))) return false
        }
      }
      if (niche.length && !niche.some((n) => c.niches.includes(n))) return false
      if (city && c.city !== city) return false
      if (platform.length && !platform.includes(c.platform)) return false
      if (c.type !== "Journalist") {
        if (c.followers < b.min || c.followers > b.max) return false
        if (c.engagement < minEng) return false
      }
      return true
    })
  }, [query, niche, city, platform, band, minEng])

  const activeFilters = niche.length + platform.length + (city ? 1 : 0) + (band ? 1 : 0) + (minEng ? 1 : 0)
  const clearAll = () => { setNiche([]); setCity(""); setPlatform([]); setBand(0); setMinEng(0) }

  // First-time onboarding empty state
  if (!hasSearched) {
    return (
      <div className="mx-auto max-w-2xl py-6 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <IconCompass size={30} />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-ink-900">Search your first influencer</h1>
        <p className="mt-2 text-sm text-ink-500">
          Describe who you want to pitch — by niche, city, or platform. We'll surface verified contacts with reach &amp; engagement.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); runSearch(query) }}
          className="mt-6 flex items-center gap-2 rounded-2xl border border-ink-200 bg-surface p-1.5 shadow-sm focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100"
        >
          <IconSearch size={19} className="ml-2 text-ink-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. beauty micro-influencers in Mumbai"
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none"
          />
          <Button type="submit">Search</Button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="py-1 text-xs font-medium text-ink-400">Try:</span>
          {EXAMPLE_SEARCHES.map((ex) => (
            <button
              key={ex}
              onClick={() => runSearch(ex)}
              className="rounded-full border border-ink-200 bg-surface px-3 py-1 text-xs font-medium text-ink-600 transition hover:border-brand-300 hover:text-brand-600"
            >
              {ex}
            </button>
          ))}
        </div>
        <Card className="mx-auto mt-8 max-w-md p-4 text-left">
          <div className="flex items-start gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><IconCheck size={16} /></span>
            <div>
              <div className="text-sm font-semibold text-ink-800">Free plan: 20 searches / month</div>
              <div className="text-xs text-ink-500">No credit card. Upgrade anytime for unlimited search &amp; exports.</div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Filter sidebar */}
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Filters</h2>
            {activeFilters > 0 && (
              <button onClick={clearAll} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                Clear ({activeFilters})
              </button>
            )}
          </div>

          <FilterSection title="Niche / Category">
            <div className="flex flex-wrap gap-1.5">
              {NICHES.map((n) => (
                <Chip key={n} active={niche.includes(n)} onClick={() => toggleIn(niche, setNiche, n)}>{n}</Chip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Platform">
            <div className="flex flex-wrap gap-1.5">
              {PLATFORMS.map((p) => (
                <Chip key={p} active={platform.includes(p)} onClick={() => toggleIn(platform, setPlatform, p)}>{p}</Chip>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="City">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-surface px-3 py-2 text-sm text-ink-700 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
            >
              <option value="">All cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FilterSection>

          <FilterSection title="Follower range">
            <div className="space-y-1.5">
              {FOLLOWER_BANDS.map((f, i) => (
                <label key={f.label} className="flex cursor-pointer items-center gap-2 text-sm text-ink-600">
                  <input
                    type="radio" name="band" checked={band === i} onChange={() => setBand(i)}
                    className="h-3.5 w-3.5 accent-brand-600"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title={`Min. engagement · ${minEng}%`}>
            <input
              type="range" min="0" max="9" step="1" value={minEng}
              onChange={(e) => setMinEng(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-ink-400"><span>0%</span><span>9%+</span></div>
          </FilterSection>
        </Card>
      </aside>

      {/* Results */}
      <section className="min-w-0">
        {/* search bar + controls */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={(e) => { e.preventDefault(); runSearch(query) }} className="relative flex-1">
            <IconSearch size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search influencers & journalists…"
              className="w-full rounded-xl border border-ink-200 bg-surface py-2.5 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </form>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-ink-500">
              {loading ? "Searching…" : <><b className="text-ink-800">{results.length}</b> results</>}
            </span>
            <Toggle
              value={view}
              onChange={setView}
              options={[
                { value: "grid", label: "Grid", icon: <IconGrid size={15} /> },
                { value: "table", label: "Table", icon: <IconRows size={15} /> },
              ]}
            />
          </div>
        </div>

        {/* active filter chips */}
        {activeFilters > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {city && <Badge tone="brand">{city}</Badge>}
            {niche.map((n) => <Badge key={n} tone="brand">{n}</Badge>)}
            {platform.map((p) => <Badge key={p} tone="sky">{p}</Badge>)}
            {band > 0 && <Badge tone="amber">{FOLLOWER_BANDS[band].label}</Badge>}
            {minEng > 0 && <Badge tone="emerald">{minEng}%+ eng.</Badge>}
          </div>
        )}

        {/* loading skeletons */}
        {loading ? (
          view === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <Card className="divide-y divide-ink-100 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <Skeleton className="h-10 w-10 !rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </Card>
          )
        ) : results.length === 0 ? (
          // no-results empty state
          <Card className="flex flex-col items-center py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-100 text-ink-400">
              <IconSearch size={26} />
            </div>
            <h3 className="mt-4 font-semibold text-ink-900">No contacts match those filters</h3>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Try widening the follower range or removing a niche. Great pitches often start with micro-creators.
            </p>
            <Button variant="secondary" size="md" className="mt-4" onClick={clearAll}>Clear filters</Button>
          </Card>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((c, i) => <ContactCard key={c.id} contact={c} delay={i * 40} />)}
          </div>
        ) : (
          <Card className="animate-fade-up overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-ink-200 text-xs font-semibold uppercase tracking-wide text-ink-400">
                    <th className="py-2.5 pl-4 pr-3 font-semibold">Contact</th>
                    <th className="px-3 font-semibold">Platform</th>
                    <th className="px-3 font-semibold">Niche</th>
                    <th className="px-3 font-semibold">City</th>
                    <th className="px-3 font-semibold">Followers</th>
                    <th className="px-3 font-semibold">Engmt.</th>
                    <th className="py-2.5 pl-3 pr-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((c) => <ContactRow key={c.id} contact={c} />)}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  )
}
