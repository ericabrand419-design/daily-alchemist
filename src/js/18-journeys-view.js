/* ------------------------------------------------------------------
   JOURNEYS
------------------------------------------------------------------ */
function resetDone(){return resetProgress().done;}
function resetNext(){
  const rp=resetProgress(), done=rp.done, next=RESET.find(r=>!done.includes(r.reset));if(!next)return null;
  const lastReset=S.entries.filter(e=>e.resetDay).sort((a,b)=>b.ts-a.ts)[0];
  const a=done.length?adaptAll(lastReset&&lastReset.after,next,lastReset?Math.max(0,daysSince(lastReset.ts)-1):0,next.reset):{r:next,note:""};
  return {base:next,...a,started:done.length>0};
}
function moonTrailMark(d,on){
  const m=moon(d),r=8,k=Math.cos(2*Math.PI*m.f),rx=Math.max(.35,Math.abs(k)*r),outer=m.waxing?1:0,inner=m.waxing?(k>0?0:1):(k>0?1:0);
  const p="M8,0 A"+r+","+r+" 0 0,"+outer+" 8,16 A"+rx+","+r+" 0 0,"+inner+" 8,0 Z";
  return '<span class="moonday'+(on?' on':'')+'" title="'+esc(d.toDateString()+" · "+m.name)+'"><svg viewBox="-1 -1 18 18" aria-hidden="true"><circle cx="8" cy="8" r="8" fill="currentColor" opacity=".14"/><path d="'+p+'" fill="currentColor"/></svg></span>';
}
function addUpHTML(){
  const es=S.entries.filter(e=>e.ritualId||e.ritualTitle);
  const mins=es.reduce((a,e)=>a+((byId[e.ritualId]&&byId[e.ritualId].min)||e.min||5),0);
  const shown=new Set(es.map(e=>dayKey(new Date(e.ts))));for(const k of Object.keys(S.days||{}))if(Object.keys(S.days[k]).length)shown.add(k);
  const now=new Date(),tm=es.filter(e=>{const d=new Date(e.ts);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();}).length;
  const lmD=new Date(now.getFullYear(),now.getMonth()-1,1),lm=es.filter(e=>{const d=new Date(e.ts);return d.getMonth()===lmD.getMonth()&&d.getFullYear()===lmD.getFullYear();}).length;
  let moons="";for(let i=28;i>=0;i--){const d=new Date(now.getTime()-i*864e5);moons+=moonTrailMark(d,shown.has(dayKey(d)));}
  const ins=rhythmInsight();
  return '<div class="card addup"><div class="label">Adding up</div>'+auraSays("Small rituals, kept daily, become who you are.","Aura")+
    '<div class="addnums"><div><b>'+es.length+'</b><span>rituals</span></div><div><b>'+(mins>=120?Math.round(mins/60)+" hr":mins+" min")+'</b><span>given to yourself</span></div><div><b>'+shown.size+'</b><span>days you showed up</span></div></div>'+
    '<div class="moontrail" aria-label="The last lunar cycle">'+moons+'</div><p class="small muted" style="margin-top:6px">The last lunar cycle. A gold ring marks every day you showed up. Nothing resets.</p>'+
    (es.length?'<p class="small" style="margin-top:8px">This month: '+tm+(tm===1?" ritual":" rituals")+'. Last month: '+lm+'.</p>':'')+(ins?'<p class="why" style="margin-top:10px">'+esc(ins)+'</p>':'')+'</div>';
}
function renderJourneys(){
  const rp=resetProgress(), done=rp.done, next=RESET.find(r=>!done.includes(r.reset));
  const rn=resetNext(), nudge=rn&&rn.started?rn.note:"";
  let h=addUpHTML()+'<div><div class="row between"><span class="label">Free with the app</span>'+(rp.rounds?'<span class="small muted">Round '+(rp.rounds+1)+'</span>':'')+'</div><h2>The 7-Day Energy Reset</h2><p class="muted" style="margin-top:6px">Seven sessions, seven voices of the circle. Go at your own rhythm. Nothing expires, and you can start a new round whenever you finish.</p>'+(nudge?'<p class="why" style="margin-top:10px">'+esc(nudge)+'</p>':'')+(rp.rounds&&!done.length?'<p class="why" style="margin-top:10px">You finished '+(rp.rounds===1?"a round":rp.rounds+" rounds")+'. Start again whenever you\'re ready.</p>':'')+'</div>';
  h+='<div class="progress"><i style="width:'+(done.length/7*100)+'%"></i></div><div class="days">';
  for(const r of RESET){
    const isDone=done.includes(r.reset), isNext=next&&next.reset===r.reset, locked=!isDone&&!isNext;
    h+='<button class="day'+(isDone?" done":"")+(isNext?" next":"")+'" data-reset="'+r.id+'"'+(locked?" disabled":"")+'><span class="num">'+(isDone?"✓":r.reset)+'</span><span><div class="t">'+esc(r.title)+'</div><div class="s">'+esc(G[r.g].name)+' · '+esc(r.el)+' · '+r.min+' min</div></span><span class="st">'+(isDone?"Done":isNext?"Next":"Day "+r.reset)+'</span></button>';
  }
  h+='</div>';
  h+='<div><div class="row between"><span class="label">Guided journeys</span>'+(isMember()?'':'<span class="badge">'+esc(PLAN.name)+'</span>')+'</div><h2 style="margin-top:4px">When one night isn\'t enough</h2><p class="muted" style="margin-top:6px">Seven days each, one ritual a night, in the voice of the guardian who leads it.</p></div><div class="entries">';
  for(const j of JOURNEYS){const dn=journeyDays(j.id).length;h+='<div class="card journeycard"><div class="row journeyrow">'+guardianMark(j.g,42)+'<button class="journeyopen" data-journey="'+j.id+'"><h3>'+(isMember()?'':'🔒 ')+esc(j.name)+'</h3><p class="small muted">With '+esc(G[j.g].name)+' · 7 days'+(dn?' · '+dn+' done':'')+'</p></button></div><button class="journeybody" data-journey="'+j.id+'"><span>'+esc(j.d)+'</span>'+(dn?'<span class="progress" style="margin-top:10px"><i style="width:'+(dn/7*100)+'%"></i></span>':'')+'</button></div>';}
  h+='</div>';
  $("#v-journeys").innerHTML=h;
}

