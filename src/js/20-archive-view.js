/* ------------------------------------------------------------------
   ARCHIVE
------------------------------------------------------------------ */
let q="";
function renderArchive(){
  const es=S.entries, n=es.length;
  const themes=recentThemes(30), topT=Object.entries(themes).sort((a,b)=>b[1]-a[1]);
  const gc={};for(const e of es)gc[e.guardian]=(gc[e.guardian]||0)+1;
  const topG=Object.entries(gc).sort((a,b)=>b[1]-a[1])[0];
  let h='<div><div class="label">Your archive</div><h2>Memory, not storage.</h2><p class="muted" style="margin-top:6px">Everything you write here becomes context. Aura reads it so you never have to start from zero.</p><p class="small muted" style="margin-top:8px">'+(synced()?"Saved to your account, private to you.":"Saved on this device."+(accountsOn()?' <button class="linkish" id="siOpen">Sign in</button> to keep it everywhere.':""))+'</p></div>';
  if(!n){
    h+=spacesHTML()+ownHTML(true);
    h+='<div class="empty"><h3>Nothing archived yet.</h3><p class="muted">Finish any ritual and write a few lines after. It lands here, and Aura starts noticing your patterns.</p><button class="btn btn-main" style="margin-top:14px" data-tab-go="today">Start with today</button></div>';
    $("#v-archive").innerHTML=h;return;
  }
  h+='<div class="card"><div class="label">Ask your Archive</div><div class="composer" style="margin-top:8px"><label class="sr" for="archAsk">Ask your Archive</label><textarea id="archAsk" style="min-height:56px" placeholder="When did this first come up?"></textarea>'+micBtn("archAsk")+'</div><button class="btn btn-ghost full" style="margin-top:8px" id="archAskBtn">Ask</button><div id="archAnswer"></div></div>';
  const mem=resurface();
  if(mem){h+='<div class="card memory"><div class="label">What Aura brought back</div><p class="small muted" style="margin-top:6px">On '+fmtDate(mem.ts)+''+(mem.moon?', during the '+esc(mem.moon):'')+', after '+esc(mem.ritualTitle)+', you wrote:</p><blockquote>"'+esc((mem.text||"").slice(0,220))+((mem.text||"").length>220?"...":"")+'"</blockquote><button class="btn btn-ghost" style="margin-top:12px" data-entry="'+esc(mem.id)+'">Open the entry</button></div>';}
  const th=threadsOf();
  if(q&&th.some(x=>x[0]===q))h+=beforeAfterHTML(q);
  if(th.length){const tis=th.slice(0,8).map(([k])=>threadInfo(k)).filter(Boolean).sort((a,b)=>b.last-a.last);
    h+='<div class="card"><div class="label">What you\'ve been living through</div><p class="small muted" style="margin-top:4px">Aura keeps the thread, so you don\'t have to.</p>'+tis.map(x=>'<button class="threadrow" data-thread="'+esc(x.name)+'" aria-pressed="'+(q===x.name)+'"><b>'+esc(x.name)+'</b><span>'+(x.days>1?x.days+" days":"today")+' · '+x.talks+(x.talks===1?" conversation":" conversations")+' · '+esc(x.status)+'</span></button>').join("")+'</div>';
    }
  h+='<details class="more"><summary>See everything</summary>';
  {const nt=noticings();if(nt.length)h+='<div class="card"><div class="label">What Aura has noticed</div><p class="small muted" style="margin-top:4px">Observations, not conclusions. You know your life best.</p>'+nt.map(n=>'<p style="margin-top:8px">'+esc(n)+'</p>').join("")+'</div>';}
  h+=lettersArchiveHTML()+altarHTML();
  h+='<div class="stats"><div class="stat"><div class="v">'+n+'</div><div class="k">Rituals</div></div><div class="stat"><div class="v">'+resetDone().length+'/7</div><div class="k">Reset</div></div><div class="stat"><div class="v">'+(topG?esc(G[topG[0]].name):"")+'</div><div class="k">Most with</div></div></div>';
  if(topT.length){
    const [t,c]=topT[0];
    h+='<div class="card"><div class="label">Aura notices</div><p style="margin-top:6px">'+(c>=3?"You have come back to <b>"+esc(t)+"</b> "+c+" times this month. That's not a coincidence, it's a thread worth pulling.":"This month you've worked mostly with <b>"+esc(t)+"</b>.")+'</p><div class="chips" style="margin-top:10px">'+topT.slice(0,6).map(([k,v])=>'<span class="tag">'+esc(k)+' · '+v+'</span>').join("")+'</div></div>';
  }
  const op=S.promises.slice(0,8);
  if(op.length)h+='<div class="card"><div class="label">Promises to myself</div>'+op.map(pr=>'<div class="li"><span>'+esc(pr.text)+'<br><span class="small muted">'+fmtDate(pr.ts)+' · '+(pr.status==="done"?"Done":pr.status==="let"?"Let go":"Open")+'</span></span>'+(pr.status==="open"?'<span class="row"><button class="chip" data-cal="'+pr.id+'" aria-label="Add to calendar">📅</button><button class="chip" data-promise="'+pr.id+':done">Done</button></span>':'')+'</div>').join("")+'</div>';
  h+=goToHTML()+myRitualsHTML()+spacesHTML();
  h+='<div class="card"><div class="label">Your Alchemy record</div><p class="small muted" style="margin-top:4px">A private, written look back. Not a stats recap.</p><div class="row" style="margin-top:10px"><button class="chip" data-yearbook="month">This month</button><button class="chip" data-yearbook="season">This season</button><button class="chip" data-yearbook="year">This year</button></div></div>';
  h+='<button class="card link" id="memOpen"><div class="label">What Aura remembers</div><p class="small muted" style="margin-top:4px">'+(memOn()?"See it, add to it, or make her forget a thread.":"Memory is off. Tap to change.")+'</p></button>';
  h+=ledgerHTML();
  h+='<label class="sr" for="archSearch">Search your archive</label><input class="search" id="archSearch" type="search" placeholder="Search what you wrote" value="'+esc(q)+'"><div class="entries" id="entryList">'+entryList()+'</div>';
  h+=ownHTML();
  h+='</details>';
  $("#v-archive").innerHTML=h;
}
function ledgerHTML(){
  const L=ledger(), rows=LEDGER_KEYS.filter(([k])=>(L[k]||[]).length);
  if(!rows.length)return '';
  return '<div class="card"><div class="label">What Aura carries for you</div><p class="small muted" style="margin-top:4px">Aura\'s long-term memory, so you never explain it twice. Tap × to make her forget something.</p>'+rows.map(([k,l])=>'<div class="ledg"><div class="lk">'+esc(l)+'</div>'+L[k].map((it,i)=>ledgerItemHTML(k,i,it)).join("")+'</div>').join("")+'</div>';
}
function ownHTML(empty){
  return '<div class="card own"><div class="label">Your data is yours</div><p class="small muted" style="margin-top:4px">Download everything you\'ve written. Clear it and start fresh while keeping your account, or delete your account entirely.</p><div class="row" style="margin-top:10px;flex-wrap:wrap">'+(empty?'':'<button class="btn btn-ghost" id="exportBtn">Export my Archive</button>')+'<button class="btn btn-ghost" id="clearBtn">Clear my data</button><button class="btn btn-ghost danger" id="deleteBtn">Delete my account</button></div></div>';
}
function entryList(){
  const t=q.trim().toLowerCase();
  const list=S.entries.filter(e=>!t||[e.text,e.carrying,e.ritualTitle,e.theme,e.thread,G[e.guardian]&&G[e.guardian].name].join(" ").toLowerCase().includes(t));
  if(!list.length)return '<p class="muted">Nothing matches "'+esc(q)+'".</p>';
  return list.map(e=>'<button class="entry" data-entry="'+esc(e.id)+'">'+glyph(e.guardian)+'<span><div class="t">'+(e.private?'🔒 ':'')+esc(e.ritualTitle)+'</div><div class="m">'+fmtDate(e.ts)+' · '+esc(e.moon||"")+' · '+esc((G[e.guardian]||G.aura).name)+(e.after?' · felt '+esc(e.after.toLowerCase()):"")+'</div>'+(e.text?'<div class="x">'+esc(e.text)+'</div>':"")+'</span></button>').join("");
}
function openEntry(id){
  const e=S.entries.find(x=>x.id===id); if(!e)return;
  openSheet('<div class="stack"><div class="lead">'+glyph(e.guardian)+'<div><div class="label">'+fmtDate(e.ts)+' · '+esc(e.moon||"")+'</div><h2 style="margin:2px 0 0">'+esc(e.ritualTitle)+'</h2></div></div>'+
   (e.carrying?'<p class="why">You came in carrying: <b>'+esc(e.carrying)+'</b></p>':"")+
   (e.prompts&&e.prompts.length?'<p class="small muted">'+e.prompts.map(esc).join(" ")+'</p>':"")+
   '<p style="white-space:pre-wrap;font-size:18px">'+esc(e.text||"(No words this time. Showing up counts.)")+'</p>'+
   (e.after?'<span class="tag">Afterward: '+esc(e.after)+'</span>':"")+
   (e.outside?'<p class="why">What changes outside: <b>'+esc(e.outside)+'</b></p>':"")+
   '<label class="switch" for="entPriv">For my eyes only. Aura won\'t use this.<input type="checkbox" id="entPriv" data-entpriv="'+esc(e.id)+'"'+(e.private?" checked":"")+'></label>'+
   '<button class="btn btn-ghost full" data-laterentry="'+esc(e.id)+'">Bring this back to me later</button>'+
   (byId[e.ritualId]?'<button class="btn btn-ghost full" data-begin="'+esc(e.ritualId)+'">Walk this ritual again</button>':"")+'</div>');
}

