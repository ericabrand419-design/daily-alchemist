// Permanently delete a user's account and everything they wrote. Cancels any membership first.
import { json, env, getUser, getProfile, stripe } from "./_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
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

export { preflight as OPTIONS } from "./_lib.js";
