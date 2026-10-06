// Your dashboard's invitations: create one link per friend, see which are used, revoke any.
// Email invitations use a signed 30-day claim link. No Supabase/Resend email is sent.
// When the friend clicks, the app opens with the invitation saved, and she signs in with an emailed code.
import crypto from "node:crypto";
import { json, sb, getUser, isAdminEmail, env, siteUrl } from "../api/_lib.js";

const secret = () => env("SUPABASE_SERVICE_ROLE_KEY");
const ticketSig = (payload) => crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
function makeTicket(email, code, exp) {
  const payload = Buffer.from(JSON.stringify({ email, code, exp })).toString("base64url");
  return payload + "." + ticketSig(payload);
}
function readTicket(token) {
  const [payload, sig] = String(token || "").split(".");
  if (!payload || !sig || !secret()) return null;
  const expected = ticketSig(payload);
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.email || !data.code || !data.exp || Date.now() > data.exp) return null;
    return data;
  } catch { return null; }
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  if (!isAdminEmail(user.email)) return json({ error: "not_admin" }, 403);
  let body = {}; try { body = await request.json(); } catch {}
  let claim_url = null;
  if (body.action === "create") {
    const code = crypto.randomBytes(18).toString("base64url");
    const label = String(body.label || "").trim().slice(0, 60) || null;
    const email = String(body.email || "").trim().toLowerCase();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return json({ error: "invalid_email" }, 400);
    const expires = Date.now() + 30 * 864e5;
    const expires_at = new Date(expires).toISOString();
    await sb("invites", { method: "POST", body: { code, label, expires_at, max_uses: 1 } });
    if (email) claim_url = siteUrl(request).replace(/\/$/,"") + "/api/invites?t=" + encodeURIComponent(makeTicket(email, code, expires));
  } else if (body.action === "revoke" && body.code) {
    await sb("invites?code=eq." + encodeURIComponent(String(body.code)), { method: "PATCH", body: { revoked: true } });
  }
  const [invites, uses] = await Promise.all([
    sb("invites?select=code,label,created_at,expires_at,revoked,used_by,used_at,uses,max_uses,owner&order=created_at.desc&limit=300"),
    sb("invite_uses?select=code,user_id,used_at&order=used_at.asc&limit=2000"),
  ]);
  return json({ invites: invites || [], uses: uses || [], claim_url });
}

export async function GET(request) {
  const token = new URL(request.url).searchParams.get("t");
  const t = readTicket(token);
  if (!t) return new Response("This invitation link is invalid or expired.", { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } });

  const rows = await sb("invites?code=eq." + encodeURIComponent(t.code) + "&select=code,expires_at,revoked,used_by,uses,max_uses&limit=1");
  const invite = rows && rows[0];
  if (!invite || invite.revoked || (invite.expires_at && new Date(invite.expires_at) < new Date()) || ((invite.max_uses || 1) <= (invite.uses || 0))) {
    return new Response("This invitation has already been used or is no longer available.", { status: 410, headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  // The link only carries the invitation. She still signs in with a code sent to her own email,
  // so a forwarded invitation can't open her account for someone else.
  return Response.redirect(siteUrl(request).replace(/\/$/,"") + "/?friend=" + encodeURIComponent(t.code), 302);
}

export { preflight as OPTIONS } from "../api/_lib.js";
