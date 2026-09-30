// Guardian and Aura replies through Anthropic's Messages API, with daily limits.
import { json, env, getUser, getProfile, isMember, isAdult, adultRequired, ensureTrial, getUsage, bumpUsage, LIMITS } from "./_lib.js";

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
  const tier = isMember(profile) ? "member" : "free";
  if ((usage[kind] || 0) >= LIMITS[tier][kind]) return json({ error: "limit", tier }, 429);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: env("ANTHROPIC_MODEL") || "claude-haiku-4-5-20251001",
      max_tokens: kind === "talk" ? 500 : 1400,
      messages: clean,
    }),
  });
  if (!res.ok) return json({ error: "ai_unavailable" }, 502);
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  await bumpUsage(user.id, kind);
  return json({ text });
}

export { preflight as OPTIONS } from "./_lib.js";
