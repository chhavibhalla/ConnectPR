import { Link } from "react-router-dom"
import { useStore } from "../store.jsx"
import { Avatar, Badge, Button, PlatformPill, EngagementDot } from "./ui.jsx"
import { IconBookmark, IconBookmarkFill, IconVerified, IconChevron } from "./icons.jsx"
import { formatFollowers } from "../data/mock.js"

export function ContactCard({ contact, delay = 0 }) {
  const { isSaved, toggleSave } = useStore()
  const saved = isSaved(contact.id)
  return (
    <div
      className="animate-fade-up group relative flex flex-col rounded-2xl border border-ink-200/80 bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        onClick={() => toggleSave(contact)}
        aria-label={saved ? "Remove from saved" : "Save contact"}
        className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-xl border transition-all ${
          saved
            ? "border-brand-200 bg-brand-50 text-brand-600"
            : "border-ink-200 bg-surface text-ink-400 hover:border-brand-200 hover:text-brand-500"
        }`}
      >
        {saved ? <IconBookmarkFill size={17} className="animate-pop" /> : <IconBookmark size={17} />}
      </button>

      <div className="flex items-start gap-3 pr-10">
        <Avatar src={contact.avatar} name={contact.name} size={52} />
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="truncate font-semibold text-ink-900">{contact.name}</h3>
            {contact.verified && <IconVerified size={15} className="shrink-0 text-brand-500" />}
          </div>
          <p className="truncate text-sm text-ink-400">{contact.handle}</p>
          <div className="mt-1.5">
            <PlatformPill platform={contact.platform} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {contact.niches.map((n) => (
          <Badge key={n} tone="brand">{n}</Badge>
        ))}
        <Badge tone="slate">{contact.city}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-ink-50 p-3">
        <div>
          <div className="text-xs text-ink-400">Followers</div>
          <div className="text-sm font-bold text-ink-900">
            {contact.type === "Journalist" ? contact.outlet : formatFollowers(contact.followers)}
          </div>
        </div>
        <div>
          <div className="text-xs text-ink-400">Engagement</div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
            {contact.type === "Journalist" ? "Editorial" : (
              <><EngagementDot value={contact.engagement} />{contact.engagement}%</>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => toggleSave(contact)} className="flex-1">
          {saved ? "Saved" : "Save"}
        </Button>
        <Link to={`/contact/${contact.id}`} className="flex-1">
          <Button size="sm" className="w-full">
            View profile <IconChevron size={14} />
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function ContactRow({ contact }) {
  const { isSaved, toggleSave } = useStore()
  const saved = isSaved(contact.id)
  return (
    <tr className="group border-b border-ink-100 transition-colors last:border-0 hover:bg-brand-50/40">
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <Avatar src={contact.avatar} name={contact.name} size={38} />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <Link to={`/contact/${contact.id}`} className="truncate font-semibold text-ink-900 hover:text-brand-700">
                {contact.name}
              </Link>
              {contact.verified && <IconVerified size={13} className="shrink-0 text-brand-500" />}
            </div>
            <div className="truncate text-xs text-ink-400">{contact.handle}</div>
          </div>
        </div>
      </td>
      <td className="px-3"><PlatformPill platform={contact.platform} /></td>
      <td className="px-3">
        <div className="flex flex-wrap gap-1">
          {contact.niches.slice(0, 2).map((n) => <Badge key={n} tone="brand">{n}</Badge>)}
        </div>
      </td>
      <td className="px-3 text-sm text-ink-600">{contact.city}</td>
      <td className="px-3 text-sm font-semibold text-ink-900">
        {contact.type === "Journalist" ? "—" : formatFollowers(contact.followers)}
      </td>
      <td className="px-3">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-900">
          {contact.type === "Journalist" ? "Editorial" : (<><EngagementDot value={contact.engagement} />{contact.engagement}%</>)}
        </span>
      </td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => toggleSave(contact)}
            className={`grid h-8 w-8 place-items-center rounded-lg border transition ${
              saved ? "border-brand-200 bg-brand-50 text-brand-600" : "border-ink-200 text-ink-400 hover:text-brand-500"
            }`}
            aria-label="Save"
          >
            {saved ? <IconBookmarkFill size={15} /> : <IconBookmark size={15} />}
          </button>
          <Link to={`/contact/${contact.id}`}>
            <Button variant="secondary" size="sm">View</Button>
          </Link>
        </div>
      </td>
    </tr>
  )
}
