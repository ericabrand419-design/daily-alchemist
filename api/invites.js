// Your dashboard's invitations: create one link per friend, see which are used, revoke any.
import crypto from "node:crypto";
import { json, sb, getUser, isAdminEmail } from "./_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  if (!isAdminEmail(user.email)) return json({ error: "not_admin" }, 403);
  let body = {}; try { body = await request.json(); } catch {}
  if (body.action === "create") {
    const code = crypto.randomBytes(18).toString("base64url"); // 24 random characters
    const label = String(body.label || "").trim().slice(0, 60) || null;
    const expires_at = new Date(Date.now() + 30 * 864e5).toISOString();
    await sb("invites", { method: "POST", body: { code, label, expires_at } });
  } else if (body.action === "revoke" && body.code) {
    await sb("invites?code=eq." + encodeURIComponent(String(body.code)), { method: "PATCH", body: { revoked: true } });
  }
  const invites = (await sb("invites?select=code,label,created_at,expires_at,revoked,used_by,used_at&order=created_at.desc&limit=200")) || [];
  return json({ invites });
}

export { preflight as OPTIONS } from "./_lib.js";
