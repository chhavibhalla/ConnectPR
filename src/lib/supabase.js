// Supabase client — created only when env keys are present.
// If keys are missing, the app runs in "local guest mode" (localStorage),
// so a fresh clone still works without any backend setup.
import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// A real project URL looks like https://xxxx.supabase.co and the anon key
// is a long JWT. Treat obvious placeholders as "not configured".
export const isSupabaseConfigured = Boolean(
  url &&
  anonKey &&
  url.startsWith("http") &&
  !url.includes("your-project") &&
  anonKey.length > 30
)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // Helpful one-time hint in the console during local dev.
  console.info(
    "%c[connectPR] Running in local mode (no Supabase keys). " +
      "Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to .env to enable login & cloud sync. See SETUP_SUPABASE.md",
    "color:#8b5cf6"
  )
}
