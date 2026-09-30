// Your dashboard's data (dailyalchemist.com/admin). Only emails listed in ADMIN_EMAIL can read it.
// For people who said yes to sharing: what they tapped and when. Never what anyone wrote or said.
// For everyone else: only that they joined.
import { json, env, sb, getUser, isAdminEmail } from "../api/_lib.js";

async function allUsers() {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(env("SUPABASE_URL") + "/auth/v1/admin/users?per_page=200&page=" + page, {
      headers: { apikey: env("SUPABASE_SERVICE_ROLE_KEY"), authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY") },
    });
    if (!res.ok) break;
    const d = await res.json();
    const list = d.users || [];
    out.push(...list);
    if (list.length < 200) break;
  }
  return out;
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  if (!isAdminEmail(user.email)) return json({ error: "not_admin" }, 403);
  const since = new Date(Date.now() - 45 * 864e5).toISOString();
  const [users, profiles, prefs, events, feedback] = await Promise.all([
    allUsers(),
    sb("profiles?select=id,cohort,lifetime,trial_until,member_until,monitor_answer,monitor_started,monitor_until,joined_at,is_admin,adult_confirmed_at,invited_by"),
    sb("prefs?select=user_id,data->profile->>name"),
    sb("events?select=user_id,ev,meta,created_at&created_at=gte." + since + "&order=created_at.asc&limit=20000"),
    sb("feedback?select=user_id,email,mood,text,screen,day,created_at&order=created_at.desc&limit=500"),
  ]);
  const P = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  const N = Object.fromEntries((prefs || []).map((p) => [p.user_id, p.name]));
  const people = users.filter((u) => !isAdminEmail(u.email)).map((u) => {
    const p = P[u.id] || {};
    const sharing = p.monitor_answer === "yes" || p.monitor_answer === "stopped";
    return {
      id: u.id, email: u.email, name: N[u.id] || "", joined: p.joined_at || u.created_at, last_sign_in: u.last_sign_in_at || null,
      cohort: p.cohort || null, invited_by: p.invited_by || null, lifetime: !!p.lifetime, adult_confirmed_at: p.adult_confirmed_at || null, member_until: p.member_until || null, trial_until: p.trial_until || null,
      sharing: p.monitor_answer || null, sharing_started: sharing ? p.monitor_started : null, sharing_until: sharing ? p.monitor_until : null,
    };
  });
  const shared = new Set(people.filter((p) => p.sharing_started).map((p) => p.id));
  return json({
    generated: new Date().toISOString(),
    people,
    events: (events || []).filter((e) => shared.has(e.user_id)),
    feedback: feedback || [],
  });
}

export { preflight as OPTIONS } from "../api/_lib.js";
