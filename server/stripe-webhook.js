// Stripe tells us when someone subscribes, renews or cancels.
import { json, env, sb, stripe, verifyStripeSignature } from "../api/_lib.js";

async function setMembership(userId, customer, sub) {
  const active = sub && ["active", "trialing", "past_due"].includes(sub.status);
  const until = sub && sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString()
    : sub && sub.items && sub.items.data && sub.items.data[0] && sub.items.data[0].current_period_end ? new Date(sub.items.data[0].current_period_end * 1000).toISOString() : null;
  await sb("profiles?on_conflict=id", {
    method: "POST", prefer: "resolution=merge-duplicates",
    body: { id: userId, stripe_customer: customer, member_until: active ? until : new Date().toISOString(), updated_at: new Date().toISOString() },
  });
}

export async function POST(request) {
  const raw = await request.text();
  if (!verifyStripeSignature(raw, request.headers.get("stripe-signature"), env("STRIPE_WEBHOOK_SECRET"))) return json({ error: "bad_signature" }, 400);
  const event = JSON.parse(raw);
  const obj = event.data && event.data.object;
  try {
    if (event.type === "checkout.session.completed" && obj.mode === "subscription") {
      const sub = await stripe("subscriptions/" + obj.subscription, {}, "GET");
      await setMembership(obj.client_reference_id || sub.metadata.user_id, obj.customer, sub);
    } else if (event.type.startsWith("customer.subscription.")) {
      let userId = obj.metadata && obj.metadata.user_id;
      if (!userId) {
        const rows = await sb("profiles?stripe_customer=eq." + obj.customer + "&select=id");
        userId = rows && rows[0] && rows[0].id;
      }
      if (userId) await setMembership(userId, obj.customer, event.type === "customer.subscription.deleted" ? { status: "canceled" } : obj);
    }
  } catch (e) {
    return json({ error: "handler_failed" }, 500);
  }
  return json({ received: true });
}
