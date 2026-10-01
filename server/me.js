import { json, sb, getUser, getProfile, isMember, isPaid, isAdminEmail, ensureTrial, getUsage } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  const [p0, usage] = await Promise.all([getProfile(user.id), getUsage(user.id)]);
  let profile = await ensureTrial(user, p0);
  const admin = isAdminEmail(user.email);
  let body = {}; try { body = await request.json(); } catch {}
  // One birthday, asked once, decides access: under 18 no account, 18 to 20 everything but Vesper,
  // 21 and older everything. Only the answers are kept here, never the birthday, and they can't be changed.
  if (body.dob && !profile.adult21_at && !profile.under21_at && !profile.under18_at) {
    const d = new Date(String(body.dob).slice(0, 10) + "T12:00:00Z"), n = new Date();
    if (!isNaN(d)) {
      let age = n.getUTCFullYear() - d.getUTCFullYear();
      if (n.getUTCMonth() < d.getUTCMonth() || (n.getUTCMonth() === d.getUTCMonth() && n.getUTCDate() < d.getUTCDate())) age--;
      if (age >= 0 && age <= 120) {
        const at = new Date().toISOString();
        const patch = age < 18 ? { under18_at: at, under21_at: at } : age < 21 ? { under21_at: at } : { adult21_at: at };
        if (age >= 18 && !profile.adult_confirmed_at) patch.adult_confirmed_at = at;
        try { await sb("profiles?id=eq." + user.id, { method: "PATCH", body: patch }); profile = { ...profile, ...patch }; } catch { return json({ error: "save_failed" }, 500); }
      }
    }
  }
  if (admin && !profile.is_admin) {
    await sb("profiles?id=eq." + user.id, { method: "PATCH", body: { is_admin: true } });
    profile = { ...profile, is_admin: true };
  }
  return json({
    email: user.email, member: isMember(profile), paid: isPaid(profile), lifetime: !!profile.lifetime, cohort: profile.cohort || null,
    trial_until: profile.trial_until || null, member_until: profile.member_until || null,
    adult_confirmed_at: profile.adult_confirmed_at || null, monitor_answer: profile.monitor_answer || null, monitor_until: profile.monitor_until || null, monitor_scope: profile.monitor_scope || null, admin, usage,
    adult21_at: profile.adult21_at || null, under21_at: profile.under21_at || null, under18_at: profile.under18_at || null,
  });
}

export { preflight as OPTIONS } from "../api/_lib.js";
