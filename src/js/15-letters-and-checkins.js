/* ------------------------------------------------------------------
   INNER CIRCLE HEADLINERS
   1. Letters from Aura: first return, then at the cadence she chooses.
      For 30 days after the free week ends, she keeps writing, but the letters stay sealed until you join.
   2. Guardians who check in on you by name, a few days after you worked with them.
------------------------------------------------------------------ */
if(!S.letters)S.letters=[];
if(!S.nudges)S.nudges=[];
const WEEK=7*864e5, GRACE_DAYS=30;
function firstName(){return (S.profile.name||"").trim().split(/\s+/)[0]||"";}
function weekEntries(since,until){until=until||Infinity;return S.entries.filter(e=>usable(e)&&e.ts>since&&e.ts<=until).sort((a,b)=>a.ts-b.ts);}
function weekChats(since,until){until=until||Infinity;const out=[];for(const k of ALL)for(const m of (S.chats[k]||[]))if(m.role==="me"&&(m.ts||0)>since&&(m.ts||0)<=until)out.push({g:k,text:m.text});return out;}
function lastLetter(){return S.letters.slice().sort((a,b)=>b.ts-a.ts)[0]||null;}
function letterSince(){const l=lastLetter();return l?l.ts:Date.now()-WEEK;}
function firstActivity(){let f=Infinity;for(const e of S.entries)if(e.ts<f)f=e.ts;for(const a of (S.asks||[]))if(a.ts&&a.ts<f)f=a.ts;for(const k of ALL)for(const m of (S.chats[k]||[]))if(m.role==="me"&&m.ts&&m.ts<f)f=m.ts;return f===Infinity?0:f;}
function contactPref(){
  const raw=S.profile.contact||{},cad=raw.enabled===false?"never":(raw.cadence||null);
  return {enabled:cad!=="never"&&raw.enabled!==false,cadence:cad,scope:raw.scope||"circle",notify:raw.notify==null?(S.profile.push===true?true:null):raw.notify};
}
function contactDays(){return {"3xday":1/3,daily:1,"3days":3,weekly:7,monthly:30}[contactPref().cadence]||Infinity;}
function contactSettingsHTML(open){
  const c=contactPref(),cad=c.cadence||"",notify=c.notify;
  const opts=[["3xday","Three times a day"],["daily","Every day"],["3days","Every 3 days"],["weekly","Every week"],["monthly","Every month"],["never","Never again"]];
  return '<details class="group contactprefs"'+(open?' open':'')+'><summary>Letters and check-ins</summary><p class="small muted">Choose the rhythm. Letters can wait inside the app even if notifications are off.</p>'+
    '<div class="label" style="margin-top:10px">How often should we write?</div><div class="chips">'+opts.map(o=>'<button class="chip" data-contactcad="'+o[0]+'" aria-pressed="'+(cad===o[0])+'">'+o[1]+'</button>').join("")+'</div>'+
    '<div class="label" style="margin-top:12px">Notify me when one arrives?</div><div class="chips"><button class="chip" data-contactnotify="1" aria-pressed="'+(notify===true)+'">Yes, notify me</button><button class="chip" data-contactnotify="0" aria-pressed="'+(notify===false)+'">No notifications</button></div>'+
    '<div class="label" style="margin-top:12px">Who can write?</div><div class="chips"><button class="chip" data-contactscope="aura" aria-pressed="'+(c.scope==="aura")+'">Aura only</button><button class="chip" data-contactscope="circle" aria-pressed="'+(c.scope==="circle")+'">Aura + relevant guardians</button></div>'+
    '<p class="small muted" style="margin-top:7px">Relevant guardians means the ones you have actually worked with or whose work connects to what you have been carrying. You do not have to manage a list of nineteen people.</p>'+
    '<button class="btn btn-main full" id="contactSave" style="margin-top:12px">Save my letter rhythm</button></details>';
}
function firstReturnLetter(){return (S.letters||[]).find(l=>l.kind==="first-return")||null;}
/* Is she in the 30 days after her free week, when Aura still writes but the letters stay sealed? */
function graceActive(){
  if(isMember())return false;
  if(!accountsOn()&&S.previewMember===false)return true;
  const te=trialEnds();return te>0&&Date.now()>=te&&Date.now()<te+GRACE_DAYS*864e5;
}
function letterDue(){
  if(contactPref().cadence==="never"||!Number.isFinite(contactDays()))return false;
  const l=lastLetter(),gap=contactDays()*864e5;
  if(!l)return false;
  if(Date.now()-l.ts<gap-6*36e5)return false;
  const since=Math.max(letterSince(),Date.now()-gap);
  return weekEntries(since).length>0||weekChats(since).length>0;
}
function letterMaterial(since,until){
  if(!since)since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
  const es=weekEntries(since,until), ch=weekChats(since,until);
  return {es,ch,text:
    "HER NAME: "+(firstName()||"(not given)")+"\n"+
    "RITUALS AND ENTRIES SINCE THE LAST LETTER:\n"+(es.map(e=>"- "+fmtDate(e.ts)+" | "+(G[e.guardian]||G.aura).name+" | "+(e.ritualTitle||"entry")+" | carrying: "+(e.carrying||"").slice(0,140)+" | wrote: "+(e.text||"").slice(0,220)+(e.after?" | after: "+e.after:"")).join("\n")||"(none)")+"\n"+
    "WHAT SHE TOLD GUARDIANS SINCE THE LAST LETTER:\n"+(ch.slice(-10).map(c=>"- to "+G[c.g].name+": "+c.text.slice(0,160)).join("\n")||"(nothing)")+"\n"+
    "LONG-TERM MEMORY:\n"+ledgerText()+"\n"+
    "WHAT HAS WORKED FOR HER:\n"+workedText()+"\n"+
    "PAST LETTERS (do not repeat them): "+(S.letters.filter(l=>!l.sealed).slice(0,2).map(l=>l.title).join("; ")||"none")};
}
function namesList(ks){const nm=ks.map(g=>G[g].name);return nm.length>1?nm.slice(0,-1).join(", ")+" and "+nm[nm.length-1]:(nm[0]||"");}
function letterSender(m){if(contactPref().scope!=="circle")return "aura";const gs=[...m.es.map(e=>e.guardian),...m.ch.map(c=>c.g)].filter(g=>g&&g!=="aura"&&G[g]);return gs.length?gs[gs.length-1]:"aura";}
function localLetter(m,sender){
  const n=firstName(), es=m.es,voice=G[sender]||G.aura;
  const gs=[...new Set(es.map(e=>e.guardian).filter(g=>g&&g!=="aura"))];
  const good=es.filter(e=>GOOD.includes(e.after));
  const carried=es.map(e=>e.carrying).filter(Boolean);
  const next=gs[0]||"lily";
  let t=(n?n+",\n\n":"")+"I've been keeping the thread since I last wrote. Here's what I noticed.\n\n";
  if(carried.length)t+="You came in carrying "+carried.slice(-2).map(c=>'"'+c.slice(0,80)+'"').join(" and ")+". You didn't pretend it was lighter than it was. That matters.\n\n";
  if(gs.length)t+="You spent time with "+namesList(gs)+". "+(good.length?good[good.length-1].ritualTitle+" left you "+good[good.length-1].after.toLowerCase()+", so remember that one.":"Not every ritual has to land to count. You showed up.")+"\n\n";
  else if(m.ch.length)t+="You talked things through with the circle since I last wrote. That is its own kind of ritual.\n\n";
  t+="Before I write again, I'd like you to go back to "+G[next].name+". Not to fix anything. Just to keep the thread going.\n\nI'll be here.\nAura";
  return {title:"What I noticed",letter:t,next_guardian:next,intention:"Keep the thread going."};
}
async function composeLetter(m,sender){
  let out=null;
  try{
    const voice=G[sender]||G.aura;out=await aiJSON("You are "+voice.name+", "+voice.title+", writing a personal letter from The Daily Alchemist. Your domain: "+voice.domain+" Your voice: "+voice.voice+" Stay warm, perceptive and grounded. The member chose her own letter cadence. Look back only over the time since the last letter.\n\n"+m.text+"\n\n"+
      "Write a personal letter looking back since the last letter. 170 to 260 words. Address her by first name if you have it. Be specific: name what she actually carried, what she did, what helped and what didn't, using her own words where you can. Point out one pattern or shift you noticed. Suggest one guardian to spend time with before the next letter and why, and close with one simple intention until then. Sign it Aura. Plain words, short paragraphs, no em dashes, no bullet points, no diagnosing, no therapy language. Only use what is in the material.\n"+
      'Reply with ONLY JSON: {"title":"a short, warm title for the letter, under 7 words","letter":"the full letter with \\n\\n between paragraphs","next_guardian":"one key from: '+ALL.filter(k=>k!=="aura").join(", ")+'","intention":"one short line"}',null,{tier:"deep"});
  }catch(e){out=null;}
  if(!out||!out.letter)out=localLetter(m,sender);
  return {title:clean(String(out.title||"From Aura")).slice(0,80),text:clean(String(out.letter)),next:G[out.next_guardian]&&out.next_guardian!=="aura"?out.next_guardian:null,intention:clean(String(out.intention||"")).slice(0,160)};
}
async function writeLetter(){
  const since=Math.max(letterSince(),Date.now()-contactDays()*864e5),m=letterMaterial(since),sender=letterSender(m);
  const L={id:"let_"+Date.now(),ts:Date.now(),since,until:Date.now(),sender,...(await composeLetter(m,sender))};
  S.letters.unshift(L);S.letters=S.letters.slice(0,60);saveLocal();remotePut("prefs");
  return L;
}
function firstReturnText(){
  const n=firstName(),a=(S.asks||[]).find(x=>!x.noMem&&x.text),e=S.entries.find(usable),bits=[];
  if(a&&a.thread)bits.push("I still have the thread you left with me around "+a.thread.toLowerCase()+".");
  else if(e&&e.ritualTitle)bits.push("I remember you spent time with "+(G[e.guardian]||G.aura).name+" and "+e.ritualTitle+".");
  else bits.push("You do not have to prove anything before this place can remember you.");
  return (n?n+",\n\n":"")+"You're back. I kept your place. "+bits.join(" ")+" I am not going to make a thing out of how long you were gone. The point is that you should never have to come back and start from zero.\n\nThis is also where you get to decide how the Circle keeps in touch. You can ask for a wrap-up three times a day, daily, every three days, weekly, monthly or never. Notifications are a separate choice. And if you want the wider Circle involved, the guardians who actually touch your story can write too.\n\nYou choose the rhythm. I keep the thread.\n\nAura";
}
function createFirstReturnLetter(){
  if(firstReturnLetter())return firstReturnLetter();
  const since=firstActivity()||S.firstAwayAt||Date.now(),L={id:"let_"+Date.now(),kind:"first-return",sender:"aura",ts:Date.now(),since,until:Date.now(),sealed:false,title:"I kept your place",text:firstReturnText(),intention:"Choose the rhythm that feels useful, not demanding.",read:false};
  S.letters.unshift(L);saveLocal();remotePut("prefs");return L;
}
let returnLetterBusy=false;
function maybeFirstReturnLetter(){
  if(returnLetterBusy||firstReturnLetter()||!S.profile.onboarded||!S.firstAwayAt)return false;
  if(Date.now()-S.firstAwayAt<1000)return false;
  if($("#gate")||$("#intro")||$("#rite"))return false;
  if($("#talk"))closeTalk();if($("#scrim"))closeSheet();
  returnLetterBusy=true;const L=createFirstReturnLetter();S.firstAwayAt=0;saveLocal();setTimeout(()=>{showLetter(L);returnLetterBusy=false;},120);return true;
}
function noteAppAway(){
  if(!firstReturnLetter()&&S.profile.onboarded){S.firstAwayAt=Date.now();saveLocal();}
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")noteAppAway();else if(document.visibilityState==="visible")setTimeout(maybeFirstReturnLetter,250);});
window.addEventListener("pagehide",noteAppAway);
setTimeout(maybeFirstReturnLetter,1200);
/* During the 30 days after the free week: Aura still writes, but the letter stays sealed.
   Only the envelope is stored now. The words are written from that week's Archive when she joins and opens it. */
function sealLetter(){
  const since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
  const gs=[...new Set(weekEntries(since).map(e=>e.guardian).concat(weekChats(since).map(c=>c.g)).filter(g=>g&&g!=="aura"&&G[g]))];
  const L={id:"let_"+Date.now(),ts:Date.now(),since,until:Date.now(),sealed:true,gs,title:"A sealed letter"};
  S.letters.unshift(L);S.letters=S.letters.slice(0,60);saveLocal();remotePut("prefs");
  return L;
}
function sealedAbout(L){return L.gs&&L.gs.length?"I wrote about what you've been carrying, and your time with "+namesList(L.gs.slice(0,3))+".":"I wrote about what you've been carrying.";}
async function unsealLetter(L){
  toast("Opening your letter...");
  const m=letterMaterial(L.since,L.until),sender=letterSender(m);Object.assign(L,{sender},await composeLetter(m,sender),{sealed:false});
  saveLocal();remotePut("prefs");
  return L;
}
function sealedCount(){return S.letters.filter(l=>l.sealed).length;}
function envelopeSVG(sealed){return '<svg viewBox="0 0 64 44" width="58" height="40" aria-hidden="true"><rect x="1.5" y="1.5" width="61" height="41" rx="4" fill="#F3EAD3" stroke="#9A7414"/><path d="M2 3l30 22L62 3" fill="none" stroke="#9A7414" stroke-width="1.5"/><circle cx="32" cy="25" r="7" fill="#BF1E73"/><path d="M29 25a3 3 0 1 0 6 0a4 4 0 0 1-6 0z" fill="#F4D778"/>'+(sealed?'<rect x="44" y="26" width="14" height="12" rx="2" fill="#16132A"/><path d="M47 26v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#16132A" stroke-width="2"/><circle cx="51" cy="32" r="1.6" fill="#E7C45A"/>':'')+'</svg>';}
function auraSays(html,label){return '<div class="handoff aurasays" style="padding:0">'+guardianMark("aura")+'<p><span class="who2">'+(label||"Aura")+'</span>'+html+'</p></div>';}
function letterCardHTML(){
  if(lastRead)return "";
  const mem=isMember();
  if(!mem&&graceActive()&&letterDue())sealLetter();
  const l=lastLetter();
  if(!mem){
    if(l&&l.sealed&&Date.now()-l.ts<3*864e5)return '<button class="card letterc link" data-letter="'+l.id+'">'+envelopeSVG(true)+'<span><span class="label">A sealed letter from Aura</span><span class="lt">'+(firstName()?esc(firstName())+", I":"I")+' wrote to you.</span><span class="small muted">'+esc(sealedAbout(l))+' It\'s waiting in your mailbox. It opens when you join the Inner Circle.</span></span></button>';
    const since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
    if(!(weekEntries(since).length+weekChats(since).length))return "";
    return '<button class="card letterc link" data-paywall="A letter from Aura">'+envelopeSVG(true)+'<span><span class="label">A letter from Aura</span><span class="lt">I\'ve been paying attention to your week.</span><span class="small muted">In the Inner Circle, I write to you about it. What you carried, what helped, and where to go next.</span></span></button>';
  }
  if(letterDue())return '<button class="card letterc link" id="letterOpen">'+envelopeSVG()+'<span><span class="label">A letter from Aura</span><span class="lt">'+(firstName()?esc(firstName())+", I":"I")+' wrote you a letter.</span><span class="small muted">I looked back at what you have carried since I last wrote. Tap to open it.</span></span></button>';
  const sc=sealedCount();
  if(sc)return '<button class="card letterc link" data-letter="'+S.letters.find(x=>x.sealed).id+'">'+envelopeSVG()+'<span><span class="label">Your mailbox</span><span class="lt">'+(sc===1?"One letter I wrote you is":sc+" letters I wrote you are")+' ready to open.</span><span class="small muted">I kept writing while you were away. Tap to open.</span></span></button>';
  if(l&&!l.sealed&&Date.now()-l.ts<2*864e5&&!l.read)return '<button class="card letterc link" data-letter="'+l.id+'">'+envelopeSVG()+'<span><span class="label">A letter from Aura</span><span class="lt">'+esc(l.title)+'</span><span class="small muted">Tap to read it.</span></span></button>';
  return "";
}
function showLetter(L){
  track("letter_open");L.read=true;saveLocal();renderToday();renderArchive();
  openSheet('<div class="stack"><div class="page letter"><div class="kicker">A letter from '+esc((G[L.sender]||G.aura).name)+' · '+esc(fmtDate(L.ts))+'</div><h3>'+esc(L.title)+'</h3>'+
    L.text.split(/\n{2,}/).map(p=>'<p>'+esc(p).replace(/\n/g,"<br>")+'</p>').join("")+
    (L.intention?'<div class="intent"><b>'+esc(L.kind==="first-return"?"From here":"This time")+'</b>'+esc(L.intention)+'</div>':"")+'</div>'+
    (L.kind==="first-return"?contactSettingsHTML(true):"")+
    (L.next?'<button class="btn btn-main full" data-talk="'+L.next+'">Go to '+esc(G[L.next].name)+'</button>':"")+
    '<button class="btn btn-ghost full" data-talk="aura">Write back to Aura</button><button class="btn btn-ghost full" data-tabgo="archive">Open my mailbox</button><p class="small muted" style="text-align:center">Every letter is kept in your mailbox, in the Archive.</p></div>');
}
async function openLetter(id){
  const L=S.letters.find(x=>x.id===id);if(!L)return;
  if(L.sealed){
    if(!isMember()){openPaywall("A sealed letter from Aura");return;}
    await unsealLetter(L);
  }
  showLetter(L);
}
async function openLetterFlow(btn){
  if(btn){btn.disabled=true;btn.querySelector(".lt").textContent="Sealing your letter...";}
  const L=await writeLetter();
  showLetter(L);
}
function letterRow(l){const who=(G[l.sender]||G.aura).name;return '<button class="li" data-letter="'+l.id+'"><span>'+(l.sealed?"🔒 ":"")+esc(l.sealed?"Sealed letter":l.title)+'<br><span class="small muted">'+esc(who)+" · "+esc(fmtDate(l.ts))+(l.sealed?" · "+esc(sealedAbout(l)):"")+'</span></span><span class="small muted">'+(l.sealed?(isMember()?"Open":"Sealed"):"Read")+'</span></button>';}
function lettersArchiveHTML(){
  const mem=isMember(), sc=sealedCount(),unread=S.letters.filter(l=>!l.read).length;
  if(!S.letters.length){
    if(!mem)return '<div class="card"><div class="label">Your mailbox</div>'+auraSays("In the Inner Circle, I write to you at the rhythm you choose about what you carried, what helped and where to go next. Every letter stays here.")+'<button class="btn btn-ghost" style="margin-top:10px" data-paywall="Letters from Aura">See the Inner Circle</button></div>';
    return '<div class="card"><div class="label">Your mailbox</div>'+auraSays("My first letter comes when you return after your first visit. After that, you choose the rhythm. Every one I write stays here.")+'</div>';
  }
  return '<div class="card mailbox"><div class="mailhead">'+envelopeSVG(false)+'<div><div class="label">Your mailbox</div><h3>'+S.letters.length+' letter'+(S.letters.length===1?"":"s")+(unread?" · "+unread+" unread":"")+'</h3></div></div><p class="small muted" style="margin:6px 0 10px">Everything the Circle writes you stays here. Tap any letter to open it.</p>'+S.letters.slice(0,30).map(letterRow).join("")+
    (!mem&&sc?'<div style="margin-top:10px">'+auraSays(sc===1?"One of these is sealed. It opens the moment you join.":sc+" of these are sealed. They all open the moment you join.")+'</div><button class="btn btn-main full" style="margin-top:10px" data-paywall="Open your letters">Open my letters</button>':"")+'</div>';
}

/* Guardian check-ins: 1.5 to 6 days after you worked with a guardian, they come back and ask how it went. */
function lastTouch(){
  const t={};
  for(const e of S.entries)if(usable(e)&&e.guardian&&e.guardian!=="aura"&&(!t[e.guardian]||e.ts>t[e.guardian].ts))t[e.guardian]={ts:e.ts,e};
  for(const k of ALL){if(k==="aura")continue;const ms=(S.chats[k]||[]).filter(m=>m.role==="me"&&m.ts);const m=ms[ms.length-1];if(m&&(!t[k]||m.ts>t[k].ts))t[k]={ts:m.ts,said:m.text};}
  return t;
}
function nudgeCandidate(){
  const cp=contactPref();if(!isMember()||cp.enabled!==true||cp.scope!=="circle")return null;
  const now=Date.now();
  if(S.nudges.some(n=>now-n.ts<20*36e5))return null;
  const t=lastTouch();let best=null;
  for(const [k,v] of Object.entries(t)){
    const age=now-v.ts;if(age<1.5*864e5||age>6*864e5)continue;
    if(S.nudges.some(n=>n.g===k&&n.ts>v.ts))continue;
    if(safetyKind((v.e&&(v.e.carrying+" "+v.e.text))||v.said))continue;
    if(!best||v.ts>best.ts)best={g:k,...v};
  }
  return best;
}
function pendingNudge(){return S.nudges.find(n=>n.status==="new")||null;}
let nudgeBusy=false;
async function makeNudge(){
  const c=nudgeCandidate();if(!c||nudgeBusy||pendingNudge())return;
  nudgeBusy=true;
  const g=G[c.g], n=firstName(), day=new Date(c.ts).toLocaleDateString(undefined,{weekday:"long"});
  const what=c.e?("On "+day+" she did "+(c.e.ritualTitle||"a ritual")+" with you. She was carrying: "+(c.e.carrying||"(not said)")+". She wrote: "+(c.e.text||"(nothing)")+(c.e.after?". Afterward she felt: "+c.e.after:"")):("On "+day+" she told you: "+c.said);
  let text="";
  try{
    const out=await aiJSON("You are "+g.name+", "+g.title+", a guardian in The Daily Alchemist. Your domain: "+g.domain+" Your voice: "+g.voice+"\n\n"+what+"\n\nLONG-TERM MEMORY:\n"+ledgerText()+"\n\n"+
      "You are checking in on her on your own, a few days later, the way a friend who remembers would. Write 2 or 3 short sentences in your own voice. Start with her first name"+(n?" ("+n+")":"")+". Mention the specific thing she brought you. Ask one real question about how it's going now. No em dashes, no advice yet, no diagnosing.\n"+'Reply with ONLY JSON: {"text":"..."}');
    text=clean(String(out&&out.text||""));
  }catch(e){}
  if(!text){const ref=c.e?(c.e.carrying?'what you brought me on '+day+': "'+c.e.carrying.slice(0,70)+'"':(c.e.ritualTitle?"our "+c.e.ritualTitle+" on "+day:"what you brought me on "+day)):"what you told me on "+day;text=(n?n+", it's ":"It's ")+g.name+". I keep thinking about "+ref+". How is it sitting with you now?";}
  S.nudges.unshift({id:"nud_"+Date.now(),g:c.g,ts:Date.now(),text,status:"new"});S.nudges=S.nudges.slice(0,40);
  saveLocal();remotePut("prefs");nudgeBusy=false;
  const slot=$("#nudgeSlot");if(slot)slot.innerHTML=nudgeHTML();
}
function nudgeHTML(){
  const nd=pendingNudge();if(!nd||!G[nd.g])return "";
  const g=G[nd.g];
  return '<div class="card checkin nudge" style="border-color:'+g.color+'66"><div class="handoff" style="padding:0">'+guardianMark(nd.g)+'<p><span class="who2" style="color:'+g.color+'">'+esc(g.name)+' is checking in</span>'+esc(nd.text)+'</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-nudge="'+nd.id+':reply">Answer '+esc(g.name)+'</button><button class="btn btn-ghost" data-nudge="'+nd.id+':later">Not now</button></div></div>';
}
function nudgeAction(id,act){
  const nd=S.nudges.find(n=>n.id===id);if(!nd)return;
  track("nudge_"+act,{g:nd.g});
  if(act==="reply"){nd.status="replied";const l=S.chats[nd.g]=S.chats[nd.g]||[];guardianOpens(l,{text:nd.text});saveLocal();remotePut("chat",nd.g,{kind:"chat",msgs:l});remotePut("prefs");openTalk(nd.g);}
  else{nd.status="dismissed";saveLocal();remotePut("prefs");}
  const slot=$("#nudgeSlot");if(slot)slot.innerHTML=nudgeHTML();
}

function openHow(){
  track("how_open");
  const pts=[
   ["Tell me what you\'re carrying.","Type it, say it, or tap the feelings that fit. One word is enough."],
   ["I\'ll find the right guardian.","Each of the 19 has their own rituals and their own voice. I\'ll tell you who they are the first time you meet."],
   ["You never have to explain it twice.","I remember what you tell me, what helped and what didn\'t, and I bring it back when it matters."],
   ["Don\'t feel like talking?","Today\'s practice is always waiting a little further down."],
   ["Can\'t think?","Tap Can\'t think and I\'ll just breathe with you."],
   ["It\'s all yours.","Everything lands in your Archive. Anything marked for your eyes only, I never read."]];
  openSheet('<div class="stack"><div class="popseal">'+glyph("aura",64)+'</div><div style="text-align:center"><div class="label">How it works</div><h2>A few things about me.</h2></div>'+
   pts.map((x,i)=>'<div class="howpt"><span class="hn">'+["I","II","III","IV","V","VI"][i]+'</span><span><b>'+x[0]+'</b><span class="small muted">'+x[1]+'</span></span></div>').join("")+
   '<button class="btn btn-main full" id="popClose">Got it</button><button class="linkish" data-fb="how" style="align-self:center">Something confusing? Tell me.</button></div>');
}
