// Invitations. Two kinds, both at dailyalchemist.com/?friend=<code>:
// - a personal invitation you make in your dashboard: works once, expires after 30 days;
// - a friend's share link, made in the app by someone you invited: works for up to 3 people.
// Either one turns on lifetime access for the account that uses it.
import { json, sb, getUser, getProfile, isAdult, adultRequired, ensureTrial, notifyAdmin } from "../api/_lib.js";

async function cohortFor(owner) {
  if (!owner) return "friends";
  const inviter = await getProfile(owner);
  return inviter && inviter.cohort === "friends" ? "shared" : "shared2";
}

async function grantClaim(user, code, inv, fresh) {
  const cohort = await cohortFor(inv.owner || null);
  try {
    // Grant access before doing bookkeeping. If the request dies after this point,
    // the next request sees lifetime=true and cannot consume another invitation slot.
    await sb("profiles?id=eq." + user.id, { method: "PATCH", body: { lifetime: true, cohort, invited_by: inv.owner || null } });
  } catch (e) {
    // Preserve the consumed claim so a retry can recover it without incrementing uses again.
    try { await sb("invite_uses", { method: "POST", prefer: "resolution=ignore-duplicates", body: { code, user_id: user.id } }); } catch {}
    return json({ error: "grant_failed" }, 500);
  }

  // Bookkeeping is deliberately non-fatal once lifetime access has been granted.
  try { await sb("invite_uses", { method: "POST", prefer: "resolution=ignore-duplicates", body: { code, user_id: user.id } }); } catch {}

  if (fresh) {
    const who = (user.email || (user.phone ? "+" + String(user.phone).replace(/^\+/, "") : "")) || "Someone";
    if (inv.owner) {
      const left = Math.max(0, (inv.max_uses || 1) - (inv.uses || 0));
      await notifyAdmin("Someone joined through a friend", who + " joined through " + (inv.label || "a friend's share link").replace(/^Shared by /, "") + "'s link. " + left + " left on that link.");
    } else {
      await notifyAdmin("A friend joined", (inv.label || who) + " joined with their invitation. Lifetime access is on.");
    }
  }
  return json({ ok: true, lifetime: true, cohort });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const code = String(body.code || "").trim();
  if (!/^[A-Za-z0-9_-]{20,64}$/.test(code)) return json({ error: "bad_code" }, 400);

  const p0 = await getProfile(user.id);
  await ensureTrial(user, p0);
  if (!isAdult(p0)) return adultRequired(); // checked before the invite is claimed, so the link stays usable
  if (p0 && p0.lifetime) return json({ ok: true, lifetime: true, cohort: p0.cohort || null });

  // Recovery path: if this user already consumed this code during an interrupted request,
  // finish granting access without consuming another use.
  const used = await sb("invite_uses?code=eq." + code + "&user_id=eq." + user.id + "&select=code&limit=1");
  if (used && used.length) {
    const rows = await sb("invites?code=eq." + code + "&select=owner,label,max_uses,uses&limit=1");
    const inv = rows && rows[0];
    if (!inv) return json({ error: "bad_code" }, 400);
    return grantClaim(user, code, inv, false);
  }

  // The database increments uses atomically and enforces the link's maximum.
  const claimed = await sb("rpc/claim_invite", { method: "POST", body: { p_code: code, p_user: user.id } });
  const inv = Array.isArray(claimed) ? claimed[0] : null;
  if (!inv) return json({ error: "bad_code" }, 400);
  return grantClaim(user, code, inv, true);
}

export { preflight as OPTIONS } from "../api/_lib.js";
