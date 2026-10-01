// Today's weather where she is, for the look of the app and for which rituals make sense.
//
// Location: by default, the rough city Vercel already knows from the connection (no permission
// prompt). If she turns on precise location in Settings, the phone sends coordinates rounded to
// about a kilometer. Nothing about location is stored, here or anywhere else.
//
// Data: the US National Weather Service (free, public, commercial use allowed) inside the US.
// Elsewhere, Apple WeatherKit once these are set in Vercel (included with the Apple developer
// membership): WEATHERKIT_TEAM_ID, WEATHERKIT_KEY_ID, WEATHERKIT_SERVICE_ID, WEATHERKIT_PRIVATE_KEY.
// Results are kept for an hour per area, so a busy day costs a handful of lookups, not thousands.
import crypto from "node:crypto";
import { json, env } from "../api/_lib.js";

const UA = "DailyAlchemist/1.0 (" + (process.env.SUPPORT_EMAIL || "info@myagentfirst.info") + ")";
const cache = new Map(); // area -> { at, data }
const HOUR = 36e5;

function kindFromText(t, tempF) {
  t = String(t || "").toLowerCase();
  if (/thunder|t-storm|tstorm|severe/.test(t)) return "storm";
  if (/snow|sleet|flurr|blizzard|ice|freezing/.test(t)) return "snow";
  if (/rain|shower|drizzle/.test(t)) return "rain";
  if (/fog|haze|smoke|mist/.test(t)) return "fog";
  if (/wind|breezy|blustery/.test(t)) return "wind";
  if (tempF != null && tempF >= 92) return "hot";
  if (tempF != null && tempF <= 25) return "cold";
  if (/cloud|overcast/.test(t) && !/partly|mostly sunny|mostly clear/.test(t)) return "clouds";
  return "clear";
}
const WK_CODES = { Thunderstorms: "storm", IsolatedThunderstorms: "storm", ScatteredThunderstorms: "storm", StrongStorms: "storm", Rain: "rain", HeavyRain: "rain", Drizzle: "rain", SunShowers: "rain", Snow: "snow", HeavySnow: "snow", Flurries: "snow", Sleet: "snow", FreezingRain: "snow", FreezingDrizzle: "snow", Blizzard: "snow", WintryMix: "snow", Foggy: "fog", Haze: "fog", Smoky: "fog", Windy: "wind", Breezy: "wind", Cloudy: "clouds", MostlyCloudy: "clouds", Hot: "hot", Frigid: "cold" };
const WK_LABEL = (c) => String(c || "").replace(/([a-z])([A-Z])/g, "$1 $2");

async function nws(lat, lon) {
  const h = { "user-agent": UA, accept: "application/geo+json" };
  const p = await fetch("https://api.weather.gov/points/" + lat.toFixed(4) + "," + lon.toFixed(4), { headers: h });
  if (!p.ok) return null;
  const pj = await p.json(), url = pj.properties && pj.properties.forecastHourly;
  if (!url) return null;
  const f = await fetch(url, { headers: h });
  if (!f.ok) return null;
  const now = Date.now(), periods = ((await f.json()).properties || {}).periods || [];
  const cur = periods.find((x) => Date.parse(x.startTime) <= now && Date.parse(x.endTime) > now) || periods[0];
  if (!cur) return null;
  const tempF = cur.temperatureUnit === "C" ? Math.round(cur.temperature * 9 / 5 + 32) : cur.temperature;
  const next = periods.slice(1, 7).map((x) => kindFromText(x.shortForecast, x.temperature));
  return { kind: kindFromText(cur.shortForecast, tempF), label: cur.shortForecast, tempF, isDay: !!cur.isDaytime, soon: next.find((k) => k !== kindFromText(cur.shortForecast, tempF)) || null, source: "nws" };
}

function wkToken() {
  const team = env("WEATHERKIT_TEAM_ID"), kid = env("WEATHERKIT_KEY_ID"), sid = env("WEATHERKIT_SERVICE_ID"), pk = env("WEATHERKIT_PRIVATE_KEY");
  if (!team || !kid || !sid || !pk) return null;
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const t = Math.floor(Date.now() / 1000);
  const head = b64({ alg: "ES256", kid, id: team + "." + sid }), body = b64({ iss: team, iat: t, exp: t + 3600, sub: sid });
  const sig = crypto.sign("sha256", Buffer.from(head + "." + body), { key: pk.replace(/\\n/g, "\n"), dsaEncoding: "ieee-p1363" });
  return head + "." + body + "." + sig.toString("base64url");
}
async function weatherkit(lat, lon) {
  const tok = wkToken();
  if (!tok) return null;
  const r = await fetch("https://weatherkit.apple.com/api/v1/weather/en/" + lat.toFixed(3) + "/" + lon.toFixed(3) + "?dataSets=currentWeather,forecastHourly", { headers: { authorization: "Bearer " + tok } });
  if (!r.ok) return null;
  const d = await r.json(), c = d.currentWeather;
  if (!c) return null;
  const tempF = Math.round(c.temperature * 9 / 5 + 32);
  let kind = WK_CODES[c.conditionCode] || "clear";
  if (kind === "clear" && tempF >= 92) kind = "hot";
  if (kind === "clear" && tempF <= 25) kind = "cold";
  const hrs = (d.forecastHourly && d.forecastHourly.hours) || [];
  const soon = hrs.slice(1, 7).map((h) => WK_CODES[h.conditionCode] || "clear").find((k) => k !== kind) || null;
  return { kind, label: WK_LABEL(c.conditionCode), tempF, isDay: !!c.daylight, soon, source: "weatherkit" };
}

export async function POST(request) {
  let body = {}; try { body = await request.json(); } catch {}
  const hd = (k) => request.headers.get(k);
  let lat = Number(body.lat), lon = Number(body.lon), precise = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  let city = "", country = hd("x-vercel-ip-country") || "", region = hd("x-vercel-ip-country-region") || "";
  if (!precise) {
    lat = Number(hd("x-vercel-ip-latitude")); lon = Number(hd("x-vercel-ip-longitude"));
    try { city = decodeURIComponent(hd("x-vercel-ip-city") || ""); } catch { city = ""; }
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return json({ error: "no_location" }, 200);
  } else { lat = Math.round(lat * 100) / 100; lon = Math.round(lon * 100) / 100; }
  // US check: the connection's country, or coordinates inside the US boxes (lower 48, Alaska, Hawaii).
  const inUS = country === "US" || (precise && ((lat > 24 && lat < 50 && lon > -125 && lon < -66) || (lat > 51 && lat < 72 && lon > -170 && lon < -129) || (lat > 18 && lat < 23 && lon > -161 && lon < -154)));
  const area = (Math.round(lat * 4) / 4) + "," + (Math.round(lon * 4) / 4);
  const hit = cache.get(area);
  if (hit && Date.now() - hit.at < HOUR) return json({ ...hit.data, city: city || hit.data.city || "", precise, cached: true });
  let data = null;
  try { data = inUS ? (await nws(lat, lon)) || (await weatherkit(lat, lon)) : await weatherkit(lat, lon); } catch { data = null; }
  if (!data) return json({ error: "unavailable", us: inUS }, 200);
  data = { ...data, units: inUS ? "F" : "C", region };
  cache.set(area, { at: Date.now(), data });
  if (cache.size > 2000) cache.delete(cache.keys().next().value);
  return json({ ...data, city, precise });
}

// GET uses the connection's rough location only (handy for checking it works).
export const GET = POST;
export { preflight as OPTIONS } from "../api/_lib.js";
