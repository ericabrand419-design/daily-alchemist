// The guardians' voices, through ElevenLabs.
// Ritual steps are the same for everyone, so their audio is made once and kept (public, by an
// unguessable name). Anything personal (a guardian's reply, a reading) is spoken fresh and never stored.
import crypto from "node:crypto";
import { json, env, getUser, getProfile, ensureTrial, isMember, isAdult, adultRequired, getUsage, bumpUsage, LIMITS, CORS, isAdminEmail } from "../api/_lib.js";

// Each guardian's voice from the ElevenLabs Voice Library: [full name, voice ID, library owner ID].
// 13 women, 4 men and two voices that aren't clearly either (Lily and Vesper). Chosen with Erica, Sept 30 2026.
// Rowan (movement) took Moss's voice; Vesper uses River, one of ElevenLabs' built-in voices.
// Override any of these with ELEVENLABS_VOICES in Vercel, e.g. {"aura":"<voice id>"}.
const VOICES = {
  aura:     ["Samara X - Smooth Classy British", "19STyYD15bswVz51nqLf", "6643afd1d55a6987b18e340e00bb89ed60329c878a01823e0c10a50fb522bd76"],
  sage:     ["Lina - Confident, Dynamic and Strong", "oWjuL7HSoaEJRMDMP3HD", "c21e3f961fa9831eda02ff781cf8d62290cc46429b7d243e4f7e8c13299fc9e5"],
  fern:     ["Hope - Poetic, Romantic and Captivating", "iCrDUkL56s3C8sCRl7wb", "7d272ea0221fbc9ce382a3eaf4d7f907179558360d93b351ec7d344d30023cf9"],
  thistle:  ["Shayla", "p4M8XW4N954o56wN9vKM", "6ff6c007cdc938d53fa9c40f2168ef8f6276d63cd77dc14e4cb81b382b6de6bb"],
  marigold: ["Jessica - Playful, Bright, Warm", "r1KmysJdVYZjJCm4mL3b", "d5a057fa67bd4518fbf13eb08503860c528f1b11bb306922220aa0c561744e90"],
  rue:      ["Mariana - Intimacy with Authority", "OB0Jj6v9DGLLgz8dD57i", "375c86e675d6d8b2b50d4c33cc6b7ef407a68953e41de9fc9f98a70b88bb21d9"],
  aurora:   ["Tiffany - Natural and Welcoming", "6aDn1KB0hjpdcocrUkmq", "64cbc624eb5aab4e95a968e1f41d75402277cca6e549036ed17e56ea33bbbc9e"],
  iris:     ["Ivy - Spirited, Lively, Daring", "i4CzbCVWoqvD0P1QJCUL", "db90e9d28d86510262ed2a7235586923c68c9c8ae2e533739754741e8965a616"],
  willow:   ["Lauren - Friendly, Comforting and Soft", "DODLEQrClDo8wCz460ld", "7398804d9eaf2f463899a907587c33a390591775784f87857b6d0e1e4e3e66f6"],
  wren:     ["Priyanka - Calm, Neutral and Relaxed", "BpjGufoPiobT79j2vtj4", "7398804d9eaf2f463899a907587c33a390591775784f87857b6d0e1e4e3e66f6"],
  onora:    ["Kelli LaShae - Warm Southern Narrator", "Z5JpFCNFIz8Nhe4KEikq", "f671d623811fd0dc84fc9eb65f91c3e9a96728bbe850dc243d0728f6b18d3f25"],
  poppy:    ["Eve - Authentic, Energetic and Happy", "BZgkqPqms7Kj9ulSkVzn", "cab0f4a4d83ff44919f93c5d01052405fa3c50c414d1ecab061b67b0bd8d536a"],
  sol:      ["Cecily - Pro Black Woman Voice Over", "NQMJRVvPew6HsaebYnZj", "6b4cf07e3d6a1bd3fba4d6a45848a7ce28bc3ccde1e06085bc44948fdd6310db"],
  onyx:     ["Donovan - Articulate, Strong and Deep", "DMyrgzQFny3JI1Y1paM5", "37242178387aa74ac807790c7307e81312f0791cf06777a4791b86d941a77525"],
  juniper:  ["Milo - Calm, Soothing and Meditative", "GUDYcgRAONiI1nXDcNQQ", "465295810ef94f8627fad34ba88551a02745957d1c3b09877a3fc3de528d6f2f"],
  rowan:     ["Dan - African American calm & friendly", "1cuDPO8sIMatoOE4Z2Zv", "ed61d975d16c815a99c1bfed80609b8724afe0fbdc886513a3e74e0e2ef2ea9b"],
  vesper:   ["River - Relaxed, Neutral, Informative", "SAz9YHcvj6GT2YYXdXww", ""],
  lumen:    ["Brian Nguyen - Balanced, Wise and Calm", "bP8FJDHmWVEgXJDitdQd", "93c2227787fb299736de409d00bcdd04791a4b4ad1c1c0b11a4c5a40695850b2"],
  lily:     ["Elowen - Upbeat Modern Narrator", "dvbL7qkNGZY1IqPGZAjM", ""],
};
const XI = "https://api.elevenlabs.io";
const key = () => env("ELEVENLABS_API_KEY");
let idCache = null, idCacheAt = 0;
const norm = (n) => String(n || "").toLowerCase().replace(/\s+/g, " ").trim();
const short = (n) => norm(n).split(" - ")[0].trim();

// Voices already in the account: by voice ID and by full name.
async function myVoices() {
  if (idCache && Date.now() - idCacheAt < 36e5) return idCache;
  const ids = new Set(), names = {};
  for (let page = 0, token = ""; page < 5; page++) {
    const r = await fetch(XI + "/v2/voices?page_size=100" + (token ? "&next_page_token=" + encodeURIComponent(token) : ""), { headers: { "xi-api-key": key() } });
    if (!r.ok) break;
    const d = await r.json();
    for (const v of d.voices || []) { ids.add(v.voice_id); names[norm(v.name)] = v.voice_id; }
    if (!d.has_more || !d.next_page_token) break;
    token = d.next_page_token;
  }
  idCache = { ids, names }; idCacheAt = Date.now();
  return idCache;
}
// A voice that isn't in the account yet is found in the Voice Library (the exact voice, by ID or
// full name, never just a similar first name) and added once.
async function addById(owner, id, full) {
  const a = await fetch(XI + "/v1/voices/add/" + owner + "/" + id, {
    method: "POST", headers: { "xi-api-key": key(), "content-type": "application/json" }, body: JSON.stringify({ new_name: full }),
  });
  if (!a.ok) return null;
  const j = await a.json();
  idCache = null;
  return j.voice_id || id;
}
async function addFromLibrary(full, id) {
  const r = await fetch(XI + "/v1/shared-voices?page_size=30&search=" + encodeURIComponent(short(full)), { headers: { "xi-api-key": key() } });
  if (!r.ok) return null;
  const d = await r.json();
  const list = d.voices || [];
  const hit = (id && list.find((v) => v.voice_id === id)) || list.find((v) => norm(v.name) === norm(full));
  if (!hit) return null;
  const a = await fetch(XI + "/v1/voices/add/" + hit.public_owner_id + "/" + hit.voice_id, {
    method: "POST", headers: { "xi-api-key": key(), "content-type": "application/json" }, body: JSON.stringify({ new_name: hit.name }),
  });
  if (!a.ok) return null;
  const j = await a.json();
  idCache = null;
  return j.voice_id || hit.voice_id || null;
}
async function resolve(full, id, owner) {
  const mine = await myVoices();
  if (id && mine.ids.has(id)) return id;
  if (mine.names[norm(full)]) return mine.names[norm(full)];
  if (owner && id) { const added = await addById(owner, id, full); if (added) return added; }
  return await addFromLibrary(full, id);
}
async function voiceFor(g) {
  let over = {}; try { over = JSON.parse(env("ELEVENLABS_VOICES") || "{}"); } catch {}
  const o = over[g];
  if (o && /^[A-Za-z0-9]{20}$/.test(o)) return o; // a voice ID you chose
  const [full, id, owner] = o ? [o, "", ""] : (VOICES[g] || VOICES.aura);
  return (await resolve(full, id, owner)) || (await resolve(...VOICES.aura)) || null;
}

const storeBase = () => env("SUPABASE_URL") + "/storage/v1";
const svc = () => ({ apikey: env("SUPABASE_SERVICE_ROLE_KEY"), authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY") });
async function upload(name, bytes) {
  const put = () => fetch(storeBase() + "/object/voice/" + name, { method: "POST", headers: { ...svc(), "content-type": "audio/mpeg", "x-upsert": "true", "cache-control": "31536000" }, body: bytes });
  let r = await put();
  if (!r.ok) { // first time: make the bucket, then try again
    await fetch(storeBase() + "/bucket", { method: "POST", headers: { ...svc(), "content-type": "application/json" }, body: JSON.stringify({ id: "voice", name: "voice", public: true }) });
    r = await put();
  }
  return r.ok;
}

export async function POST(request) {
  if (!key()) return json({ error: "voice_off" }, 503);
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  // Spoken voice is off for customers until it's good enough. Set GUARDIAN_VOICE_ENABLED=true in Vercel to reopen it.
  if (env("GUARDIAN_VOICE_ENABLED") !== "true" && !isAdminEmail(user.email)) return json({ error: "voice_off" }, 503);
  let body = {}; try { body = await request.json(); } catch {}
  const text = String(body.text || "").replace(/\s+/g, " ").trim().slice(0, 2500);
  if (!text) return json({ error: "bad_request" }, 400);
  let g = String(body.g || "aura").toLowerCase(); if (g === "ember") g = "sage";
  const voice = await voiceFor(g);
  if (!voice) return json({ error: "voice_off" }, 503);
  // Flash is fast but garbles cadence on many library voices (the robotic, sing-song sound).
  // Multilingual v2 is ElevenLabs' most natural, stable model, and rituals are cached, so speed matters less.
  const model = env("ELEVENLABS_MODEL") || "eleven_multilingual_v2";
  const cacheable = !!body.cache && text.length <= 1500;
  const name = crypto.createHash("sha256").update(voice + "|" + model + "|" + text).digest("hex") + ".mp3";
  const publicUrl = storeBase() + "/object/public/voice/" + name;
  if (cacheable) {
    const h = await fetch(publicUrl, { method: "HEAD" });
    if (h.ok) return json({ url: publicUrl });
  }
  const profile = await ensureTrial(user, await getProfile(user.id));
  const owner = isAdminEmail(user.email);
  if (!isAdult(profile) && !owner) return adultRequired();
  const usage = await getUsage(user.id);
  const tier = isMember(profile) ? "member" : "free";
  if (!owner && (usage.voice || 0) + text.length > LIMITS[tier].voice) return json({ error: "limit", tier }, 429);
  const r = await fetch(XI + "/v1/text-to-speech/" + voice + "?output_format=mp3_44100_64", {
    method: "POST",
    headers: { "xi-api-key": key(), "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: model, voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0, use_speaker_boost: true, speed: 0.95 } }),
  });
  if (!r.ok) return json({ error: "voice_unavailable" }, 502);
  const bytes = new Uint8Array(await r.arrayBuffer());
  await bumpUsage(user.id, "voice", text.length);
  if (cacheable && (await upload(name, bytes))) return json({ url: publicUrl });
  return new Response(bytes, { status: 200, headers: { "content-type": "audio/mpeg", "cache-control": "no-store", ...CORS } });
}

export { preflight as OPTIONS } from "../api/_lib.js";
