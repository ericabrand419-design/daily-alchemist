// Shared helpers for The Daily Alchemist API (Vercel Functions, no dependencies).
import crypto from "node:crypto";

export const env = (k) => process.env[k] || "";
export const LIMITS = { free: { read: 3, talk: 10, memory: 15, voice: 4000 }, member: { read: 40, talk: 150, memory: 60, voice: 25000 } }; // voice = characters spoken per day

// The App Store and Google Play apps call this API from their own origin, so allow cross-origin
// requests. Sign-in uses a bearer token (no cookies), so this is safe.
export const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, content-type", "access-control-allow-methods": "POST, OPTIONS" };
export function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...CORS } });
}
export function preflight() { return new Response(null, { status: 204, headers: CORS }); }

// Supabase REST with the service role key (server only).
export async function sb(path, { method = "GET", body, prefer } = {}) {
  const res = await fetch(env("SUPABASE_URL") + "/rest/v1/" + path, {
    method,
    headers: {
      apikey: env("SUPABASE_SERVICE_ROLE_KEY"),
      authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY"),
      "content-type": "application/json",
      ...(prefer ? { prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error("supabase " + res.status + " " + text);
  return data;
}

// Verify the signed-in user from their Supabase access token.
export async function getUser(request) {
  const auth = request.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const res = await fetch(env("SUPABASE_URL") + "/auth/v1/user", {
    headers: { apikey: env("SUPABASE_ANON_KEY"), authorization: auth },
  });
  if (!res.ok) return null;
  const u = await res.json();
  return u && u.id ? u : null;
}

// Adults only: protected actions need the server-side 18+ record (set by /api/me confirmAdult).
export function isAdult(profile) { return !!(profile && profile.adult_confirmed_at); }
export function adultRequired() { return json({ error: "adult_confirmation_required" }, 403); }

export async function getProfile(userId) {
  const rows = await sb("profiles?id=eq." + userId + "&select=*");
  return rows && rows[0] ? rows[0] : null;
}

// Paid members, plus everyone in their first 7 days (the free trial).
export function isPaid(profile) {
  return !!(profile && (profile.lifetime || (profile.member_until && new Date(profile.member_until) > new Date())));
}
// You (and anyone else you list in ADMIN_EMAIL, separated by commas).
export function isAdminEmail(email) {
  return !!email && env("ADMIN_EMAIL").toLowerCase().split(",").map((x) => x.trim()).filter(Boolean).includes(String(email).toLowerCase());
}
// Tell you when something happens: a phone notification (turn on "Let Aura reach me" in the app,
// signed in as you), and an email too if RESEND_API_KEY is set.
export async function notifyAdmin(title, body) {
  try {
    const admins = (await sb("profiles?is_admin=eq.true&select=id")) || [];
    if (admins.length && env("VAPID_PRIVATE_KEY")) {
      const webpush = (await import("web-push")).default;
      webpush.setVapidDetails("mailto:" + (env("SUPPORT_EMAIL") || "hello@dailyalchemist.com"), env("VAPID_PUBLIC_KEY"), env("VAPID_PRIVATE_KEY"));
      const subs = (await sb("push_subs?user_id=in.(" + admins.map((a) => a.id).join(",") + ")&select=sub")) || [];
      for (const s of subs) { try { await webpush.sendNotification(s.sub, JSON.stringify({ title, body, url: "/admin" })); } catch {} }
    }
    if (env("RESEND_API_KEY") && env("ADMIN_EMAIL")) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: "Bearer " + env("RESEND_API_KEY"), "content-type": "application/json" },
        body: JSON.stringify({ from: env("NOTIFY_FROM") || "The Daily Alchemist <onboarding@resend.dev>", to: env("ADMIN_EMAIL").split(",").map((x) => x.trim()), subject: title, text: body + "\n\n" + (env("SITE_URL") || "") + "/admin" }),
      });
    }
  } catch {}
}
export function isMember(profile) {
  return isPaid(profile) || !!(profile && profile.is_admin) || !!(profile && profile.trial_until && new Date(profile.trial_until) > new Date());
}
export const TRIAL_DAYS = 7;
export const GRACE_DAYS = 30; // after the trial, Aura keeps writing, sealed, for this long
// Give every new account a 7-day trial, counted from when the account was created. Never resets.
export async function ensureTrial(user, profile) {
  if (!profile) await notifyAdmin("New sign-up", ((user.email || (user.phone ? "+" + String(user.phone).replace(/^\+/, "") : "")) || "Someone") + " just joined The Daily Alchemist.");
  if (profile && profile.trial_until) return profile;
  const start = user.created_at ? new Date(user.created_at).getTime() : Date.now();
  const trial_until = new Date(start + TRIAL_DAYS * 864e5).toISOString();
  await sb("profiles?on_conflict=id", { method: "POST", prefer: "resolution=merge-duplicates", body: [{ id: user.id, trial_until }] });
  return { ...(profile || { id: user.id }), trial_until };
}

export function today() { return new Date().toISOString().slice(0, 10); }

export async function getUsage(userId) {
  const rows = await sb("usage?user_id=eq." + userId + "&day=eq." + today() + "&select=read,talk,memory,voice");
  return rows && rows[0] ? rows[0] : { read: 0, talk: 0, memory: 0, voice: 0 };
}

export async function bumpUsage(userId, kind, amount = 1) {
  const u = await getUsage(userId);
  const next = { user_id: userId, day: today(), read: u.read || 0, talk: u.talk || 0, memory: u.memory || 0, voice: u.voice || 0 };
  next[kind] = (next[kind] || 0) + amount;
  await sb("usage?on_conflict=user_id,day", { method: "POST", body: next, prefer: "resolution=merge-duplicates" });
  return next;
}

// Stripe REST (form-encoded) without the SDK.
export async function stripe(path, params = {}, method = "POST") {
  const body = new URLSearchParams();
  const add = (k, v) => {
    if (v === undefined || v === null) return;
    if (typeof v === "object") for (const [kk, vv] of Object.entries(v)) add(k + "[" + kk + "]", vv);
    else body.append(k, String(v));
  };
  for (const [k, v] of Object.entries(params)) add(k, v);
  const res = await fetch("https://api.stripe.com/v1/" + path + (method === "GET" && [...body].length ? "?" + body : ""), {
    method,
    headers: { authorization: "Bearer " + env("STRIPE_SECRET_KEY"), "content-type": "application/x-www-form-urlencoded" },
    body: method === "GET" ? undefined : body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error("stripe " + res.status + " " + JSON.stringify(data.error || data));
  return data;
}

export function verifyStripeSignature(raw, header, secret) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=")));
  const t = parts.t, v1 = parts.v1;
  if (!t || !v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(t)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(t + "." + raw).digest("hex");
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1)); } catch { return false; }
}

export function siteUrl(request) {
  return env("SITE_URL") || new URL(request.url).origin;
}
