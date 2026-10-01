/* ------------------------------------------------------------------
   IRIS, THE CYCLE KEEPER. Opt in only. Context, not dismissal.
   Cycle history is kept apart from everything else: its own key on
   this device and its own table (cycle_events) in her account. It is
   never added to prefs, never shown on the admin dashboard, never put
   in Friends Week telemetry (only the bare event "cycle_feature_used"),
   and never sent to an AI in full. Every number here is plain code.
   No ovulation or fertile window, no diagnosis, not contraception.
------------------------------------------------------------------ */
const CYC_KEY="dailyAlchemist.cycle";
let C=cycleLoad();
function cycleBlank(){return {mode:null,irregular:false,consent:false,consentVersion:2,events:[],syncedAt:0};}
function cycleLoad(){
  try{
    const raw=localStorage.getItem(CYC_KEY);
    if(raw){
      const parsed=JSON.parse(raw),out={...cycleBlank(),...parsed};
      /* Earlier builds silently opted cycle tracking into Circle sharing. Revoke that
         inferred permission once and ask for an explicit choice instead. */
      if(parsed.consentVersion!==2){out.consent=false;out.consentVersion=2;localStorage.setItem(CYC_KEY,JSON.stringify(out));}
      return out;
    }
  }catch(e){}
  return cycleBlank();
}
function cycleSave(){try{localStorage.setItem(CYC_KEY,JSON.stringify(C));}catch(e){}}
function cycleReset(){C=cycleBlank();try{localStorage.removeItem(CYC_KEY);}catch(e){}}
function cycleOn(){return C.mode==="periods"||C.mode==="peri"||C.mode==="meno";}
function cycleShared(){return cycleOn()&&C.consent===true;}
const isoDay=d=>{d=new Date(d);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
const cyDn=s=>Math.round(new Date(s+"T12:00:00").getTime()/864e5);
const cyFrom=n=>new Date(n*864e5);
const fmtMD=n=>cyFrom(n).toLocaleDateString(undefined,{month:"long",day:"numeric"});

/* Cloud: one row per event, plus one settings row. Row level security keeps them hers. */
function cycleCloud(){return MODE==="web"&&typeof ACCT!=="undefined"&&ACCT.user&&ACCT.sb?ACCT.sb:null;}
async function cyclePutRow(ev){const sb=cycleCloud();if(!sb)return;try{await sb.from("cycle_events").upsert({id:ev.id,user_id:ACCT.user.id,kind:ev.kind,day:ev.day||null,data:ev.data||{}});}catch(e){}}
async function cyclePutSettings(){const sb=cycleCloud();if(!sb)return;try{await sb.from("cycle_events").upsert({id:"settings-"+ACCT.user.id,user_id:ACCT.user.id,kind:"settings",day:null,data:{mode:C.mode,irregular:C.irregular,consent:C.consent,consentVersion:2}});}catch(e){}}
async function cycleSync(){
  const sb=cycleCloud();if(!sb)return;
  try{
    const {data,error}=await sb.from("cycle_events").select("id,kind,day,data").limit(2000);if(error||!data)return;
    const have=new Map(C.events.map(e=>[e.id,e]));
    for(const r of data){
      if(r.kind==="settings"){const d=r.data||{},legacy=d.consentVersion!==2;if(!C.mode&&d.mode){C.mode=d.mode;C.irregular=!!d.irregular;C.consent=legacy?false:!!d.consent;C.consentVersion=2;}if(legacy&&C.mode)cyclePutSettings();continue;}
      if(!have.has(r.id))C.events.push({id:r.id,kind:r.kind,day:r.day,data:r.data||{}});
    }
    const local=C.events.filter(e=>!data.some(r=>r.id===e.id));for(const e of local)cyclePutRow(e);
    C.syncedAt=Date.now();cycleSave();
  }catch(e){}
}
async function cycleDeleteHistory(){
  const sb=cycleCloud();
  if(sb){try{const {error}=await sb.from("cycle_events").delete().eq("user_id",ACCT.user.id).neq("kind","settings");if(error){toast("Couldn't delete your cycle history. Try again.");return false;}}catch(e){toast("Couldn't delete your cycle history. Try again.");return false;}}
  C.events=[];cycleSave();return true;
}
function cycleAdd(kind,day,data){
  const ev={id:"c"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),kind,day:day||isoDay(Date.now()),data:data||{}};
  if(kind==="start"&&C.events.some(e=>e.kind==="start"&&e.day===ev.day))return null;
  C.events.push(ev);cycleSave();cyclePutRow(ev);track("cycle_feature_used");return ev;
}

/* The math: her own history, never a 28 day template. */
function cycleStarts(){return [...new Set(C.events.filter(e=>e.kind==="start").map(e=>e.day))].sort().map(cyDn);}
function cycleLengths(){const s=cycleStarts(),L=[];for(let i=1;i<s.length;i++){const d=s[i]-s[i-1];if(d>=15&&d<=60)L.push(d);}return L;}
function cycleNow(now){
  now=now||new Date();const tn=cyDn(isoDay(now)),s=cycleStarts().filter(n=>n<=tn),last=s[s.length-1];
  if(last==null)return {day:null,last:null};
  const day=tn-last+1;
  const end=C.events.filter(e=>e.kind==="end"&&cyDn(e.day)>=last).map(e=>cyDn(e.day)).sort()[0];
  const bleeding=day<=8&&(end==null||end>=tn);
  return {day:day<=70?day:null,last,bleeding,startedToday:last===tn,startedRecently:tn-last<=1};
}
function cycleEstimate(now){
  const cn=cycleNow(now);
  if(C.mode==="meno")return {kind:"none",line:"No predictions here. I'll keep your record and notice what repeats."};
  if(C.mode==="peri")return {kind:"none",line:"Cycles can get less predictable in perimenopause, so I won't guess a date. I'll keep the record and tell you what repeats."};
  const L=cycleLengths().slice(-4);
  if(cn.last==null)return {kind:"none",line:"Log the day your next period starts, or add a few past start dates, and I'll start learning your rhythm."};
  if(L.length<2)return {kind:"none",line:"I don't have enough cycles yet to estimate. A few more starts and I'll give you a range."};
  const lo=Math.min(...L),hi=Math.max(...L);
  if(C.irregular||hi-lo>9)return {kind:"varied",range:[lo,hi],line:"Your recent cycles have varied, so I don't have a tight estimate yet."};
  const a=cn.last+lo-(lo===hi?1:0),b=cn.last+hi+(lo===hi?1:0);
  return {kind:"range",range:[lo,hi],from:a,to:b,line:"Based on your last "+L.length+" cycles, your next period may start around "+fmtMD(a)+" to "+(cyFrom(a).getMonth()===cyFrom(b).getMonth()?cyFrom(b).getDate():fmtMD(b))+"."};
}
function logsByDay(){const m={};for(const e of C.events)if(e.kind==="log")m[e.day]={...(m[e.day]||{}),...e.data};return m;}
function todayLog(now){return logsByDay()[isoDay(now||Date.now())]||null;}
/* What repeats for HER: needs at least two earlier cycles showing the same thing. */
function cyclePatterns(now){
  const cn=cycleNow(now);if(cn.day==null)return [];
  const s=cycleStarts(),logs=logsByDay(),out=[];
  const prior=[];for(let i=0;i+1<s.length;i++)if(s[i+1]<=cn.last)prior.push([s[i],s[i+1]]);
  if(prior.length<2)return out;
  const recent=prior.slice(-4);
  const dayLog=(n)=>logs[isoDay(cyFrom(n))]||null;
  const lowE=recent.filter(([a])=>{for(let k=-2;k<=2;k++){const l=dayLog(a+cn.day-1+k);if(l&&l.energy===1)return true;}return false;}).length;
  if(lowE>=2)out.push({k:"energy",line:"Over your last "+recent.length+" cycles, your energy dipped around this point."});
  const est=cycleEstimate(now);
  if(est.kind==="range"){
    const tn=cyDn(isoDay(now||Date.now())),until=est.from-tn;
    const hd=recent.filter(([,b])=>{for(let k=1;k<=3;k++){const l=dayLog(b-k);if(l&&l.headache)return true;}return false;}).length;
    if(hd>=2&&until>=0&&until<=4)out.push({k:"headache",line:"You've logged headaches two or three days before bleeding in "+hd+" recent cycles."});
  }
  if(memOn()){
    const over=recent.filter(([a])=>S.asks.some(x=>!x.noMem&&/overwhelm|too much|exhaust|drain/i.test(x.text||"")&&Math.abs(cyDn(isoDay(x.ts))-(a+cn.day-1))<=2)).length;
    if(over>=2)out.push({k:"overwhelm",line:"You've come to Aura feeling overwhelmed around this point before."});
  }
  return out;
}
/* What the rest of the app may know: only with her permission, and only a summary. */
function cycleContext(now){
  if(!cycleShared())return null;
  const cn=cycleNow(now),tl=todayLog(now),pat=cyclePatterns(now);
  const rough=!!tl&&(tl.cramps>=2||tl.energy===1||tl.headache||tl.sleep===1);
  return {day:cn.day,bleeding:!!cn.bleeding,startedToday:!!cn.startedToday,startedRecently:!!cn.startedRecently,
    heavy:(cn.bleeding&&cn.day!=null&&cn.day<=2)||rough,rough,todayLog:tl,pattern:pat[0]?pat[0].line:"",mode:C.mode};
}
function cycleAIText(now){
  const c=cycleContext(now);if(!c)return "";
  const bits=[];if(c.day!=null)bits.push("cycle day "+c.day+(c.bleeding?" (on her period)":""));if(c.startedToday)bits.push("her period started today");
  if(c.todayLog){const t=c.todayLog;if(t.cramps>=2)bits.push("strong cramps");if(t.energy===1)bits.push("low energy");if(t.headache)bits.push("headache");if(t.sleep===1)bits.push("rough sleep");}
  if(c.pattern)bits.push("her own pattern: "+c.pattern);
  return bits.length?"IRIS (cycle context she chose to share, a summary only): "+bits.join("; ")+". Iris may give context but NEVER invalidates her actual situation. Never say she feels something because of her period. Good: Iris has noticed your energy usually drops around this point. That may be turning the volume up, but the problem you described is still real.":"";
}

/* Iris's page in the Circle */
const CYC_FIELDS=[["flow","Flow",[["None",0],["Light",1],["Medium",2],["Heavy",3]]],["cramps","Cramps",[["None",0],["Mild",1],["Strong",2]]],["energy","Energy",[["Low",1],["Some",2],["Good",3]]],["mood","Mood",[["Low",1],["Steady",2],["Good",3],["On edge",4]]],["sleep","Sleep",[["Rough",1],["Okay",2],["Good",3]]],["headache","Headache",[["No",0],["Yes",1]]],["cravings","Cravings",[["No",0],["Yes",1]]],["libido","Libido",[["Low",1],["Usual",2],["High",3]]]];
let cycDraft={};
function irisPanelHTML(){
  if(!C.mode)return '<div class="card iris">'+auraSays("Want me to keep track with you? Only if you want. It stays private, and you can delete it any time.","Iris")+
    '<div class="chips" style="margin-top:10px"><button class="chip" data-cycmode="periods">Track my periods</button><button class="chip" data-cycmode="peri">I\'m in perimenopause</button><button class="chip" data-cycmode="meno">I\'m in menopause</button><button class="chip" data-cycmode="none">Not now</button></div></div>';
  if(C.mode==="none")return '<div class="card iris"><p class="small">You chose not to track for now. That\'s fine. I\'m still here to talk.</p><button class="linkish" data-cycmode="ask" style="margin-top:6px">Start tracking</button></div>';
  const cn=cycleNow(),est=cycleEstimate(),L=cycleLengths().slice(-4),pat=cyclePatterns(),tl=todayLog()||{};
  let h='<div class="card iris">';
  if(C.mode!=="meno"){
    h+='<div class="cycstat">'+(cn.day!=null?'<div class="cday"><span>Cycle day</span><b>'+cn.day+'</b></div>':'')+'<div class="cinfo">'+
      (cn.last!=null?'<p class="small">Last period started '+esc(fmtMD(cn.last))+'.</p>':'')+
      (L.length>=2?'<p class="small">Your recent cycles: '+Math.min(...L)+(Math.min(...L)===Math.max(...L)?'':' to '+Math.max(...L))+' days.</p>':'')+
      '<p class="small">'+esc(est.line)+'</p></div></div>';
    h+=cn.bleeding&&!cn.startedToday?'<button class="btn btn-ghost full" data-cycend="1">My period ended today</button>':'<button class="btn btn-main full" data-cycstart="1"'+(cn.startedToday?' disabled':'')+'>'+(cn.startedToday?'Logged: your period started today':'My period started today')+'</button>';
  }
  if(pat.length)h+='<div class="remember" style="margin-top:12px"><span class="label">Iris has noticed</span>'+pat.map(p=>'<p>'+esc(p.line)+'</p>').join("")+'<p class="small muted">Pattern, not prophecy. It may turn the volume up. It never makes what you\'re dealing with less real.</p></div>';
  h+='<details class="cyclog"'+(Object.keys(cycDraft).length?' open':'')+'><summary>Log today'+(Object.keys(tl).length?' · logged':'')+'</summary><p class="small muted">Tap only what you want. Nothing is required.</p>'+
    CYC_FIELDS.filter(f=>C.mode==="meno"?f[0]!=="flow":true).map(([k,lab,opts])=>{const cur=cycDraft[k]!=null?cycDraft[k]:tl[k];return '<div class="sndrow"><span>'+lab+'</span><div class="chips">'+opts.map(([l,v])=>'<button class="chip sm" data-cyclog="'+k+':'+v+'" aria-pressed="'+(cur===v)+'">'+l+'</button>').join("")+'</div></div>';}).join("")+
    '<div class="field" style="margin-top:8px"><label for="cycNote">Note (optional)</label><input type="text" id="cycNote" maxlength="200" value="'+esc(cycDraft.note!=null?cycDraft.note:(tl.note||""))+'"></div><button class="btn btn-main full" data-cycsave="1" style="margin-top:10px">Save today</button></details>';
  if(C.mode!=="meno")h+='<details class="cyclog"><summary>Add an earlier period start</summary><p class="small muted">A few past start dates let me give you a range sooner.</p><div class="row" style="margin-top:8px"><input type="date" id="cycPast" max="'+isoDay(Date.now())+'"><button class="chip" data-cycpast="1">Add</button></div></details>';
  h+='<details class="cyclog"><summary>Privacy and settings</summary>'+
    '<label class="switch" for="cycConsent">Let Aura and the Circle use my cycle context<input type="checkbox" id="cycConsent"'+(C.consent?' checked':'')+'></label>'+
    '<p class="small muted">When this is on, Aura and the guardians only see a summary, like cycle day 2, low energy. Never your full history.</p>'+
    (C.mode==="periods"?'<label class="switch" for="cycIrreg">I use hormonal birth control, or my cycle is irregular<input type="checkbox" id="cycIrreg"'+(C.irregular?' checked':'')+'></label>':'')+
    '<div class="chips" style="margin-top:8px"><button class="chip sm" data-cycmode="periods" aria-pressed="'+(C.mode==="periods")+'">Periods</button><button class="chip sm" data-cycmode="peri" aria-pressed="'+(C.mode==="peri")+'">Perimenopause</button><button class="chip sm" data-cycmode="meno" aria-pressed="'+(C.mode==="meno")+'">Menopause</button><button class="chip sm" data-cycmode="none">Stop tracking</button></div>'+
    '<button class="btn btn-ghost full danger" data-cycdel="1" style="margin-top:12px">Delete my cycle history</button>'+
    '<p class="small muted" style="margin-top:8px">Your cycle history is kept separately, is included when you export, and is deleted if you delete your account. It is not shown in Friends Week analytics or the admin dashboard. Aura and the Circle only receive a short summary if you choose to share cycle context. This is for noticing your own patterns. It is not contraception, it doesn\'t predict fertility, and it can\'t diagnose anything. If something feels off, talk to a clinician.</p></details>';
  return h+'</div>';
}
function rerenderIris(){const el=document.querySelector(".card.iris");if(el)el.outerHTML=irisPanelHTML();}
function irisClick(t,d){
  if(d.cycmode!==undefined){
    if(d.cycmode==="ask"){C.mode=null;}else{const first=!C.mode||C.mode==="none";C.mode=d.cycmode;if(first&&d.cycmode!=="none"){C.consent=false;C.consentVersion=2;}}
    cycleSave();cyclePutSettings();if(C.mode&&C.mode!=="none")track("cycle_feature_used");rerenderIris();
    if(C.mode&&C.mode!=="none"&&!C.events.length)toast("I'll keep it private. If you want Aura and the Circle to use a short summary, you can turn that on below.");
    renderToday();return true;}
  if(d.cycstart){cycleAdd("start");rerenderIris();renderToday();toast("Logged. I'll keep today lighter.");return true;}
  if(d.cycend){cycleAdd("end");rerenderIris();toast("Logged.");return true;}
  if(d.cyclog){const [k,v]=d.cyclog.split(":");cycDraft[k]=+v;t.parentElement.querySelectorAll("[data-cyclog]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return true;}
  if(d.cycsave){const n=($("#cycNote")||{}).value;if(n!=null&&n.trim())cycDraft.note=n.trim().slice(0,200);if(Object.keys(cycDraft).length){cycleAdd("log",null,{...cycDraft});cycDraft={};toast("Saved.");rerenderIris();renderToday();}else toast("Tap anything you want to log first.");return true;}
  if(d.cycpast){const v=($("#cycPast")||{}).value;if(!v){toast("Choose a date.");return true;}if(!cycleAdd("start",v))toast("That start is already logged.");else toast("Added.");rerenderIris();return true;}
  if(d.cycdel){if(t.dataset.sure!=="1"){t.dataset.sure="1";t.textContent="Tap again to delete it all for good";return true;}t.disabled=true;cycleDeleteHistory().then(ok=>{if(ok){toast("Your cycle history is deleted.");rerenderIris();renderToday();}else t.disabled=false;});return true;}
  if(t.id==="cycConsent"){C.consent=!!t.checked;cycleSave();cyclePutSettings();renderToday();return true;}
  if(t.id==="cycIrreg"){C.irregular=!!t.checked;cycleSave();cyclePutSettings();rerenderIris();return true;}
  return false;
}
