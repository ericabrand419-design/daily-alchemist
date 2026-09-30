import { json, sb, getUser, getProfile, isMember, isPaid, isAdminEmail, ensureTrial, getUsage } from "../api/_lib.js";

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  const [p0, usage] = await Promise.all([getProfile(user.id), getUsage(user.id)]);
  let profile = await ensureTrial(user, p0);
  const admin = isAdminEmail(user.email);
  let body = {}; try { body = await request.json(); } catch {}
  // Record, once, that this account confirmed they're 18 or older.
  if (body.confirmAdult && !profile.adult_confirmed_at) {
    const at = new Date().toISOString();
    await sb("profiles?id=eq." + user.id, { method: "PATCH", body: { adult_confirmed_at: at } });
    profile = { ...profile, adult_confirmed_at: at };
  }
  if (admin && !profile.is_admin) {
    await sb("profiles?id=eq." + user.id, { method: "PATCH", body: { is_admin: true } });
    profile = { ...profile, is_admin: true };
  }
  return json({
    email: user.email, member: isMember(profile), paid: isPaid(profile), lifetime: !!profile.lifetime, cohort: profile.cohort || null,
    trial_until: profile.trial_until || null, member_until: profile.member_until || null,
    adult_confirmed_at: profile.adult_confirmed_at || null, monitor_answer: profile.monitor_answer || null, monitor_until: profile.monitor_until || null, admin, usage,
  });
}

export { preflight as OPTIONS } from "../api/_lib.js";
