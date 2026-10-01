// The guardians' music, made with ElevenLabs Music and kept in Supabase Storage (public bucket
// "music", one file per guardian, e.g. music/aura.mp3). Only you (ADMIN_EMAIL) can make or remake
// a track, from the dashboard. Each 90 second track costs about 1,350 ElevenLabs credits.
import { json, env, getUser, isAdminEmail } from "../api/_lib.js";

export const maxDuration = 60;

const SHARED = " Instrumental only, no vocals, no lyrics. Soft and spacious enough to sit quietly under a speaking voice. " +
  "Even volume from start to finish with no big build or ending, so the last bar flows back into the first and it loops seamlessly.";

// One theme per guardian, all from the same candlelit, moonlit world.
const THEMES = {
  aura: "Theme for Aura, a warm, wise and elegant mystical guide. Soft harp arpeggios, shimmering celesta, low velvet string pads, distant wind chimes and a faint breathy choir-like synth. Slow, about 60 bpm, luminous, like candlelight in a moonlit room. Calm and inviting.",
  onyx: "Theme for Onyx, a blunt truth-teller who uses silence. Sparse low piano notes with long pauses, a deep cello drone, dark obsidian atmosphere, one soft struck gong far away. Very slow, about 50 bpm, grave, still and honest.",
  sage: "Theme for Sage, a fierce protective flame keeper. Warm frame drum pulse kept soft, crackling fire texture, low duduk-like reed melody, glowing amber pads. Steady, about 72 bpm, protective and brave but never loud.",
  fern: "Theme for Fern, a soft lyrical flow priestess who sounds like water. Flowing fingerpicked nylon guitar, gentle rain and stream textures, liquid marimba drops, airy flute. Slow, about 58 bpm, fluid, green and serene.",
  thistle: "Theme for Thistle, a warm tough-love protector of roots. Earthy acoustic guitar, upright bass, brushed hand percussion kept low, a comforting Wurlitzer, a hint of gospel warmth. Grounded, about 66 bpm, homey and sturdy.",
  marigold: "Theme for Marigold, a bright, flirty, loving joy alchemist with big Leo energy. Sunny ukulele and glockenspiel, warm Rhodes, playful pizzicato strings, light shaker. Upbeat but gentle, about 92 bpm, golden and joyful.",
  juniper: "Theme for Juniper, keeper of sacred space, slow and meditative. Tibetan singing bowls, soft shruti drone, a breathy shakuhachi phrase now and then, faint forest air. Very slow, about 48 bpm, deeply calm and reverent.",
  rue: "Theme for Rue, a sharp, witty boundary witch, a velvet dagger. Dark plucked harpsichord motif, low tremolo strings, a sly muted trumpet line, soft finger snaps. Moody and elegant, about 76 bpm, mysterious and confident.",
  sol: "Theme for Sol, a bold, radiant, electric hype witch with coach energy. Warm Afrobeat-inspired guitar licks, soft kick and shaker kept low, bright horn stabs far in the background, sunny synth chords. About 100 bpm, uplifting and confident.",
  aurora: "Theme for Aurora, the hopeful first light of morning. Gentle rising piano, shimmering synth sunrise pads, soft birdsong, glassy bells, a warm cello swell. About 68 bpm, luminous, hopeful and fresh.",
  rowan: "Theme for Rowan, a warm, grounded movement coach who gets you back into your body. Steady hand drums and a soft four on the floor pulse kept low, earthy fingerpicked guitar, a warm bass line, open outdoor air. About 96 bpm, steady, encouraging and grounded, like a good morning walk.",
  iris: "Theme for Iris, the cycle keeper, observant, body-literate and warm. A slow heartbeat pulse on soft low frame drum, warm felt piano in a gentle repeating cycle, a soft cello line that rises and falls like breath, faint tide and night insects. About 66 bpm, steady, grounded and kind, never sleepy.",
  willow: "Theme for Willow, a gentle, nurturing quiet healer. Soft felt piano, warm viola, gentle lap harp, a lullaby-like melody, light rain on leaves. Very slow, about 54 bpm, tender, safe and restorative.",
  vesper: "Theme for Vesper, keeper of the night garden, desire and intimacy. Slow sensual neo soul, warm Rhodes chords, a soft upright bass, brushed drums kept very low, velvet strings, faint night garden crickets. About 70 bpm, sultry, unhurried and warm, candlelit and elegant.",
  wren: "Theme for Wren, a whimsical, clever messenger. Playful plucked mandolin and celesta, curious woodwinds like clarinet and piccolo, light pizzicato, a few chirping bird textures. About 88 bpm, whimsical, curious and light.",
  lumen: "Theme for Lumen, a visionary, precise futurecaster. Crystalline arpeggiated synths, soft pulsing sequencer, glassy pads, gentle starfield shimmer. About 80 bpm, clear, spacious and forward-looking.",
  onora: "Theme for Onora, a reverent, warm keeper of names and stories. Warm kora and fingerpicked strings, soft hand drum heartbeat, a humming cello, candlelit fireside atmosphere. About 64 bpm, ancestral, reverent and warm.",
  poppy: "Theme for Poppy, a playful, messy, delighted creative muse. Bouncy toy piano and marimba, playful pizzicato, brushed snare kept light, colorful synth sparkles. About 104 bpm, joyful, creative and spontaneous.",
  lily: "Theme for Lily, a clean, airy clarity conduit with breath cues. Airy flute over soft sustained synth pads that swell and recede like slow breathing, clear bell tones, light wind. Slow, about 56 bpm, clear, open and calming.",
};

const base = () => env("SUPABASE_URL") + "/storage/v1";
const svc = () => ({ apikey: env("SUPABASE_SERVICE_ROLE_KEY"), authorization: "Bearer " + env("SUPABASE_SERVICE_ROLE_KEY") });
const publicUrl = (g) => base() + "/object/public/music/" + g + ".mp3";

async function upload(g, bytes) {
  const put = () => fetch(base() + "/object/music/" + g + ".mp3", { method: "POST", headers: { ...svc(), "content-type": "audio/mpeg", "x-upsert": "true", "cache-control": "86400" }, body: bytes });
  let r = await put();
  if (!r.ok) { // first time: make the public bucket, then try again
    await fetch(base() + "/bucket", { method: "POST", headers: { ...svc(), "content-type": "application/json" }, body: JSON.stringify({ id: "music", name: "music", public: true }) });
    r = await put();
  }
  return r.ok;
}

async function status() {
  const out = {};
  await Promise.all(Object.keys(THEMES).map(async (g) => {
    try { const h = await fetch(publicUrl(g) + "?v=" + Date.now(), { method: "HEAD" }); out[g] = h.ok; } catch { out[g] = false; }
  }));
  return out;
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return json({ error: "signin" }, 401);
  if (!isAdminEmail(user.email)) return json({ error: "not_admin" }, 403);
  let body = {}; try { body = await request.json(); } catch {}
  if (body.action === "make") {
    const g = String(body.g || "");
    if (!THEMES[g]) return json({ error: "bad_guardian" }, 400);
    if (!env("ELEVENLABS_API_KEY")) return json({ error: "no_key" }, 503);
    const r = await fetch("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", {
      method: "POST",
      headers: { "xi-api-key": env("ELEVENLABS_API_KEY"), "content-type": "application/json" },
      body: JSON.stringify({ prompt: THEMES[g] + SHARED, music_length_ms: 90000, force_instrumental: true }),
    });
    if (!r.ok) return json({ error: "music_failed", detail: (await r.text()).slice(0, 300) }, 502);
    const ok = await upload(g, await r.arrayBuffer());
    if (!ok) return json({ error: "store_failed" }, 502);
  }
  return json({ tracks: await status(), url: base() + "/object/public/music/" });
}

export { preflight as OPTIONS } from "../api/_lib.js";
