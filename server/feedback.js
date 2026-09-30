// Notes people choose to send you (the optional note after a visit during their first week, and
// the feedback form in Settings). Saved for your dashboard, and you're told when one arrives.
import { json, sb, getUser, notifyAdmin } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const text = String(body.text || "").trim().slice(0, 4000);
  const mood = String(body.mood || "").slice(0, 40);
  if (!text && !mood) return json({ error: "empty" }, 400);
  const email = user.email || (user.phone ? "+" + String(user.phone).replace(/^\+/, "") : null);
  await sb("feedback", { method: "POST", body: { user_id: user.id, email, text, mood, screen: String(body.screen || "").slice(0, 40), day: Number.isFinite(+body.day) ? +body.day : null } });
  const name = String(body.name || "").slice(0, 40) || email || "Someone";
  await notifyAdmin("New note from " + name, (mood ? mood + ". " : "") + (text ? text.slice(0, 160) : ""));
  return json({ ok: true });
}

export { preflight as OPTIONS } from "../api/_lib.js";
