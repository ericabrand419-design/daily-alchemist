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
  return MOON_SAY[mg]+" and "+day[0]+" carries "+DAY_THEME[d.getDay()]+" energy. This "+DP_WORD[dp]+" that means "+DO_NOW[mg][part]+".";
}

/* The strip: compact at a glance, the deeper layer on tap. When her life is louder than the sky,
   the sky gets quiet (only the date, moon and season). */
function renderSky(){
  const now=new Date(),dp=daypart(now),f=resolveCurrentFocus(now),se=plainSeason(now),pn=plantNow(now);
  document.documentElement.dataset.daypart=dp;document.documentElement.style.setProperty("--moonglow",(0.35+0.65*M.ill).toFixed(2));
  const quiet=f.level<=2;
  const top=esc(now.toLocaleDateString(undefined,{weekday:"long"}))+' · '+esc(M.name)+' · '+esc(se.name);
  $("#sky").innerHTML='<button class="alch" id="alchOpen" aria-label="Open today\'s Daily Alchemy">'+moonSVG(M)+'<span class="alt"><span class="aline">'+top+'</span>'+
    (quiet?'<span class="aread muted">Your day comes first. Tap for today\'s sky.</span>':
     '<span class="aplant">Plant ally: <b>'+esc(pn.p.n)+'</b></span><span class="aread">“'+esc(pn.say)+'”</span>')+'</span></button>';
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
