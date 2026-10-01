/* ------------------------------------------------------------------
   EVENTS
------------------------------------------------------------------ */
let curTab="today";
function saveUI(){try{S.ui={tab:curTab,talk:talkG||null,read:lastRead&&!lastRead.care?lastRead:null,ts:Date.now()};saveLocal();}catch(e){}}
function restoreUI(){
  const u=S.ui;if(!u||Date.now()-u.ts>12*3600e3)return;
  if(u.read&&u.read.ritual){lastRead=u.read;if(lastRead.ritual&&lastRead.ritual.id&&byId[lastRead.ritual.id])lastRead.ritual=byId[lastRead.ritual.id];renderToday();}
  if(u.tab&&u.tab!=="today")tab(u.tab);
  if(u.talk&&G[u.talk]&&allowedG(u.talk))setTimeout(()=>{if(!$("#gate")&&!$("#talk"))openTalk(u.talk);},700);
}
function tab(name){
  track("tab",{tab:name});curTab=name;setTimeout(saveUI,0);
  document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===name)));
  ["today","journeys","circle","archive"].forEach(v=>{$("#v-"+v).hidden=(v!==name);});
  window.scrollTo({top:0});
}
document.addEventListener("click",ev=>{if(ev.target.closest&&ev.target.closest("#eyes")){stopEyes();}},true);
document.addEventListener("click",async ev=>{
  const t=ev.target.closest("button,input[type=checkbox]"); if(!t)return;
  const d=t.dataset;
  if(t.tagName==="INPUT"){irisClick(t,d);return;}
  if(focusClick(t,d))return;
  if(irisClick(t,d))return;
  if(d.mic){toggleMic(t);return;}
  if(t.id==="customAdd"){const v=($("#customIn").value||"").trim().slice(0,40);if(!v)return;if(!S.profile.custom.includes(v))S.profile.custom.push(v);persist("profile");$("#pCustom").insertAdjacentHTML("beforeend",'<span class="chip" aria-pressed="true">'+esc(v)+' <button class="x2 in" data-delcustom="'+(S.profile.custom.length-1)+'" aria-label="Remove">×</button></span>');$("#customIn").value="";toast("Aura knows you have "+v+".");return;}
  if(d.delcustom!==undefined){S.profile.custom.splice(+d.delcustom,1);persist("profile");t.closest(".chip").remove();return;}
  if(t.id==="dateAdd"){const nm=($("#dateName").value||"").trim(),dv=$("#dateWhen").value;if(!nm||!dv){toast("Add a name and a date.");return;}const [y,m,dd]=dv.split("-").map(Number);S.dates.push({id:uid(),name:nm,month:m,day:dd,year:y<new Date().getFullYear()?y:null});persistAll();closeSheet();openAltar(false);toast("Aura will remember "+nm+".");return;}
  if(d.deldate){S.dates=S.dates.filter(x=>x.id!==d.deldate);persistAll();closeSheet();openAltar(false);return;}
  if(t.id==="corrAdd"){const sy=($("#corrSym").value||"").trim(),mn=($("#corrMean").value||"").trim();if(!sy||!mn)return;S.corr.push({symbol:sy,meaning:mn});persistAll();closeSheet();openAltar(false);toast("Aura will use your meaning.");return;}
  if(d.delcorr!==undefined){S.corr.splice(+d.delcorr,1);persistAll();closeSheet();openAltar(false);return;}
  if(t.id==="seasonSet"){const nm=($("#seasonName").value||"").trim();if(!nm)return;S.pseason={name:nm,start:Date.now()};persistAll();renderSky();closeSheet();openAltar(false);toast("Your season is named.");return;}
  if(t.id==="seasonEnd"){S.pseason=null;persistAll();renderSky();closeSheet();openAltar(false);return;}
  if(t.id==="pushOn"){await enablePush();return;}
  if(d.altar){openAltarItems(d.altar);return;}
  if(d.tend){const sp=S.spaces.find(z=>z.id===d.tend);const r=tendRitual(sp);startRitual(r,{space:sp.id,theme:"space",thread:"Home"});return;}
  if(d.delspace){S.spaces=S.spaces.filter(z=>z.id!==d.delspace);persistAll();renderArchive();return;}
  if(t.id==="addSpace"){openSheet('<div class="stack"><div class="label">Add a space</div><div class="addrow"><label class="sr" for="spaceName">Space name</label><input type="text" id="spaceName" placeholder="Office, porch, bedroom"><button class="btn btn-main" id="spaceSave">Add</button></div></div>');return;}
  if(t.id==="spaceSave"){const nm=($("#spaceName").value||"").trim();if(!nm)return;S.spaces.push({id:uid(),name:nm,log:[]});persistAll();closeSheet();renderArchive();return;}
  if(d.markdate){const dd=S.dates.find(z=>z.id===d.markdate);tab("today");$("#carry").value=dd.name+" is coming up. I want to mark it.";$("#askBtn").click();return;}
  if(d.makemine){const b=byId[d.makemine];saveMyRitual({...b,id:"mine-"+uid(),title:"My "+b.title});renderArchive();toast("It's yours now. Aura will reach for it first.");return;}
  if(d.yearbook){openYearbook(d.yearbook);return;}
  if(d.cal){const pr=S.promises.find(z=>z.id===d.cal);addToCalendar(pr.text,pr.due,"A promise you made to yourself in The Daily Alchemist.");return;}
  if(d.plancal){const [id,i]=d.plancal.split(":");const pl=S.plans.find(z=>z.id===id);const st=pl.steps[+i];const dt=new Date();dt.setDate(dt.getDate()+1);dt.setHours(19,0,0,0);addToCalendar((st.title||"Next step")+" · "+pl.title,dt.getTime(),st.note||"");return;}
  if(d.taskyes){const e=S.entries.find(z=>z.id===d.taskyes);addPromise(e._task||taskGuess(e.text),1,e.id);t.closest(".ask").remove();toast("I'll check in tomorrow.");return;}
  if(t.id==="eyesBtn"){startEyes();return;}
  if(t.id==="repeatBtn"){speakStep();return;}
  if(t.id==="cantThink"||t.id==="simpleGo"){openSimple();return;}
  if(t.id==="simpleDone"){closeSimple();toast("Good. That was enough.");return;}
  if(d.promise){const [id,act]=d.promise.split(":");const pr=S.promises.find(z=>z.id===id);if(pr){if(act==="done"){pr.status="done";pr.doneAt=Date.now();toast("That's the alchemy. Real life changed.");if(!S.entries.some(e=>e.id===pr.source&&e.private))updateLedger("She kept a promise to herself: "+pr.text);}else if(act==="later"){pr.due=Date.now()+3*864e5;delete pr.notified;toast("I'll ask again in three days.");}else{pr.status="let";toast("Let go. No guilt.");}persistAll();renderToday();if(!$("#v-archive").hidden)renderArchive();}return;}
  if(d.later){const [id,act]=d.later.split(":");const l=S.later.find(z=>z.id===id);if(l){l.done=true;persistAll();renderToday();if(act==="open"){if(l.kind==="entry")openEntry(l.ref);else{const k=l.g||"aura",list=S.chats[k]=S.chats[k]||[];guardianOpens(list,{text:"You asked me to bring this back: \""+l.label+"\" Where are you with it now?"});saveLocal();openTalk(k);}}}return;}
  if(d.laterread&&lastRead){openLaterSheet("reading",null,lastRead.carrying||lastRead.reading,lastRead.guardian);return;}
  if(d.laterentry){const e=S.entries.find(z=>z.id===d.laterentry);openLaterSheet("entry",e.id,e.ritualTitle+(e.text?": "+e.text.slice(0,120):""),e.guardian);return;}
  if(d.laterwhen&&window.__later){const L=window.__later;S.later.push({id:uid(),kind:L.kind,ref:L.ref,label:L.label,g:L.g,due:laterDue(d.laterwhen),done:false});persistAll();closeSheet();toast("Aura will bring it back "+t.textContent.toLowerCase()+".");return;}
  if(d.holdme&&lastRead&&lastRead.promise){addPromise(lastRead.promise,+d.holdme,"reading");const pv=lastRead.promise;lastRead.promise="";renderToday();toast("I'll check in about \""+pv.slice(0,40)+"\".");return;}
  if(d.outwhen){t.parentElement.querySelectorAll("[data-outwhen]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(d.circlepick&&lastRead){const k=d.circlepick,c=lastRead.circle.find(z=>z.guardian===k),list=S.chats[k]=S.chats[k]||[];list.push({role:"me",ts:Date.now(),text:lastRead.carrying||""},{role:"them",ts:Date.now(),text:c?c.view:G[k].phrases[0]});saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(d.decide&&lastRead){const k=d.decide,list=S.chats[k]=S.chats[k]||[];S.decide[k]=Date.now();list.push({role:"me",ts:Date.now(),text:lastRead.carrying||""},{role:"them",ts:Date.now(),text:"Let's slow it down. Forget what you should do for a second. If nobody would be disappointed either way, what do you want?"});saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(t.id==="planStart"&&lastRead&&lastRead.plan){const pl={id:uid(),title:lastRead.plan.title,ts:Date.now(),steps:lastRead.plan.steps.map(z=>({...z,done:false})),done:false,g:lastRead.guardian};S.plans=S.plans.filter(z=>z.done);S.plans.unshift(pl);persistAll();lastRead=null;renderToday();toast("Your path is on Today. One step at a time.");return;}
  if(d.planstep){const [id,i]=d.planstep.split(":");const pl=S.plans.find(z=>z.id===id);const st=pl.steps[+i];startRitual(byId[st.ritualId],{plan:id,pstep:+i,theme:THEME[byId[st.ritualId].g],thread:pl.title});return;}
  if(d.plandone){const [id,i]=d.plandone.split(":");const pl=S.plans.find(z=>z.id===id);pl.steps[+i].done=true;if(pl.steps.every(z=>z.done))pl.done=true;persistAll();renderToday();return;}
  if(d.planend){const pl=S.plans.find(z=>z.id===d.planend);if(pl)pl.done=true;persistAll();renderToday();return;}
  if(t.id==="saveMine"&&lastRead&&lastRead.ritual){const m=saveMyRitual(lastRead.ritual);lastRead.ritual=m;renderToday();toast("Saved to My rituals in your Archive.");return;}
  if(t.id==="writeOwn"){openWriteOwn();return;}
  if(d.ownmin){t.parentElement.querySelectorAll("[data-ownmin]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="ownSave"){const title=($("#ownTitle").value||"").trim(),lines=($("#ownSteps").value||"").split("\n").map(x=>x.trim()).filter(Boolean);if(!title||!lines.length){toast("Give it a name and at least one step.");return;}const say=($("#ownSay").value||"").trim();const mn=document.querySelector('#ownMin [aria-pressed="true"]');
    const steps=lines.slice(0,10).map((l,i)=>({t:"Step "+(i+1),d:l}));if(say)steps[steps.length-1].say=say;
    const origin=($("#ownOrigin").value||"").trim(),fam=$("#ownFamily").checked;
    saveMyRitual({id:"mine-"+uid(),g:fam?"onora":"aura",title,el:fam?"Ancestry":"All elements",moon:"Any",min:mn?+mn.dataset.ownmin:10,purpose:origin||(fam?"A family tradition.":"A ritual you wrote."),family:fam,origin,needs:[],steps,secret:"",prompts:["What came up?"],tags:[]});closeSheet();renderArchive();toast("Saved to My rituals.");return;}
  if(d.cart){const [tg,yn]=d.cart.split(":");if(yn==="1"){S.cart.push({tag:tg,ts:Date.now()});toast("Added to your Alchemy list.");}else{(S.cartNo=S.cartNo||[]).push(tg);}persistAll();refreshCards();return;}
  if(d.cartgot){S.cart=S.cart.filter(c=>c.tag!==d.cartgot);setOwned(d.cartgot,true);closeSheet();openAltar(false);toast("Aura knows you have it now.");return;}
  if(d.cartdel){S.cart=S.cart.filter(c=>c.tag!==d.cartdel);persistAll();closeSheet();openAltar(false);return;}
  if(d.thread!==undefined){q=q===d.thread?"":d.thread;renderArchive();return;}
  if(t.id==="archAskBtn"){const qq=($("#archAsk").value||"").trim();if(!qq)return;t.disabled=true;$("#archAnswer").innerHTML='<p class="small muted" style="margin-top:10px">Reading your Archive...</p>';const a=await askArchive(qq);t.disabled=false;$("#archAnswer").innerHTML='<p style="margin-top:12px;font-size:18px">'+esc(a.answer)+'</p>'+(a.cites.length?'<div class="entries" style="margin-top:8px">'+a.cites.map(id=>{const e=S.entries.find(z=>z.id===id);return e?'<button class="entry" data-entry="'+esc(id)+'">'+glyph(e.guardian)+'<span><div class="t">'+esc(e.ritualTitle)+'</div><div class="m">'+fmtDate(e.ts)+'</div>'+(e.text?'<div class="x">'+esc(e.text)+'</div>':'')+'</span></button>':"";}).join("")+'</div>':'');return;}
  if(d.handoff){const from=talkG,to=d.handoff;const last=(S.chats[from]||[]).filter(m=>m.role==="me").slice(-1)[0];closeTalk();const list=S.chats[to]=S.chats[to]||[];guardianOpens(list,{text:G[from].name+" sent you to me. "+(last?"You said: \""+last.text.slice(0,160)+"\" ":"")+G[to].phrases[0]});saveLocal();openTalk(to);return;}
  if(d.snd==="menu"){openSound();return;}
  if(d.sndset){const v=d.sndset;
    if(v==="music-on"){if(!musicOn())setMusic(true);else{MUSIC.started=true;if(MUSIC.cur&&MUSIC.cur._g===MUSIC.want)MUSIC.cur.play().then(()=>fadeTo(MUSIC.cur,musicVol(),500)).catch(()=>{});else musicPlay(MUSIC.want);renderSnd();}}
    if(v==="music-off")setMusic(false);
    if(v==="vol-soft"||v==="vol-full"){S.prefMusicVol=v==="vol-soft"?"quiet":"normal";syncSnd();if(MUSIC.cur)fadeTo(MUSIC.cur,musicVol(),400);renderSnd();}
    if(v==="voice-on")setVoice(true);if(v==="voice-off")setVoice(false);
    track("music",{set:v});return;}
  if(d.snd){if(d.snd==="music"){
      /* If it says on but nothing is playing yet (phones block sound until a tap), this tap starts it instead of turning it off. */
      if(musicOn()&&!musicAudible()){MUSIC.started=true;if(MUSIC.cur&&MUSIC.cur._g===MUSIC.want){MUSIC.cur.play().then(()=>fadeTo(MUSIC.cur,musicVol(),500)).catch(()=>{});}else musicPlay(MUSIC.want);renderSnd();toast("Music on.");}
      else{const on=!musicOn();setMusic(on);toast(on?"Music on.":"Music off. Tap the note to bring it back.");}}else{const on=voiceMuted();setVoice(on);toast(on?"Voices on.":"Voices off. Tap the speaker to hear them again.");}track("music",{set:d.snd+(d.snd==="music"?(musicOn()?"_on":"_off"):(voiceMuted()?"_off":"_on"))});return;}
  if(t.id==="voiceBtn"){voiceOn=!voiceOn;if(voiceOn){if(voiceMuted())setVoice(true);if(!naturalVoices()&&!("speechSynthesis" in window)){voiceOn=false;toast("Spoken guidance isn't available on this device.");return;}startVoiceCommands();toast("Aura will guide you aloud. Say next, repeat or pause.");drawStep();}else{stopVoice();drawStep();}return;}
  if(d.own){const [tg,yn]=d.own.split(":");setOwned(tg,yn==="1");if(yn!=="1")noteMiss(tg);refreshCards();toast(yn==="1"?"Got it. Aura will remember.":"Got it. Aura rewrote it around what you have.");return;}
  if(d.donthave){const el=document.querySelector('[data-dh="'+d.donthave+'"]');if(el)el.hidden=!el.hidden;return;}
  if(d.keep){const [k,i]=d.keep.split(":"),it=(ledger()[k]||[])[+i];if(it){const ks=keptSet();ks.has(it)?ks.delete(it):ks.add(it);S.ledgerKeep=[...ks];saveLocal();remotePut("prefs");}const row=t.closest(".li");if(row&&it)row.outerHTML=ledgerItemHTML(k,+i,it);return;}
  if(d.correct){const [k,i]=d.correct.split(":"),it=(ledger()[k]||[])[+i],row=t.closest(".li");if(row&&it!=null){row.innerHTML='<label class="sr" for="corr_'+k+i+'">Correct this</label><input type="text" id="corr_'+k+i+'" value="'+esc(it)+'" style="flex:1"><button class="chip sm" data-corrsave="'+k+':'+i+'">Save</button>';const inp=row.querySelector("input");if(inp)inp.focus();}return;}
  if(d.corrsave){const [k,i]=d.corrsave.split(":"),L=ledger(),row=t.closest(".li"),v=((row&&row.querySelector("input"))||{}).value;if(L[k]&&v&&v.trim()){const old=L[k][+i];L[k][+i]=clean(v.trim()).slice(0,160);if(S.ledgerKeep&&S.ledgerKeep.includes(old))S.ledgerKeep=S.ledgerKeep.map(x=>x===old?L[k][+i]:x);saveLocal();remotePut("prefs");if(row)row.outerHTML=ledgerItemHTML(k,+i,L[k][+i]);toast("Corrected. Thank you.");}return;}
  if(d.forget){const [k,i]=d.forget.split(":");forgetLedger(k,+i);renderArchive();toast("Forgotten.");return;}
  if(t.id==="sheetDone"){closeSheet();return;}
  if(t.id==="restBtn"){lastRead=null;renderToday();toast("Rest well. Aura will be here.");return;}
  if(t.id==="saveLine"&&lastRead){const txt=($("#oneLine").value||"").trim();if(!txt){$("#oneLine").focus();return;}
    const e={kind:"entry",id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),ritualId:null,ritualTitle:"One sentence",guardian:lastRead.guardian,theme:lastRead.theme,carrying:lastRead.carrying||"",text:(lastRead.writePrompt?lastRead.writePrompt+" ":"")+txt,after:"",moon:M.name,prompts:[]};
    S.entries.unshift(e);saveLocal();remotePut("entry",e.id,e);updateLedger("One-sentence entry: "+e.text);lastRead=null;renderAll();toast("Saved. That counts.");return;}
  if(d.tryother){closeSheet();const e=S.entries.find(z=>z.id===d.tryother);tab("today");
    $("#readingSlot").innerHTML='<div class="reading"><div class="thinking"><span class="orb"></span>Aura is finding another way in...</div></div>';
    const txt=(e.carrying||e.ritualTitle)+" [After "+e.ritualTitle+" it felt the same. Do not repeat "+e.ritualTitle+" or "+(G[e.guardian]||G.aura).name+". Try a genuinely different approach.]";
    try{EXCLUDE=e.guardian;lastRead=await askAura(txt,S.profile.minutes);EXCLUDE=null;if(lastRead.guardian===e.guardian){EXCLUDE=e.guardian;lastRead=localRead(txt,S.profile.minutes);EXCLUDE=null;}lastRead.carrying=e.carrying||"";if(lastRead.ritual&&lastRead.ritual.id===e.ritualId){const alt=R.filter(z=>canUse(z)&&z.g!==e.guardian&&!z.reset);lastRead.ritual=alt[hash(e.id)%alt.length];lastRead.guardian=lastRead.ritual.g;}lastRead.intro=introFor(lastRead.guardian);markMet(lastRead.guardian);}catch(err){}
    renderToday();return;}
  if(t.id==="exportBtn"){exportArchive();return;}
  if(t.id==="clearBtn"){closeSheet();openSheet('<div class="stack"><div class="label">Clear my data</div><h2>Start fresh, keep your account.</h2><p>Your Archive, chats, Aura\'s memory, your cycle history and your settings will be permanently deleted. '+(MODE==="web"&&ACCT.user?'You stay signed in, and your account'+(ACCT.member?' and membership':'')+' stay exactly as they are.':'You can start again right away.')+'</p><p class="small muted">Want a copy first? Export your Archive before you clear it.</p><div class="field"><label for="clrConfirm">Type CLEAR to confirm</label><input type="text" id="clrConfirm" autocomplete="off"></div><button class="btn btn-main full danger" id="clrGo">Clear my data</button><button class="btn btn-ghost full" id="sheetDone">Keep my data</button></div>');return;}
  if(t.id==="clrGo"){if(($("#clrConfirm").value||"").trim().toUpperCase()!=="CLEAR"){$("#clrConfirm").focus();return;}t.disabled=true;t.textContent="Clearing...";const ok=await clearMyData();if(ok){closeSheet();toast("Your data is cleared. Your account is still here.");setTimeout(()=>location.reload(),1200);}else{t.disabled=false;t.textContent="Clear my data";}return;}
  if(t.id==="deleteBtn"){closeSheet();openSheet('<div class="stack"><div class="label">Delete everything</div><h2>This can\'t be undone.</h2><p>Your Archive, chats, Aura\'s memory, your settings'+(MODE==="web"&&ACCT.user?', your account'+(ACCT.member?', and your membership (it will be canceled)':''):'')+' will be permanently deleted.</p><div class="field"><label for="delConfirm">Type DELETE to confirm</label><input type="text" id="delConfirm" autocomplete="off"></div><button class="btn btn-main full danger" id="delGo">Delete everything</button><button class="btn btn-ghost full" id="sheetDone">Keep my data</button></div>');return;}
  if(t.id==="delGo"){if(($("#delConfirm").value||"").trim().toUpperCase()!=="DELETE"){$("#delConfirm").focus();return;}t.disabled=true;t.textContent="Deleting...";const ok=await deleteEverything();if(ok){closeSheet();S={profile:{name:"",minutes:10,have:[],known:[],tone:"balanced",onboarded:false},entries:[],draws:{},chats:{},usage:{}};lastRead=null;renderAll();toast("Everything is deleted.");}else{t.disabled=false;t.textContent="Delete everything";}return;}
  if(d.paywall!==undefined){closeTalk();openPaywall(d.paywall);return;}
  if(d.plan){payPlan=d.plan;t.parentElement.querySelectorAll("[data-plan]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));const pn=$("#planNote");if(pn)pn.textContent=payPlan==="yearly"?PLAN.yearNote:"Cancel anytime.";return;}
  if(d.previewMember){S.previewMember=!isMember();saveLocal();closeSheet();renderAll();toast(isMember()?"Previewing as a member.":"Previewing as free.");return;}
  if(d.legal){openSheet('<div class="stack legal">'+LEGAL[d.legal]+'</div>');return;}
  if(t.id==="siOpen"){openSignIn();return;}
  if(t.id==="siSwitch"){const f=$("#siForm");if(f)f.outerHTML=signInForm(t.dataset.gate==="1",f.dataset.by==="phone");return;}
  if(t.id==="siSend"&&$("#siPhone")){const ph=normPhone($("#siPhone").value);if(!ph){$("#siMsg").textContent="Check that number. Include the area code.";return;}t.disabled=true;const {error}=await ACCT.sb.auth.signInWithOtp({phone:ph,options:{shouldCreateUser:true}});t.disabled=false;if(error){$("#siMsg").textContent="Couldn't text the code. Check the number, or use email instead.";return;}ACCT.pendingPhone=ph;ACCT.pendingEmail=null;$("#siCodeRow").hidden=false;$("#siVerify").hidden=false;t.hidden=true;$("#siMsg").textContent="Code texted to "+ph+". It can take a minute.";$("#siCode").focus();return;}
  if(t.id==="siSend"){const em=($("#siEmail").value||"").trim();if(!/^\S+@\S+\.\S+$/.test(em)){$("#siMsg").textContent="Check that email address.";return;}t.disabled=true;const {error}=await ACCT.sb.auth.signInWithOtp({email:em,options:{shouldCreateUser:true}});t.disabled=false;if(error){$("#siMsg").textContent="Couldn't send the code. Try again in a minute.";return;}ACCT.pendingEmail=em;ACCT.pendingPhone=null;$("#siCodeRow").hidden=false;$("#siVerify").hidden=false;t.hidden=true;$("#siMsg").textContent="Code sent to "+em+". Check spam if it's not there in a minute.";$("#siCode").focus();return;}
  if(t.id==="siVerify"){const code=($("#siCode").value||"").replace(/\D/g,"");t.disabled=true;const {data,error}=await ACCT.sb.auth.verifyOtp(ACCT.pendingPhone?{phone:ACCT.pendingPhone,token:code,type:"sms"}:{email:ACCT.pendingEmail,token:code,type:"email"});t.disabled=false;if(error){$("#siMsg").textContent="That code didn't work. Check it, or send a new one.";return;}closeSheet();toast("Signed in. Your Archive is safe.");if(data&&data.session)await onSignedIn(data.session);return;}
  if(t.id==="checkoutBtn"){track("checkout",{plan:payPlan});if(!ACCT.user){openSignIn();return;}t.disabled=true;t.textContent="Opening checkout...";const r=await api("/api/checkout",{plan:payPlan});if(r.url){openExternal(r.url);}else{t.disabled=false;t.textContent="Join "+PLAN.name;toast("Checkout isn't available right now. Try again soon.");}return;}
  if(t.id==="portalBtn"){t.disabled=true;const r=await api("/api/portal",{});if(r.url)openExternal(r.url);else{t.disabled=false;toast("Couldn't open billing. Try again soon.");}return;}
  if(t.id==="signOut"){await ACCT.sb.auth.signOut();ACCT.user=null;ACCT.member=false;closeSheet();renderAll();toast("Signed out.");return;}
  if(d.talk){openTalk(d.talk);return;}
  if(d.gocircle){const b=document.querySelector('[data-tab="circle"]');if(b)b.click();window.scrollTo(0,0);return;}
  if(d.sleep||d.energy||d.moved!=null&&t.closest(".rhythm")||d.wind){
    const rec=d.wind?dayRec(nightKey()):dayRec();
    if(d.sleep)rec.sleep=+d.sleep;if(d.energy)rec.energy=+d.energy;if(d.moved!=null&&!d.sleep&&!d.energy&&!d.wind)rec.moved=+d.moved;if(d.wind)rec.wind=true;
    saveLocal();remotePut("prefs");renderToday();return;}
  if(t.id==="talkX"){closeTalk();return;}
  if(t.id==="chatSend"){sendTalk();return;}
  if(d.tab){tab(d.tab);return;}
  if(d.tabGo){closeSheet();tab(d.tabGo);return;}
  if(t.id==="altarBtn"){track("settings_open");openAltar(false);return;}
  if(t.id==="sheetX"){closeSheet();return;}
  if(d.talkafter){const [k,eid]=d.talkafter.split(":");const e=S.entries.find(x=>x.id===eid);const l=S.chats[k]=S.chats[k]||[];
    for(const m of l)if(m.role==="them"&&/ just finished .* with me\./.test(m.text||""))m.auto=true;
    guardianOpens(l,{text:(firstName()?firstName()+", you":"You")+" just finished "+(e?e.ritualTitle:"a ritual")+" with me."+(e&&e.text?' You wrote: "'+e.text.slice(0,120)+'".':"")+" What came up for you?"});
    saveLocal();remotePut("chat",k,{kind:"chat",msgs:l});openTalk(k);return;}
  if(t.id==="popClose"){closeSheet();return;}
  if(d.hear){const holder=t.closest(".bub,.voice");if(t.classList.contains("on")){stopAudio();return;}const txt=holder?[...holder.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(" ").trim():"";if(txt){stopAudio();t.classList.add("on");speak(txt,()=>t.classList.remove("on"),d.hear,false);track("hear",{g:d.hear});}return;}
  if(d.pmusic){S.prefMusic=d.pmusic==="off"?"off":"on";S.prefMusicVol=d.pmusic==="quiet"?"quiet":"normal";saveLocal();t.parentElement.querySelectorAll("[data-pmusic]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));track("music",{set:d.pmusic});syncSnd();if(d.pmusic==="off")musicStop();else{MUSIC.started=true;musicPlay(MUSIC.want);if(MUSIC.cur)fadeTo(MUSIC.cur,musicVol(),500);}renderSnd();return;}
  if(d.pvoice){if(d.pvoice==="off")setVoice(false);else{S.prefVoice=d.pvoice;setVoice(true);}t.parentElement.querySelectorAll("[data-pvoice]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="toConsent"){openConsent();return;}
  if(t.id==="consentSave"){const sc=checkedScope();setConsent(sc.length>0,sc);return;}
  if(t.id==="scopeSave"){const sc=checkedScope();await setConsent(sc.length>0,sc);return;}
  if(t.id==="pushOffer"){closeSheet();await enablePush();return;}
  if(t.id==="endFriendPreview"){S.previewFriend=false;S.previewMonitor=0;S.previewMonitorAnswer=null;saveLocal();closeSheet();renderAll();toast("Back to your own view.");return;}
  if(d.consent!=null){setConsent(d.consent==="1");return;}
  if(d.previewfriend){S.previewFriend=true;S.seenPop=S.seenPop||{};delete S.seenPop["friend-welcome"];delete S.seenPop.consent;S.previewMonitorAnswer=null;saveLocal();closeSheet();renderAll();auraPopup();return;}
  if(t.id==="fbOpen"||d.fb){openFeedback(d.fb||"settings");return;}
  if(d.fbmood){t.parentElement.querySelectorAll("[data-fbmood]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="fbSend"){sendFeedback(t.dataset.where);return;}
  if(t.id==="showAll"||t.id==="showAll2"){S.showAll=true;saveLocal();renderCircle();return;}
  if(t.id==="howOpen"||d.how){openHow();return;}
  if(t.id==="letterOpen"){openLetterFlow(t);return;}
  if(t.id==="trialSeen"){S.trialSeen=true;saveLocal();renderToday();return;}
  if(d.letter){openLetter(d.letter);return;}
  if(d.nudge){const [id,act]=d.nudge.split(":");nudgeAction(id,act);return;}
  if(d.q){const k=d.q;feelSel=feelSel.includes(k)?feelSel.filter(x=>x!==k):[...feelSel,k];t.setAttribute("aria-pressed",String(feelSel.includes(k)));return;}
  if(d.min){pickedMins=+d.min;t.parentElement.querySelectorAll("[data-min]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="askBtn"){
    const typed=$("#carry").value.trim(), text=[feelText(),typed].filter(Boolean).join(" ");
    if(!text){$("#carry").focus();$("#carry").placeholder="One word is enough.";return;}
    const mins=pickedMins||S.profile.minutes;
    t.disabled=true;
    $("#readingSlot").innerHTML='<div class="reading"><div class="thinking"><span class="orb"></span>Aura is reading the Archive...</div></div>';
    $("#readingSlot").scrollIntoView({behavior:"smooth",block:"start"});
    try{lastRead=await askAura(text,mins);const sk=safetyKind(text);if(sk){lastRead.care=true;setTimeout(()=>openSafety(sk),600);}track("reading",{feelings:feelSel.length,typed:!!typed});lastRead.carrying=text;lastRead.askId=logAsk(text,lastRead).id;lastRead.intro=introFor(lastRead.guardian);markMet(lastRead.guardian);saveUI();}catch(e){t.disabled=false;
      if(e&&e.code==="needs_birthday"){$("#readingSlot").innerHTML="";openBirthday("I need to confirm you\'re an adult before I can use this part of the app. I only ask once. When\'s your birthday?","ask");return;}
      if(e&&e.code==="ai_down"){$("#readingSlot").innerHTML='<div class="reading"><div class="handoff">'+glyph("aura")+'<p><span class="who2">Aura</span>I couldn\'t reach my full reading just now, and I won\'t guess. Give it a moment and tap Tell Aura again. Your words are still here.</p></div></div>';return;}
      return;}
    renderToday();$("#carry").value=typed;
    const slot=$("#readingSlot");if(slot)slot.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }
  if(d.talkread&&lastRead){const k=d.talkread,list=S.chats[k]=S.chats[k]||[];list.push({role:"me",ts:Date.now(),text:lastRead.carrying||""},{role:"them",ts:Date.now(),text:lastRead.reading,ritual:canUse(lastRead.ritual)&&!lastRead.ritual.composed?lastRead.ritual.id:null});saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(d.fromhere&&lastRead){const e=S.entries.find(x=>x.id===d.fromhere),k=lastRead.guardian,list=S.chats[k]=S.chats[k]||[];
    list.push({role:"me",ts:Date.now(),text:(lastRead.carrying||"")+" (Working from "+fmtDate(e.ts)+", after "+e.ritualTitle+", when I wrote: \""+(e.text||"").slice(0,400)+"\")"});
    guardianOpens(list,{text:"Then let's start there. On "+fmtDate(e.ts)+" you wrote \""+quoteOf(e)+"\" What feels the same tonight, and what's different?"});
    saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(t.id==="freshBtn"){const rc=$("#recall");if(rc)rc.remove();if(lastRead)lastRead.memory=null;return;}
  if(t.id==="againBtn"){lastRead=null;setTimeout(saveUI,0);feelSel=[];renderToday();$("#carry").focus();return;}
  if(d.begin){
    const r=(lastRead&&lastRead.ritual&&lastRead.ritual.id===d.begin)?lastRead.ritual:byId[d.begin];
    if(!r)return;
    if(!canUse(r)){closeTalk();if(r.adult21&&!vesperOK())vesperGate();else openPaywall(G[r.g].name+"'s chamber");return;}
    const ctx=(d.ctx==="read"&&lastRead)?{theme:lastRead.theme,carrying:lastRead.carrying,thread:lastRead.thread||""}:{};
    if(d.ctx==="talk"){const lm=(S.chats[talkG]||[]).filter(m=>m.role==="me").pop();ctx.carrying=lm?lm.text:"";closeTalk();}
    startRitual(r,ctx);return;
  }
  if(d.reset){const rn=resetNext();startRitual(rn&&rn.base.id===d.reset?rn.r:byId[d.reset],{theme:"reset",reset:true});return;}
  if(d.jday){const [jid,n]=d.jday.split(":");const j=JOURNEYS.find(x=>x.id===jid);startRitual(journeyStep(j,+n).r,{journey:jid,jday:+n,theme:THEME[j.g]});return;}
  if(t.id==="tarot"){t.classList.toggle("flipped");return;}
  if(d.pickcard!=null&&drawPick()==null&&threeMode()){
    const i=+d.pickcard,k=dayKey(today),rec=S.draws[k]&&Array.isArray(S.draws[k].picks)?S.draws[k]:{picks:[]};if(rec.picks.includes(i))return;
    rec.picks.push(i);S.draws[k]=rec;persist("draws");track("draw_pick",{n:rec.picks.length});t.classList.add("picked","flipped");
    const hd=document.querySelector("#v-circle h3");if(hd&&rec.picks.length<3)hd.textContent="Pick "+(3-rec.picks.length)+" more.";
    if(rec.picks.length>=3)setTimeout(renderCircle,1300);return;}
  if(d.pickcard!=null&&drawPick()==null){
    const i=+d.pickcard;S.draws[dayKey(today)]={pick:i};persist("draws");track("draw_pick",{g:drawSpread()[i]});
    const sp=$("#spread");if(sp)sp.classList.add("chosen");t.classList.add("picked","flipped");
    setTimeout(renderCircle,1100);return;}
  if(d.cardask&&threeMode()&&threeDone()){const cs=drawnCards();openTalk("aura");setTimeout(()=>{const ta=$("#chatIn");if(ta){ta.value="My three cards today: "+cs.map(x=>SPREAD_POS[x.pos][1]+", "+x.title).join("; ")+". Help me understand what they mean for me right now.";sendTalk();}},350);return;}
  if(d.cardask){const dr=todayDraw();openTalk("aura");setTimeout(()=>{const ta=$("#chatIn");if(ta){ta.value="I drew "+dr.title+" today. It speaks of "+(dr.rev?dr.card.revTheme:dr.card.theme)+". What does it mean for me right now?";sendTalk();}},350);return;}
  if(d.guardian){openGuardian(d.guardian);return;}
  if(d.chamber){openChamber(d.chamber);return;}
  if(d.journey){openJourney(d.journey);return;}
  if(d.entry){openEntry(d.entry);return;}
  /* ritual mode */
  if(t.id==="riteX"){if(run)track("ritual_exit",{id:run.r.id,step:run.i+1,of:run.r.steps.length});endRitual();return;}
  if(t.id==="nextBtn"){run.i++;track("ritual_step",{id:run.r.id,step:run.i+1,of:run.r.steps.length});drawStep();return;}
  if(t.id==="prevBtn"){run.i=Math.max(0,run.i-1);drawStep();return;}
  if(t.id==="holdBtn"){
    const s=run.r.steps[run.i];let left=s.hold;t.disabled=true;t.textContent="Holding";
    let wl=null;try{if(navigator.wakeLock)wl=await navigator.wakeLock.request("screen");}catch(e){}
    tick=setInterval(()=>{left--;const c=$("#clock");if(c)c.textContent=mmss(Math.max(0,left));if(left<=0){clearInterval(tick);t.textContent="Complete";try{wl&&wl.release();}catch(e){}}},1000);
    return;
  }
  if(d.after){t.parentElement.querySelectorAll("[data-after]").forEach(b=>b.setAttribute("aria-pressed",String(b===t&&b.getAttribute("aria-pressed")!=="true")));return;}
  if(t.id==="saveBtn"||t.id==="skipSave"){
    const txt=t.id==="saveBtn"?($("#refl").value||"").trim():"";
    const a=document.querySelector('#afterChips [aria-pressed="true"]');
    const ow=document.querySelector('#outWhen [aria-pressed="true"]');
    saveEntry(txt,a?a.dataset.after:"",{private:t.id==="saveBtn"&&$("#privateOnly")&&$("#privateOnly").checked,outside:t.id==="saveBtn"&&$("#outside")?($("#outside").value||"").trim():"",outWhen:ow?+ow.dataset.outwhen:7});return;
  }
  /* altar settings */
  if(d.pm){t.parentElement.querySelectorAll("[data-pm]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(d.have){t.setAttribute("aria-pressed",String(t.getAttribute("aria-pressed")!=="true"));return;}
  if(d.tone){t.parentElement.querySelectorAll("[data-tone]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="adultOk"){confirmAdultNow();return;}
  if(t.id==="dob21Go"){submitDob();return;}
  if(t.id==="bdayGo"){submitBirthday();return;}
  if(t.id==="introNext"){if(introAt<INTRO.length-1){introAt++;showIntro();}else introDone();return;}
  if(t.id==="introSkip"){introDone();return;}
  if(d.pmode){PN.mode=d.pmode;document.querySelectorAll("[data-pmode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.pmode===d.pmode));return;}
  if(t.id==="pnOpen"||t.closest&&t.closest("#pnOpen")){openPerson();return;}
  if(t.id==="pnSave"){savePerson();return;}
  if(t.id==="pnClear"){S.profile.person=null;saveLocal();remotePut("prefs");closeSheet();if(talkG)drawMsgs();renderAll();toast("Just you for now.");return;}
  if(t.id==="memOpen"){openMemory();return;}
  if(t.id==="openSettings2"){closeSheet();openAltar(false);return;}
  if(d.mem){const on=d.mem==="on";setMemory(on);t.parentElement.querySelectorAll("[data-mem]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));if($("#memIn")||!on||t.closest(".sheet .stack")&&!t.closest("#altarBody")){if(!$("#pName")){closeSheet();openMemory();}}toast(on?"I'll remember what you share. You can change this any time.":"Memory is off. I won't keep anything new.");renderToday();return;}
  if(t.id==="memAdd"){const v=($("#memIn").value||"").trim().slice(0,200);if(!v)return;S.memNotes.unshift({id:uid(),text:v,ts:Date.now()});persistAll();closeSheet();openMemory();toast("I'll remember that.");return;}
  if(d.memnote){S.memNotes=S.memNotes.filter(n=>n.id!==d.memnote);persistAll();closeSheet();openMemory();toast("Forgotten.");return;}
  if(d.forgetthread){forgetThread(d.forgetthread);closeSheet();openMemory();toast("I won't bring that thread up again.");return;}
  if(t.id==="noRem"&&lastRead){lastRead.noMem=true;const a=S.asks.find(z=>z.id===lastRead.askId);if(a){a.noMem=true;a.text="";persistAll();}$("#memLine").innerHTML='I won\'t remember this one. <button class="linkish" id="remAgain">Remember it after all</button>';return;}
  if(t.id==="remAgain"&&lastRead){lastRead.noMem=false;const a=S.asks.find(z=>z.id===lastRead.askId);if(a){a.noMem=false;a.text=String(lastRead.carrying||"").slice(0,400);persistAll();}$("#memLine").innerHTML='I\'ll remember this. <button class="linkish" id="noRem">Don\'t remember this</button> · <button class="linkish" id="memOpen">What I remember</button>';return;}
  if(d.fu){const card=t.closest("#fuCard"),a=card&&S.asks.find(z=>z.id===card.dataset.fuid);if(!a)return;
    if(d.fu==="notyet"){a.fuSnooze=Date.now()+864e5;persistAll();toast("No pressure. I'll ask again tomorrow.");renderToday();return;}
    if(d.fu==="letgo"){a.follow={did:false,helped:"",changed:"",carry:false,ts:Date.now(),letgo:true};persistAll();toast("Let go. That's allowed.");renderToday();return;}
    a._fu={did:d.fu!=="notyet",helped:{helped:"It helped",little:"A little",notreally:"Not really",did:""}[d.fu]};
    if(d.fu==="did"){$("#fuBtns").innerHTML=[["helped","I feel better"],["still","Still bothering me"],["happened","Something happened"]].map(b=>'<button class="chip" data-fu="'+b[0]+'">'+b[1]+'</button>').join("");return;}
    if(d.fu==="still"){stillBothering(a);return;}
    if(d.fu==="happened"){a._fu={did:true,helped:"Something happened"};followStep2(a,"Something happened");const ta=$("#fuText");if(ta){ta.placeholder="What happened?";ta.focus();}return;}
    followStep2(a,a._fu.helped);return;}
  if(t.id==="fuTell"){const c=$("#carry");if(c){c.focus();c.scrollIntoView({block:"center"});}return;}
  if(d.fusave){const card=t.closest("#fuCard"),a=card&&S.asks.find(z=>z.id===card.dataset.fuid);if(a)saveFollow(a,d.fusave==="carry");return;}
  if(d.tabgo){tab(d.tabgo);return;}
  if(d.peek){const r=byId[d.peek];if(r)openSheet('<div class="stack">'+ritualCard(r,{why:true})+'</div>');return;}
  if(t.id==="shareGet"){t.disabled=true;t.textContent="Getting your link...";await loadShare();return;}
  if(t.id==="shareGo"){doShare(false);return;}
  if(t.id==="shareCopy"){doShare(true);return;}
  if(t.id==="shareText"){shareVia("text");return;}
  if(t.id==="shareEmail"){shareVia("email");return;}
  if((t.id==="pSave"||t.id==="pSkip")&&$("#age18")&&!$("#age18").value){toast("Add your birthday to begin.");$("#age18").focus();return;}
  if((t.id==="pSave"||t.id==="pSkip")&&$("#age18")){const v=$("#age18").value,a=age21(v);if(a==null||a<0||a>120){toast("Choose your birthday.");return;}if(a<18){setBirthday(v);return;}if(!(await setBirthday(v)))return;}
  if(t.id==="pSave"||t.id==="pSkip"){
    if(t.id==="pSave"){
      const p=S.profile;
      p.name=$("#pName").value.trim().slice(0,40);
      if($("#pHave")){known();for(const [tg] of HAVE)if(!p.known.includes(tg))p.known.push(tg);}
      const pm=document.querySelector('#pMins [aria-pressed="true"]');if(pm)p.minutes=+pm.dataset.pm;
      if($("#pHave"))p.have=[...document.querySelectorAll('#pHave [aria-pressed="true"], #pAdv [aria-pressed="true"]')].map(b=>b.dataset.have);
      if($("#pAdv")){known();for(const [tg] of HAVE_ADV)if(!p.known.includes(tg))p.known.push(tg);}
      const tn=document.querySelector('#pTone [aria-pressed="true"]');if(tn)p.tone=tn.dataset.tone;
    }
    S.profile.onboarded=true;persist("profile");closeSheet();pickedMins=null;renderAll();
    if(S.friendCode&&accountsOn()&&!ACCT.user){setTimeout(()=>openSignIn(),400);}else setTimeout(auraPopup,900);
    if(t.id==="pSave")toast("I'll remember.");
    return;
  }
});
document.addEventListener("change",ev=>{if(ev.target.dataset&&ev.target.dataset.entpriv){const e=S.entries.find(z=>z.id===ev.target.dataset.entpriv);if(e){e.private=ev.target.checked;saveLocal();remotePut("entry",e.id,e);renderArchive();toast(e.private?"Private. Aura won't use it.":"Aura can use this again.");}}});
document.addEventListener("input",ev=>{if(ev.target.id==="chatIn"){ev.target.style.height="auto";ev.target.style.height=Math.min(140,ev.target.scrollHeight)+"px";}if(ev.target.id==="archSearch"){q=ev.target.value;$("#entryList").innerHTML=entryList();}});
document.addEventListener("keydown",ev=>{if(ev.key==="Enter"&&!ev.shiftKey&&ev.target.id==="chatIn"){ev.preventDefault();sendTalk();return;}if(ev.key==="Escape"){if($("#simple"))closeSimple();else if($("#scrim"))closeSheet();else if(run)endRitual();else if(talkG)closeTalk();}});

function refreshCards(){
  document.querySelectorAll(".page[data-rid]").forEach(el=>{const r=(lastRead&&lastRead.ritual&&lastRead.ritual.id===el.dataset.rid)?lastRead.ritual:byId[el.dataset.rid];if(!r)return;let o={};try{o=JSON.parse(el.dataset.opts||"{}");}catch(e){}const w=document.createElement("div");w.innerHTML=ritualCard(r,o);el.replaceWith(w.firstChild);});
}
function renderBadge(){const b=$("#memBadge");if(!b)return;b.hidden=!isMember();b.textContent=isLifetime()?"Inner Circle · Lifetime":inTrial()?"Inner Circle · "+trialDaysLeft()+(trialDaysLeft()===1?" day":" days")+" free":"Inner Circle";}
function renderAll(){renderBadge();renderSky();renderToday();renderJourneys();renderCircle();renderArchive();}
noteVisit();drawSeal();renderAll();setTimeout(cycleSync,2500);setTimeout(()=>{auraPopup();setTimeout(maybeAskFeedback,400);trackOpen();},1200);
if(!S.profile.onboarded)setTimeout(()=>{if(!S.profile.onboarded&&!$("#scrim")&&!$("#gate")&&!$("#phoneOnly"))openAltar(true);},700);
restoreUI();
initCloud();initWeb();
