/* ------------------------------------------------------------------
   THE INNER CIRCLE: one membership unlocks every Chamber and Journey.
------------------------------------------------------------------ */
const PLAN = {name:"The Inner Circle",monthly:"$6.99",yearly:"$49",yearNote:"That's about $4.08 a month."};
const LIMITS = {free:{read:3,talk:10},member:{read:40,talk:150}};
const CHAMBERS = {
  aura:{name:"The Weaving Room",d:"Weekly reviews that pull your rituals, chats and patterns into one thread."},
  onyx:{name:"The Shadow Chamber",d:"Mirror work, truth rites and amends for the parts you keep looking away from."},
  sage:{name:"The Revolution Pages",d:"Cord cutting and fire rites for rage, resistance and taking your power back."},
  fern:{name:"The Lunar Alchemist",d:"Moon work for rest, tides and release, timed to the phase you're in."},
  lily:{name:"The Clear Channel",d:"Breath rites that clear a racing mind in every direction."},
  thistle:{name:"The Rootkeeper's Almanac",d:"Boundary scripts you rehearse before you need them."},
  marigold:{name:"The Gilded Chamber",d:"Money, worth and receiving. Rituals that change how abundance feels in your hands."},
  juniper:{name:"Sacred Space",d:"Home blessings and threshold rites for every door you walk through."},
  rue:{name:"The Warding Book",d:"Wards for your name, your home and your peace. Send it back where it came from."},
  sol:{name:"The Solar Chamber",d:"Hype, plans and follow through. Where the promises you make to yourself get kept."},
  aurora:{name:"The Dawn Chamber",d:"Morning rites for clarity and answers that arrive at first light."},
  rowan:{name:"The Moving Grove",d:"Movement rites that get you out of your head and back into your body."},
  ember:{name:"The Forge",d:"Endings you mean and rebirths you can feel on your skin."},
  willow:{name:"The Weeping Garden",d:"Forgiveness and unfinished words, handled gently."},
  vesper:{name:"The Night Garden",d:"Desire, pleasure and sex magic, for members 21 and older."},
  wren:{name:"The Omen Book",d:"Dream bowls and sky questions for reading the signs."},
  lumen:{name:"The Star Chamber",d:"Vision boards with a plan attached, and futures spoken into being."},
  onora:{name:"The Hall of Names",d:"Ancestor plates and heirloom blessings for the people you come from."},
  poppy:{name:"The Studio",d:"Creative unblocking rites, color spells and a home for the thing you keep not finishing."}
};
const JOURNEYS = [
  {id:"calling-back",name:"Calling Yourself Back",g:"onyx",d:"Seven days of retrieving the parts of you that got left behind.",days:[
   ["unsent-letter","Start with the truth you never said."],["mirror-truth","Look at her. Really look."],["obscured-mirror","Let the water show what you won't."],
   ["rootprint","Come back into your body."],["say-their-names","Remember who you come from."],["mirror-honey","Speak to yourself the way you deserve."],["circle-sealing","Seal the version of you that came back."]]},
  {id:"after-breakup",name:"Reclaiming Yourself After a Breakup",g:"sage",d:"Cord cutting, burning, glowing, in that order.",days:[
   ["burned-word","Say everything. Then burn it."],["cord-cutting","Cut the cord that's still pulling."],["salt-vein","Stop the leak."],
   ["grief-bowl","Grieve it honestly. Even the good parts."],["phoenix-shower","Wash off the version of you they knew."],["mirror-honey","Remember who you were before them."],["seed-intention","Plant what's next."]]},
  {id:"new-moon",name:"New Moon Beginning",g:"sol",d:"Plant it, plan it, tend it through the first week of the waxing moon.",days:[
   ["seed-intention","Plant the intention in something that grows."],["ledger","Turn the wish into three moves."],["future-letter","Write back from one year out."],
   ["dawn-question","Ask for clarity overnight."],["sun-hype","Build the energy to start."],["vision-board","Map it."],["victory-jar","Start keeping receipts."]]},
  {id:"full-moon",name:"Full Moon Release",g:"fern",d:"A week of letting go, timed to the fullest light.",days:[
   ["full-moon-release","Name what's leaving."],["tidewater-rest","Rest is part of release."],["forgiveness-knot","Loosen the grudge."],
   ["last-straw","End what you've tolerated too long."],["bone-bath","Shed it from the body."],["empty-chair","Say the unfinished thing."],["circle-sealing","Close the portal."]]},
  {id:"home-reset",name:"The 7-Day Home Reset",g:"juniper",d:"One ritual a day until the whole house breathes.",days:[
   ["threshold-reset","Clear one surface. Start there."],["whisper-sweep","Sweep out the old stories."],["salt-line","Draw the line at the door."],
   ["doorway-blessing","Bless the threshold."],["jar-returning","Ward the house."],["ancestor-plate","Feed the ones who fed you."],["circle-sealing","Seal the home."]]},
  {id:"abundance",name:"The Abundance Season",g:"marigold",d:"Seven days of receiving on purpose.",days:[
   ["money-altar","Change how money feels in your hands."],["mirror-honey","Say it again but sweeter."],["solar-charge","Charge your power."],
   ["victory-jar","Count what you've already won."],["gilded-shower","Treat yourself like you're worth it."],["name-the-future","Speak it as already true."],["vision-board","Map the season."]]}
];

/* Altar deck (formerly the Rosebud Altar Deck) */
const DECK = {
  aura:["You already know. Act like it.","Welcome to the work.","Nothing is late. Only next."],
  onyx:["The thing you won't say is running the room.","You knew. You've always known.","Sit in it. Then get up."],
  sage:["Your anger is information. Read it.","Burn the bridge you keep walking back across.","Light it up. Carefully. On purpose."],
  fern:["The tide goes out so it can come back.","Rest is not a reward. It is the ritual.","Your tears are water magic."],
  lily:["Inhale. You're allowed to take up air.","One clear thought beats ten loud ones.","Open a window. Literally."],
  thistle:["No is a complete sentence.","Strong isn't cruel.","Root down before you reach out."],
  marigold:["Say it again but sweeter.","You're allowed to want more.","Wear the good stuff on a Tuesday."],
  juniper:["Clear one surface. The rest will follow.","Your space is listening.","Make the room ready for who you're becoming."],
  rue:["Not everyone gets a key.","Protect your name like it's a spell. It is.","Block. Cut. Banish. Then brunch."],
  sol:["Hype you up. Hold you to it.","A wish with a date is a plan.","Small and daily beats big and someday."]
};

/* Moon phase: the lunar metronome */
const SYN = 29.530588853, NEW_REF = Date.UTC(2000,0,6,18,14);
function moon(d){
  const age = ((((d.getTime()-NEW_REF)/864e5)%SYN)+SYN)%SYN;
  const f = age/SYN, ill = (1-Math.cos(2*Math.PI*f))/2;
  const names = [[1.84566,"New Moon"],[5.53699,"Waxing Crescent"],[9.22831,"First Quarter"],[12.91963,"Waxing Gibbous"],[16.61096,"Full Moon"],[20.30228,"Waning Gibbous"],[23.99361,"Last Quarter"],[27.68493,"Waning Crescent"],[99,"New Moon"]];
  const name = names.find(n=>age<n[0])[1];
  const toFull = ((14.765-age)+SYN)%SYN, toNew = (SYN-age)%SYN;
  return {age,f,ill,name,waxing:f<.5,toFull,toNew};
}
function moonSVG(m){
  const r=50,k=Math.cos(2*Math.PI*m.f),rx=Math.abs(k)*r;
  const outer=m.waxing?1:0, inner=m.waxing?(k>0?0:1):(k>0?1:0);
  const d="M50,0 A"+r+","+r+" 0 0,"+outer+" 50,100 A"+rx+","+r+" 0 0,"+inner+" 50,0 Z";
  return '<svg viewBox="-6 -6 112 112" aria-hidden="true"><defs><radialGradient id="mg" cx="40%" cy="35%"><stop offset="0" stop-color="#FFF7DA"/><stop offset=".7" stop-color="#EAD9A2"/><stop offset="1" stop-color="#C9A95A"/></radialGradient></defs><circle cx="50" cy="50" r="50" fill="#2C2650" stroke="rgba(231,196,90,.5)" stroke-width="1.5"/><path d="'+d+'" fill="url(#mg)"/><circle cx="50" cy="50" r="55" fill="none" stroke="rgba(231,196,90,.25)" stroke-dasharray="1 5"/></svg>';
}
const PHASE_READ = {
  "New Moon":"The sky is dark on purpose. Plant, don't push. Say what you want out loud once and let it be.",
  "Waxing Crescent":"A sliver of light. Momentum is small but real. Gather your will before you spend it.",
  "First Quarter":"Tension is the point today. Something is asking you to choose. Choose.",
  "Waxing Gibbous":"Almost full. Refine, adjust, look closer. Your intuition is louder than usual.",
  "Full Moon":"Everything is lit. What you have been avoiding is visible now. Release what is ready.",
  "Waning Gibbous":"The light is starting to pull back. Share what you learned, then begin to shed.",
  "Last Quarter":"A clean cut kind of week. Cords, habits, old agreements. Decide what stays.",
  "Waning Crescent":"The quiet before the reset. Rest is the ritual. Don't start anything big tonight."
};
const PHASE_PICK = {"New Moon":"seed-intention","Waxing Crescent":"wick-binding","First Quarter":"rootprint","Waxing Gibbous":"obscured-mirror","Full Moon":"full-moon-release","Waning Gibbous":"bone-bath","Last Quarter":"salt-vein","Waning Crescent":"tidewater-rest"};

/* Wheel of the Year (northern hemisphere) */
const WHEEL=[[2,1,"Imbolc","first stirrings, clearing, hope"],[3,20,"Ostara","balance, planting, beginnings"],[5,1,"Beltane","desire, fire, pleasure"],[6,21,"Litha","full power, radiance, action"],[8,1,"Lammas","first harvest, gratitude, effort paying off"],[9,22,"Mabon","second harvest, balance, letting go"],[10,31,"Samhain","ancestors, the veil, endings"],[12,21,"Yule","rest, return of the light"]];
function season(d){
  const y=d.getFullYear(); let cur=null,next=null;
  const pts=[];for(const yy of [y-1,y,y+1])for(const w of WHEEL)pts.push({date:new Date(yy,w[0]-1,w[1]),name:w[2],sense:w[3]});
  pts.sort((a,b)=>a.date-b.date);
  for(let i=0;i<pts.length;i++){if(pts[i].date<=d)cur=pts[i];else{next=pts[i];break;}}
  return {cur,next,days:Math.ceil((next.date-d)/864e5)};
}

