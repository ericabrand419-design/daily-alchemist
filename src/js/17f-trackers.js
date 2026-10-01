/* ------------------------------------------------------------------
   GUARDIAN TRACKERS. Not dashboards for their own sake:
   Iris keeps body-cycle rhythm, Rowan learns what movement actually
   helps, and Sol keeps goals moving. No calories, streaks or guilt.
------------------------------------------------------------------ */
if(!S.movements)S.movements=[];
if(!S.goals)S.goals=[];

function todayMoves(d){
  const k=dayKey(d||new Date());
  return (S.movements||[]).filter(x=>dayKey(new Date(x.ts))===k).sort((a,b)=>b.ts-a.ts);
}
function movementDays(days){
  const cut=Date.now()-(days||7)*864e5;
  return new Set((S.movements||[]).filter(x=>x.ts>=cut).map(x=>dayKey(new Date(x.ts)))).size;
}
function movementInsight(){
  const recent=(S.movements||[]).filter(x=>Date.now()-x.ts<30*864e5);
  if(!recent.length)return "";
  const by={};for(const x of recent)by[x.type]=(by[x.type]||0)+1;
  const top=Object.entries(by).sort((a,b)=>b[1]-a[1])[0];
  const felt=recent.filter(x=>x.feel),better=felt.filter(x=>x.feel==="better").length;
  const bits=[];
  const week=movementDays(7);if(week)bits.push("You moved on "+week+" day"+(week===1?"":"s")+" this week");
  if(top&&top[1]>=2)bits.push((top[0]==="other"?"Movement":top[0].charAt(0).toUpperCase()+top[0].slice(1))+" is what you reach for most");
  if(felt.length>=3&&better>=2)bits.push("you've usually felt better after moving");
  return bits.join(". ")+(bits.length?".":"");
}
function movementAIText(){
  const ins=movementInsight();if(!ins)return "";
  return "ROWAN (movement history, no calories or fitness scoring): "+ins+" Use this only when movement is relevant. Never shame her for not moving.\n";
}
function rowanPanelHTML(){
  const today=todayMoves(),ins=movementInsight();
  return '<div class="card tracker rowantrack"><div class="label">Movement with Rowan</div><p style="margin-top:6px">This is not exercise scoring. I keep track of how you moved and whether it actually helped.</p>'+
    (today.length?'<div class="trackerstat"><b>'+today.length+'</b><span>movement'+(today.length===1?"":"s")+" today</span></div>":"")+
    (ins?'<div class="remember"><span class="label">Rowan has noticed</span><p>'+esc(ins)+'</p></div>':"")+
    '<div class="field"><label for="moveType">What did you do?</label><select id="moveType"><option value="walk">Walk</option><option value="strength">Strength</option><option value="stretch">Stretch or mobility</option><option value="dance">Dance</option><option value="yoga">Yoga</option><option value="chores">Chores or yard work</option><option value="sport">Sport</option><option value="other">Something else</option></select></div>'+
    '<div class="row trackerfields"><div class="field"><label for="moveMin">Minutes <span class="muted">(optional)</span></label><input id="moveMin" type="number" inputmode="numeric" min="1" max="300" placeholder="10"></div><div class="field"><label for="moveFeel">Afterward</label><select id="moveFeel"><option value="">Not sure yet</option><option value="better">Better</option><option value="same">About the same</option><option value="tired">More tired</option></select></div></div>'+
    '<button class="btn btn-main full" id="moveSave">Log movement</button>'+
    (today.length?'<details class="cyclog"><summary>Today</summary>'+today.map(x=>'<div class="li"><span><b>'+esc(x.type.charAt(0).toUpperCase()+x.type.slice(1))+'</b>'+(x.min?" · "+x.min+" min":"")+(x.feel?" · "+esc(x.feel==="better"?"felt better":x.feel==="same"?"felt the same":"felt more tired"):"")+'</span><button class="x2" data-movedel="'+x.id+'" aria-label="Delete">×</button></div>').join("")+'</details>':"")+
    '<p class="small muted">No streaks. No calorie counts. Rowan uses this to learn what kind of movement helps you under what conditions.</p></div>';
}
function saveMovement(){
  const type=($("#moveType")||{}).value||"other",min=Math.max(0,Math.min(300,+((($("#moveMin")||{}).value)||0))),feel=($("#moveFeel")||{}).value||"";
  const x={id:"mv_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),ts:Date.now(),type,min:min||null,feel};
  S.movements.unshift(x);S.movements=S.movements.slice(0,500);
  const d=S.days[dayKey(new Date())]=S.days[dayKey(new Date())]||{};d.moved=1;
  persistAll();track("movement_log",{type});return x;
}

function activeGoals(){return (S.goals||[]).filter(g=>g.status==="open").sort((a,b)=>b.updated-a.updated);}
function goalInsight(){
  const gs=S.goals||[],done=gs.filter(g=>g.status==="done"&&Date.now()-(g.doneAt||0)<30*864e5).length,open=activeGoals();
  const stuck=open.filter(g=>(g.updates||[]).slice(-1)[0]?.state==="stuck");
  const bits=[];if(open.length)bits.push("You have "+open.length+" active goal"+(open.length===1?"":"s"));if(done)bits.push("you finished "+done+" in the last 30 days");if(stuck.length)bits.push(stuck.length+" "+(stuck.length===1?"is":"are")+" currently stuck");
  return bits.join(". ")+(bits.length?".":"");
}
function goalAIText(){
  const open=activeGoals().slice(0,3);if(!open.length)return "";
  return "SOL (goals she chose to track): "+open.map(g=>g.title+"; next move: "+(g.next||"not set")).join(" | ")+". Help with the next move, not motivation theater.\n";
}
function solGoalsHTML(){
  const open=activeGoals(),done=(S.goals||[]).filter(g=>g.status==="done").slice(0,4),ins=goalInsight();
  return '<div class="card tracker soltrack"><div class="label">What you are building with Sol</div><p style="margin-top:6px">A goal only belongs here if keeping the thread helps you take the next real step.</p>'+
    (ins?'<div class="remember"><span class="label">Sol has the thread</span><p>'+esc(ins)+'</p></div>':"")+
    open.map(g=>'<div class="goalrow"><div><b>'+esc(g.title)+'</b><p class="small muted">Next move</p><div class="row goalnext"><input type="text" maxlength="140" value="'+esc(g.next||"")+'" id="goalnext-'+g.id+'" placeholder="The next thing you can actually do"><button class="chip" data-goalupdate="'+g.id+'">Save</button></div></div><div class="row"><button class="chip" data-goalact="'+g.id+':done">Done</button><button class="chip" data-goalact="'+g.id+':stuck">I am stuck</button><button class="chip" data-goalact="'+g.id+':pause">Pause it</button></div></div>').join("")+
    '<details class="cyclog"'+(!open.length?' open':'')+'><summary>Add a goal</summary><div class="field"><label for="goalTitle">What are you trying to make happen?</label><input type="text" id="goalTitle" maxlength="120" placeholder="Finish the bathroom, launch the app, apply for three jobs"></div><div class="field"><label for="goalNext">What's the next move?</label><input type="text" id="goalNext" maxlength="140" placeholder="One action, not the whole plan"></div><button class="btn btn-main full" id="goalAdd">Let Sol hold this</button></details>'+
    (done.length?'<details class="cyclog"><summary>Finished</summary>'+done.map(g=>'<div class="li"><span>✓ '+esc(g.title)+'</span></div>').join("")+'</details>':"")+
    '<p class="small muted">No streaks. Sol cares about movement, blockers and the next honest step.</p></div>';
}
function addGoal(){
  const title=(($("#goalTitle")||{}).value||"").trim().slice(0,120),next=(($("#goalNext")||{}).value||"").trim().slice(0,140);
  if(!title)return null;
  const g={id:"gl_"+Date.now().toString(36)+Math.random().toString(36).slice(2,5),title,next,status:"open",created:Date.now(),updated:Date.now(),updates:[]};
  S.goals.unshift(g);S.goals=S.goals.slice(0,100);persistAll();if(memOn())updateLedger("Goal with Sol: "+title+(next?". Next move: "+next:""));return g;
}
function trackerPanelHTML(k){return k==="rowan"?rowanPanelHTML():k==="sol"?solGoalsHTML():"";}
function trackerClick(t,d){
  if(t.id==="moveSave"){saveMovement();toast("Rowan has it.");closeSheet();openGuardian("rowan");return true;}
  if(d.movedel){S.movements=S.movements.filter(x=>x.id!==d.movedel);persistAll();closeSheet();openGuardian("rowan");return true;}
  if(t.id==="goalAdd"){const g=addGoal();if(!g){toast("Name the goal first.");return true;}toast("Sol has the thread.");closeSheet();openGuardian("sol");return true;}
  if(d.goalupdate){const g=S.goals.find(x=>x.id===d.goalupdate);if(g){g.next=((document.getElementById("goalnext-"+g.id)||{}).value||"").trim().slice(0,140);g.updated=Date.now();(g.updates=g.updates||[]).push({ts:Date.now(),state:"next",note:g.next});persistAll();toast("Next move updated.");}return true;}
  if(d.goalact){const [id,act]=d.goalact.split(":"),g=S.goals.find(x=>x.id===id);if(!g)return true;g.updated=Date.now();g.updates=g.updates||[];
    if(act==="done"){g.status="done";g.doneAt=Date.now();g.updates.push({ts:Date.now(),state:"done"});if(memOn())updateLedger("She finished a goal she tracked with Sol: "+g.title);toast("Done. Sol kept the receipt.");closeSheet();openGuardian("sol");}
    else if(act==="pause"){g.status="paused";g.updates.push({ts:Date.now(),state:"paused"});toast("Paused. No guilt.");closeSheet();openGuardian("sol");}
    else if(act==="stuck"){g.updates.push({ts:Date.now(),state:"stuck"});persistAll();const list=S.chats.sol=S.chats.sol||[];guardianOpens(list,{text:"You're stuck on "+g.title+". The next move was: "+(g.next||"not clear yet")+". Tell me what's actually in the way."});saveLocal();closeSheet();openTalk("sol");}
    persistAll();return true;
  }
  return false;
}
