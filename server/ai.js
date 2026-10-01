// Guardian and Aura replies, with daily limits. The model provider is chosen in server/ai-provider.js.
import { complete, compare } from "./ai-provider.js";
import { json, env, getUser, getProfile, isMember, isPaid, isAdult, adultRequired, ensureTrial, getUsage, bumpUsage, LIMITS, isAdminEmail } from "../api/_lib.js";

// The hard rule governs every reply, whichever guardian is speaking.
const HARD_RULE = "Rhythm is responsive, not scheduled. The Daily Alchemist knows what part of the day it is, but it never lets the clock, moon, season or cycle override the person's actual life. Unresolved events, emotional state, promises, body context and recent conversations take priority. The rhythm adapts around the person rather than asking the person to adapt to it. Cycle context may explain volume, never the problem: never tell her she feels something because of her period. No medical claims, no diagnosis, and never tell her to eat, drink or take herbs.";
const SAFE_BASE = HARD_RULE + " " + "Content rules for every reply: never sexual content involving anyone under 18, and never anything non-consensual, coercive or illegal. If sex or sexual technique comes up, keep it warm and non-explicit, and suggest Vesper, the guardian for desire and intimacy, for members 21 and older.";
const VESPER = "You are speaking as Vesper, for a verified adult member who is 21 or older. You may talk frankly and warmly about desire, pleasure, sex, intimacy and sex magic, as an educated, sex positive guide, and teach body exercises like pelvic floor work, hip mobility, breathwork and sensate focus. Do not give instruction on sexual positions and never write graphic sexual description. Always center enthusiastic consent, communication, comfort and safer sex. Solo and partnered, every orientation and body. Never sexual content involving anyone under 18, never non-consensual, coercive, incest or illegal scenarios. If she describes pain, pressure or harm, drop the topic and care for her.";
const VESPER_STORE = "You are speaking as Vesper, for a verified adult member who is 21 or older, inside an app store version of the app. Talk about desire, confidence, intimacy, communication and connection, warmly and honestly, but keep it non-explicit: no detailed sexual technique. Body exercises like pelvic floor work, hip mobility and breathwork are fine. Never sexual content involving anyone under 18, never anything non-consensual.";

// Long prompts keep their beginning and their end, so what she just said and the answer rules are never cut off.
function keepEnds(t, max) { return t.length <= max ? t : t.slice(0, max - 12000) + "\n...\n" + t.slice(-12000); }

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body; try { body = await request.json(); } catch { return json({ error: "bad_request" }, 400); }
  const kind = ["read", "talk", "memory"].includes(body.kind) ? body.kind : "talk";
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "bad_request" }, 400);
  const clean = messages.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: keepEnds(String(m.content || ""), 60000) }));

  const [p0, usage] = await Promise.all([getProfile(user.id), getUsage(user.id)]);
  const profile = await ensureTrial(user, p0);
  const owner = isAdminEmail(user.email);
  if (!isAdult(profile) && !owner) return adultRequired();
  const vesper = String(body.g || "") === "vesper";
  if (vesper && !(profile.adult21_at && (isPaid(profile) || isAdminEmail(user.email)))) return json({ error: "vesper_locked" }, 403);
  const system = vesper ? HARD_RULE + " " + (body.native ? VESPER_STORE : VESPER) : SAFE_BASE;
  // Deep (letters, yearbook) is for members and the owner; everything else uses the fast tier.
  const tier = body.tier === "deep" && (isMember(profile) || owner) ? "deep" : "fast";
  const maxTokens = kind === "talk" ? 500 : tier === "deep" ? 2000 : 1400;
  // Owner only: run the same scenario through Claude and OpenAI and return both, untouched by limits.
  if (body.compare && owner) return json(await compare({ system, messages: clean, maxTokens, tier }));
  const plan = isMember(profile) ? "member" : "free";
  if (!owner && (usage[kind] || 0) >= LIMITS[plan][kind]) return json({ error: "limit", tier: plan }, 429);

  let out;
  try { out = await complete({ system, messages: clean, maxTokens, tier }); }
  catch { return json({ error: "ai_unavailable" }, 502); }
  const text = out.text;
  await bumpUsage(user.id, kind);
  return json({ text });
}

export { preflight as OPTIONS } from "../api/_lib.js";
