// A friend's own share link. Anyone you invited (cohort "friends") gets one link that works for
// up to 3 people, who also get lifetime access. People who came in through a share link don't get
// one of their own, so it stays to three people per friend.
import crypto from "node:crypto";
import { json, sb, getUser, getProfile, isAdult, adultRequired } from "../api/_lib.js";

const MAX = 3;

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  const p = await getProfile(user.id);
  if (!isAdult(p)) return adultRequired();
  if (!p || !p.lifetime || p.cohort !== "friends") return json({ error: "not_eligible" }, 403);
  let rows = await sb("invites?owner=eq." + user.id + "&revoked=eq.false&select=code,uses,max_uses&order=created_at.asc&limit=1");
  let inv = rows && rows[0];
  if (!inv) {
    inv = { code: crypto.randomBytes(18).toString("base64url"), label: "Shared by " + (user.email || "a friend"), owner: user.id, max_uses: MAX, uses: 0, expires_at: null };
    await sb("invites", { method: "POST", body: inv });
  }
  return json({ code: inv.code, uses: inv.uses || 0, max: inv.max_uses || MAX });
}

export { preflight as OPTIONS } from "../api/_lib.js";
