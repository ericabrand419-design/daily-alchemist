// Builds the app from src/ (run: node build.mjs).
//
//   src/shell/web-head.html   <head> bits only the live site needs (config, Supabase, manifest)
//   src/shell/head.html       title and fonts
//   src/styles.css            all styles
//   src/shell/body.html       the page skeleton
//   src/js/*.js               the app, one file per area, joined in the order in src/js/ORDER.txt
//   src/shell/web-tail.html   service worker registration (live site only)
//
// Outputs:
//   index.html, styles.css, app.js   the live site (dailyalchemist.com)
//   preview/daily-alchemist.html     a single self-contained file for the Claude preview
//
// The modules share one scope, exactly as before, because app.js wraps them in one function.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const order = read("./src/js/ORDER.txt").split("\n").map((s) => s.trim()).filter(Boolean);
const js = order.map((f) => read("./src/js/" + f)).join("");
const bundle = "(function(){\n\"use strict\";\n" + js + "})();\n";
const css = read("./src/styles.css");
const webHead = read("./src/shell/web-head.html");
const head = read("./src/shell/head.html");
const body = read("./src/shell/body.html");
const webTail = read("./src/shell/web-tail.html");
const v = (s) => createHash("sha256").update(s).digest("hex").slice(0, 10);

// Live site: HTML shell + separate CSS and JS files.
writeFileSync(new URL("./app.js", import.meta.url), bundle);
writeFileSync(new URL("./styles.css", import.meta.url), css);
writeFileSync(new URL("./index.html", import.meta.url),
  webHead + head + '<link rel="stylesheet" href="/styles.css?v=' + v(css) + '">\n' + body +
  '<script src="/app.js?v=' + v(bundle) + '"></script>\n' + webTail);

// Preview: everything inline in one file.
const inline = head + "<style>\n" + css + "</style>\n" + body + "<script>\n" + bundle + "</script>\n";
mkdirSync(new URL("./preview/", import.meta.url), { recursive: true });
writeFileSync(new URL("./preview/daily-alchemist.html", import.meta.url), inline);

// Check mode: rebuild the old single-file page and compare, to prove nothing changed.
if (process.argv.includes("--inline")) writeFileSync(new URL("./preview/inline-web.html", import.meta.url), webHead + inline + webTail);
console.log("built", order.length, "modules,", (bundle.length / 1024).toFixed(0) + " KB js,", (css.length / 1024).toFixed(0) + " KB css");
