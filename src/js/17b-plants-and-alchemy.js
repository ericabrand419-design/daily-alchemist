/* ------------------------------------------------------------------
   THE NATURAL RHYTHM: daypart, moon, season, weekday, plant ally.
   All of it is plain code. No AI call happens just because the app
   opened. The app interprets the sky so she never has to.
------------------------------------------------------------------ */
function daypart(d){const h=(d||new Date()).getHours();return h<5?"deepnight":h<8?"dawn":h<12?"morning":h<17?"afternoon":h<20?"transition":h<23?"evening":"deepnight";}
const DP_WORD={dawn:"dawn",morning:"morning",afternoon:"afternoon",transition:"early evening",evening:"evening",deepnight:"night"};
/* Which slice of the day a plant, a card or the daily question speaks to. */
function arcPart(dp){return dp==="dawn"||dp==="morning"?"m":dp==="afternoon"?"d":dp==="transition"?"t":"n";}
function moonGroup(){return M.name==="New Moon"?"dark":M.name==="Full Moon"?"full":M.waxing?"build":"release";}
function plainSeason(d){
  d=d||new Date();const y=d.getFullYear(),pts=[[2,20,"Spring"],[5,21,"Summer"],[8,22,"Autumn"],[11,21,"Winter"]];
  const dates=[];for(const yy of [y-1,y,y+1])for(const p of pts)dates.push({d:new Date(yy,p[0],p[1]),n:p[2]});
  let cur=dates[0],next=dates[1];for(let i=0;i<dates.length-1;i++)if(dates[i].d<=d&&dates[i+1].d>d){cur=dates[i];next=dates[i+1];}
  return {name:cur.n,next:next.n,days:Math.ceil((next.d-d)/864e5),nextDate:next.d};
}
const DAY_THEME=["vitality","intuition","courage","clarity","growth","love","boundaries"];

/* Plant allies. Symbolic only: she never needs to buy, eat or take any of them.
   m morning, d midday, t threshold, n night. Each has a short saying and a meaning. */
const PLANTS=[
 {k:"rosemary",n:"Rosemary",moon:["build","release"],days:[3,6],seasons:["Autumn","Winter"],own:["rosemary","driedherbs"],
  say:{m:"Clear before you add.",d:"One thing at a time.",t:"Sweep the day off you.",n:"Close the door on today."},
  mean:{m:"clarity",d:"focus",t:"clearing",n:"protection and closure"}},
 {k:"lavender",n:"Lavender",moon:["release","dark"],days:[1,3],seasons:["Summer","Autumn"],own:["essentialoils","driedherbs"],
  say:{m:"Begin unhurried.",d:"Soften your shoulders.",t:"Let the edges blur.",n:"Rest is allowed."},
  mean:{m:"ease",d:"calm under pressure",t:"letting go",n:"sleep and peace"}},
 {k:"bay",n:"Bay laurel",moon:["build","full"],days:[0,4],seasons:["Summer","Autumn"],own:["driedherbs"],
  say:{m:"Name the win you want.",d:"Keep going. It counts.",t:"Notice what went right.",n:"Write the wish down."},
  mean:{m:"intention",d:"victory",t:"recognition",n:"wishes"}},
 {k:"basil",n:"Basil",moon:["build"],days:[4,5],seasons:["Spring","Summer"],own:[],
  say:{m:"Make room for good things.",d:"Tend what's growing.",t:"Bring the warmth home.",n:"Be gentle with your home."},
  mean:{m:"welcome",d:"steady growth",t:"home",n:"tenderness"}},
 {k:"mint",n:"Mint",moon:["build","full"],days:[3,0],seasons:["Spring","Summer"],own:["tea"],
  say:{m:"Wake up on purpose.",d:"Refresh, then return.",t:"Shake it off.",n:"Cool the mind."},
  mean:{m:"freshness",d:"renewal",t:"shaking off",n:"cooling"}},
 {k:"cinnamon",n:"Cinnamon",moon:["build","full"],days:[0,4],seasons:["Autumn","Winter"],own:[],
  say:{m:"Warm up your will.",d:"Speed up what matters.",t:"Keep the fire low and steady.",n:"Keep what's warm."},
  mean:{m:"warmth",d:"momentum",t:"steadiness",n:"comfort"}},
 {k:"chamomile",n:"Chamomile",moon:["release","dark"],days:[1,0],seasons:["Summer","Autumn"],own:["tea"],
  say:{m:"Go easy on yourself.",d:"Not everything is urgent.",t:"Lower the volume.",n:"You can stop now."},
  mean:{m:"gentleness",d:"patience",t:"settling",n:"ease into sleep"}},
 {k:"rose",n:"Rose",moon:["full","build"],days:[5],seasons:["Spring","Summer"],own:[],
  say:{m:"Lead with your heart.",d:"Be kind and keep your thorns.",t:"Let someone in.",n:"Love yourself back."},
  mean:{m:"open heart",d:"love with boundaries",t:"connection",n:"self love"}},
 {k:"thyme",n:"Thyme",moon:["build"],days:[2],seasons:["Spring","Autumn"],own:["driedherbs"],
  say:{m:"Courage first.",d:"Say the hard thing kindly.",t:"You did braver than you think.",n:"Brave rests too."},
  mean:{m:"courage",d:"honest action",t:"acknowledgment",n:"rest after effort"}},
 {k:"yarrow",n:"Yarrow",moon:["release","full"],days:[2,6],seasons:["Summer","Autumn"],own:[],
  say:{m:"Shield up, heart open.",d:"Not everything is yours to absorb.",t:"Take off what isn't yours.",n:"Your edges are whole."},
  mean:{m:"protection",d:"boundaries",t:"release",n:"wholeness"}},
 {k:"pine",n:"Pine",moon:["dark","release"],days:[6,1],seasons:["Winter","Autumn"],own:[],
  say:{m:"Stand tall in the cold.",d:"Steady, not frantic.",t:"Clear the air.",n:"Evergreen. You keep."},
  mean:{m:"resilience",d:"endurance",t:"cleansing",n:"constancy"}},
 {k:"cedar",n:"Cedar",moon:["release","dark"],days:[6,4],seasons:["Autumn","Winter"],own:["incense","resin"],
  say:{m:"Root before you rise.",d:"Guard your time.",t:"Leave the world at the door.",n:"Sleep held."},
  mean:{m:"grounding",d:"protection of time",t:"threshold",n:"safety"}},
 {k:"apple",n:"Apple",moon:["full","release"],days:[5,1],seasons:["Autumn"],own:[],
  say:{m:"Harvest what you planted.",d:"Share some of it.",t:"Count what you gathered.",n:"Remember who fed you."},
  mean:{m:"harvest",d:"generosity",t:"gratitude",n:"ancestry and memory"}},
 {k:"mugwort",n:"Mugwort",moon:["full","dark"],days:[1],seasons:["Summer","Autumn"],own:["sagebundle","driedherbs"],
  say:{m:"Remember what you dreamed.",d:"Trust the hunch.",t:"Listen inward.",n:"Dream on purpose."},
  mean:{m:"memory of dreams",d:"intuition",t:"listening",n:"dreaming"}},
 {k:"jasmine",n:"Jasmine",moon:["full","build"],days:[5,1],seasons:["Summer","Spring"],own:["essentialoils"],
  say:{m:"Want something good today.",d:"Let beauty interrupt you.",t:"Soften into the evening.",n:"Night has its own sweetness."},
  mean:{m:"desire",d:"beauty",t:"softening",n:"night magic"}},
 {k:"calendula",n:"Calendula",moon:["build","full"],days:[0],seasons:["Summer","Autumn"],own:[],
  say:{m:"Turn toward the light.",d:"Keep your face to the sun.",t:"Hold onto the warmth.",n:"Tomorrow, the sun again."},
  mean:{m:"optimism",d:"joy",t:"warmth",n:"hope"}}
];
function myMeaningFor(p){const c=(S.corr||[]).find(c=>String(c.symbol||"").toLowerCase().includes(p.n.toLowerCase().split(" ")[0].toLowerCase()));return c?c.meaning:"";}
function ownsPlant(p){return p.own.some(t=>(S.profile.have||[]).includes(t))||(S.profile.custom||[]).some(x=>String(x).toLowerCase().includes(p.k));}
/* One ally per day, weighted by the moon, weekday, season, her own meanings and what she owns.
   The plant stays the same all day; what it means changes with the light. */
function plantAlly(d){
  d=d||new Date();const mg=moonGroup(),wd=d.getDay(),se=plainSeason(d).name;
  const w=PLANTS.map(p=>1+(p.moon.includes(mg)?2:0)+(p.days.includes(wd)?2:0)+(p.seasons.includes(se)?2:0)+(myMeaningFor(p)?3:0)+(ownsPlant(p)?1.5:0));
  const tot=w.reduce((a,b)=>a+b,0);let r=(hash(dayKey(d)+"plant")%10000)/10000*tot;
  for(let i=0;i<PLANTS.length;i++){r-=w[i];if(r<=0)return PLANTS[i];}
  return PLANTS[0];
}
function plantNow(d){const p=plantAlly(d),part=arcPart(daypart(d)),mine=myMeaningFor(p);return {p,part,say:p.say[part],mean:mine||p.mean[part],mine:!!mine,owned:ownsPlant(p)};}

/* The one sentence: the app interprets the sky so she doesn't have to. */
const MOON_SAY={build:"The moon is building",full:"The moon is full",release:"The moon is pulling back",dark:"The moon is dark"};
const DO_NOW={
 build:{m:"start one thing and give it your real attention",d:"keep feeding what you started instead of starting something else",t:"notice what grew today, even a little",n:"let what you started rest overnight"},
 full:{m:"say out loud what you want, plainly",d:"finish something rather than open something",t:"see the day clearly, including what you avoided",n:"let go of one thing that's ready"},
 release:{m:"choose what is worth continuing instead of adding five new things",d:"drop the task that isn't yours",t:"clear the day off before you walk into the next part of it",n:"put something down and leave it down"},
 dark:{m:"go slowly and keep your plans quiet",d:"do less, on purpose",t:"come home to yourself early",n:"rest is the whole assignment"}};
function alchemySentence(d){
  d=d||new Date();const mg=moonGroup(),dp=daypart(d),part=arcPart(dp),day=DAY_RULE[d.getDay()];
  const w=typeof wxNow==="function"?wxNow():null;
  const wet=w&&["rain","storm","snow"].includes(w.kind),act=wet&&part!=="m"?(w.kind==="snow"?{t:"stay in and let the snow quiet everything down",n:"stay warm and let the snow do the quieting"}:{t:"stay in and let something wash out",n:"stay in and let the weather do the washing"})[part==="d"?"t":part]||DO_NOW[mg][part]:DO_NOW[mg][part];
  return (w?wxClause()+", "+MOON_SAY[mg].charAt(0).toLowerCase()+MOON_SAY[mg].slice(1)+", and ":MOON_SAY[mg]+" and ")+day[0]+" carries "+DAY_THEME[d.getDay()]+" energy. This "+DP_WORD[dp]+" that means "+act+".";
}

/* The strip: compact at a glance, the deeper layer on tap. When her life is louder than the sky,
   the sky gets quiet (only the date, moon and season). */
function fallbackLight(dp){return ({dawn:"golden",morning:"day-bright",afternoon:"day-bright",transition:"day-low",evening:"blue",deepnight:"night"})[dp]||"night";}
function atmosphereMood(f,now){
  const recent=(S.asks||[]).filter(a=>a&&a.text&&now-a.ts>=0&&now-a.ts<6*36e5).sort((a,b)=>b.ts-a.ts)[0],t=(recent&&recent.text||"").toLowerCase();
  if(f.level<=2||/grief|grieving|sad|lonely|hurt|anxious|panic|overthink|heavy|scared|afraid/.test(t))return "held";
  if(f.level===4||/tired|exhaust|drained|depleted|period|sick|ache|pain/.test(t))return "gentle";
  if(/hopeful|excited|happy|good|proud|relieved|joy|grateful/.test(t))return "lifted";
  return "open";
}
/* The sky moves with the clock, minute by minute: dark at night, lifting through dawn, brightest
   around midday, warming at sunset, then sinking back into night. Text sits right on this color,
   so midday stops where white text still reads comfortably. Rain and heavy cloud dim it a little.
   "Light" and "Dark" in Settings turn this off and use their own fixed background. */
const SKY_STOPS=[[0,"#0C0918"],[4.5,"#0E0B1E"],[5.5,"#241D40"],[6.5,"#4A3860"],[8,"#5C547F"],[10,"#686090"],[13,"#6E6794"],[16,"#675F8C"],[18,"#5A4266"],[19.5,"#3E3058"],[20.5,"#262B49"],[22,"#15112A"],[24,"#0C0918"]];
/* The page moves with the sky, not just the background: each part of the day has its own accent
   (borders, labels, links, highlights) and its own button color, and the cards take on the sky's hue. */
const ACCENT_STOPS=[[0,"#9C86E0"],[4.5,"#9C86E0"],[6,"#F2A0BE"],[8,"#F6C383"],[11,"#7FD8C8"],[14,"#8FD3E8"],[16.5,"#E9C25E"],[18,"#F48A6C"],[19.5,"#E96FA8"],[20.5,"#86AEEE"],[22,"#A68EE6"],[24,"#9C86E0"]];
const BUTTON_STOPS=[[0,"#7A2A8C"],[4.5,"#7A2A8C"],[6,"#C2357A"],[8,"#D2486A"],[11,"#B8327E"],[14,"#A63A92"],[16.5,"#C4466A"],[18,"#D2533F"],[19.5,"#B7276F"],[20.5,"#5B4BB0"],[22,"#6E2F95"],[24,"#7A2A8C"]];
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const rgbHex=c=>"#"+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join("");
function stopAt(stops,d){
  d=d||new Date();const t=d.getHours()+d.getMinutes()/60;
  let i=0;while(i<stops.length-2&&stops[i+1][0]<=t)i++;
  const [t0,c0]=stops[i],[t1,c1]=stops[i+1],k=(t-t0)/(t1-t0),a=hexRgb(c0),b=hexRgb(c1);
  return a.map((x,j)=>x+(b[j]-x)*k);
}
function skyColor(d,sky){
  const v=stopAt(SKY_STOPS,d),dim=sky==="dim"?.82:sky==="soft"?.92:1,night=hexRgb("#0C0918");
  return rgbHex(v.map((x,j)=>night[j]+(x-night[j])*dim));
}
const SKIN=["--world-bg","--accent","--gold","--line","--card-edge","--fuchsia","--fuchsia-hi","--surface-card","--surface-card-2","--surface-aura-1","--surface-aura-2","--surface-reading","--surface-nav","--surface-sheet","--surface-input","--surface-tile"];
function skyTick(){
  const root=document.documentElement,st=root.style;
  if(root.dataset.theme){SKIN.forEach(k=>st.removeProperty(k));return;}
  const now=new Date(),bg=hexRgb(skyColor(now,root.dataset.sky)),ac=stopAt(ACCENT_STOPS,now),bt=stopAt(BUTTON_STOPS,now);
  const gold=hexRgb("#E7C45A"),mix=(a,b,k)=>a.map((x,j)=>x+(b[j]-x)*k),rgba=(c,a)=>"rgba("+c.map(Math.round).join(",")+","+a+")";
  /* Cards: the sky's own hue, deepened so text on them always reads, with a breath of the accent. */
  const card=mix(mix(bg,[10,8,22],.40),ac,.10),card2=mix(card,ac,.10),deep=mix(card,[8,6,18],.35);
  st.setProperty("--world-bg",rgbHex(bg));
  st.setProperty("--accent",rgbHex(ac));
  st.setProperty("--gold",rgbHex(mix(gold,ac,.6)));
  st.setProperty("--line",rgba(ac,.34));
  st.setProperty("--card-edge",rgba(ac,.42));
  st.setProperty("--fuchsia",rgbHex(bt));
  st.setProperty("--fuchsia-hi",rgbHex(mix(bt,[255,255,255],.22)));
  st.setProperty("--surface-card",rgba(card,.95));
  st.setProperty("--surface-card-2",rgba(card2,.95));
  st.setProperty("--surface-aura-1",rgba(mix(card,ac,.16),.97));
  st.setProperty("--surface-aura-2",rgba(deep,.97));
  st.setProperty("--surface-reading",rgba(mix(card,ac,.05),.96));
  st.setProperty("--surface-nav",rgba(deep,.95));
  st.setProperty("--surface-sheet",rgbHex(mix(card,[8,6,18],.15)));
  st.setProperty("--surface-input",rgba(deep,.85));
  st.setProperty("--surface-tile",rgba(card2,.93));
}
setInterval(skyTick,60e3);
function renderSky(){
  const now=new Date(),dp=daypart(now),f=resolveCurrentFocus(now),se=plainSeason(now),pn=plantNow(now),w=typeof wxNow==="function"?wxNow():null,root=document.documentElement;
  root.dataset.daypart=dp;
  root.dataset.light=w&&w.solarPhase?w.solarPhase:fallbackLight(dp);
  root.dataset.atmosphere=atmosphereMood(f,now.getTime());
  root.style.setProperty("--moonglow",(0.35+0.65*M.ill).toFixed(2));skyTick();
  const quiet=f.level<=2;
  const date=esc(now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}));
  const meta=esc(M.name)+' · '+esc(se.name);
  $("#sky").innerHTML='<button class="alch" id="alchOpen" aria-label="Open today\'s Daily Alchemy">'+moonSVG(M)+'<span class="alt">'+
    '<span class="adate">'+date+'</span><span class="aline">'+meta+'</span>'+
    (quiet?'<span class="aread">Your day comes first. The sky can wait.</span>':
     '<span class="aplant">Today\'s plant ally · <b>'+esc(pn.p.n)+'</b></span><span class="aread">“'+esc(pn.say)+'”</span>')+
    '<span class="aopen">Open today\'s alchemy <span aria-hidden="true">›</span></span></span></button>';
}
function openAlchemy(){
  const now=new Date(),dp=daypart(now),f=resolveCurrentFocus(now),se=plainSeason(now),pn=plantNow(now),day=DAY_RULE[now.getDay()],dr=drawPick()!=null?todayDraw():null,cyc=cycleContext(now);
  const fullIn=Math.round(M.toFull),newIn=Math.round(M.toNew),st=f.steward;
  const relay=["aurora","sol","juniper","fern"].map(k=>'<span class="relay'+(k===STEWARD[dp]?' on':'')+'">'+esc(G[k].name)+'</span>').join('<span class="rarr">›</span>');
  let h='<div class="stack alchsheet"><div class="label">Daily Alchemy</div><h2>'+esc(now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}))+'</h2>'+
   '<p class="voice">'+esc(alchemySentence(now))+'</p>'+
   (f.level<=3?'<p class="small" style="color:var(--gold)">'+esc(f.level===1?"Right now, you matter more than any of this.":"What's happening in your life comes before any of this today. The sky can wait.")+'</p>':'')+
   '<details class="group" open><summary>The moon</summary><p>'+esc(M.name)+', '+Math.round(M.ill*100)+'% lit. '+(M.waxing?"Full moon in "+fullIn+(fullIn===1?" day":" days")+", new moon in "+newIn+".":"New moon in "+newIn+(newIn===1?" day":" days")+", full moon in "+fullIn+".")+'</p><p class="small muted">'+esc(MOON_TALK[M.name])+'</p></details>'+
   '<details class="group"><summary>The season</summary><p>'+esc(se.name)+'. '+esc(se.next)+' begins in '+se.days+' days.</p><p class="small muted">On the wheel of the year it\'s '+esc(SEA.cur.name)+', the time of '+esc(SEA.cur.sense)+'. '+esc(SEA.next.name)+' is '+SEA.days+' days out.</p></details>'+
   '<details class="group"><summary>The day</summary><p>'+esc(day[0])+' belongs to '+esc(day[1])+': '+esc(day[2])+'.</p><p class="small muted">At home in the Circle today: '+esc(day[3].filter(k=>G[k]&&allowedG(k)).map(k=>G[k].name).join(", "))+'.</p></details>'+
   (S.pseason?'<details class="group"><summary>Your season</summary><p>'+esc(S.pseason.name)+', since '+esc(fmtDate(S.pseason.start))+'.</p></details>':'')+
   '<details class="group"'+(f.level<=2?'':' open')+'><summary>Plant ally · '+esc(pn.p.n)+'</summary><p>'+(pn.mine?'Your meaning: <b>'+esc(pn.mean)+'</b>. Yours outranks the old books.':'This '+esc(DP_WORD[dp])+', '+esc(pn.p.n.toLowerCase())+' means <b>'+esc(pn.mean)+'</b>.')+' “'+esc(pn.say)+'”</p>'+
     '<div class="pday">'+[["m","Morning"],["d","Midday"],["t","Threshold"],["n","Night"]].map(([k,l])=>'<div class="'+(k===pn.part?'on':'')+'"><span>'+l+'</span>'+esc(pn.p.mean[k])+'</div>').join("")+'</div>'+
     '<p class="small muted">'+(pn.owned?'You already have something like it at home. ':'')+'You don\'t need to buy it. Picture it, find a photo, or let anything green you already have stand in. Plant allies are symbolic, not something to eat or take.</p></details>'+
   '<details class="group"><summary>Who\'s holding the day</summary><p>'+(f.level<=3?'Aura stepped in. '+esc(f.headline||"Something in your life comes first right now."):esc(G[st].name)+' has the '+esc(DP_WORD[dp])+'.')+'</p><div class="relayrow">'+relay+'</div><p class="small muted">Aurora has the morning, Sol the middle of the day (with Rowan when your body needs moving), Juniper the threshold home, and Fern the night. Aura steps in whenever your life matters more than the clock.</p></details>'+
   (dr?'<details class="group"><summary>Today\'s card · '+esc(dr.name)+'</summary><p>'+esc(dr.now)+'</p></details>':'')+
   (cyc&&cyc.day!=null?'<details class="group"><summary>Iris</summary><p>Cycle day '+cyc.day+'. '+esc(cycleEstimate(now).line)+'</p>'+(cyc.pattern?'<p class="small muted">'+esc(cyc.pattern)+'</p>':'')+'</details>':'')+
   '<button class="btn btn-ghost full" id="sheetDone">Close</button></div>';
  openSheet(h);
}
