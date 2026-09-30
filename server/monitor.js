// The opt-in week: if she says yes, the app records what she taps and when (never what she
// writes or says) for 7 days. She can stop any time; it also ends by itself.
import { json, sb, getUser, getProfile, ensureTrial, notifyAdmin } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const p0 = await getProfile(user.id);
  await ensureTrial(user, p0);
  const now = new Date();
  const patch = body.consent
    ? { monitor_answer: "yes", monitor_started: now.toISOString(), monitor_until: new Date(now.getTime() + 7 * 864e5).toISOString() }
    : { monitor_answer: p0 && p0.monitor_answer === "yes" ? "stopped" : "no", monitor_until: now.toISOString() };
  await sb("profiles?id=eq." + user.id, { method: "PATCH", body: patch });
  if (body.consent) await notifyAdmin("Sharing is on", (user.email || "A friend") + " said yes to sharing taps for a week.");
  return json({ ok: true, monitor_answer: patch.monitor_answer, monitor_until: patch.monitor_until });
}

export { preflight as OPTIONS } from "../api/_lib.js";
