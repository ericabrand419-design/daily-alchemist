// Friends Week sharing. Each person ticks what they're comfortable sharing (only what they tap and
// when, never what they write or say) for 7 days from the first time they say yes. They can change
// it or turn it all off any time in that week; ticking nothing means nothing is recorded.
import { json, sb, getUser, getProfile, ensureTrial, notifyAdmin } from "../api/_lib.js";

export const SCOPES = ["time", "pages", "rituals", "readings", "chats", "letters", "sound", "membership"];
const who = (u) => u.email || (u.phone ? "+" + String(u.phone).replace(/^\+/, "") : "") || "A friend";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const p0 = await getProfile(user.id);
  await ensureTrial(user, p0);
  const now = new Date();
  const scope = Array.isArray(body.scope) ? [...new Set(body.scope.filter((s) => SCOPES.includes(s)))] : SCOPES;
  let patch;
  if (body.consent && scope.length) {
    // The week starts the first time they say yes and never gets longer.
    const started = p0 && p0.monitor_started ? new Date(p0.monitor_started) : now;
    const until = new Date(started.getTime() + 7 * 864e5);
    if (until <= now) return json({ ok: true, monitor_answer: p0.monitor_answer || "stopped", monitor_until: p0.monitor_until, monitor_scope: [], ended: true });
    patch = { monitor_answer: "yes", monitor_started: started.toISOString(), monitor_until: until.toISOString(), monitor_scope: scope };
  } else {
    patch = { monitor_answer: p0 && (p0.monitor_answer === "yes" || p0.monitor_answer === "stopped") ? "stopped" : "no", monitor_until: now.toISOString(), monitor_scope: [] };
  }
  await sb("profiles?id=eq." + user.id, { method: "PATCH", body: patch });
  const first = !(p0 && p0.monitor_answer);
  if (patch.monitor_answer === "yes" && first) await notifyAdmin("Sharing is on", who(user) + " chose to share some taps for a week.");
  return json({ ok: true, monitor_answer: patch.monitor_answer, monitor_until: patch.monitor_until, monitor_scope: patch.monitor_scope });
}

export { preflight as OPTIONS } from "../api/_lib.js";
