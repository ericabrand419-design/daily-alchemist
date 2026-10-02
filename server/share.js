// Sharing tree for lifetime launch invitations.
// Erica's direct invitees ("friends") can invite 3 people.
// People who arrive through those links ("shared") can invite 1 person.
// The next generation ("shared2") receives lifetime access but no further share link.
import crypto from "node:crypto";
import { json, sb, getUser, getProfile, isAdult, adultRequired, isAdminEmail } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);

  if (isAdminEmail(user.email)) {
    let rows = await sb("invites?label=eq.Erica%27s%20open%20link&owner=is.null&revoked=eq.false&select=code,uses,max_uses&limit=1");
    let inv = rows && rows[0];
    if (!inv) {
      inv = { code: crypto.randomBytes(18).toString("base64url"), label: "Erica's open link", owner: null, max_uses: 100000, uses: 0, expires_at: null };
      await sb("invites", { method: "POST", body: inv });
    }
    return json({ code: inv.code, uses: inv.uses || 0, max: null, open: true });
  }

  const p = await getProfile(user.id);
  if (!isAdult(p)) return adultRequired();
  if (!p || !p.lifetime) return json({ error: "not_eligible" }, 403);

  const max = p.cohort === "friends" ? 3 : p.cohort === "shared" ? 1 : 0;
  if (!max) return json({ error: "not_eligible" }, 403);

  let rows = await sb("invites?owner=eq." + user.id + "&revoked=eq.false&select=code,uses,max_uses&order=created_at.asc&limit=1");
  let inv = rows && rows[0];
  if (!inv) {
    inv = {
      code: crypto.randomBytes(18).toString("base64url"),
      label: "Shared by " + ((user.email || (user.phone ? "+" + String(user.phone).replace(/^\+/, "") : "")) || "a friend"),
      owner: user.id,
      max_uses: max,
      uses: 0,
      expires_at: null
    };
    await sb("invites", { method: "POST", body: inv });
  }
  return json({ code: inv.code, uses: inv.uses || 0, max: inv.max_uses || max, generation: p.cohort === "friends" ? 1 : 2 });
}

export { preflight as OPTIONS } from "../api/_lib.js";
