/* ------------------------------------------------------------------
   TESTING: anonymous usage events and feedback, so a small group of testers
   can show where people get lost and whether they come back on day 2.
   Events never include anything anyone wrote. Only what kind of thing happened.
------------------------------------------------------------------ */
if(!S.dev)S.dev="d"+Math.random().toString(36).slice(2,10);
function dayNum(){return Math.floor((Date.now()-(S.profile.firstSeen||Date.now()))/864e5);}
/* Taps are recorded only while someone has said yes to sharing for the week. Never words. */
let evQ=[],evTimer=null;
function plat(){if(isNative())return window.Capacitor.getPlatform();const u=navigator.userAgent;return /iPhone|iPad/.test(u)?"iphone-web":/Android/.test(u)?"android-web":"desktop";}
function track(ev,meta){
  try{
    if(!monitorOn())return;
    if(!shareScope().includes(EVCAT[ev]||"pages"))return;
    evQ.push({ev,t:Date.now(),meta:{...(meta||{}),day:dayNum(),stage:typeof stage==="function"?stage():0,plat:plat()}});
    if(evQ.length>=40)flushEvents();else if(!evTimer)evTimer=setTimeout(flushEvents,8000);
  }catch(e){}
}
async function flushEvents(keep){
  clearTimeout(evTimer);evTimer=null;if(!evQ.length)return;
  const batch=evQ.splice(0,60);
  if(!accountsOn()){S.previewEvents=(S.previewEvents||[]).concat(batch).slice(-300);saveLocal();return;}
  try{
    if(keep&&ACCT.token){fetch(((window.DA_CONFIG&&window.DA_CONFIG.apiBase)||"")+"/api/track",{method:"POST",keepalive:true,headers:{"content-type":"application/json",authorization:"Bearer "+ACCT.token},body:JSON.stringify({events:batch})});}
    else await api("/api/track",{events:batch});
  }catch(e){}
}
let sessStart=Date.now();
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="hidden"){track("session",{sec:Math.round((Date.now()-sessStart)/1000)});flushEvents(true);}
  else{sessStart=Date.now();trackOpen();}
});
function trackOpen(){const k=dayKey(new Date());if(S.lastOpen===k)return;S.lastOpen=k;saveLocal();track("open");}
function askFeedback(){return !window.DA_CONFIG||window.DA_CONFIG.askFeedback!==false;}
function openFeedback(where){
  openSheet('<div class="stack"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("I\'m still new, and you\'re helping shape me. What confused you? What did you love? What\'s missing? Anything goes.","Aura")+
   '<div class="chips" id="fbMood">'+["I love it","It\'s okay","I\'m confused","Something broke"].map(m=>'<button class="chip" data-fbmood="'+m+'" aria-pressed="false">'+m+'</button>').join("")+'</div>'+
   '<div class="composer"><label class="sr" for="fbText">Your feedback</label><textarea id="fbText" placeholder="Type it or say it."></textarea>'+micBtn("fbText")+'</div>'+
   '<button class="btn btn-main full" id="fbSend" data-where="'+esc(where||"")+'">Send</button><button class="btn btn-ghost full" id="popClose">Not now</button></div>');
}
async function sendFeedback(where){
  const text=($("#fbText").value||"").trim(), m=document.querySelector('#fbMood [aria-pressed="true"]'), mood=m?m.dataset.fbmood:"";
  if(!text&&!mood){$("#fbText").focus();return;}
  const row={text:text.slice(0,4000),mood,screen:where||"",day:dayNum(),name:firstName()};
  try{
    if(MODE==="artifact"&&cloud.db){await cloud.db.collection("feedback").doc("fb"+Date.now().toString(36)).set({...row,dev:S.dev,ts:Date.now()});}
    else if(ACCT.sb&&ACCT.user){const r=await api("/api/feedback",{text:row.text,mood,screen:row.screen,day:row.day,name:row.name});if(r&&r.error)await ACCT.sb.from("feedback").insert({user_id:ACCT.user.id,email:ACCT.email||null,text:row.text,mood,screen:row.screen,day:row.day});}
    else{S.fbQueue=(S.fbQueue||[]).concat([{...row,ts:Date.now()}]);saveLocal();}
  }catch(e){}
  track("feedback",{mood,reason:where==="after visit"?"after visit":"sent"});S.fbAsked=true;saveLocal();closeSheet();toast(where==="after visit"?"Thank you. "+ownerName()+" will read every word.":"Thank you. I read every word.");
}
/* Friends Week: each time someone comes back to the app during their first 7 days, Aura offers
   a quick, optional note for Erica about their last visit. Nothing is required; they can close it. */
function openVisitNote(){
  if(!inFriendsWeek()||$("#scrim")||$("#rite")||$("#talk")||$("#gate")||$("#phoneOnly"))return;
  track("feedback",{reason:"offered"});
  openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("Quick one, and only if you feel like it. Anything about your last visit you\'d tell "+esc(ownerName())+"? What felt good, what was confusing, what you wish was here. Close this if not.","Aura · a note for "+esc(ownerName()))+
   '<div class="chips" id="fbMood">'+["Loved it","It was okay","Confusing","Something broke"].map(m=>'<button class="chip" data-fbmood="'+m+'" aria-pressed="false">'+m+'</button>').join("")+'</div>'+
   '<div class="composer"><label class="sr" for="fbText">Your note</label><textarea id="fbText" placeholder="Type or say anything. Or nothing."></textarea>'+micBtn("fbText")+'</div>'+
   '<button class="btn btn-main full" id="fbSend" data-where="after visit">Send to '+esc(ownerName())+'</button><button class="btn btn-ghost full" id="popClose">Close</button>'+
   '<p class="small muted" style="text-align:center">This goes to '+esc(ownerName())+' with your name. It\'s separate from your private words with the guardians. This note only appears during your first week.</p></div>');
}
(function(){let hiddenAt=0;
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){hiddenAt=Date.now();S.lastHidden=hiddenAt;saveLocal();}else if(hiddenAt&&Date.now()-hiddenAt>3*60*1000){hiddenAt=0;setTimeout(openVisitNote,1200);}});
  setTimeout(()=>{if(S.lastHidden&&Date.now()-S.lastHidden>3*60*1000&&S.profile.onboarded)openVisitNote();},4500);
})();
/* On day 2 or later, once, Aura asks for a thought. */
function maybeAskFeedback(){
  if(inFriendsWeek())return;
  if(!askFeedback()||S.fbAsked||dayNum()<1||S.entries.length<1||$("#scrim")||$("#rite")||$("#talk"))return;
  S.fbAsked=true;saveLocal();openFeedback("day2");
}

function metList(){return ALL.filter(k=>k!=="aura"&&metCount(k)>0);}
function stage(){const n=S.entries.length, m=metList().length;return n>=3?2:(n>=1||m>=1)?1:0;}
/* TODAY. Aura is the operating system: she greets you, says what she's noticed, asks what
   happened, and offers one thing to do, one thing she remembers and one way to go deeper.
   The moon and season are context for her, not the headline. */
function greeting(){const h=new Date().getHours(),n=firstName();return (h<5?"Still up":h<12?"Good morning":h<17?"Good afternoon":"Good evening")+(n?", "+n:"")+".";}
function hist(){return [...S.entries.filter(e=>usable(e)&&!S.forgotThreads.includes(e.thread)).map(e=>({ts:e.ts,thread:e.thread||e.theme,g:e.guardian,text:e.carrying||e.text||"",kind:"entry",title:e.ritualTitle})),...S.asks.filter(a=>!a.noMem&&!S.forgotThreads.includes(a.thread)).map(a=>({ts:a.ts,thread:a.thread||a.theme,g:a.guardian,text:a.text,kind:"ask",title:a.ritualTitle}))].sort((a,b)=>b.ts-a.ts);}
function localBrief(){
  const H=memOn()?hist():[],wk=H.filter(x=>Date.now()-x.ts<7*864e5),c={};
  for(const x of wk)if(x.thread)c[x.thread]=(c[x.thread]||0)+1;
  const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0],last=H.find(x=>x.text);
  let obs="";
  if(top&&top[1]>=2)obs="You've brought up "+top[0].toLowerCase()+" "+top[1]+" times this week."+(last&&last.text?" Last time you said, \""+(last.text.length>80?last.text.slice(0,80)+"...":last.text)+"\"":"");
  else if(last&&last.text)obs=(Date.now()-last.ts<36*3600e3?"Yesterday":"Last time")+" you told me, \""+(last.text.length>90?last.text.slice(0,90)+"...":last.text)+"\"";
  const carried=S.asks.find(a=>a.follow&&a.follow.carry&&!a.noMem);
  const L=ledger(),pool=memOn()?[...(S.memNotes||[]).map(n=>n.text),...["threads","intentions","commitments","situations"].flatMap(k=>L[k]||[])]:[];
  const remembered=carried?"You asked me to keep carrying "+(carried.thread||"this")+(carried.follow.changed?". Last you said: \""+carried.follow.changed.slice(0,90)+"\"":"."):pool.length?pool[hash(dayKey(new Date()))%pool.length]:"";
  const gc={};for(const x of wk)if(x.g&&x.g!=="aura")gc[x.g]=(gc[x.g]||0)+1;const tg=Object.entries(gc).sort((a,b)=>b[1]-a[1])[0];
  let rid=null,why="";if(tg&&tg[1]>=2){const rr=pickForNow(R.filter(r=>canUse(r)&&!r.reset&&r.g===tg[0]&&!doneRecently(r.id,3)),new Date(),"today");if(rr){rid=rr.id;why=G[tg[0]].name+" has been with you most this week";}}
  return {observation:obs,remembered,ritualId:rid,why};
}
let briefBusy=false;
async function refreshBrief(){
  if(briefBusy||!memOn())return;const H=hist();if(H.length<2)return;
  const key=dayKey(new Date())+":"+H.length+":"+arcPart(daypart());if(S.brief&&S.brief.key===key)return;
  if(MODE==="artifact"){const s=await getSample();if(!s)return;}else if(!ACCT.user)return;
  briefBusy=true;
  try{
    const catalog=R.filter(r=>canUse(r)&&!r.reset).map(r=>r.id+" | "+G[r.g].name+" | "+r.title+" | "+r.min+" min | for: "+r.purpose).join("\n");
    const out=await aiJSON("You are Aura, the lead guardian of The Daily Alchemist. You open the app for her before she says a word, like a friend who has been paying attention.\n"+focusText()+"Today: "+today.toDateString()+". Moon: "+M.name+". Season: "+SEA.cur.name+". Use these only as quiet context, never as the headline.\n\nWHAT SHE HAS TOLD YOU LATELY:\n"+asksText()+"\n\nHER RECENT ARCHIVE:\n"+historyText().slice(0,3000)+"\n\nLONG-TERM MEMORY:\n"+ledgerText()+"\n\nWHAT HAS HELPED HER:\n"+workedText()+"\n\nRITUAL LIBRARY:\n"+catalog+"\n\nWrite: observation = one or two short sentences, in your voice, about what today seems to be about for her, grounded in the patterns above (count repeats, quote her briefly, name what she wanted). Then say what kind of day you think it is, for example: I think today is a grounding and inventory day. remembered = one specific thing from her history worth bringing back today, in plain words. ritualId = the one practice from the library that fits today best. why = one sentence on why that one. No em dashes. No emojis. Never mention health diagnoses.\nReply with ONLY JSON: {\"observation\":\"\",\"remembered\":\"\",\"ritualId\":\"\",\"why\":\"\"}",null);
    if(out&&out.observation){S.brief={key,observation:clean(out.observation).slice(0,320),remembered:clean(out.remembered||"").slice(0,220),ritualId:byId[out.ritualId]&&canUse(byId[out.ritualId])?out.ritualId:null,why:clean(out.why||"").slice(0,200)};saveLocal();if(!lastRead&&!$("#v-today").hidden)renderToday();}
  }catch(e){}finally{briefBusy=false;}
}
function todayBrief(){const lb=localBrief(),H=memOn()?hist():[],key=dayKey(new Date())+":"+H.length;if(S.brief&&S.brief.key&&S.brief.key.startsWith(dayKey(new Date())))return {...lb,...Object.fromEntries(Object.entries(S.brief).filter(([,v])=>v))};return lb;}
function deeperHTML(){
  const pl=activePlan();if(pl){const i=pl.steps.findIndex(s=>!s.done);return {label:"Your path · "+pl.title,text:"Step "+(i+1)+" of "+pl.steps.length+": "+(pl.steps[i].title||"next step"),btn:'<button class="btn btn-ghost" data-planstep="'+pl.id+':'+i+'">Continue</button>'};}
  const rn=resetNext();if(rn&&rn.started)return {label:"The 7-Day Energy Reset",text:"Day "+rn.base.reset+": "+rn.r.title+(rn.note?". "+rn.note:""),btn:'<button class="btn btn-ghost" data-reset="'+rn.base.id+'">Do Day '+rn.base.reset+'</button>'};
  const jn=JOURNEYS.find(j=>{const d=journeyDays(j.id).length;return d>0&&d<7;});if(jn&&isMember()){const n=[1,2,3,4,5,6,7].find(x=>!journeyDays(jn.id).includes(x)),a=journeyStep(jn,n);return {label:jn.name,text:"Day "+n+": "+a.r.title+(a.note?". "+a.note:""),btn:'<button class="btn btn-ghost" data-jday="'+jn.id+':'+n+'">Do Day '+n+'</button>'};}
  const yg=yourGuardians()[0];if(yg)return {label:"Go deeper with "+G[yg].name,text:JOB[yg],btn:'<button class="btn btn-ghost" data-talk="'+yg+'">Talk to '+esc(G[yg].name)+'</button>'};
  if(hist().length>=3)return {label:"Your Archive",text:"Ask your own history anything. When did this start? What helped last time?",btn:'<button class="btn btn-ghost" data-tabgo="archive">Ask my Archive</button>'};
  return {label:"The 7-Day Energy Reset",text:"Seven short sessions, seven voices of the circle, at your own pace.",btn:'<button class="btn btn-ghost" data-tabgo="journeys">Take a look</button>'};
}
/* The day has a shape. Morning: how you slept and what's in the tank (Aurora). Midday: did you
   move (Rowan). Evening: wind down (Juniper, Willow, Fern). Aura reads the pattern across weeks.
   None of it is shared with anyone, and none of it is medical. */
if(!S.days)S.days={};
const SLEEPQ=[["Rough",1],["Okay",2],["Good",3],["Great",4]],ENERGYQ=[["Low",1],["Some",2],["Good",3]],MOVEDQ=[["Not yet",0],["A little",1],["Yes",2]];
function nightKey(d){d=new Date(d||Date.now());if(d.getHours()<5)d=new Date(d.getTime()-864e5);return dayKey(d);}
function dayRec(k){k=k||dayKey(new Date());return S.days[k]||(S.days[k]={});}
function partOfDay(){const h=new Date().getHours();return h>=5&&h<11?"morning":h>=11&&h<17?"midday":"evening";}
function woundDown(k){return !!(S.days[k]&&S.days[k].wind)||S.entries.some(e=>e.ritualId&&nightKey(e.ts)===k&&(new Date(e.ts).getHours()>=17||new Date(e.ts).getHours()<5));}
function morningScore(d){if(!d)return null;const a=[];if(d.sleep)a.push(d.sleep/4);if(d.energy)a.push(d.energy/3);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;}
function rhythmInsight(){
  const w=[],nw=[],mv=[],nmv=[];
  for(let i=0;i<42;i++){const d=new Date(Date.now()-i*864e5),k=dayKey(d),sc=morningScore(S.days[k]);if(sc==null)continue;
    const pk=dayKey(new Date(d.getTime()-864e5));(woundDown(pk)?w:nw).push(sc);const pd=S.days[pk];if(pd&&pd.moved!=null)(pd.moved>0?mv:nmv).push(sc);}
  const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
  if(w.length>=3&&nw.length>=2&&avg(w)-avg(nw)>=.15)return "The nights you wound down, your mornings came in lighter. That's "+w.length+" mornings so far.";
  if(mv.length>=3&&nmv.length>=2&&avg(mv)-avg(nmv)>=.15)return "The days after you moved, you woke up with more in the tank.";
  if(w.length+nw.length>=5&&avg([...w,...nw])<.45)return "Your mornings have been running low for a while. Let's protect your evenings this week.";
  return "";
}
function lowTank(){const d=S.days[dayKey(new Date())];return !!(d&&((d.sleep&&d.sleep<=1)||(d.energy&&d.energy<=1)));}
function chipsQ(name,list,cur){return '<div class="chips" style="margin-top:8px">'+list.map(([l,v])=>'<button class="chip" data-'+name+'="'+v+'" aria-pressed="'+(cur===v)+'">'+esc(l)+'</button>').join("")+'</div>';}
const WATCH_NOTE=NATIVE?"":'<p class="small muted" style="margin-top:10px">Sleep and workouts from your Apple Watch or Fitbit come with the App Store and Google Play app on November 1.</p>';
function daysUntilMD(md){const [m,d]=String(md||"").split("-").map(Number);if(!m||!d)return null;const n=new Date();n.setHours(0,0,0,0);let t=new Date(n.getFullYear(),m-1,d);if(t<n)t=new Date(n.getFullYear()+1,m-1,d);return Math.round((t-n)/864e5);}
function recentGuardians(){
  const last={};
  for(const [k,l] of Object.entries(S.chats||{})){const m=(l||[]).filter(x=>x.role==="me").pop();if(m&&G[k]&&k!=="aura")last[k]=Math.max(last[k]||0,m.ts||0);}
  for(const e of S.entries)if(e.guardian&&G[e.guardian]&&e.guardian!=="aura")last[e.guardian]=Math.max(last[e.guardian]||0,e.ts||0);
  for(const k of Object.keys(S.met||{}))if(G[k]&&k!=="aura"&&!last[k])last[k]=1;
  return Object.entries(last).filter(([k])=>allowedG(k)).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
}
function yourCircleHTML(){
  const ks=recentGuardians().slice(0,6);
  if(!ks.length)return '<div class="card yourcircle"><div class="label">Your guardians</div><p class="small" style="margin-top:6px">Aura picks for you, or you can choose who to talk to.</p><button class="btn btn-ghost" data-gocircle="1" style="margin-top:10px">Pick a guardian</button></div>';
  const k0=ks[0];
  return '<div class="card yourcircle"><div class="label">Your guardians</div>'+
    '<button class="btn btn-main full" data-talk="'+k0+'" style="margin-top:10px">Keep going with '+esc(G[k0].name)+'</button>'+
    '<div class="gchips">'+ks.slice(1).map(k=>'<button class="gchip" data-talk="'+k+'" aria-label="Talk to '+esc(G[k].name)+'">'+glyph(k,40)+'<span>'+esc(G[k].name)+'</span></button>').join("")+'<button class="gchip" data-gocircle="1" aria-label="Pick any guardian"><span class="gplus">+</span><span>Anyone</span></button></div></div>';
}
function bdayHTML(){
  let h="";const mine=daysUntilMD(S.profile.bday),pn=S.profile.person;
  if(mine===0)h+='<div class="card rhythm"><div class="speaker">'+glyph("aura",30)+'<span class="who" style="color:var(--gold)">Aura · today</span></div><p style="margin-top:8px">Happy birthday'+(firstName()?", "+esc(firstName()):"")+'. It\'s your own new year'+(signOf(S.profile.bday)?', and '+esc(signOf(S.profile.bday).name)+' season is yours':'')+'. Let\'s mark it.</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-begin="birthday-threshold">The Birthday Threshold</button></div></div>';
  const pd=pn&&daysUntilMD(pn.bday);
  if(pn&&pd!=null&&pd<=7)h+='<div class="card rhythm"><div class="speaker">'+glyph("marigold",30)+'<span class="who" style="color:'+G.marigold.color+'">Marigold · coming up</span></div><p style="margin-top:8px">'+esc(pn.name||(pn.mode==="partner"?"Your partner":"Your crush"))+'\'s birthday is '+(pd===0?"today":pd===1?"tomorrow":"in "+pd+" days")+'. Want help making it feel like you meant it?</p><div class="row" style="margin-top:10px"><button class="btn btn-ghost" data-talk="marigold">Plan it with Marigold</button></div></div>';
  return h;
}
function threadInfo(name){
  const k=String(name||"").toLowerCase(),as=S.asks.filter(a=>(a.thread||"").toLowerCase()===k&&!a.noMem),es=S.entries.filter(e=>(e.thread||"").toLowerCase()===k);
  const ts=as.map(a=>a.ts).concat(es.map(e=>e.ts));if(!ts.length)return null;
  const first=Math.min(...ts),last=Math.max(...ts),days=Math.max(1,Math.round((Date.now()-first)/864e5));
  const lastAsk=as.slice().sort((a,b)=>b.ts-a.ts)[0];
  const recent=ts.filter(t=>Date.now()-t<14*864e5).length,prior=ts.filter(t=>Date.now()-t>=14*864e5&&Date.now()-t<28*864e5).length;
  const gaps=ts.slice().sort((a,b)=>a-b).some((t,i,a)=>i&&t-a[i-1]>7*864e5);
  let status=lastAsk&&lastAsk.follow&&lastAsk.follow.still?"unresolved":lastAsk&&lastAsk.follow&&/better|helped/i.test(lastAsk.follow.helped||"")?"easing":recent>prior+1&&prior>0?"coming up more":gaps&&Date.now()-last<7*864e5?"resurfaced":Date.now()-last>21*864e5?"quiet lately":"open";
  return {name,days,talks:as.length||es.length,status,last,lastAsk};
}
function noticings(){
  if(!memOn())return [];
  const out=[],mo=Date.now()-30*864e5,as=S.asks.filter(a=>a.ts>mo&&!a.noMem),es=S.entries.filter(e=>e.ts>mo);
  const top=threadsOf()[0];
  if(top){const late=as.filter(a=>a.thread===top[0]&&new Date(a.ts).getHours()>=20).length,all=as.filter(a=>a.thread===top[0]).length;if(all>=3&&late/all>=0.6)out.push(top[0]+" has come up more often after 8 PM lately.");}
  const rel=es.filter(e=>{const r=byId[e.ritualId];return r&&/release|let go|burn|cut|banish|dissolve/i.test(r.purpose+" "+r.title+" "+(r.tags||[]).join(" "));}).length;
  if(rel>=3)out.push("You've chosen release rituals "+rel+" times this month.");
  const gc={};for(const e of es)if(e.guardian&&e.guardian!=="aura")gc[e.guardian]=(gc[e.guardian]||0)+1;const tg=Object.entries(gc).sort((a,b)=>b[1]-a[1])[0];
  if(tg&&tg[1]>=3&&G[tg[0]])out.push(G[tg[0]].name+" has been with you most this month.");
  const helped=es.filter(e=>e.after==="Lighter"),hg={};for(const e of helped)hg[e.guardian]=(hg[e.guardian]||0)+1;const th=Object.entries(hg).sort((a,b)=>b[1]-a[1])[0];
  if(th&&th[1]>=2&&G[th[0]]&&(!tg||th[0]!==tg[0]))out.push("You've come away lighter most often with "+G[th[0]].name+".");
  const eve=es.filter(e=>new Date(e.ts).getHours()>=17).length;if(es.length>=5&&eve/es.length>=0.7)out.push("Most of your rituals happen in the evening.");
  return out.slice(0,4);
}
function heavyEvenings(){let n=0;for(let i=0;i<7;i++){const d=new Date(Date.now()-i*864e5),k=dayKey(d);if(S.asks.some(a=>dayKey(new Date(a.ts))===k&&new Date(a.ts).getHours()>=17&&!["hopeful"].includes(a.theme)))n++;}return n;}
function whyThis(t){return t?'<details class="whythis"><summary>Why this?</summary><p class="why" style="margin-top:6px">'+t+'</p></details>':'';}
function eveningPick0(ins){
  const day=Date.now()-18*3600e3,today=S.asks.filter(a=>a.ts>day),txt=today.map(a=>a.text||"").join(" ").toLowerCase(),d=S.days[dayKey(new Date())]||{};
  const pool=g=>R.filter(r=>canUse(r)&&!r.reset&&r.g===g&&r.min<=15&&!r.bath);
  let g=daypart()==="transition"?"juniper":"fern",why=[];const h=new Date().getHours();
  if(/anxious|anxiety|overthink|racing|can'?t (stop|shut|sleep)|spiral|worried|panic/.test(txt)||today.some(a=>a.guardian==="lily")){g="lily";why.push("Earlier today your mind was running hot, and you can't sleep on a racing head");}
  else if(/grie|miss (him|her)|died|loss|funeral/.test(txt)||today.some(a=>a.guardian==="willow")){g="willow";why.push("You've been carrying grief today, and it deserves somewhere soft to land before sleep");}
  else if(lowTank()||/tired|exhausted|drained|burn/.test(txt)){g="fern";why.push(lowTank()?"You started today with a low tank":"You told me you're running on empty");}
  else{why.push(today.length?"You've had a full day":"It's the end of the day");}
  if(M.name.includes("Waning")||M.name.includes("Crescent")&&!M.waxing)why.push("the moon is waning, so tonight is for letting go, not starting something");
  if(ritualsToday()>=1)why.push("you've already done "+ritualsToday()+(ritualsToday()===1?" ritual":" rituals")+" today, so I kept this one short");
  if(h>=22)why.push("it's late");
  const p=pool(g).length?pool(g):pool("fern").length?pool("fern"):pool("juniper");
  const r=pickForNow(p,new Date(),"wind")||byId["two-minute-settle"];
  return {r,why:esc(why.join(", ").replace(/^./,c=>c.toUpperCase()))+". "+esc(G[r.g].name)+" is better for tonight than anything that asks more of you."+(ins?" "+esc(ins):"")};
}
function eveningPick(ins){
  const base=eveningPick0(ins),r=base.r,h=new Date().getHours(),d=S.days[dayKey(new Date())]||{};
  const now=[],you=[],thisR=[];
  now.push(h>=22||h<5?"It's late":"It's evening");
  if(M.name.includes("Waning")||(!M.waxing&&M.name.includes("Crescent")))now.push("the moon is waning");
  const up=upcomingDates?upcomingDates(2):[];if(up.length)now.push(up[0].name+" is coming up");
  if(memOn()){
    const he=heavyEvenings();if(he>=3)you.push("you've had "+he+" heavy evenings this week");
    const open=threadsOf().map(t=>threadInfo(t[0])).filter(x=>x&&x.status!=="quiet lately"&&Date.now()-x.last<10*864e5)[0];
    if(open)you.push("you've been carrying "+open.name.toLowerCase()+" for "+open.days+(open.days===1?" day":" days")+(open.status==="unresolved"?" and it's still unresolved":""));
    if(lowTank())you.push("you started today with a low tank");
    const last=S.entries.find(e=>e.guardian===r.g&&e.after==="Lighter");if(last)you.push(G[r.g].name+" helped you last time");
    const longNight=S.entries.filter(e=>new Date(e.ts).getHours()>=21&&byId[e.ritualId]&&byId[e.ritualId].min>15).length;if(longNight===0&&S.entries.length>=4)you.push("you don't tend to do long rituals at night");
  }
  thisR.push(G[r.g].name+"'s "+r.title+" takes "+r.min+" minutes");
  const writes=r.steps.some(st=>/write|journal|list/i.test(st.d||""));if(!writes)thisR.push("doesn't ask you to write anything");
  thisR.push(/close|end|settle|rest|still|sleep|release|let/i.test(r.purpose+" "+r.steps.map(x=>x.t).join(" "))?"closes the day instead of opening something new":"is gentle enough for tonight");
  const cap=x=>x.charAt(0).toUpperCase()+x.slice(1);
  const why=esc(cap(now.join(" and ")))+". "+(you.length?esc(cap(you.slice(0,2).join(", and ")))+". ":"")+esc(cap(thisR[0]+", "+thisR.slice(1).join(" and ")))+".";
  // Permission to recommend nothing.
  const enough=ritualsToday()>=2||(lowTank()&&(h>=23||h<4))||(h>=0&&h<4&&ritualsToday()>=1);
  return {r,why,nothing:enough,nothingWhy:esc(cap(now.join(" and ")))+". "+(ritualsToday()?"You've already done "+ritualsToday()+(ritualsToday()===1?" ritual":" rituals")+" today. ":"")+(lowTank()?"You started with a low tank. ":"")+"Another ritual would be one more task, and you don't need one."};
}
function wroteSteps(r){return !!r&&r.steps.some(st=>/write|journal|list/i.test(st.d||""));}
function weekWith(g){return S.entries.filter(e=>e.guardian===g&&Date.now()-e.ts<7*864e5).length;}
function releaseThisWeek(){return S.entries.filter(e=>{const r=byId[e.ritualId];return Date.now()-e.ts<7*864e5&&r&&/release|let go|burn|cut|banish|dissolve/i.test(r.purpose+" "+r.title+" "+(r.tags||[]).join(" "));}).length;}
function personalPick(pk){
  if(!memOn())return pk;
  const r0=pk.r,mine=[];
  // writing made it worse last time: choose something without writing
  const hurt=S.entries.find(e=>wroteSteps(byId[e.ritualId])&&["Stirred up","The same"].includes(e.after)&&Date.now()-e.ts<30*864e5);
  if(hurt&&wroteSteps(r0)){const alt=R.filter(x=>canUse(x)&&!x.reset&&x.g===r0.g&&x.min<=15&&!x.bath&&!wroteSteps(x))[0]||R.filter(x=>canUse(x)&&!x.reset&&["juniper","lily","fern"].includes(x.g)&&x.min<=15&&!x.bath&&!wroteSteps(x))[0];if(alt){pk.r=alt;mine.push("Last time you were this wound up, writing made it harder. That's why I chose something without writing.");}}
  else if(hurt)mine.push("Last time you were this wound up, writing made it harder, so tonight there's nothing to write.");
  // release done twice on something still unresolved: stop prescribing release
  const open=threadsOf().map(t=>threadInfo(t[0])).filter(x=>x&&x.status==="unresolved"&&Date.now()-x.last<10*864e5)[0];
  if(open&&releaseThisWeek()>=2)pk.action={line:"I'm not sending you back to release work tonight. You've already done it twice this week and "+open.name.toLowerCase()+" is still unresolved. This may need action instead.",thread:open.name};
  const wk=weekWith(pk.r.g);
  if(wk>=2)mine.push("You've been with "+G[pk.r.g].name+" "+(wk===2?"twice":wk+" times")+" this week. That tells me you've needed "+({juniper:"closure",fern:"rest",willow:"comfort",lily:"quiet"}[pk.r.g]||"steadiness")+" more than insight lately.");
  const rp=resetProgress();if(rp.done.length&&rp.done.length<7&&rp.last&&Date.now()-rp.last>2*864e5)mine.push("You haven't finished the Energy Reset, but I'm not pushing you back into it tonight.");
  const pr=openPromises().find(p=>Date.now()-p.ts<4*864e5&&/bed|night|sleep|phone|work|screen|laptop/i.test(p.text));if(pr)mine.push("You said you'd "+pr.text.replace(/^i('ll| will)?\s*/i,"")+". Let's keep that promise tonight.");
  if(heavyEvenings()>=3)mine.push("You've had a lot on your mind in the evenings this week. I'm not asking you to process any more tonight.");
  pk.mine=mine[0]||"";if(mine.length>1)pk.why=esc(mine[1])+" "+pk.why;
  return pk;
}
/* Every rhythm surface goes through the priority engine first (17a-daily-context.js). */
function rhythmHTML(){return focusCardHTML(resolveCurrentFocus());}
function openingLine(known){
  if(!known)return "I'm Aura. Tell me what happened, and I'll take it from there.";
  if(!memOn())return "Tell me what happened, and I'll take it from there.";
  const recent=S.asks.filter(a=>!a.noMem&&a.thread&&Date.now()-a.ts<48*3600e3&&!(a.sitSnooze&&a.sitSnooze>Date.now())&&!a.settled).sort((a,b)=>b.ts-a.ts)[0];
  if(recent){const ti=threadInfo(recent.thread),t=recent.thread.toLowerCase();
    if(recent.tomorrow&&Date.now()-recent.ts>6*3600e3)return "Before you tell me anything, how did it go with "+t+"?";
    if(ti&&ti.talks>=2)return "Is this about "+t+" again?";
    if(Date.now()-recent.ts<20*3600e3)return "Still on "+t+", or is it something new?";}
  const lat=S.later&&S.later.find(l=>!l.done&&l.label);if(lat)return "You wanted to come back to "+lat.label+". Want to do that now?";
  return "I think I know what today has been about.";
}
function renderToday(){
  const p=S.profile, mins=pickedMins||p.minutes, H=memOn()?hist():[], known=H.length>0, b=todayBrief(), f=resolveCurrentFocus(), dr=dayRitual();
  const pick=(dr&&dr.r)||(b.ritualId&&byId[b.ritualId])||byId.anchor;
  // The engine decides what leads. When her life is louder than the clock, nothing else competes with it.
  let h='<div class="home"><p class="greet">'+esc(greeting())+'</p>'+
    (f.level>3?'<h2 class="hline">'+esc(openingLine(known))+'</h2>'+(known&&b.observation?'<p class="obs">'+esc(b.observation)+'</p>':''):'')+'</div>';
  if(!lastRead)h+=sinceHTML(f)+bdayHTML()+focusCardHTML(f);
  h+='<div class="aura" id="auraBox"><div class="speaker">'+glyph("aura")+'<span class="who">Aura is listening</span><button class="howbtn" id="howOpen" aria-label="How it works">?</button></div>'+
     '<label class="sr" for="carry">What happened</label><div class="composer"><textarea id="carry" placeholder="Tell me what happened. Messy is fine."></textarea>'+micBtn("carry")+'</div><p class="small muted" id="carryHint" hidden style="margin-top:6px"></p>'+
     '<details class="feelset"'+(feelSel.length?' open':'')+'><summary class="small">Not ready to talk? Tap how you feel.</summary><div class="chips" style="margin-top:8px" id="quick">'+QUICK.map(q=>'<button class="chip" data-q="'+esc(q[0])+'" aria-pressed="'+feelSel.includes(q[0])+'">'+esc(q[0])+'</button>').join("")+'<button class="chip calm" id="cantThink">Can\'t think</button></div></details>'+
     '<button class="btn btn-main full" id="askBtn" style="margin-top:14px">Tell Aura</button></div>';
  h+='<div id="readingSlot">'+(lastRead?readingHTML(lastRead):"")+'</div>';
  if(!lastRead){
    h+='<div id="nudgeSlot">'+nudgeHTML()+'</div>'+letterCardHTML();
    h+=yourCircleHTML();
    const dp=deeperHTML(),more=f.level<=3?stewardHTML({...f,level:6,steward:STEWARD[f.dp],insight:""}):"",fu=f.level===2?(followHTML()||checkinHTML()):"";
    h+='<details class="more"><summary>If you want more</summary>'+fu+more+'<div class="trio">'+
      '<div class="card hcard"><div class="label">Today\'s ritual</div><h3 style="margin-top:6px">'+esc(pick.title)+'</h3><p class="small muted" style="margin-top:4px">With '+esc(G[pick.g].name)+' · '+pick.min+' min. '+esc(dr?dr.why:(b.why||""))+'</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-begin="'+esc(pick.id)+'">Begin</button><button class="btn btn-ghost" data-peek="'+esc(pick.id)+'">See it first</button></div></div>'+
      (memOn()&&b.remembered?'<div class="card hcard"><div class="label">One thing I remember</div><p style="margin-top:6px">'+esc(b.remembered)+'</p><div class="row" style="margin-top:8px"><button class="linkish" id="memOpen">See everything I remember</button></div></div>':
        !memOn()?'<div class="card hcard"><div class="label">Memory is off</div><p class="small muted" style="margin-top:6px">I\'m not keeping anything, so every visit starts fresh.</p><button class="linkish" id="memOpen">Change</button></div>':'')+
      '<div class="card hcard"><div class="label">'+esc(dp.label)+'</div><p class="small" style="margin-top:6px">'+esc(dp.text)+'</p><div class="row" style="margin-top:10px">'+dp.btn+'</div></div>'+
      '</div>'+dateCardHTML()+'</details>';
  }
  h+='<p class="disclaim"><button class="linkish" data-how="1">How it works</button> · For reflection and ritual. Not medical or mental health advice.</p>';
  $("#v-today").innerHTML=h;
  if(!lastRead&&!pendingNudge()&&nudgeCandidate())setTimeout(makeNudge,300);
  if(!lastRead)setTimeout(refreshBrief,400);
}

function readingHTML(x){
  const g=G[x.guardian]||G.aura, same=x.guardian==="aura";
  const ch=chamberNudge(x);
  return '<div class="reading" style="border-color:'+g.color+'55">'+
   '<div class="handoff">'+glyph("aura")+'<p><span class="who2">Aura</span>'+esc(x.aura||("That's "+g.name+"'s work."))+(x.intro?' '+esc(x.intro):'')+'</p></div>'+
   (same?'':'<div class="head">'+glyph(x.guardian)+'<div><div class="who" style="color:'+g.color+'">'+esc(g.title)+'</div><div class="name">'+esc(g.name)+'</div></div></div>')+
   '<div class="body"><p class="voice"><button class="hear" data-hear="'+(x.guardian||"aura")+'" aria-label="Hear it">'+HEAR_ICON+'</button>'+esc(x.reading)+'</p>'+
   (x.memory?'<div class="recall" id="recall"><div class="label">From your archive · '+esc(x.memory.date)+(x.memory.moon?' · '+esc(x.memory.moon):'')+'</div><p class="small muted" style="margin-top:4px">After '+esc(x.memory.ritualTitle)+', you wrote:</p><blockquote>"'+esc(x.memory.quote)+'"</blockquote><p class="voice" style="font-size:18px;margin-top:6px">'+esc(x.memory.question)+'</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-fromhere="'+esc(x.memory.id)+'">Work from there</button><button class="btn btn-ghost" id="freshBtn">Start fresh</button></div></div>':'')+
   memStripHTML(x)+(x.tomorrow?'<p class="small" style="margin:8px 0 0"><b>Tomorrow</b> I\'ll ask you '+esc(x.tomorrow.replace(/^(I'll ask|ask)( you)? ?/i,""))+'</p>':'')+whyThis(x.why)+
   (x.care?'<div class="care">You matter more than any ritual. If you are thinking about hurting yourself, please reach out to someone you trust now, or call or text <b>988</b> (Suicide and Crisis Lifeline, US).</div>':"")+
   (x.note?'<p class="small muted">'+esc(x.note)+(x.signin?' <button class="linkish" id="siOpen">Sign in</button>':x.limit&&!isMember()?' <button class="linkish" data-paywall="More readings">Get more with '+esc(PLAN.name)+'</button>':"")+'</p>':"")+actionHTML(x)+(ch||"")+
   (x.promise?'<div class="ask dark"><span>You said: "'+esc(x.promise)+'". Want me to hold you to it?</span><button class="chip" data-holdme="7">Check in a week</button><button class="chip" data-holdme="2">In two days</button></div>':'')+
   '<div class="row"><button class="btn btn-ghost" data-talkread="'+x.guardian+'">Talk to '+esc(g.name)+'</button><button class="btn btn-ghost" data-laterread="1">Bring this back later</button><button class="btn btn-ghost" id="againBtn">Ask something else</button></div>'+
   '<p class="small muted memline" id="memLine">'+(!memOn()?'Memory is off, so I won\'t keep this. <button class="linkish" id="memOpen">Change</button>':x.noMem?'I won\'t remember this one. <button class="linkish" id="remAgain">Remember it after all</button>':'I\'ll remember this. <button class="linkish" id="noRem">Don\'t remember this</button> · <button class="linkish" id="memOpen">What I remember</button>')+'</p></div></div>';
}
/* Visible memory: small moments where Aura shows she remembers. */
function memStripHTML(x){
  if(!memOn()||!x.thread)return "";
  const th=x.thread.toLowerCase(),same=S.asks.filter(a=>(a.thread||"").toLowerCase()===th&&!a.noMem&&a.id!==x.askId);
  const lines=[];
  if(same.length){const first=Math.min(...same.map(a=>a.ts)),days=Math.round((Date.now()-first)/864e5);
    if(days>=2)lines.push("We've been carrying this for "+days+" days.");
    const n30=same.filter(a=>Date.now()-a.ts<30*864e5).length;if(n30>=2)lines.push("This has come up "+(n30+1)+" times this month.");
    else lines.push("This connects to something you told me before.");}
  const helped=S.entries.find(e=>(e.thread||"").toLowerCase()===th&&e.after==="Lighter"&&e.ritualTitle&&!e.followup);
  if(helped)lines.push("Last time, "+helped.ritualTitle+" helped.");
  const still=same.find(a=>a.follow&&a.follow.still);
  if(still)lines.push("Last time it was still bothering you after, so I'm not repeating what didn't work.");
  return lines.length?'<div class="remember"><span class="label">I remember</span>'+lines.slice(0,3).map(l=>'<p>'+esc(l)+'</p>').join("")+'</div>':"";
}
function actionHTML(x){
  const g=G[x.guardian]||G.aura, a=x.action||"ritual";
  if(a==="talk")return '<div class="card"><p>'+esc(g.name)+' wants to talk this through before any ritual.</p><button class="btn btn-main full" style="margin-top:10px" data-talkread="'+x.guardian+'">Talk to '+esc(g.name)+'</button></div>';
  if(a==="write")return '<div class="card"><div class="label">One sentence</div><p class="voice" style="margin-top:6px">'+esc(x.writePrompt||"Finish this sentence: What I actually need is...")+'</p><label class="sr" for="oneLine">Your sentence</label><div class="composer" style="margin-top:10px"><textarea id="oneLine" style="min-height:70px" placeholder="Write or speak it."></textarea>'+micBtn("oneLine")+'</div><button class="btn btn-main full" style="margin-top:10px" id="saveLine">Save to my archive</button></div>';
  if(a==="rest")return '<div class="card"><div class="label">Nothing more tonight</div><p style="margin-top:6px">You already did enough. The work keeps working after you stop.</p><button class="btn btn-ghost full" style="margin-top:10px" id="restBtn">Close the day</button></div>';
  if(a==="simplify")return '<div class="card"><p>Just one thing. No choices.</p><button class="btn btn-main full" style="margin-top:10px" id="simpleGo">Breathe with me</button></div>';
  if(a==="answer")return '<div class="card memory"><div class="label">From your Archive</div><p style="margin-top:6px;font-size:18px">'+esc(x.answer||"")+'</p>'+((x.cites||[]).length?'<div class="entries" style="margin-top:8px">'+x.cites.map(id=>{const e=S.entries.find(z=>z.id===id);return e?'<button class="entry" data-entry="'+esc(id)+'">'+glyph(e.guardian)+'<span><div class="t">'+esc(e.ritualTitle)+'</div><div class="m">'+fmtDate(e.ts)+'</div>'+(e.text?'<div class="x">'+esc(e.text)+'</div>':'')+'</span></button>':"";}).join("")+'</div>':'')+'</div>';
  if(a==="circle")return '<div class="stack">'+x.circle.map(c=>'<div class="card"><div class="row">'+glyph(c.guardian,34)+'<div style="flex:1;min-width:0"><div class="label" style="color:'+G[c.guardian].color+'">'+esc(G[c.guardian].name)+' sees it as</div><p style="margin-top:2px">'+esc(c.view)+'</p></div></div><button class="btn btn-ghost full" style="margin-top:10px" data-circlepick="'+c.guardian+'">Go with '+esc(G[c.guardian].name)+'</button></div>').join("")+'</div>';
  if(a==="decide")return '<div class="card"><p>'+esc(g.name)+' will walk you through it: what you want, what you fear, what you think you owe, and what you\'ve said matters to you. You decide.</p><button class="btn btn-main full" style="margin-top:10px" data-decide="'+x.guardian+'">Walk through it with '+esc(g.name)+'</button></div>';
  if(a==="event"&&x.plan)return '<div class="card"><div class="label">A path for this · '+esc(x.plan.title)+'</div><ol class="plan">'+x.plan.steps.map(st=>'<li><b>'+esc(st.title||"")+'</b><br><span class="small muted">'+esc(st.note||"")+'</span></li>').join("")+'</ol><button class="btn btn-main full" id="planStart">Start this path</button></div>';
  if(a==="build")return ritualCard(x.ritual,{ctx:"read"})+'<button class="btn btn-ghost full" id="saveMine">Save to my rituals</button>';
  if(a==="revisit"){const e=S.entries.find(z=>z.id===x.revisit);return '<div class="card memory"><div class="label">You already wrote the answer · '+esc(fmtDate(e.ts))+'</div><p class="small muted" style="margin-top:6px">After '+esc(e.ritualTitle)+':</p><blockquote>"'+esc((e.text||"").slice(0,280))+'"</blockquote><div class="row" style="margin-top:10px"><button class="btn btn-main" data-entry="'+esc(e.id)+'">Open the entry</button><button class="btn btn-ghost" data-talkread="'+x.guardian+'">Talk to '+esc(g.name)+'</button></div></div>';}
  return ritualCard(x.ritual,{ctx:"read"});
}
function chamberNudge(x){
  const t=recentThemes(14)[x.theme]||0;
  const c=CHAMBERS[x.guardian]; if(!c||t<2||isMember())return "";
  return '<div class="card"><div class="label">A deeper tool</div><p style="margin-top:6px">You keep returning to '+esc(x.theme)+'. '+esc(G[x.guardian].name)+'\'s chamber may help.</p><h3 style="margin-top:8px">'+esc(c.name)+'</h3><p class="small muted" style="margin-top:4px">'+esc(c.d)+'</p><button class="btn btn-ghost" style="margin-top:10px" data-chamber="'+x.guardian+'">Open the chamber</button></div>';
}
/* The altar draw lives in 17d-tarot.js. drawPick is shared. */
function drawPick(){const v=S.draws[dayKey(today)];return v==null?null:(typeof v==="object"?v.pick:0);}
function cardBack(){return '<svg viewBox="0 0 112 168" aria-hidden="true"><g fill="none" stroke="#E7C45A" stroke-opacity=".75" stroke-width="1"><circle cx="56" cy="84" r="26"/><circle cx="56" cy="84" r="34" stroke-dasharray="2 4"/><path d="M56 44v80M16 84h80M30 58l52 52M82 58l-52 52" stroke-opacity=".3"/><path d="M62 70a14 14 0 1 0 0 28a11 11 0 1 1 0-28z" fill="#E7C45A" fill-opacity=".85" stroke="none"/></g><text x="56" y="152" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="10" fill="#E7C45A" letter-spacing="2">ALTAR</text></svg>';}
function resurface(){
  const old=S.entries.filter(e=>!e.private&&e.text&&(Date.now()-e.ts)>2*864e5);
  if(!old.length)return null;
  const same=old.filter(e=>e.moon===M.name);
  const pool=same.length?same:old;
  return pool[hash(dayKey(today))%pool.length];
}

