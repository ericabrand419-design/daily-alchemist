import { json, sb, getUser } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const sub = body.subscription;
  if (!sub || !sub.endpoint || !sub.keys) return json({ error: "bad_request" }, 400);
  await sb("push_subs?on_conflict=endpoint", { method: "POST", prefer: "resolution=merge-duplicates", body: { endpoint: sub.endpoint, user_id: user.id, sub } });
  return json({ ok: true });
}

export { preflight as OPTIONS } from "../api/_lib.js";
