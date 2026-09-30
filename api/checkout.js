import { json, env, getUser, getProfile, isAdult, adultRequired, stripe, siteUrl } from "./_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  let body = {}; try { body = await request.json(); } catch {}
  const price = body.plan === "monthly" ? env("STRIPE_PRICE_MONTHLY") : env("STRIPE_PRICE_YEARLY");
  if (!price) return json({ error: "not_configured" }, 500);
  const profile = await getProfile(user.id);
  if (!isAdult(profile)) return adultRequired();
  const site = siteUrl(request);
  const session = await stripe("checkout/sessions", {
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": 1,
    client_reference_id: user.id,
    ...(profile?.stripe_customer ? { customer: profile.stripe_customer } : { customer_email: user.email }),
    subscription_data: { metadata: { user_id: user.id } },
    allow_promotion_codes: true,
    success_url: site + "/?checkout=success",
    cancel_url: site + "/",
  });
  return json({ url: session.url });
}

export { preflight as OPTIONS } from "./_lib.js";
