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
ok(/body::before,body::after\{display:none!important\}/.test(sourceCss),"Full-screen haze/noise overlays are active again");
ok(/html\[data-weather\] #wxLayer\{opacity:\.55\}/.test(sourceCss),"Weather wash must stay subtle (Erica chose subtle weather, Oct 6)");
ok(/JEWEL-TONE WORLD PASS/.test(sourceCss),"Crisp jewel-tone auto background invariant is missing");

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
ok(/id="riteX" aria-label="Exit ritual"/.test(source),"Ritual exit control is mislabeled as Back");
ok(/<button class="btn btn-ghost" id="prevBtn">Back<\/button>/.test(source),"Ritual steps do not always expose Back navigation");
ok(/Back to last step/.test(source),"Ritual completion cannot return to the last step");
ok(/S\.friendCode=fq\.slice\(0,60\);saveLocal\(\);history\.replaceState/.test(source),"Invitation code is not persisted before it is removed from the URL");
ok(/verifyOtp[\s\S]{0,700}!ACCT\.user\|\|ACCT\.user\.id!==out\.data\.session\.user\.id/.test(source),"OTP completion can run account sync twice");
ok(/function\s+shareLimit\([\s\S]{0,260}cohort===["']friends["']\?3:[\s\S]{0,120}cohort===["']shared["']\?1:0/.test(source),"Invitation sharing generations are not enforced as friends=3, shared=1, shared2=0");
const friendServer=read("server/friend.js");
ok(/invite_uses\?code=eq\./.test(friendServer)&&/function\s+grantClaim/.test(friendServer),"Invitation claims are not retry-safe");


/* Every rendered button action must have a matching delegated handler. This catches
   dead controls across the whole app, including newly added guardians, trackers and sheets. */
const actionAttrs=new Set([...source.matchAll(/<button\b[^>]*\bdata-([a-z][a-z0-9-]*)=/g)].map(m=>m[1]));
const camel=s=>s.replace(/-([a-z])/g,(_,x)=>x.toUpperCase());
for(const a of actionAttrs){
  const k=camel(a);
  const handled=source.includes("d."+k)||
    source.includes("dataset."+k)||
    source.includes('dataset["'+a+'"]')||
    source.includes("dataset['"+a+"']")||
    source.includes('getAttribute("data-'+a+'")')||
    source.includes("getAttribute('data-"+a+"')");
  ok(handled,"Rendered button data-"+a+" has no event handler");
}

ok(/api\(["\']\/api\/auth-code["\']/.test(source)&&/ACCT\.sb\.auth\.verifyOtp/.test(source),"Live email sign-in must use server-delivered Supabase OTP");
ok(/code\.length<6\|\|code\.length>10/.test(source)&&!/8-digit/.test(source),"Email sign-in must accept the project's code length (6 to 10 digits) and never promise a fixed length");
ok(existsSync("server/auth-code.js"),"Server auth-code delivery endpoint is missing");
const authCodeServer=read("server/auth-code.js");
ok(/admin\/generate_link/.test(authCodeServer)&&/email_otp/.test(authCodeServer),"Auth-code endpoint must generate the OTP through Supabase");
ok(/api\.resend\.com\/emails/.test(authCodeServer)&&/RESEND_API_KEY/.test(authCodeServer),"Auth-code endpoint must deliver through Resend");
ok(/auth\/v1\/otp/.test(authCodeServer),"Auth-code endpoint must fall back to Supabase's mailer when RESEND_API_KEY is missing");
ok(/!res\.ok\|\|!sent\.id/.test(authCodeServer),"Auth-code endpoint must not report success unless the mail provider accepts delivery");

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
