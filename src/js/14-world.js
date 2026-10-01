/* ------------------------------------------------------------------
   THE REST OF THE WORLD: inventory, altar, home, dates, meanings,
   seasons, yearbook, adaptive journeys, eyes-closed, calendar, push.
------------------------------------------------------------------ */
const HAVE_ADV=[["crystals","Crystals"],["incense","Incense"],["sagebundle","A sage or herb bundle"],["palosanto","Palo santo"],["essentialoils","Essential oils"],["coloredcandles","Colored or chime candles"],["driedherbs","Dried herbs"],["resin","Resin and charcoal"],["blacksalt","Black salt"],["moonwater","Moon water"],["floridawater","Florida water"],["tarot","A tarot deck"],["oracle","Oracle cards"],["pendulum","A pendulum"],["cauldron","A cauldron"],["chalice","A chalice"],["athame","A ritual knife"],["altarcloth","An altar cloth"],["bell","A bell"],["feather","A feather"],["parchment","Parchment or sigil paper"],["journal","A ritual journal"]];
Object.assign(NOUN,{crystals:"a crystal",incense:"incense",sagebundle:"a herb bundle",palosanto:"palo santo",essentialoils:"essential oil",coloredcandles:"a colored candle",driedherbs:"dried herbs",resin:"resin",blacksalt:"black salt",moonwater:"moon water",floridawater:"Florida water",tarot:"your tarot deck",oracle:"your oracle cards",pendulum:"your pendulum",cauldron:"your cauldron",chalice:"your chalice",athame:"your ritual knife",altarcloth:"your altar cloth",bell:"your bell",feather:"a feather",parchment:"parchment",journal:"your ritual journal"});
/* Advanced things she owns become the first choice for substitutions */
const ADV_ALTS={candle:["coloredcandles"],salt:["blacksalt"],bowl:["chalice","cauldron"],rosemary:["driedherbs","sagebundle"],stone:["crystals"],oil:["essentialoils"],milk:["moonwater"],vinegar:["floridawater"],thread:[],mirror:[],jar:["cauldron"],tea:["driedherbs"]};
for(const [k,v] of Object.entries(ADV_ALTS))if(SUBS[k])SUBS[k].alt=[...v,...SUBS[k].alt];
if(!S.profile.custom)S.profile.custom=[];
function ownedNames(){
  const all=[...HAVE,...HAVE_ADV];
  return [...S.profile.have.map(t=>{const f=all.find(x=>x[0]===t);return f?f[1]:t;}),...S.profile.custom];
}
function subFor(tag){
  const s=SUBS[tag]; if(!s)return null;
  const own=s.alt.find(a=>S.profile.have.includes(a));
  if(own)return "your "+NOUN[own].replace(/^(an?|your) /,"");
  return s.text;
}

/* Home spaces */
if(!S.spaces)S.spaces=[{id:"front",name:"Front door",log:[]},{id:"bed",name:"Bedroom",log:[]},{id:"kitchen",name:"Kitchen",log:[]},{id:"altar",name:"Altar",log:[]}];
function spacesHTML(){
  return '<div class="card"><div class="row between"><span class="label">Your home</span><button class="linkish" id="addSpace">Add a space</button></div><p class="small muted" style="margin-top:4px">Aura remembers what\'s been done in each room.</p>'+
   S.spaces.map(sp=>{const last=sp.log[0];const days=last?Math.floor((Date.now()-last.ts)/864e5):null;
     return '<div class="li"><span><b style="font-weight:500">'+esc(sp.name)+'</b><br><span class="small muted">'+(last?esc(last.title)+' · '+(days===0?"today":days+" day"+(days===1?"":"s")+" ago"):"Nothing yet")+'</span></span><span class="row"><button class="chip" data-tend="'+sp.id+'">Tend it</button><button class="x2" data-delspace="'+sp.id+'" aria-label="Remove '+esc(sp.name)+'">×</button></span></div>';}).join("")+'</div>';
}
function spaceText(){return S.spaces.map(sp=>sp.name+": "+(sp.log[0]?sp.log[0].title+" "+fmtDate(sp.log[0].ts):"nothing yet")).join("; ");}
function tendRitual(sp){
  const n=sp.name.toLowerCase();
  const pref=/door|entry|porch/.test(n)?["doorway-blessing","salt-line","jar-returning"]:/bed/.test(n)?["tidewater-rest","dream-bowl","green-nap"]:/kitchen/.test(n)?["ancestor-plate","threshold-reset","slow-tea"]:/altar/.test(n)?["circle-sealing","weekly-weave","threshold-reset"]:/office|desk|work/.test(n)?["ledger","four-count","threshold-reset"]:["threshold-reset","whisper-sweep","doorway-blessing"];
  const ok=pref.map(id=>byId[id]).filter(r=>r&&canUse(r));
  const fresh=ok.filter(r=>!sp.log.some(l=>l.id===r.id&&Date.now()-l.ts<14*864e5));
  return (fresh[0]||ok[0]||byId["threshold-reset"]);
}

/* Dates that matter */
if(!S.dates)S.dates=[];
function nextOccur(d){const now=new Date();let t=new Date(now.getFullYear(),d.month-1,d.day);if(t<new Date(now.getFullYear(),now.getMonth(),now.getDate()))t=new Date(now.getFullYear()+1,d.month-1,d.day);return t;}
function upcomingDates(days){const now=new Date(now0());return S.dates.map(d=>({...d,next:nextOccur(d)})).filter(d=>(d.next-now)/864e5<=days).sort((a,b)=>a.next-b.next);}
function now0(){const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime();}
function dateCardHTML(){
  const d=upcomingDates(3)[0]; if(!d)return "";
  const inDays=Math.round((d.next-new Date(now0()))/864e5), yrs=d.year?d.next.getFullYear()-d.year:null;
  const when=inDays===0?"Today":inDays===1?"Tomorrow":d.next.toLocaleDateString(undefined,{weekday:"long"});
  return '<div class="card checkin"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">A date that matters</span>'+esc(when)+' is '+esc(d.name)+(yrs?', '+yrs+' year'+(yrs===1?'':'s'):'')+'. Want something to mark it?</p></div><button class="btn btn-main" style="margin-top:10px" data-markdate="'+d.id+'">Mark it with Aura</button></div>';
}

/* Personal meanings and seasons */
if(!S.corr)S.corr=[];
if(!S.pseason)S.pseason=null;
function personalText(){
  return "WHAT THINGS MEAN TO HER PERSONALLY (use these over traditional correspondences): "+(S.corr.map(c=>c.symbol+" = "+c.meaning).join("; ")||"none yet")+"\n"+
    "HER PERSONAL SEASON: "+(S.pseason?S.pseason.name+" since "+fmtDate(S.pseason.start):"none named")+"\n"+
    "DATES THAT MATTER COMING UP: "+(upcomingDates(14).map(d=>d.name+" on "+d.next.toDateString()).join("; ")||"none")+"\n"+
    "HER HOME: "+spaceText()+"\n"+
    (S.profile.bday?"HER SIGN: "+signOf(S.profile.bday).name+" (birthday "+mdText(S.profile.bday)+"). Mention astrology lightly and only when it adds something.\n":"")+
    (S.profile.person?"ON HER HEART: "+personLine()+" Love and sex rituals and advice should fit this, not the other.\n":"")+
    "EVERYTHING SHE OWNS FOR RITUAL (prefer these, including advanced tools): "+(ownedNames().join(", ")||"basics only");
}

/* The altar: her active work, made visible */
function altarItems(){
  const c=openPromises().slice(0,5).map(p=>({kind:"candle",label:p.text,id:p.id}));
  const rel=S.entries.filter(e=>usable(e)&&Date.now()-e.ts<30*864e5&&/release|burn|cut|let go|sweep|dissolve|forgive|last straw/i.test(e.ritualTitle+" "+(e.theme||""))).slice(0,4).map(e=>({kind:"bowl",label:e.ritualTitle+(e.carrying?": "+e.carrying:""),id:e.id}));
  const grow=[...S.plans.filter(p=>!p.done).map(p=>({kind:"plant",label:"Path: "+p.title,id:p.id})),...S.entries.filter(e=>usable(e)&&/seed|intention|future|vision|ledger/i.test(e.ritualId||"")&&Date.now()-e.ts<45*864e5).slice(0,3).map(e=>({kind:"plant",label:e.ritualTitle+(e.text?": "+e.text.slice(0,80):""),id:e.id}))];
  const stones=(ledger().boundaries||[]).slice(0,5).map((b,i)=>({kind:"stone",label:b,id:"b"+i}));
  return {c,rel,grow,stones};
}
function altarSVG(){
  const a=altarItems(), W=340,H=200;
  let g='<rect x="10" y="130" width="320" height="16" rx="3" fill="#3A2B55" stroke="rgba(231,196,90,.5)"/><path d="M30 146 L40 190 M310 146 L300 190" stroke="rgba(231,196,90,.35)" stroke-width="3"/><rect x="40" y="118" width="260" height="14" fill="#BF1E73" opacity=".35"/>';
  a.c.forEach((it,i)=>{const x=60+i*26,h=38+(i%2)*10;g+='<g data-altar="candle" style="cursor:pointer"><rect x="'+(x-6)+'" y="'+(130-h)+'" width="12" height="'+h+'" rx="2" fill="#F3EAD3"/><path d="M'+x+' '+(130-h-4)+' q-6 -10 0 -18 q6 8 0 18z" fill="#F4BE3A"><animate attributeName="opacity" values="1;.7;1" dur="'+(1.6+i*.3)+'s" repeatCount="indefinite"/></path></g>';});
  if(a.rel.length)g+='<g data-altar="bowl" style="cursor:pointer"><path d="M200 110 q30 26 60 0z" fill="#3A8484" stroke="#5CC0B5"/><ellipse cx="230" cy="110" rx="30" ry="5" fill="#5CC0B5" opacity=".6"/></g>';
  if(a.grow.length)g+='<g data-altar="plant" style="cursor:pointer"><rect x="276" y="98" width="24" height="20" rx="3" fill="#583A20"/><path d="M288 98 v-26 M288 84 q-14 -6 -16 -18 q14 2 16 18 M288 78 q12 -6 14 -18 q-12 2 -14 18" stroke="#7DC27A" stroke-width="3" fill="#7DC27A"/></g>';
  a.stones.forEach((it,i)=>{g+='<ellipse data-altar="stone" style="cursor:pointer" cx="'+(190-i*14)+'" cy="124" rx="7" ry="5" fill="#8E86A6"/>';});
  if(!a.c.length&&!a.rel.length&&!a.grow.length&&!a.stones.length)g+='<text x="170" y="80" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="15" fill="#C9C1D9">Your altar fills as you do the work.</text>';
  return '<svg class="altarsvg" viewBox="0 40 '+W+' '+(H-40)+'" role="img" aria-label="Your altar">'+g+'</svg>';
}
function altarHTML(){
  const a=altarItems();
  return '<div class="card"><div class="label">Your altar</div><p class="small muted" style="margin-top:4px">Everything here means something. Candles are open promises. The bowl holds what you\'re releasing. The plant is what you\'re growing. Stones are boundaries you set. Tap any of them.</p>'+altarSVG()+
   '<div class="chips" style="margin-top:6px">'+[["candle","Candles",a.c.length],["bowl","Releasing",a.rel.length],["plant","Growing",a.grow.length],["stone","Boundaries",a.stones.length]].map(x=>'<button class="chip" data-altar="'+x[0]+'">'+x[1]+' · '+x[2]+'</button>').join("")+'</div></div>';
}
function openAltarItems(kind){
  const a=altarItems(), list={candle:a.c,bowl:a.rel,plant:a.grow,stone:a.stones}[kind]||[];
  const title={candle:"Candles: promises you're keeping",bowl:"The bowl: what you're releasing",plant:"The plant: what you're growing",stone:"Stones: boundaries you set"}[kind];
  openSheet('<div class="stack"><div class="label">Your altar</div><h2>'+esc(title)+'</h2>'+(list.length?list.map(it=>'<div class="li"><span>'+esc(it.label)+'</span>'+(kind==="candle"?'<button class="chip" data-promise="'+it.id+':done">Kept it</button>':(kind==="bowl"||kind==="plant")&&S.entries.some(e=>e.id===it.id)?'<button class="chip" data-entry="'+it.id+'">Open</button>':'')+'</div>').join(""):'<p class="muted">Nothing here yet. It fills as you do the work.</p>')+'</div>');
}

/* Tasks from reflection */
function taskGuess(text){
  const m=String(text||"").match(/(?:^|[.!?]\s*)([^.!?]*\b(?:tomorrow|tonight|this week|need to|have to|going to|i will|i'll|gotta)\b[^.!?]{3,90})/i);
  return m?m[1].trim().replace(/^(and|so|but)\s+/i,""):"";
}

/* Calendar file (.ics) */
function icsFile(title,start,desc){
  const f=d=>new Date(d).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const s=new Date(start), e=new Date(s.getTime()+30*60000);
  const esc2=t=>String(t||"").replace(/[\\;,]/g,m=>"\\"+m).replace(/\n/g,"\\n");
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//The Daily Alchemist//EN","BEGIN:VEVENT","UID:"+uid()+"@dailyalchemist","DTSTAMP:"+f(Date.now()),"DTSTART:"+f(s),"DTEND:"+f(e),"SUMMARY:"+esc2(title),"DESCRIPTION:"+esc2(desc||"From The Daily Alchemist"),"BEGIN:VALARM","TRIGGER:-PT15M","ACTION:DISPLAY","DESCRIPTION:"+esc2(title),"END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
}
async function saveFile(filename,data,type){
  if(MODE==="artifact"){try{const dl=await window.claude.use("downloads");if(!dl){toast("Saving files isn't available in this view.");return;}await dl.save({filename,data});}catch(e){}return;}
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:type||"text/plain"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
function addToCalendar(title,when,desc){
  const d=new Date(when);if(d.getHours()<7||d.getHours()>21)d.setHours(19,0,0,0);
  saveFile("daily-alchemist-"+title.toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,40)+".ics",icsFile(title,d,desc),"text/calendar");
}

/* Adaptive journeys: tomorrow adjusts to how today went */
/* Journeys adapt: a missed day never means starting over, and if she sounds depleted today
   the next day gets gentler instead of harder. */
function depletedNow(){
  if(typeof lowTank==="function"&&lowTank())return true;
  const day=Date.now()-24*3600e3;
  if(S.asks.some(a=>a.ts>day&&(["fern","juniper","willow"].includes(a.guardian)||a.action==="rest"||/\b(tired|exhausted|drained|depleted|burn(ed|t)? ?out|no energy|wiped|worn out|can'?t (do|handle) (it|this|anything))\b/i.test(a.text||""))))return true;
  const le=S.entries[0];return !!(le&&le.ts>day&&["Tender","Stirred up"].includes(le.after));
}
function gentle(r){const st=r.steps.length<=3?r.steps:[r.steps[0],r.steps[Math.floor(r.steps.length/2)],r.steps[r.steps.length-1]];return {...r,steps:st,min:Math.max(3,Math.ceil(r.min/2)),gentle:true};}
function adaptAll(prevAfter,r,missed,dayN){
  const base=adaptDay(prevAfter,r),dep=depletedNow(),parts=[];
  if(missed>=1)parts.push(missed===1?"You missed yesterday.":"It's been "+(missed+1)+" days.");
  if(dep){base.r=gentle(base.r);parts.push("Today you sound depleted, so I made Day "+dayN+" shorter and gentler: "+base.r.min+" minutes, "+base.r.steps.length+" steps.");}
  if(missed>=1)parts.splice(1,0,"We're not starting over.");
  if(missed>=1&&base.note)base.note=base.note.replace(/^Yesterday/,"Last time").replace("so Aura swapped tonight's ritual","so I swapped this one");
  if(parts.length)base.note=parts.join(" ")+(base.note&&!dep?" "+base.note:"");
  return base;
}
function daysSince(ts){if(!ts)return 0;return Math.floor((new Date(dayKey(new Date())).getTime()-new Date(dayKey(new Date(ts))).getTime())/864e5);}
function adaptDay(prevAfter,r){
  if(!prevAfter)return {r,note:""};
  if(prevAfter==="Stirred up")return {r,note:"Last time stirred you up. Start with two slow minutes before this one.",settle:true};
  if(prevAfter==="The same"){
    const alt=R.filter(z=>canUse(z)&&z.g===r.g&&z.id!==r.id&&!z.reset&&!doneRecently(z.id,14))[0]||R.filter(z=>canUse(z)&&z.g===(KIN[r.g]||r.g)&&z.id!==r.id&&!z.reset)[0];
    if(alt)return {r:alt,note:"Yesterday didn't move it, so Aura swapped tonight's ritual."};
  }
  if(GOOD.includes(prevAfter))return {r,note:"Yesterday helped. Keep going."};
  return {r,note:""};
}
function journeyStep(j,n){
  const base=byId[j.days[n-1][0]];
  const prev=S.entries.filter(e=>e.journey===j.id&&e.jday===n-1).sort((a,b)=>b.ts-a.ts)[0];
  return adaptAll(prev&&prev.after,base,prev?Math.max(0,daysSince(prev.ts)-1):0,n);
}

/* Go-to rituals, from what actually worked */
function goTos(){return Object.entries(outcomes()).filter(([id,o])=>o.good>=3&&byId[id]&&!byId[id].mine).map(([id,o])=>({id,o}));}
function goToHTML(){
  const g=goTos(); if(!g.length)return "";
  return '<div class="card"><div class="label">Your go-to rituals</div><p class="small muted" style="margin-top:4px">These keep working for you. Make one your own and Aura will reach for it first.</p>'+g.map(x=>'<div class="li"><span>'+esc(x.o.title)+'<br><span class="small muted">Helped '+x.o.good+' of '+x.o.n+' times</span></span><button class="chip" data-makemine="'+esc(x.id)+'">Make it mine</button></div>').join("")+'</div>';
}

/* Before and after for a thread */
function beforeAfterHTML(thread){
  const es=S.entries.filter(e=>usable(e)&&e.thread===thread&&e.text).sort((a,b)=>a.ts-b.ts);
  if(es.length<2)return "";
  const a=es[0],b=es[es.length-1];
  return '<div class="card"><div class="label">'+esc(thread)+': then and now</div><div class="ba"><div><div class="small muted">'+fmtDate(a.ts)+'</div><blockquote>"'+esc(quoteOf(a))+'"</blockquote></div><div><div class="small muted">'+fmtDate(b.ts)+'</div><blockquote>"'+esc(quoteOf(b))+'"</blockquote></div></div><p class="small muted" style="margin-top:8px">'+es.length+' entries on this thread. People rarely notice their own change while it\'s happening.</p></div>';
}

/* Yearbook: a private, written record of a stretch of time */
async function openYearbook(span){
  const days=span==="year"?365:span==="season"?91:31, cut=Date.now()-days*864e5;
  const es=S.entries.filter(e=>e.ts>cut), pub=es.filter(usable);
  const gc={};for(const e of es)gc[e.guardian]=(gc[e.guardian]||0)+1;
  const topG=Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>(G[x[0]]||G.aura).name);
  const th={};for(const e of es)if(e.thread)th[e.thread]=(th[e.thread]||0)+1;
  const topT=Object.entries(th).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
  const kept=S.promises.filter(p=>p.status==="done"&&p.doneAt>cut).length;
  const helped=Object.values(outcomes()).filter(o=>o.good).sort((a,b)=>b.good-a.good).slice(0,3).map(o=>o.title);
  const strongest=pub.filter(e=>e.text).sort((a,b)=>b.text.length-a.text.length)[0];
  const label={month:"This month",season:"This season",year:"This year"}[span];
  let h='<div class="stack yearbook"><div class="label">Alchemy '+esc(label.toLowerCase())+'</div><h2>'+esc(label)+' in your Archive</h2>'+
    '<div class="stats"><div class="stat"><div class="v">'+es.length+'</div><div class="k">Rituals</div></div><div class="stat"><div class="v">'+kept+'</div><div class="k">Promises kept</div></div><div class="stat"><div class="v">'+topT.length+'</div><div class="k">Threads</div></div></div>'+
    '<div id="ybText" class="voice" style="font-size:18px">'+(es.length?"Aura is writing your reflection...":"Not enough here yet. Come back after a few rituals.")+'</div>'+
    (topG.length?'<p><b>Walked with:</b> '+esc(topG.join(", "))+'</p>':'')+(topT.length?'<p><b>Threads:</b> '+esc(topT.join(", "))+'</p>':'')+(helped.length?'<p><b>What helped:</b> '+esc(helped.join(", "))+'</p>':'')+
    (strongest?'<div class="card memory"><div class="label">Your strongest words · '+fmtDate(strongest.ts)+'</div><blockquote>"'+esc(strongest.text.slice(0,300))+'"</blockquote></div>':'')+'</div>';
  openSheet(h);
  if(!es.length)return;
  const fallback="You showed up "+es.length+" time"+(es.length===1?"":"s")+(topT.length?", mostly around "+topT.slice(0,2).join(" and "):"")+"."+(kept?" You kept "+kept+" promise"+(kept===1?"":"s")+" to yourself.":"")+(helped.length?" "+helped[0]+" helped most.":"");
  try{
    const out=await aiJSON("Write a private, beautifully written reflection on this stretch of a person's ritual practice. Not a stats recap and not cheesy. Second person, warm, grounded, 4 to 6 sentences, no em dashes. Name recurring themes, what she released, what she kept, what helped and how she changed, using her own words where possible.\n\nPERIOD: "+label+"\nENTRIES:\n"+pub.slice(0,80).map(e=>"- "+fmtDate(e.ts)+" | "+(e.thread||e.theme||"")+" | "+e.ritualTitle+" | carrying: "+(e.carrying||"").slice(0,100)+" | wrote: "+(e.text||"").slice(0,160)+" | after: "+(e.after||"")).join("\n")+"\nPROMISES KEPT: "+S.promises.filter(p=>p.status==="done"&&p.doneAt>cut).map(p=>p.text).join("; ")+"\nLEDGER:\n"+ledgerText()+'\n\nReply with ONLY JSON: {"reflection":"..."}',null);
    const el=$("#ybText");if(el)el.textContent=clean(out.reflection||fallback);
  }catch(e){const el=$("#ybText");if(el)el.textContent=fallback;}
}

/* Eyes-closed mode: sound, vibration, no screen */
let eyes=false, eyesTimer=null, actx=null;
function tone(f){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f||528;o.type="sine";g.gain.setValueAtTime(0,actx.currentTime);g.gain.linearRampToValueAtTime(.18,actx.currentTime+.2);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+2.2);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+2.3);}catch(e){}try{navigator.vibrate&&navigator.vibrate(180);}catch(e){}}
function eyesStep(){
  clearTimeout(eyesTimer); if(!eyes||!run)return;
  const {r,i}=run;
  if(i>=r.steps.length){tone(396);speak("That's the ritual. Open your eyes when you're ready.",()=>{stopEyes();drawStep();});return;}
  const s=r.steps[i]; tone(i===0?432:528);
  speak((i===0?r.title+". Close your eyes. ":"")+s.d+(s.say?" Say: "+s.say:""),()=>{eyesTimer=setTimeout(()=>{if(eyes&&run){run.i++;eyesStep();}},(s.hold||20)*1000);});
}
function startEyes(){
  if(!("speechSynthesis" in window)){toast("Eyes-closed mode needs spoken guidance, which isn't available on this device.");return;}
  eyes=true;const el=document.createElement("div");el.className="eyes";el.id="eyes";el.innerHTML='<p>Eyes closed.</p><p class="small">Aura is guiding you aloud. Tap anywhere to stop.</p>';document.body.appendChild(el);eyesStep();
}
function stopEyes(){eyes=false;clearTimeout(eyesTimer);try{speechSynthesis.cancel();}catch(e){}const el=$("#eyes");if(el)el.remove();}

/* Notifications (live app only): meaningful, never generic */
async function enablePush(){
  const C=window.DA_CONFIG||{};
  if(MODE!=="web"||!ACCT.user){toast("Sign in on the live app to let Aura reach you.");return false;}
  if(!("serviceWorker" in navigator)||!("PushManager" in window)||!C.vapidPublicKey){toast(isNative()?"Messages from me are coming to this app in the next update.":/iPhone|iPad|iPod/.test(navigator.userAgent)?"On iPhone, first add me to your Home Screen: tap Share, then Add to Home Screen. Open me from there and turn this on.":"This browser can't receive messages from me. Try Chrome on your phone.");return false;}
  const perm=await Notification.requestPermission(); if(perm!=="granted"){toast("No problem. Aura will show things when you open the app.");return false;}
  const reg=await navigator.serviceWorker.ready;
  const key=Uint8Array.from(atob(C.vapidPublicKey.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((C.vapidPublicKey.length+3)%4)),c=>c.charCodeAt(0));
  const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
  const r=await api("/api/push-subscribe",{subscription:sub.toJSON()});
  if(r.error){toast("Couldn't turn on messages. Try again later.");return false;}
  S.profile.push=true;persist("profile");toast("Aura will only reach out when it means something.");return true;
}

let lastRead=null, pickedMins=null;
const QUICK=[["Angry","angry"],["Overthinking","overthinking and can't stop"],["Exhausted","exhausted"],["Anxious","anxious"],["Stuck","stuck"],["Not enough","like I'm not enough"],["Lonely","lonely"],["Grieving","grieving"],["Need boundaries","like I need a boundary"],["Heavy space","like my space feels heavy"],["Hopeful","hopeful"],["Just off","off, and I don't know why"]];
let feelSel=[];
function feelText(){return feelSel.length?"I'm feeling "+feelSel.map(k=>(QUICK.find(q=>q[0]===k)||[k,k])[1]).join(", and ")+".":"";}
function ritualCard(r,opts){
  if(!canUse(r)){
    return '<article class="page locked"><div class="kicker">'+esc(G[r.g].name)+"'s practice · "+esc(r.el)+'</div><h3>'+esc(r.title)+'</h3><div class="facts"><span>'+r.min+' minutes</span><span>'+esc(CHAMBERS[r.g]?CHAMBERS[r.g].name:"Chamber")+'</span></div><p class="needs">'+esc(r.purpose)+'</p><div class="actions"><button class="btn btn-ink" data-paywall="'+esc(G[r.g].name)+'\'s chamber">Unlock with '+esc(PLAN.name)+'</button></div></article>';
  }
  const a=adapt(r), unk=unknownFor(r)[0];
  const needs=r.needs.length?r.needs.map(n=>esc(n[1])).join(" · "):"Nothing but you.";
  const ownable=r.needs.filter(n=>SUBS[n[0]]&&S.profile.have.includes(n[0]));
  return '<article class="page" data-rid="'+esc(r.id)+'" data-opts="'+esc(JSON.stringify(opts||{}))+'"><div class="kicker">'+esc(G[r.g].name)+"'s practice · "+esc(r.el)+(r.reset?" · Reset day "+r.reset:"")+(r.composed?" · Written for you":"")+'</div>'+
   '<h3>'+esc(r.title)+'</h3><div class="facts"><span>'+r.min+' minutes</span><span>'+esc(r.moon==="Any"?"Any moon":r.moon+" moon")+'</span><span>'+r.steps.length+' steps</span></div>'+
   '<p class="needs"><b>You will need</b>'+needs+'</p>'+
   (a.notes.length?'<p class="adj">'+a.notes.map(esc).join(" ")+' The steps already say so.</p>':"")+
   cartOffer(r)+(unk?'<div class="ask"><span>Do you usually have '+esc(ASKN[unk[0]])+'?</span><button class="chip" data-own="'+unk[0]+':1">Yes</button><button class="chip" data-own="'+unk[0]+':0">No</button></div>':"")+
   whyNow(r,opts&&opts.why)+
   '<div class="actions"><button class="btn btn-ink" data-begin="'+esc(r.id)+'"'+(opts&&opts.ctx?' data-ctx="'+opts.ctx+'"':"")+'>Begin the ritual</button>'+(ownable.length?'<button class="linkish dark" data-donthave="'+esc(r.id)+'">I don\'t have that</button>':'')+'</div>'+
   (ownable.length?'<div class="dh" hidden data-dh="'+esc(r.id)+'"><span class="small">Tap what you don\'t have. Aura will rewrite the steps.</span><div class="chips">'+ownable.map(n=>'<button class="chip" data-own="'+n[0]+':0">'+esc(NOUN[n[0]])+'</button>').join("")+'</div></div>':'')+'</article>';
}
