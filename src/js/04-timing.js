/* ------------------------------------------------------------------
   TIMING: why a ritual matters on this day, at this hour, under this moon.
------------------------------------------------------------------ */
const PHASE_WORK = {
  "New Moon":["plant","The sky is dark, so nothing is lit up yet. This is the phase for planting intentions in the dark and letting them root before anyone sees them."],
  "Waxing Crescent":["gather","The first sliver of light is growing. This phase is for gathering energy and taking the first small steps toward what you planted."],
  "First Quarter":["act","The moon is half lit and pushing forward. This phase brings tension and decisions. It's for acting, choosing and standing your ground."],
  "Waxing Gibbous":["refine","The moon is almost full and your intuition runs louder. This phase is for refining, adjusting and looking closer at what's forming."],
  "Full Moon":["release","Everything is lit. What you've avoided is visible now. This is the strongest night to release, reveal and charge."],
  "Waning Gibbous":["shed","The light is starting to pull back. This phase is for sharing what you learned, then beginning to shed what's heavy."],
  "Last Quarter":["cut","The moon is half dark and shrinking. This phase is for clean cuts: cords, habits and old agreements."],
  "Waning Crescent":["rest","The last sliver before the dark. This phase is for rest, surrender and letting things end before the next cycle begins."]
};
const DAY_RULE = [
  ["Sunday","the Sun","vitality, confidence and being seen",["rowan","aurora","marigold","aura"]],
  ["Monday","the Moon","intuition, emotion, rest, dreams and body rhythms",["fern","juniper","wren","willow","iris"]],
  ["Tuesday","Mars","courage, anger, cutting ties and protection",["sage","rue"]],
  ["Wednesday","Mercury","clarity, communication, signs and messages",["lily","wren","aurora"]],
  ["Thursday","Jupiter","growth, abundance, vision and big plans",["lumen","sol","rowan"]],
  ["Friday","Venus","love, beauty, worth, pleasure and home",["marigold","vesper","juniper","willow"]],
  ["Saturday","Saturn","boundaries, endings, banishing, discipline and ancestors",["thistle","onyx","onora","sol","rue"]]
];
const HOURS = [
  ["dawn",5,8,"Dawn is for beginnings and first light on a question."],
  ["morning",8,12,"Morning is for clarity, intention and momentum."],
  ["afternoon",12,17,"Afternoon is for grounding, work and practical magic."],
  ["evening",17,21,"Evening is for release, reflection and letting the day go."],
  ["night",21,29,"Night is for intuition, dreams, shadow and deep rest."]
];
const EL_TIME = {Air:"morning",Dawn:"dawn",Sun:"morning",Light:"morning",Fire:"evening","Fire and Water":"evening",Earth:"afternoon",Wood:"afternoon",Metal:"afternoon",Forest:"afternoon",
  Water:"night","Water and Earth":"evening",Moon:"night",Shadow:"night",Warding:"night",Ancestry:"evening",Starlight:"night","Air and Water":"night","All elements":"evening"};
const WHEN_OVERRIDE = {"first-light":"dawn","morning-oath":"dawn","dawn-question":"night","sun-hype":"morning","green-nap":"afternoon","slow-tea":"afternoon","dream-bowl":"night","full-moon-release":"night","salt-vein":"night","seed-intention":"evening","ledger":"morning","quarter-review":"morning","four-count":"morning","anchor":"morning","gilded-shower":"evening","phoenix-shower":"morning"};
function hourName(d){let h=d.getHours();if(h<5)h+=24;return (HOURS.find(x=>h>=x[1]&&h<x[2])||HOURS[4]);}
function bestTime(r){return WHEN_OVERRIDE[r.id]||EL_TIME[r.el]||"evening";}
function moonFit(r){
  if(r.moon===M.name)return 3;
  if(r.moon==="Any")return 1;
  if(r.moon==="Dark Moon"&&(M.name==="New Moon"||M.name==="Waning Crescent"))return 3;
  if(M.name.startsWith(r.moon)||(r.moon==="Waxing"&&M.waxing)||(r.moon==="Waning"&&!M.waxing))return 2;
  if((r.moon==="New"&&M.name==="New Moon")||(r.moon==="Full"&&M.name==="Full Moon"))return 3;
  return 0;
}
function timingScore(r,d){
  const day=DAY_RULE[d.getDay()], now=hourName(d)[0];
  return moonFit(r)*2+(day[3].includes(r.g)?2:0)+(bestTime(r)===now?1:0);
}
function pickForNow(pool,d,salt){
  d=d||new Date();
  const scored=pool.map(r=>[timingScore(r,d),r]).sort((a,b)=>b[0]-a[0]);
  const top=scored.filter(x=>x[0]===scored[0][0]).map(x=>x[1]);
  return top[hash(dayKey(d)+(salt||""))%top.length];
}
const MOON_TALK={
  "New Moon":"The moon is dark right now, so this is planting time. Nothing has to show yet.",
  "Waxing Crescent":"The moon is just a sliver and growing, so this is about gathering your energy and taking the first small step.",
  "First Quarter":"The moon is half lit and pushing forward, which means it's time to decide something and stand in it.",
  "Waxing Gibbous":"The moon is almost full and your intuition is louder than usual, so it's a good time to look closer.",
  "Full Moon":"The moon is full tonight. Everything is lit up, which makes it the strongest night to let go.",
  "Waning Gibbous":"The moon is past full and starting to pull back, so tonight is about shedding what's heavy.",
  "Last Quarter":"The moon is half dark and shrinking. It's clean-cut season: cords, habits, old agreements.",
  "Waning Crescent":"The moon is almost gone, so this is rest before the reset."
};
const TIME_WHY={dawn:"things are just beginning",morning:"your head is clearest",afternoon:"you're grounded and practical",evening:"the day is ready to be let go",night:"intuition and dreams run deepest"};
function whyNow(r){
  const d=new Date(), day=DAY_RULE[d.getDay()], hn=hourName(d)[0], bt=bestTime(r), mf=moonFit(r), g=G[r.g], dayFit=day[3].includes(r.g);
  const moonFitLine = mf>=3?"This ritual was made for exactly this moon."
    : mf===2?"This one moves right along with it."
    : r.moon==="Any"?"This one works under any moon, and tonight's gives it a push."
    : "It's usually done at the "+r.moon.toLowerCase()+(/moon/i.test(r.moon)?"":" moon")+", but it still works tonight.";
  const dayLine="It's "+day[0]+", "+day[1]+"'s day, which is all about "+day[2]+". "+(dayFit?"That's "+g.name+"'s home turf.":"Bring a little of that into it.");
  const timeLine = hn===bt?"And right now, the "+hn+", is the best time for it, because "+TIME_WHY[bt]+"."
    : "The best time is the "+bt+", when "+TIME_WHY[bt]+", so "+(bt==="night"||bt==="evening"?"set it up for tonight.":bt==="dawn"||bt==="morning"?"save it for tomorrow morning, or do it now and mean it.":"do it when you can step away.");
  const seasonLine="We're in "+SEA.cur.name+" season, the time of "+SEA.cur.sense+". "+SEA.next.name+" is "+SEA.days+" days out.";
  const sign=g.phrases[hash(dayKey(d)+r.id)%g.phrases.length];
  return '<details class="whynow"'+(arguments[1]?" open":"")+'><summary>Why today, why now</summary><p class="whytalk">'+esc(MOON_TALK[M.name]+" "+moonFitLine+" "+dayLine+" "+timeLine+" "+seasonLine)+'</p><p class="whysign">'+esc(sign)+' <span>· '+esc(g.name)+'</span></p></details>';
}


