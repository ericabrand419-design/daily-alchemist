// One door to any model provider, so the app is never tied to one company.
//
//   AI_PROVIDER     anthropic (default) or openai
//   AI_FAST_MODEL   routing, guardian chat, memory, short Daily Alchemy wording, simple Iris lines
//   AI_DEEP_MODEL   weekly letters, the yearbook, long synthesis
//   ANTHROPIC_API_KEY / OPENAI_API_KEY
//
// Nothing switches by itself: with no settings it behaves exactly as before (Anthropic, Haiku).
// compare() runs the same prompt through both providers so they can be judged side by side
// on continuity, guardian choice, tone, JSON reliability, cost and speed.
import { env } from "../api/_lib.js";

const DEFAULTS = {
  anthropic: { fast: "claude-haiku-4-5-20251001", deep: "claude-sonnet-5-5" },
  openai: { fast: "gpt-4o-mini", deep: "gpt-4o" },
};

export function providerName(override) {
  const p = String(override || env("AI_PROVIDER") || "anthropic").toLowerCase();
  return p === "openai" ? "openai" : "anthropic";
}
export function modelFor(provider, tier) {
  const deep = tier === "deep";
  const set = env(deep ? "AI_DEEP_MODEL" : "AI_FAST_MODEL");
  // A model named in Vercel belongs to the active provider; when comparing, the other one uses its defaults.
  if (set && provider === providerName()) return set;
  if (provider === "anthropic" && !deep && env("ANTHROPIC_MODEL")) return env("ANTHROPIC_MODEL");
  return DEFAULTS[provider][deep ? "deep" : "fast"];
}

async function anthropic({ system, messages, maxTokens, model }) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });
  if (!res.ok) throw Object.assign(new Error("ai_unavailable"), { status: res.status });
  const d = await res.json();
  return {
    text: (d.content || []).filter((c) => c.type === "text").map((c) => c.text).join(""),
    usage: { input: d.usage?.input_tokens || 0, output: d.usage?.output_tokens || 0 },
  };
}
async function openai({ system, messages, maxTokens, model }) {
  if (!env("OPENAI_API_KEY")) throw Object.assign(new Error("ai_unavailable"), { status: 503 });
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { authorization: "Bearer " + env("OPENAI_API_KEY"), "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "system", content: system }, ...messages] }),
  });
  if (!res.ok) throw Object.assign(new Error("ai_unavailable"), { status: res.status });
  const d = await res.json();
  return {
    text: d.choices?.[0]?.message?.content || "",
    usage: { input: d.usage?.prompt_tokens || 0, output: d.usage?.completion_tokens || 0 },
  };
}

export async function complete({ system, messages, maxTokens = 800, tier = "fast", provider }) {
  const p = providerName(provider), model = modelFor(p, tier), t0 = Date.now();
  const out = await (p === "openai" ? openai : anthropic)({ system, messages, maxTokens, model });
  return { ...out, provider: p, model, ms: Date.now() - t0 };
}

// Same scenario through both providers, for the owner only (see server/ai.js).
export async function compare(args) {
  const run = async (provider) => {
    try {
      const r = await complete({ ...args, provider });
      let json = null; try { const m = r.text.match(/\{[\s\S]*\}/); json = m ? JSON.parse(m[0]) : null; } catch {}
      return { ...r, jsonOk: !!json };
    } catch (e) { return { provider, error: e.message, status: e.status || 0 }; }
  };
  const [a, o] = await Promise.all([run("anthropic"), run("openai")]);
  return { anthropic: a, openai: o };
}
