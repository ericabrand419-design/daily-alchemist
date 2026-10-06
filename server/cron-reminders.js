// Runs daily at 9 am Eastern, all year (see vercel.json: two UTC times, one per DST state).
// Sends only meaningful messages: promises she asked Aura to check, things she asked
// to bring back, and dates that matter tomorrow.
// What's been sent is tracked server-side in push_sent, keyed by item AND due date,
// so snoozing a promise ("Not yet") makes it eligible to notify again at its new time.
import webpush from "web-push";
import { readFileSync } from "node:fs";
import { json, env, sb, isMember, isPaid, GRACE_DAYS } from "../api/_lib.js";

const PRODUCT_RULES = JSON.parse(readFileSync(new URL("../shared/product-rules.json", import.meta.url), "utf8"));
const HEAVY = new RegExp(PRODUCT_RULES.heavyPattern, "i");

const GNAME = {sage:"Sage",onyx:"Onyx",fern:"Fern",lily:"Lily",thistle:"Thistle",marigold:"Marigold",juniper:"Juniper",rue:"Rue",sol:"Sol",cypress:"Sol",aurora:"Aurora",rowan:"Rowan",ember:"Sage",iris:"Iris",willow:"Willow",vesper:"Vesper",wren:"Wren",lumen:"Lumen",onora:"Onora",poppy:"Poppy"};
function easternWeekday(d) {
  return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short" }).format(d);
}

const firstName = (p) => (p && p.name ? p.name.split(" ")[0] : "");
function easternHour(d) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hourCycle: "h23" }).format(d));
}
function easternToday(d) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(d).map((p) => [p.type, p.value]));
  return { y: +parts.year, m: +parts.month, d: +parts.day };
}

export async function GET(request) {
  if (request.headers.get("authorization") !== "Bearer " + env("CRON_SECRET")) return json({ error: "unauthorized" }, 401);
  const nowDate = new Date();
  const force = new URL(request.url).searchParams.get("force") === "1";
  if (!force && easternHour(nowDate) !== 9) return json({ skipped: "not 9 am Eastern" });

  webpush.setVapidDetails("mailto:" + (env("SUPPORT_EMAIL") || "hello@dailyalchemist.com"), env("VAPID_PUBLIC_KEY"), env("VAPID_PRIVATE_KEY"));
  const subs = await sb("push_subs?select=user_id,endpoint,sub");
  const byUser = {};
  for (const s of subs || []) (byUser[s.user_id] = byUser[s.user_id] || []).push(s);
  const now = nowDate.getTime(), et = easternToday(nowDate);
  const tomorrow = new Date(Date.UTC(et.y, et.m - 1, et.d + 1));
  let sent = 0;

  for (const [userId, list] of Object.entries(byUser)) {
    const rows = await sb("prefs?user_id=eq." + userId + "&select=data");
    const data = rows && rows[0] && rows[0].data; if (!data) continue;
    const x = data.extras || {}, name = firstName(data.profile), up = data.profile || {};
    // Same defaults as the app's contactPref(): turning on "Let Aura reach me" in Settings counts as yes.
    const contact = { scope: "circle", ...(up.contact || {}) };
    const notify = contact.notify != null ? contact.notify === true : up.push === true;
    if (!notify || contact.enabled === false || contact.cadence === "never") continue;
    const sentRows=((await sb("push_sent?user_id=eq." + userId + "&select=key,sent_at&order=sent_at.desc")) || []);
    const already = new Set(sentRows.map((r) => r.key));
    const cadenceDays=contact&&contact.cadence==="3xday"?1/3:contact&&contact.cadence==="daily"?1:contact&&contact.cadence==="3days"?3:contact&&contact.cadence==="monthly"?30:7;
    const lastContact=sentRows[0]&&Date.parse(sentRows[0].sent_at);
    // Her chosen rhythm paces letters and guardian check-ins. Things she asked for (a promise, "bring this
    // back later", a date) and an unresolved situation are never held back by it.
    const rhythmOK = !(lastContact && now - lastContact < (cadenceDays * 864e5 - 6 * 36e5));
    const due = [];
    for (const p of x.promises || []) if (p.status === "open" && p.due <= now) {
      const key = "promise:" + p.id + ":" + p.due;
      if (!already.has(key)) due.push({ key, title: "Aura, checking back", body: "You said: \"" + p.text + "\". Did you?" });
    }
    for (const l of x.later || []) if (!l.done && l.due <= now) {
      const key = "later:" + l.id + ":" + l.due;
      if (!already.has(key)) due.push({ key, title: "You asked me to bring this back", body: String(l.label || "").slice(0, 140) });
    }
    for (const d of x.dates || []) if (d.month === tomorrow.getUTCMonth() + 1 && d.day === tomorrow.getUTCDate()) {
      const key = "date:" + d.id + ":" + tomorrow.getUTCFullYear();
      if (!already.has(key)) due.push({ key, title: "Aura", body: "Tomorrow is " + d.name + ". Want me to help you mark it?" });
    }

    // Inner Circle: guardian check-ins, letters from Aura, and the end of the free week.
    // Every message is written as Aura.
    const prof = await sb("profiles?id=eq." + userId + "&select=member_until,trial_until");
    const p = prof && prof[0];
    const member = isMember(p);
    const trialEnd = p && p.trial_until ? Date.parse(p.trial_until) : 0;
    const inGrace = !member && trialEnd && now >= trialEnd && now < trialEnd + GRACE_DAYS * 864e5;
    const hi = name ? name + ", " : "";
    if (member || inGrace) {
      const recent = (await sb("entries?user_id=eq." + userId + "&created_at=gte." + new Date(now - 7 * 864e5).toISOString() + "&select=id,data&order=created_at.desc&limit=30")) || [];
      if (member && rhythmOK && contact.scope === "circle") {
        const withG = recent.map((r) => ({ id: r.id, ...(r.data || {}) })).filter((e) => !e.private && GNAME[e.guardian] && e.ts);
        const latest = {};
        for (const e of withG) if (!latest[e.guardian] || e.ts > latest[e.guardian].ts) latest[e.guardian] = e;
        const ripe = Object.values(latest).filter((e) => now - e.ts >= 2 * 864e5 && now - e.ts < 3 * 864e5).sort((a, b) => b.ts - a.ts)[0];
        if (ripe) {
          const key = "nudge:" + ripe.id, g = GNAME[ripe.guardian];
          if (!already.has(key)) due.push({ key, title: "Aura", body: hi + g + " has been thinking about you. Want to tell " + g + " how it's going?" });
        }
      }
      // Aurora's first in-app return letter is created by the app itself. After that, letters follow her chosen cadence.
      const lastL = (x.letters || []).reduce((m, l) => Math.max(m, l.ts || 0), 0);
      const firstEver = (await sb("entries?user_id=eq." + userId + "&select=created_at&order=created_at.asc&limit=1")) || [];
      const startedBeforeToday = firstEver[0] && Date.parse(firstEver[0].created_at) < now - 12 * 36e5;
      const cadence=contact&&contact.cadence==="3xday"?1/3:contact&&contact.cadence==="daily"?1:contact&&contact.cadence==="3days"?3:contact&&contact.cadence==="monthly"?30:7;
      const letterDue = lastL ? now - lastL > (cadence-.25) * 864e5 && recent.length : false;
      if (letterDue && rhythmOK) {
        const key = "letter:" + et.y + "-" + et.m + "-" + et.d;
        const body = member
          ? (lastL ? hi + "I wrote you a letter. I looked back at your week." : hi + "I wrote you my first letter. It's waiting for you.")
          : hi + "I wrote you a letter about your week. It's sealed in your mailbox until you join.";
        if (!already.has(key)) due.push({ key, title: "A letter from Aura", body });
      }
    }
    // The day before the free week ends.
    if (p && !isPaid(p) && trialEnd && trialEnd - now > 0 && trialEnd - now <= 36 * 36e5) {
      const key = "trialend:" + p.trial_until;
      if (!already.has(key)) due.unshift({ key, title: "Aura", body: hi + "your free week ends tomorrow. I'll keep writing to you, but my letters will stay sealed until you join." });
    }
    // Real life outranks the rhythm here too: an unresolved thing she told Aura leads the message.
    // Her words never go on the lock screen.
    const sit = (x.asks || []).filter((a) => !a.noMem && a.text && !a.settled && !a.fuDismiss && (!a.follow || a.follow.still) && now - a.ts < 36 * 36e5 && !(a.sitSnooze && a.sitSnooze > now) && (a.priority === "unresolved" || HEAVY.test(a.text) || (a.follow && a.follow.still))).sort((p, q) => q.ts - p.ts)[0];
    if (sit && !(x.later || []).some((l) => l.ref === sit.id && !l.done)) {
      const key = "sit:" + sit.id;
      if (!already.has(key)) due.unshift({ key, title: "Aura", body: hi + "I'm still holding what you told me yesterday. Where are you with it?" });
    }
    if (!due.length) continue;

    const m = { ...due[0] };
    if (due.length > 1) m.body += due.length === 2 ? " I have one more thing for you in the app." : " I have " + (due.length - 1) + " more things for you in the app.";
    if (name && !m.title.startsWith("A letter") && m.title !== "Aura") m.title += ", " + name;
    let delivered = false;
    for (const s of list) {
      try { await webpush.sendNotification(s.sub, JSON.stringify({ title: m.title, body: m.body, url: "/" })); delivered = true; sent++; }
      catch (e) { if (e.statusCode === 404 || e.statusCode === 410) await sb("push_subs?endpoint=eq." + encodeURIComponent(s.endpoint), { method: "DELETE" }); }
    }
    if (delivered) await sb("push_sent?on_conflict=user_id,key", { method: "POST", prefer: "resolution=ignore-duplicates", body: due.map((d) => ({ user_id: userId, key: d.key })) });
  }
  return json({ sent });
}
