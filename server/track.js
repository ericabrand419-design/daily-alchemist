// Records what kind of thing happened and when, only for people sharing this week.
// The app never sends what anyone wrote, or which guardian Aura chose from their words;
// this also drops any field that isn't on the list.
import { json, sb, getUser, getProfile } from "../api/_lib.js";

// Which box on the sharing checklist each kind of tap belongs to. Only ticked boxes are recorded.
const CAT = { open: "time", session: "time", tab: "pages", settings_open: "pages", how_open: "pages", cant_think: "pages", share: "pages", feedback: "pages",
  ritual_start: "rituals", ritual_step: "rituals", ritual_exit: "rituals", ritual: "rituals", reading: "readings", draw_pick: "readings",
  chat_open: "chats", chat_send: "chats", letter_open: "letters", nudge_reply: "letters", nudge_later: "letters", hear: "sound", music: "sound", paywall: "membership", checkout: "membership" };

const EVENTS = new Set(["open", "session", "tab", "reading", "draw_pick", "ritual_start", "ritual_step", "ritual_exit", "ritual",
  "chat_open", "chat_send", "letter_open", "nudge_reply", "nudge_later", "paywall", "checkout", "feedback", "settings_open", "how_open", "cant_think", "hear", "music", "share"]);
const META = ["g", "tab", "step", "of", "wrote", "feelings", "typed", "sec", "day", "stage", "plat", "reason", "id", "mood", "set"];

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  const p = await getProfile(user.id);
  if (!p || !p.monitor_until || new Date(p.monitor_until) <= new Date()) return json({ ok: true, recorded: 0 });
  let body = {}; try { body = await request.json(); } catch {}
  const now = Date.now();
  const rows = (Array.isArray(body.events) ? body.events : []).slice(0, 60).filter((e) => e && EVENTS.has(e.ev) && (!Array.isArray(p.monitor_scope) || p.monitor_scope.includes(CAT[e.ev] || "pages"))).map((e) => {
    const meta = {};
    for (const k of META) if (e.meta && e.meta[k] != null) meta[k] = typeof e.meta[k] === "string" ? e.meta[k].slice(0, 40) : e.meta[k];
    const t = Number(e.t) > now - 864e5 && Number(e.t) <= now + 6e4 ? Number(e.t) : now;
    return { user_id: user.id, ev: e.ev, meta, created_at: new Date(t).toISOString() };
  });
  if (rows.length) await sb("events", { method: "POST", body: rows });
  return json({ ok: true, recorded: rows.length });
}

export { preflight as OPTIONS } from "../api/_lib.js";
