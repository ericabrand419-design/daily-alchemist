// One function serves every /api/<name> address (Vercel's free plan allows 12 functions).
// Each address's code lives in server/<name>.js and is loaded only when it's called.
import { preflight, json } from "./_lib.js";

export const maxDuration = 60; // making a guardian's music takes about 10 to 20 seconds

const ROUTES = {
  "admin": () => import("../server/admin.js"),
  "ai": () => import("../server/ai.js"),
  "checkout": () => import("../server/checkout.js"),
  "cron-reminders": () => import("../server/cron-reminders.js"),
  "delete": () => import("../server/delete.js"),
  "feedback": () => import("../server/feedback.js"),
  "friend": () => import("../server/friend.js"),
  "invites": () => import("../server/invites.js"),
  "me": () => import("../server/me.js"),
  "monitor": () => import("../server/monitor.js"),
  "music": () => import("../server/music.js"),
  "portal": () => import("../server/portal.js"),
  "push-subscribe": () => import("../server/push-subscribe.js"),
  "share": () => import("../server/share.js"),
  "stripe-webhook": () => import("../server/stripe-webhook.js"),
  "track": () => import("../server/track.js"),
  "voice": () => import("../server/voice.js"),
};

async function handle(request, method) {
  const name = new URL(request.url).pathname.replace(/\/+$/, "").split("/").pop();
  if (!Object.hasOwn(ROUTES, name)) return json({ error: "not_found" }, 404);
  const mod = await ROUTES[name]();
  const fn = mod[method];
  if (!fn) return json({ error: "method_not_allowed" }, 405);
  return fn(request);
}

export const GET = (request) => handle(request, "GET");
export const POST = (request) => handle(request, "POST");
export function OPTIONS() { return preflight(); }
