/* ------------------------------------------------------------------
   DAILY CONTEXT AND PRIORITY ENGINE. This is infrastructure, not a
   feature: every time-sensitive surface (Today, the Daily Alchemy
   strip, guardian check-ins, rhythm cards, Aura's prompts, guardian
   chats, push reminders on the server) asks resolveCurrentFocus()
   first, then decides what to show.

   THE HARD RULE
   Rhythm is responsive, not scheduled. The Daily Alchemist knows what
   part of the day it is, but it never lets the clock, moon, season or
   cycle override the person's actual life. Unresolved events, emotional
   state, promises, body context and recent conversations take priority.
   The rhythm adapts around the person rather than asking the person to
   adapt to it.

   Priority, everywhere, all day:
   1 safety  2 an unresolved situation she shared  3 a follow up or promise
   4 body and cycle  5 her patterns  6 the time of day rhythm
   7 moon, season, weekday, plant ally  8 generic
------------------------------------------------------------------ */
const HARD_RULE="Rhythm is responsive, not scheduled. The Daily Alchemist knows what part of the day it is, but it never lets the clock, moon, season or cycle override the person's actual life. Unresolved events, emotional state, promises, body context and recent conversations take priority. The rhythm adapts around the person rather than asking the person to adapt to it.";
const PRIORITY_TEXT="PRIORITY ORDER, ALL DAY: 1 safety or an urgent real world concern. 2 an active unresolved situation she already shared. 3 a follow up, promise or outcome Aura said she would remember. 4 significant body or cycle context. 5 her personal patterns and recent Archive history. 6 the normal time of day rhythm. 7 moon, season, weekday, plant ally and other natural correspondences. 8 generic suggestions.";
/* Guardians steward the ordinary day. Aura interrupts any of them when life matters more. */
const STEWARD={dawn:"aurora",morning:"aurora",afternoon:"sol",transition:"juniper",evening:"fern",deepnight:"fern"};
const HEAVY_RE=/humiliat|embarrass|\bboss\b|manager|cowork|co-work|fired|laid off|\bfight|argu|yell|scream|cried|crying|\btears\b|scared|afraid|anxious|panic|angry|furious|\brage\b|pissed|\bhurt|betray|cheat|\blied\b|lying|ashamed|shame|guilt|disrespect|unfair|overwhelm|stress|broke up|breakup|break up|divorce|died|funeral|hospital|diagnos|\bsick\b|lost my|grief|lonely|ignored|blew up|snapped|walked all over|threw me under|blindsided/i;
function isHeavy(a){return HEAVY_RE.test(a.text||"")||["fire","shadow","grief","boundaries","protection","courage"].includes(a.theme)||!!(a.follow&&a.follow.still);}
function nextBoundary(now){const d=new Date(now||Date.now()),h=d.getHours(),stops=[5,8,12,17,20,23,29];const n=stops.find(x=>x>h);const t=new Date(d);t.setHours(n,0,0,0);return t.getTime();}
const SIT_WORDS=[[/\b(boss|manager|work|job|cowork\w*|co-work\w*|office|meeting|client|shift|team lead)\b/i,"what happened at work"],[/\b(husband|wife|partner|boyfriend|girlfriend|fianc\w*)\b/i,"what happened with your partner"],[/\b(mom|mother|dad|father|sister|brother|family|parents?|in-?laws?)\b/i,"what's going on with your family"],[/\b(ex)\b/i,"what happened with your ex"],[/\b(friend|bestie)\b/i,"what happened with your friend"],[/\b(kid|kids|son|daughter|child)\b/i,"what's going on with your kid"],[/\b(died|funeral|passed away|lost my)\b/i,"your loss"],[/\b(money|rent|bills|debt|paycheck)\b/i,"the money stress"]];
function situationPhrase(a){const t=(a.text||"")+" "+(a.thread||"");for(const [re,p] of SIT_WORDS)if(re.test(t))return p;return a.thread?"what you told me about "+a.thread.toLowerCase():"what you told me earlier";}
function ownerFor(a){
  const g0=RENAMED[a.guardian]||a.guardian;if(g0&&g0!=="aura"&&G[g0]&&allowedG(g0))return g0;
  const t=a.text||"";
  if(/humiliat|disrespect|walk(ed|ing)? (all )?over|boundar|said yes|people pleas|\bboss\b|cowork/i.test(t))return "thistle";
  if(/angry|furious|rage|pissed|betray/i.test(t))return "sage";
  if(/died|funeral|grief|passed away|lost my/i.test(t))return "willow";
  if(/anxious|panic|overthink|spiral|racing/i.test(t))return "lily";
  if(/ashamed|guilt|i (did|said) something|my fault/i.test(t))return "onyx";
  if(/exhaust|drain|burn(ed)? out|overwhelm/i.test(t))return "fern";
  return "aura";
}
function whenTold(ts,now){
  const d=new Date(ts),n=now||new Date();
  if(dayKey(d)===dayKey(n)){const h=d.getHours();return n-d<90*60e3?"a little while ago":h<12?"this morning":h<17?"this afternoon at "+d.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"}):"earlier this evening";}
  if(n-d<36*36e5)return d.getHours()>=17?"last night":"yesterday";
  return "on "+d.toLocaleDateString(undefined,{weekday:"long"});
}

/* 1. Safety: anything in the last day that sounded like danger, until she says she's safe. */
function safetyHit(now){
  const t=(now||new Date()).getTime(),ack=S.safeAck||0;
  const a=(S.asks||[]).find(x=>x.text&&x.ts>ack&&t-x.ts<24*36e5&&safetyKind(x.text));if(a)return {ts:a.ts,kind:safetyKind(a.text)};
  for(const l of Object.values(S.chats||{}))for(const m of (l||[]))if(m.role==="me"&&m.ts>ack&&t-m.ts<24*36e5&&safetyKind(m.text))return {ts:m.ts,kind:safetyKind(m.text)};
  return null;
}
/* 2. The thing she told Aura that isn't settled yet. */
function activeSituation(now){
  if(!memOn())return null;
  const n=now||new Date(),t=n.getTime();
  const open=a=>!a.noMem&&a.text&&!a.settled&&!a.fuDismiss&&!(a.sitSnooze&&a.sitSnooze>t)&&!["answer","build","simplify"].includes(a.action)&&(!a.follow||a.follow.still)&&!(a.thread&&(S.forgotThreads||[]).includes(a.thread));
  let a=(S.asks||[]).filter(x=>t-x.ts>=0&&t-x.ts<36*36e5&&open(x)&&isHeavy(x)).sort((x,y)=>y.ts-x.ts)[0];
  if(!a){const th=threadsOf().map(x=>threadInfo(x[0])).filter(x=>x&&x.status==="unresolved"&&t-x.last<4*864e5&&x.lastAsk&&open(x.lastAsk))[0];if(th)a=th.lastAsk;}
  if(!a)return null;
  return {ask:a,phrase:situationPhrase(a),owner:ownerFor(a),when:whenTold(a.ts,n),hours:(t-a.ts)/36e5,still:!!(a.follow&&a.follow.still),tomorrow:a.tomorrow||""};
}
/* 4. Body: how she slept and what's in the tank, plus Iris if she shares it. */
function bodyContext(now){
  const rec=S.days[dayKey(now)]||{},early=["dawn","morning"].includes(daypart(now))&&!(rec.sleep&&rec.energy);
  const low=lowTank()&&!early,cyc=cycleContext(now),lines=[];
  if(cyc&&cyc.startedRecently)lines.push("Your period started"+(cyc.startedToday?" today":"")+".");
  else if(cyc&&cyc.rough)lines.push("You logged a rough body day with Iris.");
  if(low)lines.push("You started today on a low tank.");
  if(cyc&&cyc.pattern)lines.push("Iris has noticed: "+cyc.pattern.charAt(0).toLowerCase()+cyc.pattern.slice(1));
  return {low,cyc,significant:low||!!(cyc&&cyc.heavy),lines};
}
function resolveCurrentFocus(now){
  now=now||new Date();
  const dp=daypart(now),f={dp,steward:STEWARD[dp],level:8,kind:"generic",headline:"",body:bodyContext(now)};
  const sh=safetyHit(now);
  if(sh)return {...f,level:1,kind:"safety",safety:sh,steward:"aura",headline:"Something you told me earlier mattered more than anything else here."};
  const sit=activeSituation(now);
  if(sit)return {...f,level:2,kind:"situation",sit,steward:"aura",owner:sit.owner,headline:"I'm still holding "+sit.phrase+"."};
  if(pendingFollow()||duePromise()||dueLater())return {...f,level:3,kind:"followup",steward:"aura",headline:"Aura has something to check back on."};
  if(f.body.significant){
    const st=dp==="dawn"||dp==="morning"||dp==="afternoon"?(f.body.cyc&&f.body.cyc.heavy?"iris":"fern"):f.steward;
    return {...f,level:4,kind:"body",steward:okG(st)||"fern",usual:f.steward};
  }
  const ins=rhythmInsight();
  if(ins)return {...f,level:5,kind:"pattern",insight:ins};
  return {...f,level:6,kind:"rhythm"};
}

/* What every AI call gets told about right now. Short on purpose. */
function focusText(now){
  now=now||new Date();const f=resolveCurrentFocus(now),dp=f.dp,arc=(S.days[nightKey(now)]||{}).arc||{};
  let d="";
  if(f.level===1)d="SAFETY. Earlier she said something that sounded like she or someone may not be safe. Care first.";
  else if(f.level===2)d="AN UNRESOLVED SITUATION: she told Aura "+f.sit.when+" about "+f.sit.phrase.replace(/^what /,"what ")+(f.sit.still?", and later said it was still bothering her":"")+". It is not settled. The guardian who owns it: "+G[f.sit.owner].name+". This outranks the time of day, the moon and the plant ally.";
  else if(f.level===3)d="A FOLLOW UP IS DUE: Aura promised to check back on something.";
  else if(f.level===4)d="HER BODY IS ASKING FOR LESS TODAY. "+f.body.lines.join(" ")+" Keep things smaller and gentler. "+(f.usual==="aurora"?"Aurora is sitting this morning out.":"");
  else d="Nothing unresolved. The daily rhythm can lead: "+G[f.steward].name+" holds the "+DP_WORD[dp]+".";
  const ans=Object.entries(arc).filter(([,v])=>v).map(([k,v])=>({m:"Morning, what deserves her energy",d:"Midday, what took her energy",e:"Evening, what was worth it"}[k]+": "+v));
  return "RIGHT NOW: "+DP_WORD[dp]+", "+now.toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})+". Today's steward is "+G[STEWARD[dp]].name+". Plant ally: "+plantAlly(now).n+" (symbolic only; never suggest eating or taking herbs).\n"+
    "CURRENT FOCUS, decided by the app's priority engine (follow it): "+d+"\n"+
    (f.level!==4&&f.body.lines.length?"BODY: "+f.body.lines.join(" ")+"\n":"")+
    (cycleAIText(now)?cycleAIText(now)+"\n":"")+wxAIText()+
    (ans.length?"HER DAILY QUESTION TODAY: "+ans.join(". ")+".\n":"")+
    "THE HARD RULE: "+HARD_RULE+"\n"+PRIORITY_TEXT+"\n";
}

/* The one card on Today under the strip: whatever the engine says matters most. */
function focusCardHTML(f){
  if(f.level===1)return safetyCardHTML(f);
  if(f.level===2)return situationCardHTML(f);
  if(f.level===3)return followHTML()||checkinHTML();
  return stewardHTML(f);
}
function speaker(g,t){return '<div class="speaker">'+glyph(g,30)+'<span class="who" style="color:'+(g==="aura"?"var(--gold)":G[g].color)+'">'+esc(G[g].name)+' · '+esc(t)+'</span></div>';}
function safetyCardHTML(f){
  return '<div class="card rhythm focus">'+speaker("aura","checking on you")+'<p style="margin-top:8px">Earlier you told me something that worried me. Before anything else today: are you safe right now?</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-safe="ok">I\'m safe</button><button class="btn btn-ghost" data-safe="'+esc(f.safety.kind)+'">Not really</button></div></div>';
}
function situationCardHTML(f){
  const s=f.sit,a=s.ask,dp=f.dp,o=s.owner,on=G[o].name,late=dp==="deepnight"||new Date().getHours()>=21;
  const body=f.body.significant?(f.body.cyc&&(f.body.cyc.startedRecently||f.body.cyc.rough)?(f.body.cyc.startedRecently?"Your period started"+(f.body.cyc.startedToday?" today":"")+" and your body is running low too. ":"Your body is having a rough day too. ")+"That may be turning the volume up, but what happened is still real. ":"You're running on a low tank today too, so let's keep this small. "):(f.body.cyc&&f.body.cyc.pattern?"Iris has noticed something about this point in your cycle. It may turn the volume up. It doesn't make what happened less real. ":"");
  let line,btns;
  if(late){
    line="It's late and "+s.phrase+" is still open. Tonight is only for settling your body and your head. Deciding what to do about it belongs to tomorrow, and I'll bring it back in the morning.";
    btns='<button class="btn btn-main" data-sit="'+a.id+':settle">Settle for tonight</button><button class="btn btn-ghost" data-sit="'+a.id+':tomorrow">Bring it back tomorrow</button><button class="btn btn-ghost" data-talk="'+o+'">Talk to '+esc(on)+' now</button>';
  }else{
    line=dp==="transition"?"Tonight was going to be about coming home and clearing the day, but I'm still holding "+s.phrase+". Where are you with it now?":
      dp==="evening"?"The evening was going to be for slowing down, but "+s.phrase+" comes first. Where are you with it now?":
      (dp==="dawn"||dp==="morning")?(s.tomorrow||s.hours>8?"Before the day starts: last time we left "+s.phrase+" for today. What do you want to do about it?":"Before Aurora takes the morning, I'm still holding "+s.phrase+". Is it still with you?"):
      "You told me about "+s.phrase.replace(/^what /,"what ")+" "+s.when+". I haven't forgotten. Where are you with it now?";
    btns='<button class="btn btn-main" data-talk="'+o+'">Work it through with '+esc(on)+'</button>'+((dp==="dawn"||dp==="morning")&&o!=="sol"&&okG("sol")==="sol"?'<button class="btn btn-ghost" data-talk="sol">Make a plan with Sol</button>':'')+'<button class="btn btn-ghost" data-sit="'+a.id+':tell">Something changed</button><button class="btn btn-ghost" data-sit="'+a.id+':settled">It\'s settled</button>';
  }
  return '<div class="card rhythm focus" data-focus="situation">'+speaker("aura",late?"tonight and tomorrow":"still holding this")+'<p style="margin-top:8px">'+esc(line)+'</p>'+(body?'<p class="small" style="margin-top:8px">'+esc(body)+'</p>':'')+
    '<div class="row" style="margin-top:10px;flex-wrap:wrap;gap:8px">'+btns+'</div><button class="linkish small" data-sit="'+a.id+':snooze" style="margin-top:8px">Not right now</button></div>';
}

/* Ordinary days: the relay. Aurora, then Sol (Rowan underneath when the body needs it), Juniper, Fern. */
const ARC_Q={m:"What deserves your energy today?",d:"What actually took your energy?",e:"What was worth it?"};
function arcKey(dp){return dp==="dawn"||dp==="morning"?"m":dp==="afternoon"?"d":"e";}
function arcHTML(dp){
  const k=arcKey(dp),rec=dayRec(nightKey()),arc=rec.arc||{},q=ARC_Q[k];
  const prev=k==="d"&&arc.m?"This morning you said: "+arc.m:k==="e"&&(arc.d||arc.m)?(arc.d?"Earlier, what took your energy: "+arc.d:"This morning you said: "+arc.m):"";
  if(arc[k])return '<div class="arcq done"><span class="label">'+esc(q)+'</span><p>'+esc(arc[k])+'</p></div>';
  return '<div class="arcq">'+(prev?'<p class="small muted">'+esc(prev)+'</p>':'')+'<label for="arcIn" class="q2">'+esc(q)+'</label><div class="row" style="margin-top:6px;flex-wrap:nowrap"><input type="text" id="arcIn" maxlength="140" placeholder="A few words is plenty" style="flex:1;min-width:0"><button class="chip" data-arc="'+k+'">Keep</button></div></div>';
}
function dayRitualHTML(){const dr=dayRitual();if(!dr)return "";return '<div class="dayrit"><span class="label">Today\'s ritual</span><p style="margin-top:4px"><b>'+esc(dr.r.title)+'</b> with '+esc(G[dr.r.g].name)+' · '+dr.r.min+' min</p><p class="small muted">'+esc(dr.why)+'</p><div class="row" style="margin-top:8px"><button class="btn btn-ghost sm" data-begin="'+esc(dr.r.id)+'">Begin</button><button class="btn btn-ghost sm" data-peek="'+esc(dr.r.id)+'">See it first</button></div></div>';}
function stewardHTML(f){
  const dp=f.dp,d=dayRec(),ins=f.insight||"",cyc=f.body.cyc;
  const why=ins?'<p class="why" style="margin-top:10px">'+esc(ins)+'</p>':'';
  if(f.level===4&&(dp==="dawn"||dp==="morning"||dp==="afternoon")){
    const st=f.steward,usual=G[f.usual].name;
    const line=cyc&&cyc.heavy?(f.usual==="aurora"?"Aurora is sitting this morning out. Iris and Fern are keeping things lighter.":usual+" is easing off. Iris and Fern are keeping the rest of the day lighter.")+(cyc.pattern?" "+cyc.pattern+" So today starts smaller.":""):
      (f.usual==="aurora"?"Low tank today. Aurora is letting Fern take the morning, so everything starts smaller, and nothing you skip counts against you.":"Your body's asking for less today. Sol is easing off: pick one thing for the afternoon and let the rest wait.");
    return '<div class="card rhythm">'+speaker(st,"keeping it light")+'<p style="margin-top:8px">'+esc(line)+'</p><div class="row" style="margin-top:10px;flex-wrap:wrap;gap:8px"><button class="btn btn-ghost" data-begin="two-minute-settle">Two minutes, that\'s all</button>'+(cyc?'<button class="btn btn-ghost" data-guardian="iris">Open Iris</button>':'<button class="btn btn-ghost" data-talk="fern">Talk to Fern</button>')+'</div></div>';
  }
  if(dp==="dawn"||dp==="morning"){
    if(!(d.sleep&&d.energy))return '<div class="card rhythm">'+speaker("aurora","first light")+'<p class="q2" style="margin-top:8px">How did you sleep?</p>'+chipsQ("sleep",SLEEPQ,d.sleep)+'<p class="q2" style="margin-top:12px">What\'s in the tank?</p>'+chipsQ("energy",ENERGYQ,d.energy)+WATCH_NOTE+'</div>';
    const w=wxNow(),sun=w&&w.kind==="clear"&&w.isDay&&grayStreak()>=2?"First real sun in "+(grayStreak()>=4?"days":grayStreak()+" days")+". Get it on your face before your phone. ":w&&["rain","storm"].includes(w.kind)?"It's wet out there, so we start inside today. ":"";
    return '<div class="card rhythm">'+speaker("aurora","this morning")+'<p style="margin-top:8px">'+esc(sun)+'You\'ve got something to work with today. Let\'s spend it on purpose.</p>'+why+arcHTML(dp)+dayRitualHTML()+'</div>';
  }
  if(dp==="afternoon"){
    const rowan=d.moved==null?'<div class="subrow">'+glyph("rowan",24)+'<div><p class="small"><b style="color:'+G.rowan.color+'">Rowan:</b> did you move your body today?</p>'+chipsQ("moved",MOVEDQ,null)+'</div></div>':
      d.moved===0?'<div class="subrow">'+glyph("rowan",24)+'<div><p class="small"><b style="color:'+G.rowan.color+'">Rowan:</b> no judgment. Want the smallest version?</p><div class="row" style="margin-top:6px"><button class="btn btn-ghost sm" data-begin="'+(lowTank()?"one-song-dance":"walk-it-off")+'">Move with Rowan</button><button class="chip" data-moved="1">Did a little</button></div></div></div>':'';
    return '<div class="card rhythm">'+speaker("sol","midday")+'<p style="margin-top:8px">Halfway. What actually got done, and what deserves the rest of the day? Real version, not the tidy one.</p>'+why+arcHTML(dp)+rowan+'</div>';
  }
  if(dp==="transition"&&!woundDown(nightKey())){
    const r=byId["threshold-reset"]&&canUse(byId["threshold-reset"])?byId["threshold-reset"]:eveningPick0().r;
    return '<div class="card rhythm">'+speaker("juniper","the threshold")+'<p style="margin-top:8px">The day is turning. Before you walk into the evening, close the door on the day you just had.</p>'+why+'<div class="row" style="margin-top:10px"><button class="btn btn-main" data-begin="'+esc(r.id)+'">'+esc(r.title)+' · '+r.min+' min</button><button class="btn btn-ghost" data-wind="1">Already home</button></div>'+arcHTML(dp)+'</div>';
  }
  return eveningHTML(f);
}
/* Evening and night belong to Fern. Personal continuity still comes first. */
function eveningHTML(f){
  const nk=nightKey(),ins=f.insight||"";
  if(woundDown(nk))return '<div class="card rhythm">'+speaker("fern","tonight")+'<p style="margin-top:8px">You wound down. The day is done asking things of you. Sleep well.</p>'+arcHTML(f.dp)+'</div>';
  const pk=personalPick(eveningPick(ins));
  if(pk.action&&!pk.nothing)return '<div class="card rhythm">'+speaker("aura","tonight")+'<p style="margin-top:8px">'+esc(pk.action.line)+'</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-talk="'+(okG("thistle")&&/bound|work|family|people/i.test(pk.action.thread)?"thistle":"sol")+'">Decide the next step</button><button class="btn btn-ghost" data-wind="1">Just rest tonight</button></div></div>';
  if(pk.nothing)return '<div class="card rhythm">'+speaker("fern","tonight")+'<p style="margin-top:8px;font-family:var(--f-display);font-size:21px">Nothing tonight. Go to bed.</p><p style="margin-top:6px">You\'ve done enough today. I\'m not giving you another ritual. Go sleep. Aura will hold this until tomorrow.</p>'+whyThis(pk.nothingWhy)+'<div class="row" style="margin-top:10px"><button class="btn btn-main" data-wind="1">Goodnight</button></div></div>';
  return '<div class="card rhythm">'+speaker(pk.r.g==="fern"?"fern":pk.r.g,"tonight")+'<p style="margin-top:8px">'+(pk.mine?esc(pk.mine)+' ':'')+'Let\'s close the day. <b>'+esc(pk.r.title)+'</b> · '+pk.r.min+' min</p>'+whyThis(pk.why)+'<div class="row" style="margin-top:10px"><button class="btn btn-main" data-begin="'+esc(pk.r.id)+'">Wind down with '+esc(G[pk.r.g].name)+'</button><button class="btn btn-ghost" data-wind="1">Already did</button></div>'+arcHTML(f.dp)+'</div>';
}

/* The day's ritual: one per day, for the significance of THIS day. */
const SABBAT_G={Imbolc:"juniper",Ostara:"sol",Beltane:"marigold",Litha:"sol",Lammas:"aura",Mabon:"juniper",Samhain:"onora",Yule:"fern"};
const SABBAT_PICK={Samhain:"say-their-names",Ostara:"seed-intention",Yule:"tidewater-rest"};
function daySignificance(d){
  d=d||new Date();
  if(S.profile.bday&&daysUntilMD(S.profile.bday)===0)return {why:"It's your birthday, your own new year.",ids:["birthday-threshold"]};
  const mine=(S.dates||[]).find(x=>x.month===d.getMonth()+1&&x.day===d.getDate());
  if(mine)return /died|passed|memorial|death|loss|funeral|angel/i.test(mine.name)?{why:"Today is "+mine.name+". It's a day to remember them.",ids:["say-their-names","grief-bowl"]}:{why:"Today is "+mine.name+".",g:/anniversar|wedding|date/i.test(mine.name)?"marigold":"lumen"};
  const sb=WHEEL.find(w=>w[0]===d.getMonth()+1&&w[1]===d.getDate());
  if(sb)return {why:"It's "+sb[2]+", the time of "+sb[3]+".",ids:SABBAT_PICK[sb[2]]?[SABBAT_PICK[sb[2]]]:[],g:SABBAT_G[sb[2]]};
  if(M.age>13.77&&M.age<15.77)return {why:"It's the full moon. Everything is lit, and it's the strongest day of the month to let go.",ids:["full-moon-release"]};
  if(M.age<1||M.age>28.53)return {why:"It's the new moon. The sky is dark on purpose, so it's a day for planting, not pushing.",ids:["seed-intention"]};
  const day=DAY_RULE[d.getDay()];
  return {why:"It's "+day[0]+", "+day[1]+"'s day for "+day[2]+", under a "+M.name.toLowerCase()+".",gs:day[3]};
}
/* The day decides what the ritual is FOR; what Aura knows about her decides WHICH one. */
function dayRitual(d){
  d=d||new Date();const sig=daySignificance(d),mins=S.profile.minutes||10,ok=r=>r&&canUse(r)&&!r.reset&&!r.bath,k=nightKey(d);
  // Chosen once for the whole day, then kept.
  if(S.dayRit&&S.dayRit.k===k&&ok(byId[S.dayRit.id]))return {r:byId[S.dayRit.id],why:S.dayRit.why};
    const themes=memOn()?recentThemes(21):{},stirred=new Set(S.entries.filter(e=>e.after==="Stirred up"&&Date.now()-e.ts<45*864e5).map(e=>e.ritualId));
  const mine=memOn()?yourGuardians():[];
  const fit=r=>-wxPenalty(r)+moonFit(r)*2+(DAY_RULE[d.getDay()][3].includes(r.g)?2:0)+outcomeBonus(r.id)*2+(r.min<=mins?1:-2)-(missingFor(r).length?1:0)-(stirred.has(r.id)?6:0)-(doneRecently(r.id,3)?4:0)+((themes[THEME[r.g]]||0)>=2?1.5:0)+(mine.includes(r.g)?1:0);
  const best=pool=>pool.filter(ok).map(r=>[fit(r)+(hash(dayKey(d)+r.id)%100)/1000,r]).sort((a,b)=>b[0]-a[0])[0];
  let pick=null;
  const named=(sig.ids||[]).map(id=>byId[id]).filter(ok);
  if(named.length){const b=best(named);if(b&&b[0]>-3)pick=b[1];else{const gs=named.map(r=>r.g);const b2=best(R.filter(x=>gs.includes(x.g)));if(b2)pick=b2[1];}}
  if(!pick){const gs=sig.g?[sig.g]:sig.gs||[];const b=best(R.filter(x=>gs.includes(x.g)||(mine.slice(0,2).includes(x.g)&&!sig.g)));if(b)pick=b[1];}
  if(!pick){const b=best(R);if(b)pick=b[1];}
  if(!pick)return null;
  const you=[];
  if(memOn()){
    const o=outcomes()[pick.id];if(o&&o.good>=1)you.push("It's helped you before");
    else if(mine.includes(pick.g))you.push(G[pick.g].name+" has been with you a lot lately");
    else if((themes[THEME[pick.g]]||0)>=2)you.push("you've been bringing "+THEME[pick.g]+" here lately");
  }
  if(pick.min<=mins)you.push("it fits the "+mins+" minutes you usually have");
  if(!missingFor(pick).length&&(pick.needs||[]).length)you.push("you have what it needs");
  const out={r:pick,why:sig.why+(you.length?" "+you.join(", ").replace(/^./,c=>c.toUpperCase())+".":"")};
  S.dayRit={k,id:pick.id,why:out.why};saveLocal();return out;
}

/* Since you were here: only what genuinely changed. Never invented to bring her back. */
function noteVisit(){
  const now=Date.now();if(S.lastVisitAt&&now-S.lastVisitAt<20*60e3){S.lastVisitAt=now;saveLocal();return;}
  S.prevVisit=S.visitSnap||null;S.lastVisitAt=now;
  const cn=cycleShared()?cycleNow():{};
  S.visitSnap={ts:now,dp:daypart(),nk:nightKey(),proms:openPromises().map(p=>p.id),cycLast:cn.last||null,drawn:drawPick()!=null?arcPart(daypart()):null};
  saveLocal();
}
function sinceLines(f){
  const p=S.prevVisit,now=new Date();if(!p||now-p.ts<60*60e3||p.nk!==nightKey())return [];
  const out=[],dp=daypart(now);
  if(p.dp!==dp&&dp!=="morning"&&dp!=="dawn")out.push({afternoon:"The day has moved into the afternoon.",transition:"The day has turned toward evening.",evening:"It's evening now.",deepnight:"It's the deep part of the night now."}[dp]);
  const newP=openPromises().filter(x=>x.ts>p.ts&&!(p.proms||[]).includes(x.id))[0];if(newP)out.push("You said you were going to "+newP.text.replace(/^i('ll| will)?\s*/i,"").replace(/\.$/,"")+".");
  if(f.level!==2){const s=activeSituation(now);if(s&&s.ask.ts<p.ts)out.push("That "+(s.ask.thread?s.ask.thread.toLowerCase()+" ":"")+"thread is still open.");}
  if(cycleShared()){const cn=cycleNow();if(cn.last!=null&&cn.last!==p.cycLast&&cn.startedRecently)out.push("Your period started"+(cn.startedToday?" today":"")+", so Iris has shifted "+(dp==="evening"||dp==="deepnight"||dp==="transition"?"tonight":"today")+" lighter.");}
  if(drawPick()!=null&&p.drawn&&p.drawn!==arcPart(dp))out.push("Your altar card has a different question for you now.");
  return out.slice(0,3);
}
function sinceHTML(f){const l=sinceLines(f);return l.length?'<div class="since"><span class="label">Since you were here</span>'+l.map(x=>'<p>'+esc(x)+'</p>').join("")+'</div>':"";}

/* Clicks for everything above. */
function focusClick(t,d){
  if(t.id==="alchOpen"){openAlchemy();return true;}
  if(d.wxmode){S.profile.weather=d.wxmode;persist("profile");t.parentElement.querySelectorAll("[data-wxmode]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));if(d.wxmode==="off"){S.wx=null;saveLocal();wxApply();toast("Weather is off.");}else{wxRefresh(true);toast(d.wxmode==="precise"?"Your phone may ask to share your location once.":"Using your rough location.");}return true;}
  if(d.safe){if(d.safe==="ok"){S.safeAck=Date.now();persistAll();toast("I'm glad. I'm here if that changes.");renderAll();}else openSafety(d.safe);return true;}
  if(d.arc){const v=(($("#arcIn")||{}).value||"").trim();if(!v){$("#arcIn")&&$("#arcIn").focus();return true;}const rec=dayRec(nightKey());rec.arc={...(rec.arc||{}),[d.arc]:clean(v).slice(0,140)};persistAll();toast("Kept.");renderToday();return true;}
  if(d.sit){
    const [id,act]=d.sit.split(":"),a=(S.asks||[]).find(x=>x.id===id);if(!a)return true;
    if(act==="settled"){a.settled=Date.now();(S.later||[]).forEach(l=>{if(l.ref===a.id)l.done=true;});a.follow={did:true,helped:"I feel better",changed:"",carry:false,ts:Date.now()};if(memOn())updateLedger("She said "+(a.thread||"the situation")+" is settled now.");persistAll();toast("Good. I'll let it rest.");renderAll();}
    else if(act==="snooze"){a.sitSnooze=nextBoundary();persistAll();renderAll();}
    else if(act==="tomorrow"){const due=new Date();if(due.getHours()>=5)due.setDate(due.getDate()+1);due.setHours(8,0,0,0);a.tomorrow=a.tomorrow||"what you want to do about "+situationPhrase(a);a.sitSnooze=due.getTime()-3*36e5;S.later.push({id:uid(),kind:"ask",ref:a.id,label:"Decide what to do about "+situationPhrase(a),g:ownerFor(a),due:due.getTime(),done:false});persistAll();toast("It's held until morning. Tonight is just for rest.");renderAll();}
    else if(act==="settle"){const pool=R.filter(r=>canUse(r)&&!r.reset&&!r.bath&&r.min<=10&&["fern","lily"].includes(r.g)&&!wroteSteps(r));const r=pickForNow(pool.length?pool:[byId["two-minute-settle"]],new Date(),"settle");a.sitSnooze=nextBoundary();persistAll();startRitual(r,{thread:a.thread||""});}
    else if(act==="tell"){const ta=$("#carry");if(ta){ta.placeholder="What's changed since?";ta.focus();ta.scrollIntoView({block:"center"});}}
    return true;
  }
  return false;
}
setInterval(()=>{const dp=daypart();if(document.documentElement.dataset.daypart&&document.documentElement.dataset.daypart!==dp&&document.visibilityState==="visible"){renderSky();if(curTab==="today"&&!$("#rite")&&!$("#talk"))renderToday();}},60e3);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"){noteVisit();renderSky();}});
