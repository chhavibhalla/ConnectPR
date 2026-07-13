import { useParams, Link, useNavigate } from "react-router-dom"
import { useStore } from "../store.jsx"
import { Card, Badge, Button, Avatar, Stat, PlatformPill } from "../components/ui.jsx"
import {
  IconBookmark, IconBookmarkFill, IconExport, IconMail, IconVerified,
  IconChevron, IconCheck, IconChart, IconSpark,
} from "../components/icons.jsx"
import { CONTACTS, formatFollowers } from "../data/mock.js"
import { downloadContactsCsv } from "../lib/csv.js"

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSaved, toggleSave, notify, lists, addToList } = useStore()
  const contact = CONTACTS.find((c) => c.id === id)

  if (!contact) {
    return (
      <Card className="p-10 text-center">
        <p className="text-ink-600">Contact not found.</p>
        <Link to="/discover"><Button className="mt-4">Back to Discover</Button></Link>
      </Card>
    )
  }

  const saved = isSaved(contact.id)
  const isJournalist = contact.type === "Journalist"

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800">
        <IconChevron size={15} className="rotate-180" /> Back
      </button>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700" />
            <div className="px-5 pb-5">
              <div className="-mt-10 flex items-end justify-between">
                <Avatar src={contact.avatar} name={contact.name} size={84} />
                <div className="mb-1 flex gap-2">
                  <Button
                    variant={saved ? "subtle" : "secondary"}
                    size="md"
                    onClick={() => toggleSave(contact)}
                  >
                    {saved ? <IconBookmarkFill size={16} /> : <IconBookmark size={16} />}
                    {saved ? "Saved" : "Add to list"}
                  </Button>
                  <Button variant="primary" size="md" onClick={() => { downloadContactsCsv([contact], contact.name); notify("Exported to CSV") }}>
                    <IconExport size={16} /> Export
                  </Button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5">
                <h1 className="text-xl font-extrabold tracking-tight text-ink-900">{contact.name}</h1>
                {contact.verified && <IconVerified size={18} className="text-brand-500" />}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-ink-500">
                <span>{contact.handle}</span>
                <span className="text-ink-300">·</span>
                <span>{contact.city}</span>
                <span className="text-ink-300">·</span>
                <Badge tone={isJournalist ? "sky" : "brand"}>{contact.type}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <PlatformPill platform={contact.platform} />
                {contact.niches.map((n) => <Badge key={n} tone="brand">{n}</Badge>)}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-600">{contact.bio}</p>

              <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl bg-ink-50 p-4">
                <Stat
                  label={isJournalist ? "Outlet" : "Followers"}
                  value={isJournalist ? contact.outlet : formatFollowers(contact.followers)}
                  tone="brand"
                />
                <Stat
                  label={isJournalist ? "Type" : "Engagement"}
                  value={isJournalist ? "Editorial" : `${contact.engagement}%`}
                  tone="emerald"
                />
                <Stat label="Est. rate" value={contact.price.split(" ")[0]} sub={contact.price.split(" ").slice(1).join(" ")} />
              </div>
            </div>
          </Card>

          {/* Past collaborations */}
          <Card className="p-5">
            <h2 className="mb-3 font-semibold text-ink-900">
              {isJournalist ? "Publications & beats" : "Past brand collaborations"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {contact.collabs.map((b) => (
                <span key={b} className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-surface px-3 py-2 text-sm font-medium text-ink-700">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-50 text-xs font-bold text-brand-600">
                    {b[0]}
                  </span>
                  {b}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Contact info */}
          <Card className="p-5">
            <h2 className="mb-3 font-semibold text-ink-900">Contact</h2>
            <div className="space-y-2.5">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 rounded-xl border border-ink-200 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600"><IconMail size={17} /></span>
                <div className="min-w-0">
                  <div className="text-xs text-ink-400">Email</div>
                  <div className="truncate text-sm font-medium text-ink-800">{contact.email}</div>
                </div>
              </a>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs font-medium text-ink-400">Speaks:</span>
                {contact.languages.map((l) => <Badge key={l} tone="slate">{l}</Badge>)}
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => notify("Pitch template copied ✍️")}>
              <IconSpark size={16} /> Draft a pitch
            </Button>
          </Card>

          {/* Add to list */}
          <Card className="p-5">
            <h2 className="mb-3 font-semibold text-ink-900">Add to a list</h2>
            <div className="space-y-2">
              {lists.map((l) => {
                const inList = l.contactIds.includes(contact.id)
                return (
                  <button
                    key={l.id}
                    onClick={() => addToList(l.id, contact)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      inList ? "border-brand-200 bg-brand-50/50" : "border-ink-200 hover:border-brand-200 hover:bg-brand-50/40"
                    }`}
                  >
                    <IconBookmark size={16} className={inList ? "text-brand-500" : "text-ink-400"} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink-800">{l.name}</div>
                      <div className="text-xs text-ink-400">{l.contactIds.length} contacts</div>
                    </div>
                    {inList
                      ? <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-600"><IconCheck size={13} /></span>
                      : <IconCheck size={15} className="text-ink-300" />}
                  </button>
                )
              })}
              {lists.length === 0 && <p className="text-sm text-ink-400">No lists yet — create one on the Lists page.</p>}
            </div>
          </Card>

          {/* Fit score */}
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <IconChart size={17} className="text-brand-600" />
              <h2 className="font-semibold text-ink-900">Brand-fit score</h2>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-brand-700">{isJournalist ? 78 : Math.min(99, Math.round(contact.engagement * 12 + 30))}</span>
              <span className="mb-1 text-sm text-ink-400">/ 100</span>
            </div>
            <p className="mt-1 text-xs text-ink-500">Based on niche match, engagement quality &amp; audience geography.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
