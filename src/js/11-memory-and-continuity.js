/* ------------------------------------------------------------------
   MEMORY: so you never have to explain it twice.
------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   CONTINUITY: what worked, what she owns, what Aura carries long-term.
------------------------------------------------------------------ */
const NOUN={candle:"a candle",salt:"salt",broom:"a broom",bowl:"a bowl",thread:"thread",jar:"a jar",mirror:"a mirror",honey:"honey",rosemary:"rosemary",pepper:"black pepper",vinegar:"vinegar",eggs:"eggs",milk:"milk or ink",soil:"seeds or soil",oil:"body oil",stone:"a stone",tea:"tea"};
const ASKN={candle:"candles",salt:"salt",broom:"a broom",bowl:"bowls",thread:"thread or string",jar:"a jar with a lid",mirror:"a mirror",honey:"honey",rosemary:"rosemary or any fresh herb",pepper:"black pepper",vinegar:"vinegar",eggs:"eggs",milk:"milk or ink",soil:"seeds or soil",oil:"body oil or lotion",stone:"a stone",tea:"tea"};
const SUBS={
  candle:{alt:[],text:"a lamp or your phone's flashlight"},
  salt:{alt:[],text:"a pinch of sugar or baking soda"},
  broom:{alt:[],text:"your open hand"},
  bowl:{alt:["jar"],text:"a mug or a glass"},
  thread:{alt:[],text:"a hair tie, a ribbon or a shoelace"},
  jar:{alt:["bowl"],text:"a mug with a saucer on top, or a zip bag"},
  mirror:{alt:[],text:"your phone's front camera or a dark window"},
  honey:{alt:[],text:"sugar, jam or anything sweet"},
  rosemary:{alt:["tea"],text:"any herb or tea bag from your kitchen, or a strip of lemon or orange peel"},
  pepper:{alt:["salt"],text:"any sharp spice, like chili flakes or cinnamon"},
  vinegar:{alt:[],text:"lemon juice"},
  eggs:{alt:["rosemary","salt"],text:"an extra pinch of salt"},
  milk:{alt:["tea"],text:"a drop of coffee or tea"},
  soil:{alt:[],text:"a damp paper towel folded into a cup"},
  oil:{alt:[],text:"any lotion, or a little olive oil"},
  stone:{alt:[],text:"a coin or any small, heavy object"},
  tea:{alt:[],text:"hot water with a slice of lemon"}
};
const KEYS={candle:["candle","tea light","light it","light a"],salt:["salt"],broom:["broom"],bowl:["bowl"],thread:["thread","string"],jar:["jar"],mirror:["mirror"],honey:["honey"],rosemary:["rosemary","herb"],pepper:["pepper"],vinegar:["vinegar"],eggs:["eggshell"],milk:["milk","ink"],soil:["soil","seed"],oil:["oil","lotion"],stone:["stone"],tea:["tea"]};
function known(){return S.profile.known||(S.profile.known=[...S.profile.have]);}
function missingFor(r){return (r.needs||[]).filter(n=>SUBS[n[0]]&&known().includes(n[0])&&!S.profile.have.includes(n[0]));}
function unknownFor(r){return (r.needs||[]).filter(n=>SUBS[n[0]]&&!known().includes(n[0])&&!S.profile.have.includes(n[0]));}
function adapt(r){
  const miss=missingFor(r).map(n=>n[0]); if(!miss.length)return {...r,notes:[]};
  const notes=miss.map(t=>{const n=NOUN[t].replace(/^an? /,""),sb=subFor(t);return sb?"No "+n+"? Use "+sb+".":"No "+n+"? Skip that part. The ritual still works without it.";});
  const steps=r.steps.map(s=>{
    let d=s.d;const lo=d.toLowerCase();
    for(const t of miss)if((KEYS[t]||[]).some(k=>lo.includes(k))&&!lo.includes("no "+NOUN[t].replace(/^an? /,""))){const sb=subFor(t);d+=sb?" (No "+NOUN[t].replace(/^an? /,"")+"? Use "+sb+" instead.)":" (No "+NOUN[t].replace(/^an? /,"")+"? Skip it. The step still works.)";}
    return {...s,d};
  });
  return {...r,steps,notes};
}
function setOwned(tag,yes){
  const p=S.profile;known();
  if(!p.known.includes(tag))p.known.push(tag);
  if(yes){if(!p.have.includes(tag))p.have.push(tag);}else p.have=p.have.filter(x=>x!==tag);
  persist("profile");
}

/* What worked: outcomes she tapped after each ritual */
const GOOD=["Lighter","Clearer","Powerful"];
function outcomes(){
  const by={};
  for(const e of S.entries){if(!e.after||!e.ritualId)continue;const o=by[e.ritualId]=by[e.ritualId]||{good:0,same:0,stirred:0,tender:0,n:0,title:e.ritualTitle,g:e.guardian};
    o.n++;if(GOOD.includes(e.after))o.good++;else if(e.after==="The same")o.same++;else if(e.after==="Stirred up")o.stirred++;else if(e.after==="Tender")o.tender++;}
  return by;
}
function outcomeBonus(id){const o=outcomes()[id];if(!o)return 0;return o.good*1.2-o.same*1.5-o.stirred*.4;}
function workedText(){
  const by=outcomes(), rows=Object.entries(by);
  if(!rows.length)return "No outcomes recorded yet.";
  const helped=rows.filter(([,o])=>o.good).sort((a,b)=>b[1].good-a[1].good).slice(0,6).map(([id,o])=>o.title+" ("+G[o.g].name+") left her better "+o.good+" of "+o.n+" times");
  const flat=rows.filter(([,o])=>o.same>=1&&!o.good).slice(0,5).map(([id,o])=>o.title+" did not move it ("+o.same+"x the same)");
  const stir=rows.filter(([,o])=>o.stirred>=1).slice(0,4).map(([id,o])=>o.title+" left her stirred up "+o.stirred+"x");
  return ["HELPED: "+(helped.join("; ")||"none yet"),"DID NOT MOVE IT: "+(flat.join("; ")||"none"),"STIRRED HER UP: "+(stir.join("; ")||"none")].join("\n");
}

/* Aura's ledger: durable long-term memory, rewritten after each ritual and chat */
const LEDGER_KEYS=[["people","People in your life"],["situations","What you're going through"],["boundaries","Boundaries you set"],["commitments","Things you said you'd do"],["intentions","Your goals"],["helped","What helps you"],["didnt","What doesn't help"],["threads","Still unresolved"]];
function ledger(){if(!S.ledger){S.ledger={};for(const [k] of LEDGER_KEYS)S.ledger[k]=[];}return S.ledger;}
function ledgerText(){if(!memOn())return "(she turned memory off; do not refer to her past)";const L=ledger();let t=LEDGER_KEYS.filter(([k])=>(L[k]||[]).length).map(([k,l])=>l+": "+L[k].join(" | ")).join("\n");const n=(S.memNotes||[]).map(x=>x.text);if(n.length)t+=(t?"\n":"")+"Things she asked Aura to remember: "+n.join(" | ");return t||"(empty so far)";}
/* MEMORY CONSENT. She decides what Aura keeps. Off means Aura keeps no long-term memory and
   doesn't bring up her past; her Archive stays hers either way. */
function memOn(){return S.profile.memory!=="off";}
if(!S.asks)S.asks=[];if(!S.memNotes)S.memNotes=[];if(!S.forgotThreads)S.forgotThreads=[];
function setMemory(on){S.profile.memory=on?"on":"off";persist("profile");persistAll();}
function allThreads(){const c={};for(const e of S.entries)if(usable(e)&&e.thread)c[e.thread]=(c[e.thread]||0)+1;for(const a of S.asks)if(!a.noMem&&a.thread)c[a.thread]=(c[a.thread]||0)+1;return Object.entries(c).filter(([t])=>!S.forgotThreads.includes(t)).sort((a,b)=>b[1]-a[1]);}
function forgetThread(t){
  for(const e of S.entries)if(e.thread===t){e.private=true;remotePut("entry",e.id,e);}
  for(const a of S.asks)if(a.thread===t){a.noMem=true;a.text="";}
  const L=ledger(),tl=t.toLowerCase();for(const [k] of LEDGER_KEYS)if(L[k])L[k]=L[k].filter(x=>!String(x).toLowerCase().includes(tl));
  if(S.ledgerKeep)S.ledgerKeep=S.ledgerKeep.filter(x=>!String(x).toLowerCase().includes(tl));
  if(!S.forgotThreads.includes(t))S.forgotThreads.push(t);persistAll();
}
function openMemory(){
  const L=ledger(),rows=LEDGER_KEYS.filter(([k])=>(L[k]||[]).length),th=allThreads().slice(0,12),on=memOn();
  openSheet('<div class="stack"><div class="popseal">'+glyph("aura",56)+'</div>'+auraSays("I remember the people, goals, patterns and moments you share, so you never have to explain yourself twice. You decide what I keep. Nobody else sees any of it.","Aura · what I remember")+
    '<div class="chips"><button class="chip" data-mem="on" aria-pressed="'+on+'">Remember what I share</button><button class="chip" data-mem="off" aria-pressed="'+!on+'">Don\'t remember anything</button></div>'+
    (on?'<div class="card"><div class="label">Tell me something to remember</div><div class="addrow"><label class="sr" for="memIn">Something to remember</label><input type="text" id="memIn" placeholder="My sister\'s name is Tasha."><button class="btn btn-ghost" id="memAdd">Remember this</button></div>'+
      ((S.memNotes||[]).length?'<div class="ledg">'+S.memNotes.map(n=>'<div class="li"><span>'+esc(n.text)+'</span><button class="x2" data-memnote="'+esc(n.id)+'" aria-label="Forget this">×</button></div>').join("")+'</div>':'')+'</div>':'')+
    (on&&rows.length?'<div class="card"><div class="label">What I carry for you</div><p class="small muted" style="margin-top:4px">Keep what matters, correct what I got wrong, or forget it.</p>'+rows.map(([k,l])=>'<div class="ledg"><div class="lk">'+esc(l)+'</div>'+L[k].map((it,i)=>ledgerItemHTML(k,i,it)).join("")+'</div>').join("")+'</div>':'')+
    (on&&th.length?'<div class="card"><div class="label">The threads I follow</div><p class="small muted" style="margin-top:4px">Forget a thread and I stop bringing it up. Your own entries stay in your Archive, marked private.</p>'+th.map(([t,n])=>'<div class="li"><span>'+esc(t)+' <span class="muted small">· '+n+'</span></span><button class="chip" data-forgetthread="'+esc(t)+'">Forget this thread</button></div>').join("")+'</div>':'')+
    (on?'<div class="card"><div class="label">Your preferences</div><p class="small" style="margin-top:6px">You usually have '+S.profile.minutes+' minutes. You like language that is '+esc(S.profile.tone||"balanced")+'.'+(S.profile.person?' On your heart: your '+esc(S.profile.person.mode)+(S.profile.person.name?' '+esc(S.profile.person.name):'')+'.':'')+'</p><button class="linkish" id="openSettings2" style="margin-top:6px">Change in Settings</button></div>':'')+
    (on&&resetProgress().done.length?'<div class="card"><div class="label">Active journeys</div><p class="small" style="margin-top:6px">The 7-Day Energy Reset · '+resetProgress().done.length+' of 7 done</p></div>':'')+
    (!on?'<p class="small muted">Memory is off. I won\'t keep anything new or bring up your past. Your Archive is still yours in the Archive tab.</p>':'')+'</div>');
}
let ledgerBusy=false;
async function updateLedger(material){
  if(ledgerBusy||!memOn())return;
  if(MODE==="artifact"){const s=await getSample();if(!s)return;} else if(!ACCT.user)return;
  ledgerBusy=true;
  try{
    const prompt="You maintain the long-term memory ledger for a ritual app user so she never has to explain herself twice.\n"+
      "Today is "+today.toDateString()+".\nCURRENT LEDGER (JSON):\n"+JSON.stringify(ledger())+"\n\nNEW MATERIAL:\n"+material+"\n\n"+
      ((S.forgotThreads||[]).length?"FORGOTTEN (she asked you to forget these; never add them back in any form): "+S.forgotThreads.join(" | ")+"\n":"")+(S.ledgerKeep&&S.ledgerKeep.length?"KEPT ITEMS (she asked you to keep these exactly; never remove or reword them): "+S.ledgerKeep.join(" | ")+"\n":"")+"Update the ledger with anything durable from the new material: people (name or role plus what's going on with them), ongoing situations, boundaries she set, things she said she would do, intentions and goals, what helps her, what doesn't, and unresolved threads. "+
      "Merge duplicates, keep the most recent detail, add a short date like 'Sep 29' to new items, remove threads that are clearly resolved. Max 8 items per key, each under 140 characters, plain words, no em dashes. Never store health diagnoses, sexual details, crime, or ID or financial numbers. Only record what she actually said or did.\n"+
      'Reply with ONLY JSON with exactly these keys, each an array of strings: {"people":[],"situations":[],"boundaries":[],"commitments":[],"intentions":[],"helped":[],"didnt":[],"threads":[]}';
    let out;
    if(MODE==="artifact"){const s=await getSample();out=await s.json(prompt,{modelTier:"quick"});}
    else{const r=await api("/api/ai",{kind:"memory",messages:[{role:"user",content:prompt}]});if(r.error)throw r;out=extractJSON(r.text);}
    if(out&&typeof out==="object"){const L=ledger();for(const [k] of LEDGER_KEYS)if(Array.isArray(out[k]))L[k]=out[k].slice(0,8).map(x=>clean(String(x)).slice(0,160));L.updated=Date.now();saveLocal();remotePut("prefs");if(!$("#v-archive").hidden)renderArchive();}
  }catch(e){}
  ledgerBusy=false;
}
function keptSet(){return new Set(S.ledgerKeep||[]);}
function ledgerItemHTML(k,i,it){const kept=keptSet().has(it);return '<div class="li" data-li="'+k+':'+i+'"><span>'+(kept?'<b style="color:var(--gold)">✦</b> ':'')+esc(it)+'</span><span class="row" style="gap:4px;flex-wrap:nowrap"><button class="chip sm" data-keep="'+k+':'+i+'" aria-pressed="'+kept+'">'+(kept?"Kept":"Keep")+'</button><button class="chip sm" data-correct="'+k+':'+i+'">Correct</button><button class="x2" data-forget="'+k+':'+i+'" aria-label="Forget this">×</button></span></div>';}
function forgetLedger(k,i){const L=ledger();if(L[k]){const gone=L[k].splice(i,1)[0];if(gone!=null&&S.ledgerKeep)S.ledgerKeep=S.ledgerKeep.filter(x=>x!==gone);saveLocal();remotePut("prefs");}}

/* Continuity: more history for semantic matching by Aura */
/* Only the most relevant history goes to Aura: what shares words with what she just said, then the most recent. */
function historyText(q){
  const words=new Set(String(q||"").toLowerCase().match(/[a-z']{4,}/g)||[]);
  const all=S.entries.filter(usable);
  const score=e=>{const t=((e.carrying||"")+" "+(e.text||"")+" "+(e.thread||"")).toLowerCase();let n=0;for(const w of words)if(t.includes(w))n++;return n;};
  const rel=words.size?all.map(e=>[e,score(e)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,10).map(x=>x[0]):[];
  const pick=[...rel,...all.filter(e=>!rel.includes(e)).slice(0,20-rel.length)].sort((a,b)=>b.ts-a.ts);
  return pick.map(e=>"- id "+e.id+" | "+fmtDate(e.ts)+" | "+(G[e.guardian]||G.aura).name+" | "+(e.ritualTitle||"")+" | theme "+(e.theme||"")+" | carrying: "+(e.carrying||"").slice(0,110)+" | wrote: "+(e.text||"").slice(0,160)+(e.after?" | after: "+e.after:"")).join("\n")||"(no entries yet)";
}
function ritualsToday(){const k=dayKey(new Date());return S.entries.filter(e=>dayKey(new Date(e.ts))===k&&e.ritualId).length;}

/* The 7-Day Reset: seven sessions, gentle rhythm, no expiration */
function resetProgress(){
  const rs=S.entries.filter(e=>e.resetDay).sort((a,b)=>a.ts-b.ts);
  let cur=new Set(),rounds=0,last=null;
  for(const e of rs){cur.add(e.resetDay);last=e.ts;if(cur.size>=7){rounds++;cur=new Set();}}
  return {done:[...cur],rounds,last};
}

/* Export and delete */
async function exportArchive(){
  if(typeof cycleSync==="function")await cycleSync();
  const data=JSON.stringify({app:"The Daily Alchemist",exported:new Date().toISOString(),profile:S.profile,entries:S.entries,chats:S.chats,ledger:S.ledger||{},days:S.days||{},asks:S.asks||[],promises:S.promises||[],cycle:{mode:C.mode,irregular:C.irregular,consent:C.consent,events:C.events}},null,2);
  const filename="daily-alchemist-archive-"+new Date().toISOString().slice(0,10)+".json";
  if(MODE==="artifact"){
    try{const dl=await window.claude.use("downloads");if(!dl){toast("Export isn't available in this view.");return;}await dl.save({filename,data});}catch(e){if(!e||e.code!=="declined")toast("Export didn't finish. Try again.");}
    return;
  }
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
async function clearMyData(){
  if(MODE==="artifact"&&cloud.on){try{const snap=await col().get();for(const d of snap.docs)await col().doc(d.id).delete();}catch(e){}}
  if(MODE==="web"&&ACCT.user){const r=await api("/api/delete",{scope:"data"});if(!r||r.error){toast("Couldn't clear your data. Try again.");return false;}}
  const keep=S.profile||{},snd={prefMusic:S.prefMusic,prefMusicVol:S.prefMusicVol,prefVoiceOff:S.prefVoiceOff,prefVoice:S.prefVoice};
  try{localStorage.removeItem(KEY);localStorage.removeItem(CYC_KEY);}catch(e){}
  if(typeof cycleReset==="function")cycleReset();
  S={profile:{name:"",minutes:10,have:[],known:[],tone:"balanced",onboarded:false,adult:keep.adult,adult21:keep.adult21,under21:keep.under21},entries:[],draws:{},chats:{},usage:S.usage||{},...snd,seenIntro:true};
  saveLocal();return true;
}
async function deleteEverything(){
  if(MODE==="artifact"&&cloud.on){try{const snap=await col().get();for(const d of snap.docs)await col().doc(d.id).delete();}catch(e){}}
  if(MODE==="web"&&ACCT.user){const r=await api("/api/delete",{});if(r.error){toast("Couldn't delete your account. Try again, or email support.");return false;}try{await ACCT.sb.auth.signOut();}catch(e){}}
  try{localStorage.removeItem(KEY);localStorage.removeItem(CYC_KEY);}catch(e){}
  if(typeof cycleReset==="function")cycleReset();
  return true;
}

const STOP=new Set("that this with have from they them what when were been just like really feel feeling about into your mine then than there their would could should because again still even today tonight here very much some more most over only also dont didnt cant wont keep keeps being make made know want need thing things something".split(" "));
function words(t){return [...new Set(String(t||"").toLowerCase().replace(/[^a-z\s']/g," ").split(/\s+/).filter(w=>w.length>3&&!STOP.has(w)).map(w=>w.replace(/(ing|ed|es|s)$/,"")))];}
function similarEntry(text){
  const a=words(text); if(a.length<2)return null;
  let best=null,bs=0;
  for(const e of S.entries){
    if(e.private||Date.now()-e.ts<20*3600e3)continue;
    const b=words((e.carrying||"")+" "+(e.text||"")); if(!b.length)continue;
    const shared=a.filter(w=>b.includes(w)).length;
    const sc=shared/Math.sqrt(a.length*b.length);
    if(shared>=2&&sc>bs){bs=sc;best=e;}
  }
  return bs>=0.22?best:null;
}
function habit(){
  const c={};for(const e of S.entries)if(e.theme&&e.theme!=="reset")c[e.theme]=(c[e.theme]||0)+1;
  const top=Object.entries(c).sort((x,y)=>y[1]-x[1])[0];
  return top&&top[1]>=3?{theme:top[0],count:top[1],total:S.entries.length}:null;
}
function doneRecently(id,days){return S.entries.some(e=>e.ritualId===id&&Date.now()-e.ts<days*864e5);}
function quoteOf(e){const t=(e.text||"").trim();if(!t)return "";const sent=t.split(/(?<=[.!?])\s+/).sort((x,y)=>y.length-x.length)[0]||t;return sent.length>180?sent.slice(0,177)+"...":sent;}
function memoryBrief(text){
  const month=recentThemes(30), m=similarEntry(text), h=habit();
  const chatLines=[];for(const k of ALL){const l=(S.chats[k]||[]).filter(x=>x.role==="me").slice(-2);for(const x of l)chatLines.push("- to "+G[k].name+": "+x.text.slice(0,140));}
  return {month,match:m,habit:h,
    text:"THEMES SHE BROUGHT IN THE LAST 30 DAYS: "+(Object.entries(month).map(([k,v])=>k+" x"+v).join(", ")||"none yet")+"\n"+
    "HER USUAL PATTERN: "+(h?"she reaches for "+h.theme+" most ("+h.count+" of "+h.total+" rituals)":"not enough history yet")+"\n"+
    "MOST SIMILAR PAST MOMENT: "+(m?"id "+m.id+" | "+fmtDate(m.ts)+" | "+(m.moon||"")+" | after "+m.ritualTitle+" with "+(G[m.guardian]||G.aura).name+" | she was carrying: "+(m.carrying||"").slice(0,160)+" | she wrote: "+(m.text||"").slice(0,300):"none")+"\n"+
    "RITUALS DONE IN THE LAST 14 DAYS: "+([...new Set(S.entries.filter(e=>Date.now()-e.ts<14*864e5&&e.ritualId).map(e=>e.ritualId))].join(", ")||"none")+"\n"+
    "THINGS SHE TOLD GUARDIANS RECENTLY:\n"+(chatLines.slice(-8).join("\n")||"(nothing yet)")};
}
function yourGuardians(){
  const c={};for(const e of S.entries)if(e.guardian&&e.guardian!=="aura")c[e.guardian]=(c[e.guardian]||0)+1;
  for(const k of ALL){const n=(S.chats[k]||[]).filter(m=>m.role==="me").length;if(n&&k!=="aura")c[k]=(c[k]||0)+Math.ceil(n/3);}
  return Object.entries(c).filter(x=>x[1]>=2).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);
}
const LOCAL_VOICE={sage:"Tonight isn't asking you to understand it again. It's asking you to discharge it.",onyx:"You already know what this is about. Let's stop protecting it.",fern:"You have been holding the whole tide up by yourself. Put it down for a few minutes.",lily:"Your mind is loud because it's trying to keep you safe. Give it one clear thing to do.",thistle:"This doesn't make you mean. It makes you someone with an edge.",marigold:"You have been giving everyone the good version of you. Your turn.",juniper:"The space is holding what happened in it. Let's reset the container.",rue:"Not everyone gets access. We're changing the locks.",sol:"Stuck is just a plan without a date. Let's give it one, and I'll hold you to it.",
  poppy:"Your spark isn't gone. It's bored. Let's play.",aurora:"Something is trying to become clear. Let's give it some light.",rowan:"Your body is holding what your head keeps replaying. Let's move it through.",iris:"Your body has a rhythm worth noticing. Let's work with what it is actually doing today.",willow:"You can be soft here. Let's give the grief somewhere to go.",vesper:"What you want is information. Let's listen to it, slowly.",wren:"You've been noticing things. Let's find out what they mean.",lumen:"You can already see it. Now let's name it.",onora:"You come from people. Let's call them in."};

const GSPEC={
 aura:{sig:"unclear, mixed or first time feelings",avoid:"never when one guardian clearly fits",next:"the guardian who fits",mem:"everything, especially open threads"},
 onyx:{sig:"guilt, shame, regret, lying, hiding, something she did wrong, the same pattern again",avoid:"fresh grief, panic, crisis, or when she is already punishing herself hard",next:"Willow to forgive herself once it's owned; Thistle if the repair needs a boundary",mem:"what she has avoided saying, repeating patterns, past amends"},
 sage:{sig:"anger, resentment, betrayal, feeling disrespected, fear, courage, big leaps, quitting, confronting, endings, starting over",avoid:"when the anger has already been released and the issue is still there (then it's a boundary or a decision, not more fire); when she is exhausted or the leap isn't hers to take yet",next:"Thistle for the boundary, Sol to plan the leap or the next step",mem:"who keeps lighting it, what release has and hasn't worked, the leaps she's named and what stopped her"},
 fern:{sig:"exhaustion, overwhelm, crying, burnout, low tank",avoid:"when she needs to act, not rest; when rest has become avoidance",next:"Sol when rest has been had and it's time to move",mem:"sleep and energy check ins, how often she runs empty"},
 lily:{sig:"anxiety, racing thoughts, overthinking, panic, can't think",avoid:"when the worry is about a real decision that needs making",next:"Aurora or Sol to decide once she can think",mem:"what calms her fastest, what the worry keeps circling"},
 thistle:{sig:"boundaries, people pleasing, family guilt, being taken advantage of, saying no",avoid:"when she is the one who did harm (that's Onyx)",next:"Sol to follow through on the boundary, Rue if someone keeps pushing",mem:"the people involved, boundaries she has set and whether they held"},
 marigold:{sig:"worth, confidence, joy, money, love, dating, a partner or crush",avoid:"grief or shame (don't brighten over it)",next:"Vesper for desire and intimacy (21+ members only), Onyx if it's really shame",mem:"her person, what makes her feel good, money stories"},
 juniper:{sig:"home, space, clutter, moving, stillness, can't slow down",avoid:"when the heaviness is in a relationship, not the room",next:"Fern for deeper rest",mem:"her spaces and what she said about each"},
 rue:{sig:"toxic people, envy, gossip, feeling targeted, protection",avoid:"when she is the one stirring it (that's Onyx)",next:"Thistle for the boundary",mem:"who she needs protecting from"},
 sol:{sig:"accountability, procrastination, stuck, goals, plans, follow through, nerves before a big day, momentum",avoid:"when she is depleted or grieving (rest first)",next:"Fern if she is running empty, Sage for a big leap",mem:"her open promises, what she said she'd do and didn't, her wins"},
 aurora:{sig:"decisions, confusion, new beginnings, mornings, clarity",avoid:"when she already knows and is avoiding (that's Onyx or Sol)",next:"Sol to act on the decision",mem:"decisions she's circling, how she felt each morning"},
 rowan:{sig:"movement, exercise, restless body, stiff, sitting all day, wanting to feel in her body",avoid:"injury, illness or a very low tank (then Fern)",next:"Sol to make movement a habit",mem:"midday movement check ins, what kinds of movement she likes"},
 iris:{sig:"periods, cycle, cramps, PMS feelings, perimenopause, menopause, body rhythm, energy that rises and falls with her cycle",avoid:"never as the explanation for a real problem; if a work, relationship or grief situation is active, that stays the issue and Iris only adds body context",next:"Fern for rest, the guardian who owns the real situation",mem:"her own logged patterns only, never a 28 day template"},
 willow:{sig:"grief, loss, death, forgiveness, missing someone",avoid:"rushing to fix or reframe; never hype",next:"Onora to honor the person, Onyx only if guilt is underneath",mem:"who she lost, dates that matter, anniversaries"},
 vesper:{sig:"desire, sex, intimacy, pleasure, libido, sex magic",avoid:"anyone not 21+ and a member; pain, pressure or harm (care first, then Willow or a real person)",next:"Marigold for love and dating",mem:"her person (partner or crush), what she wants more of"},
 wren:{sig:"signs, dreams, coincidences, repeating numbers",avoid:"when the sign is a way to avoid deciding",next:"Aurora to decide what it means for her",mem:"signs and dreams she has logged"},
 lumen:{sig:"vision, goals, the future, manifesting",avoid:"when she needs a next step today (Sol)",next:"Sol to put a date on it",mem:"the future she has described"},
 onora:{sig:"ancestors, family history, heritage, a grandparent",avoid:"fresh grief (Willow first)",next:"Willow if grief opens",mem:"the people she comes from and what she carries from them"},
 poppy:{sig:"creativity, art, writing, blocked, wanting to make something",avoid:"when the block is fear of judgment (Sage) or exhaustion (Fern)",next:"Sol to finish it",mem:"her projects and what she keeps not finishing"}
};
const SHORT={poppy:"your muse",thistle:"your boundary keeper",onyx:"your shadow mirror",sage:"your fire keeper",fern:"keeper of your rest and tides",lily:"the one who clears your head",marigold:"keeper of your glow",juniper:"keeper of your space",rue:"your protection",sol:"your accountability coach",aurora:"your first light",rowan:"your movement keeper",iris:"keeper of your body's rhythm",willow:"keeper of your grief",vesper:"keeper of your desire",wren:"your sign reader",lumen:"keeper of your vision",onora:"keeper of your ancestors"};
/* Each guardian's job, in plain words, so the circle is useful and not just mythology. */
const JOB={aura:"Your guide. Hears what happened and sends you to the right help.",onyx:"Shadow work. The things you did wrong, owning them and making it right.",sage:"Anger and courage. Turning fury into protection, and fear into the leap.",fern:"Rest and overwhelm. When you're running on empty.",lily:"Anxiety and overthinking. Getting your head clear.",thistle:"Boundaries. Saying no, people pleasing, protecting your peace.",marigold:"Love and worth. Romance, dating, self love, confidence and joy.",juniper:"Your home and your stillness. Resetting your space and slowing down when you can't stop.",rue:"Protection. Toxic people, envy and energy that isn't yours.",sol:"Accountability. Keeps you on track, hypes you up and holds you to what you said.",aurora:"New beginnings and clarity. Decisions and fresh starts.",rowan:"Movement. Exercise, getting back in your body, nerves and keeping momentum.",iris:"Your cycle. Periods, body rhythms, perimenopause and menopause, tracked privately.",willow:"Grief. Loss, forgiveness and letting yourself feel it.",vesper:"Desire and intimacy. Pleasure, sex and sex magic. Members 21 and older.",wren:"Signs. Dreams, coincidences and what they might mean.",lumen:"Vision. Goals and the future you're building.",onora:"Family and ancestry. Where you come from and what you carry.",poppy:"Creativity. Getting unblocked and making things again."};
/* Which guardians keep showing up, and when: the seasons of her life, read from her history. */
function guardianSeasons(){
  const items=[...S.entries.filter(usable).map(e=>({g:e.guardian,ts:e.ts})),...S.asks.filter(a=>!a.noMem).map(a=>({g:a.guardian,ts:a.ts}))].filter(x=>x.g&&x.g!=="aura");
  if(items.length<3)return null;
  const month=ts=>new Date(ts).toLocaleDateString(undefined,{month:"long"}),by={};
  for(const x of items){const m=month(x.ts);(by[m]=by[m]||{})[x.g]=((by[m]||{})[x.g]||0)+1;}
  const now=month(Date.now()),top=o=>Object.entries(o||{}).sort((a,b)=>b[1]-a[1])[0];
  const cur=top(by[now]),lines=[];
  if(cur&&cur[1]>=2)lines.push(G[cur[0]].name+" keeps showing up this "+now+": "+cur[1]+" times. "+JOB[cur[0]].split(".")[0]+" is your season right now.");
  for(const m of Object.keys(by).filter(m=>m!==now).slice(-2)){const t=top(by[m]);if(t&&t[1]>=2)lines.push("In "+m+" it was mostly "+G[t[0]].name+".");}
  return lines.length?lines:null;
}
function metCount(k){return (S.met&&S.met[k]||0)+S.entries.filter(e=>e.guardian===k).length+((S.chats[k]||[]).length?1:0);}
function introFor(k){
  if(k==="aura")return "";
  const g=G[k], d=g.domain.replace(/\.$/,""), first=metCount(k)===0;
  if(first)return "You haven't met "+g.name+" yet. "+g.name+" is "+g.title+", the one for "+d.charAt(0).toLowerCase()+d.slice(1)+". "+g.voice;
  return g.name+" is "+(SHORT[k]||"one of the circle")+".";
}
function markMet(k){if(!S.met)S.met={};S.met[k]=(S.met[k]||0)+1;saveLocal();}
let EXCLUDE=null;
/* A keyword counts only as a whole word ("mom" is not in "momentum"); long keywords like
   "boundar" or "procrastinat" also match their endings. */
const kwRe={};
function hasWord(t,w){const re=kwRe[w]||(kwRe[w]=new RegExp("(^|[^a-z])"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+(w.length>=6?"":"(?![a-z])")));return re.test(t);}
function localRead(text,mins){
  const t=" "+text.toLowerCase()+" ";let best="aura",bs=0;
  for(const k of [...ORDER,...EXP]){if(EXCLUDE&&EXCLUDE===k)continue;if(!allowedG(k))continue;let s=0;for(const w of (KW[k]||[]))if(hasWord(t,w))s++;
    for(const r of R)if(r.g===k)for(const tg of r.tags)if(hasWord(t,tg))s+=.5;
    if(s>bs){bs=s;best=k;}}
  const pool=R.filter(r=>canUse(r)&&(r.g===best||(best==="aura"&&r.id==="anchor")));
  pool.sort((a,b)=>score(b,mins)-score(a,mins)||(b.tags.filter(tg=>t.includes(tg)).length-a.tags.filter(tg=>t.includes(tg)).length));
  const theme=THEME[best], n=(recentThemes(30)[theme]||0);
  const fresh=pool.filter(x=>!doneRecently(x.id,14));
  let r=(n>=1&&fresh.length?fresh:pool)[0]||byId.anchor; if(score(r,mins)<-2)r=byId.anchor;
  const g=G[r.g];
  const match=similarEntry(text);
  const quote=text.trim().split(/\s+/).slice(0,10).join(" ")+(text.trim().split(/\s+/).length>10?"...":"");
  const reading = best==="aura"
    ? "You don't have to know what's wrong to come back to yourself. Start small. I'll be here when it has a name."
    : g.phrases[0]+" "+(LOCAL_VOICE[best]||g.phrases[1]);
  const aura = best==="aura" ? (match?"You've been close to this before. I'll stay with you on this one.":"I'll stay with you on this one.")
    : (n>=2?"You've brought "+theme+" here "+(n+1)+" times this month. "+g.name+" has something different for you tonight."
      : match?"You've been close to this before. That's "+g.name+"'s work."
      : "That's "+g.name+"'s work.");
  const memory = match&&quoteOf(match)?{id:match.id,quote:quoteOf(match),date:fmtDate(match.ts),ritualTitle:match.ritualTitle,moon:match.moon||"",question:"Do you want to work from there, or start fresh?"}:null;
  const why = (quote?'You said <b>"'+esc(quote)+'"</b>. ':"")+"That reads as "+theme+" work, which is "+g.name+"'s domain. "+

    "This one takes "+r.min+" minutes"+(missingFor(r).length?"":" and uses what you have")+".";
  const rest=ritualsToday()>=2&&best!=="rowan"&&!/\britual|\bpractice|\bspell\b/.test(t);
  const pre=localRoute(text);
  if(pre&&pre.action!=="build"&&pre.action!=="answer"){const pr={guardian:pre.guardian,ritual:(pre.guardian&&R.find(z=>z.g===pre.guardian&&canUse(z)))||r,why:"",theme:THEME[pre.guardian]||theme,memory,source:"local",...pre};pr.thread=theme.charAt(0).toUpperCase()+theme.slice(1);return pr;}
  return {thread:theme.charAt(0).toUpperCase()+theme.slice(1),action:rest?"rest":"ritual",guardian:r.g==="aura"?"aura":best,ritual:r,reading:rest?"You've already done "+ritualsToday()+" rituals today. That's enough. Let it work.":reading,why,theme,aura,memory,source:"local"};
}
/* Every time she tells Aura something, it's logged (unless she says not to remember it), so Aura
   can see patterns, follow up, and answer from her history later. */
function logAsk(text,x){
  const a={id:uid(),ts:Date.now(),text:memOn()?String(text).slice(0,400):"",thread:x.thread||"",theme:x.theme||"",guardian:x.guardian||"aura",action:x.action||"ritual",ritualId:x.ritual&&!x.ritual.composed?x.ritual.id:null,ritualTitle:x.ritual?x.ritual.title:"",noMem:!memOn(),follow:null,tomorrow:x.tomorrow||""};
  S.asks.unshift(a);S.asks=S.asks.slice(0,200);persistAll();return a;
}
function asksText(){return S.asks.filter(a=>!a.noMem&&a.text).slice(0,12).map(a=>"- "+fmtDate(a.ts)+" | "+(a.thread||a.theme)+" | "+G[a.guardian].name+" | said: "+a.text.slice(0,140)+(a.follow?" | afterwards: "+(a.follow.did===false?"didn't do it":a.follow.helped||"did it")+(a.follow.changed?", "+a.follow.changed.slice(0,100):""):"")).join("\n")||"(nothing yet)";}
function pendingFollow(){
  const now=Date.now();
  return S.asks.find(a=>!a.follow&&!a.fuDismiss&&["ritual","write","talk","event","build","decide"].includes(a.action)&&now-a.ts>6*3600e3&&now-a.ts<5*864e5&&(!a.fuSnooze||a.fuSnooze<now)&&!(a.sitSnooze&&a.sitSnooze>now)&&!a.settled)||null;
}
function followHTML(){
  const a=pendingFollow();if(!a)return "";
  const did=a.did&&S.entries.find(e=>e.id===a.did), when=Date.now()-a.ts<36*3600e3?"Yesterday":"On "+new Date(a.ts).toLocaleDateString(undefined,{weekday:"long"}), g=G[a.guardian]||G.aura;
  const said=a.tomorrow?" we left this unresolved. I said I'd ask "+esc(a.tomorrow.replace(/^(I'll ask|ask)( you)? ?/i,""))+".":a.text?' you told me "'+esc(a.text.length>90?a.text.slice(0,90)+"...":a.text)+'".':" we talked.";
  const q=a.tomorrow?" Is it still bothering you?":did?" You did "+esc(did.ritualTitle)+". Did it help?":a.ritualTitle&&a.action!=="talk"?" I suggested "+esc(a.ritualTitle)+" with "+esc(g.name)+". Did you get to it?":" Did anything shift?";
  const btns=a.tomorrow||did||!a.ritualTitle||a.action==="talk"?[["helped","I feel better"],["still","Still bothering me"],["happened","Something happened"]]:[["did","I did it"],["notyet","Not yet"],["letgo","Let it go"]];
  return '<div class="card checkin" id="fuCard" data-fuid="'+a.id+'"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura, following up</span>'+when+said+q+'</p></div><div class="row" style="margin-top:10px" id="fuBtns">'+btns.map(b=>'<button class="chip" data-fu="'+b[0]+'">'+b[1]+'</button>').join("")+'</div><div id="fuMore"></div></div>';
}
function followStep2(a,picked){
  const box=$("#fuMore");if(!box)return;$("#fuBtns").innerHTML='<span class="small muted">'+esc(picked)+'</span>';
  box.innerHTML='<div class="composer" style="margin-top:10px"><label class="sr" for="fuText">What changed?</label><textarea id="fuText" placeholder="What changed? One line is plenty."></textarea>'+micBtn("fuText")+'</div><p class="small" style="margin-top:10px">Want me to carry this forward?</p><div class="row" style="margin-top:6px"><button class="btn btn-main" data-fusave="carry">Yes, keep it with me</button><button class="btn btn-ghost" data-fusave="rest">Let it rest</button></div>';
}
/* When it's still bothering her, Aura uses judgment instead of handing out another ritual. */
function stillBothering(a){
  a.follow={did:true,helped:"Not really",changed:"",carry:true,ts:Date.now(),still:true};
  const g=a.guardian||"aura",r=a.ritualId&&byId[a.ritualId];
  const released=r&&/release|burn|let go|cut|banish|cleanse|rest|nap|calm|breath/i.test((r.purpose||"")+" "+(r.title||"")+" "+(r.tags||[]).join(" "));
  const theme=a.theme||THEME[g]||"";
  const nextG=okG(/fire|protection|boundar/.test(theme)||["sage","rue","thistle"].includes(g)?"thistle":/grief/.test(theme)||g==="willow"?"willow":/shadow/.test(theme)||g==="onyx"?"onyx":"sol")||"sol";
  const line=released?"Then I don't think you need another release ritual. I think you need to decide what you're going to do about it.":
    nextG==="willow"?"Then let's not push it. Some things need more time and more company.":"Then let's stop circling it. One clear decision will do more than another ritual tonight.";
  if(memOn())updateLedger("Follow up: after "+(a.ritualTitle||"talking")+" about "+(a.thread||a.theme||"this")+", she said it's still bothering her. "+(released?"Release did not resolve it; she needs a decision or boundary, not more release.":"It is unresolved."));
  persistAll();
  const card=$("#fuCard");if(!card)return;
  card.innerHTML='<div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>'+esc(line)+'</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-talk="'+nextG+'">Work it out with '+esc(G[nextG].name)+'</button><button class="btn btn-ghost" id="fuTell">Tell Aura what\'s still there</button></div>';
}
function saveFollow(a,carry){
  const f=a._fu||{};const changed=(($("#fuText")||{}).value||"").trim().slice(0,600);
  a.follow={did:f.did!==false,helped:f.helped||"",changed:memOn()?changed:"",carry:!!carry,ts:Date.now()};
  if(changed&&memOn()){
    const g=a.guardian||"aura",after=f.helped==="It helped"?"Lighter":f.helped==="Not really"?"The same":"";
    const e={kind:"entry",id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),ritualId:a.ritualId,ritualTitle:"Looking back"+(a.ritualTitle?": "+a.ritualTitle:""),guardian:g,theme:a.theme||THEME[g],carrying:a.text||"",text:changed,after,moon:M.name,thread:a.thread||"",followup:true,prompts:["What changed?"]};
    S.entries.unshift(e);remotePut("entry",e.id,e);
  }
  if(carry&&memOn())updateLedger("She asked Aura to keep carrying this thread forward: "+(a.thread||a.theme)+". What she first said: "+(a.text||"")+". What changed since: "+(changed||"(nothing written)")+". How it went: "+(f.helped||(f.did===false?"not done yet":"done")));
  persistAll();track("letter_open",{reason:"followup"});
  toast(carry?"I'll keep it with me.":"Okay. I'll let it rest.");renderToday();
}

function ord(n){return n+(n%10===1&&n!==11?"st":n%10===2&&n!==12?"nd":n%10===3&&n!==13?"rd":"th");}

let sampleFn=null, sampleChecked=false, inflight=null;
async function getSample(){if(sampleChecked)return sampleFn;sampleChecked=true;try{sampleFn=(window.claude&&window.claude.use)?await window.claude.use("sample"):null;}catch(e){sampleFn=null;}return sampleFn;}

/* SAFETY. When someone mentions hurting themselves, hurting someone else, or being hurt,
   Aura answers with love and clear next steps. A word check backs up the AI, so this works
   even offline or past the daily limit. These moments are never tracked or shared. */
const REL="(husband|wife|boyfriend|girlfriend|partner|ex|mom|mother|dad|father|kid|kids|child|children|son|daughter|baby|boss|sister|brother|neighbor|roommate|coworker|friend|family)";
const SAFE_RE={
  self:/\b(kill(ing)? myself|suicid\w*|end (it all|my life)|take my (own )?life|hurt(ing)? myself|self[- ]?harm|cut(ting)? myself|want(ed)? to die|don'?t want to (be alive|live|exist)|better off (dead|without me)|no reason to live|overdose)\b/i,
  others:new RegExp("\\b(kill|hurt|harm|stab|shoot|strangle|choke|poison|attack|beat up)\\s+(him|her|them|someone|somebody|people|everyone|my\\s+"+REL+")\\b|\\bwant\\s+(him|her|them)\\s+(dead|to die)\\b","i"),
  danger:new RegExp("\\b(he|she|they|my\\s+"+REL+")\\s+(hits|hit|beats|beat|chokes|choked|strangled|threatens|threatened|abuses|abused|is abusing|won'?t let me leave)\\s+me\\b|\\b(i'?m|i am)\\s+(not safe|in danger|afraid for my life|scared for my life)\\b|\\babusive\\b","i")};
function safetyKind(t){t=String(t||"");for(const k of ["self","danger","others"])if(SAFE_RE[k].test(t))return k;return null;}
function crisisHit(t){return !!safetyKind(t);}
const SAFE={
  self:{title:"I'm right here with you.",body:"What you just told me matters more than anything else in this app. You don't have to carry this by yourself, and you don't have to explain it perfectly.",
    steps:["Reach a real person now. Call or text <b>988</b>. It's free, private and open all night.","If you might act on it soon, call <b>911</b> or go to the nearest emergency room.","Put some distance between you and anything you could hurt yourself with.","Tell one person you trust what you just told me."],
    btns:[["tel:988","Call 988",1],["sms:988","Text 988"],["tel:911","Call 911"]],reply:"I'm really glad you told me. You matter more than any ritual. Please reach a real person right now: call or text 988, or call 911 if you might act on it soon. I'm right here."},
  others:{title:"Let's keep everyone safe, you too.",body:"That much anger means something real happened, and I'm not judging you for feeling it. Let's make sure nobody gets hurt tonight, including you.",
    steps:["Put space between you and them right now: another room, or outside for a walk.","Call or text <b>988</b>. They help with anger that feels too big, not only with thoughts of suicide.","If someone is in danger right now, call <b>911</b>.","When you're steadier, Sage and I will help you let the fire out safely."],
    btns:[["tel:988","Call 988",1],["sms:988","Text 988"],["tel:911","Call 911"]],reply:"I hear how much this is. I'm not judging you. Before anything else, put some space between you and them, and call or text 988 if it feels too big to hold. If anyone is in danger right now, call 911. I'm still here."},
  danger:{title:"You deserve to be safe.",body:"Thank you for telling me. What's happening to you is not your fault, and you don't have to figure it out alone.",
    steps:["If you're in danger right now, call <b>911</b>.","The National Domestic Violence Hotline is free, private and open all night: call <b>1 800 799 7233</b>, or text <b>START</b> to <b>88788</b>.","If you can, go somewhere safe or be near someone you trust.","If someone checks your phone, you can delete everything in the Archive tab, under Your data is yours."],
    btns:[["tel:911","Call 911",1],["tel:18007997233","Call the hotline"],["sms:88788?&body=START","Text the hotline"]],reply:"Thank you for telling me. What's happening is not your fault, and you deserve to be safe. If you're in danger right now, call 911. The National Domestic Violence Hotline is free and open all night: call 1 800 799 7233 or text START to 88788. I'm right here."}};
const CARE_REPLY=SAFE.self.reply;
function openSafety(kind){
  const x=SAFE[kind]||SAFE.self;
  openSheet('<div class="stack safety"><div class="popseal">'+glyph("aura",64)+'</div><div style="text-align:center"><div class="label">Aura</div><h2>'+x.title+'</h2><p style="margin-top:8px">'+x.body+'</p></div>'+
    '<ol class="safesteps">'+x.steps.map(t=>'<li><span>'+t+'</span></li>').join("")+'</ol>'+
    x.btns.map(b=>'<a class="btn '+(b[2]?'btn-main':'btn-ghost')+' full" href="'+b[0]+'">'+b[1]+'</a>').join("")+
    '<button class="btn btn-ghost full" data-begin="two-minute-settle">Breathe with me first</button>'+
    '<button class="btn btn-ghost full" id="popClose">I\'m safe right now</button>'+
    '<p class="small muted" style="text-align:center">Outside the US, call your local emergency number. I won\'t contact anyone or send this to another person.</p></div>');
}
/* Deterministic shortlist before any AI call: keyword fit, the guardian who owns today's open
   situation, the day's steward, who she has been with lately, and Aura. Smaller prompt, better picks. */
function shortlist(text,mins){
  const t=" "+String(text||"").toLowerCase()+" ",sc={},f=resolveCurrentFocus();
  for(const k of circleKeys()){if(k==="aura")continue;let s=0;for(const w of (KW[k]||[]))if(hasWord(t,w))s+=2;for(const r of R)if(r.g===k)for(const tg of r.tags||[])if(hasWord(t,tg))s+=.5;sc[k]=s;}
  if(f.owner&&sc[f.owner]!=null)sc[f.owner]+=1.5;if(sc[f.steward]!=null)sc[f.steward]+=.5;
  for(const k of (memOn()?yourGuardians():[]).slice(0,3))if(sc[k]!=null)sc[k]+=.75;
  const gs=["aura",...Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0])];
  const pool=R.filter(r=>canUse(r)&&!r.reset&&(gs.includes(r.g)||gs.includes(KIN[r.g])));
  const scored=pool.map(r=>[-wxPenalty(r)+score(r,mins)+outcomeBonus(r.id)+(gs.indexOf(r.g)>=0?(6-gs.indexOf(r.g))*.3:0)+(r.tags||[]).filter(tg=>hasWord(t,tg)).length,r]).sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
  const extra=R.filter(r=>canUse(r)&&!r.reset&&r.min<=5&&!scored.includes(r)).slice(0,4);
  return {guardians:gs,rituals:[...scored.slice(0,32),...extra]};
}
async function askAura(text,mins){
  const pre=localRoute(text);
  if(pre&&pre.action==="simplify")return {...pre,theme:"centering",ritual:byId["two-minute-settle"],why:""};
  if(pre&&pre.action==="answer"){const a=await askArchive(text);return {...pre,...a,theme:"archive",ritual:byId.anchor,reading:"",aura:"Here's what your Archive says.",why:""};}
  if(overLimit("read")){const res=localRead(text,mins);res.limit=true;res.note="That's today's "+LIMITS.free.read+" free readings from me, so this one comes from the Archive's own index. In the Inner Circle, we get much more time together. Aura";return res;}
  const p=S.profile, mem=memOn()?memoryBrief(text):{text:"(memory is off; do not refer to her past)"};
  const recent=S.entries.filter(usable).slice(0,8).map(e=>"- "+fmtDate(e.ts)+" | "+e.guardian+" | "+(e.ritualTitle||"")+" | theme: "+(e.theme||"")+" | carrying: "+(e.carrying||"").slice(0,120)+" | wrote: "+(e.text||"").slice(0,160)).join("\n")||"(no entries yet)";
  // Shortlist first, in code: the likely guardians and their rituals, not the whole library every time.
  const sl=shortlist(text,mins);
  const catalog=sl.rituals.map(r=>r.id+" | "+G[r.g].name+" | "+r.title+" | "+r.min+" min | needs: "+(r.needs.map(n=>n[0]).join(", ")||"nothing")+" | for: "+r.purpose).join("\n");
  const others=circleKeys().filter(k=>!sl.guardians.includes(k)).map(k=>k+": "+G[k].name+", "+JOB[k]).join("\n");
  const circle=sl.guardians.map(k=>k+": "+G[k].name+", "+G[k].title+". Job: "+JOB[k]+" Domain: "+G[k].domain+(GSPEC[k]?" Call when: "+GSPEC[k].sig+". Do NOT use when: "+GSPEC[k].avoid+". Goes next to: "+GSPEC[k].next+". Memory that matters: "+GSPEC[k].mem+".":"")+" Voice: "+G[k].voice+" Signature phrases: "+G[k].phrases.join(" / ")).join("\n");
  const prompt =
"You are Aura, lead guardian of The Daily Alchemist, a ritual app from The Alchemist Archives. Philosophy: the person should never have to browse or work harder because the app exists. Read her moment and bring her ONE practice that fits right now.\n\n"+
"THE LIKELIEST GUARDIANS FOR THIS MOMENT (each has a distinct voice; write the reading in the chosen guardian's voice):\n"+circle+"\n"+"THE REST OF THE CIRCLE (choose one only if clearly better; their voice is in their job line):\n"+others+"\n\n"+focusText()+"\n"+
"BRAND VOICE: warm, wise, grounded, a little bougie. Real talk, not love-and-light. Nature, moon and elements, tangible and real, never woo-woo fluff. NEVER use em dashes or en dashes. No emojis.\n\n"+
"TODAY: "+today.toDateString()+". Moon: "+M.name+", "+Math.round(M.ill*100)+"% lit. Season: "+SEA.cur.name+" ("+SEA.cur.sense+"), "+SEA.next.name+" in "+SEA.days+" days.\n"+
"THE MOON IS A SIGNAL, NOT DECORATION: waxing is for beginning and building, full is for peaks, celebration and big releases, waning is for releasing, ending and rest, new and dark moon are for rest and quiet intentions. Weigh it with how much she is carrying. When it shapes your choice, say why in one short clause, for example: You're carrying a lot tonight and the moon is waning, so we're not beginning anything. We're releasing. Never force it.\n"+
"HOW SHE IS TODAY: "+(()=>{const d=(S.days||{})[dayKey(new Date())]||{};return [d.sleep?"slept "+["","rough","okay","good","great"][d.sleep]:"",d.energy?"energy "+["","low","some","good"][d.energy]:"",d.moved!=null?["hasn't moved yet","moved a little","moved"][d.moved]:""].filter(Boolean).join(", ")||"no check in yet";})()+".\n\n"+
"WHAT AURA KNOWS ABOUT HER: name: "+(p.name||"unknown")+". Time right now: "+mins+" minutes. Has at home (water, paper, pen assumed): "+ownedNames().join(", ")+". "+personalText().replace(/\n/g,". ")+". "+"Prefers language that is "+p.tone+" (grounded = practical, mystical = more spell language).\n\n"+
"HER RECENT ARCHIVE (newest first):\n"+recent+"\n\n"+
"WHAT AURA REMEMBERS:\n"+mem.text+"\n\n"+
"AURA'S LEDGER (long-term memory of her life):\n"+ledgerText()+"\n\n"+
"WHAT HAS WORKED FOR HER (from how she felt after each ritual):\n"+workedText()+"\n\n"+
"HER MOST RELEVANT AND MOST RECENT ENTRIES (newest first). Match the most similar past moment by MEANING, not shared words. 'My sister keeps walking over me' and 'I'm tired of her ignoring my limits' are the same situation:\n"+(memOn()?historyText(text):"(memory is off)")+"\n\n"+
"WHAT SHE HAS TOLD AURA LATELY (newest first, with what came of it):\n"+(memOn()?asksText():"(memory is off)")+"\n\n"+
"RITUALS SHE HAS ALREADY DONE TODAY: "+ritualsToday()+"\n"+
"GUARDIANS SHE HAS BEEN WITH THIS WEEK: "+(Object.entries(S.entries.filter(e=>Date.now()-e.ts<7*864e5&&e.guardian).reduce((c,e)=>(c[e.guardian]=(c[e.guardian]||0)+1,c),{})).map(([g,n])=>(G[g]?G[g].name:g)+" "+n).join(", ")||"none")+". RELEASE RITUALS THIS WEEK: "+releaseThisWeek()+".\n"+
"MAKE IT PERSONAL: whenever she has any history, your aura line must include one sentence that could only be said to her, drawn from what she told you or did (for example: You said yesterday you were trying to stop carrying work into bed. Let's keep that promise tonight). If she has been with the same guardian twice or more this week, say what that tells you. If she has already done release work twice and the thread is still unresolved, do not prescribe more release: recommend a decision or an action and say why.\n\n"+
"BE A CONTINUITY ENGINE, NOT A RECOMMENDER. Connect tonight to where she has been, what she tried and what helped. Example of the voice: This sounds like the same work situation you brought me twice last week. The first time Lily helped you calm down. The second time you wrote that calming down wasn't the real issue because you still hadn't said no. So I don't think we're doing Lily tonight. I'm taking you to Thistle. Prefer what has actually helped her. Avoid what didn't move it unless you say why this time is different.\n\n"+
"Do not explain who the guardian is in your aura line. The app adds that introduction itself.\n"+"MEMORY IS THE POINT. She should never have to explain herself twice. Use what you remember out loud when it's relevant: count how often a theme has come up, quote her own past words, name the ritual and date. If a theme keeps repeating, give her something different from what she has already done and say so. If her usual pattern (for example reaching for release) is not what this moment needs, say it plainly, like: You usually reach for release when this happens. I don't think you need another release ritual tonight. I think this is a boundary. Only reference memories listed above. Never invent past entries, dates or quotes.\n\n"+
"RITUAL SHORTLIST (id | guardian | title | minutes | needs). Choose from these; compose only if none fits:\n"+catalog+"\n\n"+
"SHE SAYS: \""+text.replace(/"/g,"'")+"\"\n\n"+
"YOU ARE THE FRONT DOOR. She never has to know how the app is organized. Choose the right NEXT ACTION, not always a ritual. action is one of: ritual (a practice fits), talk (she needs to think it through with the guardian first), write (one honest sentence would do more than a ritual; give the exact prompt), rest (she has already done enough today or is depleted; tell her plainly, like: You've done enough today. I'm not giving you another ritual. Go sleep. I'll hold this until tomorrow. Recommending nothing is allowed and often the most caring choice), revisit (something she already wrote holds the answer; give revisitId), simplify (she can't think or is flooded; one tiny grounding action, nothing else), circle (there are genuinely two or three ways to see this; give 2 or 3 guardians and one sentence each on how they see it), decide (she is weighing a decision; never decide for her), event (a life transition like a move, breakup, new job, loss or birthday that needs a short path of 3 to 5 steps; use library ritual ids where possible), build (she asked you to create a ritual; compose it). Then choose the guardian and, for ritual, the best ritual id from the library.\n"+
"OPEN PROMISES SHE MADE TO HERSELF: "+(openPromises().map(p=>fmtDate(p.ts)+": "+p.text).join(" | ")||"none")+"\n"+
"If she states something she intends to do, offer to hold her to it in the promise field (her words, short).\n"+
"TONIGHT VERSUS TOMORROW: when she is upset and still activated, decide what is for tonight (calming, releasing, resting) and what is a problem to solve later. Say it plainly in your aura line, for example: This doesn't sound like a problem you need to solve tonight. You're angry and still activated. Then fill tomorrow with what you'll check.\n"+
"Name the ongoing thread this belongs to in 1 to 3 words, reusing an existing thread if it fits. Existing threads: "+(threadsOf().map(x=>x[0]).join(", ")||"none yet")+". Then choose the guardian and, for ritual, the best ritual id from the library. Only compose a new ritual if nothing in the library fits her time, materials or situation; composed rituals use only what she has, 4 to 6 steps, one spoken line.\n"+
"If she mentions wanting to hurt herself, not wanting to be alive, wanting to hurt someone else, or someone hurting or threatening her, set care to true, choose aura, choose ritual anchor, and make the reading gentle, loving and plain: tell her she matters, that she is not alone, and to reach a real person now (call or text 988 in the US; 911 if anyone is in immediate danger; for someone hurting her, the National Domestic Violence Hotline). Never shame her for what she feels.\n"+
"Reply with ONLY JSON in this shape:\n"+
'{"action":"ritual","thread":"Work boundary","promise":"optional: something she said she will do, in her words, or null","circle":"only for circle: [{\"guardian\":\"fern\",\"view\":\"one sentence\"}]","plan":"only for event: {\"title\":\"A new home\",\"steps\":[{\"ritualId\":\"threshold-reset\",\"note\":\"one sentence\"}]}","writePrompt":"only for write: the one sentence she should finish, like: The thing I haven\'t said to her is...","revisitId":"only for revisit: the entry id","guardian":"thistle","aura":"1 or 2 sentences in AURA\'s own voice: show what you remember when it matters, then hand her off, ending with a line like That\'s Thistle\'s work.","ritualId":"salt-line","composed":null,"reading":"2 to 4 sentences spoken directly to her in the CHOSEN GUARDIAN\'s own voice, using their rhythm and phrases","memoryId":"the id of the most similar past moment if bringing it back would help, else null","memoryQuestion":"if memoryId is set, one short question in the guardian\'s voice, like Do you want to work from there or start fresh?","why":"two or three short sentences in three layers: NOW (time of day, moon, season, a date coming up), YOU (what you know about her life from her history: how long she has carried this, what helped or didn\'t last time, her habits; required whenever there is any history), THIS (why this exact practice: its length, whether it asks her to write, whether it closes or opens something). Example: It\'s late and you\'ve had three heavy evenings this week. You\'ve been trying to stop carrying work into bedtime. Threshold Reset closes the day without asking you to process everything tonight.","tomorrow":"if something stays unresolved, what you will ask her tomorrow, in a few words, like: whether the boundary itself still needs attention. Otherwise null","theme":"one word theme","care":false}\n'+
'If composing: "ritualId":null,"composed":{"title":"...","min":8,"el":"Fire","purpose":"...","needs":["salt"],"steps":[{"t":"short title","d":"one or two sentences","say":"optional spoken line"}],"secret":"one line on why it works","prompts":["reflection question","reflection question"]}';
  try{
    if(inflight)inflight.abort(); inflight=new AbortController();
    const out=await aiJSON(prompt,inflight.signal);bump("read");
    const gk=(out&&okG(out.guardian))||"aura";
    let r=out&&out.ritualId&&byId[out.ritualId];if(r&&!canUse(r))r=null;
    if(!r&&out&&out.composed&&Array.isArray(out.composed.steps)&&out.composed.steps.length){
      const c=out.composed;
      r={id:"composed-"+Date.now(),g:gk,title:String(c.title||"A ritual for tonight"),el:String(c.el||G[gk].element),moon:"Any",min:Number(c.min)||mins,
         purpose:String(c.purpose||""),needs:(c.needs||[]).map(n=>[String(n),String(n)]),steps:c.steps.slice(0,7).map(x=>({t:String(x.t||""),d:String(x.d||""),say:x.say?String(x.say):undefined})),
         secret:String(c.secret||""),prompts:Array.isArray(c.prompts)&&c.prompts.length?c.prompts.map(String):["What came up?","What will you do with it?"],tags:[],composed:true};
    }
    if(!r)r=byId.anchor;
    const me=out.memoryId&&S.entries.find(e=>e.id===out.memoryId);
    const memory=me&&quoteOf(me)?{id:me.id,quote:quoteOf(me),date:fmtDate(me.ts),ritualTitle:me.ritualTitle,moon:me.moon||"",question:clean(out.memoryQuestion||"Do you want to work from there, or start fresh?")}:null;
    let act=["ritual","talk","write","rest","revisit","simplify","circle","decide","event","build"].includes(out.action)?out.action:"ritual";
    const circle=Array.isArray(out.circle)?out.circle.filter(c=>c&&G[c.guardian]&&allowedG(c.guardian)).slice(0,3).map(c=>({guardian:c.guardian,view:clean(c.view||"")})):[];
    if(act==="circle"&&circle.length<2)act="ritual";
    let plan=null;if(act==="event"&&out.plan&&Array.isArray(out.plan.steps)){plan={title:clean(out.plan.title||"Your path"),steps:out.plan.steps.slice(0,6).map(st=>({ritualId:byId[st.ritualId]&&canUse(byId[st.ritualId])?st.ritualId:null,title:byId[st.ritualId]?byId[st.ritualId].title:clean(st.title||""),note:clean(st.note||"")}))};}
    if(act==="event"&&!plan){const ev=lifeEventFor(text);if(ev)plan={title:ev.title,steps:ev.steps.map(([id,note])=>({ritualId:id,title:byId[id]?byId[id].title:"",note}))};else act="ritual";}
    if(act==="build"&&!(r&&r.composed))act="ritual";
    const rv=act==="revisit"&&out.revisitId&&S.entries.find(e=>e.id===out.revisitId);
    return {circle,plan,thread:clean(out.thread||"").slice(0,40),promise:out.promise&&out.promise!=="null"?clean(out.promise).slice(0,200):"",action:act==="revisit"&&!rv?"ritual":act,writePrompt:clean(out.writePrompt||""),revisit:rv?rv.id:null,guardian:gk,ritual:r,aura:clean(out.aura||("That's "+G[gk].name+"'s work.")),memory,reading:clean(out.reading||G[gk].phrases[0]),why:esc(clean(out.why||"")),tomorrow:out.tomorrow&&out.tomorrow!=="null"?clean(String(out.tomorrow)).slice(0,160):"",theme:String(out.theme||THEME[gk]).toLowerCase().slice(0,24),care:!!out.care,source:"aura"};
  }catch(e){
    if(e&&e.code==="cancelled")throw e;
    const c0=e&&e.code;
    if(c0==="adult_confirmation_required")throw {code:"needs_birthday"};
    if(MODE==="web"&&!["signin","limit","not_granted"].includes(c0))throw {code:"ai_down"};
    const res=localRead(text,mins);const c=e&&e.code;
    res.note=c==="signin"&&!accountsOn()?"":c==="signin"?"Sign in, it's free, and I can give you my full reading. This one comes from the Archive's own index. Aura":c==="limit"?"That's today's free readings from me, so this one comes from the Archive's own index. In the Inner Circle, we get much more time together. Aura":c==="not_granted"?"Aura's deeper reading is off for this view, so this one comes from the Archive's own index.":"";
    res.limit=c==="limit";res.signin=c==="signin"&&accountsOn();
    return res;
  }
}
const clean=s=>String(s).replace(/\s*[\u2012\u2013\u2014\u2015\u2212]\s*/g,", ").replace(/\s+--?\s+/g,", ");

