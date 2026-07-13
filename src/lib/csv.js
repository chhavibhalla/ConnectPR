// CSV export — turns a contacts array into a downloadable .csv file.
// Includes a UTF-8 BOM so Excel renders ₹ and Hindi/Devanagari correctly.
import { formatFollowers } from "../data/mock.js"

const COLUMNS = [
  { header: "Name", get: (c) => c.name },
  { header: "Handle", get: (c) => c.handle },
  { header: "Type", get: (c) => c.type },
  { header: "Platform", get: (c) => c.platform },
  { header: "City", get: (c) => c.city },
  { header: "Niches", get: (c) => (c.niches || []).join(" / ") },
  { header: "Followers", get: (c) => (c.type === "Journalist" ? "" : c.followers) },
  { header: "Followers (short)", get: (c) => (c.type === "Journalist" ? "" : formatFollowers(c.followers)) },
  { header: "Engagement %", get: (c) => (c.type === "Journalist" ? "" : c.engagement) },
  { header: "Email", get: (c) => c.email },
  { header: "Est. rate", get: (c) => c.price },
  { header: "Outlet", get: (c) => c.outlet || "" },
  { header: "Languages", get: (c) => (c.languages || []).join(" / ") },
  { header: "Past collaborations", get: (c) => (c.collabs || []).join(" / ") },
]

// RFC-4180 style escaping: wrap in quotes if the value contains a comma,
// quote or newline, and double any embedded quotes.
function escapeCell(value) {
  const s = value == null ? "" : String(value)
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function contactsToCsv(contacts) {
  const head = COLUMNS.map((c) => escapeCell(c.header)).join(",")
  const rows = contacts.map((c) => COLUMNS.map((col) => escapeCell(col.get(c))).join(","))
  return [head, ...rows].join("\r\n")
}

// Build a filesystem-safe filename like: connectpr-diwali-d2c-launch-2026-07-13.csv
function safeName(base) {
  const date = new Date().toISOString().slice(0, 10)
  const slug = (base || "contacts")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  return `connectpr-${slug || "contacts"}-${date}.csv`
}

export function downloadContactsCsv(contacts, baseName = "contacts") {
  if (!contacts || contacts.length === 0) return 0
  const csv = "﻿" + contactsToCsv(contacts) // BOM for Excel
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = safeName(baseName)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // revoke on next tick so the download has started
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return contacts.length
}
