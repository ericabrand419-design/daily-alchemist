import { json, getUser, getProfile, stripe, siteUrl } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  const profile = await getProfile(user.id);
  if (!profile?.stripe_customer) return json({ error: "no_customer" }, 400);
  const s = await stripe("billing_portal/sessions", { customer: profile.stripe_customer, return_url: siteUrl(request) + "/" });
  return json({ url: s.url });
}

export { preflight as OPTIONS } from "../api/_lib.js";
