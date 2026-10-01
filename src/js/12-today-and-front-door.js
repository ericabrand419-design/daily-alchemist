/* ------------------------------------------------------------------
   TODAY
------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   FRONT DOOR: Aura knows the product map, so she doesn't have to.
------------------------------------------------------------------ */
if(!S.promises)S.promises=[];
if(!S.later)S.later=[];
if(!S.myRituals)S.myRituals=[];
if(!S.cart)S.cart=[];
if(!S.misses)S.misses={};
if(!S.plans)S.plans=[];
if(!S.decide)S.decide={};
for(const r of S.myRituals){if(!byId[r.id]){R.push(r);byId[r.id]=r;}}
const uid=()=>"x"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const usable=e=>!e.private;
function openPromises(){return S.promises.filter(p=>p.status==="open");}
function duePromise(){const now=Date.now();return openPromises().filter(p=>p.due<=now).sort((a,b)=>a.due-b.due)[0]||null;}
function dueLater(){const now=Date.now();return S.later.filter(l=>!l.done&&l.due<=now).sort((a,b)=>a.due-b.due)[0]||null;}
function activePlan(){return S.plans.find(p=>!p.done)||null;}
function persistAll(){saveLocal();remotePut("prefs");}

/* Time-aware opening question */
function auraQuestion(){
  const h=new Date().getHours(), n=S.profile.name?", "+S.profile.name:"";
  if(h>=5&&h<12)return "What do you want today to be about"+n+"?";
  if(h>=12&&h<17)return "What are you carrying today"+n+"?";
  if(h>=17&&h<22)return "What are you ready to set down tonight"+n+"?";
  return "What's still with you tonight"+n+"?";
}

/* Life events: transitions that need more than one ritual */
const LIFE_EVENTS=[
  {key:"moving",match:/\b(mov(e|ing|ed)|new (apartment|house|home|place)|closing on|first night)\b/i,title:"A new home",g:"juniper",steps:[["threshold-reset","Clear the first surface before you unpack anything else."],["whisper-sweep","Sweep out whatever the last people left behind."],["doorway-blessing","Bless the door you'll walk through every day."],["salt-line","Decide what's allowed in this home."],["ancestor-plate","Feed the new place with a meal that means home."]]},
  {key:"breakup",match:/\b(break ?up|broke up|divorce|ended things|left me|we split)\b/i,title:"After the ending",g:"sage",steps:[["burned-word","Say all of it. Then burn it."],["cord-cutting","Cut the cord that's still pulling."],["grief-bowl","Grieve it honestly, even the good parts."],["phoenix-shower","Wash off the version of you they knew."],["seed-intention","Plant what comes next."]]},
  {key:"newjob",match:/\b(new job|start(ing)? (a|my) (job|role)|first day|promotion|starting a business|launch(ing)? my)\b/i,title:"A new chapter at work",g:"sol",steps:[["first-light","Start the first morning on purpose."],["ledger","Turn the hope into three moves."],["sun-hype","Get your fire up before you walk in."],["salt-line","Decide your work boundaries early."],["victory-jar","Start keeping receipts from day one."]]},
  {key:"loss",match:/\b(died|passed away|funeral|lost my (mom|mother|dad|father|grand\w*|sister|brother|friend|dog|cat|baby))\b/i,title:"Carrying a loss",g:"willow",steps:[["grief-bowl","Give the grief somewhere to go."],["say-their-names","Say their name out loud."],["empty-chair","Say what you never got to say."],["tidewater-rest","Rest. Grief is exhausting."],["ancestor-plate","Cook something they loved."]]},
  {key:"birthday",match:/\b(my birthday|birthday (is|this)|turning \d+)\b/i,title:"A new year of you",g:"lumen",steps:[["weekly-weave","Look back at the year you just finished."],["future-letter","Write to yourself one year from now."],["mirror-honey","Say it sweeter, to yourself."],["seed-intention","Plant the year."]]}
];
function lifeEventFor(text){return LIFE_EVENTS.find(e=>e.match.test(text))||null;}

/* Fast local routing for the special cases, before the ritual picker */
function localRoute(text){
  const t=text.toLowerCase();
  if(/can'?t think|cannot think|too much|shutting down|freaking out|panic attack|can'?t breathe/.test(t))return {action:"simplify",guardian:"aura",reading:"Stop. You don't have to figure anything out right now.",aura:"I've got you. Just one thing."};
  if(/^(when did i|what have i|show me|how (many|often)|have i ever|what did i (say|write))/.test(t))return {action:"answer",guardian:"aura",...archiveSearch(text)};
  if(/\b(should i|deciding|decide|whether (to|or)|can'?t decide|torn between)\b/.test(t))return {action:"decide",guardian:"aura",reading:"Let's not decide yet. Let's separate what you want from what you're afraid of and what you think you owe.",aura:"This is a decision. I won't make it for you, but I'll help you hear yourself."};
  const ev=lifeEventFor(text);
  if(ev)return {action:"event",guardian:ev.g,plan:{title:ev.title,steps:ev.steps.map(([id,note])=>({ritualId:id,title:byId[id]?byId[id].title:"",note}))},reading:"This is a transition, and transitions need more than one ritual. I made you a path.",aura:"This is bigger than one night. That's "+G[ev.g].name+"'s work."};
  if(/\b(create|make|write|build|design) (me )?(a |my own )?ritual\b|ritual for my\b/.test(t))return {action:"build",guardian:"aura"};
  return null;
}
function archiveSearch(text){
  const ws=words(text).filter(w=>!["when","first","start","talk","written","write","said","show","time","times","ever"].includes(w));
  const hits=S.entries.filter(usable).filter(e=>{const b=((e.carrying||"")+" "+(e.text||"")+" "+(e.ritualTitle||"")+" "+(e.thread||"")).toLowerCase();return ws.some(w=>b.includes(w));}).sort((a,b)=>a.ts-b.ts);
  if(!hits.length)return {answer:"I looked through everything you've written and couldn't find that yet.",cites:[]};
  const first=hits[0],last=hits[hits.length-1];
  return {answer:"You've written about this "+hits.length+" time"+(hits.length>1?"s":"")+". The first was "+fmtDate(first.ts)+(hits.length>1?", the most recent "+fmtDate(last.ts):"")+".",cites:hits.slice(-6).reverse().map(e=>e.id)};
}
async function askArchive(question){
  const local=archiveSearch(question);
  try{
    const list=S.entries.filter(usable).slice(0,200).map(e=>"- id "+e.id+" | "+fmtDate(e.ts)+" | "+(e.thread||e.theme||"")+" | "+(e.ritualTitle||"")+" | carrying: "+(e.carrying||"").slice(0,120)+" | wrote: "+(e.text||"").slice(0,200)).join("\n");
    const out=await aiJSON("You answer questions about a person's private ritual journal, gently and precisely. Answer only from the entries below. If they don't hold the answer, say so. Quote her words briefly when useful. No em dashes.\n\nENTRIES:\n"+list+"\n\nQUESTION: "+question+'\n\nReply with ONLY JSON: {"answer":"2 to 4 sentences","citeIds":["ids of the entries you used, up to 6"]}',null);
    const cites=(out.citeIds||[]).filter(id=>S.entries.some(e=>e.id===id));
    return {answer:clean(out.answer||local.answer),cites:cites.length?cites:local.cites};
  }catch(e){return local;}
}

/* Promises and follow-through */
function addPromise(text,days,source){
  const p={id:uid(),text:text.trim().slice(0,200),ts:Date.now(),due:Date.now()+days*864e5,source:source||"",status:"open"};
  S.promises.unshift(p);persistAll();return p;
}
function checkinHTML(){
  const p=duePromise();
  if(p)return '<div class="card checkin"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura, checking back</span>On '+esc(fmtDate(p.ts))+' you said: "'+esc(p.text)+'". Did you?</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-promise="'+p.id+':done">I did it</button><button class="btn btn-ghost" data-promise="'+p.id+':later">Not yet</button><button class="btn btn-ghost" data-promise="'+p.id+':let">Let it go</button></div></div>';
  const l=dueLater();
  if(l)return '<div class="card checkin"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">You asked me to bring this back</span>'+esc(l.label)+'</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-later="'+l.id+':open">Open it</button><button class="btn btn-ghost" data-later="'+l.id+':done">Done with it</button></div></div>';
  return "";
}
function planHTML(){
  const p=activePlan(); if(!p)return "";
  const i=p.steps.findIndex(s=>!s.done); const s=p.steps[i];
  return '<div class="card"><div class="row between"><span class="label">Your path · '+esc(p.title)+'</span><span class="small muted">'+(i+1)+' of '+p.steps.length+'</span></div><h3 style="margin-top:6px">'+esc(s.title||"Next step")+'</h3><p class="small muted" style="margin-top:4px">'+esc(s.note||"")+'</p><div class="progress" style="margin-top:10px"><i style="width:'+(i/p.steps.length*100)+'%"></i></div><div class="row" style="margin-top:12px">'+(s.ritualId&&byId[s.ritualId]?'<button class="btn btn-main" data-planstep="'+p.id+':'+i+'">Begin step '+(i+1)+'</button>':'<button class="btn btn-main" data-plandone="'+p.id+':'+i+'">Mark done</button>')+'<button class="btn btn-ghost" data-plancal="'+p.id+':'+i+'">📅 Tomorrow</button><button class="btn btn-ghost" data-planend="'+p.id+'">End this path</button></div></div>';
}

/* Bring this back later */
function laterDue(opt){
  const d=new Date();
  if(opt==="tonight"){d.setHours(20,0,0,0);if(d<new Date())d.setDate(d.getDate()+1);return d.getTime();}
  if(opt==="tomorrow"){d.setDate(d.getDate()+1);d.setHours(9,0,0,0);return d.getTime();}
  if(opt==="week"){d.setDate(d.getDate()+7);d.setHours(9,0,0,0);return d.getTime();}
  if(opt==="newmoon")return Date.now()+Math.max(1,M.toNew)*864e5;
  if(opt==="fullmoon")return Date.now()+Math.max(1,M.toFull)*864e5;
  return Date.now()+864e5;
}
function openLaterSheet(kind,ref,label,g){
  window.__later={kind,ref,label,g};
  openSheet('<div class="stack"><div class="label">Bring this back to me</div><h2>When should Aura bring it back?</h2><p class="muted">"'+esc(label.slice(0,160))+'"</p><div class="chips">'+[["tonight","Tonight"],["tomorrow","Tomorrow morning"],["week","In a week"],["newmoon","At the new moon"],["fullmoon","At the full moon"]].map(o=>'<button class="chip" data-laterwhen="'+o[0]+'">'+o[1]+'</button>').join("")+'</div></div>');
}

/* Simplicity mode */
function openSimple(){
  track("cant_think");
  closeSheet();
  const el=document.createElement("div");el.className="simple";el.id="simple";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Just breathe");
  el.innerHTML='<div class="breath" aria-hidden="true"></div><p class="s1">Put both feet on the floor.</p><p class="s2">Breathe in while the circle grows. Out while it shrinks.</p><p class="s3">That\'s all you have to do.</p><button class="btn btn-ghost" id="simpleDone">I\'m a little better</button>';
  document.body.appendChild(el);document.body.style.overflow="hidden";
}
function closeSimple(){const el=$("#simple");if(el)el.remove();document.body.style.overflow="";}

/* Alchemy list */
function noteMiss(tag){S.misses[tag]=(S.misses[tag]||0)+1;persistAll();}
function cartOffer(r){
  const tag=missingFor(r).map(n=>n[0]).find(t=>(S.misses[t]||0)>=2&&!S.cart.some(c=>c.tag===t)&&!(S.cartNo||[]).includes(t));
  return tag?'<div class="ask"><span>You\'ve needed '+esc(NOUN[tag].replace(/^an? /,""))+' for '+S.misses[tag]+' rituals. Add it to your Alchemy list?</span><button class="chip" data-cart="'+tag+':1">Add it</button><button class="chip" data-cart="'+tag+':0">No thanks</button></div>':"";
}
function cartHTML(){
  if(!S.cart.length)return '<div class="card"><div class="label">Your Alchemy list</div><p class="small muted" style="margin-top:4px">When a ritual keeps needing something you don\'t have, Aura will offer to add it here.</p></div>';
  return '<div class="card"><div class="label">Your Alchemy list</div>'+S.cart.map(c=>'<div class="li"><span>'+esc(NOUN[c.tag]?NOUN[c.tag].replace(/^an? /,""):c.tag)+'</span><span class="row"><button class="chip" data-cartgot="'+c.tag+'">Got it</button><button class="x2" data-cartdel="'+c.tag+'" aria-label="Remove">×</button></span></div>').join("")+'</div>';
}

/* My rituals */
function saveMyRitual(r){
  const copy={...r,id:r.id.startsWith("mine-")?r.id:"mine-"+uid(),mine:true,composed:false,member:false,tags:r.tags||[],moon:r.moon||"Any"};
  if(!byId[copy.id]){R.push(copy);byId[copy.id]=copy;}
  if(!S.myRituals.some(x=>x.id===copy.id))S.myRituals.unshift(copy);
  persistAll();return copy;
}
function myRitualsHTML(){
  return '<div class="card"><div class="row between"><span class="label">My rituals</span><button class="linkish" id="writeOwn">Write your own</button></div>'+(S.myRituals.length?S.myRituals.map(r=>'<div class="li"><span><b style="font-weight:500">'+(r.family?'🌿 ':'')+esc(r.title)+'</b><br><span class="small muted">'+(r.origin?esc(r.origin):esc((G[r.g]||G.aura).name))+' · '+r.min+' min</span></span><button class="chip" data-begin="'+esc(r.id)+'">Begin</button></div>').join(""):'<p class="small muted" style="margin-top:4px">Rituals Aura writes for you, and ones you write yourself, live here.</p>')+'</div>';
}
function openWriteOwn(){
  openSheet('<div class="stack"><div class="label">Write your own ritual</div><h2>Your practice, your words.</h2><div class="field"><label for="ownTitle">Name it</label><input type="text" id="ownTitle" placeholder="Sunday Kitchen Blessing"></div><div class="field"><label for="ownSteps">Steps, one per line</label><textarea id="ownSteps" style="min-height:140px" placeholder="Light the stove candle&#10;Stir the pot clockwise three times&#10;Say who you are cooking for"></textarea></div><div class="field"><label for="ownSay">Something you say (optional)</label><input type="text" id="ownSay" placeholder="This home is fed and so am I."></div><div class="field"><label for="ownOrigin">Where does it come from? (optional)</label><input type="text" id="ownOrigin" placeholder="Grandma, every New Year\'s"></div><label class="switch" for="ownFamily">This is a family tradition<input type="checkbox" id="ownFamily"></label><div class="field"><span class="lbl">Minutes</span><div class="chips" id="ownMin">'+[5,10,15,20].map(m=>'<button class="chip" data-ownmin="'+m+'" aria-pressed="'+(m===10)+'">'+m+'</button>').join("")+'</div></div><button class="btn btn-main full" id="ownSave">Save to my rituals</button></div>');
}

/* Threads */
function threadsOf(){const c={};for(const e of S.entries)if(e.thread)c[e.thread]=(c[e.thread]||0)+1;return Object.entries(c).sort((a,b)=>b[1]-a[1]);}

