import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import vm from "node:vm";

const read=p=>readFileSync(p,"utf8");
const fail=[], warn=[];
const ok=(cond,msg)=>{ if(!cond) fail.push(msg); };
const note=(cond,msg)=>{ if(!cond) warn.push(msg); };

const order=read("src/js/ORDER.txt").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
ok(order.length===new Set(order).size,"Duplicate modules in src/js/ORDER.txt");
for(const f of order) ok(existsSync("src/js/"+f),"Missing ordered module: "+f);

const rules=JSON.parse(read("shared/product-rules.json"));
const shared="const HARD_RULE="+JSON.stringify(rules.hardRule)+";\n"+
  "const PRIORITY_TEXT="+JSON.stringify(rules.priorityText)+";\n"+
  "const PRIORITY_HEAVY_PATTERN="+JSON.stringify(rules.heavyPattern)+";\n";
const source=shared+order.map(f=>read("src/js/"+f)).join("");
const expectedApp='(function(){\n"use strict";\n'+source+'})();\n';
const liveApp=read("app.js");
ok(liveApp===expectedApp,"app.js is stale: run node build.mjs and commit generated output");

const sourceCss=read("src/styles.css");
ok(read("styles.css")===sourceCss,"styles.css is stale: run node build.mjs and commit generated output");

const h=s=>createHash("sha256").update(s).digest("hex").slice(0,10);
const expectedIndex=read("src/shell/web-head.html")+read("src/shell/head.html")+
  '<link rel="stylesheet" href="/styles.css?v='+h(sourceCss)+'">\n'+
  read("src/shell/body.html")+'<script src="/app.js?v='+h(expectedApp)+'"></script>\n'+
  read("src/shell/web-tail.html");
ok(read("index.html")===expectedIndex,"index.html is stale or cache versions do not match current built assets");

try { new vm.Script(liveApp,{filename:"app.js"}); } catch(e){ fail.push("app.js syntax error: "+e.message); }

const apiRouter=read("api/[fn].js");
const routed=[...apiRouter.matchAll(/"([^"]+)"\s*:\s*\(\)\s*=>\s*import\("\.\.\/server\/([^"]+)"\)/g)]
  .map(m=>[m[1],m[2]]);
const routeNames=new Set(routed.map(x=>x[0]));
for(const [name,file] of routed) ok(existsSync("server/"+file),"API route "+name+" points to missing server/"+file);
const apiCalls=new Set([...source.matchAll(/api\(\s*["'\`]\/api\/([a-zA-Z0-9_-]+)/g)].map(m=>m[1]));
for(const name of apiCalls) ok(routeNames.has(name),"Client calls /api/"+name+" but api/[fn].js does not route it");

const fns=[...source.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]);
const counts=new Map(); for(const n of fns) counts.set(n,(counts.get(n)||0)+1);
for(const [n,c] of counts) if(c>1) fail.push("Duplicate function declaration in shared bundle: "+n+" x"+c);

ok(/function\s+ritualNeedItems\s*\(/.test(source),"Ritual supply helper ritualNeedItems is missing");
ok(/function\s+musicContextTarget\s*\(/.test(source),"Central audio context resolver is missing");
ok(/One guardian, one soundtrack/.test(source),"Single-track guardian audio invariant is missing");
ok(/visibilitychange[\s\S]{0,220}musicSuspend/.test(source),"Music is not suspended when app becomes hidden");
ok(/pagehide[\s\S]{0,120}musicSuspend/.test(source),"Music is not suspended on pagehide");
ok(/window\.addEventListener\("blur",musicSuspend\)/.test(source),"Music is not suspended on window blur");
ok(/function\s+startRitual[\s\S]{0,180}closeSheet\(true\)/.test(source),"Ritual start can flash base/Aura music during guardian handoff");

const buttonIds=new Set([...source.matchAll(/<button[^>]*\sid=["']([A-Za-z][\w:-]*)["']/g)].map(m=>m[1]).filter(x=>!x.includes("+")));
for(const id of buttonIds){
  const esc=id.replace(/[.*+?^$()|[\]\\]/g,"\\$&");
  const handled=new RegExp('t\\.id===["\\\']'+esc+'["\\\']|#'+esc+'\\b|getElementById\\(["\\\']'+esc+'["\\\']|\\$\\(["\\\']#'+esc+'["\\\']').test(source);
  if(!handled) warn.push("Review button id with no obvious handler: "+id);
}

note(!/\._music\b/.test(source),"Legacy _music sheet flag still exists; use _musicG/context resolver instead");

console.log("Daily Alchemist release audit");
console.log("Modules:",order.length,"API routes:",routed.length,"client API calls:",apiCalls.size,"button IDs checked:",buttonIds.size);
if(warn.length){ console.log("\nWARNINGS"); for(const w of warn) console.log(" -",w); }
if(fail.length){ console.error("\nFAILURES"); for(const f of fail) console.error(" -",f); process.exit(1); }
console.log("\nPASS: build outputs, syntax, API routing and systemic invariants are consistent.");
