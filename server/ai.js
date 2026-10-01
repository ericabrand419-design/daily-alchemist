// Guardian and Aura replies through Anthropic's Messages API, with daily limits.
import { json, env, getUser, getProfile, isMember, isPaid, isAdult, adultRequired, ensureTrial, getUsage, bumpUsage, LIMITS, isAdminEmail } from "../api/_lib.js";

const SAFE_BASE = "Content rules for every reply: never sexual content involving anyone under 18, and never anything non-consensual, coercive or illegal. If sex or sexual technique comes up, keep it warm and non-explicit, and suggest Vesper, the guardian for desire and intimacy, for members 21 and older.";
const VESPER = "You are speaking as Vesper, for a verified adult member who is 21 or older. You may talk frankly and warmly about desire, pleasure, sex, intimacy and sex magic, as an educated, sex positive guide, and teach body exercises like pelvic floor work, hip mobility, breathwork and sensate focus. Do not give instruction on sexual positions and never write graphic sexual description. Always center enthusiastic consent, communication, comfort and safer sex. Solo and partnered, every orientation and body. Never sexual content involving anyone under 18, never non-consensual, coercive, incest or illegal scenarios. If she describes pain, pressure or harm, drop the topic and care for her.";
const VESPER_STORE = "You are speaking as Vesper, for a verified adult member who is 21 or older, inside an app store version of the app. Talk about desire, confidence, intimacy, communication and connection, warmly and honestly, but keep it non-explicit: no detailed sexual technique. Body exercises like pelvic floor work, hip mobility and breathwork are fine. Never sexual content involving anyone under 18, never anything non-consensual.";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body; try { body = await request.json(); } catch { return json({ error: "bad_request" }, 400); }
  const kind = ["read", "talk", "memory"].includes(body.kind) ? body.kind : "talk";
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "bad_request" }, 400);
  const clean = messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 24000) }));

  const [p0, usage] = await Promise.all([getProfile(user.id), getUsage(user.id)]);
  const profile = await ensureTrial(user, p0);
  if (!isAdult(profile)) return adultRequired();
  const vesper = String(body.g || "") === "vesper";
  if (vesper && !(profile.adult21_at && (isPaid(profile) || isAdminEmail(user.email)))) return json({ error: "vesper_locked" }, 403);
  const system = vesper ? (body.native ? VESPER_STORE : VESPER) : SAFE_BASE;
  const tier = isMember(profile) ? "member" : "free";
  if ((usage[kind] || 0) >= LIMITS[tier][kind]) return json({ error: "limit", tier }, 429);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: env("ANTHROPIC_MODEL") || "claude-haiku-4-5-20251001",
      max_tokens: kind === "talk" ? 500 : 1400,
      system,
      messages: clean,
    }),
  });
  if (!res.ok) return json({ error: "ai_unavailable" }, 502);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  await bumpUsage(user.id, kind);
  return json({ text });
}

export { preflight as OPTIONS } from "../api/_lib.js";
