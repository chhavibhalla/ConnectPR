// App store. Two modes, one public API (so pages never change):
//   • local mode  — no Supabase keys: state persists to localStorage.
//   • cloud mode  — Supabase configured + user logged in: state loads from
//     and writes to Postgres (optimistic UI + background sync).
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { SAVED_LISTS, COMPETITORS } from "./data/mock.js"
import { supabase, isSupabaseConfigured } from "./lib/supabase.js"
import { useAuth } from "./auth.jsx"

const StoreContext = createContext(null)
const CLOUD = isSupabaseConfigured
const KEY = (k) => `cpr-${k}`

// ---- localStorage helpers (local mode) ----
function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(KEY(key))
    return raw != null ? JSON.parse(raw) : (typeof fallback === "function" ? fallback() : fallback)
  } catch {
    return typeof fallback === "function" ? fallback() : fallback
  }
}
function writeLS(key, value) {
  try { localStorage.setItem(KEY(key), JSON.stringify(value)) } catch { /* ignore */ }
}

function initialTheme() {
  const saved = localStorage.getItem(KEY("theme"))
  if (saved === "dark" || saved === "light") return saved
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function seedAlerts() {
  const items = []
  COMPETITORS.forEach((k) => {
    k.timeline.slice(0, 2).forEach((ev, i) => {
      items.push({
        id: `${k.id}-${i}`, competitorId: k.id, brand: k.brand, avatar: k.avatar,
        type: ev.type, title: ev.title, detail: ev.detail, tag: ev.tag, date: ev.date, read: false,
      })
    })
  })
  return items
}

function relTime(iso) {
  if (!iso) return "just now"
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d <= 0) return "today"
  if (d === 1) return "1 day ago"
  if (d < 7) return `${d} days ago`
  return `${Math.floor(d / 7)} week${d < 14 ? "" : "s"} ago`
}

const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(performance.now())}`

const mapCompetitor = (row) => ({
  id: row.id, brand: row.brand, handle: row.handle, category: row.category,
  avatar: row.avatar, trackedSince: row.tracked_since,
  metrics: row.metrics || {}, timeline: row.timeline || [],
})

export function StoreProvider({ children }) {
  const { user } = useAuth()

  // ---- theme (always local) ----
  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem(KEY("theme"), theme)
  }, [theme])
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), [])

  // ---- toast ----
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)
  const notify = useCallback((message, tone = "brand") => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Math.round(performance.now()) })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])
  const syncError = useCallback((res) => {
    if (res && res.error) notify("Couldn't sync — check your connection", "slate")
  }, [notify])

  // ---- data state (init from localStorage in local mode, empty in cloud) ----
  const [savedIds, setSavedIds] = useState(() => (CLOUD ? [] : readLS("saved", ["c1", "c7"])))
  const [lists, setLists] = useState(() => (CLOUD ? [] : readLS("lists", SAVED_LISTS)))
  const [competitors, setCompetitors] = useState(() => (CLOUD ? [] : readLS("competitors", COMPETITORS)))
  const [alerts, setAlerts] = useState(() => (CLOUD ? [] : readLS("alerts", seedAlerts)))
  const [searchesUsed, setSearchesUsed] = useState(() => (CLOUD ? 0 : readLS("searches", 12)))
  const [ready, setReady] = useState(!CLOUD)
  const searchQuota = 20

  // ---- persist to localStorage (local mode only) ----
  useEffect(() => { if (!CLOUD) writeLS("saved", savedIds) }, [savedIds])
  useEffect(() => { if (!CLOUD) writeLS("lists", lists) }, [lists])
  useEffect(() => { if (!CLOUD) writeLS("competitors", competitors) }, [competitors])
  useEffect(() => { if (!CLOUD) writeLS("alerts", alerts) }, [alerts])
  useEffect(() => { if (!CLOUD) writeLS("searches", searchesUsed) }, [searchesUsed])

  // ---- cloud: seed a brand-new user with the demo data ----
  const seedCloud = useCallback(async () => {
    const listRows = SAVED_LISTS.map((l) => ({ id: uid(), user_id: user.id, name: l.name, color: l.color, note: l.note, _contacts: l.contactIds }))
    await supabase.from("lists").insert(listRows.map(({ _contacts, ...r }) => r))
    const memberships = listRows.flatMap((l) => l._contacts.map((cid) => ({ list_id: l.id, contact_id: cid })))
    if (memberships.length) await supabase.from("list_contacts").insert(memberships)

    const compRows = COMPETITORS.map((k) => ({ id: uid(), user_id: user.id, brand: k.brand, handle: k.handle, category: k.category, avatar: k.avatar, tracked_since: k.trackedSince, metrics: k.metrics, timeline: k.timeline }))
    await supabase.from("competitors").insert(compRows)

    const alertRows = seedAlerts().map((a) => ({ user_id: user.id, brand: a.brand, avatar: a.avatar, type: a.type, title: a.title, detail: a.detail, tag: a.tag, date: a.date, read: a.read }))
    await supabase.from("alerts").insert(alertRows)

    await supabase.from("profiles").update({ seeded: true }).eq("id", user.id)
  }, [user])

  // ---- cloud: load everything for the logged-in user ----
  const loadCloud = useCallback(async () => {
    setReady(false)
    const { data: profile } = await supabase.from("profiles").select("searches_used, seeded").eq("id", user.id).maybeSingle()
    if (profile && !profile.seeded) {
      try { await seedCloud() } catch { /* if seeding fails, continue with empty */ }
    }
    const [savedRes, listRes, compRes, alertRes, profRes] = await Promise.all([
      supabase.from("saved_contacts").select("contact_id").eq("user_id", user.id),
      supabase.from("lists").select("id,name,color,note,updated_at,list_contacts(contact_id)").eq("user_id", user.id).order("created_at", { ascending: true }),
      supabase.from("competitors").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("alerts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("profiles").select("searches_used").eq("id", user.id).maybeSingle(),
    ])
    setSavedIds((savedRes.data || []).map((r) => r.contact_id))
    setLists((listRes.data || []).map((l) => ({
      id: l.id, name: l.name, color: l.color, note: l.note || "",
      updated: relTime(l.updated_at), contactIds: (l.list_contacts || []).map((c) => c.contact_id),
    })))
    setCompetitors((compRes.data || []).map(mapCompetitor))
    setAlerts((alertRes.data || []).map((a) => ({ ...a, competitorId: a.competitor_id })))
    setSearchesUsed(profRes.data?.searches_used ?? 0)
    setReady(true)
  }, [user, seedCloud])

  useEffect(() => {
    if (!CLOUD) return
    if (!user) {
      setSavedIds([]); setLists([]); setCompetitors([]); setAlerts([]); setSearchesUsed(0); setReady(false)
      return
    }
    loadCloud()
  }, [user, loadCloud])

  // ---- saved contacts ----
  const saved = new Set(savedIds)
  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds])
  const toggleSave = useCallback((contact) => {
    const has = savedIds.includes(contact.id)
    setSavedIds((prev) => (has ? prev.filter((x) => x !== contact.id) : [...prev, contact.id]))
    notify(has ? `Removed ${contact.name} from saved` : `${contact.name} saved`, has ? "slate" : "brand")
    if (CLOUD && user) {
      if (has) supabase.from("saved_contacts").delete().eq("user_id", user.id).eq("contact_id", contact.id).then(syncError)
      else supabase.from("saved_contacts").insert({ user_id: user.id, contact_id: contact.id }).then(syncError)
    }
  }, [savedIds, notify, user, syncError])

  // ---- lists ----
  const createList = useCallback((name, opts = {}) => {
    const list = { id: uid(), name: name?.trim() || "Untitled list", color: opts.color || "brand", note: opts.note || "", contactIds: opts.contactIds || [], updated: "just now" }
    setLists((prev) => [list, ...prev])
    notify(`List “${list.name}” created`)
    if (CLOUD && user) {
      supabase.from("lists").insert({ id: list.id, user_id: user.id, name: list.name, color: list.color, note: list.note }).then(syncError)
    }
    return list
  }, [notify, user, syncError])

  const addToList = useCallback((listId, contact) => {
    let added = false
    setLists((prev) => prev.map((l) => {
      if (l.id !== listId) return l
      if (l.contactIds.includes(contact.id)) return l
      added = true
      return { ...l, contactIds: [...l.contactIds, contact.id], updated: "just now" }
    }))
    const l = lists.find((x) => x.id === listId)
    if (!added) { notify(`${contact.name} is already in “${l?.name}”`, "slate"); return }
    notify(`Added ${contact.name} to “${l?.name}”`)
    if (CLOUD && user) supabase.from("list_contacts").insert({ list_id: listId, contact_id: contact.id }).then(syncError)
  }, [lists, notify, user, syncError])

  const removeFromList = useCallback((listId, contactIds) => {
    const ids = Array.isArray(contactIds) ? contactIds : [contactIds]
    setLists((prev) => prev.map((l) => l.id === listId ? { ...l, contactIds: l.contactIds.filter((id) => !ids.includes(id)), updated: "just now" } : l))
    if (CLOUD && user) supabase.from("list_contacts").delete().eq("list_id", listId).in("contact_id", ids).then(syncError)
  }, [user, syncError])

  const noteTimers = useRef({})
  const updateListNote = useCallback((listId, note) => {
    setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, note } : l)))
    if (CLOUD && user) {
      clearTimeout(noteTimers.current[listId])
      noteTimers.current[listId] = setTimeout(() => {
        supabase.from("lists").update({ note, updated_at: new Date().toISOString() }).eq("id", listId).then(syncError)
      }, 700)
    }
  }, [user, syncError])

  // ---- competitors + alerts ----
  const trackCompetitor = useCallback((raw) => {
    const name = raw.trim().replace(/^@/, "")
    if (!name) return
    const handle = raw.trim().startsWith("@") ? raw.trim() : `@${name.toLowerCase().replace(/\s+/g, "")}`
    const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=ede9fe,ddd6fe,c4b5fd`
    const id = uid()
    const timeline = [{ date: "Just now", type: "press", title: `Started tracking ${name}`, detail: "We'll surface new collabs & PR mentions here as they're detected.", tag: "News/Press" }]
    const metrics = { collabs30d: 0, prMentions30d: 0, avgEngagement: 0, share: 0 }
    const competitor = { id, brand: name, handle, avatar, category: "Newly tracked", trackedSince: "Jul 2026", metrics, timeline }
    setCompetitors((prev) => [competitor, ...prev])

    const alertId = uid()
    const alert = { id: alertId, competitorId: id, brand: name, avatar, type: "track", title: `Now tracking ${name}`, detail: "Monitoring for new influencer collabs and press mentions.", tag: "News/Press", date: "Just now", read: false }
    setAlerts((prev) => [alert, ...prev])
    notify(`Now tracking ${name}`)

    if (CLOUD && user) {
      supabase.from("competitors").insert({ id, user_id: user.id, brand: name, handle, category: "Newly tracked", avatar, tracked_since: "Jul 2026", metrics, timeline }).then(syncError)
      supabase.from("alerts").insert({ id: alertId, user_id: user.id, competitor_id: id, brand: name, avatar, type: "track", title: alert.title, detail: alert.detail, tag: alert.tag, date: alert.date, read: false }).then(syncError)
    }
    return competitor
  }, [notify, user, syncError])

  const unreadAlerts = alerts.filter((a) => !a.read).length
  const markAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => (a.read ? a : { ...a, read: true })))
    if (CLOUD && user) supabase.from("alerts").update({ read: true }).eq("user_id", user.id).eq("read", false).then(syncError)
  }, [user, syncError])
  const clearAlerts = useCallback(() => {
    setAlerts([])
    if (CLOUD && user) supabase.from("alerts").delete().eq("user_id", user.id).then(syncError)
  }, [user, syncError])

  // ---- usage ----
  const bumpSearch = useCallback(() => {
    setSearchesUsed((n) => {
      const next = Math.min(searchQuota, n + 1)
      if (CLOUD && user && next !== n) supabase.from("profiles").update({ searches_used: next }).eq("id", user.id).then(syncError)
      return next
    })
  }, [user, syncError])

  const value = {
    theme, toggleTheme,
    toast, notify,
    ready,
    saved, savedIds, isSaved, toggleSave,
    lists, createList, addToList, removeFromList, updateListNote,
    competitors, trackCompetitor,
    alerts, unreadAlerts, markAlertsRead, clearAlerts,
    searchesUsed, searchQuota, bumpSearch,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
