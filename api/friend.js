// Friends Week: each friend gets their own invitation link (dailyalchemist.com/?friend=<code>),
// created in your dashboard. A code works once, for one account, and expires after 30 days.
// Using it turns on lifetime access for that account.
import { json, sb, getUser, getProfile, isAdult, adultRequired, ensureTrial, notifyAdmin } from "./_lib.js";

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
  const now = new Date().toISOString();
  // Claim the code only if it is unused, not revoked and not expired. Doing it in one conditional
  // update means two people can never both use the same link.
  const claimed = await sb(
    "invites?code=eq." + encodeURIComponent(code) + "&used_by=is.null&revoked=eq.false&expires_at=gt." + now,
    { method: "PATCH", prefer: "return=representation", body: { used_by: user.id, used_at: now } }
  );
  if (!Array.isArray(claimed) || !claimed.length) return json({ error: "bad_code" }, 400);
  await sb("profiles?id=eq." + user.id, { method: "PATCH", body: { lifetime: true, cohort: "friends" } });
  await notifyAdmin("A friend joined", (claimed[0].label || user.email || "A friend") + " joined with their invitation. Lifetime access is on.");
  return json({ ok: true, lifetime: true });
}

export { preflight as OPTIONS } from "./_lib.js";
