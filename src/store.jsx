// App store using Context — persists to localStorage so saved contacts,
// custom lists, tracked competitors and alerts survive a page reload.
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { SAVED_LISTS, COMPETITORS } from "./data/mock.js"

const StoreContext = createContext(null)

const KEY = (k) => `cpr-${k}`

// Generic localStorage-backed state. Reads once on init, writes on change.
function usePersisted(key, initial) {
  // Support a lazy initializer like React's useState: if `initial` is a
  // function, call it to produce the seed value (used for seedAlerts).
  const seed = () => (typeof initial === "function" ? initial() : initial)
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return seed()
    try {
      const raw = window.localStorage.getItem(KEY(key))
      return raw != null ? JSON.parse(raw) : seed()
    } catch {
      return seed()
    }
  })
  useEffect(() => {
    try {
      window.localStorage.setItem(KEY(key), JSON.stringify(value))
    } catch {
      /* quota / private-mode — ignore, stay in-memory */
    }
  }, [key, value])
  return [value, setValue]
}

function initialTheme() {
  if (typeof window === "undefined") return "light"
  const saved = window.localStorage.getItem(KEY("theme"))
  if (saved === "dark" || saved === "light") return saved
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

// Seed alerts from the existing competitor timelines on first run.
function seedAlerts() {
  const items = []
  COMPETITORS.forEach((k) => {
    k.timeline.slice(0, 2).forEach((ev, i) => {
      items.push({
        id: `${k.id}-${i}`,
        competitorId: k.id,
        brand: k.brand,
        avatar: k.avatar,
        type: ev.type,
        title: ev.title,
        detail: ev.detail,
        tag: ev.tag,
        date: ev.date,
        read: false,
      })
    })
  })
  return items
}

export function StoreProvider({ children }) {
  // ---- theme ----
  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem(KEY("theme"), theme)
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

  // ---- saved contacts (persisted array of ids) ----
  const [savedIds, setSavedIds] = usePersisted("saved", ["c1", "c7"])
  const saved = new Set(savedIds)
  const isSaved = useCallback((id) => saved.has(id), [savedIds]) // eslint-disable-line
  const toggleSave = useCallback((contact) => {
    setSavedIds((prev) => {
      if (prev.includes(contact.id)) {
        notify(`Removed ${contact.name} from saved`, "slate")
        return prev.filter((x) => x !== contact.id)
      }
      notify(`${contact.name} saved`, "brand")
      return [...prev, contact.id]
    })
  }, [setSavedIds, notify])

  // ---- custom lists (persisted; seeded from mock) ----
  const [lists, setLists] = usePersisted("lists", SAVED_LISTS)

  const createList = useCallback((name, opts = {}) => {
    const list = {
      id: `l-${Date.now()}`,
      name: name?.trim() || "Untitled list",
      color: opts.color || "brand",
      note: opts.note || "",
      contactIds: opts.contactIds || [],
      updated: "just now",
    }
    setLists((prev) => [list, ...prev])
    notify(`List “${list.name}” created`)
    return list
  }, [setLists, notify])

  const addToList = useCallback((listId, contact) => {
    setLists((prev) =>
      prev.map((l) => {
        if (l.id !== listId) return l
        if (l.contactIds.includes(contact.id)) {
          notify(`${contact.name} is already in “${l.name}”`, "slate")
          return l
        }
        notify(`Added ${contact.name} to “${l.name}”`)
        return { ...l, contactIds: [...l.contactIds, contact.id], updated: "just now" }
      })
    )
  }, [setLists, notify])

  const removeFromList = useCallback((listId, contactIds) => {
    const ids = Array.isArray(contactIds) ? contactIds : [contactIds]
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, contactIds: l.contactIds.filter((id) => !ids.includes(id)), updated: "just now" }
          : l
      )
    )
  }, [setLists])

  const updateListNote = useCallback((listId, note) => {
    setLists((prev) => prev.map((l) => (l.id === listId ? { ...l, note } : l)))
  }, [setLists])

  // ---- tracked competitors (persisted; seeded from mock) ----
  const [competitors, setCompetitors] = usePersisted("competitors", COMPETITORS)
  // ---- alerts feed (persisted; seeded from timelines) ----
  const [alerts, setAlerts] = usePersisted("alerts", seedAlerts)

  const trackCompetitor = useCallback((raw) => {
    const name = raw.trim().replace(/^@/, "")
    if (!name) return
    const handle = raw.trim().startsWith("@") ? raw.trim() : `@${name.toLowerCase().replace(/\s+/g, "")}`
    const id = `k-${Date.now()}`
    const avatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=ede9fe,ddd6fe,c4b5fd`
    const competitor = {
      id, brand: name, handle, avatar,
      category: "Newly tracked", trackedSince: "Jul 2026",
      metrics: { collabs30d: 0, prMentions30d: 0, avgEngagement: 0, share: 0 },
      timeline: [
        { date: "Just now", type: "press", title: `Started tracking ${name}`, detail: "We'll surface new collabs & PR mentions here as they're detected.", tag: "News/Press" },
      ],
    }
    setCompetitors((prev) => [competitor, ...prev])
    setAlerts((prev) => [
      { id: `${id}-new`, competitorId: id, brand: name, avatar, type: "track", title: `Now tracking ${name}`, detail: "Monitoring for new influencer collabs and press mentions.", tag: "News/Press", date: "Just now", read: false },
      ...prev,
    ])
    notify(`Now tracking ${name}`)
    return competitor
  }, [setCompetitors, setAlerts, notify])

  const unreadAlerts = alerts.filter((a) => !a.read).length
  const markAlertsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => (a.read ? a : { ...a, read: true })))
  }, [setAlerts])
  const clearAlerts = useCallback(() => setAlerts([]), [setAlerts])

  // ---- usage counter (persisted) ----
  const [searchesUsed, setSearchesUsed] = usePersisted("searches", 12)
  const searchQuota = 20
  const bumpSearch = useCallback(
    () => setSearchesUsed((n) => Math.min(searchQuota, n + 1)),
    [setSearchesUsed]
  )

  const value = {
    // theme
    theme, toggleTheme,
    // toast
    toast, notify,
    // saved
    saved, savedIds, isSaved, toggleSave,
    // lists
    lists, createList, addToList, removeFromList, updateListNote,
    // competitors
    competitors, trackCompetitor,
    // alerts
    alerts, unreadAlerts, markAlertsRead, clearAlerts,
    // usage
    searchesUsed, searchQuota, bumpSearch,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
