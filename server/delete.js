// Permanently delete a user's account and everything they wrote. Cancels any membership first.
import { json, env, sb, getUser, getProfile, stripe } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  // Clear my data, keep my account: everything she wrote and everything the app learned goes,
  // but her sign in, membership and age check stay, so she can start fresh without starting over.
  if (body.scope === "data") {
    const tables = ["entries", "chats", "prefs", "cycle_events", "events", "push_sent"];
    const failed = [];
    for (const t of tables) {
      try { await sb(t + "?user_id=eq." + user.id, { method: "DELETE" }); }
      catch (e) { if (t !== "cycle_events") failed.push(t); } // cycle_events may not exist yet
    }
    if (failed.length) return json({ error: "clear_failed", failed }, 502);
    return json({ cleared: true });
  }
  const profile = await getProfile(user.id);
  if (profile?.stripe_customer) {
    try {
      const subs = await stripe("subscriptions", { customer: profile.stripe_customer, status: "all", limit: 20 }, "GET");
      for (const sub of subs.data || []) if (!["canceled", "incomplete_expired"].includes(sub.status)) await stripe("subscriptions/" + sub.id, {}, "DELETE");
    } catch (e) {
      return json({ error: "billing_cancel_failed" }, 502);
    }
  }
  // Deleting the auth user cascades to profiles, prefs, entries, chats and usage.
  const res = await fetch(env("SUPABASE_URL") + "/auth/v1/admin/users/" + user.id, {
    method: "DELETE",
    headers: { apikey: env("SUPABASE_SERVICE_ROLE_KEY"), authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY") },
  });
  if (!res.ok) return json({ error: "delete_failed" }, 502);
  return json({ deleted: true });
}

export { preflight as OPTIONS } from "../api/_lib.js";
