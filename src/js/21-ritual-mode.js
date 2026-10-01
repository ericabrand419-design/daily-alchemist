/* ------------------------------------------------------------------
   RITUAL MODE: one step at a time, on parchment
------------------------------------------------------------------ */
let run=null, tick=null;
const ROMAN=["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
const ORN='<svg class="orn" viewBox="0 0 220 20" aria-hidden="true"><path d="M4 10h78M138 10h78" stroke="#9A7414" stroke-width="1"/><path d="M82 10c8 0 12-6 18-6M138 10c-8 0-12-6-18-6M82 10c8 0 12 6 18 6M138 10c-8 0-12 6-18 6" fill="none" stroke="#9A7414" stroke-width="1"/><path d="M110 2l2.6 5.4L118 10l-5.4 2.6L110 18l-2.6-5.4L102 10l5.4-2.6z" fill="#BF1E73"/><circle cx="4" cy="10" r="1.6" fill="#9A7414"/><circle cx="216" cy="10" r="1.6" fill="#9A7414"/></svg>';
function startRitual(r,ctx){
  closeSheet();
  run={base:r,r:adapt(r),i:-1,ctx:ctx||{},t0:Date.now()};MUSIC.started=true;track("ritual_start",{id:r.id,g:r.g,of:r.steps.length});musicFor(r.g);
  const el=document.createElement("div");el.className="rite";el.id="rite";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",r.title);
  el.style.setProperty("--gcol",G[r.g].color);document.body.appendChild(el);document.body.style.overflow="hidden";
  drawStep();
}
function endRitual(){stopEyes();stopVoice();try{stopAudio();speechSynthesis.cancel();}catch(e){}musicDuck(false);clearInterval(tick);const el=$("#rite");if(el)el.remove();document.body.style.overflow="";run=null;if(talkG)musicFor(talkG);else musicBack();}
function drawStep(){
  clearInterval(tick);
  const {r,i}=run, total=r.steps.length, el=$("#rite"), g=G[r.g];
  const bar='<div class="bar"><button class="navback ritualback" id="riteX" aria-label="Back">← <span>Back</span></button>'+guardianMark(r.g,32,true)+'<span class="t">· '+esc(r.title)+'</span><span class="sndbar"></span></div><div class="pips">'+Array.from({length:total+1},(_,k)=>'<i class="'+(k<i?"on":k===i?"on now":"")+'"></i>').join("")+'</div>';
  if(i===-1){
    const base=run.base||r,items=ritualNeedItems(base),chips=items.length?items.map(n=>{const miss=known().includes(n[0])&&!S.profile.have.includes(n[0]);return '<button class="needchip'+(miss?' missing':'')+'" data-ritualneed="'+n[0]+':'+(miss?'1':'0')+'" aria-pressed="'+(!miss)+'"><span class="needcheck">'+(miss?'＋':'✓')+'</span>'+esc(n[1])+'</button>';}).join(""):'<span class="needchip static">Nothing but you</span>';
    el.innerHTML='<div class="wm">'+glyph(r.g,340)+'</div><div class="wrap">'+bar+
      '<div class="ritualintro">'+
      '<div class="count"><span class="seal">✦</span><span>Before you begin</span></div><h2>'+esc(r.title)+'</h2>'+ORN+
      '<p class="purpose">'+esc(r.purpose||"")+'</p>'+
      '<div class="gatherbox"><span class="sayl">Gather everything now</span><p class="supplyhint">Tap anything you are missing. If you tapped it by mistake, tap it again to add it back.</p><div class="needchips">'+chips+'</div></div>'+
      (r.notes&&r.notes.length?'<div class="supplyswap"><span class="sayl">Aura adapted it</span><p>'+r.notes.map(esc).join(" ")+'</p></div>':'')+
      '<p class="prepnote">Nothing new should appear halfway through. Check the list now, and Aura will adapt before you begin.</p>'+
      '</div></div><div class="foot prepfoot"><button class="btn btn-ghost" id="missingBtn">I am missing something</button><button class="btn btn-ink" id="nextBtn">I have what I need</button></div>';
    el.scrollTop=0;return;
  }
  if(i<total){
    const s=r.steps[i];
    el.innerHTML='<div class="wm">'+glyph(r.g,340)+'</div><div class="wrap">'+bar+'<div class="count"><span class="seal">'+ROMAN[i+1]+'</span><span>of '+ROMAN[total]+'</span></div><h2>'+esc(s.t)+'</h2>'+ORN+(i===0&&r.purpose?'<p class="purpose">'+esc(r.purpose)+'</p>':"")+'<p class="text">'+esc(s.d)+'</p>'+
      (s.say?'<div class="say"><span class="sayl">Say it aloud</span>"'+esc(s.say)+'"</div>':"")+
      (!voiceEnabled()?'':'<div class="guide">'+(voiceOn?'<button class="btn btn-ghost sm" id="voiceBtn" aria-pressed="true">Pause</button><button class="btn btn-ghost sm" id="repeatBtn">Repeat</button><button class="btn btn-ghost sm" id="eyesBtn">Close my eyes</button>':'<button class="btn btn-ghost sm" id="voiceBtn" aria-pressed="false">Guide me aloud</button>')+'</div>')+
      (s.hold?'<div class="timer"><span class="clock" id="clock">'+mmss(s.hold)+'</span><button class="btn btn-ghost" id="holdBtn">Start timer</button></div>':"")+
      (i===total-1&&r.secret?'<p class="secret">'+esc(r.secret)+'</p>':"")+
      '</div><div class="foot">'+(i>0?'<button class="btn btn-ghost" id="prevBtn">Back</button>':"")+'<button class="btn btn-ink" id="nextBtn">'+(i===total-1?"Finish":"Next")+'</button></div>';
  }else{
    const prompts=r.prompts||["What came up?"];
    el.innerHTML='<div class="wm">'+glyph(r.g,340)+'</div><div class="wrap">'+bar+'<div class="count"><span class="seal done">✦</span><span>Ritual complete</span></div><h2>You did it. Write it down before it fades.</h2>'+ORN+'<p class="text">'+prompts.map(esc).join(" ")+'</p>'+
      '<label class="sr" for="refl">Your reflection</label><textarea id="refl" style="min-height:160px" placeholder="A few honest lines is plenty."></textarea>'+
      '<div class="field"><label for="outside" style="color:var(--ink-soft)">What changes outside the ritual?</label><input type="text" id="outside" placeholder="'+esc(OUTSIDE_HINT[r.g]||"One real thing you'll do")+'"><div class="chips" id="outWhen" style="margin-top:6px"><button class="chip" data-outwhen="1" aria-pressed="false">Check in tomorrow</button><button class="chip" data-outwhen="7" aria-pressed="true">In a week</button></div></div>'+
      '<label class="switch" for="privateOnly" style="color:var(--ink)">For my eyes only. Aura won\'t read this.<input type="checkbox" id="privateOnly"></label>'+
      '<div><div class="small" style="color:var(--ink-soft);margin-bottom:8px">Afterward I feel</div><div class="chips" id="afterChips">'+["Lighter","Clearer","Stirred up","Tender","Powerful","The same"].map(a=>'<button class="chip" data-after="'+a+'" aria-pressed="false">'+a+'</button>').join("")+'</div></div>'+
      '</div><div class="foot"><button class="btn btn-ghost" id="skipSave">Skip writing</button><button class="btn btn-ink" id="saveBtn">Save to archive</button></div>';
  }
  el.scrollTop=0; const w=el.querySelector(".wrap"); if(w)w.scrollTop=0;
  speakStep();
}
const OUTSIDE_HINT={thistle:"Mute the thread tonight",rue:"Block the number",sage:"Say it to their face, or let it go",marigold:"Send the invoice",sol:"Put the first step on your calendar today",juniper:"Clear the entry table",fern:"In bed by 10",lily:"Close the laptop at 7",onyx:"Tell one person the truth",willow:"Call the person who remembers them too",vesper:"Say one want out loud to your person",iris:"Log how today actually felt",rowan:"Walk around the block after dinner",lumen:"Book the first appointment",aurora:"Phone stays off until after coffee",wren:"Write down the next sign",onora:"Ask about the family story"};
function mmss(s){return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
function saveEntry(text,after,extra){
  const {r,ctx}=run; extra=extra||{};
  const e={kind:"entry",id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),ritualId:r.composed?null:r.id,ritualTitle:r.title,guardian:r.g,
    theme:ctx.theme||THEME[r.g],carrying:ctx.carrying||"",text:text||"",after:after||"",moon:M.name,resetDay:ctx.reset?r.reset:null,journey:ctx.journey||null,jday:ctx.jday||null,prompts:r.prompts||[],thread:ctx.thread||"",private:!!extra.private,outside:extra.outside||""};
  if(lastRead&&lastRead.noMem&&lastRead.ritual&&lastRead.ritual.id===r.id){e.private=true;}
  {const ak=S.asks.find(z=>!z.did&&z.ritualId===r.id&&Date.now()-z.ts<18*3600e3);if(ak){ak.did=e.id;if(!e.thread)e.thread=ak.thread;}}
  S.entries.unshift(e);saveLocal();remotePut("entry",e.id,e);track("ritual",{id:r.id,g:r.g,wrote:!!e.text});
  if(extra.outside)addPromise(extra.outside,extra.outWhen||7,e.id);
  if(ctx.space){const sp=S.spaces.find(z=>z.id===ctx.space);if(sp){sp.log.unshift({id:r.id,title:r.title,ts:e.ts});sp.log=sp.log.slice(0,10);persistAll();}}
  e._task=!extra.outside&&!e.private?taskGuess(text):"";
  if(ctx.plan){const pl=S.plans.find(z=>z.id===ctx.plan);if(pl&&pl.steps[ctx.pstep]){pl.steps[ctx.pstep].done=true;if(pl.steps.every(z=>z.done))pl.done=true;persistAll();}}
  endRitual();
  const rk=safetyKind(e.text);if(rk){renderAll();openSafety(rk);return;}
  toast(ctx.jday?"Day "+ctx.jday+" complete. Saved to your archive.":ctx.reset?"Day "+r.reset+" saved. Saved to your archive.":"Saved to your archive.");
  renderAll();
  afterLoop(e,r);
  if(!e.private)updateLedger("Ritual entry: "+JSON.stringify({date:fmtDate(e.ts),guardian:(G[e.guardian]||G.aura).name,ritual:e.ritualTitle,carrying:e.carrying,wrote:e.text,felt_after:e.after}));
}
function afterLoop(e,r){
  afterLoop0(e,r);
  if(e._task){const tb='<div class="ask dark"><span>You wrote: "'+esc(e._task)+'". Want me to hold you to it?</span><button class="chip" data-taskyes="'+esc(e.id)+'">Yes, check in tomorrow</button></div>';const st=$("#scrim .stack");if(st)st.insertAdjacentHTML("beforeend",tb);else openSheet('<div class="stack"><div class="label">Aura noticed</div>'+tb+'<button class="btn btn-ghost full" id="sheetDone">Close</button></div>');}
}
function afterLoop0(e,r){
  const a=e.after; const g=G[r.g];
  if(!a){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph(r.g)+'<p><span class="who2" style="color:'+g.color+'">'+esc(g.name)+'</span>That\'s '+esc(r.title)+', done. It\'s in your Archive now. I\'ll be here when you need me again.</p></div><button class="btn btn-main full" data-talkafter="'+r.g+':'+esc(e.id)+'">Talk to '+esc(g.name)+' about it</button><button class="btn btn-ghost full" id="sheetDone">Close</button></div>');return;}
  if(GOOD.includes(a)){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>Noted. '+esc(r.title)+' left you '+esc(a.toLowerCase())+'. I\'ll remember that it works for you.</p></div><button class="btn btn-main full" data-talkafter="'+r.g+':'+esc(e.id)+'">Talk to '+esc(g.name)+' about it</button><button class="btn btn-ghost full" id="sheetDone">Close</button></div>');return;}
  if(a==="The same"){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>That didn\'t move it. That\'s information, not failure. Do you want me to try a different approach?</p></div><button class="btn btn-main full" data-tryother="'+esc(e.id)+'">Try something different</button><button class="btn btn-ghost full" data-talkafter="'+r.g+':'+esc(e.id)+'">Talk to '+esc(g.name)+' about it</button><button class="btn btn-ghost full" id="sheetDone">Not tonight</button></div>');return;}
  if(a==="Stirred up"){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>Something moved. Let\'s settle your body before you go. Two minutes with Lily.</p></div><button class="btn btn-main full" data-begin="two-minute-settle">Settle for two minutes</button><button class="btn btn-ghost full" id="sheetDone">I\'m okay</button></div>');return;}
  if(a==="Tender"){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>Tender means it reached something real. Be gentle with yourself tonight. Willow is here if you want to talk.</p></div><button class="btn btn-main full" data-talk="willow">Talk to Willow</button><button class="btn btn-ghost full" id="sheetDone">I just want to rest</button></div>');return;}
}

