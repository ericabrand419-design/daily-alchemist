/* ------------------------------------------------------------------
   CIRCLE
------------------------------------------------------------------ */
function innerCircleHTML(compact){
  const n=R.filter(r=>r.member).length, mem=isMember();
  const ch=ALL.filter(k=>k!=="aura"&&CHAMBERS[k]);
  let h='<div class="card icircle'+(mem?' open':'')+'"><div class="row between"><span class="label">'+esc(PLAN.name)+'</span>'+(mem?'<span class="badge gold">'+(isLifetime()?'Lifetime':inTrial()?'Your free week':'You\'re a member')+'</span>':'<span class="price">From '+PLAN.monthly+'/mo</span>')+'</div>'+
    '<div style="margin-top:10px">'+auraSays(mem?(inTrial()?"This week everything is open. I\'ll write to you, and the guardians will come find you.":"You\'re in. I write to you every week, and the guardians check in on you by name."):"I\'d like to keep you in mind between visits. In the Inner Circle, I write to you every week, and the guardians check in on you by name.")+'</div><p class="small muted" style="margin-top:8px">Plus every guardian\'s deeper chamber, the guided journeys, and more time with me.</p>';
  if(!compact){
    h+='<button class="chc wide" data-chamber="aura">'+glyph("aura",30)+'<span class="cn">'+esc(CHAMBERS.aura.name)+'</span><span class="cl">'+(mem?'Open':'🔒')+'</span></button><div class="chgrid">'+ch.map(k=>'<button class="chc" data-chamber="'+k+'">'+glyph(k,30)+'<span class="cn">'+esc(CHAMBERS[k].name)+'</span><span class="cl">'+(mem?'Open':'🔒')+'</span></button>').join("")+'</div>';
    h+='<div class="label" style="margin-top:14px">Journeys</div>'+JOURNEYS.map(j=>'<button class="li jl" data-journey="'+j.id+'"><span>'+esc(j.name)+'<br><span class="small muted">7 days with '+esc(G[j.g].name)+'</span></span><span class="cl">'+(mem?'Start':'🔒')+'</span></button>').join("");
  }
  h+=(mem?'':'<button class="btn btn-main full" style="margin-top:14px" data-paywall="Go deeper">'+(compact?'See what\'s inside':'Join '+esc(PLAN.name))+'</button>')+'</div>';
  return h;
}
function memberTonightHTML(){
  if(!isMember())return innerCircleHTML(true);
  const pool=R.filter(r=>r.member);const r=pickForNow(pool,new Date(),"member");
  return '<details class="quiet"><summary><span class="label">From your chambers tonight</span><span class="qt">'+esc(r.title)+' with '+esc(G[r.g].name)+' · '+r.min+' min</span></summary><div style="margin-top:10px">'+ritualCard(r,{why:true})+'</div></details>';
}
function renderCircle(){
  const draw=todayDraw();
  const pi=drawPick(), sp=drawSpread();
  let h;
  if(pi==null){
    h='<div><div class="label">The altar draw</div><h3 style="margin-top:6px">Pick a card.</h3><p class="muted" style="margin-top:4px">Five cards, one for you today. Each guardian\'s card carries a message, a question and an invitation. Trust your hand.</p><div class="spread" id="spread">'+
      sp.map((g,i)=>'<button class="tarot sp" data-pickcard="'+i+'" style="--i:'+(i-2)+'" aria-label="Card '+(i+1)+'"><div class="inner"><div class="face back">'+cardBack()+'</div><div class="face front">'+cardFace(g)+'</div></div></button>').join("")+'</div></div>';
  }else{
    h='<div><div class="label">The altar draw</div><div class="altar" style="margin-top:10px"><button class="tarot flipped" id="tarot" aria-label="Flip the card"><div class="inner"><div class="face back">'+cardBack()+'</div><div class="face front">'+cardFace(draw.g)+'</div></div></button><div id="drawText">'+drawHTML(draw)+'<p class="small muted" style="margin-top:10px">A new spread waits tomorrow.</p></div></div></div>';
  }
  const met=metList(), full=S.showAll||met.length>=3;
  if(!full){
    h+='<button class="card link lead" data-guardian="aura">'+glyph("aura")+'<span><div class="label">Keeper of the Archive</div><h3 style="margin-top:2px">Aura</h3><p class="small muted" style="margin-top:4px">'+esc(G.aura.domain)+'</p></span></button>';
    if(met.length)h+='<div><div class="label">Your circle so far</div></div><div class="circle">'+met.map(k=>'<button class="g" data-guardian="'+k+'">'+glyph(k)+'<span class="n">'+esc(G[k].name)+'</span><span class="e job">'+esc(JOB[k].split(".")[0])+'</span></button>').join("")+Array.from({length:(3-met.length%3)%3},()=>'<button class="g ghost" id="showAll2" aria-label="Show everyone"><span class="gq">?</span><span class="n">Waiting</span></button>').join("")+'</div>';
    {const gs=guardianSeasons();if(gs)h+='<div class="card">'+auraSays(esc(gs.join(" ")),"Aura · the seasons of your circle")+'</div>';}
    const left=ALL.length-1-met.length;
    h+='<div class="card waiting">'+auraSays((met.length?left+" more guardians":"Eighteen guardians")+" are waiting to meet you. You don\'t have to pick. When you tell me what you\'re carrying, I\'ll send you to the one who can hold it, and introduce you.")+
      '<div class="ghosts" aria-hidden="true">'+Array.from({length:Math.min(left,12)},()=>'<span></span>').join("")+'</div><button class="btn btn-ghost full" id="showAll" style="margin-top:12px">Show me everyone anyway</button></div>';
    h+=innerCircleHTML(true);
    $("#v-circle").innerHTML=h;return;
  }
  h+=innerCircleHTML(false);
  h+='<div><div class="label">The circle</div><h2>Eighteen guardians. One Archive.</h2><p class="muted" style="margin-top:6px">You never have to pick. Aura reads what you bring and sends it to the guardian who can hold it. Tap anyone to meet them, then talk to them. Type or speak.</p></div>';
  h+='<button class="card link lead" data-guardian="aura">'+glyph("aura")+'<span><div class="label">Keeper of the Archive</div><h3 style="margin-top:2px">Aura</h3><p class="small muted" style="margin-top:4px">'+esc(G.aura.domain)+'</p></span></button>';
  {const gs=guardianSeasons();if(gs)h+='<div class="card">'+auraSays(esc(gs.join(" ")),"Aura · the seasons of your circle")+'</div>';}
  h+='<div class="circle">'+ORDER.map(k=>'<button class="g" data-guardian="'+k+'">'+glyph(k)+'<span class="n">'+esc(G[k].name)+'</span><span class="e job">'+esc(JOB[k].split(".")[0])+'</span></button>').join("")+'</div>';
  h+='<div><div class="label">The wider circle</div><p class="muted" style="margin-top:6px">Nine more voices from the Archives. Talk to any of them any time.</p></div>';
  h+='<div class="circle">'+EXP.map(k=>'<button class="g" data-guardian="'+k+'">'+glyph(k)+'<span class="n">'+esc(G[k].name)+'</span><span class="e job">'+esc(JOB[k].split(".")[0])+'</span></button>').join("")+'</div>';
  h+='<div class="card"><div class="label">Chambers</div><p style="margin-top:6px">Every guardian keeps a deeper chamber of rituals. '+(isMember()?'Yours are all open. Aura draws from them for you.':'They all open with '+esc(PLAN.name)+', from '+PLAN.monthly+' a month.')+'</p>'+(isMember()?'':'<button class="btn btn-ghost" style="margin-top:12px" data-paywall="Every chamber">See membership</button>')+'</div>';
  $("#v-circle").innerHTML=h;
}
function baseOf(k){return R.some(r=>r.g===k)?k:(KIN[k]||k);}
function openGuardian(k){
  setTimeout(()=>{const s=$("#scrim");if(s){s._music=true;}musicFor(k);},0);
  const g=G[k], rs=R.filter(r=>r.g===k&&!r.reset).sort((a,b)=>(a.member?1:0)-(b.member?1:0)), c=CHAMBERS[k], usedN=S.entries.filter(e=>e.guardian===k).length;
  let h='<div class="stack"><div class="lead">'+glyph(k)+'<div><div class="label" style="color:'+g.color+'">'+esc(g.title)+' · '+esc(g.element)+'</div><h2 style="margin:2px 0 0">'+esc(g.name)+'</h2></div></div>'+
   '<p><b>'+esc(g.name)+'\'s job:</b> '+esc(JOB[k]||g.domain)+'</p><p class="small muted">'+esc(g.domain)+' '+esc(g.voice)+(usedN?" You have walked with "+esc(g.name)+" "+usedN+" time"+(usedN>1?"s":"")+".":"")+'</p>'+
   '<div class="chips">'+g.phrases.map(p=>'<span class="tag" style="font-family:var(--f-display);font-style:italic;font-size:15px">'+esc(p)+'</span>').join("")+'</div>'+
   '<button class="btn btn-main full" data-talk="'+k+'">Talk to '+esc(g.name)+'</button>'+(k==="iris"?irisPanelHTML():'');
  if(k==="iris")setTimeout(()=>cycleSync().then(rerenderIris),0);
  if(rs.length)h+='<div class="label">'+esc(g.name)+'\'s rituals</div>'+rs.map(r=>ritualCard(r)).join("");
  if(c)h+='<div class="card"><div class="row between"><h3>'+esc(c.name)+'</h3>'+(isMember()?'':'<span class="badge">Members</span>')+'</div><p class="small muted" style="margin-top:6px">'+esc(c.d)+'</p><button class="btn btn-ghost full" style="margin-top:12px" data-chamber="'+k+'">Open the chamber</button></div>';
  openSheet(h+'</div>');
}
function openChamber(k){
  const c=CHAMBERS[k], rs=R.filter(r=>r.g===k&&r.member);
  openSheet('<div class="stack"><div class="lead">'+glyph(k)+'<div><div class="label">'+esc(G[k].name)+'\'s chamber</div><h2 style="margin:2px 0 0">'+esc(c.name)+'</h2></div></div><p>'+esc(c.d)+'</p><p class="small muted">'+(isMember()?'Open. Aura also draws from this chamber when what you bring calls for '+esc(G[k].name)+'.':'Included with '+esc(PLAN.name)+'. Once you join, Aura starts pulling from it for you.')+'</p>'+
   rs.map(r=>ritualCard(r)).join("")+(isMember()?'':'<button class="btn btn-main full" data-paywall="'+esc(c.name)+'">Join '+esc(PLAN.name)+'</button>')+'</div>');
}
function openJourney(id){
  const j=JOURNEYS.find(x=>x.id===id); if(!j)return;
  const done=journeyDays(id), next=[1,2,3,4,5,6,7].find(n=>!done.includes(n));
  let h='<div class="stack"><div class="lead">'+glyph(j.g)+'<div><div class="label">7 days with '+esc(G[j.g].name)+'</div><h2 style="margin:2px 0 0">'+esc(j.name)+'</h2></div></div><p>'+esc(j.d)+'</p><div class="days">';
  let note="";
  j.days.forEach((d,i)=>{const n=i+1,isDone=done.includes(n),isNext=next===n,locked=!isMember()||(!isDone&&!isNext);let r=byId[d[0]];if(isNext&&isMember()){const a=journeyStep(j,n);r=a.r;note=a.note;window.__jsettle=!!a.settle;}
    h+='<button class="day'+(isDone?" done":"")+(isNext&&isMember()?" next":"")+'" '+(isMember()&&!locked?'data-jday="'+id+':'+n+'"':'')+(locked?" disabled":"")+'><span class="num">'+(isDone?"✓":n)+'</span><span><div class="t">'+esc(r.title)+'</div><div class="s">'+esc(d[1])+'</div></span><span class="st">'+(isDone?"Done":isNext&&isMember()?"Tonight":r.min+" min")+'</span></button>';});
  h+='</div>'+(note&&isMember()?'<p class="why">'+esc(note)+(window.__jsettle?' <button class="linkish" data-begin="two-minute-settle">Settle first</button>':'')+'</p>':'')+(isMember()?(next?'':'<p class="muted">Journey complete. You can start any day again from its guardian.</p>'):'<button class="btn btn-main full" data-paywall="'+esc(j.name)+'">Start with '+esc(PLAN.name)+'</button>')+'</div>';
  openSheet(h);
}

