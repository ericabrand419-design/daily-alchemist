/* ------------------------------------------------------------------
   THE ALTAR DECK: a real 78 card tarot. 22 Major Arcana and 56 Minor
   Arcana, upright and reversed, with their traditional meanings in the
   Daily Alchemist's own voice. Card faces are drawn here (original art,
   not a copy of any published deck). Each card is held by a guardian,
   who is the one you talk to about it. One card a day; its question
   changes as the day moves. No AI call to draw or read it.
------------------------------------------------------------------ */
/* Majors: [numeral, name, guardian, upright keywords, reversed keywords, upright meaning, reversed meaning, theme, reversed theme, question] */
const MAJORS=[
 ["0","The Fool","poppy","beginnings, a leap, trust","hesitation, recklessness","Something new wants you to step toward it before you feel ready. Trust is the whole skill today.","Either you're holding back from a leap that's yours, or rushing one that isn't. Check which.","a fresh start","fear of looking foolish","What would I try if I didn't need to know how it ends?"],
 ["I","The Magician","aura","skill, will, resources","scattered energy, trickery","You already have the tools. Today is about pointing them at one thing on purpose.","Your energy is leaking in too many directions, or someone's selling you an illusion.","using what you have","scattered focus","What do I already have that I keep overlooking?"],
 ["II","The High Priestess","wren","intuition, the unseen, quiet knowing","ignoring your gut, secrets","You know more than you can explain. Get quiet enough to hear it.","You've been talking over your own intuition. Something hidden wants out.","your inner knowing","second guessing yourself","What do I know that I haven't said out loud?"],
 ["III","The Empress","marigold","abundance, nurture, pleasure","depletion, overgiving","Let yourself be fed: by beauty, by rest, by people who give back.","You've been mothering everyone but yourself. The well needs filling.","receiving","giving until empty","Where can I let myself receive today?"],
 ["IV","The Emperor","thistle","structure, authority, boundaries","rigidity, control","Build the structure that protects what matters. Order is a kindness to your future self.","Control has turned into a cage, yours or someone else's.","a steady structure","holding on too tight","What structure would make today easier?"],
 ["V","The Hierophant","onora","tradition, teachers, belonging","rebellion, outgrown rules","There's wisdom in what's been handed down. Lean on a practice or a person who knows.","A rule you inherited doesn't fit you anymore. You're allowed to write your own.","what you were taught","rules that don't fit","Which tradition holds me up, and which one holds me back?"],
 ["VI","The Lovers","vesper","love, alignment, choice","misalignment, a hard choice","A choice of the heart. Pick what matches your values, not only your wants.","Something is out of alignment between what you want and what you're choosing.","choosing with your whole heart","choosing against yourself","What choice would I make if I trusted my own values?"],
 ["VII","The Chariot","sol","drive, direction, willpower","stalling, pulled two ways","Hold the reins. Two pulls, one direction. Momentum is yours if you steer.","You're being pulled two ways and going nowhere. Pick one.","forward motion","pulling in two directions","Where am I actually trying to go?"],
 ["VIII","Strength","rowan","courage, patience, gentle power","self doubt, force","Real strength is soft hands on something wild. Patience will do what force can't.","You're forcing it, or doubting you can. Breathe and come back gentler.","quiet courage","forcing it","Where could gentleness do more than force?"],
 ["IX","The Hermit","juniper","solitude, inner guidance, reflection","isolation, avoidance","Step back from the noise. The answer is in the quiet, and you're allowed to go find it.","Solitude has turned into hiding. Let one person in.","quiet time alone","hiding from people","What do I hear when the noise stops?"],
 ["X","Wheel of Fortune","iris","cycles, turning points, change","resisting change, bad timing","The wheel is turning. What goes around has a rhythm, and you're in a new part of it.","You're fighting a turn that's already happening. Ride it.","the turning of a cycle","fighting the change","What part of my cycle am I in right now?"],
 ["XI","Justice","onyx","truth, fairness, accountability","unfairness, avoiding responsibility","The truth balances things. Own your part, and expect others to own theirs.","Something is unfair, or something is unowned. Look honestly at both sides.","the honest truth","avoiding what's yours","What's mine to own here, and what isn't?"],
 ["XII","The Hanged Man","willow","surrender, pause, a new view","stalling, martyrdom","Stop pushing. Hang upside down for a minute and the whole thing looks different.","You're waiting for a rescue that isn't coming, or suffering on purpose.","letting go of control","waiting and waiting","What do I see if I stop trying to fix it?"],
 ["XIII","Death","sage","endings, transformation, clearing","clinging, fear of change","Something is ending so something else can live. Let it close cleanly.","You're holding on to what's already over. It costs more than letting go.","a clean ending","holding on to what's over","What's already over that I keep feeding?"],
 ["XIV","Temperance","lily","balance, patience, blending","excess, imbalance","Mix it slowly. The middle way is not boring today, it's medicine.","Too much of one thing, not enough of another. Rebalance.","the middle way","too much of one thing","What needs less, and what needs more?"],
 ["XV","The Devil","rue","attachment, temptation, the shadow","release, breaking free","Name what has a hold on you. The chains are looser than they look.","You're loosening something that held you. Keep going.","what has a hold on you","breaking free","What do I keep going back to that doesn't love me back?"],
 ["XVI","The Tower","sage","upheaval, revelation, breakthrough","dodging disaster, fear of change","What was built on a lie comes down. It's loud, and it's freeing.","You're bracing for a collapse, or holding up something that needs to fall.","the truth breaking through","propping up what's falling","What would be a relief to stop holding up?"],
 ["XVII","The Star","lumen","hope, healing, renewal","discouragement, lost faith","After the storm, clear water. Hope is not naive today. It's earned.","You've stopped believing it can get better. Find one small proof that it can.","hope","losing faith","What gives me hope, even a little?"],
 ["XVIII","The Moon","fern","dreams, uncertainty, intuition","confusion clearing, fear releasing","Not everything is clear yet, and that's okay. Feel your way, don't force the map.","The fog is lifting. What scared you is smaller in daylight.","what you can't see yet","fear that's lifting","What am I afraid of that might not be true?"],
 ["XIX","The Sun","aurora","joy, clarity, vitality","dimmed joy, burnout","Warmth, clarity, yes. Let something be simply good today.","Your light is dimmed by tiredness, not by lack. Rest, then shine.","simple joy","burnout dimming you","What made me feel alive recently?"],
 ["XX","Judgement","onora","awakening, a calling, reckoning","self doubt, ignoring the call","Something is calling you forward. Answer it with everything you've learned.","You're hearing the call and pretending you aren't.","answering the call","ignoring the call","What is my life asking of me right now?"],
 ["XXI","The World","sol","completion, wholeness, arrival","loose ends, almost there","A cycle is complete. Celebrate it before you start the next one.","You're nearly there. One loose end is in the way.","something complete","a loose end","What's finished that I haven't celebrated?"]
];
/* Minors: per suit, Ace to Ten then Page, Knight, Queen, King: [upright meaning, reversed meaning, theme, reversed theme] */
const SUITS={
 wands:{name:"Wands",el:"Fire",g:"sage",q:"Where is my fire going today?",cards:[
  ["A spark of passion or a new project. Say yes to what excites you.","The spark is there but blocked. What's in the way of starting?","a new spark","a blocked start"],
  ["You're planning your next move. The world is bigger than where you're standing.","Fear of the unknown is keeping you small. Plan anyway.","planning ahead","playing it safe"],
  ["What you set in motion is coming back to you. Look further out.","Delays and frustration. It's not no, it's not yet.","expansion","delays"],
  ["Celebration, home and a moment of arrival. Enjoy it.","Something at home or in your circle feels unsettled.","celebration","unsettled ground"],
  ["Competition and clashing egos. Not every fight is yours.","You're avoiding a conflict that needs having, or ending one that's done.","friction","avoiding conflict"],
  ["A win, recognition, being seen. Let yourself take the applause.","You're waiting for applause to feel worthy. You already are.","being seen","needing approval"],
  ["Stand your ground. You've earned your position.","You're tired of defending yourself. Choose which hills matter.","standing your ground","exhaustion from defending"],
  ["Things move fast now. Messages, momentum, go.","Rushing or stalling. Find the right speed.","momentum","the wrong pace"],
  ["You're tired and still standing. One more push, then rest.","Paranoia or burnout. You don't have to guard everything.","resilience","running on fumes"],
  ["You're carrying too much. Put something down.","You're finally setting down a burden that was never all yours.","carrying too much","setting it down"],
  ["Curiosity and good news about something you love.","A bright idea with no follow through yet.","curiosity","an unfinished idea"],
  ["Bold, fast, fearless energy. Go after it.","Impulsive moves you may regret. Aim first.","bold action","impulsiveness"],
  ["Warm, magnetic confidence. Let people feel your fire.","Your fire turned inward as jealousy or self doubt.","magnetic confidence","self doubt"],
  ["Lead with vision. People follow someone who knows where they're going.","Big vision, heavy hand. Lead without bulldozing.","visionary leadership","overpowering others"]]},
 cups:{name:"Cups",el:"Water",g:"fern",q:"What is my heart asking for today?",cards:[
  ["Your heart is open. New love, new feeling, new tenderness.","Your feelings are blocked or turned inward. Let them move.","an open heart","a closed heart"],
  ["A real connection. Mutual, equal, warm.","An imbalance in a relationship. Who's giving more?","mutual connection","an uneven bond"],
  ["Friendship, celebration and your people.","Too much outside, not enough inside, or a friend group that's off.","your people","a strained circle"],
  ["Apathy. You're not seeing what's being offered.","You're ready to engage again after a flat stretch.","what you're not seeing","waking back up"],
  ["Grief and regret over what spilled. Two cups still stand behind you.","You're starting to turn toward what's left.","grief over what's lost","turning toward what's left"],
  ["Nostalgia, innocence, a memory that softens you.","You're living in the past. Bring the sweetness forward.","a sweet memory","stuck in the past"],
  ["Too many options, some of them illusions. Choose the real one.","Clarity is coming. You can see which dream is real.","too many options","clarity"],
  ["Walking away from what no longer fills you. It's brave.","You're afraid to leave, or leaving without closure.","walking away","fear of leaving"],
  ["A wish granted, contentment, enough.","Satisfaction that's hollow. What do you actually want?","contentment","hollow satisfaction"],
  ["Emotional fulfillment, home, love that lasts.","Something at home isn't matching the picture.","love that lasts","the picture not matching"],
  ["A sweet message, a creative or emotional beginning.","Emotional immaturity or a feeling you're not ready to say.","a tender message","an unsaid feeling"],
  ["Romance and following your heart.","Moodiness or a promise that won't be kept.","following your heart","an empty promise"],
  ["Compassion, intuition and emotional wisdom.","You've been holding everyone's feelings but yours.","compassion","emotional overload"],
  ["Calm under emotional pressure. Steady and kind.","Emotions bottled up until they leak sideways.","emotional steadiness","bottled feelings"]]},
 swords:{name:"Swords",el:"Air",g:"lily",q:"What thought is running the show today?",cards:[
  ["A breakthrough of clarity. Cut through to the truth.","Confusion or a truth you don't want to see yet.","clarity","confusion"],
  ["A stalemate. Avoiding a decision won't make it go away.","The decision is surfacing. You can't unknow it.","an avoided decision","a decision surfacing"],
  ["Heartbreak or a painful truth. It hurts because it mattered.","You're starting to heal and let the hurt go.","a painful truth","healing a hurt"],
  ["Rest and recovery. Lie down before you decide anything.","Restlessness. You need rest and won't take it.","rest","refusing rest"],
  ["A conflict where winning costs too much.","Wanting to make peace after a fight.","a costly win","making peace"],
  ["Moving away from trouble toward calmer water.","You can't leave yet, or you're carrying the trouble with you.","moving on","carrying it with you"],
  ["Strategy, or sneaking around. Check who's being honest.","Coming clean, or catching a deception.","what's hidden","coming clean"],
  ["You feel trapped, but the blindfold is looser than you think.","You're freeing yourself from a story that kept you stuck.","feeling trapped","freeing yourself"],
  ["Anxiety in the middle of the night. The worry is bigger than the thing.","The worst of the worry is passing.","night anxiety","worry easing"],
  ["Rock bottom, an ending. The only way now is up.","Recovery after a hard ending.","rock bottom","recovering"],
  ["Curious, watchful, full of questions.","Gossip or saying the sharp thing too fast.","curiosity","sharp words"],
  ["Charging ahead with strong opinions.","Rushing in without thinking it through.","charging ahead","rushing in"],
  ["Clear boundaries and honest words.","Coldness, or using the truth as a weapon.","clear honesty","coldness"],
  ["Clear thinking and fair judgment.","Using your mind to control or manipulate.","clear judgment","control"]]},
 pentacles:{name:"Pentacles",el:"Earth",g:"thistle",q:"What does my body, my money or my home need today?",cards:[
  ["A real opportunity: money, health or something you can hold.","A missed or delayed chance. Look again.","a real opportunity","a missed chance"],
  ["Juggling it all. Flexibility keeps the balls in the air.","Overcommitted. Something's about to drop.","juggling priorities","overcommitment"],
  ["Teamwork and skilled hands. Build it together.","Doing it all yourself, or a team that isn't working.","teamwork","going it alone"],
  ["Security, saving, holding on.","Holding too tight, or spending to feel better.","security","holding too tight"],
  ["Hard times or feeling left out in the cold. Help is closer than you think.","Recovery is starting. Let someone help.","hard times","help arriving"],
  ["Giving and receiving in balance.","Strings attached, or giving more than you can.","generosity","strings attached"],
  ["Patience. You planted it, now let it grow.","Impatience, or investing in the wrong thing.","patient growth","impatience"],
  ["Skill built one repetition at a time.","Perfectionism or work without meaning.","practice","perfectionism"],
  ["Independence and enjoying what you've built.","Leaning on others or overworking for security.","self sufficiency","overworking"],
  ["Legacy, family, lasting wealth.","Family money or inheritance tension.","legacy","family tension"],
  ["A student's start. Learn something practical.","Procrastination on something that matters.","learning","procrastination"],
  ["Slow and steady wins. Do the routine.","Boredom or getting stuck in the rut.","steady effort","stuck in the rut"],
  ["Nurturing, practical and grounded abundance.","Neglecting yourself while taking care of everything else.","grounded care","self neglect"],
  ["Abundance, stability and leadership with a full table.","Greed or a life that's all work.","stability","all work"]]}
};
const MINOR_OVERRIDE={"cups-2":"marigold","cups-10":"marigold","cups-5":"willow","cups-8":"willow","swords-3":"willow","swords-7":"onyx","swords-9":"lily","pentacles-8":"sol","pentacles-6":"juniper","pentacles-10":"onora","wands-1":"sol","wands-12":"sol","pentacles-1":"rowan","pentacles-11":"rowan"};
const RANKS=["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Page","Knight","Queen","King"];
const RANK_NUM=["I","II","III","IV","V","VI","VII","VIII","IX","X","PAGE","KNIGHT","QUEEN","KING"];
const TAROT=[];
MAJORS.forEach((m,i)=>TAROT.push({id:"major-"+i,major:true,i,num:m[0],name:m[1],g:m[2],up:m[3],rev:m[4],meaning:m[5],revMeaning:m[6],theme:m[7],revTheme:m[8],question:m[9]}));
for(const [sk,s] of Object.entries(SUITS))s.cards.forEach((c,r)=>TAROT.push({id:sk+"-"+r,major:false,suit:sk,rank:r,num:RANK_NUM[r],name:RANKS[r]+" of "+s.name,g:MINOR_OVERRIDE[sk+"-"+r]||s.g,meaning:c[0],revMeaning:c[1],theme:c[2],revTheme:c[3],question:s.q,el:s.el}));
const TAROT_BY=Object.fromEntries(TAROT.map(c=>[c.id,c]));

/* The spread: five cards from the whole deck, a new five each day. About a third come up reversed. */
function drawSpread(){
  const k=dayKey(today),out=[];let i=0;
  while(out.length<5&&i<200){const c=TAROT[hash(k+"t"+i)%TAROT.length];if(!out.includes(c.id))out.push(c.id);i++;}
  return out;
}
function cardRev(id){return hash(dayKey(today)+"r"+id)%10<3;}
function holderOf(c){return allowedG(c.g)?c.g:(c.g==="vesper"?"marigold":"aura");}
function todayDraw(){
  const sp=drawSpread(),pi=drawPick(),id=sp[pi==null?0:pi]||sp[0],c=TAROT_BY[id],rev=cardRev(id),g=holderOf(c);
  return {id,g,rev,num:c.num,name:c.name,title:c.name+(rev?", reversed":""),meaning:rev?c.revMeaning:c.meaning,keywords:c.major?(rev?c.rev:c.up):"",line:rev?c.revMeaning:c.meaning,question:c.question,card:c,now:cardNow(id,rev)};
}
function cardNow(id,rev,d){
  const c=TAROT_BY[id];if(!c)return "";const p=arcPart(daypart(d)),th=rev?c.revTheme:c.theme,nm=c.name+(rev?", reversed,":"");
  if(p==="m")return rev?nm+" this morning: notice where "+th+" is getting in the way.":nm+" this morning: make room for "+th+".";
  if(p==="d")return c.name+" is still with you. Where has "+th+" shown up so far today?";
  return c.name+"'s question tonight: "+(rev?"what would it take to set "+th+" down?":"what did "+th+" ask of you today?");
}

/* Card faces: original art. Majors carry a sigil, minors carry their pips like a real deck. */
const INK="#3A2A1A",GOLD="#9A7414";
function suitMark(s,x,y,sz){
  const k=sz/10,st='stroke="'+INK+'" stroke-width="'+(1.1)+'" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  const T=(p)=>'<g transform="translate('+x+' '+y+') scale('+k+')">'+p+'</g>';
  if(s==="wands")return T('<path '+st+' d="M0 -9V9M0 -6l-3 -2M0 -2l3 -2M0 3l-3 -2"/><circle cx="0" cy="-9" r="1.4" fill="'+GOLD+'"/>');
  if(s==="cups")return T('<path '+st+' d="M-5 -7h10c0 6 -3 8 -5 8s-5 -2 -5 -8zM0 1v5M-3 7h6"/>');
  if(s==="swords")return T('<path '+st+' d="M0 -10V5M-4 3h8M0 5v4"/><circle cx="0" cy="9.5" r="1" fill="'+GOLD+'"/>');
  return T('<circle cx="0" cy="0" r="7" '+st+'/><path '+st+' d="M0 -5.5l1.6 4.4h4.6l-3.7 2.8 1.4 4.4L0 3.4l-3.9 2.7 1.4-4.4-3.7-2.8h4.6z"/>');
}
const PIPS={1:[[50,78]],2:[[50,55],[50,101]],3:[[50,50],[50,78],[50,106]],4:[[35,55],[65,55],[35,101],[65,101]],5:[[35,52],[65,52],[50,78],[35,104],[65,104]],6:[[35,50],[65,50],[35,78],[65,78],[35,106],[65,106]],7:[[35,48],[65,48],[50,63],[35,80],[65,80],[35,106],[65,106]],8:[[35,46],[65,46],[35,65],[65,65],[35,88],[65,88],[35,108],[65,108]],9:[[35,46],[65,46],[35,65],[65,65],[50,78],[35,90],[65,90],[35,110],[65,110]],10:[[35,44],[65,44],[50,56],[35,68],[65,68],[35,88],[65,88],[50,100],[35,112],[65,112]]};
const COURT={10:'<path d="M42 70l8-10 8 10M46 66v12M54 66v12" fill="none" stroke="'+INK+'" stroke-width="1.2" stroke-linecap="round"/><path d="M50 52l1.5 3h3l-2.4 1.9.9 3-3-1.8-3 1.8.9-3-2.4-1.9h3z" fill="'+GOLD+'"/>',
 11:'<path d="M38 60h24v14c0 10-12 16-12 16s-12-6-12-16z" fill="none" stroke="'+INK+'" stroke-width="1.3"/><path d="M50 62v22M41 70h18" stroke="'+GOLD+'" stroke-width="1.1"/>',
 12:'<path d="M37 74l4-16 6 9 3-12 3 12 6-9 4 16z" fill="none" stroke="'+INK+'" stroke-width="1.3" stroke-linejoin="round"/><circle cx="50" cy="52" r="2" fill="'+GOLD+'"/><path d="M37 78h26" stroke="'+GOLD+'" stroke-width="1.4"/>',
 13:'<path d="M35 76l3-18 6 8 6-14 6 14 6-8 3 18z" fill="none" stroke="'+INK+'" stroke-width="1.3" stroke-linejoin="round"/><circle cx="38" cy="56" r="1.6" fill="'+GOLD+'"/><circle cx="50" cy="50" r="1.8" fill="'+GOLD+'"/><circle cx="62" cy="56" r="1.6" fill="'+GOLD+'"/><path d="M35 80h30" stroke="'+GOLD+'" stroke-width="1.4"/>'};
const SIGIL=[
 '<circle cx="50" cy="56" r="8" fill="none" stroke="'+GOLD+'" stroke-width="1.3"/><path d="M30 100c10-6 18-6 22-16M52 84l8 14" fill="none" stroke="'+INK+'" stroke-width="1.3" stroke-linecap="round"/><circle cx="52" cy="80" r="3" fill="none" stroke="'+INK+'" stroke-width="1.2"/>',
 '<path d="M32 78c0-8 12-8 18 0s18 8 18 0-12-8-18 0-18 8-18 0z" fill="none" stroke="'+INK+'" stroke-width="1.5"/><path d="M50 54v-8M44 50h12" stroke="'+GOLD+'" stroke-width="1.3"/>',
 '<path d="M36 52v52M64 52v52" stroke="'+INK+'" stroke-width="2.4"/><path d="M54 64a10 10 0 1 1 0 18a8 8 0 1 0 0-18z" fill="'+GOLD+'"/>',
 '<circle cx="50" cy="66" r="11" fill="none" stroke="'+INK+'" stroke-width="1.5"/><path d="M50 77v20M42 88h16" stroke="'+INK+'" stroke-width="1.5"/><path d="M40 50l5 5 5-7 5 7 5-5" fill="none" stroke="'+GOLD+'" stroke-width="1.2"/>',
 '<rect x="36" y="62" width="28" height="30" fill="none" stroke="'+INK+'" stroke-width="1.5"/><path d="M36 62c-6-8-2-14 4-12M64 62c6-8 2-14-4-12" fill="none" stroke="'+GOLD+'" stroke-width="1.3"/>',
 '<path d="M50 48v56M40 60h20M42 70h16M44 80h12" stroke="'+INK+'" stroke-width="1.5" stroke-linecap="round"/><circle cx="50" cy="104" r="3" fill="'+GOLD+'"/>',
 '<circle cx="44" cy="76" r="12" fill="none" stroke="'+INK+'" stroke-width="1.4"/><circle cx="56" cy="76" r="12" fill="none" stroke="'+GOLD+'" stroke-width="1.4"/>',
 '<path d="M50 48l2.5 6h6l-5 4 2 6-5.5-3.6-5.5 3.6 2-6-5-4h6z" fill="'+GOLD+'"/><rect x="36" y="70" width="28" height="16" fill="none" stroke="'+INK+'" stroke-width="1.4"/><circle cx="40" cy="92" r="5" fill="none" stroke="'+INK+'" stroke-width="1.3"/><circle cx="60" cy="92" r="5" fill="none" stroke="'+INK+'" stroke-width="1.3"/>',
 '<path d="M38 60c0-6 8-6 12 0s12 6 12 0-8-6-12 0-12 6-12 0z" fill="none" stroke="'+GOLD+'" stroke-width="1.3"/><path d="M50 98c-12-8-14-14-14-18a7 7 0 0 1 14-2a7 7 0 0 1 14 2c0 4-2 10-14 18z" fill="none" stroke="'+INK+'" stroke-width="1.4"/>',
 '<path d="M42 104V60M42 60l16-6" stroke="'+INK+'" stroke-width="1.4" stroke-linecap="round"/><path d="M54 62h10v14H54z" fill="none" stroke="'+INK+'" stroke-width="1.3"/><path d="M59 66l2 4-2 3-2-3z" fill="'+GOLD+'"/>',
 '<circle cx="50" cy="78" r="20" fill="none" stroke="'+INK+'" stroke-width="1.5"/><circle cx="50" cy="78" r="5" fill="none" stroke="'+GOLD+'" stroke-width="1.3"/><path d="M50 58v40M30 78h40M36 64l28 28M64 64l-28 28" stroke="'+INK+'" stroke-width=".9"/>',
 '<path d="M50 52v40M34 62h32M34 62l-6 14h12zM66 62l-6 14h12z" fill="none" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><path d="M42 98h16" stroke="'+GOLD+'" stroke-width="1.6"/>',
 '<path d="M36 52h28M50 52v24M50 76l-10 18h20z" fill="none" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><circle cx="50" cy="84" r="3" fill="'+GOLD+'"/>',
 '<path d="M30 96h40" stroke="'+INK+'" stroke-width="1.4"/><path d="M38 96a12 12 0 0 1 24 0" fill="none" stroke="'+GOLD+'" stroke-width="1.4"/><path d="M50 82V60M50 66c-6-6-10-2-8 2 4 1 6 0 8-2zM50 62c6-6 10-2 8 2-4 1-6 0-8-2z" fill="none" stroke="'+INK+'" stroke-width="1.3"/>',
 '<path d="M36 60h12l-2 14H38zM52 82h12l-2 14H54z" fill="none" stroke="'+INK+'" stroke-width="1.4"/><path d="M46 74c4 2 6 6 10 8" fill="none" stroke="'+GOLD+'" stroke-width="1.5" stroke-dasharray="2 2"/>',
 '<circle cx="40" cy="82" r="7" fill="none" stroke="'+INK+'" stroke-width="1.4"/><circle cx="52" cy="82" r="7" fill="none" stroke="'+INK+'" stroke-width="1.4"/><circle cx="64" cy="82" r="7" fill="none" stroke="'+INK+'" stroke-width="1.4"/><path d="M44 58l6 8 6-8" fill="none" stroke="'+GOLD+'" stroke-width="1.3"/>',
 '<path d="M40 104V62l10-10 10 10v42z" fill="none" stroke="'+INK+'" stroke-width="1.4"/><path d="M62 46l-8 14h6l-6 12" fill="none" stroke="'+GOLD+'" stroke-width="1.6" stroke-linejoin="round"/>',
 '<path d="M50 54l4 14 14 4-14 4-4 14-4-14-14-4 14-4z" fill="'+GOLD+'"/><circle cx="34" cy="96" r="1.6" fill="'+INK+'"/><circle cx="66" cy="94" r="1.6" fill="'+INK+'"/><circle cx="62" cy="54" r="1.2" fill="'+INK+'"/>',
 '<path d="M56 54a14 14 0 1 0 0 26a11 11 0 1 1 0-26z" fill="'+GOLD+'"/><path d="M34 106V88h8v18M58 106V88h8v18" fill="none" stroke="'+INK+'" stroke-width="1.3"/>',
 '<circle cx="50" cy="74" r="12" fill="none" stroke="'+GOLD+'" stroke-width="1.6"/><path d="M50 52v6M50 90v6M28 74h6M66 74h6M35 59l4 4M61 85l4 4M35 89l4-4M61 63l4-4" stroke="'+GOLD+'" stroke-width="1.4" stroke-linecap="round"/>',
 '<path d="M34 70l26-10v20z" fill="none" stroke="'+INK+'" stroke-width="1.4" stroke-linejoin="round"/><path d="M60 64c6 2 6 10 0 12" fill="none" stroke="'+GOLD+'" stroke-width="1.3"/><path d="M38 100c4-6 8-6 12 0s8 6 12 0" fill="none" stroke="'+INK+'" stroke-width="1.3"/>',
 '<ellipse cx="50" cy="78" rx="16" ry="24" fill="none" stroke="'+INK+'" stroke-width="1.5"/><ellipse cx="50" cy="78" rx="16" ry="24" fill="none" stroke="'+GOLD+'" stroke-width="1" stroke-dasharray="1 4"/><circle cx="50" cy="78" r="3" fill="'+GOLD+'"/>'];
function cardSVG(id,rev){
  const c=TAROT_BY[id];if(!c)return "";
  let art;
  if(c.major)art=SIGIL[c.i]||"";
  else if(c.rank<10)art=(PIPS[c.rank+1]||[]).map(([x,y])=>suitMark(c.suit,x,y,c.rank===0?22:10)).join("");
  else art=COURT[c.rank]+suitMark(c.suit,50,110,11);
  const nm=c.major?c.name.replace(/^The /,"THE "):c.name;
  return '<svg class="tcard'+(rev?' rev':'')+'" viewBox="0 0 100 160" aria-hidden="true"><rect x="3" y="3" width="94" height="154" rx="6" fill="none" stroke="'+GOLD+'" stroke-width="1.2"/><rect x="6.5" y="6.5" width="87" height="147" rx="4" fill="none" stroke="'+GOLD+'" stroke-opacity=".45" stroke-width=".6"/>'+
    '<text x="50" y="22" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="9" letter-spacing="1.5" fill="'+GOLD+'">'+esc(c.num)+'</text>'+art+
    '<path d="M14 128h72" stroke="'+GOLD+'" stroke-opacity=".5" stroke-width=".6"/><text x="50" y="142" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="'+(nm.length>16?6.4:nm.length>12?7.4:8.4)+'" font-weight="600" fill="'+INK+'">'+esc(nm.toUpperCase())+'</text></svg>';
}
function cardFace(id){return cardSVG(id,cardRev(id));}
function drawHTML(d){
  const g=d.g,r=guardianDaily(g),c=d.card;
  return '<div class="label" style="color:'+G[g].color+'">'+esc(d.num)+' · '+esc(d.title)+'</div>'+
   (c.major?'<p class="small muted" style="margin-top:4px">'+esc(d.keywords)+'</p>':'<p class="small muted" style="margin-top:4px">'+esc(SUITS[c.suit].name)+' · '+esc(c.el)+'</p>')+
   '<p style="margin-top:10px">'+esc(d.meaning)+'</p>'+
   (d.now?'<p class="cardnow"><span class="label">Right now</span> '+esc(d.now)+'</p>':'')+
   '<div class="cardq"><div class="label">Ask yourself</div><p class="voice" style="margin-top:4px">'+esc(d.question)+'</p></div>'+
   '<p class="small" style="margin-top:10px">'+esc(G[g].name)+', '+esc(G[g].title)+', holds this card.</p>'+
   '<div class="row" style="margin-top:12px;flex-wrap:wrap;gap:8px"><button class="btn btn-main" data-cardask="1">What does this mean for me?</button>'+(r?'<button class="btn btn-ghost" data-begin="'+esc(r.id)+'">'+esc(r.title)+' · '+r.min+' min</button>':'')+'</div>'+
   '<button class="linkish" style="margin-top:10px" data-talk="'+g+'">Talk it through with '+esc(G[g].name)+'</button>';
}
