// Invitations. Two kinds, both at dailyalchemist.com/?friend=<code>:
// - a personal invitation you make in your dashboard: works once, expires after 30 days;
// - a friend's share link, made in the app by someone you invited: works for up to 3 people.
// Either one turns on lifetime access for the account that uses it.
import { json, sb, getUser, getProfile, isAdult, adultRequired, ensureTrial, notifyAdmin } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const code = String(body.code || "").trim();
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(code)) return json({ error: "bad_code" }, 400);
  const p0 = await getProfile(user.id);
  await ensureTrial(user, p0);
  if (!isAdult(p0)) return adultRequired(); // checked before the invite is claimed, so the link stays usable
  if (p0 && p0.lifetime) return json({ ok: true, lifetime: true });
  // Claims one use in a single database step, so a link can never go past its limit.
  const claimed = await sb("rpc/claim_invite", { method: "POST", body: { p_code: code, p_user: user.id } });
  const inv = Array.isArray(claimed) ? claimed[0] : null;
  if (!inv) return json({ error: "bad_code" }, 400);
  await sb("invite_uses", { method: "POST", prefer: "resolution=ignore-duplicates", body: { code, user_id: user.id } });
  const shared = !!inv.owner;
  let cohort = "friends";
  if (shared) {
    const inviter = await getProfile(inv.owner);
    cohort = inviter && inviter.cohort === "friends" ? "shared" : "shared2";
  }
  await sb("profiles?id=eq." + user.id, { method: "PATCH", body: { lifetime: true, cohort, invited_by: inv.owner || null } });
  let who = (user.email || (user.phone ? "+" + String(user.phone).replace(/^\+/, "") : "")) || "Someone";
  if (shared) {
    const left = Math.max(0, (inv.max_uses || 1) - (inv.uses || 0));
    await notifyAdmin("Someone joined through a friend", who + " joined through " + (inv.label || "a friend's share link").replace(/^Shared by /, "") + "'s link. " + left + " left on that link.");
  } else {
    await notifyAdmin("A friend joined", (inv.label || who) + " joined with their invitation. Lifetime access is on.");
  }
  return json({ ok: true, lifetime: true, cohort });
}

export { preflight as OPTIONS } from "../api/_lib.js";
