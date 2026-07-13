import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store.jsx"
import { Card, Badge, Button, Avatar } from "../components/ui.jsx"
import {
  IconBookmark, IconExport, IconTrash, IconPlus, IconChevron, IconMail, IconVerified,
} from "../components/icons.jsx"
import { CONTACTS, formatFollowers } from "../data/mock.js"
import { downloadContactsCsv } from "../lib/csv.js"

const DOT = { brand: "bg-brand-500", emerald: "bg-emerald-500", amber: "bg-amber-500", sky: "bg-sky-500", rose: "bg-rose-500" }

export default function Lists() {
  const { lists, createList, removeFromList, updateListNote, notify } = useStore()
  const [activeId, setActiveId] = useState(lists[0]?.id)
  const [selected, setSelected] = useState(new Set())
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")

  // keep a valid active list if lists change (create / none)
  useEffect(() => {
    if (!lists.find((l) => l.id === activeId)) setActiveId(lists[0]?.id)
  }, [lists, activeId])

  const list = lists.find((l) => l.id === activeId)
  const contacts = list ? list.contactIds.map((id) => CONTACTS.find((c) => c.id === id)).filter(Boolean) : []

  const toggleSel = (id) =>
    setSelected((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const allSelected = contacts.length > 0 && selected.size === contacts.length

  const exportList = () => {
    const n = downloadContactsCsv(contacts, list.name)
    notify(n ? `Exported ${n} contacts to CSV` : "List is empty", n ? "brand" : "slate")
  }
  const exportSelected = () => {
    const rows = contacts.filter((c) => selected.has(c.id))
    const n = downloadContactsCsv(rows, `${list.name}-selection`)
    notify(`Exported ${n} contacts to CSV`)
  }
  const removeSelected = () => {
    removeFromList(list.id, [...selected])
    notify(`Removed ${selected.size} from “${list.name}”`, "slate")
    setSelected(new Set())
  }

  const submitNew = (e) => {
    e.preventDefault()
    const created = createList(newName)
    setActiveId(created.id)
    setNewName("")
    setCreating(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-ink-900">My Lists</h1>
          <p className="text-sm text-ink-500">Organise contacts by campaign or niche. Saved on this device.</p>
        </div>
        <Button onClick={() => setCreating((v) => !v)}><IconPlus size={16} /> New list</Button>
      </div>

      {creating && (
        <Card className="animate-fade-up p-3">
          <form onSubmit={submitNew} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="List name — e.g. “Summer skincare launch”"
              className="min-w-0 flex-1 rounded-xl border border-ink-200 bg-surface px-3 py-2 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
            <div className="flex gap-2">
              <Button type="submit">Create</Button>
              <Button type="button" variant="ghost" onClick={() => { setCreating(false); setNewName("") }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* List rail */}
        <div className="space-y-2">
          {lists.map((l) => (
            <button
              key={l.id}
              onClick={() => { setActiveId(l.id); setSelected(new Set()) }}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                activeId === l.id ? "border-brand-300 bg-brand-50/60 ring-1 ring-brand-200" : "border-ink-200 bg-surface hover:border-brand-200"
              }`}
            >
              <span className={`h-8 w-1.5 rounded-full ${DOT[l.color] || DOT.brand}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink-900">{l.name}</div>
                <div className="truncate text-xs text-ink-400">{l.contactIds.length} contacts · {l.updated}</div>
              </div>
              <IconChevron size={16} className={activeId === l.id ? "text-brand-500" : "text-ink-300"} />
            </button>
          ))}
          {lists.length === 0 && (
            <div className="rounded-2xl border border-dashed border-ink-300 p-6 text-center text-sm text-ink-400">
              No lists yet. Create one to start shortlisting.
            </div>
          )}
        </div>

        {/* Active list detail */}
        {list ? (
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${DOT[list.color] || DOT.brand}`} />
                  <h2 className="font-semibold text-ink-900">{list.name}</h2>
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{list.note || "No note yet — add one below."}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={exportList}>
                  <IconExport size={15} /> Export CSV
                </Button>
              </div>
            </div>

            {/* Bulk action bar */}
            {selected.size > 0 && (
              <div className="animate-fade-up flex items-center justify-between gap-3 border-b border-brand-100 bg-brand-50 px-4 py-2.5">
                <span className="text-sm font-medium text-brand-700">{selected.size} selected</span>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={exportSelected}>
                    <IconExport size={14} /> Export
                  </Button>
                  <Button variant="danger" size="sm" onClick={removeSelected}>
                    <IconTrash size={14} /> Remove
                  </Button>
                </div>
              </div>
            )}

            {/* header row */}
            <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => setSelected(allSelected ? new Set() : new Set(contacts.map((c) => c.id)))}
                className="h-4 w-4 accent-brand-600"
              />
              <span>Contact ({contacts.length})</span>
            </div>

            {/* rows */}
            <div className="divide-y divide-ink-100">
              {contacts.map((c) => (
                <div key={c.id} className="flex items-center gap-3 px-4 py-3 transition hover:bg-ink-50/60">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleSel(c.id)}
                    className="h-4 w-4 accent-brand-600"
                  />
                  <Avatar src={c.avatar} name={c.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <Link to={`/contact/${c.id}`} className="truncate text-sm font-semibold text-ink-900 hover:text-brand-700">{c.name}</Link>
                      {c.verified && <IconVerified size={13} className="text-brand-500" />}
                    </div>
                    <div className="truncate text-xs text-ink-400">{c.handle} · {c.city}</div>
                  </div>
                  <div className="hidden sm:block">
                    <Badge tone="slate">{c.niches[0]}</Badge>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-sm font-semibold text-ink-900">{formatFollowers(c.followers)}</div>
                    <div className="text-xs text-ink-400">followers</div>
                  </div>
                  <button
                    onClick={() => { removeFromList(list.id, c.id); notify(`Removed ${c.name}`, "slate") }}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-ink-200 text-ink-400 transition hover:border-rose-200 hover:text-rose-500"
                    title="Remove from list"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm text-ink-500">This list is empty.</p>
                  <Link to="/discover"><Button variant="secondary" size="sm" className="mt-3">Find contacts to add</Button></Link>
                </div>
              )}
            </div>

            {/* per-list note input */}
            <div className="border-t border-ink-100 bg-ink-50/50 p-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-ink-400">Campaign note</label>
              <textarea
                value={list.note}
                onChange={(e) => updateListNote(list.id, e.target.value)}
                placeholder="Add a note for this list — pitch angle, deadline, budget…"
                rows={2}
                className="mt-2 w-full resize-none rounded-xl border border-ink-200 bg-surface p-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </Card>
        ) : (
          <Card className="grid place-items-center py-16 text-center text-sm text-ink-500">
            Select or create a list to get started.
          </Card>
        )}
      </div>
    </div>
  )
}
