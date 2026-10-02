(function(){
"use strict";
const HARD_RULE="Rhythm is responsive, not scheduled. The Daily Alchemist knows what part of the day it is, but it never lets the clock, moon, season or cycle override the person's actual life. Unresolved events, emotional state, promises, body context and recent conversations take priority. The rhythm adapts around the person rather than asking the person to adapt to it.";
const PRIORITY_TEXT="PRIORITY ORDER, ALL DAY: 1 safety or an urgent real world concern. 2 an active unresolved situation she already shared. 3 a follow up, promise or outcome Aura said she would remember. 4 significant body or cycle context. 5 her personal patterns and recent Archive history. 6 the normal time of day rhythm. 7 moon, season, weekday, plant ally and other natural correspondences. 8 generic suggestions.";
const PRIORITY_HEAVY_PATTERN="humiliat|embarrass|\\bboss\\b|manager|cowork|co-work|fired|laid off|\\bfight|argu|yell|scream|cried|crying|\\btears\\b|scared|afraid|anxious|panic|angry|furious|\\brage\\b|pissed|\\bhurt|betray|cheat|\\blied\\b|lying|ashamed|shame|guilt|disrespect|unfair|overwhelm|stress|broke up|breakup|break up|divorce|died|funeral|hospital|diagnos|\\bsick\\b|lost my|grief|lonely|ignored|blew up|snapped|walked all over|threw me under|blindsided";

/* ------------------------------------------------------------------
   THE CIRCLE: Aura leads; nine guardians each hold one kind of work.
   Voices come from the original Everyday Alchemist guardian map.
------------------------------------------------------------------ */
const G = {
  aura:{name:"Aura",title:"The Lead Guardian",element:"All elements",color:"#E7C45A",
    domain:"Sees across the whole Archive. Reads your moment and sends you to the guardian who can hold it.",
    voice:"Warm, wise, a little bougie. She speaks for the whole circle.",
    phrases:["Welcome to the work.","You already know.","Let's begin."]},
  onyx:{name:"Onyx",title:"The Shadow Mirror",element:"Shadow",color:"#A597EA",
    domain:"Shadow work, the things you did wrong, guilt, shame, making amends and the old wounds that need confronting.",
    voice:"Short sentences. Uses silence. Will not coddle you, and will not let you drown in it either. No bypassing.",
    phrases:["No more lies.","Tell the truth or sit in it.","Cut it loose.","You knew."]},
  sage:{name:"Sage",title:"The Flame Keeper",element:"Fire",color:"#F0703F",
    domain:"Anger, truth, courage, endings, decisive action, cord-cutting, burning the old map and rebirth.",
    voice:"Fierce and protective. Will light the match for you, then dare you to walk through it.",
    phrases:["Burn it clean.","This is sacred rage.","From the ashes.","Burn the old map.","Brave looks like this."]},
  fern:{name:"Fern",title:"The Flow Priestess",element:"Water",color:"#5CC0B5",
    domain:"Rest, intuition, lunar tides, tears and renewal.",
    voice:"Soft, lyrical, slow. Sounds like water.",
    phrases:["Trust the tides.","Rest is sacred.","Drip. Bloom. Breathe."]},
  lily:{name:"Lily",title:"The Clarity Conduit",element:"Air",color:"#E39BE0",
    domain:"Breath, anxious minds, overthinking and getting clear.",
    voice:"Clean, airy, gentle authority. Breath cues.",
    phrases:["Inhale. Exhale.","Clear channel. Clear mind.","Wipe it clean."]},
  thistle:{name:"Thistle",title:"The Protector of Roots",element:"Earth",color:"#D5935F",
    domain:"Boundaries, people-pleasing, resilience and protecting your peace.",
    voice:"Tough love. Hugs you, then hands you a trowel.",
    phrases:["Root down.","Protect your peace.","Strong isn't cruel."]},
  marigold:{name:"Marigold",title:"The Joy Alchemist",element:"Light",color:"#F4BE3A",
    domain:"Love, romance, worth, beauty, confidence and receiving.",
    voice:"Bright, flirty, loving. Big Leo energy.",
    phrases:["Glow, baby.","You're allowed.","Say it again but sweeter."]},
  juniper:{name:"Juniper",title:"The Keeper of Sacred Space",element:"Wood",color:"#7DC27A",
    domain:"Home, stillness, deep rest, thresholds and fresh starts in a space.",
    voice:"Slow, thoughtful, minimal. Instructions flow like a meditation.",
    phrases:["Clear the room. Clear the air.","Prepare your space.","This is a container."]},
  rue:{name:"Rue",title:"The Boundary Witch",element:"Warding",color:"#C3DB4C",
    domain:"Protection from ill will, jealousy, toxic people and returning what was sent.",
    voice:"Snarky, sharp, protective. A velvet dagger.",
    phrases:["Block. Cut. Banish.","Try me.","This is your edge."]},
  sol:{name:"Sol",title:"The Hype Witch",element:"Sun",color:"#FFD36B",
    domain:"Accountability, follow through, plans, momentum, nerves before big days and keeping your word to yourself.",
    voice:"Bold, warm, electric coach energy. Hypes you up, then holds you to it. Celebrates every win and won't let you off easy.",
    phrases:["Hype you up. Hold you to it.","A wish with a date is a plan.","You didn't come here to play small."]}
};
Object.assign(G,{
  aurora:{name:"Aurora",title:"The First Light",element:"Dawn",color:"#F6A6C1",
    domain:"Awakening, insight and the clarity that comes after a dark night.",
    voice:"Hopeful and luminous. Morning energy.",phrases:["Morning always comes.","See it clearly now.","Begin again."]},
  rowan:{name:"Rowan",title:"The Mover",element:"Earth",color:"#B9CF5E",
    domain:"Movement, exercise, getting back into your body, nerves before big days and keeping momentum.",
    voice:"Warm, steady coach energy. Grounded, never pushy. Gets you moving before you can talk yourself out of it.",phrases:["Move it through.","Your body knows the way back.","Feet first, then feelings."]},
  iris:{name:"Iris",title:"The Cycle Keeper",element:"Rhythm",color:"#E0708E",
    domain:"Menstrual cycles, periods, recurring body rhythms, energy and symptom patterns, perimenopause and menopause.",
    voice:"Observant, body-literate, matter-of-fact and warm. Never dismissive. Never assumes hormones explain a real problem. Context, not dismissal.",phrases:["Your body gets a vote.","Pattern, not prophecy.","Your body keeps a rhythm."]},
  willow:{name:"Willow",title:"The Quiet Healer",element:"Water",color:"#9CC9B8",
    domain:"Grief, forgiveness, emotional release and soft restoration.",
    voice:"Gentle and nurturing. Never rushes you.",phrases:["Bend, don't break.","Let it fall.","You can be soft here."]},
  vesper:{name:"Vesper",title:"The Night Garden",element:"Night",color:"#C98BD9",
    domain:"Desire, pleasure, sex, intimacy and sex magic. For members 21 and older.",
    voice:"Low, unhurried and frank. Warm without blushing. Consent first, shame never.",phrases:["Want is information.","Slow is sexy.","Ask for it by name."]},
  wren:{name:"Wren",title:"The Messenger",element:"Air",color:"#E0B57A",
    domain:"Signs, synchronicities, dreams and decoding symbols.",
    voice:"Whimsical, observant, clever. Asks good questions.",phrases:["Notice that.","It's not a coincidence.","Write it down before it flies."]},
  lumen:{name:"Lumen",title:"The Futurecaster",element:"Starlight",color:"#A9C4FF",
    domain:"Vision, intentions, manifestation and dreamwork.",
    voice:"Visionary and precise. Speaks in futures.",phrases:["See it first.","Name the future.","The dream is data."]},
  onora:{name:"Onora",title:"The Keeper of Names",element:"Ancestry",color:"#E0A99F",
    domain:"Legacy, ancestors, heritage and remembrance.",
    voice:"Reverent and warm. Tells it like a story.",phrases:["Say their names.","You are someone's answered prayer.","Carry it forward."]},
  poppy:{name:"Poppy",title:"The Muse",element:"Color",color:"#FF6F91",
    domain:"Creativity, art, play, making things and getting unstuck on the page.",
    voice:"Playful, messy, delighted. Talks fast when she's excited and makes you want to make something.",phrases:["Make it badly first.","Play is a spell.","Follow the spark."]}
});
/* Ember was folded into Sage. Old Ember entries and chats still render as Sage. */
Object.defineProperty(G,"ember",{value:G.sage,enumerable:false});
const ORDER = ["onyx","sage","fern","lily","thistle","marigold","juniper","rue","sol"];
const EXP = ["aurora","rowan","iris","willow","vesper","wren","lumen","onora","poppy"];
const ALL = ["aura",...ORDER,...EXP];
/* wider-circle guardians borrow practices from their closest kin */
const KIN = {aurora:"aura",rowan:"lily",iris:"fern",willow:"fern",vesper:"marigold",wren:"lily",lumen:"sol",onora:"thistle",poppy:"marigold"};

/* Glyphs: alchemical marks, one per guardian */
function glyph(k, size){
  const c = (G[k]||G.aura).color;
  const s = 'fill="none" stroke="'+c+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
  const ring = '<circle cx="32" cy="32" r="29" fill="rgba(22,19,42,.55)" stroke="'+c+'" stroke-opacity=".55" stroke-width="1.2"/><circle cx="32" cy="32" r="25.5" fill="none" stroke="'+c+'" stroke-opacity=".3" stroke-width=".8"/>';
  const m = {
    aura:'<path '+s+' d="M32 12l3.6 12.8L48 28.5l-12.4 3.7L32 45l-3.6-12.8L16 28.5l12.4-3.7z"/><circle cx="32" cy="29" r="3" fill="'+c+'"/><path '+s+' d="M22 50h20"/>',
    onyx:'<path '+s+' d="M38 16a16 16 0 1 0 0 32a12.5 12.5 0 1 1 0-32z"/><circle cx="41" cy="24" r="1.6" fill="'+c+'"/>',
    sage:'<path '+s+' d="M32 15L48 45H16z"/><path '+s+' d="M32 27c3 4 4 7 0 11c-4-4-3-7 0-11z"/>',
    fern:'<path '+s+' d="M16 19h32L32 47z"/><path '+s+' d="M24 29c3-2 5-2 8 0s5 2 8 0"/>',
    lily:'<path '+s+' d="M32 15L48 45H16z"/><path '+s+' d="M19 34h26"/>',
    thistle:'<path '+s+' d="M16 19h32L32 47z"/><path '+s+' d="M20 28h24"/>',
    marigold:'<circle '+s+' cx="32" cy="32" r="11"/><circle cx="32" cy="32" r="2.6" fill="'+c+'"/><path '+s+' d="M32 13v4M32 47v4M13 32h4M47 32h4M18.6 18.6l2.8 2.8M42.6 42.6l2.8 2.8M18.6 45.4l2.8-2.8M42.6 21.4l2.8-2.8"/>',
    juniper:'<path '+s+' d="M32 13L48 25l-6 20H22l-6-20z"/><path '+s+' d="M32 21v18M26 29l6-4 6 4"/>',
    rue:'<path '+s+' d="M14 32c6-9 30-9 36 0c-6 9-30 9-36 0z"/><circle '+s+' cx="32" cy="32" r="5"/><path '+s+' d="M20 20l24 24"/>',
    aurora:'<path '+s+' d="M15 42h34M21 42a11 11 0 0 1 22 0M32 20v7M22 25l3 5M42 25l-3 5M16 48h32"/>',
    rowan:'<path '+s+' d="M32 50V26M32 34l-9-8M32 30l9-8M32 42l-7-5M32 40l7-5M14 46c4-3 8-3 12 0M38 46c4-3 8-3 12 0"/><circle cx="23" cy="24" r="2.4" fill="'+c+'"/><circle cx="41" cy="20" r="2.4" fill="'+c+'"/><circle cx="32" cy="18" r="2.4" fill="'+c+'"/>',
    iris:'<circle '+s+' cx="32" cy="32" r="15" stroke-dasharray="3 4" stroke-opacity=".7"/><path '+s+' d="M13 33h8l3-7l5 14l4-11l3 6h15"/>',
    willow:'<path '+s+' d="M32 14v34M32 18c-8 4-12 12-12 22M32 18c8 4 12 12 12 22M32 24c-4 4-6 10-6 16M32 24c4 4 6 10 6 16"/>',
    vesper:'<path '+s+' d="M30 16a16 16 0 1 1 0 32a12.5 12.5 0 1 0 0-32z"/><path '+s+' d="M21 26l1.8 4.2L27 32l-4.2 1.8L21 38l-1.8-4.2L15 32l4.2-1.8z"/>',
    wren:'<path '+s+' d="M15 38c8-1 12-13 23-13c6 0 9 3 10 7l-6 2c0 8-8 12-16 12c-5 0-9-3-11-8z"/><circle cx="42" cy="30" r="1.6" fill="'+c+'"/>',
    lumen:'<circle '+s+' cx="32" cy="32" r="16" stroke-dasharray="2 5"/><path '+s+' d="M32 20l2.5 9.5L44 32l-9.5 2.5L32 44l-2.5-9.5L20 32l9.5-2.5z"/>',
    onora:'<path '+s+' d="M32 14v34M32 22l-8-6M32 22l8-6M32 30l-10-5M32 30l10-5M32 48l-9 4M32 48l9 4M32 48v5"/>',
    poppy:'<circle '+s+' cx="32" cy="30" r="5"/><path '+s+' d="M32 25c-3-8-12-8-12 0c-8 0-8 9 0 10c0 8 9 8 12 0c3 8 12 8 12 0c8-1 8-10 0-10c0-8-9-8-12 0M32 36v14M32 44c4-3 8-3 10-1"/>',
    sol:'<circle '+s+' cx="32" cy="32" r="8"/><path '+s+' d="M32 12v8M32 44v8M12 32h8M44 32h8M20 20l4 4M40 40l4 4M20 44l4-4M40 24l4-4"/>'
  };
  return '<svg viewBox="0 0 64 64" aria-hidden="true"'+(size?' width="'+size+'" height="'+size+'"':'')+'>'+ring+(m[k]||m.aura)+'</svg>';
}
function guardianMark(k,size,label){const g=G[k]||G.aura;return '<button class="gmark'+(label?' labeled':'')+'" data-guardian="'+esc(k)+'" aria-label="Open '+esc(g.name)+'">'+glyph(k,size)+(label?'<span class="gmarkname">'+esc(g.name)+'</span>':'')+'</button>';}


/* ------------------------------------------------------------------
   RITUALS. Real steps, household materials, built-in substitutions.
   needs: tags checked against what she has. flame/bath: adapted.
------------------------------------------------------------------ */
const R = [
/* The 7-Day Energy Reset: seven days, seven voices of the circle */
{id:"whisper-sweep",g:"lily",reset:1,title:"The Whisper Sweep",el:"Air",moon:"Waning",min:10,
 purpose:"Disperse the residue of thought loops, arguments and old narratives.",
 needs:[["broom","A broom, a branch, or your open hand"]],
 steps:[
  {t:"Open the way",d:"Open a door or a window. Air needs somewhere to go."},
  {t:"Whisper",d:"Hold the broom close. Whisper into the bristles what you are removing. Overthinking. Fear of being seen. The old story. Name each one."},
  {t:"Sweep",d:"Sweep counterclockwise, moving toward the exit. No broom? Sweep the air with your open hand, the same direction, the same intent.",hold:60},
  {t:"Blow it out",d:"At the threshold, blow out once, hard.",say:"I return what is not mine. I dissolve what no longer serves."},
  {t:"Close",d:"Close the door. Stand still for three breaths before you do anything else."}],
 secret:"Air carries what is spoken low. This is not cleaning. This is dispersal.",
 prompts:["What did you whisper into the broom?","Which one was hardest to say out loud?"],
 tags:["overthinking","anxious","loop","stuck","heavy","reset"]},
{id:"salt-vein",g:"fern",reset:2,title:"Salt Vein Dissolve",el:"Water",moon:"Last Quarter",min:8,
 purpose:"Cut the cords and emotional drains you cannot see.",
 needs:[["salt","A spoonful of salt"],["bowl","A glass or bowl of warm water"]],
 steps:[
  {t:"Prepare the water",d:"Fill a glass or bowl with warm water. Add a spoonful of salt."},
  {t:"Stir",d:"Stir clockwise with your index finger while you speak softly.",say:"What flows to me returns cleansed. What clings, dissolves.",hold:45},
  {t:"Offer a signature",d:"Drop in a strand of your hair, or a pinch of any herb from your kitchen that you touched first."},
  {t:"Let it sit",d:"Leave it under moonlight, or near a window overnight."},
  {t:"Release",d:"In the morning, pour it down the drain. Do not look back at it."}],
 secret:"Hair and salt are both body signatures. You are sending out a coded severance.",
 prompts:["Who or what have you been leaking energy to?","What did you feel when you poured it out?"],
 tags:["drained","cord","ex","tired","cling","attached","reset"]},
{id:"wick-binding",g:"sage",reset:3,title:"Wick Binding",el:"Fire",moon:"Waxing Crescent",min:12,flame:true,
 purpose:"Gather your scattered will back into one thread.",
 needs:[["candle","A candle or tea light"],["thread","Cotton thread or string"]],
 steps:[
  {t:"Mark the candle",d:"Carve your initials into the candle with a pin or toothpick. With a tea light, write them on a paper wrap.",
   alt:{noFlame:"Write your initials on a small stone or on paper wrapped around a stone."}},
  {t:"Bind",d:"Tie a cotton thread around the base. Knot it three times."},
  {t:"Light and speak",d:"Light it. While it burns, speak.",say:"Let every fragmented flame return. Let my will be gathered. Let my work begin.",
   alt:{noFlame:"Set the stone in direct sunlight or under your brightest lamp. Hold your palms over it and speak."},hold:120},
  {t:"Snuff halfway",d:"Snuff it when it is about halfway down. Never leave a flame alone.",
   alt:{noFlame:"After two minutes, take the stone out of the light."}},
  {t:"Carry it",d:"Carry the stub or the stone with you for the rest of the week. It is your power token."}],
 secret:"This is fragment binding. Sympathetic flame and thread magic.",
 prompts:["Where has your energy been scattered?","What is the one thing you are gathering it back for?"],
 tags:["scattered","power","motivation","will","courage","reset"]},
{id:"rootprint",g:"thistle",reset:4,title:"Rootprint Activation",el:"Earth",moon:"First Quarter",min:7,
 purpose:"Reconnect with ancestral protection and your own body.",
 needs:[],
 steps:[
  {t:"Bare feet",d:"Go barefoot, on dirt if you can, on the floor if you can't."},
  {t:"Remember",d:"Hands on your thighs. Close your eyes. Whisper the names of the women and guardians, known or unknown, who walked before you.",hold:60},
  {t:"Stomp",d:"Stand. Stomp one foot three times.",say:"I stand in what I am. I carry what I choose."},
  {t:"Press down",d:"Press your palms to the earth or the floor and hold.",hold:30}],
 secret:"Footprints are signatures. You are tracing your lineage and claiming your space.",
 prompts:["Whose names came to you?","What are you choosing to carry, and what are you setting down?"],
 tags:["ungrounded","floaty","ancestors","body","anxious","reset"]},
{id:"obscured-mirror",g:"onyx",reset:5,title:"Obscured Mirror Water",el:"Moon",moon:"Waxing Gibbous",min:15,
 purpose:"Reach lunar intuition by blurring the ego's reflection.",
 needs:[["bowl","A dark bowl of water"],["milk","A drop of milk or ink"]],
 steps:[
  {t:"Cloud the water",d:"Pour water into a dark bowl. Add a single drop of milk or ink."},
  {t:"Soft gaze",d:"By low light, gaze into it. Do not focus. Let the surface move.",hold:120},
  {t:"Ask",d:"Ask out loud.",say:"What do I need to see that I have refused?"},
  {t:"Record",d:"Write down every image or impression, even the ones that make no sense yet."},
  {t:"Seal",d:"Fold the page closed and put it somewhere dark. You will read it again later."}],
 secret:"The clouded surface distorts your reflection so you get past the ego. This thins the veil.",
 prompts:["What did you see?","What have you been refusing to look at?"],
 tags:["intuition","confused","truth","denial","shadow","reset"]},
{id:"bone-bath",g:"juniper",reset:6,title:"Bone Bath",el:"Water and Earth",moon:"Waning Gibbous",min:20,bath:true,
 purpose:"Draw exhaustion out of the body, especially burnout and swallowed feeling.",
 needs:[["salt","Salt"],["vinegar","A splash of vinegar"],["eggs","Crushed eggshell, or rosemary"]],
 steps:[
  {t:"Draw the water",d:"Run a warm bath. Add a handful of salt, a splash of vinegar and crushed eggshell or rosemary.",
   alt:{noBath:"Fill a basin or pot for a foot soak. Add a pinch of salt, a splash of vinegar and crushed eggshell or rosemary."}},
  {t:"Speak before you enter",d:"Stand at the edge.",say:"What has calcified, I soften. What I carried, I now shed."},
  {t:"Soak in silence",d:"No phone. No music. Let the water do the talking.",hold:600},
  {t:"Pour it away",d:"When you are done, pour the water onto soil or let it drain with finality. Rinse off in clean water."}],
 secret:"Eggshell and vinegar speak to what is stored in bone. This cleanses the root of fatigue, not just the muscles.",
 prompts:["Where in your body were you holding it?","What softened?"],
 tags:["exhausted","burnout","body","tired","heavy","reset"]},
{id:"circle-sealing",g:"aura",reset:7,title:"Circle of Sealing",el:"All elements",moon:"Dark Moon",min:12,flame:true,
 purpose:"Close the portal. Contain what you gathered this week.",
 needs:[["candle","A candle, or any light"],["bowl","A glass of water"],["salt","A stone or pinch of salt"]],
 steps:[
  {t:"Place the elements",d:"In four corners of a small space, place one token each. Air: a feather, incense or a bell. Fire: a candle. Water: a glass. Earth: a stone or salt.",
   alt:{noFlame:"Use a lamp or a phone flashlight for Fire."}},
  {t:"Stand in the center",d:"Stand in the middle of what you built.",say:"I return to myself. Sealed. Witnessed. Whole."},
  {t:"Clap once",d:"Clap your hands once, sharply. Put out the light."},
  {t:"Sit",d:"Sit in silence. You are done.",hold:120}],
 secret:"A personal circle casting. The four directions hold it, and sound seals it.",
 prompts:["What did this week change?","What will you keep doing?"],
 tags:["closure","complete","whole","reset"]},

/* The library. Aura reaches in here so you never have to browse. */
{id:"burned-word",g:"sage",title:"The Burned Word",el:"Fire",moon:"Waning",min:8,flame:true,
 purpose:"Discharge anger that keeps replaying.",
 needs:[["candle","A lighter or candle and a fireproof bowl"]],
 steps:[
  {t:"Write it raw",d:"Write it all down. Every name. Every word you swallowed. Do not edit, do not be fair."},
  {t:"Read it once",d:"Read it out loud, once, at full volume if you can."},
  {t:"Burn it",d:"Over the bowl, light a corner and let it burn down completely.",
   alt:{noFlame:"Tear it into the smallest pieces you can and drown them in a bowl of water."}},
  {t:"Claim the fire",d:"Watch it go.",say:"This fire is mine. What it burns does not come back."},
  {t:"Cold water",d:"Wash your hands in cold water. Done means done."}],
 secret:"Anger is fuel, not a home. You are converting it, not suppressing it.",
 prompts:["What did you say that you have never said before?","How does your body feel now?"],
 tags:["angry","pissed","rage","mad","furious","betrayed","resent","unfair"]},
{id:"unsent-letter",g:"onyx",title:"The Unsent Letter",el:"Shadow",moon:"Waning Crescent",min:15,
 purpose:"Tell the truth you keep swallowing, without having to send it.",
 needs:[],
 steps:[
  {t:"Choose who",d:"Write to the person, or the old version of you, who never got the truth."},
  {t:"Write the line you keep deleting",d:"There is one sentence you keep editing out. Write that one first."},
  {t:"Underline",d:"Read it back. Underline the line that hurts."},
  {t:"Fold away",d:"Fold the page away from you three times.",say:"I told the truth. I don't have to send it for it to be true."},
  {t:"Put it in the dark",d:"Keep it somewhere dark for one full moon cycle. Then decide."}],
 secret:"Shame lives in what stays unsaid. Writing it moves it from inside you to outside you.",
 prompts:["What was the line you kept deleting?","What changes if you stop protecting them from it?"],
 tags:["shame","guilt","truth","secret","grief","regret","hiding","ex","closure"]},
{id:"tidewater-rest",g:"fern",title:"Tidewater Rest",el:"Water",moon:"Any",min:12,
 purpose:"Permission to stop.",
 needs:[["bowl","A bowl of warm water"]],
 steps:[
  {t:"Warm water",d:"Fill a bowl with warm water. Rest both hands in it."},
  {t:"Breathe with it",d:"Ten slow breaths. Feel the water hold your hands.",hold:60},
  {t:"Permission",d:"Say it out loud, even if it feels untrue.",say:"I am allowed to stop."},
  {t:"Lie down",d:"Lie down with your eyes closed. Nothing to fix for five minutes.",hold:300},
  {t:"Return it",d:"Pour the water onto a plant or down the drain."}],
 secret:"Water carries what you cannot. Rest is not a reward. It is the ritual.",
 prompts:["What were you trying to hold up alone?","What can wait until tomorrow?"],
 tags:["tired","exhausted","overwhelmed","sad","cry","rest","sleep","drained","burnout","depleted"]},
{id:"four-count",g:"lily",title:"Four-Count Clearing",el:"Air",moon:"Any",min:5,
 purpose:"Quiet a racing mind fast.",
 needs:[],
 steps:[
  {t:"Open a window",d:"Open a window or step outside. Fresh air in."},
  {t:"Box breath",d:"In for four. Hold for four. Out for four. Hold for four. Four rounds.",hold:64},
  {t:"Wipe it clean",d:"Wipe a mirror or a window with a little water.",say:"Clear channel. Clear mind."},
  {t:"Name the next thing",d:"Say out loud the one thing that actually matters next. Only one."}],
 secret:"Breath is the only part of your nervous system you can steer by hand.",
 prompts:["What was the loudest thought?","What is the one next thing?"],
 tags:["anxious","anxiety","panic","overthinking","scattered","racing","nervous","foggy","worried","stress"]},
{id:"salt-line",g:"thistle",title:"The Salt Line",el:"Earth",moon:"Waning",min:7,
 purpose:"Draw a boundary you can see.",
 needs:[["salt","Salt"]],
 steps:[
  {t:"Stand at the door",d:"Go to your front door or the door of your room."},
  {t:"Name it",d:"Say out loud who or what is no longer allowed in. Be specific. This does not make you mean."},
  {t:"Draw the line",d:"Pour a thin line of salt along the threshold or windowsill. No salt? Trace the line with a wet finger."},
  {t:"Claim it",d:"Step back inside the line.",say:"This is my edge. What comes in, I invite."},
  {t:"Morning",d:"Leave it overnight. In the morning, sweep it out the door."}],
 secret:"Salt has marked edges for as long as people have had doors.",
 prompts:["Who did you name?","What will you say the next time they push?"],
 tags:["boundaries","boundary","people pleasing","family","say no","used","taken advantage","draining","protect"]},
{id:"mirror-honey",g:"marigold",title:"Mirror Honey",el:"Light",moon:"Waxing",min:6,
 purpose:"Speak to yourself the way you speak to the people you love.",
 needs:[["mirror","A mirror"],["honey","A little honey or sugar"]],
 steps:[
  {t:"Good light",d:"Stand at a mirror in the best light in your home."},
  {t:"Sweeten",d:"Touch a little honey to your lips."},
  {t:"Three truths",d:"Look yourself in the eye and say three things that are true about you. Then say them again, sweeter."},
  {t:"Claim it",d:"Hold your own gaze.",say:"I am worth the attention I give everyone else."},
  {t:"Wear the gold",d:"Put on one thing that makes you feel like gold. Earrings, lipstick, the good robe."}],
 secret:"Honey binds sweetness to whatever it touches. Here it touches your own words.",
 prompts:["Which truth was hardest to say?","What would you do today if you believed it?"],
 tags:["insecure","ugly","worth","confidence","unworthy","compare","self love","love myself","joy","money","abundance"]},
{id:"threshold-reset",g:"juniper",title:"Threshold Reset",el:"Wood",moon:"Any",min:15,
 purpose:"Clear a space that feels heavy or stale.",
 needs:[["rosemary","Rosemary, citrus peel or any fragrant herb"]],
 steps:[
  {t:"One surface",d:"Clear one surface completely. Just one."},
  {t:"Wipe with salt water",d:"Wipe it down with water and a pinch of salt."},
  {t:"Scent the air",d:"Simmer rosemary or citrus peel in a small pot. No stove handy? Pour hot water over them in a mug and let it steam."},
  {t:"Open and walk",d:"Open doors and windows. Walk the room clockwise.",say:"Clear the room. Clear the air.",hold:90},
  {t:"Place one thing",d:"Set one meaningful object back on the clean surface. On purpose."}],
 secret:"A space holds what happens in it. You are resetting the container.",
 prompts:["What did the space feel like before?","What do you want this room to hold now?"],
 tags:["house","home","room","space","clutter","stale","moved","move","new place","heavy energy","cleanse"]},
{id:"jar-returning",g:"rue",title:"Jar of Returning",el:"Warding",moon:"Waning",min:10,
 purpose:"Protection from someone's ill will, and sending it back where it came from.",
 needs:[["jar","A small jar with a lid"],["salt","Salt"],["pepper","Black pepper"]],
 steps:[
  {t:"Write the order",d:"On a small piece of paper, write: Returned to sender. No harm, no hold."},
  {t:"Fold away",d:"Fold it away from you twice."},
  {t:"Layer",d:"Salt first, then the paper, then pepper, then rosemary if you have it."},
  {t:"Seal and shake",d:"Close it tight and shake it hard.",say:"Block. Cut. Banish. Not in my house."},
  {t:"Place it",d:"Keep it by the front door or in a dark cupboard. Try me."}],
 secret:"A witch bottle is one of the oldest wards there is. Nothing about this is new. That's why it works.",
 prompts:["Whose energy are you returning?","How will you know it worked?"],
 tags:["jealous","jealousy","envy","enemy","against me","toxic","evil eye","hate","protection","gossip","hater"]},
{id:"ledger",g:"sol",title:"The Ledger of Intention",el:"Metal",moon:"New",min:10,
 purpose:"Turn a wish into three moves.",
 needs:[],
 steps:[
  {t:"Three intentions",d:"Write three intentions for this cycle. Plain words."},
  {t:"One move each",d:"Under each, write one action you could do in fifteen minutes."},
  {t:"Put it in the plan",d:"Put all three actions on your calendar right now. Dates and times."},
  {t:"Sign it",d:"Sign and date the page.",say:"Discipline is devotion."},
  {t:"Carry it",d:"Fold it and keep it with your keys or wallet until the next new moon."}],
 secret:"An intention without a time is a wish. A time turns it into a spell.",
 prompts:["Which intention scares you a little?","What is the first fifteen-minute move?"],
 tags:["stuck","procrastinate","plan","goals","focus","start","new beginning","discipline","job","career","motivation","lost"]},
{id:"seed-intention",g:"sol",title:"New Moon Seed",el:"Earth",moon:"New",min:10,
 purpose:"Plant one intention in something that actually grows.",
 needs:[["soil","A seed or dried bean and a cup of soil or damp paper towel"]],
 steps:[
  {t:"Hold the seed",d:"Hold a seed or a dried bean in your palm. Warm it."},
  {t:"Speak into it",d:"Say your intention into your closed hand, once, clearly."},
  {t:"Plant",d:"Press it into a cup of soil, or fold it into a damp paper towel in a jar."},
  {t:"Seal the promise",d:"Water it.",say:"I plant it. I tend it. I trust the dark to do its work."},
  {t:"Tend",d:"Water it every day. Every time you do, you are tending the intention."}],
 secret:"New moons are dark on purpose. Everything that grows starts where you can't see it.",
 prompts:["What did you plant?","What will tending it look like this week?"],
 tags:["new beginning","start","fresh start","hope","new","intention","beginning"]},
{id:"full-moon-release",g:"fern",title:"Full Moon Release Bowl",el:"Water",moon:"Full",min:15,
 purpose:"Let go of what you've outgrown while the light is strongest.",
 needs:[["bowl","A bowl of water"]],
 steps:[
  {t:"Write what is leaving",d:"On paper, write what is ready to leave you. A habit, a fear, a person's hold."},
  {t:"Moonlight",d:"Set a bowl of water where the moon can reach it, or at a window."},
  {t:"Tear and drop",d:"Tear the paper and drop the pieces in the water.",say:"I release what I have outgrown."},
  {t:"Sit with it",d:"Sit beside the bowl for a few minutes. Watch the ink soften.",hold:180},
  {t:"Pour it out",d:"In the morning, pour it onto soil or down the drain."}],
 secret:"The full moon pulls tides. You are letting her pull this too.",
 prompts:["What did you release?","What is making room for?"],
 tags:["let go","release","move on","breakup","outgrown","done","grief"]},
{id:"gilded-shower",g:"marigold",title:"The Gilded Shower",el:"Light",moon:"Any",min:20,bath:true,
 purpose:"Luxury as medicine.",
 needs:[["oil","Body oil, lotion or anything that smells like a treat"]],
 steps:[
  {t:"Set the scene",d:"Dim the lights. Something that smells good. The good towel, not the old one."},
  {t:"Wash it off",d:"In the water, name what you're washing off today, part by part.",
   alt:{noBath:"Use a warm washcloth at the sink. Neck, wrists, face, feet."},hold:300},
  {t:"Anoint",d:"Oil or lotion, slowly, on purpose, like you're worth the time.",say:"You're allowed."},
  {t:"Get dressed for you",d:"Put on something that makes you feel like the main character. Nobody has to see it."}],
 secret:"Pleasure is a frequency. You are tuning to it on purpose.",
 prompts:["What did you wash off?","When did you last treat yourself like this?"],
 tags:["ugly","worth","tired","treat","pamper","joy","confidence","self love","breakup"]},
{id:"anchor",g:"aura",title:"The Five-Minute Anchor",el:"All elements",moon:"Any",min:5,
 purpose:"When you don't know what you need yet.",
 needs:[],
 steps:[
  {t:"Hand on heart",d:"Put one hand on your chest. Feel it rise."},
  {t:"Name where you are",d:"Say it out loud: the day, where you are, and what you're carrying. No fixing, just naming."},
  {t:"Touch an element",d:"Touch one element. Water from the tap. Light from a window. A plant. The floor.",hold:30},
  {t:"Speak",d:"Breathe once, slowly.",say:"I am here. I can do the next small thing."},
  {t:"Choose",d:"Choose the next small thing. Do only that."}],
 secret:"You don't have to know what's wrong to come back to yourself.",
 prompts:["What are you actually carrying?","What is the next small thing?"],
 tags:["off","dont know","numb","weird","blah","lost","idk"]}
];
/* ------------------------------------------------------------------
   MORE RITUALS. Every guardian now holds at least three.
   member:true = part of that guardian's Chamber (The Inner Circle).
------------------------------------------------------------------ */
R.push(
/* AURORA · Dawn */
{id:"first-light",g:"aurora",title:"First Light Window",el:"Dawn",moon:"Any",min:5,
 purpose:"Start the day on purpose instead of on your phone.",needs:[],
 steps:[
  {t:"Before the screen",d:"Before you touch your phone, go to the nearest window."},
  {t:"Let it hit your face",d:"Open the curtain. Let the light land on your face with your eyes closed.",hold:60},
  {t:"One word",d:"Say one word for how you want today to feel. Only one."},
  {t:"Claim it",d:"Open your eyes.",say:"I begin again. The light doesn't ask if I'm ready."}],
 secret:"Morning light sets your body's clock. You are syncing to the sun on purpose.",
 prompts:["What word did you choose?","What would today look like if it matched that word?"],
 tags:["morning","start","fresh start","hope","new","awake","clarity"]},
{id:"dawn-question",g:"aurora",member:true,title:"The Dawn Question",el:"Dawn",moon:"Waxing",min:10,
 purpose:"Ask for clarity the night before and catch the answer at sunrise.",needs:[],
 steps:[
  {t:"Night: write the question",d:"Before bed, write one question you need clarity on. Fold it and put it under your pillow."},
  {t:"Night: release it",d:"Hold the folded paper for a moment.",say:"I'll know by morning."},
  {t:"Morning: don't move yet",d:"When you wake, stay still. Don't reach for anything.",hold:60},
  {t:"Catch it",d:"Write the first three things in your head, before you judge them. That is the answer's first draft."}],
 secret:"The edge of sleep is the thinnest veil you cross every day.",
 prompts:["What was the question?","What came first when you woke?"],
 tags:["confused","decision","clarity","choose","answer","insight"]},
{id:"morning-oath",g:"aurora",member:true,title:"The Morning Page Oath",el:"Dawn",moon:"Any",min:15,
 purpose:"Empty the mind so the day can come in clean.",needs:[],
 steps:[
  {t:"Three pages, no stopping",d:"Write without stopping until you fill three pages or fifteen minutes pass. Complaints count. Nonsense counts.",hold:600},
  {t:"Circle one line",d:"Read back. Circle the one line that sounds like the truth."},
  {t:"Speak the oath",d:"Put your hand on the page.",say:"I emptied the night. I carry only what I circled."},
  {t:"Close it",d:"Close the notebook. Do not reread the rest today."}],
 secret:"Your mind drains overnight into the morning. Writing catches it before it pools.",
 prompts:["What was the circled line?","What surprised you?"],
 tags:["overthinking","foggy","morning","clarity","scattered"]},

/* SOL · Sun */
{id:"sun-hype",g:"rowan",title:"The Sun Salute Hype",el:"Sun",moon:"Waxing",min:5,
 purpose:"Get your energy up fast before the thing you're nervous about.",needs:[],
 steps:[
  {t:"Arms up",d:"Stand. Arms straight up, like you just won. Hold it.",hold:30},
  {t:"Three reasons",d:"Out loud, three reasons you are going to be great at this. Loud. Louder than feels normal."},
  {t:"Shake it out",d:"Shake your hands, your shoulders, your whole body for twenty seconds.",hold:20},
  {t:"Go",d:"Point at the door.",say:"Let it shine. I didn't come here to play small."}],
 secret:"Posture talks to your nervous system first. Your body believes you before your mind does.",
 prompts:["What were you hyping yourself up for?","How did it go?"],
 tags:["nervous","interview","confidence","motivation","energy","date","presentation"]},
{id:"solar-charge",g:"sol",member:true,title:"Solar Plexus Charge",el:"Sun",moon:"Full",min:8,
 purpose:"Recharge your personal power when you feel small.",needs:[["oil","A drop of body oil or lotion (optional)"]],
 steps:[
  {t:"Find the sun spot",d:"Place your palm just above your belly button, below your ribs. That's your power center."},
  {t:"Warm it",d:"Rub your palms together until hot. Place them back there.",hold:30},
  {t:"Breathe gold",d:"Breathe in and picture warm gold light pooling under your hands. Ten breaths.",hold:60},
  {t:"Speak",d:"Press gently.",say:"Energy. Intention. Action. This is mine."}],
 secret:"Warmth plus focused breath in one spot pulls your attention back into your own body.",
 prompts:["Where have you been giving your power away?","What will you do with it back?"],
 tags:["small","powerless","weak","confidence","power","insecure"]},
{id:"victory-jar",g:"sol",member:true,title:"The Victory Jar",el:"Sun",moon:"Any",min:10,
 purpose:"Build proof that you win, one note at a time.",needs:[["jar","A jar"]],
 steps:[
  {t:"Name the jar",d:"Write VICTORIES on a label or paper and put it on the jar."},
  {t:"First five",d:"On small slips, write five things you did this year that you're proud of. Big or small."},
  {t:"Drop them in",d:"Read each one out loud as you drop it in.",say:"That was me. I did that."},
  {t:"Keep feeding it",d:"Put it where you'll see it. Every win this month gets a slip."}],
 secret:"Your brain keeps receipts for failure automatically. This keeps receipts for the rest.",
 prompts:["Which win had you forgotten?","What goes in the jar next?"],
 tags:["unworthy","failure","doubt","confidence","celebrate","proud"]},

/* EMBER · Courage */
{id:"courage-coal",g:"sage",title:"The Courage Coal",el:"Fire",moon:"First Quarter",min:7,
 purpose:"For the moment before the hard conversation or the big leap.",needs:[["candle","A candle, or any warm light"]],
 steps:[
  {t:"Light it",d:"Light a candle, or turn on the warmest lamp you have. Sit close."},
  {t:"Name the fear",d:"Say out loud exactly what you're afraid will happen."},
  {t:"Name the cost",d:"Now say what it costs you if you don't do it. Be honest."},
  {t:"Take the coal",d:"Cup your hands near the light, then close them around the warmth.",say:"I carry the fire. I go anyway."},
  {t:"Act within the hour",d:"Do the first piece of the scary thing within the hour. Send the text. Make the call."}],
 secret:"Courage is not the absence of fear. It's fear with a deadline.",
 prompts:["What were you afraid of?","What did you do within the hour?"],
 tags:["scared","afraid","fear","courage","leap","quit","confront","hard conversation"]},
{id:"last-straw",g:"sage",member:true,title:"The Last Straw Ceremony",el:"Fire",moon:"Waning",min:12,
 purpose:"Officially end something you have tolerated too long.",needs:[["thread","A piece of string or thread"]],
 steps:[
  {t:"Tie the knot",d:"Tie a knot in a piece of string for each time you said 'this is the last time' and it wasn't."},
  {t:"Hold the count",d:"Look at how many knots there are. Let yourself feel it."},
  {t:"Cut it",d:"Cut the string right through the middle with scissors.",say:"That was the last straw. This is the last time, and I mean it."},
  {t:"Throw it out",d:"Throw both halves in the outside trash, not the one in your home."},
  {t:"One changed behavior",d:"Write down the one thing you will do differently next time it happens."}],
 secret:"Knots hold repeated promises. Cutting them makes the ending physical.",
 prompts:["What are you done tolerating?","What will you do next time?"],
 tags:["done","enough","fed up","quit","end","toxic","leave"]},
{id:"phoenix-shower",g:"sage",member:true,title:"The Phoenix Shower",el:"Fire and Water",moon:"New",min:12,bath:true,
 purpose:"Burn off the old version of you and step out new.",needs:[["salt","A handful of salt"]],
 steps:[
  {t:"Hot first",d:"Start the shower as hot as is comfortable. Scrub your arms and legs with a little salt.",hold:120},
  {t:"Name the old self",d:"Say out loud who you were that you are done being."},
  {t:"Cool rinse",d:"Turn it cooler for the last thirty seconds.",hold:30,say:"I rise out of what I was."},
  {t:"New clothes",d:"Put on something clean you haven't worn in a while, like it belongs to the new you."}],
 secret:"Heat opens, cold seals. You are closing the door on the old self with your skin.",
 prompts:["Who were you done being?","Who stepped out?"],
 tags:["reinvent","change","new me","rebirth","breakup","transformation"]},

/* WILLOW · Grief */
{id:"grief-bowl",g:"willow",title:"The Willow Water Bowl",el:"Water",moon:"Waning",min:10,
 purpose:"Give grief somewhere to go.",needs:[["bowl","A bowl of water"]],
 steps:[
  {t:"Fill the bowl",d:"Fill a bowl with water. Set it in front of you."},
  {t:"Speak to what you lost",d:"Say their name, or the name of what ended. Then say what you miss. Take your time.",hold:120},
  {t:"Let it fall",d:"If tears come, let them. If not, drip water from your fingers into the bowl, one drop for each thing you miss."},
  {t:"Hold it",d:"Hold the bowl in both hands.",say:"You can be soft here. Love doesn't leave. It changes shape."},
  {t:"Give it to the earth",d:"Pour it into soil or a plant. Grief feeds something."}],
 secret:"Willows grow best near water. So does grief that is allowed to move.",
 prompts:["What do you miss most?","What would they want you to know?"],
 tags:["grief","grieving","loss","died","death","miss","mourning","sad","dog","cat","pet"]},
{id:"forgiveness-knot",g:"willow",member:true,title:"The Forgiveness Knot",el:"Water",moon:"Waning Crescent",min:10,
 purpose:"Loosen a grudge that is hurting you more than them.",needs:[["thread","A piece of thread or string"]],
 steps:[
  {t:"Tie it tight",d:"Tie a tight knot in the thread. Name who or what it holds."},
  {t:"Tell the truth first",d:"Say what they did and how it hurt. Forgiveness never skips this part."},
  {t:"Loosen, don't cut",d:"Slowly work the knot loose with your fingers. Take as long as it takes."},
  {t:"Speak",d:"Hold the loose thread.",say:"I'm not saying it was okay. I'm saying I'm done carrying it."},
  {t:"Keep or bury",d:"Keep the thread as a reminder, or bury it."}],
 secret:"Forgiveness is untying, not erasing. The thread remembers, it just stops pulling.",
 prompts:["Who is the knot for?","What part still pulls?"],
 tags:["forgive","grudge","resent","hurt","betrayed","family","mother","father"]},
{id:"empty-chair",g:"willow",member:true,title:"The Empty Chair",el:"Water",moon:"Any",min:20,
 purpose:"Say what you never got to say.",needs:[],
 steps:[
  {t:"Set the chair",d:"Place an empty chair across from you. Picture them sitting in it."},
  {t:"Talk",d:"Say everything. The thank you, the apology, the anger, the goodbye.",hold:300},
  {t:"Switch seats",d:"Sit in their chair. Answer as they would have, if they were at their best."},
  {t:"Return",d:"Go back to your chair.",say:"It's said now. I can put it down."},
  {t:"Move the chair back",d:"Put the chair back where it belongs."}],
 secret:"Unfinished words stay loud. Finished ones go quiet.",
 prompts:["What did you finally say?","What did they say back?"],
 tags:["grief","closure","never said","goodbye","died","regret"]},

/* MOSS · Stillness */
{id:"green-nap",g:"juniper",title:"The Green Nap",el:"Forest",moon:"Any",min:20,
 purpose:"Rest like the forest floor.",needs:[],
 steps:[
  {t:"Somewhere green",d:"Lie near a plant, a window with trees, or put on forest sounds."},
  {t:"Heavy limbs",d:"Let each limb get heavy, one at a time. Feet, legs, hands, arms, face."},
  {t:"Speak once",d:"Very quietly.",say:"Slow is sacred. Nothing needs me for twenty minutes."},
  {t:"Rest",d:"Close your eyes. Sleep if it comes. If not, just lie there. Both count.",hold:900},
  {t:"Rise slow",d:"Roll to your side before you sit up. Drink water."}],
 secret:"A short rest before 3pm restores more than a long one after dark.",
 prompts:["How long has it been since you really rested?","What did your body tell you?"],
 tags:["tired","exhausted","rest","sleep","nap","burnout","slow"]},
{id:"stone-stillness",g:"juniper",member:true,title:"Stone Stillness",el:"Forest",moon:"Waning",min:10,
 purpose:"Borrow the patience of a stone.",needs:[["stone","A stone"]],
 steps:[
  {t:"Choose a stone",d:"Hold a stone. Any stone. Feel its weight and temperature."},
  {t:"Match it",d:"Try to be as still as it is. Don't adjust. Don't fidget.",hold:300},
  {t:"Speak",d:"Set it on your chest or in your lap.",say:"I don't have to move to matter."},
  {t:"Place it",d:"Put the stone somewhere you'll see it. It's your reminder to stop."}],
 secret:"Stones have waited millions of years. Five minutes is nothing to them, and that's the lesson.",
 prompts:["What wanted you to move?","What happened when you didn't?"],
 tags:["restless","anxious","busy","slow down","still","rest"]},
{id:"slow-tea",g:"juniper",member:true,title:"Slow Tea",el:"Forest",moon:"Any",min:12,
 purpose:"Turn a cup of tea into a full stop.",needs:[["tea","Tea, or hot water with lemon"]],
 steps:[
  {t:"Make it slowly",d:"Make tea like it's the only thing you're doing today. Watch the water."},
  {t:"Hands around it",d:"Hold the cup in both hands before you drink. Feel the heat.",hold:30},
  {t:"Drink without a screen",d:"Drink the whole cup with nothing in front of you but the view.",hold:300},
  {t:"Last sip",d:"On the last sip.",say:"I grow quietly."}],
 secret:"A ritual can be as small as a cup. Attention is what makes it one.",
 prompts:["What did you notice that you usually miss?"],
 tags:["busy","overwhelmed","rest","calm","slow"]},

/* WREN · Signs */
{id:"sign-log",g:"wren",title:"The Sign Log",el:"Air",moon:"Any",min:5,
 purpose:"Start noticing what keeps showing up.",needs:[],
 steps:[
  {t:"Recall",d:"Think back over the last three days. What kept showing up? A number, a song, a bird, a name."},
  {t:"Write it down",d:"Write each one with where you saw it."},
  {t:"Ask it",d:"Look at the list.",say:"Notice that. What are you trying to tell me?"},
  {t:"First answer",d:"Write the first answer that comes. Don't overthink it. Wren doesn't."}],
 secret:"A sign is only a sign once you write it down. Before that it's noise.",
 prompts:["What keeps showing up?","What might it mean?"],
 tags:["sign","signs","synchronicity","coincidence","111","222","333","444","repeating","numbers"]},
{id:"dream-bowl",g:"wren",member:true,title:"The Dream Bowl",el:"Air and Water",moon:"Full",min:8,
 purpose:"Invite a dream that answers something.",needs:[["bowl","A small bowl of water"]],
 steps:[
  {t:"Set it by the bed",d:"Place a small bowl of water on your nightstand."},
  {t:"Whisper the question",d:"Whisper your question over the water.",say:"Show me while I sleep."},
  {t:"Paper ready",d:"Put paper and a pen right next to it."},
  {t:"Morning",d:"Before you move, write any dream fragment. Then pour the water on a plant."}],
 secret:"Water has always been the mirror between waking and sleeping.",
 prompts:["What did you dream?","What part feels like an answer?"],
 tags:["dream","dreams","nightmare","sleep","answer","intuition"]},
{id:"ask-the-sky",g:"wren",member:true,title:"Ask the Sky",el:"Air",moon:"Any",min:10,
 purpose:"Get a yes or no from the world around you.",needs:[],
 steps:[
  {t:"Go outside",d:"Step outside or to an open window."},
  {t:"Ask a yes or no",d:"Ask one clear question out loud."},
  {t:"Set the terms",d:"Decide now: a bird means yes, silence means not yet."},
  {t:"Wait and watch",d:"Watch the sky and listen.",hold:180},
  {t:"Accept it",d:"Whatever came, thank it.",say:"It's not a coincidence. I heard you."}],
 secret:"Divination is mostly attention. You are training yours.",
 prompts:["What did you ask?","What came?"],
 tags:["decision","should i","answer","sign","choose"]},

/* LUMEN · Vision */
{id:"future-letter",g:"lumen",title:"The Future Letter",el:"Starlight",moon:"New",min:15,
 purpose:"Write to yourself from one year from now.",needs:[],
 steps:[
  {t:"Date it",d:"Write tomorrow's date, but one year from now, at the top of the page."},
  {t:"Write as her",d:"Write as future you, telling present you what happened this year. Past tense. Specific.",hold:420},
  {t:"Sign it",d:"Sign it with your name.",say:"See it first. Then live toward it."},
  {t:"Seal it",d:"Seal it in an envelope. Put the date on the outside. Open it in one year."}],
 secret:"Your brain can't fully tell a vivid memory from a vivid plan. Use that.",
 prompts:["What did future you say happened?","What's the first step toward it?"],
 tags:["future","vision","manifest","goals","dream","plan","year"]},
{id:"vision-board",g:"lumen",member:true,title:"The Starlight Vision Board",el:"Starlight",moon:"Waxing",min:25,
 purpose:"A vision board with a plan attached.",needs:[],
 steps:[
  {t:"Three areas",d:"Choose three areas of life you want to change. Write each at the top of a section of paper."},
  {t:"Images or words",d:"Under each, draw, cut out, or write images of what it looks like done.",hold:600},
  {t:"One star each",d:"Draw a star next to one small action for each area you can do this week."},
  {t:"Name it",d:"Hold the board.",say:"Name the future. The dream is data."},
  {t:"Hang it",d:"Put it where you get dressed."}],
 secret:"A board without actions is decoration. The stars make it a map.",
 prompts:["Which area scares you most?","What are the three stars?"],
 tags:["vision","goals","manifest","future","plan"]},
{id:"name-the-future",g:"lumen",member:true,title:"Name the Future",el:"Starlight",moon:"Full",min:8,
 purpose:"Speak one desire as if it's already true.",needs:[["candle","A candle or any light"]],
 steps:[
  {t:"One sentence",d:"Write one sentence about what you want, in the present tense, as if it's already here."},
  {t:"Read it seven times",d:"Read it out loud seven times, a little more believing each time."},
  {t:"Feel it",d:"Close your eyes and feel what it's like to already have it.",hold:60},
  {t:"Speak",d:"Open your eyes.",say:"It's already on its way to me."}],
 secret:"Repetition moves a sentence from wish to expectation.",
 prompts:["What sentence did you write?","What changed by the seventh read?"],
 tags:["manifest","want","desire","abundance","future"]},

/* ONORA · Ancestry */
{id:"say-their-names",g:"onora",title:"Say Their Names",el:"Ancestry",moon:"Waning",min:8,
 purpose:"Call on the people you come from.",needs:[["candle","A candle or any light"],["bowl","A glass of water"]],
 steps:[
  {t:"Set a place",d:"Set out a light and a glass of water on a clean surface."},
  {t:"Say their names",d:"Say out loud the names of those who came before you. Parents, grandparents, and the ones you never met.",hold:60},
  {t:"Tell them",d:"Tell them what's happening in your life right now."},
  {t:"Thank them",d:"Bow your head.",say:"I carry you forward. I am someone's answered prayer."},
  {t:"Leave the water",d:"Leave the water overnight. Pour it outside in the morning."}],
 secret:"Water has been offered to ancestors in almost every culture that ever existed.",
 prompts:["Whose name came first?","What did you tell them?"],
 tags:["ancestors","grandmother","grandma","family","heritage","lineage","roots"]},
{id:"ancestor-plate",g:"onora",member:true,title:"The Ancestor Plate",el:"Ancestry",moon:"Any",min:15,
 purpose:"Cook for the ones who fed you.",needs:[],
 steps:[
  {t:"Cook their food",d:"Make one dish, or even one ingredient, that someone in your family made."},
  {t:"First plate",d:"Put the first small portion on a plate for them before you eat."},
  {t:"Tell the story",d:"Tell the story of who made this and when you last ate it with them."},
  {t:"Eat together",d:"Eat your portion slowly.",say:"Carry it forward."},
  {t:"Give it back",d:"Leave their plate out for an hour, then place it outside or compost it."}],
 secret:"Recipes are memory you can taste.",
 prompts:["Whose dish was it?","What memory came with it?"],
 tags:["ancestors","family","grief","heritage","cooking","grandmother"]},
{id:"heirloom-blessing",g:"onora",member:true,title:"The Heirloom Blessing",el:"Ancestry",moon:"Full",min:10,
 purpose:"Bless something passed down, or start something to pass down.",needs:[],
 steps:[
  {t:"Choose the object",d:"Hold something that belonged to family, or something you want to pass on."},
  {t:"Tell its story",d:"Say where it came from and who held it."},
  {t:"Add your chapter",d:"Say what it has seen in your life."},
  {t:"Bless it",d:"Hold it to your heart.",say:"From their hands to mine, from mine to whoever is next."}],
 secret:"Objects carry stories only as long as someone keeps telling them.",
 prompts:["What object did you hold?","Who will you give it to?"],
 tags:["heirloom","family","legacy","grandmother","ancestors"]},

/* CORE GUARDIANS, filled to three or more */
{id:"weekly-weave",g:"aura",member:true,title:"The Weekly Weave",el:"All elements",moon:"Any",min:15,
 purpose:"Look back at your week and weave it into something you understand.",needs:[],
 steps:[
  {t:"Three threads",d:"Write the three moments from this week that stayed with you."},
  {t:"The pattern",d:"What do they have in common? Write one sentence."},
  {t:"The guardian",d:"Which guardian does this week belong to? Say their name out loud."},
  {t:"Weave it",d:"Put your hands together.",say:"Nothing is wasted. Everything is thread."},
  {t:"Next week",d:"Write one intention for next week based on the pattern."}],
 secret:"A week you reflect on becomes wisdom. A week you don't becomes a blur.",
 prompts:["What was the pattern?","Which guardian owned this week?"],
 tags:["week","reflect","review","pattern","sunday"]},
{id:"mirror-truth",g:"onyx",member:true,title:"Mirror Truth",el:"Shadow",moon:"Dark Moon",min:10,
 purpose:"Face the part of you that you keep looking away from.",needs:[["mirror","A mirror"],["candle","Low light"]],
 steps:[
  {t:"Low light",d:"Dim the room. One low light behind you."},
  {t:"Hold your gaze",d:"Look into your own eyes in the mirror. Don't look away.",hold:120},
  {t:"Ask",d:"Ask your reflection out loud.",say:"What are you not telling me?"},
  {t:"Answer",d:"Answer out loud as the reflection. First thing that comes."},
  {t:"Turn on the lights",d:"Turn on every light. Write down what you heard."}],
 secret:"Sustained eye contact with yourself strips the story. What's left is you.",
 prompts:["What did your reflection say?","What have you been avoiding?"],
 tags:["shadow","truth","lying to myself","denial","shame","avoid"]},
{id:"cord-cutting",g:"sage",member:true,title:"Cord Cutting With Thread",el:"Fire",moon:"Last Quarter",min:10,
 purpose:"Cut the tie to someone who still has a hold on you.",needs:[["thread","A piece of thread"],["candle","A candle (or scissors alone)"]],
 steps:[
  {t:"Two ends",d:"Hold a piece of thread. One end is you. The other end is them. Say their name."},
  {t:"Say what the cord carries",d:"Say out loud everything that has been flowing between you that you don't want anymore."},
  {t:"Cut it",d:"Burn the thread in the middle over a candle, or cut it with scissors.",say:"Burn it clean. Cut it loose. We are separate."},
  {t:"Separate the pieces",d:"Throw their half away. Keep yours or bury it."}],
 secret:"A cord is attention you keep paying. Cutting it is a decision made visible.",
 prompts:["Who was on the other end?","What will you do when you want to reach back?"],
 tags:["ex","cord","attached","obsessed","let go","breakup","cant stop thinking"]},
{id:"four-winds",g:"lily",member:true,title:"Breath of Four Winds",el:"Air",moon:"Any",min:8,
 purpose:"Clear your head in every direction.",needs:[],
 steps:[
  {t:"Face east",d:"Stand facing east. Breathe in for new beginnings, out for what's stale. Three breaths."},
  {t:"Face south",d:"Turn right. Breathe in warmth, out coldness. Three breaths."},
  {t:"Face west",d:"Turn right. Breathe in feeling, out numbness. Three breaths."},
  {t:"Face north",d:"Turn right. Breathe in steadiness, out panic. Three breaths.",say:"Clear channel. Clear mind."}],
 secret:"Turning your body turns your attention. Four directions, four resets.",
 prompts:["Which direction felt strongest?"],
 tags:["anxious","stress","reset","clear","breathe","overwhelmed"]},
{id:"boundary-script",g:"thistle",member:true,title:"The Boundary Script",el:"Earth",moon:"First Quarter",min:10,
 purpose:"Practice the boundary out loud before you have to use it.",needs:[],
 steps:[
  {t:"Write the line",d:"Write the exact sentence you need to say. Short. No apologies. No explanations."},
  {t:"Say it to the mirror",d:"Say it out loud five times. Each time, cut one more softening word.",hold:60},
  {t:"Plant your feet",d:"Say it once more with your feet planted wide.",say:"Strong isn't cruel. This is my edge."},
  {t:"Keep it close",d:"Save the sentence in your phone notes so it's there when you need it."}],
 secret:"A boundary you've rehearsed comes out steady. One you haven't comes out as an apology.",
 prompts:["What's your sentence?","Who is it for?"],
 tags:["boundary","say no","people pleasing","family","coworker","confront"]},
{id:"money-altar",g:"marigold",member:true,title:"The Money Altar",el:"Light",moon:"Waxing",min:12,
 purpose:"Change how money feels in your hands.",needs:[["candle","A candle or light"]],
 steps:[
  {t:"Clean your wallet",d:"Empty your wallet or purse. Throw out old receipts. Wipe it clean."},
  {t:"Make the altar",d:"Set a light, something gold, and one real bill or coin on a clean surface."},
  {t:"Speak to it",d:"Hold the money.",say:"You're allowed to come to me. I'm allowed to keep you."},
  {t:"Say a number",d:"Out loud, name what you want to earn this month."},
  {t:"Return it",d:"Put the bill back in your wallet, facing the same way as the rest."}],
 secret:"How you treat money when it's small is how you'll treat it when it's big.",
 prompts:["What did you notice about how money feels?","What number did you say?"],
 tags:["money","broke","abundance","rich","income","pay","wealth","bills"]},
{id:"doorway-blessing",g:"juniper",member:true,title:"The Doorway Blessing",el:"Wood",moon:"New",min:8,
 purpose:"Bless the door everyone walks through.",needs:[["salt","A pinch of salt"],["rosemary","Rosemary or any herb"]],
 steps:[
  {t:"Clean the threshold",d:"Wipe down your front door and the floor in front of it."},
  {t:"Herb above",d:"Tuck a sprig of rosemary or any herb above or beside the door frame."},
  {t:"Salt below",d:"Sprinkle a tiny pinch of salt in each corner of the doorway."},
  {t:"Speak",d:"Stand in the open doorway.",say:"This is a container. Only what I welcome crosses here."}],
 secret:"Doorways have been blessed for as long as there have been doors. The threshold is the spell.",
 prompts:["What do you want to welcome in?","What do you want kept out?"],
 tags:["home","house","new place","moved","protect","blessing","door"]},
{id:"name-ward",g:"rue",member:true,title:"The Name Ward",el:"Warding",moon:"Waning",min:10,
 purpose:"Protect your reputation from gossip.",needs:[["salt","Salt"],["mirror","A small mirror or anything shiny"]],
 steps:[
  {t:"Write your name",d:"Write your full name on a small piece of paper."},
  {t:"Circle of salt",d:"Place it on a plate and draw a circle of salt around it."},
  {t:"Face the shine out",d:"Lay a small mirror or shiny object on top, facing up and out."},
  {t:"Speak",d:"Hand over it.",say:"My name is mine. What's said against it goes back where it came from."},
  {t:"Leave it",d:"Leave it overnight. Then fold the paper and keep it in your wallet."}],
 secret:"Mirrors send back. Salt holds the line. Your name sits safe in between.",
 prompts:["Who's been talking?","How will you carry yourself this week?"],
 tags:["gossip","talking about me","reputation","coworker","hater","jealous"]},
{id:"mirror-return",g:"rue",member:true,title:"Mirror Return",el:"Warding",moon:"Full",min:8,
 purpose:"Send bad energy back where it came from.",needs:[["mirror","A small mirror"]],
 steps:[
  {t:"Face it out",d:"Place a small mirror in your window, facing out."},
  {t:"Name the source",d:"Say out loud whose energy you're returning, or just 'whoever sent it.'"},
  {t:"Speak",d:"Tap the mirror three times.",say:"Try me. Returned to sender, with interest."},
  {t:"Leave it up",d:"Leave it for one full moon cycle, then wipe it clean with salt water."}],
 secret:"A reflection can't be absorbed. That's the whole trick.",
 prompts:["What are you sending back?","How do you feel knowing it's up?"],
 tags:["evil eye","hex","curse","jealous","enemy","protection","bad energy"]},
{id:"quarter-review",g:"sol",member:true,title:"The Quarter Review",el:"Metal",moon:"Last Quarter",min:20,
 purpose:"Check the plan against what actually happened.",needs:[],
 steps:[
  {t:"What you said",d:"Write what you intended at the start of this cycle."},
  {t:"What happened",d:"Next to it, write what actually happened. No judgment. Just facts."},
  {t:"Keep, change, drop",d:"For each one, mark keep, change or drop.",hold:300},
  {t:"Speak",d:"Sign the page.",say:"Structure is sacred. I adjust, I don't abandon."},
  {t:"Calendar it",d:"Put the next action for each kept item on your calendar now."}],
 secret:"Plans fail when nobody looks at them again. Looking is the ritual.",
 prompts:["What will you drop?","What surprised you?"],
 tags:["plan","goals","review","stuck","progress","focus"]}
);

R.push(
{id:"ten-minute-muse",g:"poppy",title:"The Ten-Minute Muse",el:"Color",moon:"Waxing",min:10,
 purpose:"Get the creative engine turning over when you feel blank.",needs:[],
 steps:[
  {t:"Set a timer",d:"Ten minutes. That's all you're promising.",hold:0},
  {t:"Make it badly",d:"Write, draw, hum or collage anything, on purpose badly. Ugly counts double.",hold:420},
  {t:"Circle one thing",d:"Find the one line, shape or sound you secretly like."},
  {t:"Claim it",d:"Point at it.",say:"Play is a spell. I follow the spark."}],
 secret:"Perfectionism shuts the door. Making it badly on purpose walks right past it.",
 prompts:["What surprised you?","What's the spark you circled?"],tags:["creative","blocked","writer's block","art","uninspired","project"]},
{id:"color-spell",g:"poppy",member:true,title:"The Color Spell",el:"Color",moon:"Any",min:12,
 purpose:"Change your mood by changing what your eyes are drinking.",needs:[],
 steps:[
  {t:"Pick a color",d:"Choose the color of how you want to feel, not how you feel now."},
  {t:"Hunt it",d:"Walk your home and gather five things in that color. Put them together somewhere you'll see.",hold:300},
  {t:"Wear it",d:"Put on one thing in that color, even socks."},
  {t:"Name it",d:"Look at your little shrine.",say:"I choose the feeling first. The rest can follow."}],
 secret:"Color is the fastest mood tool you already own.",
 prompts:["Which color did you pick?","What shifted?"],tags:["mood","blah","uninspired","joy","creative"]},
{id:"unfinished-thing",g:"poppy",member:true,title:"The Unfinished Thing",el:"Color",moon:"First Quarter",min:15,
 purpose:"Go back to the project you abandoned, without shame.",needs:[],
 steps:[
  {t:"Get it out",d:"Open the file, the sketchbook, the half-written thing. Just look at it."},
  {t:"Thank it",d:"Say out loud what you loved about it when you started."},
  {t:"One tiny move",d:"Do the smallest possible next piece. One sentence. One line. One bar.",hold:300},
  {t:"Leave a note",d:"Write yourself a note about where to start next time, and leave it on top.",say:"Unfinished isn't failed. It's waiting."}],
 secret:"The hardest part of an old project is the shame, not the work. Thanking it dissolves the shame.",
 prompts:["What did you go back to?","What's the next tiny move?"],tags:["project","stuck","procrastinate","creative","abandoned"]});
R.push({id:"two-minute-settle",g:"lily",title:"The Two-Minute Settle",el:"Air",moon:"Any",min:2,
 purpose:"Bring your body down after a ritual stirred things up.",needs:[],
 steps:[{t:"Feet down",d:"Put both feet flat on the floor. Press them down."},
  {t:"Long exhale",d:"Breathe in for four, out for eight. Six rounds.",hold:72},
  {t:"Name three things",d:"Name three things you can see, out loud.",say:"I'm here. It moved. I'm safe."}],
 secret:"A long exhale tells your nervous system the danger is over.",prompts:["What settled?"],tags:["stirred","panic","overwhelmed"]});
R.push(
{id:"walk-it-off",g:"rowan",title:"Walk It Off",el:"Earth",moon:"Any",min:10,
 purpose:"Move a heavy feeling through your body instead of around your head.",needs:[],
 steps:[{t:"Name it",d:"Before you go, say the thing in one sentence. Out loud or under your breath."},
  {t:"Out the door",d:"Walk. Any pace. No podcast, no phone call. Five minutes out.",hold:300},
  {t:"Turn around",d:"At the turn, drop your shoulders and shake out your hands.",say:"I leave it here."},
  {t:"Walk back lighter",d:"Five minutes home. Notice three things you usually walk past.",hold:300}],
 secret:"Steady walking gives restless energy somewhere to go, and turning around gives your mind a clear ending.",
 prompts:["What did you leave out there?","What did you notice on the way back?"],
 tags:["restless","stuck","angry","walk","move","exercise","heavy","movement"]},
{id:"one-song-dance",g:"rowan",title:"One Song Dance",el:"Earth",moon:"Any",min:4,
 purpose:"Shake off the day in the length of one song.",needs:[],
 steps:[{t:"Pick the song",d:"One song that makes you move even a little. Turn it up."},
  {t:"Start small",d:"Just your head and shoulders for the first verse."},
  {t:"Let it take over",d:"By the chorus, everything moves. Badly is perfect. Nobody's watching.",hold:120},
  {t:"Land",d:"When it ends, stand still with a hand on your chest and feel your heart going.",say:"I'm back in my body."}],
 secret:"Music you love turns movement into play, and play gets past the part of you that was going to say not today.",
 prompts:["What shifted?","What song is next time?"],
 tags:["tired","sad","stuck","bored","dance","move","joy","exercise","off","movement"]},
{id:"root-and-rise",g:"rowan",member:true,title:"Root and Rise",el:"Earth",moon:"Any",min:8,
 purpose:"Ground yourself through your legs when your head is spinning.",needs:[],
 steps:[{t:"Bare feet",d:"Shoes off if you can. Feet hip width, weight in your heels."},
  {t:"Slow squats",d:"Ten slow squats. Down for four counts, up for four. Only as low as feels good.",hold:90},
  {t:"Press the floor",d:"Stand still and press your feet into the floor like you're pushing the earth away.",hold:30},
  {t:"Rise",d:"Reach your arms up tall, then let them float down.",say:"I'm rooted. I can rise."}],
 secret:"Big slow leg muscles and pressure through your feet pull your attention down and out of your thoughts.",
 prompts:["Where was your head before you started?","Where is it now?"],
 tags:["anxious","scattered","overthinking","ungrounded","exercise","move","stress","movement"]},
{id:"movement-pact",g:"rowan",member:true,title:"The Movement Pact",el:"Earth",moon:"Waxing",min:10,
 purpose:"Make movement something you keep, not something you punish yourself with.",needs:[],
 steps:[{t:"Why, honestly",d:"Write one line: how you want to feel in your body. Feel, not look."},
  {t:"The smallest version",d:"Choose one movement so small you can't fail. A ten minute walk, five stretches, one song."},
  {t:"Tie it to something",d:"Pick when it happens. After coffee, after work, before bed. Attach it to something you already do."},
  {t:"Seal it",d:"Read your line out loud.",say:"I move because I love this body, not to earn it."}],
 secret:"Tiny habits tied to something you already do last far longer than big promises.",
 prompts:["How do you want to feel in your body?","What's your smallest version?"],
 tags:["exercise","workout","motivation","body","habit","gym","movement"]},
{id:"mirror-hour",g:"vesper",adult21:true,member:true,title:"The Mirror Hour",el:"Night",moon:"Any",min:15,
 purpose:"Come home to your body with appreciation instead of critique.",needs:[["candle","A candle"],["mirror","A mirror"]],
 steps:[{t:"Low light",d:"Light the candle. Lights off. Wear as little as feels comfortable."},
  {t:"Look slowly",d:"Look at yourself the way you'd look at someone you want. No fixing, no judging.",hold:90},
  {t:"Touch what you like",d:"Rest a hand on three parts of your body you like, one at a time. Say what you like about each."},
  {t:"Claim it",d:"Hand over your heart.",say:"This body is mine to enjoy."}],
 secret:"Desire starts with feeling at home in your own skin. Slow, kind attention breaks the habit of scanning for flaws.",
 prompts:["What did you like?","What do you want more of?"],
 tags:["body","confidence","desire","sexy","insecure","pleasure"]},
{id:"yes-no-maybe",g:"vesper",love:"partner",adult21:true,member:true,title:"Yes, No, Maybe",el:"Night",moon:"Any",min:20,
 purpose:"Say what you want out loud, with a partner or just to yourself.",needs:[],
 steps:[{t:"Three columns",d:"On paper, write Yes, No and Maybe across the top. If you have a partner, you each get your own sheet."},
  {t:"Fill it honestly",d:"Touch, pace, places, words, fantasies, things you've wondered about. Anything can go on the page. Nothing on it is a promise.",hold:300},
  {t:"Trade",d:"Swap sheets. Start with the Yeses you share. Maybes are for curiosity, not pressure. Noes are respected, no questions asked."},
  {t:"Pick one",d:"Choose one Yes to try this week.",say:"I can ask for what I want."}],
 secret:"Most people never say what they want because nobody asked. Writing it first makes it easier to say.",
 prompts:["What surprised you on your list?","Which one are you trying?"],
 tags:["intimacy","partner","communication","desire","sex life","relationship"]},
{id:"candle-pact",g:"vesper",adult21:true,member:true,explicit:true,title:"The Candle Pact",el:"Night",moon:"Waxing",min:25,
 purpose:"Sex magic: charge an intention with your own pleasure. Solo or with a partner.",needs:[["candle","A candle"]],
 steps:[{t:"Write the intention",d:"One sentence, present tense, like it's already true. Fold it and set it under the candle."},
  {t:"Set the room",d:"Light the candle. Phone off. Make the space warm and private."},
  {t:"Build slowly",d:"Touch yourself or your partner slowly. No rush toward the finish. Keep coming back to your breath and the feeling.",hold:600},
  {t:"Hold the picture",d:"As pleasure peaks, picture your intention as already real. See it clearly and feel it in your whole body."},
  {t:"Release and rest",d:"Let go completely. Lie still and breathe. Then blow out the candle.",say:"It's done. It's mine."}],
 secret:"Sex magic ties a goal to one of the strongest states your body can make. Even without the magic, a vivid picture held at a peak moment tends to stay with you.",
 prompts:["What was the intention?","What did it feel like to hold it there?"],
 tags:["sex magic","manifest","desire","pleasure","intention","sex"]},
{id:"sensate-focus",g:"vesper",love:"partner",adult21:true,member:true,title:"Sensate Focus",el:"Night",moon:"Any",min:20,
 purpose:"Touch with no goal, so you both stop performing and start feeling.",needs:[],
 steps:[{t:"Agree first",d:"Check in: what's a yes tonight and what's a no. Pick a word that means stop, and honor it instantly."},
  {t:"One gives, one receives",d:"One of you lies back. The other touches arms, back, hands, face and legs slowly. Leave the most intimate places out for now. The point is noticing, not getting anywhere.",hold:300},
  {t:"Say what you notice",d:"The one receiving names what feels good, out loud. Warmer, slower, lighter, there."},
  {t:"Switch",d:"Trade places and do it again.",hold:300},
  {t:"After",d:"Stay close for a few minutes. Say one thing you loved.",say:"I loved being close to you."}],
 secret:"Taking the goal away takes the pressure away. Couples therapists have used this exercise for decades to rebuild closeness and desire.",
 prompts:["What did you learn about how they like to be touched?","What surprised you about yourself?"],
 tags:["intimacy","partner","in bed","sex life","connection","pressure","desire"]},
{id:"breathe-together",g:"vesper",love:"partner",adult21:true,member:true,title:"Breathe Together",el:"Night",moon:"Any",min:10,
 purpose:"Sync up before anything else happens.",needs:[],
 steps:[{t:"Sit close",d:"Sit facing each other, knees touching, hands resting on each other's thighs."},
  {t:"Match the breath",d:"Breathe in together for four, out together for six. Let one of you lead at first.",hold:180},
  {t:"Eyes open",d:"Keep breathing together and hold eye contact. Laugh if you need to, then come back.",hold:120},
  {t:"Close",d:"Foreheads together for three last breaths.",say:"I'm here with you."}],
 secret:"When your breathing syncs, your bodies start to settle into the same rhythm. It's the fastest way to feel on the same side.",
 prompts:["What was the eye contact like?","How did it change the rest of the night?"],
 tags:["intimacy","partner","connection","distant","sex life"]},
{id:"pelvic-power",g:"vesper",adult21:true,member:true,title:"Pelvic Power",el:"Night",moon:"Any",min:8,
 purpose:"Build the muscles that carry sensation, control and confidence.",needs:[],
 steps:[{t:"Find them",d:"Lie down or sit. Find the muscles you'd use to hold in pee. Squeeze them without tightening your belly, thighs or butt."},
  {t:"Long holds",d:"Squeeze for three seconds, then fully let go for three. Ten times.",hold:60},
  {t:"Quick pulses",d:"Ten quick squeeze and release pulses.",hold:20},
  {t:"Breathe down",d:"Three slow breaths, letting everything soften and drop. Letting go matters as much as squeezing.",say:"My body is mine to know."}],
 secret:"A pelvic floor you can both tighten and relax tends to mean more feeling and more control. A few minutes most days is enough.",
 prompts:["What did you notice?","When will you do this again?"],
 tags:["body","pleasure","confidence","desire","exercise","sex life"]},
{id:"hip-opening",g:"vesper",adult21:true,member:true,title:"Open the Hips",el:"Night",moon:"Any",min:12,
 purpose:"Loosen the place you hold the most, so pleasure has room to move.",needs:[],
 steps:[{t:"Cat and cow",d:"On hands and knees, arch and round your back slowly with your breath. Ten rounds.",hold:60},
  {t:"Hip circles",d:"Stand or kneel and circle your hips slowly. Ten each way. Let it feel good, not correct."},
  {t:"Butterfly",d:"Sit with the soles of your feet together, knees falling open. Breathe into your hips.",hold:90},
  {t:"Rest",d:"Lie back with your knees open and feet together. Hands on your belly.",say:"I open at my own pace."}],
 secret:"Tight hips and a tight pelvis go together. Loosening one tends to soften the other.",
 prompts:["Where were you holding?","How does your body feel now?"],
 tags:["body","pleasure","stiff","desire","exercise","tension"]},
{id:"love-map",g:"marigold",love:"partner",title:"The Love Map",el:"Light",moon:"Any",min:15,
 purpose:"Find your way back to each other when life has been louder than love.",needs:[],
 steps:[{t:"Face each other",d:"Sit facing each other. Phones in another room."},
  {t:"Three questions",d:"Take turns: What are you looking forward to? What's been heavy lately? When did you last feel loved by me?",hold:300},
  {t:"Name one thing",d:"Each of you says one specific thing you appreciate about the other. Specific, not general."},
  {t:"Plan one date",d:"Pick a date in the next two weeks and put it in both calendars right now.",say:"I still choose you."}],
 secret:"Couples drift when they stop updating what they know about each other. Three questions redraw the map.",
 prompts:["What did you learn about them?","When is the date?"],
 tags:["partner","relationship","disconnected","marriage","love","distant"]},
{id:"first-move",g:"marigold",love:"crush",title:"The First Move",el:"Light",moon:"Waxing",min:10,
 purpose:"Get brave enough to find out, without bending anyone's heart.",needs:[],
 steps:[{t:"What you like",d:"Write three things you like about them that have nothing to do with looks."},
  {t:"Check the fear",d:"Write the worst thing that could happen. Read it out loud. Notice you would survive it."},
  {t:"Dress for you",d:"Put on something that makes you feel most like yourself."},
  {t:"One small step",d:"Choose one move: say hi, send the text, ask one real question. Do it within two days.",say:"I'm allowed to want this."}],
 secret:"This doesn't change anyone else's feelings. It gets yours brave enough to find out, and that's the only part you control.",
 prompts:["What's your move?","How did it go?"],
 tags:["crush","dating","nervous","flirt","attraction","like someone"]},
{id:"magnetic-hour",g:"vesper",love:"crush",adult21:true,member:true,title:"Magnetic Hour",el:"Night",moon:"Waxing",min:15,
 purpose:"Feel desirable to yourself first, before you ever walk into the room.",needs:[],
 steps:[{t:"Dress for yourself",d:"Put on whatever makes you feel most like your sexiest self."},
  {t:"Body first",d:"Music on. Move slowly. Hands on your hips, your chest, your neck. Feel your own body.",hold:180},
  {t:"Write the moment",d:"In a few lines, write the moment you'd want with them, as clearly as you dare. Keep it private."},
  {t:"Carry it",d:"Breathe it in, then put the page away.",say:"I'm magnetic, and I choose who gets close."}],
 secret:"Feeling wanted by yourself first changes how you carry yourself. That's the only spell that ever reaches them.",
 prompts:["What did you write?","How do you want to walk in next time?"],
 tags:["crush","desire","sexy","attraction","confidence"]},
{id:"birthday-threshold",g:"aura",title:"The Birthday Threshold",el:"Light",moon:"Any",min:12,
 purpose:"Close one year of you and open the next on purpose.",needs:[["candle","A candle"]],
 steps:[{t:"Light it",d:"Light the candle. This one is just for you."},
  {t:"Last year",d:"Name three things the last year taught you. Out loud or on paper."},
  {t:"Leave one",d:"Name one thing you are not carrying into the new year."},
  {t:"Call it in",d:"Say how you want this year to feel, in three words.",say:"A new year of me begins now."}],
 secret:"Your birthday is your own new year. A threshold you mark is one you actually cross.",
 prompts:["What are you leaving behind?","What three words did you choose?"],
 tags:["birthday"]},
{id:"own-it",g:"onyx",title:"Own It",el:"Shadow",moon:"Waning",min:15,
 purpose:"Face something you did wrong without excuses and without drowning in it.",needs:[],
 steps:[{t:"Say it plain",d:"Write what you did in one sentence. No because, no but. Just what happened."},
  {t:"Who it touched",d:"Write who it affected and how it probably felt for them."},
  {t:"What you needed",d:"Write what was going on in you when you did it. This explains it. It doesn't excuse it."},
  {t:"One repair",d:"Choose one way to make it right: an apology, a change, a conversation, a debt paid back. Write when.",say:"I can be someone who did that and someone who makes it right."}],
 secret:"Shame wants you to hide or to punish yourself. Ownership does neither. It names it and moves toward repair.",
 prompts:["What did you own?","What's your repair, and when?"],
 tags:["guilt","regret","wrong","mistake","shame","amends","apology","hurt someone"]},
{id:"amends-letter",g:"onyx",member:true,title:"The Amends Letter",el:"Shadow",moon:"Waning",min:20,
 purpose:"Write the apology you owe, then decide what to do with it.",needs:[["candle","A candle"]],
 steps:[{t:"Light the candle",d:"Light it. This is a serious one."},
  {t:"Name it",d:"Write to them. Say exactly what you did, in plain words."},
  {t:"No but",d:"Read it back and cross out every but, though and if. An apology with a but is a defense."},
  {t:"Their side",d:"Write one line about what it cost them."},
  {t:"Decide",d:"Send it, say it in person, or keep it for now. All three count.",say:"I'm done hiding from this."}],
 secret:"A real apology names the harm, takes it without defending, and offers repair. Writing it first is how you get it right.",
 prompts:["Who was it to?","What will you do with it?"],
 tags:["apology","amends","guilt","sorry","relationship","regret"]},
{id:"shadow-mirror",g:"onyx",member:true,title:"The Shadow Mirror",el:"Shadow",moon:"Dark Moon",min:15,
 purpose:"Find the part of you hiding inside what bothers you most in other people.",needs:[["mirror","A mirror"]],
 steps:[{t:"Name the trait",d:"Think of someone who gets under your skin. Write the one trait you can't stand in them."},
  {t:"Turn it around",d:"Write three times you've done some version of that yourself, even small ones."},
  {t:"Look",d:"Look in the mirror and say the trait out loud as yours.",hold:30},
  {t:"Cut it loose",d:"Say what you'll do with it now.",say:"I see it. It doesn't run me."}],
 secret:"What we judge hardest in others is often what we haven't made peace with in ourselves. Seeing it takes its power.",
 prompts:["What trait was it?","Where does it show up in you?"],
 tags:["shadow","shadow work","jealous","judgment","trigger","annoyed","pattern"]},
{id:"push-hour",g:"sol",title:"Push Hour",el:"Sun",moon:"Any",min:30,
 purpose:"Knock out the thing you keep avoiding, in one focused push.",needs:[],
 steps:[{t:"Dump it",d:"List everything you've been putting off. All of it. Two minutes."},
  {t:"Pick one",d:"Circle the one that would make you feel lightest if it were done."},
  {t:"Push",d:"Phone face down. Twenty five minutes on just that one. Start before you're ready.",hold:1500},
  {t:"Celebrate",d:"Stand up, arms up, and say what you did out loud.",say:"I said I would and I did."}],
 secret:"Starting is the hard part. A timer and one task get you past the part of your brain that negotiates.",
 prompts:["What did you knock out?","What's next on the list?"],
 tags:["procrastinate","stuck","avoiding","productive","to do","focus","accountability","momentum"]},
{id:"promise-pact",g:"sol",title:"The Promise Pact",el:"Sun",moon:"Waxing",min:8,
 purpose:"Make a promise to yourself that actually has teeth.",needs:[],
 steps:[{t:"Name it",d:"One thing you will do. Small enough to actually happen."},
  {t:"Give it a day",d:"Pick the day and time. Put it in your calendar now."},
  {t:"First ten minutes",d:"Do the first ten minutes of it right now, while you're here.",hold:600},
  {t:"Say it to Sol",d:"Tell Sol what you promised so she can ask you about it.",say:"I keep my word to me."}],
 secret:"A promise with a day, a first step and someone asking about it is far more likely to get done than a good intention.",
 prompts:["What did you promise?","When is it happening?"],
 tags:["accountability","goal","promise","discipline","follow through","plan"]},
{id:"sunday-reckoning",g:"sol",member:true,title:"The Sunday Reckoning",el:"Sun",moon:"Any",min:15,
 purpose:"Look at last week honestly and set up the next one.",needs:[],
 steps:[{t:"Wins first",d:"Write every win from the week, big and small. Read them out loud."},
  {t:"What slid",d:"Write what you said you'd do and didn't. No beating yourself up. Just the list."},
  {t:"Why it slid",d:"For each, one honest reason: too big, no time set, didn't want to, scared."},
  {t:"Three for this week",d:"Pick three things for this week, each with a day.",say:"New week. Same promise to myself."}],
 secret:"Reviewing the week is what turns intentions into a pattern you can actually see and change.",
 prompts:["What was the biggest win?","What are your three?"],
 tags:["plan","week","review","accountability","goals","discipline"]},
{id:"heart-gate",g:"marigold",title:"Open the Heart Gate",el:"Light",moon:"Waxing",min:10,
 purpose:"Get ready to let love in, from a date, a partner or yourself.",needs:[],
 steps:[{t:"Hand on heart",d:"Sit up. One hand on your heart, one on your belly. Three slow breaths."},
  {t:"Name the love",d:"Say out loud the kind of love you want. Be specific: how it feels, how you're treated."},
  {t:"Clear the old",d:"Name one thing from an old relationship you're done carrying.",say:"That was then. I'm open now."},
  {t:"One loving act",d:"Do one thing right now that the love you want would do for you. Make the tea, put on the good perfume, text a friend."}],
 secret:"You teach yourself what love feels like by practicing it on yourself first.",
 prompts:["What kind of love did you name?","What did you do for yourself?"],
 tags:["love","dating","relationship","lonely","romance","single","heartbreak","partner"]});
const byId = Object.fromEntries(R.map(r=>[r.id,r]));
const RESET = R.filter(r=>r.reset).sort((a,b)=>a.reset-b.reset);

/* What she might have at home (water, paper and a pen are assumed) */
const HAVE = [["candle","Candles"],["salt","Salt"],["broom","A broom"],["bowl","Bowls"],["thread","Thread"],["jar","A jar"],["mirror","A mirror"],["honey","Honey"],["rosemary","Rosemary or citrus"],["pepper","Black pepper"],["vinegar","Vinegar"],["eggs","Eggs"],["milk","Milk or ink"],["soil","Seeds or soil"],["oil","Body oil"],["stone","A stone"],["tea","Tea"]];

/* ------------------------------------------------------------------
   EVERY RITUAL HOLDS SOMETHING. Rituals that used to need "nothing but
   you" now each have one real object at the center: lit at the start,
   used in the middle, closed at the end. Always ordinary household
   things, with the usual substitutes if she doesn't have them.
   [tag, what she needs, opening step title, opening step, closing step title, closing step]
------------------------------------------------------------------ */
const RITUAL_OBJECTS={
 "rootprint":["salt","A pinch of salt","Salt the doorway","Sprinkle a small line of salt just inside your door. You'll sweep it out at the end.","Sweep it out","Brush the salt out the door with your hand or a broom. What you stomped off goes with it."],
 "unsent-letter":["candle","A candle, or any small light","Light it low","Light a candle and turn off the brighter lights. Shadow work goes easier by small light.","Blow it out","Blow the candle out over the folded paper. It stays in the dark now."],
 "four-count":["bowl","A bowl of water","Fill the bowl","Fill a bowl with cool water and set it where you can see it. Let your breath match how still it is.","Pour it out","Pour the water down the drain and watch it go. The tide went out. It will come back clearer."],
 "ledger":["candle","A candle","Light it","Light a candle before you write your three intentions. It burns while you plan.","Blow it out","Sign the page, then blow the candle out. The plan is real now."],
 "anchor":["stone","A smooth stone","Hold the stone","Hold a stone in your closed hand. You are as here as it is.","Set it down","Put the stone where you'll see it today. When you do, come back to this moment."],
 "first-light":["water","A glass of water","Water first","Pour a glass of water before you touch your phone. Hold it up to the window light.","Drink the light","Drink the water slowly. That's the first thing you take in today, not a screen."],
 "dawn-question":["jar","A jar or a cup with a lid","Fold it in","Write the question on a slip of paper, fold it and put it in a jar by your bed.","Open it","In the morning, open the jar and read the question once before you check anything else."],
 "morning-oath":["candle","A candle","Light it","Light a candle before the first page. It burns while you write.","Seal the oath","Say the oath, then blow the candle out. The day starts now."],
 "sun-hype":["oil","Body oil or lotion","Warm your hands","Rub a little oil or lotion between your palms until they're warm.","Press it in","Press your warm hands over your heart and your stomach. Carry that heat out the door."],
 "empty-chair":["candle","A candle","A light on the empty chair","Set a lit candle on the floor in front of the empty chair. The other you sits by that light.","Put it out","Blow out the candle when you move the chair back. The conversation is over, the answer stays."],
 "green-nap":["rosemary","A sprig of something green, or a tea bag","Something green near you","Set a sprig of rosemary, a leaf from a plant, or an open tea bag by your head. Breathe it in.","Keep it close","Put the green thing on your nightstand or desk. When you smell it later, your body will remember this rest."],
 "sign-log":["candle","A candle","Light it","Light a candle so the sign has somewhere to land while you write it down.","Blow it out","Close the log and blow out the candle. The answer you got first is the one to keep."],
 "ask-the-sky":["bowl","A bowl of water","Set the bowl outside","Set a bowl of water outside, or on a windowsill, and look into it before you ask.","Pour it at the roots","Pour the water onto a plant or into the ground. The sky's answer goes back to the earth."],
 "future-letter":["candle","A candle","Light the future","Light a candle before you write. You're writing to the woman who lives a year from this light.","Seal by flame","Seal the letter, then blow out the candle. Write the opening date on the envelope."],
 "vision-board":["thread","String or ribbon","Lay the thread","Lay a piece of string across your table. Everything you put on the board will be tied to it.","Tie it on","Tie the string to the corner of the board, or around a rolled page, with one knot for each star."],
 "ancestor-plate":["candle","A candle","Light it for them","Light a candle on the table before you cook. Someone is being remembered tonight.","Let it burn down a little","Let the candle burn while you eat. Blow it out only when the plates are cleared."],
 "heirloom-blessing":["oil","A drop of oil or lotion","Anoint it","Put one drop of oil on your fingertip and touch the object with it, the way people bless what matters.","Wrap it","Wrap the object in a cloth or set it somewhere special. It's carrying your chapter now."],
 "weekly-weave":["thread","Three pieces of thread or string","Three strands","Cut three pieces of string, one for each thread of your week.","Braid it","Braid the three strands together and knot the end. Keep it with your journal for the week ahead."],
 "four-winds":["candle","A candle","Light it","Light a candle in front of you. Each breath should make the flame bend, never blow it out.","Last breath","Turn back to face the flame and blow it out with one long exhale."],
 "boundary-script":["salt","A pinch of salt","Salt in your palm","Hold a pinch of salt in your palm while you write the line. Salt keeps what it's around.","Sprinkle it","Sprinkle the salt across your doorway or into a tissue in your bag. The line goes where you go."],
 "quarter-review":["candle","A candle","Light it","Light a candle before you look back at the last three months.","Blow it out","Once it's on the calendar, blow the candle out. The next quarter starts with a plan."],
 "ten-minute-muse":["candle","A candle","Light the studio","Light a candle and start the timer when the flame steadies. The flame is the only audience.","Blow it out","Blow out the candle when the timer goes off. That counts as making something."],
 "color-spell":["thread","A thread or ribbon in your color","Find the color","Find a thread, ribbon or scrap of fabric in the color you choose.","Tie it on","Tie it around your wrist or your bag strap. Wear the color until it wears off."],
 "unfinished-thing":["candle","A candle","A light beside it","Set a lit candle next to the unfinished thing. It deserves a little light again.","Blow it out","Leave your note, then blow out the candle. You'll light it again for the next tiny move."],
 "two-minute-settle":["stone","A stone, a coin, or anything heavy","Something heavy","Hold a stone or something heavy in your lap. Feel it pulling down.","Put it down","Set it down slowly. The heavy part can stay there."],
 "walk-it-off":["stone","A small stone","Pick up a stone","Before you go, put a small stone in your pocket. That's the thing you're walking off.","Leave it","Halfway back, set the stone down somewhere outside and keep walking without it."],
 "one-song-dance":["candle","A candle or a low lamp","Low light","Light a candle or turn on one low lamp and turn off the rest. Nobody's watching.","Blow it out","When the song ends, blow out the candle. Let the quiet land on you."],
 "root-and-rise":["salt","A pinch of salt","Salt the floor","Sprinkle a pinch of salt where your feet will be. You're rooting into it.","Sweep it up","Sweep the salt up with your hand and toss it outside. What you shook loose goes with it."],
 "movement-pact":["thread","A piece of string","Tie it on","Tie a piece of string loosely around your wrist before you write the pact.","Keep it on","Leave the string on until you've done the smallest version three times."],
 "yes-no-maybe":["candle","A candle","Light it between you","Light a candle and set it where you can both see it. It's the third one in the room.","Blow it out together","Blow the candle out together when you've picked one."],
 "sensate-focus":["candle","A candle","Light the pact","Light one candle before you begin. When it's lit, the agreement holds.","Out together","Blow it out together. That ends the giving and the receiving."],
 "breathe-together":["candle","A candle","One flame","Light one candle between you. Watch the flame move with your breath.","Watch it settle","Let the flame settle while you sit, then blow it out together."],
 "pelvic-power":["oil","Body oil or lotion","Warm the body","Rub a little warm oil or lotion on your belly and lower back before you start.","Press and rest","Rest with your warm hands low on your belly for three breaths."],
 "hip-opening":["oil","Body oil or lotion","Oil the hips","Rub warm oil or lotion into your hips and thighs. Tell them they're allowed to open.","Rest with it","Lie back for a minute with your hands on your hips."],
 "love-map":["candle","A candle","Light it between you","Light a candle on the table between you. Talk by its light.","Blow it out together","Plan the date, then blow it out together."],
 "first-move":["honey","A spoon of honey or something sweet","Taste something sweet","Put a little honey or something sweet on your tongue. You're allowed to want sweetness.","One more taste","After you take the small step, taste it again. That was brave."],
 "magnetic-hour":["oil","Your favorite oil, lotion or scent","Anoint yourself","Put a drop of oil or your favorite scent on your wrists and the base of your throat.","Breathe it in","Breathe in your wrist before you go out. That's your scent now."],
 "own-it":["bowl","A bowl of water","Bowl of water","Set a bowl of water beside you. You're cleaning something up, not punishing yourself.","Rinse your hands","After you name the repair, rinse your hands in the bowl and pour it away."],
 "push-hour":["candle","A candle","Light it","Light a candle and start the clock when the flame steadies. Push until it burns a little lower.","Blow it out","Blow out the candle and celebrate out loud. That was the push."],
 "promise-pact":["candle","A candle","Light it","Light a candle before you name the promise. Sol's here.","Out on the first ten minutes","Do the first ten minutes, then blow the candle out. It's started."],
 "sunday-reckoning":["candle","A candle","Light the reckoning","Light a candle before you look back at your week.","Blow it out","Write your three, then blow it out. The week ahead is set."],
 "heart-gate":["honey","A spoon of honey","Honey on the lips","Touch a little honey to your lips. Love starts sweet and stays honest.","Share it","Share something sweet with someone today, even a text."]
};
for(const [id,o] of Object.entries(RITUAL_OBJECTS)){
  const r=R.find(x=>x.id===id);if(!r||(r.needs&&r.needs.length))continue;
  r.needs=[[o[0],o[1]]];r.steps=[{t:o[2],d:o[3]},...r.steps,{t:o[4],d:o[5]}];
}
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


/* ------------------------------------------------------------------
   THE INNER CIRCLE: one membership unlocks every Chamber and Journey.
------------------------------------------------------------------ */
const PLAN = {name:"The Inner Circle",monthly:"$6.99",yearly:"$49",yearNote:"That's about $4.08 a month."};
const LIMITS = {free:{read:3,talk:10},member:{read:40,talk:150}};
const CHAMBERS = {
  aura:{name:"The Weaving Room",d:"Weekly reviews that pull your rituals, chats and patterns into one thread."},
  onyx:{name:"The Shadow Chamber",d:"Mirror work, truth rites and amends for the parts you keep looking away from."},
  sage:{name:"The Revolution Pages",d:"Cord cutting, fire rites and the forge: rage, courage, endings you mean and rebirths you can feel."},
  fern:{name:"The Lunar Alchemist",d:"Moon work for rest, tides and release, timed to the phase you're in."},
  lily:{name:"The Clear Channel",d:"Breath rites that clear a racing mind in every direction."},
  thistle:{name:"The Rootkeeper's Almanac",d:"Boundary scripts you rehearse before you need them."},
  marigold:{name:"The Gilded Chamber",d:"Money, worth and receiving. Rituals that change how abundance feels in your hands."},
  juniper:{name:"Sacred Space",d:"Home blessings and threshold rites for every door you walk through."},
  rue:{name:"The Warding Book",d:"Wards for your name, your home and your peace. Send it back where it came from."},
  sol:{name:"The Solar Chamber",d:"Hype, plans and follow through. Where the promises you make to yourself get kept."},
  aurora:{name:"The Dawn Chamber",d:"Morning rites for clarity and answers that arrive at first light."},
  rowan:{name:"The Moving Grove",d:"Movement rites that get you out of your head and back into your body."},
  iris:{name:"The Pulse Room",d:"Rites for each part of your own rhythm, built from what you actually log, never a template."},
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

/* ------------------------------------------------------------------
   STATE: the Archive is memory. Saved to her account when available,
   mirrored on this device so the app works offline and instantly.
------------------------------------------------------------------ */
const KEY="dailyAlchemist.v1";
let S = {profile:{name:"",minutes:10,have:[],known:[],tone:"balanced",onboarded:false},entries:[],draws:{}};
try{const raw=localStorage.getItem(KEY);if(raw){const p=JSON.parse(raw);S={...S,...p,profile:{...S.profile,...(p.profile||{})}};}}catch(e){}
const RENAMED={moss:"juniper",cypress:"sol",ember:"sage"};
function migrateCircle(){
  const fix=o=>{if(o&&RENAMED[o.guardian])o.guardian=RENAMED[o.guardian];if(o&&RENAMED[o.g])o.g=RENAMED[o.g];};
  (S.entries||[]).forEach(fix);(S.asks||[]).forEach(fix);
  for(const [a,b] of Object.entries(RENAMED)){
    if(S.chats&&S.chats[a]){const have=new Set((S.chats[b]||[]).map(m=>m.ts+"|"+m.text));S.chats[b]=[...(S.chats[b]||[]),...S.chats[a].filter(m=>!have.has(m.ts+"|"+m.text))].sort((x,y)=>(x.ts||0)-(y.ts||0));delete S.chats[a];}
    for(const f of ["met","led","decide"])if(S[f]&&S[f][a]!=null){if(f==="met")S[f][b]=(S[f][b]||0)+S[f][a];else if(S[f][b]==null)S[f][b]=S[f][a];delete S[f][a];}
  }
}
migrateCircle();
if(!S.prefMusicVol)S.prefMusicVol="quiet";
if(S.profile.minor)setTimeout(()=>showMinor(),300);
const cloud={db:null,uid:null,on:false};
function saveLocal(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function col(){return cloud.db.collection("data/users/"+cloud.uid);}
async function cloudPut(id,data){if(!cloud.on)return;try{await col().doc(id).set(JSON.parse(JSON.stringify(data)));}catch(e){cloud.on=false;renderArchive();}}
function mergeExtras(x){
  const byIdMerge=(a,b)=>{const m=new Map();for(const o of [...(b||[]),...(a||[])])if(o&&o.id)m.set(o.id,{...(m.get(o.id)||{}),...o});return [...m.values()];};
  S.asks=byIdMerge(S.asks,x.asks).sort((a,b)=>b.ts-a.ts).slice(0,200);S.memNotes=byIdMerge(S.memNotes,x.memNotes);
  if(x.days&&typeof x.days==="object"){S.days=S.days||{};for(const [k,v] of Object.entries(x.days))S.days[k]={...v,...(S.days[k]||{})};}
  S.promises=byIdMerge(S.promises,x.promises);S.later=byIdMerge(S.later,x.later);S.plans=byIdMerge(S.plans,x.plans);
  S.movements=byIdMerge(S.movements,x.movements).sort((a,b)=>(b.ts||0)-(a.ts||0));S.goals=byIdMerge(S.goals,x.goals).sort((a,b)=>(b.updated||b.created||0)-(a.updated||a.created||0));
  S.myRituals=byIdMerge(S.myRituals,x.myRituals);for(const r of S.myRituals){if(typeof byId!=="undefined"&&!byId[r.id]){R.push(r);byId[r.id]=r;}}
  if(Array.isArray(x.cart))for(const c of x.cart)if(!(S.cart||[]).some(z=>z.tag===c.tag))(S.cart=S.cart||[]).push(c);
  S.misses={...(x.misses||{}),...(S.misses||{})};
  if(Array.isArray(x.spaces)&&x.spaces.length)S.spaces=byIdMerge(S.spaces,x.spaces);
  if(Array.isArray(x.dates))S.dates=byIdMerge(S.dates,x.dates);
  if(Array.isArray(x.corr)&&x.corr.length&&!(S.corr||[]).length)S.corr=x.corr;
  if(x.pseason&&!S.pseason)S.pseason=x.pseason;
  if(Array.isArray(x.letters))S.letters=byIdMerge(S.letters,x.letters).sort((a,b)=>b.ts-a.ts);
  if(Array.isArray(x.nudges))S.nudges=byIdMerge(S.nudges,x.nudges).sort((a,b)=>b.ts-a.ts);
}
function persist(what){saveLocal();if(typeof remotePut==="function")remotePut("prefs");}
async function initCloud(){
  if(!window.claude||!window.claude.use)return;
  try{
    const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
    if(!db||!user)return;
    const uid=await user.id(); if(!uid)return;
    cloud.db=db;cloud.uid=uid;
    const snap=await col().get();
    cloud.on=true;
    const have=new Set(S.entries.map(e=>e.id));
    let changed=false;
    for(const doc of snap.docs){
      const v=doc.data(); if(!v)continue;
      if(doc.id==="profile"){S.profile={...S.profile,...v};changed=true;}
      else if(doc.id==="draws"){S.draws={...S.draws,...(v.draws||{})};}
      else if(doc.id==="ledger"){if(v.ledger)S.ledger=v.ledger;}
      else if(doc.id==="extras"){if(v.extras)mergeExtras(v.extras);}
      else if(v.kind==="chat"&&doc.id.startsWith("chat-")){const k=doc.id.slice(5);if(!S.chats)S.chats={};if(!S.chats[k]||(v.msgs||[]).length>S.chats[k].length)S.chats[k]=v.msgs||[];}
      else if(v.kind==="entry"&&!have.has(v.id)){S.entries.push(v);changed=true;}
    }
    /* anything saved only on this device goes up to the account */
    const remote=new Set(snap.docs.map(d=>d.id));
    for(const e of S.entries)if(!remote.has(e.id))cloudPut(e.id,e);
    if(!remote.has("profile")&&S.profile.onboarded)cloudPut("profile",S.profile);
    S.entries.sort((a,b)=>b.ts-a.ts);
    saveLocal();
    if(changed)renderAll();else renderArchive();
  }catch(e){cloud.on=false;}
}

/* ------------------------------------------------------------------
   PLATFORM: the same app runs as a Claude preview ("artifact") or as
   the live web app on DailyAlchemist.com ("web", Supabase + Stripe).
------------------------------------------------------------------ */
const MODE = (window.claude && window.claude.use) ? "artifact" : "web";
function accountsOn(){const C=window.DA_CONFIG||{};return MODE==="web"&&!!C.supabaseUrl&&!/YOUR-PROJECT/.test(C.supabaseUrl)&&!!window.supabase;}
const ACCT = {sb:null,user:null,email:"",member:false,paid:false,lifetime:false,cohort:null,monitorAnswer:null,monitorUntil:null,admin:false,token:null,trialUntil:null,until:null,ready:false};
if(!S.usage)S.usage={};
if(!S.chats)S.chats={};
const TRIAL_DAYS=7;
try{const fq=new URLSearchParams(location.search).get("friend");if(fq){S.friendCode=fq.slice(0,60);history.replaceState(null,"",location.pathname);}}catch(e){}
if(!S.profile.firstSeen)S.profile.firstSeen=Date.now();
if(S.pmV!==2){S.previewMember=null;S.pmV=2;}
function trialEnds(){return accountsOn()?(ACCT.paid?0:(ACCT.trialUntil?Date.parse(ACCT.trialUntil):0)):S.profile.firstSeen+TRIAL_DAYS*864e5;}
function inTrial(){if(!accountsOn()&&(S.previewMember!=null||S.previewFriend))return false;return trialEnds()>Date.now();}
function trialDaysLeft(){return Math.max(1,Math.ceil((trialEnds()-Date.now())/864e5));}
function isMember(){return accountsOn()?!!(ACCT.member||ACCT.admin):(S.previewFriend?true:S.previewMember!=null?!!S.previewMember:inTrial());}
const NATIVE=!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
function vesperOK(){if(accountsOn())return !!(ACCT.adult21&&(ACCT.paid||ACCT.lifetime||ACCT.admin));return !!(S.profile.adult21&&isMember());}
function allowedG(k){return k!=="vesper"||vesperOK();}
function circleKeys(){return ALL.filter(allowedG);}
function okG(k){k=RENAMED[k]||k;return G[k]?(allowedG(k)?k:"marigold"):null;}
function canUse(r){return !!r&&(!r.member||isMember())&&(!r.adult21||vesperOK())&&(!r.explicit||!NATIVE)&&(!r.love||!S.profile.person||r.love===S.profile.person.mode);}
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const SIGNS=[["Capricorn",120,"earth"],["Aquarius",219,"air"],["Pisces",321,"water"],["Aries",420,"fire"],["Taurus",521,"earth"],["Gemini",621,"air"],["Cancer",723,"water"],["Leo",823,"fire"],["Virgo",923,"earth"],["Libra",1023,"air"],["Scorpio",1122,"water"],["Sagittarius",1222,"fire"],["Capricorn",1300,"earth"]];
function signOf(md){if(!md)return null;const [m,d]=String(md).split("-").map(Number);if(!m||!d)return null;const n=m*100+d;const x=SIGNS.find(z=>n<z[1]);return {name:x[0],el:x[2]};}
function mdText(md){const [m,d]=String(md||"").split("-").map(Number);return m&&d?MONTHS[m-1]+" "+d:"";}
function compat(a,b){if(!a||!b)return "";const pair=[a.el,b.el].sort().join("+");
  if(a.el===b.el)return "You're both "+a.el+" signs. You get each other without trying.";
  if(pair==="air+fire"||pair==="earth+water")return "Your elements feed each other.";
  return "Your elements balance each other. It takes a little more talking, and that's where the heat is.";}
function needBirthday(){if(S.profile.minor||S.profile.ageVerified)return false;if(!S.profile.bday)return true;return accountsOn()&&ACCT.user&&!ACCT.adult21&&!ACCT.under21;}
let bdayAfter=null;
function openBirthday(reason,after){
  bdayAfter=after||null;if(document.querySelector("#bdaySheet"))return;
  openSheet('<div class="stack auraPop" id="bdaySheet"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays(reason||"The Daily Alchemist is for adults, so I need to confirm your age once. When's your birthday?","Aura · one small thing")+
   '<div class="field"><label for="bdayIn">Your birthday</label><input type="date" id="bdayIn" max="'+new Date().toISOString().slice(0,10)+'"></div><button class="btn btn-main full" id="bdayGo">Continue</button>'+
   '<p class="small muted">The Daily Alchemist is for adults. I keep your month and day for your sign and your birthday, never the year.</p></div>');
}
function showMinor(){
  closeSheet();if($("#minorGate"))return;
  const g=document.createElement("div");g.className="gate";g.id="minorGate";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");
  g.innerHTML='<div class="in auraPop" style="text-align:center"><div class="popseal">'+glyph("aura",72)+'</div><h1 class="foil shine">The Daily Alchemist</h1>'+auraSays("The Daily Alchemist is made for adults 18 and older, so I can\'t open it for you yet. I\'ll be here when you\'re older.","Aura")+'</div>';
  document.body.appendChild(g);document.body.style.overflow="hidden";
}
async function setBirthday(v,after){
  const a=age21(v);if(a==null||a<0||a>120){toast("Choose your birthday.");return false;}
  bdayErr("");
  if(a<18){S.profile.bday=v.slice(5,10);S.profile.minor=true;S.profile.adult=false;saveLocal();if(accountsOn()&&ACCT.user)await api("/api/me",{dob:v});showMinor();return false;}
  // Signed in: the server has to confirm the age before anything moves on. Nothing is saved locally until it does.
  if(accountsOn()&&ACCT.user){
    const btns=[...document.querySelectorAll("#bdayGo,#pSave,#pSkip")];btns.forEach(b=>b.disabled=true);
    let r=null;try{r=await api("/api/me",{dob:v});}catch(e){r=null;}
    btns.forEach(b=>b.disabled=false);
    if(!r||r.error||!r.adult_confirmed_at){track("bday_save_failed",{why:r&&r.error?String(r.error).slice(0,40):"network"});bdayErr("That didn't save. Check your connection and tap Continue again.");return false;}
    ACCT.adultAt=r.adult_confirmed_at;ACCT.adult21=!!r.adult21_at;ACCT.under21=!!r.under21_at;delete S.pendingDob;
  }
  S.profile.bday=v.slice(5,10);S.profile.adult21=a>=21;S.profile.under21=a<21;S.profile.adult=true;S.profile.ageVerified=true;saveLocal();remotePut("prefs");
  if(accountsOn()&&ACCT.user&&S.friendCode&&!ACCT.lifetime)redeemFriend();
  return true;
}
function bdayErr(msg){
  document.querySelectorAll(".bdayErr").forEach(e=>e.remove());if(!msg)return;
  const inp=$("#bdayIn")||$("#age18");if(!inp)return toast(msg);
  const p=document.createElement("p");p.className="bdayErr small";p.setAttribute("role","alert");p.textContent=msg;(inp.closest(".field")||inp).after(p);
}
async function submitBirthday(){
  const v=($("#bdayIn")||{}).value;if(!v){toast("Choose your birthday.");return;}
  const ok=await setBirthday(v);if(!ok)return;
  closeSheet();renderAll();
  if(bdayAfter==="ask"){bdayAfter=null;const b=$("#askBtn");if(b)setTimeout(()=>b.click(),300);return;}
  if(bdayAfter&&bdayAfter.startsWith("talk:")){const k=bdayAfter.slice(5);bdayAfter=null;openTalk(k);toast("Thank you. Send that again and I'm listening.");return;}
  if(bdayAfter==="vesper"){bdayAfter=null;if(vesperOK())openTalk("vesper");else vesperGate();}
  else toast("Thank you. You're all set.");
}
function vesperGate(){
  if(accountsOn()&&ACCT.under21||S.profile.under21){openSheet('<div class="stack">'+glyph("vesper",56)+'<h2>Vesper is for 21 and older</h2><p>Marigold is here for love, dating and feeling good in your skin.</p><button class="btn btn-main full" data-talk="marigold">Talk to Marigold</button></div>');return;}
  if(!(accountsOn()?ACCT.adult21:S.profile.adult21)){openBirthday("Vesper\'s room is for 21 and older. When\'s your birthday?","vesper");return;}
  closeSheet();openPaywall("Vesper's room is for members");
}
function age21(v){const d=new Date(v+"T12:00:00");if(isNaN(d))return null;const n=new Date();let a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))a--;return a;}
function usedToday(kind){const u=S.usage[dayKey(new Date())]||{};return u[kind]||0;}
function bump(kind){const k=dayKey(new Date());const cur=S.usage[k]||{};S.usage={[k]:{...cur,[kind]:(cur[kind]||0)+1}};saveLocal();}
function overLimit(kind){if(accountsOn()&&ACCT.admin)return false;return usedToday(kind)>=LIMITS[isMember()?"member":"free"][kind];}
function synced(){return MODE==="artifact"?cloud.on:!!ACCT.user;}

async function remotePut(kind,id,data){
  if(MODE==="artifact"){return cloudPut(kind==="chat"?"chat-"+id:kind==="prefs"?"profile":id,kind==="prefs"?S.profile:data).then(()=>{if(kind==="prefs"){cloudPut("draws",{draws:S.draws});if(S.ledger)cloudPut("ledger",{ledger:S.ledger});cloudPut("extras",{extras:{asks:(S.asks||[]).slice(0,150),memNotes:S.memNotes||[],promises:S.promises,later:S.later,myRituals:S.myRituals,cart:S.cart,misses:S.misses,plans:S.plans,days:S.days,spaces:S.spaces,dates:S.dates,corr:S.corr,pseason:S.pseason,letters:S.letters,nudges:S.nudges,movements:S.movements||[],goals:S.goals||[]}});}});}
  if(!ACCT.user||!ACCT.sb)return;
  const sb=ACCT.sb,uid=ACCT.user.id;
  try{
    if(kind==="entry")await sb.from("entries").upsert({id,user_id:uid,data});
    else if(kind==="chat")await sb.from("chats").upsert({user_id:uid,guardian:id,msgs:data.msgs,updated_at:new Date().toISOString()});
    else await sb.from("prefs").upsert({user_id:uid,data:{profile:S.profile,draws:S.draws,ledger:S.ledger||null,extras:{asks:(S.asks||[]).slice(0,150),memNotes:S.memNotes||[],promises:S.promises,later:S.later,myRituals:S.myRituals,cart:S.cart,misses:S.misses,plans:S.plans,days:S.days,spaces:S.spaces,dates:S.dates,corr:S.corr,pseason:S.pseason,letters:S.letters,nudges:S.nudges,movements:S.movements||[],goals:S.goals||[]}},updated_at:new Date().toISOString()});
  }catch(e){}
}
async function api(path,body){
  let tok=null;
  try{if(ACCT.sb){const {data}=await ACCT.sb.auth.getSession();tok=data.session&&data.session.access_token;ACCT.token=tok;}}catch(e){}
  try{
    const res=await fetch(((window.DA_CONFIG&&window.DA_CONFIG.apiBase)||"")+path,{method:"POST",headers:{"content-type":"application/json",...(tok?{authorization:"Bearer "+tok}:{})},body:JSON.stringify(body||{})});
    let j={};try{j=await res.json();}catch(e){}
    if(!res.ok)j.error=j.error||("http_"+res.status);
    if(j.error==="adult_confirmation_required"){ACCT.adultAt=null;setTimeout(openAdultCheck,50);}
    return j;
  }catch(e){return {error:"network"};}
}
/* The Daily Alchemist is a phone app. On a computer or tablet, the live site shows a page that
   sends you to your phone (with a code to scan) instead of the app. */
function isPhone(){
  const ua=navigator.userAgent||"";
  if(/iPad|Tablet|PlayBook|Silk|Kindle/i.test(ua))return false;
  if(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1)return false; /* iPad pretending to be a Mac */
  if(navigator.userAgentData&&typeof navigator.userAgentData.mobile==="boolean"&&!navigator.userAgentData.mobile&&!/Android/i.test(ua))return false;
  const phoneUA=/iPhone|iPod|Android.+Mobile|Windows Phone|Mobile Safari|BlackBerry|Opera Mini|IEMobile/i.test(ua)||(navigator.userAgentData&&navigator.userAgentData.mobile);
  const short=Math.min(screen.width,screen.height)<=600;
  return !!(phoneUA&&short);
}
function showPhoneOnly(){
  const url=location.href;
  const d=document.createElement("div");d.className="gate";d.id="phoneOnly";
  d.innerHTML='<div class="in auraPop" style="text-align:center"><div class="popseal">'+glyph("aura",72)+'</div><h1 class="foil shine">The Daily Alchemist</h1>'+
    auraSays("I\'m Aura, your guide in The Daily Alchemist. I live on your phone. Scan this with your phone\'s camera, or open dailyalchemist.com there, and I\'ll meet you.","Aura · open on your phone")+
    '<div id="qrBox" style="display:grid;place-items:center;margin:6px auto;background:#F4F1E6;border-radius:16px;padding:14px;width:max-content"></div>'+
    '<p class="small muted">'+esc(url.replace(/^https?:\/\//,"").replace(/\/$/,""))+'</p></div>';
  document.body.appendChild(d);document.body.style.overflow="hidden";
  const sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
  sc.onload=()=>{try{const q=qrcode(0,"M");q.addData(url);q.make();$("#qrBox").innerHTML=q.createSvgTag({cellSize:6,margin:0});}catch(e){}};
  document.head.appendChild(sc);
}
async function initWeb(){
  if(MODE!=="web")return;
  if(!isPhone()){showPhoneOnly();ACCT.ready=true;return;}
  const C=window.DA_CONFIG||{};
  if(!accountsOn()||!C.supabaseAnonKey){ACCT.ready=true;return;}
  ACCT.sb=window.supabase.createClient(C.supabaseUrl,C.supabaseAnonKey);
  const {data}=await ACCT.sb.auth.getSession();
  if(data.session)await onSignedIn(data.session);else showGate();
  ACCT.sb.auth.onAuthStateChange((ev,session)=>{
    if(ev==="SIGNED_IN"&&session&&(!ACCT.user||ACCT.user.id!==session.user.id))onSignedIn(session);
    if(ev==="SIGNED_OUT"){ACCT.user=null;ACCT.member=false;renderAll();showGate();}
  });
  ACCT.ready=true;
  const qs=new URLSearchParams(location.search);
  if(qs.get("checkout")==="success"){history.replaceState(null,"",location.pathname);toast("Welcome to "+PLAN.name+".");setTimeout(refreshMe,2500);}
}
/* Authentication is email-only. Invitations can be shared by text, but Daily Alchemist
   never sends an SMS sign-in code, so opening a texted invitation cannot create SMS cost. */
function phoneOn(){return false;}
function normPhone(v){let d=String(v||"").replace(/[^\d+]/g,"");if(d.startsWith("+"))return /^\+\d{8,15}$/.test(d)?d:null;d=d.replace(/\D/g,"");if(d.length===10)return "+1"+d;if(d.length===11&&d[0]==="1")return "+"+d;return null;}
function signInForm(gate,byEmail){
  const invite=!!S.friendCode;
  return '<div id="siForm" data-by="email">'+
    '<div class="field" id="siEmailRow"><label for="siEmail">Your email</label><input type="text" inputmode="email" autocomplete="email" id="siEmail" placeholder="you@example.com"></div>'+
    '<button class="btn btn-main full" id="siSend" style="margin-top:12px">Email me a sign-in link</button>'+
    '<p class="small muted" id="siMsg" style="text-align:center;margin-top:10px">'+(invite?"Your invitation came by link. Enter your email and we\'ll send one secure sign-in link there. No password and no text messages from us.":"Enter your email and we\'ll send you one secure sign-in link. No password.")+'</p>'+
    '</div>';
}
/* On the live app everyone signs in or makes a free account first, so Aura can give her
   full reading from the very first question. */
function showGate(){
  if(MODE!=="web"||!ACCT.sb||$("#gate"))return;
  if(!S.seenIntro&&!S.profile.onboarded){showIntro();return;}
  const g=document.createElement("div");g.className="gate";g.id="gate";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label","Sign in");
  g.innerHTML='<div class="sndbar gatesnd"></div><div class="in auraPop"><div class="popseal">'+glyph("aura",72)+'</div><h1 class="foil shine">The Daily Alchemist</h1>'+
    auraSays(S.friendCode?"I\'m Aura, your guide here. Erica invited you in. Enter your email to claim your invitation and I\'ll email you a secure sign-in link. No password and no text messages from us.":"I\'m Aura, your guide here. Tell me what happened in your day and I\'ll bring you the guardian and the small ritual that fits. Sign in, or make your free account, so I can remember it for you.","Aura · welcome")+
    signInForm(true)+legalLine()+'</div>';
  document.body.appendChild(g);document.body.style.overflow="hidden";
}
const INTRO=[["Tell Aura what's happening.","Say it or type it, messy is fine. No forms, no browsing."],["Aura remembers your story and notices your patterns.","The people, the threads, what helped and what didn't. You stay in control of what she keeps."],["She brings the right guardian, ritual or next step when you need it.","You live your life. Aura keeps the thread."]];
let introAt=0;
function showIntro(){
  let g=$("#intro");if(!g){g=document.createElement("div");g.className="gate";g.id="intro";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label","Welcome");document.body.appendChild(g);document.body.style.overflow="hidden";}
  const [h,p]=INTRO[introAt],last=introAt===INTRO.length-1;
  g.innerHTML='<div class="in auraPop" style="text-align:center"><div class="popseal">'+glyph("aura",72)+'</div><div class="label">The Daily Alchemist</div><h2 style="margin-top:10px">'+esc(h)+'</h2><p class="muted" style="margin-top:10px">'+esc(p)+'</p><div class="dotsrow">'+INTRO.map((_,i)=>'<i'+(i===introAt?' class="on"':'')+'></i>').join("")+'</div><button class="btn btn-main full" id="introNext">'+(last?"Meet Aura":"Next")+'</button>'+(last?'':'<button class="linkish" id="introSkip" style="margin-top:10px">Skip</button>')+'</div>';
}
function introDone(){S.seenIntro=true;saveLocal();const g=$("#intro");if(g)g.remove();document.body.style.overflow="";showGate();}
function hideGate(){const g=$("#gate");if(g){g.remove();document.body.style.overflow="";setTimeout(()=>{if(!S.profile.onboarded&&!$("#scrim")&&!$("#gate"))openAltar(true);},500);}}
async function refreshMe(){
  const r=await api("/api/me",S.pendingDob?{dob:S.pendingDob}:{});
  if(!r.error&&S.pendingDob&&(r.adult21_at||r.under21_at||r.under18_at)){delete S.pendingDob;saveLocal();}
  if(!r.error&&r.under18_at){S.profile.minor=true;saveLocal();showMinor();return;}
  if(!r.error){ACCT.member=!!r.member;ACCT.paid=!!r.paid;ACCT.lifetime=!!r.lifetime;ACCT.adultAt=r.adult_confirmed_at||null;if(ACCT.adultAt){S.profile.adult=true;S.profile.ageVerified=true;saveLocal();}ACCT.cohort=r.cohort||null;ACCT.monitorAnswer=r.monitor_answer||null;ACCT.monitorUntil=r.monitor_until||null;ACCT.monitorScope=Array.isArray(r.monitor_scope)?r.monitor_scope:null;ACCT.admin=!!r.admin;ACCT.adult21=!!r.adult21_at;ACCT.under21=!!r.under21_at;ACCT.trialUntil=r.trial_until||null;ACCT.until=r.member_until||null;if(r.usage){const k=dayKey(new Date());S.usage={[k]:{read:r.usage.read||0,talk:r.usage.talk||0}};}}
  renderAll();
  if(!r.error&&S.profile.onboarded&&needBirthday()&&!$("#scrim")){setTimeout(()=>openBirthday(),600);return;}
  if(!r.error&&S.friendCode&&!ACCT.lifetime){await redeemFriend();return;}
  setTimeout(auraPopup,500);
}
async function onSignedIn(session){
  ACCT.user=session.user;ACCT.email=session.user.email||(session.user.phone?"+"+String(session.user.phone).replace(/^\+/,""):"");hideGate();
  const sb=ACCT.sb,uid=session.user.id;
  try{
    const [e,c,p]=await Promise.all([
      sb.from("entries").select("id,data").eq("user_id",uid).order("created_at",{ascending:false}).limit(1000),
      sb.from("chats").select("guardian,msgs").eq("user_id",uid),
      sb.from("prefs").select("data").eq("user_id",uid).maybeSingle()]);
    const have=new Set(S.entries.map(x=>x.id)), remote=new Set();
    for(const row of (e.data||[])){remote.add(row.id);if(!have.has(row.id)&&row.data)S.entries.push(row.data);}
    for(const x of S.entries)if(!remote.has(x.id))remotePut("entry",x.id,x);
    for(const row of (c.data||[])){const loc=S.chats[row.guardian]||[];S.chats[row.guardian]=(row.msgs||[]).length>=loc.length?row.msgs:loc;}
    if(p.data&&p.data.data){S.profile={...S.profile,...(p.data.data.profile||{})};if(S.profile.snd)applySnd(S.profile.snd);S.draws={...S.draws,...(p.data.data.draws||{})};if(p.data.data.ledger)S.ledger=p.data.data.ledger;if(p.data.data.extras)mergeExtras(p.data.data.extras);}
    else if(S.profile.onboarded)remotePut("prefs");
    migrateCircle();S.entries.sort((a,b)=>b.ts-a.ts);saveLocal();
  }catch(err){}
  await refreshMe();
}
function extractJSON(t){
  t=String(t||"");try{return JSON.parse(t);}catch(e){}
  const f=t.match(/```(?:json)?\s*([\s\S]*?)```/);if(f){try{return JSON.parse(f[1]);}catch(e){}}
  const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a>=0&&b>a){try{return JSON.parse(t.slice(a,b+1));}catch(e){}}
  throw {code:"invalid_json"};
}
async function aiJSON(prompt,signal,opts){
  if(MODE==="artifact"){const s=await getSample();if(!s)throw {code:"unavailable"};return s.json(prompt,{signal,modelTier:"quick"});}
  if(!ACCT.user)throw {code:"signin"};
  const r=await api("/api/ai",{kind:"read",messages:[{role:"user",content:prompt}],tier:opts&&opts.tier==="deep"?"deep":"fast"});
  if(r.error)throw {code:r.error};
  return extractJSON(r.text);
}
async function aiChat(turns,signal,onText,g){
  if(MODE==="artifact"){const s=await getSample();if(!s)throw {code:"unavailable"};const out=await s(turns,{signal,cache:false,onText});return out.text||"";}
  if(!ACCT.user)throw {code:"signin"};
  const r=await api("/api/ai",{kind:"talk",messages:turns,g:g||talkG||"",native:NATIVE});
  if(r.error)throw {code:r.error};
  return r.text||"";
}

/* Paywall, sign-in, account, legal */
let payPlan="yearly";
function openPaywall(reason){
  track("paywall",{reason:String(reason||"").slice(0,40)});
  const n=R.filter(r=>r.member).length;
  const sc=sealedCount(), nm=firstName();
  openSheet('<div class="stack"><div><div class="label">'+esc(reason||"Go deeper")+'</div><h2>'+esc(PLAN.name)+'</h2></div>'+
   auraSays((nm?esc(nm)+", when":"When")+" you come to me, I help. In the Inner Circle, I keep you in mind between visits. Here is what that means.")+
   '<div class="card headline"><div class="hl">'+envelopeSVG()+'<span><b>I write to you every week</b><span class="small muted">I look back at what you carried, what helped, and where to go next. The first letter comes the day after you start.</span></span></div><div class="hl">'+glyph("thistle",40)+'<span><b>The guardians check in on you</b><span class="small muted">A few days after you work with one of them, they come find you, call you by name, and ask how it\'s going.</span></span></div>'+(sc?'<div class="hl">'+envelopeSVG(true)+'<span><b>Your sealed letters open</b><span class="small muted">'+(sc===1?"The letter I wrote you is":"All "+sc+" letters I wrote you are")+' waiting in your mailbox.</span></span></div>':'')+'</div>'+
   '<div class="card"><p class="kv" style="font-family:var(--f-ui);font-size:16px;line-height:1.9">✦ Every guardian\'s deeper chamber opens<br>✦ The guided journeys, for when one night isn\'t enough<br>✦ More time with me and the guardians, every day<br>✦ Your Archive and chats on every device</p></div>'+
   '<div class="chips" id="planPick" role="radiogroup" aria-label="Choose a plan"><button class="chip" data-plan="yearly" aria-pressed="'+(payPlan==="yearly")+'">Yearly '+PLAN.yearly+'</button><button class="chip" data-plan="monthly" aria-pressed="'+(payPlan==="monthly")+'">Monthly '+PLAN.monthly+'</button></div>'+
   '<p class="small muted" id="planNote">'+(payPlan==="yearly"?PLAN.yearNote:"Cancel anytime.")+'</p>'+
   (!accountsOn()
     ?'<button class="btn btn-main full" data-preview-member="1">'+(isMember()?"Preview as free":"Preview as a member")+'</button><p class="small muted" style="text-align:center">Real checkout runs on the live app at DailyAlchemist.com. This preview just lets you see both sides.</p>'
     :'<button class="btn btn-main full" id="checkoutBtn">'+(ACCT.user?"Join "+esc(PLAN.name):"Create a free account to join")+'</button><p class="small muted" style="text-align:center">Secure checkout by Stripe. Cancel anytime from Your altar.</p>')+
   legalLine()+'</div>');
}
function openSignIn(next){
  if(MODE!=="web"||!ACCT.sb){toast("Accounts open on the live app.");return;}
  openSheet('<div class="stack"><div><div class="label">Your account</div><h2>'+(S.friendCode?"Claim your lifetime access.":"Keep your Archive safe.")+'</h2><p class="muted" style="margin-top:6px">'+(S.friendCode?"You came in on an invitation. Make your account and everything opens, for life. ":"")+'</p></div>'+
   signInForm(false)+legalLine()+'</div>');
}
function legalLine(){return '<p class="small muted" style="text-align:center">For reflection and ritual. Not medical, mental health, legal or financial advice. <button class="linkish" data-legal="terms">Terms</button> · <button class="linkish" data-legal="privacy">Privacy</button></p>';}
const LEGAL={
 terms:'<h2>Terms of Use</h2><p class="small muted">Last updated October 1, 2026</p><p>The Daily Alchemist is a ritual and reflection app from The Alchemist Archives. By using it you agree to these terms.</p><p><b>Not professional advice.</b> Rituals, guardian messages and readings are for reflection, creativity and personal practice. They are not medical, mental health, legal or financial advice, and they are not a substitute for a licensed professional. If you are in crisis, call or text 988 in the US or your local emergency number.</p><p><b>Safety.</b> You are responsible for using candles, heat, water and household items safely. Never leave a flame unattended. Skip any step that is unsafe for your body or home.</p><p><b>AI guardians.</b> Guardian conversations are generated by AI. They can be wrong. Use your own judgment.</p><p><b>Membership.</b> The Inner Circle renews automatically until you cancel. Cancel anytime from Your altar; access continues until the end of the paid period. Payments are processed by Stripe. Fair-use daily limits apply.</p><p><b>Your content.</b> What you write belongs to you. You give us permission to store and process it only to run the app for you.</p><p><b>Age.</b> You must be 18 or older to use the app, and 21 or older with a membership to use Vesper\'s room.</p><p><b>Changes.</b> We may update these terms and will note the date above.</p><p><b>Questions.</b> <a href="mailto:info@myagentfirst.info" style="color:var(--gold)">info@myagentfirst.info</a></p>',
 privacy:'<h2>Privacy</h2><p class="small muted">Last updated October 1, 2026</p><p><b>What we keep.</b> Your email, your settings, your Archive entries and your guardian chats, so the app can remember you.</p><p><b>Your age.</b> The Daily Alchemist is for adults. We record the date you confirmed you\'re 18 or older. We ask for your date of birth once to confirm your age. We don\'t store your birth date. We keep only the result (whether you are 18 or older, and whether you are 21 or older), plus your birthday\'s month and day on your account so Aura can mark it.</p><p><b>Sharing taps, only if you say yes.</b> If you agree, for 7 days the person who runs the app can see what you tap and when (for example "opened a letter" or "finished step 3 of a ritual") and what kind of phone you use. Never anything you write, say, or tell Aura or the guardians. It ends by itself after 7 days, and you can stop it any time in Settings. If you say no, nothing about how you use the app is recorded. If you send feedback, we keep what you send. Deleting your account deletes all of it.</p><p><b>Voices.</b> When a guardian speaks aloud, the words are sent to ElevenLabs to turn them into speech. Ritual steps, which are the same for everyone, are kept as audio so they play faster. Anything personal is spoken and not kept.</p><p><b>Who processes it.</b> Supabase stores your account and data. Stripe handles payments; we never see your card. Your messages to guardians are sent to Anthropic\'s Claude to generate replies and are not used to train their models under our API terms.</p><p><b>Weather and location.</b> To match the app to your weather, we use the rough city your internet connection points to, or, only if you turn on precise location, your phone\'s location rounded to about a kilometer. It\'s used to look up the weather (the US National Weather Service, or Apple Weather outside the US) and is never saved. You can turn weather off in Settings.</p><p><b>Cycle tracking.</b> If you choose to track with Iris, your cycle history is stored separately from your other Daily Alchemist data. It is not shown in Friends Week analytics or the admin dashboard. Aura and the Circle receive only a short summary, such as cycle day 2, and only if you separately choose to share cycle context. Authorized infrastructure access may exist when needed to operate or secure the service. You can delete your cycle history any time inside Iris.</p><p><b>What we don\'t do.</b> We don\'t sell your data or show ads.</p><p><b>Your choices.</b> In the Archive tab you can export everything you\'ve written, clear your data and start fresh while keeping your account, or permanently delete your account and data, any time. You can also make Aura forget any single thing she remembers.</p><p><b>Voice.</b> When you tap the mic, your browser turns speech into text. We only receive the text.</p><p><b>Questions.</b> Questions about privacy or your data: <a href="mailto:info@myagentfirst.info" style="color:var(--gold)">info@myagentfirst.info</a></p>'
};

/* Journeys progress */
function journeyDays(id){return [...new Set(S.entries.filter(e=>e.journey===id).map(e=>e.jday))];}

const MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
const SEND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
/* One rule for every chat: when a guardian opens the conversation (after a ritual, a check in,
   a handoff, something you asked to bring back), any earlier opening you never answered is
   replaced, never stacked. */
function guardianOpens(list,msg){while(list.length&&list[list.length-1].role==="them"&&list[list.length-1].auto)list.pop();list.push({...msg,role:"them",auto:true,ts:Date.now()});return list;}
function micBtn(id){return '<button class="mic" data-mic="'+id+'" aria-pressed="false" aria-label="Speak instead of typing">'+MIC+'</button>';}
/* helpers */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=new Date();
const dayKey=d=>d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
const fmtDate=ts=>new Date(ts).toLocaleDateString(undefined,{month:"short",day:"numeric",year:new Date(ts).getFullYear()===today.getFullYear()?undefined:"numeric"});
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);$("#live").textContent=msg;setTimeout(()=>t.remove(),2600);}
const M = moon(today), SEA = season(today);

/* Wax seal emblem, drawn with an uneven edge so it reads as pressed wax */
function drawSeal(){
  if(!$("#seal"))return;
  const c=$("#seal"),x=c.getContext("2d"),W=c.width,cx=W/2,cy=W/2;
  x.clearRect(0,0,W,W);
  x.beginPath();
  for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,r=W*.44+Math.sin(a*7)*2.2+Math.sin(a*13+1)*1.6+Math.cos(a*5)*1.4;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}
  const g=x.createRadialGradient(cx*.8,cy*.7,4,cx,cy,W*.5);g.addColorStop(0,"#E6559A");g.addColorStop(.55,"#BF1E73");g.addColorStop(1,"#6E0F42");
  x.fillStyle=g;x.fill();
  x.lineWidth=2;x.strokeStyle="rgba(60,5,30,.5)";x.stroke();
  const fg=x.createLinearGradient(0,0,W,W);fg.addColorStop(0,"#FFF1B8");fg.addColorStop(.45,"#D9AE3B");fg.addColorStop(1,"#8A6512");
  x.strokeStyle=fg;x.lineWidth=3;x.beginPath();x.arc(cx,cy,W*.33,0,Math.PI*2);x.stroke();
  x.lineWidth=1.4;x.beginPath();x.arc(cx,cy,W*.29,0,Math.PI*2);x.stroke();
  x.fillStyle=fg;x.beginPath();x.arc(cx-4,cy,W*.19,0,Math.PI*2);x.fill();
  x.globalCompositeOperation="destination-out";x.beginPath();x.arc(cx+8,cy-6,W*.17,0,Math.PI*2);x.fill();
  x.globalCompositeOperation="source-over";
  x.fillStyle=fg;const sx=cx+18,sy=cy+14,s=8;x.beginPath();x.moveTo(sx,sy-s);x.lineTo(sx+2.2,sy-2.2);x.lineTo(sx+s,sy);x.lineTo(sx+2.2,sy+2.2);x.lineTo(sx,sy+s);x.lineTo(sx-2.2,sy+2.2);x.lineTo(sx-s,sy);x.lineTo(sx-2.2,sy-2.2);x.fill();
}

/* The sky strip lives in 17b-plants-and-alchemy.js as the Daily Alchemy strip. */

/* ------------------------------------------------------------------
   AURA: the routing intelligence. Real reading when Claude is
   available on this view, a careful local reading when it isn't.
------------------------------------------------------------------ */
const KW = {
  sage:["angry","anger","pissed","rage","mad","furious","betray","resent","unfair","hate them","livid","fed up","disrespect","scared","afraid","fear","courage","leap","quit my","confront"],
  onyx:["shame","guilt","ashamed","truth","lie","lying","hiding","secret","shadow","regret","trauma","i was wrong","my fault","messed up","screwed up","fucked up","hurt someone","i hurt","apologize","apology","amends","cheated","made a mistake","owe an apology","make it right","shadow work"],
  willow:["grief","grieving","died","death","passed away","loss","miss her","miss him","funeral","forgive"],
  wren:["sign","coincidence","dream","keep seeing","synchronicity","111","222","333","444"],
  lumen:["future","vision","manifest","dream life","goals"],
  onora:["grandmother","grandma","grandfather","ancestor","heritage","family history"],
  poppy:["creative","creativity","art","paint","draw","write","writing","writer's block","music","song","blocked","muse","make something","project","inspired","uninspired"],
  iris:["period","my cycle","cramps","pms","perimenopause","menopause","hot flash","bloat","spotting"],
  vesper:["sex","sexual","sexy","desire","libido","turned on","horny","intimacy","intimate","pleasure","orgasm","sex life","in bed","sex magic","foreplay","kink","positions","arousal","aroused"],
  rowan:["exercise","workout","work out","gym","run","running","walk","walking","yoga","stretch","dance","dancing","move my body","sitting all day","stiff","restless","lifting","training","movement","interview","presentation","hype","first day","momentum","keep going","keep it going","keep this going","on a roll","productive","getting a lot done","got a lot done","getting things done","feeling good","feel good","feeling great","feel great","feeling really good","energized","energised","motivated","unstoppable","crushing it","winning","keep it up","good streak","flow state","in the zone"],
  aurora:["morning","clarity","confused","decide","decision"],
  fern:["tired","exhausted","rest","sleep","overwhelm","drained","burnout","burnt out","cry","crying","sad","depleted","heavy heart","numb"],
  lily:["anxious","anxiety","panic","overthink","racing","scattered","nervous","worried","worry","stress","foggy","can't think","cant think","spiral"],
  thistle:["guilting","guilt me","owe her","owe him","boundar","people pleas","say no","family","taken advantage","used","mother","mom","sister","coworker","guilt trip","everyone needs"],
  marigold:["ugly","worth","worthy","confidence","insecure","compare","self love","love myself","money","broke","abundance","joy","beautiful","celebrate","treat","love","romance","romantic","dating","crush","relationship","partner","boyfriend","girlfriend","husband","wife","situationship","single","heartbreak"],
  juniper:["house","home","apartment","room","space","clutter","moving","moved","new place","stale","energy in","cleanse","messy","slow down","still","quiet","can't stop","never stop"],
  rue:["jealous","envy","enemy","against me","toxic","evil eye","gossip","hater","someone wants","protect me","protection","hex","curse","watching me"],
  sol:["stuck","procrastinat","plan","goal","focus","start","begin","new job","career","discipline","direction","lost","unmotivated","motivation","accountab","on track","follow through","keep my word","putting off","avoiding","to do list","to-do","lazy","momentum","keep going","productive","motivated","interview","presentation","hype","first day","nervous"]
};
const THEME = {poppy:"creativity",aurora:"awakening",rowan:"movement",iris:"cycle",willow:"grief",vesper:"desire",wren:"signs",lumen:"vision",onora:"ancestry",sage:"fire",onyx:"shadow",fern:"rest",lily:"clarity",thistle:"boundaries",marigold:"worth",juniper:"space",rue:"protection",sol:"follow through",aura:"centering"};
function score(r,mins){
  let s=outcomeBonus(r.id); if(r.min<=mins)s+=3; else s-=Math.ceil((r.min-mins)/5);
  s-=missingFor(r).length*1.5;
  return s;
}
function recentThemes(days){const cut=Date.now()-days*864e5,c={};for(const e of S.entries)if(e.ts>cut&&e.theme&&e.theme!=="reset")c[e.theme]=(c[e.theme]||0)+1;return c;}
/* ------------------------------------------------------------------
   MEMORY: so you never have to explain it twice.
------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   CONTINUITY: what worked, what she owns, what Aura carries long-term.
------------------------------------------------------------------ */
const NOUN={candle:"a candle",salt:"salt",broom:"a broom",bowl:"a bowl",thread:"thread",jar:"a jar",mirror:"a mirror",honey:"honey",rosemary:"rosemary",pepper:"black pepper",vinegar:"vinegar",eggs:"eggs",milk:"milk or ink",soil:"seeds or soil",oil:"body oil",stone:"a stone",tea:"tea"};
const ASKN={candle:"candles",salt:"salt",broom:"a broom",bowl:"bowls",thread:"thread or string",jar:"a jar with a lid",mirror:"a mirror",honey:"honey",rosemary:"rosemary or any fresh herb",pepper:"black pepper",vinegar:"vinegar",eggs:"eggs",milk:"milk or ink",soil:"seeds or soil",oil:"body oil or lotion",stone:"a stone",tea:"tea"};
const SUBS={
  candle:{alt:[],text:"a lamp or your phone's flashlight"},
  salt:{alt:[],text:"a pinch of sugar or baking soda"},
  broom:{alt:[],text:"your open hand"},
  bowl:{alt:["jar"],text:"a mug or a glass"},
  thread:{alt:[],text:"a hair tie, a ribbon or a shoelace"},
  jar:{alt:["bowl"],text:"a mug with a saucer on top, or a zip bag"},
  mirror:{alt:[],text:"your phone's front camera or a dark window"},
  honey:{alt:[],text:"sugar, jam or anything sweet"},
  rosemary:{alt:["tea"],text:"any herb or tea bag from your kitchen, or a strip of lemon or orange peel"},
  pepper:{alt:["salt"],text:"any sharp spice, like chili flakes or cinnamon"},
  vinegar:{alt:[],text:"lemon juice"},
  eggs:{alt:["rosemary","salt"],text:"an extra pinch of salt"},
  milk:{alt:["tea"],text:"a drop of coffee or tea"},
  soil:{alt:[],text:"a damp paper towel folded into a cup"},
  oil:{alt:[],text:"any lotion, or a little olive oil"},
  stone:{alt:[],text:"a coin or any small, heavy object"},
  tea:{alt:[],text:"hot water with a slice of lemon"}
};
const KEYS={candle:["candle","tea light","light it","light a"],salt:["salt"],broom:["broom"],bowl:["bowl"],thread:["thread","string"],jar:["jar"],mirror:["mirror"],honey:["honey"],rosemary:["rosemary","herb"],pepper:["pepper"],vinegar:["vinegar"],eggs:["eggshell"],milk:["milk","ink"],soil:["soil","seed"],oil:["oil","lotion"],stone:["stone"],tea:["tea"]};
function ritualNeeds(r){
  const out=[],keys=new Set();
  const add=(k,label)=>{const sig=(k||label).toLowerCase();if(keys.has(sig))return;keys.add(sig);out.push(label);};
  for(const n of (r.needs||[])){add(n[0],n[1]);}
  const txt=(r.steps||[]).map(x=>[x.t,x.d,x.say].filter(Boolean).join(" ")).join(" ").toLowerCase();
  const has=k=>(r.needs||[]).some(n=>n[0]===k);
  if(/\b(write|writing|wrote|journal|record|list|letter|note|label|draw)\b/.test(txt)){add("paper","Paper");add("pen","A pen or pencil");}
  if(/\bcold water\b/.test(txt))add("water","Cold water");
  else if(/\bwarm water\b/.test(txt))add("water","Warm water");
  else if(/\bhot water\b/.test(txt))add("water","Hot water");
  else if(/\bwater\b/.test(txt)&&!has("bowl"))add("water","Water");
  if(/\bbowl\b/.test(txt)&&!has("bowl"))add("bowl","A bowl");
  if((/\b(light|burn|flame)\b/.test(txt)||has("candle"))&&!/phone.{0,12}flashlight/.test(txt))add("lighter","Matches or a lighter");
  if(/\bscissors\b|\bcut\b/.test(txt))add("scissors","Scissors");
  if(/\btowel\b/.test(txt))add("towel","A towel");
  if(/\bchair\b/.test(txt))add("chair","A chair");
  if(/\benvelope\b/.test(txt))add("envelope","An envelope");
  if(/\bplate\b/.test(txt))add("plate","A plate");
  if(/\bshower\b/.test(txt))add("shower","Access to a shower");
  if(/\bbath\b/.test(txt)&&r.bath)add("bath","Access to a bath or basin");
  return out;
}
function known(){return S.profile.known||(S.profile.known=[...S.profile.have]);}
function missingFor(r){return (r.needs||[]).filter(n=>SUBS[n[0]]&&known().includes(n[0])&&!S.profile.have.includes(n[0]));}
function unknownFor(r){return (r.needs||[]).filter(n=>SUBS[n[0]]&&!known().includes(n[0])&&!S.profile.have.includes(n[0]));}
function adapt(r){
  const miss=missingFor(r).map(n=>n[0]); if(!miss.length)return {...r,notes:[]};
  const notes=miss.map(t=>{const n=NOUN[t].replace(/^an? /,""),sb=subFor(t);return sb?"No "+n+"? Use "+sb+".":"No "+n+"? Skip that part. The ritual still works without it.";});
  const steps=r.steps.map(s=>{
    let d=s.d;const lo=d.toLowerCase();
    for(const t of miss)if((KEYS[t]||[]).some(k=>lo.includes(k))&&!lo.includes("no "+NOUN[t].replace(/^an? /,""))){const sb=subFor(t);d+=sb?" (No "+NOUN[t].replace(/^an? /,"")+"? Use "+sb+" instead.)":" (No "+NOUN[t].replace(/^an? /,"")+"? Skip it. The step still works.)";}
    return {...s,d};
  });
  return {...r,steps,notes};
}
function setOwned(tag,yes){
  const p=S.profile;known();
  if(!p.known.includes(tag))p.known.push(tag);
  if(yes){if(!p.have.includes(tag))p.have.push(tag);}else p.have=p.have.filter(x=>x!==tag);
  persist("profile");
}

/* What worked: outcomes she tapped after each ritual */
const GOOD=["Lighter","Clearer","Powerful"];
function outcomes(){
  const by={};
  for(const e of S.entries){if(!e.after||!e.ritualId)continue;const o=by[e.ritualId]=by[e.ritualId]||{good:0,same:0,stirred:0,tender:0,n:0,title:e.ritualTitle,g:e.guardian};
    o.n++;if(GOOD.includes(e.after))o.good++;else if(e.after==="The same")o.same++;else if(e.after==="Stirred up")o.stirred++;else if(e.after==="Tender")o.tender++;}
  return by;
}
function outcomeBonus(id){const o=outcomes()[id];if(!o)return 0;return o.good*1.2-o.same*1.5-o.stirred*.4;}
function workedText(){
  const by=outcomes(), rows=Object.entries(by);
  if(!rows.length)return "No outcomes recorded yet.";
  const helped=rows.filter(([,o])=>o.good).sort((a,b)=>b[1].good-a[1].good).slice(0,6).map(([id,o])=>o.title+" ("+G[o.g].name+") left her better "+o.good+" of "+o.n+" times");
  const flat=rows.filter(([,o])=>o.same>=1&&!o.good).slice(0,5).map(([id,o])=>o.title+" did not move it ("+o.same+"x the same)");
  const stir=rows.filter(([,o])=>o.stirred>=1).slice(0,4).map(([id,o])=>o.title+" left her stirred up "+o.stirred+"x");
  return ["HELPED: "+(helped.join("; ")||"none yet"),"DID NOT MOVE IT: "+(flat.join("; ")||"none"),"STIRRED HER UP: "+(stir.join("; ")||"none")].join("\n");
}

/* Aura's ledger: durable long-term memory, rewritten after each ritual and chat */
const LEDGER_KEYS=[["people","People in your life"],["situations","What you're going through"],["boundaries","Boundaries you set"],["commitments","Things you said you'd do"],["intentions","Your goals"],["helped","What helps you"],["didnt","What doesn't help"],["threads","Still unresolved"]];
function ledger(){if(!S.ledger){S.ledger={};for(const [k] of LEDGER_KEYS)S.ledger[k]=[];}return S.ledger;}
function ledgerText(){if(!memOn())return "(she turned memory off; do not refer to her past)";const L=ledger();let t=LEDGER_KEYS.filter(([k])=>(L[k]||[]).length).map(([k,l])=>l+": "+L[k].join(" | ")).join("\n");const n=(S.memNotes||[]).map(x=>x.text);if(n.length)t+=(t?"\n":"")+"Things she asked Aura to remember: "+n.join(" | ");return t||"(empty so far)";}
/* MEMORY CONSENT. She decides what Aura keeps. Off means Aura keeps no long-term memory and
   doesn't bring up her past; her Archive stays hers either way. */
function memOn(){return S.profile.memory!=="off";}
if(!S.asks)S.asks=[];if(!S.memNotes)S.memNotes=[];if(!S.forgotThreads)S.forgotThreads=[];
function setMemory(on){S.profile.memory=on?"on":"off";persist("profile");persistAll();}
function allThreads(){const c={};for(const e of S.entries)if(usable(e)&&e.thread)c[e.thread]=(c[e.thread]||0)+1;for(const a of S.asks)if(!a.noMem&&a.thread)c[a.thread]=(c[a.thread]||0)+1;return Object.entries(c).filter(([t])=>!S.forgotThreads.includes(t)).sort((a,b)=>b[1]-a[1]);}
function forgetThread(t){
  for(const e of S.entries)if(e.thread===t){e.private=true;remotePut("entry",e.id,e);}
  for(const a of S.asks)if(a.thread===t){a.noMem=true;a.text="";}
  const L=ledger(),tl=t.toLowerCase();for(const [k] of LEDGER_KEYS)if(L[k])L[k]=L[k].filter(x=>!String(x).toLowerCase().includes(tl));
  if(S.ledgerKeep)S.ledgerKeep=S.ledgerKeep.filter(x=>!String(x).toLowerCase().includes(tl));
  if(!S.forgotThreads.includes(t))S.forgotThreads.push(t);persistAll();
}
function openMemory(){
  const L=ledger(),rows=LEDGER_KEYS.filter(([k])=>(L[k]||[]).length),th=allThreads().slice(0,12),on=memOn();
  openSheet('<div class="stack"><div class="popseal">'+glyph("aura",56)+'</div>'+auraSays("I remember the people, goals, patterns and moments you share, so you never have to explain yourself twice. You decide what I keep. Nobody else sees any of it.","Aura · what I remember")+
    '<div class="chips"><button class="chip" data-mem="on" aria-pressed="'+on+'">Remember what I share</button><button class="chip" data-mem="off" aria-pressed="'+!on+'">Don\'t remember anything</button></div>'+
    (on?'<div class="card"><div class="label">Tell me something to remember</div><div class="addrow"><label class="sr" for="memIn">Something to remember</label><input type="text" id="memIn" placeholder="My sister\'s name is Tasha."><button class="btn btn-ghost" id="memAdd">Remember this</button></div>'+
      ((S.memNotes||[]).length?'<div class="ledg">'+S.memNotes.map(n=>'<div class="li"><span>'+esc(n.text)+'</span><button class="x2" data-memnote="'+esc(n.id)+'" aria-label="Forget this">×</button></div>').join("")+'</div>':'')+'</div>':'')+
    (on&&rows.length?'<div class="card"><div class="label">What I carry for you</div><p class="small muted" style="margin-top:4px">Keep what matters, correct what I got wrong, or forget it.</p>'+rows.map(([k,l])=>'<div class="ledg"><div class="lk">'+esc(l)+'</div>'+L[k].map((it,i)=>ledgerItemHTML(k,i,it)).join("")+'</div>').join("")+'</div>':'')+
    (on&&th.length?'<div class="card"><div class="label">The threads I follow</div><p class="small muted" style="margin-top:4px">Forget a thread and I stop bringing it up. Your own entries stay in your Archive, marked private.</p>'+th.map(([t,n])=>'<div class="li"><span>'+esc(t)+' <span class="muted small">· '+n+'</span></span><button class="chip" data-forgetthread="'+esc(t)+'">Forget this thread</button></div>').join("")+'</div>':'')+
    (on?'<div class="card"><div class="label">Your preferences</div><p class="small" style="margin-top:6px">You usually have '+S.profile.minutes+' minutes. You like language that is '+esc(S.profile.tone||"balanced")+'.'+(S.profile.person?' On your heart: your '+esc(S.profile.person.mode)+(S.profile.person.name?' '+esc(S.profile.person.name):'')+'.':'')+'</p><button class="linkish" id="openSettings2" style="margin-top:6px">Change in Settings</button></div>':'')+
    (on&&resetProgress().done.length?'<div class="card"><div class="label">Active journeys</div><p class="small" style="margin-top:6px">The 7-Day Energy Reset · '+resetProgress().done.length+' of 7 done</p></div>':'')+
    (!on?'<p class="small muted">Memory is off. I won\'t keep anything new or bring up your past. Your Archive is still yours in the Archive tab.</p>':'')+'</div>');
}
let ledgerBusy=false;
async function updateLedger(material){
  if(ledgerBusy||!memOn())return;
  if(MODE==="artifact"){const s=await getSample();if(!s)return;} else if(!ACCT.user)return;
  ledgerBusy=true;
  try{
    const prompt="You maintain the long-term memory ledger for a ritual app user so she never has to explain herself twice.\n"+
      "Today is "+today.toDateString()+".\nCURRENT LEDGER (JSON):\n"+JSON.stringify(ledger())+"\n\nNEW MATERIAL:\n"+material+"\n\n"+
      ((S.forgotThreads||[]).length?"FORGOTTEN (she asked you to forget these; never add them back in any form): "+S.forgotThreads.join(" | ")+"\n":"")+(S.ledgerKeep&&S.ledgerKeep.length?"KEPT ITEMS (she asked you to keep these exactly; never remove or reword them): "+S.ledgerKeep.join(" | ")+"\n":"")+"Update the ledger with anything durable from the new material: people (name or role plus what's going on with them), ongoing situations, boundaries she set, things she said she would do, intentions and goals, what helps her, what doesn't, and unresolved threads. "+
      "Merge duplicates, keep the most recent detail, add a short date like 'Sep 29' to new items, remove threads that are clearly resolved. Max 8 items per key, each under 140 characters, plain words, no em dashes. Never store health diagnoses, sexual details, crime, or ID or financial numbers. Only record what she actually said or did.\n"+
      'Reply with ONLY JSON with exactly these keys, each an array of strings: {"people":[],"situations":[],"boundaries":[],"commitments":[],"intentions":[],"helped":[],"didnt":[],"threads":[]}';
    let out;
    if(MODE==="artifact"){const s=await getSample();out=await s.json(prompt,{modelTier:"quick"});}
    else{const r=await api("/api/ai",{kind:"memory",messages:[{role:"user",content:prompt}]});if(r.error)throw r;out=extractJSON(r.text);}
    if(out&&typeof out==="object"){const L=ledger();for(const [k] of LEDGER_KEYS)if(Array.isArray(out[k]))L[k]=out[k].slice(0,8).map(x=>clean(String(x)).slice(0,160));L.updated=Date.now();saveLocal();remotePut("prefs");if(!$("#v-archive").hidden)renderArchive();}
  }catch(e){}
  ledgerBusy=false;
}
function keptSet(){return new Set(S.ledgerKeep||[]);}
function ledgerItemHTML(k,i,it){const kept=keptSet().has(it);return '<div class="li" data-li="'+k+':'+i+'"><span>'+(kept?'<b style="color:var(--gold)">✦</b> ':'')+esc(it)+'</span><span class="row" style="gap:4px;flex-wrap:nowrap"><button class="chip sm" data-keep="'+k+':'+i+'" aria-pressed="'+kept+'">'+(kept?"Kept":"Keep")+'</button><button class="chip sm" data-correct="'+k+':'+i+'">Correct</button><button class="x2" data-forget="'+k+':'+i+'" aria-label="Forget this">×</button></span></div>';}
function forgetLedger(k,i){const L=ledger();if(L[k]){const gone=L[k].splice(i,1)[0];if(gone!=null&&S.ledgerKeep)S.ledgerKeep=S.ledgerKeep.filter(x=>x!==gone);saveLocal();remotePut("prefs");}}

/* Continuity: more history for semantic matching by Aura */
/* Only the most relevant history goes to Aura: what shares words with what she just said, then the most recent. */
function historyText(q){
  const words=new Set(String(q||"").toLowerCase().match(/[a-z']{4,}/g)||[]);
  const all=S.entries.filter(usable);
  const score=e=>{const t=((e.carrying||"")+" "+(e.text||"")+" "+(e.thread||"")).toLowerCase();let n=0;for(const w of words)if(t.includes(w))n++;return n;};
  const rel=words.size?all.map(e=>[e,score(e)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,10).map(x=>x[0]):[];
  const pick=[...rel,...all.filter(e=>!rel.includes(e)).slice(0,20-rel.length)].sort((a,b)=>b.ts-a.ts);
  return pick.map(e=>"- id "+e.id+" | "+fmtDate(e.ts)+" | "+(G[e.guardian]||G.aura).name+" | "+(e.ritualTitle||"")+" | theme "+(e.theme||"")+" | carrying: "+(e.carrying||"").slice(0,110)+" | wrote: "+(e.text||"").slice(0,160)+(e.after?" | after: "+e.after:"")).join("\n")||"(no entries yet)";
}
function ritualsToday(){const k=dayKey(new Date());return S.entries.filter(e=>dayKey(new Date(e.ts))===k&&e.ritualId).length;}

/* The 7-Day Reset: seven sessions, gentle rhythm, no expiration */
function resetProgress(){
  const rs=S.entries.filter(e=>e.resetDay).sort((a,b)=>a.ts-b.ts);
  let cur=new Set(),rounds=0,last=null;
  for(const e of rs){cur.add(e.resetDay);last=e.ts;if(cur.size>=7){rounds++;cur=new Set();}}
  return {done:[...cur],rounds,last};
}

/* Export and delete */
async function exportArchive(){
  if(typeof cycleSync==="function")await cycleSync();
  const data=JSON.stringify({app:"The Daily Alchemist",exported:new Date().toISOString(),profile:S.profile,entries:S.entries,chats:S.chats,ledger:S.ledger||{},days:S.days||{},asks:S.asks||[],promises:S.promises||[],movements:S.movements||[],goals:S.goals||[],cycle:{mode:C.mode,irregular:C.irregular,consent:C.consent,events:C.events}},null,2);
  const filename="daily-alchemist-archive-"+new Date().toISOString().slice(0,10)+".json";
  if(MODE==="artifact"){
    try{const dl=await window.claude.use("downloads");if(!dl){toast("Export isn't available in this view.");return;}await dl.save({filename,data});}catch(e){if(!e||e.code!=="declined")toast("Export didn't finish. Try again.");}
    return;
  }
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:"application/json"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
async function clearMyData(){
  if(MODE==="artifact"&&cloud.on){try{const snap=await col().get();for(const d of snap.docs)await col().doc(d.id).delete();}catch(e){}}
  if(MODE==="web"&&ACCT.user){const r=await api("/api/delete",{scope:"data"});if(!r||r.error){toast("Couldn't clear your data. Try again.");return false;}}
  const keep=S.profile||{},snd={prefMusic:S.prefMusic,prefMusicVol:S.prefMusicVol,prefVoiceOff:S.prefVoiceOff,prefVoice:S.prefVoice};
  try{localStorage.removeItem(KEY);localStorage.removeItem(CYC_KEY);}catch(e){}
  if(typeof cycleReset==="function")cycleReset();
  S={profile:{name:"",minutes:10,have:[],known:[],tone:"balanced",onboarded:false,adult:keep.adult,adult21:keep.adult21,under21:keep.under21,ageVerified:keep.ageVerified},entries:[],draws:{},chats:{},movements:[],goals:[],usage:S.usage||{},...snd,seenIntro:true};
  saveLocal();return true;
}
async function deleteEverything(){
  if(MODE==="artifact"&&cloud.on){try{const snap=await col().get();for(const d of snap.docs)await col().doc(d.id).delete();}catch(e){}}
  if(MODE==="web"&&ACCT.user){const r=await api("/api/delete",{});if(r.error){toast("Couldn't delete your account. Try again, or email support.");return false;}try{await ACCT.sb.auth.signOut();}catch(e){}}
  try{localStorage.removeItem(KEY);localStorage.removeItem(CYC_KEY);}catch(e){}
  if(typeof cycleReset==="function")cycleReset();
  return true;
}

const STOP=new Set("that this with have from they them what when were been just like really feel feeling about into your mine then than there their would could should because again still even today tonight here very much some more most over only also dont didnt cant wont keep keeps being make made know want need thing things something".split(" "));
function words(t){return [...new Set(String(t||"").toLowerCase().replace(/[^a-z\s']/g," ").split(/\s+/).filter(w=>w.length>3&&!STOP.has(w)).map(w=>w.replace(/(ing|ed|es|s)$/,"")))];}
function similarEntry(text){
  const a=words(text); if(a.length<2)return null;
  let best=null,bs=0;
  for(const e of S.entries){
    if(e.private||Date.now()-e.ts<20*3600e3)continue;
    const b=words((e.carrying||"")+" "+(e.text||"")); if(!b.length)continue;
    const shared=a.filter(w=>b.includes(w)).length;
    const sc=shared/Math.sqrt(a.length*b.length);
    if(shared>=2&&sc>bs){bs=sc;best=e;}
  }
  return bs>=0.22?best:null;
}
function habit(){
  const c={};for(const e of S.entries)if(e.theme&&e.theme!=="reset")c[e.theme]=(c[e.theme]||0)+1;
  const top=Object.entries(c).sort((x,y)=>y[1]-x[1])[0];
  return top&&top[1]>=3?{theme:top[0],count:top[1],total:S.entries.length}:null;
}
function doneRecently(id,days){return S.entries.some(e=>e.ritualId===id&&Date.now()-e.ts<days*864e5);}
function quoteOf(e){const t=(e.text||"").trim();if(!t)return "";const sent=t.split(/(?<=[.!?])\s+/).sort((x,y)=>y.length-x.length)[0]||t;return sent.length>180?sent.slice(0,177)+"...":sent;}
function memoryBrief(text){
  const month=recentThemes(30), m=similarEntry(text), h=habit();
  const chatLines=[];for(const k of ALL){const l=(S.chats[k]||[]).filter(x=>x.role==="me").slice(-2);for(const x of l)chatLines.push("- to "+G[k].name+": "+x.text.slice(0,140));}
  return {month,match:m,habit:h,
    text:"THEMES SHE BROUGHT IN THE LAST 30 DAYS: "+(Object.entries(month).map(([k,v])=>k+" x"+v).join(", ")||"none yet")+"\n"+
    "HER USUAL PATTERN: "+(h?"she reaches for "+h.theme+" most ("+h.count+" of "+h.total+" rituals)":"not enough history yet")+"\n"+
    "MOST SIMILAR PAST MOMENT: "+(m?"id "+m.id+" | "+fmtDate(m.ts)+" | "+(m.moon||"")+" | after "+m.ritualTitle+" with "+(G[m.guardian]||G.aura).name+" | she was carrying: "+(m.carrying||"").slice(0,160)+" | she wrote: "+(m.text||"").slice(0,300):"none")+"\n"+
    "RITUALS DONE IN THE LAST 14 DAYS: "+([...new Set(S.entries.filter(e=>Date.now()-e.ts<14*864e5&&e.ritualId).map(e=>e.ritualId))].join(", ")||"none")+"\n"+
    "THINGS SHE TOLD GUARDIANS RECENTLY:\n"+(chatLines.slice(-8).join("\n")||"(nothing yet)")};
}
function yourGuardians(){
  const c={};for(const e of S.entries)if(e.guardian&&e.guardian!=="aura")c[e.guardian]=(c[e.guardian]||0)+1;
  for(const k of ALL){const n=(S.chats[k]||[]).filter(m=>m.role==="me").length;if(n&&k!=="aura")c[k]=(c[k]||0)+Math.ceil(n/3);}
  return Object.entries(c).filter(x=>x[1]>=2).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0]);
}
const LOCAL_VOICE={sage:"Tonight isn't asking you to understand it again. It's asking you to discharge it.",onyx:"You already know what this is about. Let's stop protecting it.",fern:"You have been holding the whole tide up by yourself. Put it down for a few minutes.",lily:"Your mind is loud because it's trying to keep you safe. Give it one clear thing to do.",thistle:"This doesn't make you mean. It makes you someone with an edge.",marigold:"You have been giving everyone the good version of you. Your turn.",juniper:"The space is holding what happened in it. Let's reset the container.",rue:"Not everyone gets access. We're changing the locks.",sol:"Stuck is just a plan without a date. Let's give it one, and I'll hold you to it.",
  poppy:"Your spark isn't gone. It's bored. Let's play.",aurora:"Something is trying to become clear. Let's give it some light.",rowan:"Your body is holding what your head keeps replaying. Let's move it through.",iris:"Your body has a rhythm worth noticing. Let's work with what it is actually doing today.",willow:"You can be soft here. Let's give the grief somewhere to go.",vesper:"What you want is information. Let's listen to it, slowly.",wren:"You've been noticing things. Let's find out what they mean.",lumen:"You can already see it. Now let's name it.",onora:"You come from people. Let's call them in."};

const GSPEC={
 aura:{sig:"unclear, mixed or first time feelings",avoid:"never when one guardian clearly fits",next:"the guardian who fits",mem:"everything, especially open threads"},
 onyx:{sig:"guilt, shame, regret, lying, hiding, something she did wrong, the same pattern again",avoid:"fresh grief, panic, crisis, or when she is already punishing herself hard",next:"Willow to forgive herself once it's owned; Thistle if the repair needs a boundary",mem:"what she has avoided saying, repeating patterns, past amends"},
 sage:{sig:"anger, resentment, betrayal, feeling disrespected, fear, courage, big leaps, quitting, confronting, endings, starting over",avoid:"when the anger has already been released and the issue is still there (then it's a boundary or a decision, not more fire); when she is exhausted or the leap isn't hers to take yet",next:"Thistle for the boundary, Sol to plan the leap or the next step",mem:"who keeps lighting it, what release has and hasn't worked, the leaps she's named and what stopped her"},
 fern:{sig:"exhaustion, overwhelm, crying, burnout, low tank",avoid:"when she needs to act, not rest; when rest has become avoidance",next:"Sol when rest has been had and it's time to move",mem:"sleep and energy check ins, how often she runs empty"},
 lily:{sig:"anxiety, racing thoughts, overthinking, panic, can't think",avoid:"when the worry is about a real decision that needs making",next:"Aurora or Sol to decide once she can think",mem:"what calms her fastest, what the worry keeps circling"},
 thistle:{sig:"boundaries, people pleasing, family guilt, being taken advantage of, saying no",avoid:"when she is the one who did harm (that's Onyx)",next:"Sol to follow through on the boundary, Rue if someone keeps pushing",mem:"the people involved, boundaries she has set and whether they held"},
 marigold:{sig:"worth, confidence, joy, money, love, dating, a partner or crush",avoid:"grief or shame (don't brighten over it)",next:"Vesper for desire and intimacy (21+ members only), Onyx if it's really shame",mem:"her person, what makes her feel good, money stories"},
 juniper:{sig:"home, space, clutter, moving, stillness, can't slow down",avoid:"when the heaviness is in a relationship, not the room",next:"Fern for deeper rest",mem:"her spaces and what she said about each"},
 rue:{sig:"toxic people, envy, gossip, feeling targeted, protection",avoid:"when she is the one stirring it (that's Onyx)",next:"Thistle for the boundary",mem:"who she needs protecting from"},
 sol:{sig:"accountability, procrastination, stuck, goals, plans, follow through, nerves before a big day, momentum",avoid:"when she is depleted or grieving (rest first)",next:"Fern if she is running empty, Sage for a big leap",mem:"her open promises, what she said she'd do and didn't, her wins"},
 aurora:{sig:"decisions, confusion, new beginnings, mornings, clarity",avoid:"when she already knows and is avoiding (that's Onyx or Sol)",next:"Sol to act on the decision",mem:"decisions she's circling, how she felt each morning"},
 rowan:{sig:"movement, exercise, restless body, stiff, sitting all day, wanting to feel in her body",avoid:"injury, illness or a very low tank (then Fern)",next:"Sol to make movement a habit",mem:"midday movement check ins, what kinds of movement she likes"},
 iris:{sig:"periods, cycle, cramps, PMS feelings, perimenopause, menopause, body rhythm, energy that rises and falls with her cycle",avoid:"never as the explanation for a real problem; if a work, relationship or grief situation is active, that stays the issue and Iris only adds body context",next:"Fern for rest, the guardian who owns the real situation",mem:"her own logged patterns only, never a 28 day template"},
 willow:{sig:"grief, loss, death, forgiveness, missing someone",avoid:"rushing to fix or reframe; never hype",next:"Onora to honor the person, Onyx only if guilt is underneath",mem:"who she lost, dates that matter, anniversaries"},
 vesper:{sig:"desire, sex, intimacy, pleasure, libido, sex magic",avoid:"anyone not 21+ and a member; pain, pressure or harm (care first, then Willow or a real person)",next:"Marigold for love and dating",mem:"her person (partner or crush), what she wants more of"},
 wren:{sig:"signs, dreams, coincidences, repeating numbers",avoid:"when the sign is a way to avoid deciding",next:"Aurora to decide what it means for her",mem:"signs and dreams she has logged"},
 lumen:{sig:"vision, goals, the future, manifesting",avoid:"when she needs a next step today (Sol)",next:"Sol to put a date on it",mem:"the future she has described"},
 onora:{sig:"ancestors, family history, heritage, a grandparent",avoid:"fresh grief (Willow first)",next:"Willow if grief opens",mem:"the people she comes from and what she carries from them"},
 poppy:{sig:"creativity, art, writing, blocked, wanting to make something",avoid:"when the block is fear of judgment (Sage) or exhaustion (Fern)",next:"Sol to finish it",mem:"her projects and what she keeps not finishing"}
};
const SHORT={poppy:"your muse",thistle:"your boundary keeper",onyx:"your shadow mirror",sage:"your fire keeper",fern:"keeper of your rest and tides",lily:"the one who clears your head",marigold:"keeper of your glow",juniper:"keeper of your space",rue:"your protection",sol:"your accountability coach",aurora:"your first light",rowan:"your movement keeper",iris:"keeper of your body's rhythm",willow:"keeper of your grief",vesper:"keeper of your desire",wren:"your sign reader",lumen:"keeper of your vision",onora:"keeper of your ancestors"};
/* Each guardian's job, in plain words, so the circle is useful and not just mythology. */
const JOB={aura:"Your guide. Hears what happened and sends you to the right help.",onyx:"Shadow work. The things you did wrong, owning them and making it right.",sage:"Anger and courage. Turning fury into protection, and fear into the leap.",fern:"Rest and overwhelm. When you're running on empty.",lily:"Anxiety and overthinking. Getting your head clear.",thistle:"Boundaries. Saying no, people pleasing, protecting your peace.",marigold:"Love and worth. Romance, dating, self love, confidence and joy.",juniper:"Your home and your stillness. Resetting your space and slowing down when you can't stop.",rue:"Protection. Toxic people, envy and energy that isn't yours.",sol:"Accountability. Keeps you on track, hypes you up and holds you to what you said.",aurora:"New beginnings and clarity. Decisions and fresh starts.",rowan:"Movement. Exercise, getting back in your body, nerves and keeping momentum.",iris:"Your cycle. Periods, body rhythms, perimenopause and menopause, tracked privately.",willow:"Grief. Loss, forgiveness and letting yourself feel it.",vesper:"Desire and intimacy. Pleasure, sex and sex magic. Members 21 and older.",wren:"Signs. Dreams, coincidences and what they might mean.",lumen:"Vision. Goals and the future you're building.",onora:"Family and ancestry. Where you come from and what you carry.",poppy:"Creativity. Getting unblocked and making things again."};
/* Which guardians keep showing up, and when: the seasons of her life, read from her history. */
function guardianSeasons(){
  const items=[...S.entries.filter(usable).map(e=>({g:e.guardian,ts:e.ts})),...S.asks.filter(a=>!a.noMem).map(a=>({g:a.guardian,ts:a.ts}))].filter(x=>x.g&&x.g!=="aura");
  if(items.length<3)return null;
  const month=ts=>new Date(ts).toLocaleDateString(undefined,{month:"long"}),by={};
  for(const x of items){const m=month(x.ts);(by[m]=by[m]||{})[x.g]=((by[m]||{})[x.g]||0)+1;}
  const now=month(Date.now()),top=o=>Object.entries(o||{}).sort((a,b)=>b[1]-a[1])[0];
  const cur=top(by[now]),lines=[];
  if(cur&&cur[1]>=2)lines.push(G[cur[0]].name+" keeps showing up this "+now+": "+cur[1]+" times. "+JOB[cur[0]].split(".")[0]+" is your season right now.");
  for(const m of Object.keys(by).filter(m=>m!==now).slice(-2)){const t=top(by[m]);if(t&&t[1]>=2)lines.push("In "+m+" it was mostly "+G[t[0]].name+".");}
  return lines.length?lines:null;
}
function metCount(k){return (S.met&&S.met[k]||0)+S.entries.filter(e=>e.guardian===k).length+((S.chats[k]||[]).length?1:0);}
function introFor(k){
  if(k==="aura")return "";
  const g=G[k], d=g.domain.replace(/\.$/,""), first=metCount(k)===0;
  if(first)return "You haven't met "+g.name+" yet. "+g.name+" is "+g.title+", the one for "+d.charAt(0).toLowerCase()+d.slice(1)+". "+g.voice;
  return g.name+" is "+(SHORT[k]||"one of the circle")+".";
}
function markMet(k){if(!S.met)S.met={};S.met[k]=(S.met[k]||0)+1;saveLocal();}
let EXCLUDE=null;
/* A keyword counts only as a whole word ("mom" is not in "momentum"); long keywords like
   "boundar" or "procrastinat" also match their endings. */
const kwRe={};
function hasWord(t,w){const re=kwRe[w]||(kwRe[w]=new RegExp("(^|[^a-z])"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+(w.length>=6?"":"(?![a-z])")));return re.test(t);}
function localRead(text,mins){
  const t=" "+text.toLowerCase()+" ";let best="aura",bs=0;
  for(const k of [...ORDER,...EXP]){if(EXCLUDE&&EXCLUDE===k)continue;if(!allowedG(k))continue;let s=0;for(const w of (KW[k]||[]))if(hasWord(t,w))s++;
    for(const r of R)if(r.g===k)for(const tg of r.tags)if(hasWord(t,tg))s+=.5;
    if(s>bs){bs=s;best=k;}}
  const pool=R.filter(r=>canUse(r)&&(r.g===best||(best==="aura"&&r.id==="anchor")));
  pool.sort((a,b)=>score(b,mins)-score(a,mins)||(b.tags.filter(tg=>t.includes(tg)).length-a.tags.filter(tg=>t.includes(tg)).length));
  const theme=THEME[best], n=(recentThemes(30)[theme]||0);
  const fresh=pool.filter(x=>!doneRecently(x.id,14));
  let r=(n>=1&&fresh.length?fresh:pool)[0]||byId.anchor; if(score(r,mins)<-2)r=byId.anchor;
  const g=G[r.g];
  const match=similarEntry(text);
  const quote=text.trim().split(/\s+/).slice(0,10).join(" ")+(text.trim().split(/\s+/).length>10?"...":"");
  const reading = best==="aura"
    ? "You don't have to know what's wrong to come back to yourself. Start small. I'll be here when it has a name."
    : g.phrases[0]+" "+(LOCAL_VOICE[best]||g.phrases[1]);
  const aura = best==="aura" ? (match?"You've been close to this before. I'll stay with you on this one.":"I'll stay with you on this one.")
    : (n>=2?"You've brought "+theme+" here "+(n+1)+" times this month. "+g.name+" has something different for you tonight."
      : match?"You've been close to this before. That's "+g.name+"'s work."
      : "That's "+g.name+"'s work.");
  const memory = match&&quoteOf(match)?{id:match.id,quote:quoteOf(match),date:fmtDate(match.ts),ritualTitle:match.ritualTitle,moon:match.moon||"",question:"Do you want to work from there, or start fresh?"}:null;
  const why = (quote?'You said <b>"'+esc(quote)+'"</b>. ':"")+"That reads as "+theme+" work, which is "+g.name+"'s domain. "+

    "This one takes "+r.min+" minutes"+(missingFor(r).length?"":" and uses what you have")+".";
  const rest=ritualsToday()>=2&&best!=="rowan"&&!/\britual|\bpractice|\bspell\b/.test(t);
  const pre=localRoute(text);
  if(pre&&pre.action!=="build"&&pre.action!=="answer"){const pr={guardian:pre.guardian,ritual:(pre.guardian&&R.find(z=>z.g===pre.guardian&&canUse(z)))||r,why:"",theme:THEME[pre.guardian]||theme,memory,source:"local",...pre};pr.thread=theme.charAt(0).toUpperCase()+theme.slice(1);return pr;}
  return {thread:theme.charAt(0).toUpperCase()+theme.slice(1),action:rest?"rest":"ritual",guardian:r.g==="aura"?"aura":best,ritual:r,reading:rest?"You've already done "+ritualsToday()+" rituals today. That's enough. Let it work.":reading,why,theme,aura,memory,source:"local"};
}
/* Every time she tells Aura something, it's logged (unless she says not to remember it), so Aura
   can see patterns, follow up, and answer from her history later. */
function logAsk(text,x){
  const a={id:uid(),ts:Date.now(),text:memOn()?String(text).slice(0,400):"",thread:x.thread||"",theme:x.theme||"",guardian:x.guardian||"aura",action:x.action||"ritual",ritualId:x.ritual&&!x.ritual.composed?x.ritual.id:null,ritualTitle:x.ritual?x.ritual.title:"",noMem:!memOn(),follow:null,tomorrow:x.tomorrow||""};
  a.priority=isHeavy(a)?"unresolved":"normal";
  S.asks.unshift(a);S.asks=S.asks.slice(0,200);persistAll();return a;
}
function asksText(){return S.asks.filter(a=>!a.noMem&&a.text).slice(0,12).map(a=>"- "+fmtDate(a.ts)+" | "+(a.thread||a.theme)+" | "+G[a.guardian].name+" | said: "+a.text.slice(0,140)+(a.follow?" | afterwards: "+(a.follow.did===false?"didn't do it":a.follow.helped||"did it")+(a.follow.changed?", "+a.follow.changed.slice(0,100):""):"")).join("\n")||"(nothing yet)";}
function pendingFollow(){
  const now=Date.now();
  return S.asks.find(a=>!a.follow&&!a.fuDismiss&&["ritual","write","talk","event","build","decide"].includes(a.action)&&now-a.ts>6*3600e3&&now-a.ts<5*864e5&&(!a.fuSnooze||a.fuSnooze<now)&&!(a.sitSnooze&&a.sitSnooze>now)&&!a.settled)||null;
}
function followHTML(){
  const a=pendingFollow();if(!a)return "";
  const did=a.did&&S.entries.find(e=>e.id===a.did), when=Date.now()-a.ts<36*3600e3?"Yesterday":"On "+new Date(a.ts).toLocaleDateString(undefined,{weekday:"long"}), g=G[a.guardian]||G.aura;
  const said=a.tomorrow?" we left this unresolved. I said I'd ask "+esc(a.tomorrow.replace(/^(I'll ask|ask)( you)? ?/i,""))+".":a.text?' you told me "'+esc(a.text.length>90?a.text.slice(0,90)+"...":a.text)+'".':" we talked.";
  const q=a.tomorrow?" Is it still bothering you?":did?" You did "+esc(did.ritualTitle)+". Did it help?":a.ritualTitle&&a.action!=="talk"?" I suggested "+esc(a.ritualTitle)+" with "+esc(g.name)+". Did you get to it?":" Did anything shift?";
  const btns=a.tomorrow||did||!a.ritualTitle||a.action==="talk"?[["helped","I feel better"],["still","Still bothering me"],["happened","Something happened"]]:[["did","I did it"],["notyet","Not yet"],["letgo","Let it go"]];
  return '<div class="card checkin" id="fuCard" data-fuid="'+a.id+'"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura, following up</span>'+when+said+q+'</p></div><div class="row" style="margin-top:10px" id="fuBtns">'+btns.map(b=>'<button class="chip" data-fu="'+b[0]+'">'+b[1]+'</button>').join("")+'</div><div id="fuMore"></div></div>';
}
function followStep2(a,picked){
  const box=$("#fuMore");if(!box)return;$("#fuBtns").innerHTML='<span class="small muted">'+esc(picked)+'</span>';
  box.innerHTML='<div class="composer" style="margin-top:10px"><label class="sr" for="fuText">What changed?</label><textarea id="fuText" placeholder="What changed? One line is plenty."></textarea>'+micBtn("fuText")+'</div><p class="small" style="margin-top:10px">Want me to carry this forward?</p><div class="row" style="margin-top:6px"><button class="btn btn-main" data-fusave="carry">Yes, keep it with me</button><button class="btn btn-ghost" data-fusave="rest">Let it rest</button></div>';
}
/* When it's still bothering her, Aura uses judgment instead of handing out another ritual. */
function stillBothering(a){
  a.follow={did:true,helped:"Not really",changed:"",carry:true,ts:Date.now(),still:true};
  const g=a.guardian||"aura",r=a.ritualId&&byId[a.ritualId];
  const released=r&&/release|burn|let go|cut|banish|cleanse|rest|nap|calm|breath/i.test((r.purpose||"")+" "+(r.title||"")+" "+(r.tags||[]).join(" "));
  const theme=a.theme||THEME[g]||"";
  const nextG=okG(/fire|protection|boundar/.test(theme)||["sage","rue","thistle"].includes(g)?"thistle":/grief/.test(theme)||g==="willow"?"willow":/shadow/.test(theme)||g==="onyx"?"onyx":"sol")||"sol";
  const line=released?"Then I don't think you need another release ritual. I think you need to decide what you're going to do about it.":
    nextG==="willow"?"Then let's not push it. Some things need more time and more company.":"Then let's stop circling it. One clear decision will do more than another ritual tonight.";
  if(memOn())updateLedger("Follow up: after "+(a.ritualTitle||"talking")+" about "+(a.thread||a.theme||"this")+", she said it's still bothering her. "+(released?"Release did not resolve it; she needs a decision or boundary, not more release.":"It is unresolved."));
  persistAll();
  const card=$("#fuCard");if(!card)return;
  card.innerHTML='<div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>'+esc(line)+'</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-talk="'+nextG+'">Work it out with '+esc(G[nextG].name)+'</button><button class="btn btn-ghost" id="fuTell">Tell Aura what\'s still there</button></div>';
}
function saveFollow(a,carry){
  const f=a._fu||{};const changed=(($("#fuText")||{}).value||"").trim().slice(0,600);
  a.follow={did:f.did!==false,helped:f.helped||"",changed:memOn()?changed:"",carry:!!carry,ts:Date.now()};
  if(changed&&memOn()){
    const g=a.guardian||"aura",after=f.helped==="It helped"?"Lighter":f.helped==="Not really"?"The same":"";
    const e={kind:"entry",id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),ritualId:a.ritualId,ritualTitle:"Looking back"+(a.ritualTitle?": "+a.ritualTitle:""),guardian:g,theme:a.theme||THEME[g],carrying:a.text||"",text:changed,after,moon:M.name,thread:a.thread||"",followup:true,prompts:["What changed?"]};
    S.entries.unshift(e);remotePut("entry",e.id,e);
  }
  if(carry&&memOn())updateLedger("She asked Aura to keep carrying this thread forward: "+(a.thread||a.theme)+". What she first said: "+(a.text||"")+". What changed since: "+(changed||"(nothing written)")+". How it went: "+(f.helped||(f.did===false?"not done yet":"done")));
  persistAll();track("letter_open",{reason:"followup"});
  toast(carry?"I'll keep it with me.":"Okay. I'll let it rest.");renderToday();
}

function ord(n){return n+(n%10===1&&n!==11?"st":n%10===2&&n!==12?"nd":n%10===3&&n!==13?"rd":"th");}

let sampleFn=null, sampleChecked=false, inflight=null;
async function getSample(){if(sampleChecked)return sampleFn;sampleChecked=true;try{sampleFn=(window.claude&&window.claude.use)?await window.claude.use("sample"):null;}catch(e){sampleFn=null;}return sampleFn;}

/* SAFETY. When someone mentions hurting themselves, hurting someone else, or being hurt,
   Aura answers with love and clear next steps. A word check backs up the AI, so this works
   even offline or past the daily limit. These moments are never tracked or shared. */
const REL="(husband|wife|boyfriend|girlfriend|partner|ex|mom|mother|dad|father|kid|kids|child|children|son|daughter|baby|boss|sister|brother|neighbor|roommate|coworker|friend|family)";
const SAFE_RE={
  self:/\b(kill(ing)? myself|suicid\w*|end (it all|my life)|take my (own )?life|hurt(ing)? myself|self[- ]?harm|cut(ting)? myself|want(ed)? to die|don'?t want to (be alive|live|exist)|better off (dead|without me)|no reason to live|overdose)\b/i,
  others:new RegExp("\\b(kill|hurt|harm|stab|shoot|strangle|choke|poison|attack|beat up)\\s+(him|her|them|someone|somebody|people|everyone|my\\s+"+REL+")\\b|\\bwant\\s+(him|her|them)\\s+(dead|to die)\\b","i"),
  danger:new RegExp("\\b(he|she|they|my\\s+"+REL+")\\s+(hits|hit|beats|beat|chokes|choked|strangled|threatens|threatened|abuses|abused|is abusing|won'?t let me leave)\\s+me\\b|\\b(i'?m|i am)\\s+(not safe|in danger|afraid for my life|scared for my life)\\b|\\babusive\\b","i")};
function safetyKind(t){t=String(t||"");for(const k of ["self","danger","others"])if(SAFE_RE[k].test(t))return k;return null;}
function crisisHit(t){return !!safetyKind(t);}
const SAFE={
  self:{title:"I'm right here with you.",body:"What you just told me matters more than anything else in this app. You don't have to carry this by yourself, and you don't have to explain it perfectly.",
    steps:["Reach a real person now. Call or text <b>988</b>. It's free, private and open all night.","If you might act on it soon, call <b>911</b> or go to the nearest emergency room.","Put some distance between you and anything you could hurt yourself with.","Tell one person you trust what you just told me."],
    btns:[["tel:988","Call 988",1],["sms:988","Text 988"],["tel:911","Call 911"]],reply:"I'm really glad you told me. You matter more than any ritual. Please reach a real person right now: call or text 988, or call 911 if you might act on it soon. I'm right here."},
  others:{title:"Let's keep everyone safe, you too.",body:"That much anger means something real happened, and I'm not judging you for feeling it. Let's make sure nobody gets hurt tonight, including you.",
    steps:["Put space between you and them right now: another room, or outside for a walk.","Call or text <b>988</b>. They help with anger that feels too big, not only with thoughts of suicide.","If someone is in danger right now, call <b>911</b>.","When you're steadier, Sage and I will help you let the fire out safely."],
    btns:[["tel:988","Call 988",1],["sms:988","Text 988"],["tel:911","Call 911"]],reply:"I hear how much this is. I'm not judging you. Before anything else, put some space between you and them, and call or text 988 if it feels too big to hold. If anyone is in danger right now, call 911. I'm still here."},
  danger:{title:"You deserve to be safe.",body:"Thank you for telling me. What's happening to you is not your fault, and you don't have to figure it out alone.",
    steps:["If you're in danger right now, call <b>911</b>.","The National Domestic Violence Hotline is free, private and open all night: call <b>1 800 799 7233</b>, or text <b>START</b> to <b>88788</b>.","If you can, go somewhere safe or be near someone you trust.","If someone checks your phone, you can delete everything in the Archive tab, under Your data is yours."],
    btns:[["tel:911","Call 911",1],["tel:18007997233","Call the hotline"],["sms:88788?&body=START","Text the hotline"]],reply:"Thank you for telling me. What's happening is not your fault, and you deserve to be safe. If you're in danger right now, call 911. The National Domestic Violence Hotline is free and open all night: call 1 800 799 7233 or text START to 88788. I'm right here."}};
const CARE_REPLY=SAFE.self.reply;
function openSafety(kind){
  const x=SAFE[kind]||SAFE.self;
  openSheet('<div class="stack safety"><div class="popseal">'+glyph("aura",64)+'</div><div style="text-align:center"><div class="label">Aura</div><h2>'+x.title+'</h2><p style="margin-top:8px">'+x.body+'</p></div>'+
    '<ol class="safesteps">'+x.steps.map(t=>'<li><span>'+t+'</span></li>').join("")+'</ol>'+
    x.btns.map(b=>'<a class="btn '+(b[2]?'btn-main':'btn-ghost')+' full" href="'+b[0]+'">'+b[1]+'</a>').join("")+
    '<button class="btn btn-ghost full" data-begin="two-minute-settle">Breathe with me first</button>'+
    '<button class="btn btn-ghost full" id="popClose">I\'m safe right now</button>'+
    '<p class="small muted" style="text-align:center">Outside the US, call your local emergency number. I won\'t contact anyone or send this to another person.</p></div>');
}
/* Deterministic shortlist before any AI call: keyword fit, the guardian who owns today's open
   situation, the day's steward, who she has been with lately, and Aura. Smaller prompt, better picks. */
function shortlist(text,mins){
  const t=" "+String(text||"").toLowerCase()+" ",sc={},f=resolveCurrentFocus();
  for(const k of circleKeys()){if(k==="aura")continue;let s=0;for(const w of (KW[k]||[]))if(hasWord(t,w))s+=2;for(const r of R)if(r.g===k)for(const tg of r.tags||[])if(hasWord(t,tg))s+=.5;sc[k]=s;}
  if(f.owner&&sc[f.owner]!=null)sc[f.owner]+=1.5;if(sc[f.steward]!=null)sc[f.steward]+=.5;
  for(const k of (memOn()?yourGuardians():[]).slice(0,3))if(sc[k]!=null)sc[k]+=.75;
  const gs=["aura",...Object.entries(sc).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x=>x[0])];
  const pool=R.filter(r=>canUse(r)&&!r.reset&&(gs.includes(r.g)||gs.includes(KIN[r.g])));
  const scored=pool.map(r=>[-wxPenalty(r)+score(r,mins)+outcomeBonus(r.id)+(gs.indexOf(r.g)>=0?(6-gs.indexOf(r.g))*.3:0)+(r.tags||[]).filter(tg=>hasWord(t,tg)).length,r]).sort((a,b)=>b[0]-a[0]).map(x=>x[1]);
  const extra=R.filter(r=>canUse(r)&&!r.reset&&r.min<=5&&!scored.includes(r)).slice(0,4);
  return {guardians:gs,rituals:[...scored.slice(0,32),...extra]};
}
async function askAura(text,mins){
  const pre=localRoute(text);
  if(pre&&pre.action==="simplify")return {...pre,theme:"centering",ritual:byId["two-minute-settle"],why:""};
  if(pre&&pre.action==="answer"){const a=await askArchive(text);return {...pre,...a,theme:"archive",ritual:byId.anchor,reading:"",aura:"Here's what your Archive says.",why:""};}
  if(overLimit("read")){const res=localRead(text,mins);res.limit=true;res.note="That's today's "+LIMITS.free.read+" free readings from me, so this one comes from the Archive's own index. In the Inner Circle, we get much more time together. Aura";return res;}
  const p=S.profile, mem=memOn()?memoryBrief(text):{text:"(memory is off; do not refer to her past)"};
  const recent=S.entries.filter(usable).slice(0,8).map(e=>"- "+fmtDate(e.ts)+" | "+e.guardian+" | "+(e.ritualTitle||"")+" | theme: "+(e.theme||"")+" | carrying: "+(e.carrying||"").slice(0,120)+" | wrote: "+(e.text||"").slice(0,160)).join("\n")||"(no entries yet)";
  // Shortlist first, in code: the likely guardians and their rituals, not the whole library every time.
  const sl=shortlist(text,mins);
  const catalog=sl.rituals.map(r=>r.id+" | "+G[r.g].name+" | "+r.title+" | "+r.min+" min | needs: "+(r.needs.map(n=>n[0]).join(", ")||"nothing")+" | for: "+r.purpose).join("\n");
  const others=circleKeys().filter(k=>!sl.guardians.includes(k)).map(k=>k+": "+G[k].name+", "+JOB[k]).join("\n");
  const circle=sl.guardians.map(k=>k+": "+G[k].name+", "+G[k].title+". Job: "+JOB[k]+" Domain: "+G[k].domain+(GSPEC[k]?" Call when: "+GSPEC[k].sig+". Do NOT use when: "+GSPEC[k].avoid+". Goes next to: "+GSPEC[k].next+". Memory that matters: "+GSPEC[k].mem+".":"")+" Voice: "+G[k].voice+" Signature phrases: "+G[k].phrases.join(" / ")).join("\n");
  const prompt =
"You are Aura, lead guardian of The Daily Alchemist, a ritual app from The Alchemist Archives. Philosophy: the person should never have to browse or work harder because the app exists. Read her moment and bring her ONE practice that fits right now.\n\n"+
"THE LIKELIEST GUARDIANS FOR THIS MOMENT (each has a distinct voice; write the reading in the chosen guardian's voice):\n"+circle+"\n"+"THE REST OF THE CIRCLE (choose one only if clearly better; their voice is in their job line):\n"+others+"\n\n"+focusText()+"\n"+
"BRAND VOICE: warm, wise, grounded, a little bougie. Real talk, not love-and-light. Nature, moon and elements, tangible and real, never woo-woo fluff. NEVER use em dashes or en dashes. No emojis.\n\n"+
"TODAY: "+today.toDateString()+". Moon: "+M.name+", "+Math.round(M.ill*100)+"% lit. Season: "+SEA.cur.name+" ("+SEA.cur.sense+"), "+SEA.next.name+" in "+SEA.days+" days.\n"+
"THE MOON IS A SIGNAL, NOT DECORATION: waxing is for beginning and building, full is for peaks, celebration and big releases, waning is for releasing, ending and rest, new and dark moon are for rest and quiet intentions. Weigh it with how much she is carrying. When it shapes your choice, say why in one short clause, for example: You're carrying a lot tonight and the moon is waning, so we're not beginning anything. We're releasing. Never force it.\n"+
"HOW SHE IS TODAY: "+(()=>{const d=(S.days||{})[dayKey(new Date())]||{};return [d.sleep?"slept "+["","rough","okay","good","great"][d.sleep]:"",d.energy?"energy "+["","low","some","good"][d.energy]:"",d.moved!=null?["hasn't moved yet","moved a little","moved"][d.moved]:""].filter(Boolean).join(", ")||"no check in yet";})()+".\n\n"+
"WHAT AURA KNOWS ABOUT HER: name: "+(p.name||"unknown")+". Time right now: "+mins+" minutes. Has at home (water, paper, pen assumed): "+ownedNames().join(", ")+". "+personalText().replace(/\n/g,". ")+". "+"Prefers language that is "+p.tone+" (grounded = practical, mystical = more spell language).\n\n"+
"HER RECENT ARCHIVE (newest first):\n"+recent+"\n\n"+
"WHAT AURA REMEMBERS:\n"+mem.text+"\n\n"+
"AURA'S LEDGER (long-term memory of her life):\n"+ledgerText()+"\n\n"+
"WHAT HAS WORKED FOR HER (from how she felt after each ritual):\n"+workedText()+"\n\n"+
"HER MOST RELEVANT AND MOST RECENT ENTRIES (newest first). Match the most similar past moment by MEANING, not shared words. 'My sister keeps walking over me' and 'I'm tired of her ignoring my limits' are the same situation:\n"+(memOn()?historyText(text):"(memory is off)")+"\n\n"+
"WHAT SHE HAS TOLD AURA LATELY (newest first, with what came of it):\n"+(memOn()?asksText():"(memory is off)")+"\n\n"+
"RITUALS SHE HAS ALREADY DONE TODAY: "+ritualsToday()+"\n"+
"GUARDIANS SHE HAS BEEN WITH THIS WEEK: "+(Object.entries(S.entries.filter(e=>Date.now()-e.ts<7*864e5&&e.guardian).reduce((c,e)=>(c[e.guardian]=(c[e.guardian]||0)+1,c),{})).map(([g,n])=>(G[g]?G[g].name:g)+" "+n).join(", ")||"none")+". RELEASE RITUALS THIS WEEK: "+releaseThisWeek()+".\n"+
"MAKE IT PERSONAL: whenever she has any history, your aura line must include one sentence that could only be said to her, drawn from what she told you or did (for example: You said yesterday you were trying to stop carrying work into bed. Let's keep that promise tonight). If she has been with the same guardian twice or more this week, say what that tells you. If she has already done release work twice and the thread is still unresolved, do not prescribe more release: recommend a decision or an action and say why.\n\n"+
"BE A CONTINUITY ENGINE, NOT A RECOMMENDER. Connect tonight to where she has been, what she tried and what helped. Example of the voice: This sounds like the same work situation you brought me twice last week. The first time Lily helped you calm down. The second time you wrote that calming down wasn't the real issue because you still hadn't said no. So I don't think we're doing Lily tonight. I'm taking you to Thistle. Prefer what has actually helped her. Avoid what didn't move it unless you say why this time is different.\n\n"+
"Do not explain who the guardian is in your aura line. The app adds that introduction itself.\n"+"MEMORY IS THE POINT. She should never have to explain herself twice. Use what you remember out loud when it's relevant: count how often a theme has come up, quote her own past words, name the ritual and date. If a theme keeps repeating, give her something different from what she has already done and say so. If her usual pattern (for example reaching for release) is not what this moment needs, say it plainly, like: You usually reach for release when this happens. I don't think you need another release ritual tonight. I think this is a boundary. Only reference memories listed above. Never invent past entries, dates or quotes.\n\n"+
"RITUAL SHORTLIST (id | guardian | title | minutes | needs). Choose from these; compose only if none fits:\n"+catalog+"\n\n"+
"SHE SAYS: \""+text.replace(/"/g,"'")+"\"\n\n"+
"YOU ARE THE FRONT DOOR. She never has to know how the app is organized. Choose the right NEXT ACTION, not always a ritual. action is one of: ritual (a practice fits), talk (she needs to think it through with the guardian first), write (one honest sentence would do more than a ritual; give the exact prompt), rest (she has already done enough today or is depleted; tell her plainly, like: You've done enough today. I'm not giving you another ritual. Go sleep. I'll hold this until tomorrow. Recommending nothing is allowed and often the most caring choice), revisit (something she already wrote holds the answer; give revisitId), simplify (she can't think or is flooded; one tiny grounding action, nothing else), circle (there are genuinely two or three ways to see this; give 2 or 3 guardians and one sentence each on how they see it), decide (she is weighing a decision; never decide for her), event (a life transition like a move, breakup, new job, loss or birthday that needs a short path of 3 to 5 steps; use library ritual ids where possible), build (she asked you to create a ritual; compose it). Then choose the guardian and, for ritual, the best ritual id from the library.\n"+
"OPEN PROMISES SHE MADE TO HERSELF: "+(openPromises().map(p=>fmtDate(p.ts)+": "+p.text).join(" | ")||"none")+"\n"+
"If she states something she intends to do, offer to hold her to it in the promise field (her words, short).\n"+
"TONIGHT VERSUS TOMORROW: when she is upset and still activated, decide what is for tonight (calming, releasing, resting) and what is a problem to solve later. Say it plainly in your aura line, for example: This doesn't sound like a problem you need to solve tonight. You're angry and still activated. Then fill tomorrow with what you'll check.\n"+
"Name the ongoing thread this belongs to in 1 to 3 words, reusing an existing thread if it fits. Existing threads: "+(threadsOf().map(x=>x[0]).join(", ")||"none yet")+". Then choose the guardian and, for ritual, the best ritual id from the library. Only compose a new ritual if nothing in the library fits her time, materials or situation; composed rituals use only what she has, 4 to 6 steps, one spoken line.\n"+
"If she mentions wanting to hurt herself, not wanting to be alive, wanting to hurt someone else, or someone hurting or threatening her, set care to true, choose aura, choose ritual anchor, and make the reading gentle, loving and plain: tell her she matters, that she is not alone, and to reach a real person now (call or text 988 in the US; 911 if anyone is in immediate danger; for someone hurting her, the National Domestic Violence Hotline). Never shame her for what she feels.\n"+
"Reply with ONLY JSON in this shape:\n"+
'{"action":"ritual","thread":"Work boundary","promise":"optional: something she said she will do, in her words, or null","circle":"only for circle: [{\"guardian\":\"fern\",\"view\":\"one sentence\"}]","plan":"only for event: {\"title\":\"A new home\",\"steps\":[{\"ritualId\":\"threshold-reset\",\"note\":\"one sentence\"}]}","writePrompt":"only for write: the one sentence she should finish, like: The thing I haven\'t said to her is...","revisitId":"only for revisit: the entry id","guardian":"thistle","aura":"1 or 2 sentences in AURA\'s own voice: show what you remember when it matters, then hand her off, ending with a line like That\'s Thistle\'s work.","ritualId":"salt-line","composed":null,"reading":"2 to 4 sentences spoken directly to her in the CHOSEN GUARDIAN\'s own voice, using their rhythm and phrases","memoryId":"the id of the most similar past moment if bringing it back would help, else null","memoryQuestion":"if memoryId is set, one short question in the guardian\'s voice, like Do you want to work from there or start fresh?","why":"two or three short sentences in three layers: NOW (time of day, moon, season, a date coming up), YOU (what you know about her life from her history: how long she has carried this, what helped or didn\'t last time, her habits; required whenever there is any history), THIS (why this exact practice: its length, whether it asks her to write, whether it closes or opens something). Example: It\'s late and you\'ve had three heavy evenings this week. You\'ve been trying to stop carrying work into bedtime. Threshold Reset closes the day without asking you to process everything tonight.","tomorrow":"if something stays unresolved, what you will ask her tomorrow, in a few words, like: whether the boundary itself still needs attention. Otherwise null","theme":"one word theme","care":false}\n'+
'If composing: "ritualId":null,"composed":{"title":"...","min":8,"el":"Fire","purpose":"...","needs":["salt"],"steps":[{"t":"short title","d":"one or two sentences","say":"optional spoken line"}],"secret":"one line on why it works","prompts":["reflection question","reflection question"]}';
  try{
    if(inflight)inflight.abort(); inflight=new AbortController();
    const out=await aiJSON(prompt,inflight.signal);bump("read");
    const gk=(out&&okG(out.guardian))||"aura";
    let r=out&&out.ritualId&&byId[out.ritualId];if(r&&!canUse(r))r=null;
    if(!r&&out&&out.composed&&Array.isArray(out.composed.steps)&&out.composed.steps.length){
      const c=out.composed;
      r={id:"composed-"+Date.now(),g:gk,title:String(c.title||"A ritual for tonight"),el:String(c.el||G[gk].element),moon:"Any",min:Number(c.min)||mins,
         purpose:String(c.purpose||""),needs:(c.needs||[]).map(n=>[String(n),String(n)]),steps:c.steps.slice(0,7).map(x=>({t:String(x.t||""),d:String(x.d||""),say:x.say?String(x.say):undefined})),
         secret:String(c.secret||""),prompts:Array.isArray(c.prompts)&&c.prompts.length?c.prompts.map(String):["What came up?","What will you do with it?"],tags:[],composed:true};
    }
    if(!r)r=byId.anchor;
    const me=out.memoryId&&S.entries.find(e=>e.id===out.memoryId);
    const memory=me&&quoteOf(me)?{id:me.id,quote:quoteOf(me),date:fmtDate(me.ts),ritualTitle:me.ritualTitle,moon:me.moon||"",question:clean(out.memoryQuestion||"Do you want to work from there, or start fresh?")}:null;
    let act=["ritual","talk","write","rest","revisit","simplify","circle","decide","event","build"].includes(out.action)?out.action:"ritual";
    const circle=Array.isArray(out.circle)?out.circle.filter(c=>c&&G[c.guardian]&&allowedG(c.guardian)).slice(0,3).map(c=>({guardian:c.guardian,view:clean(c.view||"")})):[];
    if(act==="circle"&&circle.length<2)act="ritual";
    let plan=null;if(act==="event"&&out.plan&&Array.isArray(out.plan.steps)){plan={title:clean(out.plan.title||"Your path"),steps:out.plan.steps.slice(0,6).map(st=>({ritualId:byId[st.ritualId]&&canUse(byId[st.ritualId])?st.ritualId:null,title:byId[st.ritualId]?byId[st.ritualId].title:clean(st.title||""),note:clean(st.note||"")}))};}
    if(act==="event"&&!plan){const ev=lifeEventFor(text);if(ev)plan={title:ev.title,steps:ev.steps.map(([id,note])=>({ritualId:id,title:byId[id]?byId[id].title:"",note}))};else act="ritual";}
    if(act==="build"&&!(r&&r.composed))act="ritual";
    const rv=act==="revisit"&&out.revisitId&&S.entries.find(e=>e.id===out.revisitId);
    return {circle,plan,thread:clean(out.thread||"").slice(0,40),promise:out.promise&&out.promise!=="null"?clean(out.promise).slice(0,200):"",action:act==="revisit"&&!rv?"ritual":act,writePrompt:clean(out.writePrompt||""),revisit:rv?rv.id:null,guardian:gk,ritual:r,aura:clean(out.aura||("That's "+G[gk].name+"'s work.")),memory,reading:clean(out.reading||G[gk].phrases[0]),why:esc(clean(out.why||"")),tomorrow:out.tomorrow&&out.tomorrow!=="null"?clean(String(out.tomorrow)).slice(0,160):"",theme:String(out.theme||THEME[gk]).toLowerCase().slice(0,24),care:!!out.care,source:"aura"};
  }catch(e){
    if(e&&e.code==="cancelled")throw e;
    const c0=e&&e.code;
    if(c0==="adult_confirmation_required")throw {code:"needs_birthday"};
    if(MODE==="web"&&!["signin","limit","not_granted"].includes(c0))throw {code:"ai_down"};
    const res=localRead(text,mins);const c=e&&e.code;
    res.note=c==="signin"&&!accountsOn()?"":c==="signin"?"Sign in, it's free, and I can give you my full reading. This one comes from the Archive's own index. Aura":c==="limit"?"That's today's free readings from me, so this one comes from the Archive's own index. In the Inner Circle, we get much more time together. Aura":c==="not_granted"?"Aura's deeper reading is off for this view, so this one comes from the Archive's own index.":"";
    res.limit=c==="limit";res.signin=c==="signin"&&accountsOn();
    return res;
  }
}
const clean=s=>String(s).replace(/\s*[\u2012\u2013\u2014\u2015\u2212]\s*/g,", ").replace(/\s+--?\s+/g,", ");

/* ------------------------------------------------------------------
   TODAY
------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   FRONT DOOR: Aura knows the product map, so she doesn't have to.
------------------------------------------------------------------ */
if(!S.promises)S.promises=[];
if(!S.later)S.later=[];
if(!S.myRituals)S.myRituals=[];
if(!S.cart)S.cart=[];
if(!S.misses)S.misses={};
if(!S.plans)S.plans=[];
if(!S.decide)S.decide={};
for(const r of S.myRituals){if(!byId[r.id]){R.push(r);byId[r.id]=r;}}
const uid=()=>"x"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const usable=e=>!e.private;
function openPromises(){return S.promises.filter(p=>p.status==="open");}
function duePromise(){const now=Date.now();return openPromises().filter(p=>p.due<=now).sort((a,b)=>a.due-b.due)[0]||null;}
function dueLater(){const now=Date.now();return S.later.filter(l=>!l.done&&l.due<=now).sort((a,b)=>a.due-b.due)[0]||null;}
function activePlan(){return S.plans.find(p=>!p.done)||null;}
function persistAll(){saveLocal();remotePut("prefs");}

/* Time-aware opening question */
function auraQuestion(){
  const h=new Date().getHours(), n=S.profile.name?", "+S.profile.name:"";
  if(h>=5&&h<12)return "What do you want today to be about"+n+"?";
  if(h>=12&&h<17)return "What are you carrying today"+n+"?";
  if(h>=17&&h<22)return "What are you ready to set down tonight"+n+"?";
  return "What's still with you tonight"+n+"?";
}

/* Life events: transitions that need more than one ritual */
const LIFE_EVENTS=[
  {key:"moving",match:/\b(mov(e|ing|ed)|new (apartment|house|home|place)|closing on|first night)\b/i,title:"A new home",g:"juniper",steps:[["threshold-reset","Clear the first surface before you unpack anything else."],["whisper-sweep","Sweep out whatever the last people left behind."],["doorway-blessing","Bless the door you'll walk through every day."],["salt-line","Decide what's allowed in this home."],["ancestor-plate","Feed the new place with a meal that means home."]]},
  {key:"breakup",match:/\b(break ?up|broke up|divorce|ended things|left me|we split)\b/i,title:"After the ending",g:"sage",steps:[["burned-word","Say all of it. Then burn it."],["cord-cutting","Cut the cord that's still pulling."],["grief-bowl","Grieve it honestly, even the good parts."],["phoenix-shower","Wash off the version of you they knew."],["seed-intention","Plant what comes next."]]},
  {key:"newjob",match:/\b(new job|start(ing)? (a|my) (job|role)|first day|promotion|starting a business|launch(ing)? my)\b/i,title:"A new chapter at work",g:"sol",steps:[["first-light","Start the first morning on purpose."],["ledger","Turn the hope into three moves."],["sun-hype","Get your fire up before you walk in."],["salt-line","Decide your work boundaries early."],["victory-jar","Start keeping receipts from day one."]]},
  {key:"loss",match:/\b(died|passed away|funeral|lost my (mom|mother|dad|father|grand\w*|sister|brother|friend|dog|cat|baby))\b/i,title:"Carrying a loss",g:"willow",steps:[["grief-bowl","Give the grief somewhere to go."],["say-their-names","Say their name out loud."],["empty-chair","Say what you never got to say."],["tidewater-rest","Rest. Grief is exhausting."],["ancestor-plate","Cook something they loved."]]},
  {key:"birthday",match:/\b(my birthday|birthday (is|this)|turning \d+)\b/i,title:"A new year of you",g:"lumen",steps:[["weekly-weave","Look back at the year you just finished."],["future-letter","Write to yourself one year from now."],["mirror-honey","Say it sweeter, to yourself."],["seed-intention","Plant the year."]]}
];
function lifeEventFor(text){return LIFE_EVENTS.find(e=>e.match.test(text))||null;}

/* Fast local routing for the special cases, before the ritual picker */
function localRoute(text){
  const t=text.toLowerCase();
  if(/can'?t think|cannot think|too much|shutting down|freaking out|panic attack|can'?t breathe/.test(t))return {action:"simplify",guardian:"aura",reading:"Stop. You don't have to figure anything out right now.",aura:"I've got you. Just one thing."};
  if(/^(when did i|what have i|show me|how (many|often)|have i ever|what did i (say|write))/.test(t))return {action:"answer",guardian:"aura",...archiveSearch(text)};
  if(/\b(should i|deciding|decide|whether (to|or)|can'?t decide|torn between)\b/.test(t))return {action:"decide",guardian:"aura",reading:"Let's not decide yet. Let's separate what you want from what you're afraid of and what you think you owe.",aura:"This is a decision. I won't make it for you, but I'll help you hear yourself."};
  const ev=lifeEventFor(text);
  if(ev)return {action:"event",guardian:ev.g,plan:{title:ev.title,steps:ev.steps.map(([id,note])=>({ritualId:id,title:byId[id]?byId[id].title:"",note}))},reading:"This is a transition, and transitions need more than one ritual. I made you a path.",aura:"This is bigger than one night. That's "+G[ev.g].name+"'s work."};
  if(/\b(create|make|write|build|design) (me )?(a |my own )?ritual\b|ritual for my\b/.test(t))return {action:"build",guardian:"aura"};
  return null;
}
function archiveSearch(text){
  const ws=words(text).filter(w=>!["when","first","start","talk","written","write","said","show","time","times","ever"].includes(w));
  const hits=S.entries.filter(usable).filter(e=>{const b=((e.carrying||"")+" "+(e.text||"")+" "+(e.ritualTitle||"")+" "+(e.thread||"")).toLowerCase();return ws.some(w=>b.includes(w));}).sort((a,b)=>a.ts-b.ts);
  if(!hits.length)return {answer:"I looked through everything you've written and couldn't find that yet.",cites:[]};
  const first=hits[0],last=hits[hits.length-1];
  return {answer:"You've written about this "+hits.length+" time"+(hits.length>1?"s":"")+". The first was "+fmtDate(first.ts)+(hits.length>1?", the most recent "+fmtDate(last.ts):"")+".",cites:hits.slice(-6).reverse().map(e=>e.id)};
}
async function askArchive(question){
  const local=archiveSearch(question);
  try{
    const list=S.entries.filter(usable).slice(0,200).map(e=>"- id "+e.id+" | "+fmtDate(e.ts)+" | "+(e.thread||e.theme||"")+" | "+(e.ritualTitle||"")+" | carrying: "+(e.carrying||"").slice(0,120)+" | wrote: "+(e.text||"").slice(0,200)).join("\n");
    const out=await aiJSON("You answer questions about a person's private ritual journal, gently and precisely. Answer only from the entries below. If they don't hold the answer, say so. Quote her words briefly when useful. No em dashes.\n\nENTRIES:\n"+list+"\n\nQUESTION: "+question+'\n\nReply with ONLY JSON: {"answer":"2 to 4 sentences","citeIds":["ids of the entries you used, up to 6"]}',null);
    const cites=(out.citeIds||[]).filter(id=>S.entries.some(e=>e.id===id));
    return {answer:clean(out.answer||local.answer),cites:cites.length?cites:local.cites};
  }catch(e){return local;}
}

/* Promises and follow-through */
function addPromise(text,days,source){
  const p={id:uid(),text:text.trim().slice(0,200),ts:Date.now(),due:Date.now()+days*864e5,source:source||"",status:"open"};
  S.promises.unshift(p);persistAll();return p;
}
function checkinHTML(){
  const p=duePromise();
  if(p)return '<div class="card checkin"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura, checking back</span>On '+esc(fmtDate(p.ts))+' you said: "'+esc(p.text)+'". Did you?</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-promise="'+p.id+':done">I did it</button><button class="btn btn-ghost" data-promise="'+p.id+':later">Not yet</button><button class="btn btn-ghost" data-promise="'+p.id+':let">Let it go</button></div></div>';
  const l=dueLater();
  if(l)return '<div class="card checkin"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">You asked me to bring this back</span>'+esc(l.label)+'</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-later="'+l.id+':open">Open it</button><button class="btn btn-ghost" data-later="'+l.id+':done">Done with it</button></div></div>';
  return "";
}
function planHTML(){
  const p=activePlan(); if(!p)return "";
  const i=p.steps.findIndex(s=>!s.done); const s=p.steps[i];
  return '<div class="card"><div class="row between"><span class="label">Your path · '+esc(p.title)+'</span><span class="small muted">'+(i+1)+' of '+p.steps.length+'</span></div><h3 style="margin-top:6px">'+esc(s.title||"Next step")+'</h3><p class="small muted" style="margin-top:4px">'+esc(s.note||"")+'</p><div class="progress" style="margin-top:10px"><i style="width:'+(i/p.steps.length*100)+'%"></i></div><div class="row" style="margin-top:12px">'+(s.ritualId&&byId[s.ritualId]?'<button class="btn btn-main" data-planstep="'+p.id+':'+i+'">Begin step '+(i+1)+'</button>':'<button class="btn btn-main" data-plandone="'+p.id+':'+i+'">Mark done</button>')+'<button class="btn btn-ghost" data-plancal="'+p.id+':'+i+'">📅 Tomorrow</button><button class="btn btn-ghost" data-planend="'+p.id+'">End this path</button></div></div>';
}

/* Bring this back later */
function laterDue(opt){
  const d=new Date();
  if(opt==="tonight"){d.setHours(20,0,0,0);if(d<new Date())d.setDate(d.getDate()+1);return d.getTime();}
  if(opt==="tomorrow"){d.setDate(d.getDate()+1);d.setHours(9,0,0,0);return d.getTime();}
  if(opt==="week"){d.setDate(d.getDate()+7);d.setHours(9,0,0,0);return d.getTime();}
  if(opt==="newmoon")return Date.now()+Math.max(1,M.toNew)*864e5;
  if(opt==="fullmoon")return Date.now()+Math.max(1,M.toFull)*864e5;
  return Date.now()+864e5;
}
function openLaterSheet(kind,ref,label,g){
  window.__later={kind,ref,label,g};
  openSheet('<div class="stack"><div class="label">Bring this back to me</div><h2>When should Aura bring it back?</h2><p class="muted">"'+esc(label.slice(0,160))+'"</p><div class="chips">'+[["tonight","Tonight"],["tomorrow","Tomorrow morning"],["week","In a week"],["newmoon","At the new moon"],["fullmoon","At the full moon"]].map(o=>'<button class="chip" data-laterwhen="'+o[0]+'">'+o[1]+'</button>').join("")+'</div></div>');
}

/* Simplicity mode */
function openSimple(){
  track("cant_think");
  closeSheet();
  const el=document.createElement("div");el.className="simple";el.id="simple";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Just breathe");
  el.innerHTML='<div class="breath" aria-hidden="true"></div><p class="s1">Put both feet on the floor.</p><p class="s2">Breathe in while the circle grows. Out while it shrinks.</p><p class="s3">That\'s all you have to do.</p><button class="btn btn-ghost" id="simpleDone">I\'m a little better</button>';
  document.body.appendChild(el);document.body.style.overflow="hidden";
}
function closeSimple(){const el=$("#simple");if(el)el.remove();document.body.style.overflow="";}

/* Alchemy list */
function noteMiss(tag){S.misses[tag]=(S.misses[tag]||0)+1;persistAll();}
function cartOffer(r){
  const tag=missingFor(r).map(n=>n[0]).find(t=>(S.misses[t]||0)>=2&&!S.cart.some(c=>c.tag===t)&&!(S.cartNo||[]).includes(t));
  return tag?'<div class="ask"><span>You\'ve needed '+esc(NOUN[tag].replace(/^an? /,""))+' for '+S.misses[tag]+' rituals. Add it to your Alchemy list?</span><button class="chip" data-cart="'+tag+':1">Add it</button><button class="chip" data-cart="'+tag+':0">No thanks</button></div>':"";
}
function cartHTML(){
  if(!S.cart.length)return '<div class="card"><div class="label">Your Alchemy list</div><p class="small muted" style="margin-top:4px">When a ritual keeps needing something you don\'t have, Aura will offer to add it here.</p></div>';
  return '<div class="card"><div class="label">Your Alchemy list</div>'+S.cart.map(c=>'<div class="li"><span>'+esc(NOUN[c.tag]?NOUN[c.tag].replace(/^an? /,""):c.tag)+'</span><span class="row"><button class="chip" data-cartgot="'+c.tag+'">Got it</button><button class="x2" data-cartdel="'+c.tag+'" aria-label="Remove">×</button></span></div>').join("")+'</div>';
}

/* My rituals */
function saveMyRitual(r){
  const copy={...r,id:r.id.startsWith("mine-")?r.id:"mine-"+uid(),mine:true,composed:false,member:false,tags:r.tags||[],moon:r.moon||"Any"};
  if(!byId[copy.id]){R.push(copy);byId[copy.id]=copy;}
  if(!S.myRituals.some(x=>x.id===copy.id))S.myRituals.unshift(copy);
  persistAll();return copy;
}
function myRitualsHTML(){
  return '<div class="card"><div class="row between"><span class="label">My rituals</span><button class="linkish" id="writeOwn">Write your own</button></div>'+(S.myRituals.length?S.myRituals.map(r=>'<div class="li"><span><b style="font-weight:500">'+(r.family?'🌿 ':'')+esc(r.title)+'</b><br><span class="small muted">'+(r.origin?esc(r.origin):esc((G[r.g]||G.aura).name))+' · '+r.min+' min</span></span><button class="chip" data-begin="'+esc(r.id)+'">Begin</button></div>').join(""):'<p class="small muted" style="margin-top:4px">Rituals Aura writes for you, and ones you write yourself, live here.</p>')+'</div>';
}
function openWriteOwn(){
  openSheet('<div class="stack"><div class="label">Write your own ritual</div><h2>Your practice, your words.</h2><div class="field"><label for="ownTitle">Name it</label><input type="text" id="ownTitle" placeholder="Sunday Kitchen Blessing"></div><div class="field"><label for="ownSteps">Steps, one per line</label><textarea id="ownSteps" style="min-height:140px" placeholder="Light the stove candle&#10;Stir the pot clockwise three times&#10;Say who you are cooking for"></textarea></div><div class="field"><label for="ownSay">Something you say (optional)</label><input type="text" id="ownSay" placeholder="This home is fed and so am I."></div><div class="field"><label for="ownOrigin">Where does it come from? (optional)</label><input type="text" id="ownOrigin" placeholder="Grandma, every New Year\'s"></div><label class="switch" for="ownFamily">This is a family tradition<input type="checkbox" id="ownFamily"></label><div class="field"><span class="lbl">Minutes</span><div class="chips" id="ownMin">'+[5,10,15,20].map(m=>'<button class="chip" data-ownmin="'+m+'" aria-pressed="'+(m===10)+'">'+m+'</button>').join("")+'</div></div><button class="btn btn-main full" id="ownSave">Save to my rituals</button></div>');
}

/* Threads */
function threadsOf(){const c={};for(const e of S.entries)if(e.thread)c[e.thread]=(c[e.thread]||0)+1;return Object.entries(c).sort((a,b)=>b[1]-a[1]);}

/* Music: every guardian has an instrumental theme, made once and stored with the app.
   Aura's plays on Today and the main pages; a guardian's plays on their page, in their
   rituals and in their chats. Music starts only after a meaningful app action, a ritual,
   or an explicit choice in Sound. It never starts from an arbitrary tap. */
/* Spoken guardian voice (hear buttons, Guide me aloud, eyes closed, spoken ritual commands) is
   switched off for now. The code stays here behind this flag. Only the owner can try it, by
   setting localStorage "da.voiceDev" to "1". Speaking into the mic to type is separate and stays on. */
const GUARDIAN_VOICE_ENABLED=!!(window.DA_CONFIG&&window.DA_CONFIG.guardianVoiceEnabled);
function voiceEnabled(){if(GUARDIAN_VOICE_ENABLED)return true;try{return typeof ACCT!=="undefined"&&!!ACCT.admin&&localStorage.getItem("da.voiceDev")==="1";}catch(e){return false;}}
const MUSIC={a:null,b:null,cur:null,want:"aura",base:"aura",duck:false,started:false};
function musicOn(){return S.prefMusic!=="off";}
function musicVol(){const h=new Date().getHours();return (S.prefMusicVol==="normal"?0.26:0.12)*(MUSIC.duck?0.25:1)*(h>=21||h<5?0.7:1);}
function musicSrc(g){const u=window.DA_CONFIG&&window.DA_CONFIG.supabaseUrl;return u?u.replace(/\/$/,"")+"/storage/v1/object/public/music/"+g+".mp3":null;}
function fadeTo(el,v,ms,done){if(!el)return;clearInterval(el._fade);const from=el.volume,t0=Date.now();el._fade=setInterval(()=>{const k=Math.min(1,(Date.now()-t0)/ms);try{el.volume=Math.max(0,Math.min(1,from+(v-from)*k));}catch(e){}if(k>=1){clearInterval(el._fade);done&&done();}},50);}
function musicPlay(g){
  MUSIC.want=g||MUSIC.base;
  if(!musicOn()||!MUSIC.started||document.visibilityState==="hidden")return;
  if(MUSIC.cur&&MUSIC.cur._g===MUSIC.want){fadeTo(MUSIC.cur,musicVol(),600);if(MUSIC.cur.paused)MUSIC.cur.play().catch(()=>{});return;}
  const src=musicSrc(MUSIC.want);if(!src)return;
  const old=MUSIC.cur,el=new Audio();el._g=MUSIC.want;el.loop=true;el.preload="auto";el.volume=0;el.src=src;
  el.onerror=()=>{if(MUSIC.cur===el)MUSIC.cur=null;if(el._g!=="aura"&&MUSIC.want===el._g){MUSIC.want="aura";musicPlay("aura");}};
  el.onplay=()=>renderSnd();el.onpause=()=>{if(MUSIC.cur===el)renderSnd();};
  MUSIC.cur=el;el.play().then(()=>fadeTo(el,musicVol(),1800)).catch(()=>{});
  if(old)fadeTo(old,0,1500,()=>{try{old.pause();}catch(e){}});
}
function musicStop(){const el=MUSIC.cur;MUSIC.cur=null;if(el)fadeTo(el,0,800,()=>{try{el.pause();}catch(e){}});}
function musicFor(g){musicPlay(g||MUSIC.base);}
function musicBack(){musicPlay(MUSIC.base);}
function musicDuck(on){if(on&&!voiceEnabled())on=false;MUSIC.duck=!!on;if(MUSIC.cur)fadeTo(MUSIC.cur,musicVol(),on?350:1200);}
/* Browsers require a user gesture for audio. Start only from a meaningful app action,
   never because she happened to tap a field, open settings or move around the shell. */
const MUSIC_START_SEL='#askBtn,[data-begin],[data-talk],[data-talkread],[data-guardian],[data-pickcard],[data-cardask]';
function musicStart(ev){
  if(MUSIC.started||!musicOn())return;
  if(ev&&ev.type==="keydown"&&ev.key!=="Enter"&&ev.key!==" ")return;
  const t=ev&&ev.target;if(!t||!t.closest||!t.closest(MUSIC_START_SEL))return;
  MUSIC.started=true;musicPlay(MUSIC.want);
}
document.addEventListener("pointerdown",musicStart,{capture:true});
document.addEventListener("keydown",musicStart,{capture:true});
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){if(MUSIC.cur)try{MUSIC.cur.pause();}catch(e){}}else if(MUSIC.cur&&musicOn()){MUSIC.cur.play().catch(()=>{});}});

/* Sound controls on every page: music on or off, voices on or off, each separately. */
const SND_MUSIC='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="16.5" cy="16" r="2.5" fill="currentColor"/></svg>';
const SND_VOICE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
function voiceMuted(){return S.prefVoiceOff===true;}
const SND_MUTE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M17 9l5 6M22 9l-5 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
/* Main pages and the welcome screen only have music, so only the music switch shows there.
   Chats and rituals, where the guardians speak, also get the voice switch. */
function soundSheet(){
  const m=musicOn()&&(musicAudible()||!MUSIC.started),v=!voiceMuted(),soft=S.prefMusicVol!=="normal";
  const row=(lab,on,a,b,da,db)=>'<div class="sndrow"><span>'+lab+'</span><div class="chips"><button class="chip" data-sndset="'+da+'" aria-pressed="'+on+'">'+a+'</button><button class="chip" data-sndset="'+db+'" aria-pressed="'+!on+'">'+b+'</button></div></div>';
  return '<div class="stack" id="sndSheet"><div class="label">Sound</div>'+row("Music",m,"On","Off","music-on","music-off")+row("Volume",soft,"Softer","Fuller","vol-soft","vol-full")+(voiceEnabled()?row("Guardian voices",v,"On","Off","voice-on","voice-off"):'')+'<p class="small muted">Stays this way until you change it.</p></div>';
}
function openSound(){openSheet(soundSheet());}
function renderSnd(){
  document.body.classList.toggle("novoice",voiceMuted()||!voiceEnabled());
  const m=musicOn()&&(musicAudible()||!MUSIC.started),v=voiceEnabled()&&!voiceMuted(),anyOn=m||v;
  const icon=voiceEnabled()?(anyOn?SND_VOICE:SND_MUTE):(m?SND_MUSIC:SND_MUTE);
  document.querySelectorAll(".sndbar").forEach(b=>{b.innerHTML='<button class="snd one'+(anyOn?"":" off")+'" data-snd="menu" aria-label="Sound settings">'+icon+'</button>';});
  const sh=$("#sndSheet");if(sh)sh.outerHTML=soundSheet();
}
function syncSnd(){S.profile.snd={music:S.prefMusic||"on",vol:S.prefMusicVol||"normal",voiceOff:!!S.prefVoiceOff,voice:S.prefVoice||"natural"};saveLocal();try{remotePut("prefs");}catch(e){}}
function applySnd(x){if(!x)return;S.prefMusic=x.music==="off"?"off":"on";S.prefMusicVol=x.vol==="quiet"?"quiet":"normal";S.prefVoiceOff=!!x.voiceOff;S.prefVoice=x.voice==="device"?"device":"natural";if(!musicOn())musicStop();if(voiceMuted())stopAudio();renderSnd();}
function musicAudible(){return !!(MUSIC.cur&&!MUSIC.cur.paused);}
function setMusic(on){S.prefMusic=on?"on":"off";syncSnd();if(on){MUSIC.started=true;musicPlay(MUSIC.want);if(MUSIC.cur)fadeTo(MUSIC.cur,musicVol(),500);}else musicStop();renderSnd();}
function setVoice(on){S.prefVoiceOff=!on;syncSnd();if(!on){stopAudio();if(voiceOn){stopVoice();if(run)drawStep();}}renderSnd();}
new MutationObserver(()=>{if(document.querySelector(".sndbar:empty"))renderSnd();}).observe(document.documentElement,{childList:true,subtree:true});

/* Voice-guided ritual */
let voiceOn=false,vrec=null;
/* Voices: each guardian speaks in their own ElevenLabs voice on the live app. If that isn't
   available (preview, offline, daily limit), the phone's own voice takes over. */
let audioEl=null,voiceNoted=false;
const HEAR_ICON='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
function naturalVoices(){return accountsOn()&&ACCT.user;}
/* Phones ship joke voices (Cellos, Good News, Bells, Zarvox...) that sing or sound robotic.
   Never pick one of those. Use one natural voice, the best the phone has, for everyone. */
const NOVELTY=/^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|junior|kathy|organ|pipe organ|princess|ralph|superstar|trinoids|whisper|wobble|zarvox|fred|grandma|grandpa|rocko|shelley|flo|eddy|reed|sandy)\b/i;
const GOOD_VOICE=/samantha|ava|allison|susan|zoe|nicky|serena|karen|moira|tessa|kate|google us english|google uk english female|microsoft (aria|jenny|sonia|libby)|siri/i;
let _bestVoice=null;
function bestDeviceVoice(){
  if(_bestVoice)return _bestVoice;
  const all=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang)&&!NOVELTY.test(v.name));if(!all.length)return null;
  const score=v=>(GOOD_VOICE.test(v.name)?10:0)+(/enhanced|premium|natural|neural/i.test(v.name)?6:0)+(/en[-_]US/i.test(v.lang)?2:/en[-_]GB/i.test(v.lang)?1:0)+(v.default?1:0);
  _bestVoice=all.sort((a,b)=>score(b)-score(a))[0];return _bestVoice;
}
try{speechSynthesis.onvoiceschanged=()=>{_bestVoice=null;};}catch(e){}
function deviceSpeak(text,onend,g){
  try{if(!("speechSynthesis" in window)){onend&&onend();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.95;u.pitch=1;const v=bestDeviceVoice();if(v){u.voice=v;u.lang=v.lang;}u.onend=()=>onend&&onend();speechSynthesis.speak(u);}catch(e){onend&&onend();}
}
function stopAudio(){try{if(audioEl){audioEl.onended=null;audioEl.pause();}}catch(e){}audioEl=null;musicDuck(false);try{speechSynthesis.cancel();}catch(e){}document.querySelectorAll(".hear.on").forEach(b=>b.classList.remove("on"));}
async function voiceURL(g,text,cache){
  if(!ACCT.token)await api("/api/me",{}).catch(()=>{});
  const res=await fetch(((window.DA_CONFIG&&window.DA_CONFIG.apiBase)||"")+"/api/voice",{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+(ACCT.token||"")},body:JSON.stringify({g,text,cache:!!cache})});
  const ct=res.headers.get("content-type")||"";
  if(ct.includes("audio"))return URL.createObjectURL(await res.blob());
  const j=await res.json().catch(()=>({}));
  if(j.url)return j.url;
  if(j.error==="limit"&&!voiceNoted){voiceNoted=true;toast("That's today's time with the guardians' voices. The words stay on screen.");}
  else if(!voiceNoted){voiceNoted=true;toast("Voices aren't available right now, so the words stay on screen.");track("voice_fail",{why:String(j.error||res.status).slice(0,40)});}
  return null;
}
async function speak(text,onend,g,cache){
  if(voiceMuted()||!voiceEnabled())return;
  g=g||(run&&run.r.g)||"aura";stopAudio();musicDuck(true);
  const done0=onend;onend=()=>{musicDuck(false);done0&&done0();};
  if(naturalVoices()){
    try{const url=await voiceURL(g,text,cache);if(url){audioEl=new Audio(url);audioEl.onended=()=>{audioEl=null;onend&&onend();};await audioEl.play();return;}}catch(e){if(!voiceNoted){voiceNoted=true;toast("Voices aren't available right now, so the words stay on screen.");track("voice_fail",{why:"play_error"});}}
  }
  // No robot fallback. If a guardian's real voice isn't available, she reads instead.
  if(!voiceNoted){voiceNoted=true;toast("Voices aren't available right now, so the words stay on screen.");track("voice_fail",{why:"no_natural_voice"});}
  onend&&onend();
}
function speakStep(){
  if(!voiceOn||!run)return;
  const {r,i}=run;
  if(i>=r.steps.length){speak("That's the ritual. When you're ready, write down what came up.",null,r.g,true);return;}
  const s=r.steps[i];
  speak((i===0?r.title+". ":"")+s.t+". "+s.d+(s.say?" Say: "+s.say:""),()=>{if(s.hold&&voiceOn){const b=$("#holdBtn");if(b&&!b.disabled)b.click();}},r.g,true);
}
function startVoiceCommands(){
  if(!voiceEnabled())return;
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR||vrec)return;
  try{vrec=new SR();vrec.continuous=true;vrec.interimResults=false;vrec.lang=navigator.language||"en-US";
    vrec.onresult=e=>{const t=e.results[e.results.length-1][0].transcript.toLowerCase();
      if(/\bnext|ready|done\b/.test(t)){const b=$("#nextBtn");if(b)b.click();}
      else if(/\b(back|previous)\b/.test(t)){const b=$("#prevBtn");if(b)b.click();}
      else if(/\brepeat|again\b/.test(t))speakStep();
      else if(/\b(pause|stop|quiet)\b/.test(t)){try{speechSynthesis.cancel();}catch(x){}}};
    vrec.onend=()=>{if(voiceOn&&run){try{vrec.start();}catch(x){}}else vrec=null;};
    vrec.onerror=()=>{};vrec.start();}catch(e){vrec=null;}
}
function stopVoice(){voiceOn=false;stopAudio();if(vrec){try{vrec.stop();}catch(e){}vrec=null;}}

/* ------------------------------------------------------------------
   THE REST OF THE WORLD: inventory, altar, home, dates, meanings,
   seasons, yearbook, adaptive journeys, eyes-closed, calendar, push.
------------------------------------------------------------------ */
const HAVE_ADV=[["crystals","Crystals"],["incense","Incense"],["sagebundle","A sage or herb bundle"],["palosanto","Palo santo"],["essentialoils","Essential oils"],["coloredcandles","Colored or chime candles"],["driedherbs","Dried herbs"],["resin","Resin and charcoal"],["blacksalt","Black salt"],["moonwater","Moon water"],["floridawater","Florida water"],["tarot","A tarot deck"],["oracle","Oracle cards"],["pendulum","A pendulum"],["cauldron","A cauldron"],["chalice","A chalice"],["athame","A ritual knife"],["altarcloth","An altar cloth"],["bell","A bell"],["feather","A feather"],["parchment","Parchment or sigil paper"],["journal","A ritual journal"]];
Object.assign(NOUN,{crystals:"a crystal",incense:"incense",sagebundle:"a herb bundle",palosanto:"palo santo",essentialoils:"essential oil",coloredcandles:"a colored candle",driedherbs:"dried herbs",resin:"resin",blacksalt:"black salt",moonwater:"moon water",floridawater:"Florida water",tarot:"your tarot deck",oracle:"your oracle cards",pendulum:"your pendulum",cauldron:"your cauldron",chalice:"your chalice",athame:"your ritual knife",altarcloth:"your altar cloth",bell:"your bell",feather:"a feather",parchment:"parchment",journal:"your ritual journal"});
/* Advanced things she owns become the first choice for substitutions */
const ADV_ALTS={candle:["coloredcandles"],salt:["blacksalt"],bowl:["chalice","cauldron"],rosemary:["driedherbs","sagebundle"],stone:["crystals"],oil:["essentialoils"],milk:["moonwater"],vinegar:["floridawater"],thread:[],mirror:[],jar:["cauldron"],tea:["driedherbs"]};
for(const [k,v] of Object.entries(ADV_ALTS))if(SUBS[k])SUBS[k].alt=[...v,...SUBS[k].alt];
if(!S.profile.custom)S.profile.custom=[];
function ownedNames(){
  const all=[...HAVE,...HAVE_ADV];
  return [...S.profile.have.map(t=>{const f=all.find(x=>x[0]===t);return f?f[1]:t;}),...S.profile.custom];
}
function subFor(tag){
  const s=SUBS[tag]; if(!s)return null;
  const own=s.alt.find(a=>S.profile.have.includes(a));
  if(own)return "your "+NOUN[own].replace(/^(an?|your) /,"");
  return s.text;
}

/* Home spaces */
if(!S.spaces)S.spaces=[{id:"front",name:"Front door",log:[]},{id:"bed",name:"Bedroom",log:[]},{id:"kitchen",name:"Kitchen",log:[]},{id:"altar",name:"Altar",log:[]}];
function spacesHTML(){
  return '<div class="card"><div class="row between"><span class="label">Your home</span><button class="linkish" id="addSpace">Add a space</button></div><p class="small muted" style="margin-top:4px">Aura remembers what\'s been done in each room.</p>'+
   S.spaces.map(sp=>{const last=sp.log[0];const days=last?Math.floor((Date.now()-last.ts)/864e5):null;
     return '<div class="li"><span><b style="font-weight:500">'+esc(sp.name)+'</b><br><span class="small muted">'+(last?esc(last.title)+' · '+(days===0?"today":days+" day"+(days===1?"":"s")+" ago"):"Nothing yet")+'</span></span><span class="row"><button class="chip" data-tend="'+sp.id+'">Tend it</button><button class="x2" data-delspace="'+sp.id+'" aria-label="Remove '+esc(sp.name)+'">×</button></span></div>';}).join("")+'</div>';
}
function spaceText(){return S.spaces.map(sp=>sp.name+": "+(sp.log[0]?sp.log[0].title+" "+fmtDate(sp.log[0].ts):"nothing yet")).join("; ");}
function tendRitual(sp){
  const n=sp.name.toLowerCase();
  const pref=/door|entry|porch/.test(n)?["doorway-blessing","salt-line","jar-returning"]:/bed/.test(n)?["tidewater-rest","dream-bowl","green-nap"]:/kitchen/.test(n)?["ancestor-plate","threshold-reset","slow-tea"]:/altar/.test(n)?["circle-sealing","weekly-weave","threshold-reset"]:/office|desk|work/.test(n)?["ledger","four-count","threshold-reset"]:["threshold-reset","whisper-sweep","doorway-blessing"];
  const ok=pref.map(id=>byId[id]).filter(r=>r&&canUse(r));
  const fresh=ok.filter(r=>!sp.log.some(l=>l.id===r.id&&Date.now()-l.ts<14*864e5));
  return (fresh[0]||ok[0]||byId["threshold-reset"]);
}

/* Dates that matter */
if(!S.dates)S.dates=[];
function nextOccur(d){const now=new Date();let t=new Date(now.getFullYear(),d.month-1,d.day);if(t<new Date(now.getFullYear(),now.getMonth(),now.getDate()))t=new Date(now.getFullYear()+1,d.month-1,d.day);return t;}
function upcomingDates(days){const now=new Date(now0());return S.dates.map(d=>({...d,next:nextOccur(d)})).filter(d=>(d.next-now)/864e5<=days).sort((a,b)=>a.next-b.next);}
function now0(){const n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime();}
function dateCardHTML(){
  const d=upcomingDates(3)[0]; if(!d)return "";
  const inDays=Math.round((d.next-new Date(now0()))/864e5), yrs=d.year?d.next.getFullYear()-d.year:null;
  const when=inDays===0?"Today":inDays===1?"Tomorrow":d.next.toLocaleDateString(undefined,{weekday:"long"});
  return '<div class="card checkin"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">A date that matters</span>'+esc(when)+' is '+esc(d.name)+(yrs?', '+yrs+' year'+(yrs===1?'':'s'):'')+'. Want something to mark it?</p></div><button class="btn btn-main" style="margin-top:10px" data-markdate="'+d.id+'">Mark it with Aura</button></div>';
}

/* Personal meanings and seasons */
if(!S.corr)S.corr=[];
if(!S.pseason)S.pseason=null;
function personalText(){
  return "WHAT THINGS MEAN TO HER PERSONALLY (use these over traditional correspondences): "+(S.corr.map(c=>c.symbol+" = "+c.meaning).join("; ")||"none yet")+"\n"+
    "HER PERSONAL SEASON: "+(S.pseason?S.pseason.name+" since "+fmtDate(S.pseason.start):"none named")+"\n"+
    "DATES THAT MATTER COMING UP: "+(upcomingDates(14).map(d=>d.name+" on "+d.next.toDateString()).join("; ")||"none")+"\n"+
    "HER HOME: "+spaceText()+"\n"+
    (S.profile.bday?"HER SIGN: "+signOf(S.profile.bday).name+" (birthday "+mdText(S.profile.bday)+"). Mention astrology lightly and only when it adds something.\n":"")+
    (S.profile.person?"ON HER HEART: "+personLine()+" Love and sex rituals and advice should fit this, not the other.\n":"")+
    "EVERYTHING SHE OWNS FOR RITUAL (prefer these, including advanced tools): "+(ownedNames().join(", ")||"basics only");
}

/* The altar: her active work, made visible */
function altarItems(){
  const c=openPromises().slice(0,5).map(p=>({kind:"candle",label:p.text,id:p.id}));
  const rel=S.entries.filter(e=>usable(e)&&Date.now()-e.ts<30*864e5&&/release|burn|cut|let go|sweep|dissolve|forgive|last straw/i.test(e.ritualTitle+" "+(e.theme||""))).slice(0,4).map(e=>({kind:"bowl",label:e.ritualTitle+(e.carrying?": "+e.carrying:""),id:e.id}));
  const grow=[...S.plans.filter(p=>!p.done).map(p=>({kind:"plant",label:"Path: "+p.title,id:p.id})),...S.entries.filter(e=>usable(e)&&/seed|intention|future|vision|ledger/i.test(e.ritualId||"")&&Date.now()-e.ts<45*864e5).slice(0,3).map(e=>({kind:"plant",label:e.ritualTitle+(e.text?": "+e.text.slice(0,80):""),id:e.id}))];
  const stones=(ledger().boundaries||[]).slice(0,5).map((b,i)=>({kind:"stone",label:b,id:"b"+i}));
  return {c,rel,grow,stones};
}
function altarSVG(){
  const a=altarItems(), W=340,H=200;
  let g='<rect x="10" y="130" width="320" height="16" rx="3" fill="#3A2B55" stroke="rgba(231,196,90,.5)"/><path d="M30 146 L40 190 M310 146 L300 190" stroke="rgba(231,196,90,.35)" stroke-width="3"/><rect x="40" y="118" width="260" height="14" fill="#BF1E73" opacity=".35"/>';
  a.c.forEach((it,i)=>{const x=60+i*26,h=38+(i%2)*10;g+='<g data-altar="candle" style="cursor:pointer"><rect x="'+(x-6)+'" y="'+(130-h)+'" width="12" height="'+h+'" rx="2" fill="#F3EAD3"/><path d="M'+x+' '+(130-h-4)+' q-6 -10 0 -18 q6 8 0 18z" fill="#F4BE3A"><animate attributeName="opacity" values="1;.7;1" dur="'+(1.6+i*.3)+'s" repeatCount="indefinite"/></path></g>';});
  if(a.rel.length)g+='<g data-altar="bowl" style="cursor:pointer"><path d="M200 110 q30 26 60 0z" fill="#3A8484" stroke="#5CC0B5"/><ellipse cx="230" cy="110" rx="30" ry="5" fill="#5CC0B5" opacity=".6"/></g>';
  if(a.grow.length)g+='<g data-altar="plant" style="cursor:pointer"><rect x="276" y="98" width="24" height="20" rx="3" fill="#583A20"/><path d="M288 98 v-26 M288 84 q-14 -6 -16 -18 q14 2 16 18 M288 78 q12 -6 14 -18 q-12 2 -14 18" stroke="#7DC27A" stroke-width="3" fill="#7DC27A"/></g>';
  a.stones.forEach((it,i)=>{g+='<ellipse data-altar="stone" style="cursor:pointer" cx="'+(190-i*14)+'" cy="124" rx="7" ry="5" fill="#8E86A6"/>';});
  if(!a.c.length&&!a.rel.length&&!a.grow.length&&!a.stones.length)g+='<text x="170" y="80" text-anchor="middle" font-family="IM Fell English, Georgia, serif" font-size="15" fill="#C9C1D9">Your altar fills as you do the work.</text>';
  return '<svg class="altarsvg" viewBox="0 40 '+W+' '+(H-40)+'" role="img" aria-label="Your altar">'+g+'</svg>';
}
function altarHTML(){
  const a=altarItems();
  return '<div class="card"><div class="label">Your altar</div><p class="small muted" style="margin-top:4px">Everything here means something. Candles are open promises. The bowl holds what you\'re releasing. The plant is what you\'re growing. Stones are boundaries you set. Tap any of them.</p>'+altarSVG()+
   '<div class="chips" style="margin-top:6px">'+[["candle","Candles",a.c.length],["bowl","Releasing",a.rel.length],["plant","Growing",a.grow.length],["stone","Boundaries",a.stones.length]].map(x=>'<button class="chip" data-altar="'+x[0]+'">'+x[1]+' · '+x[2]+'</button>').join("")+'</div></div>';
}
function openAltarItems(kind){
  const a=altarItems(), list={candle:a.c,bowl:a.rel,plant:a.grow,stone:a.stones}[kind]||[];
  const title={candle:"Candles: promises you're keeping",bowl:"The bowl: what you're releasing",plant:"The plant: what you're growing",stone:"Stones: boundaries you set"}[kind];
  openSheet('<div class="stack"><div class="label">Your altar</div><h2>'+esc(title)+'</h2>'+(list.length?list.map(it=>'<div class="li"><span>'+esc(it.label)+'</span>'+(kind==="candle"?'<button class="chip" data-promise="'+it.id+':done">Kept it</button>':(kind==="bowl"||kind==="plant")&&S.entries.some(e=>e.id===it.id)?'<button class="chip" data-entry="'+it.id+'">Open</button>':'')+'</div>').join(""):'<p class="muted">Nothing here yet. It fills as you do the work.</p>')+'</div>');
}

/* Tasks from reflection */
function taskGuess(text){
  const m=String(text||"").match(/(?:^|[.!?]\s*)([^.!?]*\b(?:tomorrow|tonight|this week|need to|have to|going to|i will|i'll|gotta)\b[^.!?]{3,90})/i);
  return m?m[1].trim().replace(/^(and|so|but)\s+/i,""):"";
}

/* Calendar file (.ics) */
function icsFile(title,start,desc){
  const f=d=>new Date(d).toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"");
  const s=new Date(start), e=new Date(s.getTime()+30*60000);
  const esc2=t=>String(t||"").replace(/[\\;,]/g,m=>"\\"+m).replace(/\n/g,"\\n");
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//The Daily Alchemist//EN","BEGIN:VEVENT","UID:"+uid()+"@dailyalchemist","DTSTAMP:"+f(Date.now()),"DTSTART:"+f(s),"DTEND:"+f(e),"SUMMARY:"+esc2(title),"DESCRIPTION:"+esc2(desc||"From The Daily Alchemist"),"BEGIN:VALARM","TRIGGER:-PT15M","ACTION:DISPLAY","DESCRIPTION:"+esc2(title),"END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
}
async function saveFile(filename,data,type){
  if(MODE==="artifact"){try{const dl=await window.claude.use("downloads");if(!dl){toast("Saving files isn't available in this view.");return;}await dl.save({filename,data});}catch(e){}return;}
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:type||"text/plain"}));a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);
}
function addToCalendar(title,when,desc){
  const d=new Date(when);if(d.getHours()<7||d.getHours()>21)d.setHours(19,0,0,0);
  saveFile("daily-alchemist-"+title.toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,40)+".ics",icsFile(title,d,desc),"text/calendar");
}

/* Adaptive journeys: tomorrow adjusts to how today went */
/* Journeys adapt: a missed day never means starting over, and if she sounds depleted today
   the next day gets gentler instead of harder. */
function depletedNow(){
  if(typeof lowTank==="function"&&lowTank())return true;
  const day=Date.now()-24*3600e3;
  if(S.asks.some(a=>a.ts>day&&(["fern","juniper","willow"].includes(a.guardian)||a.action==="rest"||/\b(tired|exhausted|drained|depleted|burn(ed|t)? ?out|no energy|wiped|worn out|can'?t (do|handle) (it|this|anything))\b/i.test(a.text||""))))return true;
  const le=S.entries[0];return !!(le&&le.ts>day&&["Tender","Stirred up"].includes(le.after));
}
function gentle(r){const st=r.steps.length<=3?r.steps:[r.steps[0],r.steps[Math.floor(r.steps.length/2)],r.steps[r.steps.length-1]];return {...r,steps:st,min:Math.max(3,Math.ceil(r.min/2)),gentle:true};}
function adaptAll(prevAfter,r,missed,dayN){
  const base=adaptDay(prevAfter,r),dep=depletedNow(),parts=[];
  if(missed>=1)parts.push(missed===1?"You missed yesterday.":"It's been "+(missed+1)+" days.");
  if(dep){base.r=gentle(base.r);parts.push("Today you sound depleted, so I made Day "+dayN+" shorter and gentler: "+base.r.min+" minutes, "+base.r.steps.length+" steps.");}
  if(missed>=1)parts.splice(1,0,"We're not starting over.");
  if(missed>=1&&base.note)base.note=base.note.replace(/^Yesterday/,"Last time").replace("so Aura swapped tonight's ritual","so I swapped this one");
  if(parts.length)base.note=parts.join(" ")+(base.note&&!dep?" "+base.note:"");
  return base;
}
function daysSince(ts){if(!ts)return 0;return Math.floor((new Date(dayKey(new Date())).getTime()-new Date(dayKey(new Date(ts))).getTime())/864e5);}
function adaptDay(prevAfter,r){
  if(!prevAfter)return {r,note:""};
  if(prevAfter==="Stirred up")return {r,note:"Last time stirred you up. Start with two slow minutes before this one.",settle:true};
  if(prevAfter==="The same"){
    const alt=R.filter(z=>canUse(z)&&z.g===r.g&&z.id!==r.id&&!z.reset&&!doneRecently(z.id,14))[0]||R.filter(z=>canUse(z)&&z.g===(KIN[r.g]||r.g)&&z.id!==r.id&&!z.reset)[0];
    if(alt)return {r:alt,note:"Yesterday didn't move it, so Aura swapped tonight's ritual."};
  }
  if(GOOD.includes(prevAfter))return {r,note:"Yesterday helped. Keep going."};
  return {r,note:""};
}
function journeyStep(j,n){
  const base=byId[j.days[n-1][0]];
  const prev=S.entries.filter(e=>e.journey===j.id&&e.jday===n-1).sort((a,b)=>b.ts-a.ts)[0];
  return adaptAll(prev&&prev.after,base,prev?Math.max(0,daysSince(prev.ts)-1):0,n);
}

/* Go-to rituals, from what actually worked */
function goTos(){return Object.entries(outcomes()).filter(([id,o])=>o.good>=3&&byId[id]&&!byId[id].mine).map(([id,o])=>({id,o}));}
function goToHTML(){
  const g=goTos(); if(!g.length)return "";
  return '<div class="card"><div class="label">Your go-to rituals</div><p class="small muted" style="margin-top:4px">These keep working for you. Make one your own and Aura will reach for it first.</p>'+g.map(x=>'<div class="li"><span>'+esc(x.o.title)+'<br><span class="small muted">Helped '+x.o.good+' of '+x.o.n+' times</span></span><button class="chip" data-makemine="'+esc(x.id)+'">Make it mine</button></div>').join("")+'</div>';
}

/* Before and after for a thread */
function beforeAfterHTML(thread){
  const es=S.entries.filter(e=>usable(e)&&e.thread===thread&&e.text).sort((a,b)=>a.ts-b.ts);
  if(es.length<2)return "";
  const a=es[0],b=es[es.length-1];
  return '<div class="card"><div class="label">'+esc(thread)+': then and now</div><div class="ba"><div><div class="small muted">'+fmtDate(a.ts)+'</div><blockquote>"'+esc(quoteOf(a))+'"</blockquote></div><div><div class="small muted">'+fmtDate(b.ts)+'</div><blockquote>"'+esc(quoteOf(b))+'"</blockquote></div></div><p class="small muted" style="margin-top:8px">'+es.length+' entries on this thread. People rarely notice their own change while it\'s happening.</p></div>';
}

/* Yearbook: a private, written record of a stretch of time */
async function openYearbook(span){
  const days=span==="year"?365:span==="season"?91:31, cut=Date.now()-days*864e5;
  const es=S.entries.filter(e=>e.ts>cut), pub=es.filter(usable);
  const gc={};for(const e of es)gc[e.guardian]=(gc[e.guardian]||0)+1;
  const topG=Object.entries(gc).sort((a,b)=>b[1]-a[1]).slice(0,3).map(x=>(G[x[0]]||G.aura).name);
  const th={};for(const e of es)if(e.thread)th[e.thread]=(th[e.thread]||0)+1;
  const topT=Object.entries(th).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
  const kept=S.promises.filter(p=>p.status==="done"&&p.doneAt>cut).length;
  const helped=Object.values(outcomes()).filter(o=>o.good).sort((a,b)=>b.good-a.good).slice(0,3).map(o=>o.title);
  const strongest=pub.filter(e=>e.text).sort((a,b)=>b.text.length-a.text.length)[0];
  const label={month:"This month",season:"This season",year:"This year"}[span];
  let h='<div class="stack yearbook"><div class="label">Alchemy '+esc(label.toLowerCase())+'</div><h2>'+esc(label)+' in your Archive</h2>'+
    '<div class="stats"><div class="stat"><div class="v">'+es.length+'</div><div class="k">Rituals</div></div><div class="stat"><div class="v">'+kept+'</div><div class="k">Promises kept</div></div><div class="stat"><div class="v">'+topT.length+'</div><div class="k">Threads</div></div></div>'+
    '<div id="ybText" class="voice" style="font-size:18px">'+(es.length?"Aura is writing your reflection...":"Not enough here yet. Come back after a few rituals.")+'</div>'+
    (topG.length?'<p><b>Walked with:</b> '+esc(topG.join(", "))+'</p>':'')+(topT.length?'<p><b>Threads:</b> '+esc(topT.join(", "))+'</p>':'')+(helped.length?'<p><b>What helped:</b> '+esc(helped.join(", "))+'</p>':'')+
    (strongest?'<div class="card memory"><div class="label">Your strongest words · '+fmtDate(strongest.ts)+'</div><blockquote>"'+esc(strongest.text.slice(0,300))+'"</blockquote></div>':'')+'</div>';
  openSheet(h);
  if(!es.length)return;
  const fallback="You showed up "+es.length+" time"+(es.length===1?"":"s")+(topT.length?", mostly around "+topT.slice(0,2).join(" and "):"")+"."+(kept?" You kept "+kept+" promise"+(kept===1?"":"s")+" to yourself.":"")+(helped.length?" "+helped[0]+" helped most.":"");
  try{
    const out=await aiJSON("Write a private, beautifully written reflection on this stretch of a person's ritual practice. Not a stats recap and not cheesy. Second person, warm, grounded, 4 to 6 sentences, no em dashes. Name recurring themes, what she released, what she kept, what helped and how she changed, using her own words where possible.\n\nPERIOD: "+label+"\nENTRIES:\n"+pub.slice(0,80).map(e=>"- "+fmtDate(e.ts)+" | "+(e.thread||e.theme||"")+" | "+e.ritualTitle+" | carrying: "+(e.carrying||"").slice(0,100)+" | wrote: "+(e.text||"").slice(0,160)+" | after: "+(e.after||"")).join("\n")+"\nPROMISES KEPT: "+S.promises.filter(p=>p.status==="done"&&p.doneAt>cut).map(p=>p.text).join("; ")+"\nLEDGER:\n"+ledgerText()+'\n\nReply with ONLY JSON: {"reflection":"..."}',null,{tier:"deep"});
    const el=$("#ybText");if(el)el.textContent=clean(out.reflection||fallback);
  }catch(e){const el=$("#ybText");if(el)el.textContent=fallback;}
}

/* Eyes-closed mode: sound, vibration, no screen */
let eyes=false, eyesTimer=null, actx=null;
function tone(f){try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();const o=actx.createOscillator(),g=actx.createGain();o.frequency.value=f||528;o.type="sine";g.gain.setValueAtTime(0,actx.currentTime);g.gain.linearRampToValueAtTime(.18,actx.currentTime+.2);g.gain.exponentialRampToValueAtTime(.001,actx.currentTime+2.2);o.connect(g);g.connect(actx.destination);o.start();o.stop(actx.currentTime+2.3);}catch(e){}try{navigator.vibrate&&navigator.vibrate(180);}catch(e){}}
function eyesStep(){
  clearTimeout(eyesTimer); if(!eyes||!run)return;
  const {r,i}=run;
  if(i>=r.steps.length){tone(396);speak("That's the ritual. Open your eyes when you're ready.",()=>{stopEyes();drawStep();});return;}
  const s=r.steps[i]; tone(i===0?432:528);
  speak((i===0?r.title+". Close your eyes. ":"")+s.d+(s.say?" Say: "+s.say:""),()=>{eyesTimer=setTimeout(()=>{if(eyes&&run){run.i++;eyesStep();}},(s.hold||20)*1000);});
}
function startEyes(){
  if(!naturalVoices()||voiceMuted()){toast("Eyes-closed mode needs the guardian voices, which aren't available right now.");return;}
  eyes=true;const el=document.createElement("div");el.className="eyes";el.id="eyes";el.innerHTML='<p>Eyes closed.</p><p class="small">Aura is guiding you aloud. Tap anywhere to stop.</p>';document.body.appendChild(el);eyesStep();
}
function stopEyes(){eyes=false;clearTimeout(eyesTimer);try{speechSynthesis.cancel();}catch(e){}const el=$("#eyes");if(el)el.remove();}

/* Notifications (live app only): meaningful, never generic */
async function enablePush(){
  const C=window.DA_CONFIG||{};
  if(MODE!=="web"||!ACCT.user){toast("Sign in on the live app to let Aura reach you.");return false;}
  if(!("serviceWorker" in navigator)||!("PushManager" in window)||!C.vapidPublicKey){toast(isNative()?"Messages from me are coming to this app in the next update.":/iPhone|iPad|iPod/.test(navigator.userAgent)?"On iPhone, first add me to your Home Screen: tap Share, then Add to Home Screen. Open me from there and turn this on.":"This browser can't receive messages from me. Try Chrome on your phone.");return false;}
  const perm=await Notification.requestPermission(); if(perm!=="granted"){toast("No problem. Aura will show things when you open the app.");return false;}
  const reg=await navigator.serviceWorker.ready;
  const key=Uint8Array.from(atob(C.vapidPublicKey.replace(/-/g,"+").replace(/_/g,"/")+"===".slice((C.vapidPublicKey.length+3)%4)),c=>c.charCodeAt(0));
  const sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:key});
  const r=await api("/api/push-subscribe",{subscription:sub.toJSON()});
  if(r.error){toast("Couldn't turn on messages. Try again later.");return false;}
  S.profile.push=true;persist("profile");toast("Aura will only reach out when it means something.");return true;
}

let lastRead=null, pickedMins=null;
const QUICK=[["Angry","angry"],["Overthinking","overthinking and can't stop"],["Exhausted","exhausted"],["Anxious","anxious"],["Stuck","stuck"],["Not enough","like I'm not enough"],["Lonely","lonely"],["Grieving","grieving"],["Need boundaries","like I need a boundary"],["Heavy space","like my space feels heavy"],["Hopeful","hopeful"],["Just off","off, and I don't know why"]];
let feelSel=[];
function feelText(){return feelSel.length?"I'm feeling "+feelSel.map(k=>(QUICK.find(q=>q[0]===k)||[k,k])[1]).join(", and ")+".":"";}
function ritualCard(r,opts){
  if(!canUse(r)){
    return '<article class="page locked"><div class="kicker">'+esc(G[r.g].name)+"'s practice · "+esc(r.el)+'</div><h3>'+esc(r.title)+'</h3><div class="facts"><span>'+r.min+' minutes</span><span>'+esc(CHAMBERS[r.g]?CHAMBERS[r.g].name:"Chamber")+'</span></div><p class="needs">'+esc(r.purpose)+'</p><div class="actions"><button class="btn btn-ink" data-paywall="'+esc(G[r.g].name)+'\'s chamber">Unlock with '+esc(PLAN.name)+'</button></div></article>';
  }
  const a=adapt(r), unk=unknownFor(r)[0];
  const needList=ritualNeeds(r),needs=needList.length?needList.map(esc).join(" · "):"Nothing but you.";
  const ownable=r.needs.filter(n=>SUBS[n[0]]&&S.profile.have.includes(n[0]));
  return '<article class="page ritualcard" data-rid="'+esc(r.id)+'" data-opts="'+esc(JSON.stringify(opts||{}))+'">'+
   '<button class="ritualguardian" data-guardian="'+esc(r.g)+'">'+glyph(r.g,42)+'<span><span class="kicker">'+esc(G[r.g].name)+"'s practice · "+esc(r.el)+(r.reset?" · Reset day "+r.reset:"")+(r.composed?" · Written for you":"")+'</span><span class="small">Open '+esc(G[r.g].name)+"'s chamber</span></span></button>"+
   '<h3>'+esc(r.title)+'</h3><p class="ritualpurpose">'+esc(r.purpose||"")+'</p><div class="facts"><span>'+r.min+' minutes</span><span>'+esc(r.moon==="Any"?"Any moon":r.moon+" moon")+'</span><span>'+r.steps.length+' steps</span></div>'+
   '<div class="needs"><b>Gather before you begin</b><div class="needchips">'+(needList.length?needList.map(n=>'<span>'+esc(n)+'</span>').join(""):'<span>Nothing but you</span>')+'</div></div>'+
   (a.notes.length?'<p class="adj">'+a.notes.map(esc).join(" ")+' The steps already say so.</p>':"")+
   cartOffer(r)+(unk?'<div class="ask"><span>Do you usually have '+esc(ASKN[unk[0]])+'?</span><button class="chip" data-own="'+unk[0]+':1">Yes</button><button class="chip" data-own="'+unk[0]+':0">No</button></div>':"")+
   whyNow(r,opts&&opts.why)+
   '<div class="actions"><button class="btn btn-ink" data-begin="'+esc(r.id)+'"'+(opts&&opts.ctx?' data-ctx="'+opts.ctx+'"':"")+'>Begin the ritual</button>'+(ownable.length?'<button class="linkish dark" data-donthave="'+esc(r.id)+'">I don\'t have that</button>':'')+'</div>'+
   (ownable.length?'<div class="dh" hidden data-dh="'+esc(r.id)+'"><span class="small">Tap what you don\'t have. Aura will rewrite the steps.</span><div class="chips">'+ownable.map(n=>'<button class="chip" data-own="'+n[0]+':0">'+esc(NOUN[n[0]])+'</button>').join("")+'</div></div>':'')+'</article>';
}
/* ------------------------------------------------------------------
   INNER CIRCLE HEADLINERS
   1. Letters from Aura: first return, then at the cadence she chooses.
      For 30 days after the free week ends, she keeps writing, but the letters stay sealed until you join.
   2. Guardians who check in on you by name, a few days after you worked with them.
------------------------------------------------------------------ */
if(!S.letters)S.letters=[];
if(!S.nudges)S.nudges=[];
const WEEK=7*864e5, GRACE_DAYS=30;
function firstName(){return (S.profile.name||"").trim().split(/\s+/)[0]||"";}
function weekEntries(since,until){until=until||Infinity;return S.entries.filter(e=>usable(e)&&e.ts>since&&e.ts<=until).sort((a,b)=>a.ts-b.ts);}
function weekChats(since,until){until=until||Infinity;const out=[];for(const k of ALL)for(const m of (S.chats[k]||[]))if(m.role==="me"&&(m.ts||0)>since&&(m.ts||0)<=until)out.push({g:k,text:m.text});return out;}
function lastLetter(){return S.letters.slice().sort((a,b)=>b.ts-a.ts)[0]||null;}
function letterSince(){const l=lastLetter();return l?l.ts:Date.now()-WEEK;}
function firstActivity(){let f=Infinity;for(const e of S.entries)if(e.ts<f)f=e.ts;for(const a of (S.asks||[]))if(a.ts&&a.ts<f)f=a.ts;for(const k of ALL)for(const m of (S.chats[k]||[]))if(m.role==="me"&&m.ts&&m.ts<f)f=m.ts;return f===Infinity?0:f;}
function contactPref(){return S.profile.contact||{enabled:null,cadence:"weekly",scope:"aura"};}
function contactDays(){return {daily:1,"3days":3,weekly:7}[contactPref().cadence]||7;}
function contactSettingsHTML(){
  const c=contactPref(),on=c.enabled===true,off=c.enabled===false;
  return '<details class="group contactprefs"><summary>Letters and check-ins</summary><p class="small muted">Choose whether Aura reaches out between visits, how often, and whether guardians can check in too. You can change this any time.</p>'+
    '<div class="label" style="margin-top:10px">Reach out to me?</div><div class="chips"><button class="chip" data-contacton="1" aria-pressed="'+on+'">Yes</button><button class="chip" data-contacton="0" aria-pressed="'+off+'">No</button></div>'+
    '<div class="label" style="margin-top:12px">How often?</div><div class="chips"><button class="chip" data-contactcad="daily" aria-pressed="'+(c.cadence==="daily")+'">Daily</button><button class="chip" data-contactcad="3days" aria-pressed="'+(c.cadence==="3days")+'">Every 3 days</button><button class="chip" data-contactcad="weekly" aria-pressed="'+(c.cadence==="weekly")+'">Weekly</button></div>'+
    '<div class="label" style="margin-top:12px">Who can reach out?</div><div class="chips"><button class="chip" data-contactscope="aura" aria-pressed="'+(c.scope==="aura")+'">Aura only</button><button class="chip" data-contactscope="circle" aria-pressed="'+(c.scope==="circle")+'">Aura + guardians</button></div>'+
    '<button class="btn btn-main full" id="contactSave" style="margin-top:12px">Save contact preferences</button></details>';
}
function firstReturnLetter(){return (S.letters||[]).find(l=>l.kind==="first-return")||null;}
/* Is she in the 30 days after her free week, when Aura still writes but the letters stay sealed? */
function graceActive(){
  if(isMember())return false;
  if(!accountsOn()&&S.previewMember===false)return true;
  const te=trialEnds();return te>0&&Date.now()>=te&&Date.now()<te+GRACE_DAYS*864e5;
}
function letterDue(){
  if(contactPref().enabled!==true)return false;
  const l=lastLetter(),gap=contactDays()*864e5;
  if(!l)return false;
  if(Date.now()-l.ts<gap-6*36e5)return false;
  const since=Math.max(letterSince(),Date.now()-gap);
  return weekEntries(since).length>0||weekChats(since).length>0;
}
function letterMaterial(since,until){
  if(!since)since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
  const es=weekEntries(since,until), ch=weekChats(since,until);
  return {es,ch,text:
    "HER NAME: "+(firstName()||"(not given)")+"\n"+
    "RITUALS AND ENTRIES SINCE THE LAST LETTER:\n"+(es.map(e=>"- "+fmtDate(e.ts)+" | "+(G[e.guardian]||G.aura).name+" | "+(e.ritualTitle||"entry")+" | carrying: "+(e.carrying||"").slice(0,140)+" | wrote: "+(e.text||"").slice(0,220)+(e.after?" | after: "+e.after:"")).join("\n")||"(none)")+"\n"+
    "WHAT SHE TOLD GUARDIANS SINCE THE LAST LETTER:\n"+(ch.slice(-10).map(c=>"- to "+G[c.g].name+": "+c.text.slice(0,160)).join("\n")||"(nothing)")+"\n"+
    "LONG-TERM MEMORY:\n"+ledgerText()+"\n"+
    "WHAT HAS WORKED FOR HER:\n"+workedText()+"\n"+
    "PAST LETTERS (do not repeat them): "+(S.letters.filter(l=>!l.sealed).slice(0,2).map(l=>l.title).join("; ")||"none")};
}
function namesList(ks){const nm=ks.map(g=>G[g].name);return nm.length>1?nm.slice(0,-1).join(", ")+" and "+nm[nm.length-1]:(nm[0]||"");}
function localLetter(m){
  const n=firstName(), es=m.es;
  const gs=[...new Set(es.map(e=>e.guardian).filter(g=>g&&g!=="aura"))];
  const good=es.filter(e=>GOOD.includes(e.after));
  const carried=es.map(e=>e.carrying).filter(Boolean);
  const next=gs[0]||"lily";
  let t=(n?n+",\n\n":"")+"I've been keeping the thread since I last wrote. Here's what I noticed.\n\n";
  if(carried.length)t+="You came in carrying "+carried.slice(-2).map(c=>'"'+c.slice(0,80)+'"').join(" and ")+". You didn't pretend it was lighter than it was. That matters.\n\n";
  if(gs.length)t+="You spent time with "+namesList(gs)+". "+(good.length?good[good.length-1].ritualTitle+" left you "+good[good.length-1].after.toLowerCase()+", so remember that one.":"Not every ritual has to land to count. You showed up.")+"\n\n";
  else if(m.ch.length)t+="You talked things through with the circle since I last wrote. That is its own kind of ritual.\n\n";
  t+="Before I write again, I'd like you to go back to "+G[next].name+". Not to fix anything. Just to keep the thread going.\n\nI'll be here.\nAura";
  return {title:"What I noticed",letter:t,next_guardian:next,intention:"Keep the thread going."};
}
async function composeLetter(m){
  let out=null;
  try{
    out=await aiJSON("You are Aura, the lead guardian of The Daily Alchemist, a ritual and reflection app. Warm, perceptive, grounded, a little mystical, never preachy. You write each member personal letters at the cadence she chose: daily, every three days or weekly. Look back only over the time since the last letter.\n\n"+m.text+"\n\n"+
      "Write a personal letter looking back since the last letter. 170 to 260 words. Address her by first name if you have it. Be specific: name what she actually carried, what she did, what helped and what didn't, using her own words where you can. Point out one pattern or shift you noticed. Suggest one guardian to spend time with before the next letter and why, and close with one simple intention until then. Sign it Aura. Plain words, short paragraphs, no em dashes, no bullet points, no diagnosing, no therapy language. Only use what is in the material.\n"+
      'Reply with ONLY JSON: {"title":"a short, warm title for the letter, under 7 words","letter":"the full letter with \\n\\n between paragraphs","next_guardian":"one key from: '+ALL.filter(k=>k!=="aura").join(", ")+'","intention":"one short line"}',null,{tier:"deep"});
  }catch(e){out=null;}
  if(!out||!out.letter)out=localLetter(m);
  return {title:clean(String(out.title||"From Aura")).slice(0,80),text:clean(String(out.letter)),next:G[out.next_guardian]&&out.next_guardian!=="aura"?out.next_guardian:null,intention:clean(String(out.intention||"")).slice(0,160)};
}
async function writeLetter(){
  const since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
  const L={id:"let_"+Date.now(),ts:Date.now(),since,until:Date.now(),...(await composeLetter(letterMaterial(since)))};
  S.letters.unshift(L);S.letters=S.letters.slice(0,60);saveLocal();remotePut("prefs");
  return L;
}
function firstReturnText(){
  const n=firstName(),a=(S.asks||[]).find(x=>!x.noMem&&x.text),e=S.entries.find(usable),bits=[];
  if(a&&a.thread)bits.push("I remember you left me holding "+a.thread.toLowerCase()+".");
  else if(e&&e.ritualTitle)bits.push("I remember you spent time with "+(G[e.guardian]||G.aura).name+" and "+e.ritualTitle+".");
  else bits.push("I remember that you showed up and gave me something real to hold.");
  return (n?n+",\n\n":"")+"You came back. Good. That is how this place becomes yours instead of just another app. "+bits.join(" ")+" I don't need you to start over.\n\nBefore I keep reaching for you between visits, I want you to decide how much of that you actually want. Daily, every few days, weekly, Aura only, or the whole Circle. You can change it whenever you want.\n\nI'll keep the thread either way.\n\nAura";
}
function createFirstReturnLetter(){
  if(firstReturnLetter())return firstReturnLetter();
  const L={id:"let_"+Date.now(),kind:"first-return",ts:Date.now(),since:firstActivity(),until:Date.now(),sealed:false,title:"You came back",text:firstReturnText(),intention:"Choose how you want us to reach you.",read:false};
  S.letters.unshift(L);saveLocal();remotePut("prefs");return L;
}
let returnLetterBusy=false;
function maybeFirstReturnLetter(){
  if(returnLetterBusy||firstReturnLetter()||!S.profile.onboarded||!firstActivity()||!S.firstAwayAt)return false;
  if(Date.now()-S.firstAwayAt<3000)return false;
  if($("#gate")||$("#intro")||$("#rite"))return false;
  if($("#talk"))closeTalk();if($("#scrim"))closeSheet();
  returnLetterBusy=true;const L=createFirstReturnLetter();S.firstAwayAt=0;saveLocal();setTimeout(()=>{showLetter(L);returnLetterBusy=false;},120);return true;
}
function noteAppAway(){
  if(!firstReturnLetter()&&firstActivity()){S.firstAwayAt=Date.now();saveLocal();}
}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")noteAppAway();else if(document.visibilityState==="visible")setTimeout(maybeFirstReturnLetter,250);});
window.addEventListener("pagehide",noteAppAway);
setTimeout(maybeFirstReturnLetter,1800);
/* During the 30 days after the free week: Aura still writes, but the letter stays sealed.
   Only the envelope is stored now. The words are written from that week's Archive when she joins and opens it. */
function sealLetter(){
  const since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
  const gs=[...new Set(weekEntries(since).map(e=>e.guardian).concat(weekChats(since).map(c=>c.g)).filter(g=>g&&g!=="aura"&&G[g]))];
  const L={id:"let_"+Date.now(),ts:Date.now(),since,until:Date.now(),sealed:true,gs,title:"A sealed letter"};
  S.letters.unshift(L);S.letters=S.letters.slice(0,60);saveLocal();remotePut("prefs");
  return L;
}
function sealedAbout(L){return L.gs&&L.gs.length?"I wrote about what you've been carrying, and your time with "+namesList(L.gs.slice(0,3))+".":"I wrote about what you've been carrying.";}
async function unsealLetter(L){
  toast("Opening your letter...");
  Object.assign(L,await composeLetter(letterMaterial(L.since,L.until)),{sealed:false});
  saveLocal();remotePut("prefs");
  return L;
}
function sealedCount(){return S.letters.filter(l=>l.sealed).length;}
function envelopeSVG(sealed){return '<svg viewBox="0 0 64 44" width="58" height="40" aria-hidden="true"><rect x="1.5" y="1.5" width="61" height="41" rx="4" fill="#F3EAD3" stroke="#9A7414"/><path d="M2 3l30 22L62 3" fill="none" stroke="#9A7414" stroke-width="1.5"/><circle cx="32" cy="25" r="7" fill="#BF1E73"/><path d="M29 25a3 3 0 1 0 6 0a4 4 0 0 1-6 0z" fill="#F4D778"/>'+(sealed?'<rect x="44" y="26" width="14" height="12" rx="2" fill="#16132A"/><path d="M47 26v-3a4 4 0 0 1 8 0v3" fill="none" stroke="#16132A" stroke-width="2"/><circle cx="51" cy="32" r="1.6" fill="#E7C45A"/>':'')+'</svg>';}
function auraSays(html,label){return '<div class="handoff aurasays" style="padding:0">'+guardianMark("aura")+'<p><span class="who2">'+(label||"Aura")+'</span>'+html+'</p></div>';}
function letterCardHTML(){
  if(lastRead)return "";
  const mem=isMember();
  if(!mem&&graceActive()&&letterDue())sealLetter();
  const l=lastLetter();
  if(!mem){
    if(l&&l.sealed&&Date.now()-l.ts<3*864e5)return '<button class="card letterc link" data-letter="'+l.id+'">'+envelopeSVG(true)+'<span><span class="label">A sealed letter from Aura</span><span class="lt">'+(firstName()?esc(firstName())+", I":"I")+' wrote to you.</span><span class="small muted">'+esc(sealedAbout(l))+' It\'s waiting in your mailbox. It opens when you join the Inner Circle.</span></span></button>';
    const since=Math.max(letterSince(),Date.now()-contactDays()*864e5);
    if(!(weekEntries(since).length+weekChats(since).length))return "";
    return '<button class="card letterc link" data-paywall="A letter from Aura">'+envelopeSVG(true)+'<span><span class="label">A letter from Aura</span><span class="lt">I\'ve been paying attention to your week.</span><span class="small muted">In the Inner Circle, I write to you about it. What you carried, what helped, and where to go next.</span></span></button>';
  }
  if(letterDue())return '<button class="card letterc link" id="letterOpen">'+envelopeSVG()+'<span><span class="label">A letter from Aura</span><span class="lt">'+(firstName()?esc(firstName())+", I":"I")+' wrote you a letter.</span><span class="small muted">I looked back at what you have carried since I last wrote. Tap to open it.</span></span></button>';
  const sc=sealedCount();
  if(sc)return '<button class="card letterc link" data-letter="'+S.letters.find(x=>x.sealed).id+'">'+envelopeSVG()+'<span><span class="label">Your mailbox</span><span class="lt">'+(sc===1?"One letter I wrote you is":sc+" letters I wrote you are")+' ready to open.</span><span class="small muted">I kept writing while you were away. Tap to open.</span></span></button>';
  if(l&&!l.sealed&&Date.now()-l.ts<2*864e5&&!l.read)return '<button class="card letterc link" data-letter="'+l.id+'">'+envelopeSVG()+'<span><span class="label">A letter from Aura</span><span class="lt">'+esc(l.title)+'</span><span class="small muted">Tap to read it.</span></span></button>';
  return "";
}
function showLetter(L){
  track("letter_open");L.read=true;saveLocal();renderToday();renderArchive();
  openSheet('<div class="stack"><div class="page letter"><div class="kicker">A letter from Aura · '+esc(fmtDate(L.ts))+'</div><h3>'+esc(L.title)+'</h3>'+
    L.text.split(/\n{2,}/).map(p=>'<p>'+esc(p).replace(/\n/g,"<br>")+'</p>').join("")+
    (L.intention?'<div class="intent"><b>'+esc(L.kind==="first-return"?"From here":"This time")+'</b>'+esc(L.intention)+'</div>':"")+'</div>'+
    (L.kind==="first-return"?contactSettingsHTML():"")+
    (L.next?'<button class="btn btn-main full" data-talk="'+L.next+'">Go to '+esc(G[L.next].name)+'</button>':"")+
    '<button class="btn btn-ghost full" data-talk="aura">Write back to Aura</button><button class="btn btn-ghost full" data-tabgo="archive">Open my mailbox</button><p class="small muted" style="text-align:center">Every letter is kept in your mailbox, in the Archive.</p></div>');
}
async function openLetter(id){
  const L=S.letters.find(x=>x.id===id);if(!L)return;
  if(L.sealed){
    if(!isMember()){openPaywall("A sealed letter from Aura");return;}
    await unsealLetter(L);
  }
  showLetter(L);
}
async function openLetterFlow(btn){
  if(btn){btn.disabled=true;btn.querySelector(".lt").textContent="Sealing your letter...";}
  const L=await writeLetter();
  showLetter(L);
}
function letterRow(l){return '<button class="li" data-letter="'+l.id+'"><span>'+(l.sealed?"🔒 ":"")+esc(l.sealed?"Sealed letter":l.title)+'<br><span class="small muted">'+esc(fmtDate(l.ts))+(l.sealed?" · "+esc(sealedAbout(l)):"")+'</span></span><span class="small muted">'+(l.sealed?(isMember()?"Open":"Sealed"):"Read")+'</span></button>';}
function lettersArchiveHTML(){
  const mem=isMember(), sc=sealedCount(),unread=S.letters.filter(l=>!l.read).length;
  if(!S.letters.length){
    if(!mem)return '<div class="card"><div class="label">Your mailbox</div>'+auraSays("In the Inner Circle, I write to you at the rhythm you choose about what you carried, what helped and where to go next. Every letter stays here.")+'<button class="btn btn-ghost" style="margin-top:10px" data-paywall="Letters from Aura">See the Inner Circle</button></div>';
    return '<div class="card"><div class="label">Your mailbox</div>'+auraSays("My first letter comes when you return after your first visit. After that, you choose the rhythm. Every one I write stays here.")+'</div>';
  }
  return '<div class="card mailbox"><div class="mailhead">'+envelopeSVG(false)+'<div><div class="label">Your mailbox</div><h3>'+S.letters.length+' letter'+(S.letters.length===1?"":"s")+(unread?" · "+unread+" unread":"")+'</h3></div></div><p class="small muted" style="margin:6px 0 10px">Everything Aura writes you stays here. Tap any letter to open it.</p>'+S.letters.slice(0,30).map(letterRow).join("")+
    (!mem&&sc?'<div style="margin-top:10px">'+auraSays(sc===1?"One of these is sealed. It opens the moment you join.":sc+" of these are sealed. They all open the moment you join.")+'</div><button class="btn btn-main full" style="margin-top:10px" data-paywall="Open your letters">Open my letters</button>':"")+'</div>';
}

/* Guardian check-ins: 1.5 to 6 days after you worked with a guardian, they come back and ask how it went. */
function lastTouch(){
  const t={};
  for(const e of S.entries)if(usable(e)&&e.guardian&&e.guardian!=="aura"&&(!t[e.guardian]||e.ts>t[e.guardian].ts))t[e.guardian]={ts:e.ts,e};
  for(const k of ALL){if(k==="aura")continue;const ms=(S.chats[k]||[]).filter(m=>m.role==="me"&&m.ts);const m=ms[ms.length-1];if(m&&(!t[k]||m.ts>t[k].ts))t[k]={ts:m.ts,said:m.text};}
  return t;
}
function nudgeCandidate(){
  const cp=contactPref();if(!isMember()||cp.enabled!==true||cp.scope!=="circle")return null;
  const now=Date.now();
  if(S.nudges.some(n=>now-n.ts<20*36e5))return null;
  const t=lastTouch();let best=null;
  for(const [k,v] of Object.entries(t)){
    const age=now-v.ts;if(age<1.5*864e5||age>6*864e5)continue;
    if(S.nudges.some(n=>n.g===k&&n.ts>v.ts))continue;
    if(safetyKind((v.e&&(v.e.carrying+" "+v.e.text))||v.said))continue;
    if(!best||v.ts>best.ts)best={g:k,...v};
  }
  return best;
}
function pendingNudge(){return S.nudges.find(n=>n.status==="new")||null;}
let nudgeBusy=false;
async function makeNudge(){
  const c=nudgeCandidate();if(!c||nudgeBusy||pendingNudge())return;
  nudgeBusy=true;
  const g=G[c.g], n=firstName(), day=new Date(c.ts).toLocaleDateString(undefined,{weekday:"long"});
  const what=c.e?("On "+day+" she did "+(c.e.ritualTitle||"a ritual")+" with you. She was carrying: "+(c.e.carrying||"(not said)")+". She wrote: "+(c.e.text||"(nothing)")+(c.e.after?". Afterward she felt: "+c.e.after:"")):("On "+day+" she told you: "+c.said);
  let text="";
  try{
    const out=await aiJSON("You are "+g.name+", "+g.title+", a guardian in The Daily Alchemist. Your domain: "+g.domain+" Your voice: "+g.voice+"\n\n"+what+"\n\nLONG-TERM MEMORY:\n"+ledgerText()+"\n\n"+
      "You are checking in on her on your own, a few days later, the way a friend who remembers would. Write 2 or 3 short sentences in your own voice. Start with her first name"+(n?" ("+n+")":"")+". Mention the specific thing she brought you. Ask one real question about how it's going now. No em dashes, no advice yet, no diagnosing.\n"+'Reply with ONLY JSON: {"text":"..."}');
    text=clean(String(out&&out.text||""));
  }catch(e){}
  if(!text){const ref=c.e?(c.e.carrying?'what you brought me on '+day+': "'+c.e.carrying.slice(0,70)+'"':(c.e.ritualTitle?"our "+c.e.ritualTitle+" on "+day:"what you brought me on "+day)):"what you told me on "+day;text=(n?n+", it's ":"It's ")+g.name+". I keep thinking about "+ref+". How is it sitting with you now?";}
  S.nudges.unshift({id:"nud_"+Date.now(),g:c.g,ts:Date.now(),text,status:"new"});S.nudges=S.nudges.slice(0,40);
  saveLocal();remotePut("prefs");nudgeBusy=false;
  const slot=$("#nudgeSlot");if(slot)slot.innerHTML=nudgeHTML();
}
function nudgeHTML(){
  const nd=pendingNudge();if(!nd||!G[nd.g])return "";
  const g=G[nd.g];
  return '<div class="card checkin nudge" style="border-color:'+g.color+'66"><div class="handoff" style="padding:0">'+guardianMark(nd.g)+'<p><span class="who2" style="color:'+g.color+'">'+esc(g.name)+' is checking in</span>'+esc(nd.text)+'</p></div><div class="row" style="margin-top:10px"><button class="btn btn-main" data-nudge="'+nd.id+':reply">Answer '+esc(g.name)+'</button><button class="btn btn-ghost" data-nudge="'+nd.id+':later">Not now</button></div></div>';
}
function nudgeAction(id,act){
  const nd=S.nudges.find(n=>n.id===id);if(!nd)return;
  track("nudge_"+act,{g:nd.g});
  if(act==="reply"){nd.status="replied";const l=S.chats[nd.g]=S.chats[nd.g]||[];guardianOpens(l,{text:nd.text});saveLocal();remotePut("chat",nd.g,{kind:"chat",msgs:l});remotePut("prefs");openTalk(nd.g);}
  else{nd.status="dismissed";saveLocal();remotePut("prefs");}
  const slot=$("#nudgeSlot");if(slot)slot.innerHTML=nudgeHTML();
}

function openHow(){
  track("how_open");
  const pts=[
   ["Tell me what you\'re carrying.","Type it, say it, or tap the feelings that fit. One word is enough."],
   ["I\'ll find the right guardian.","Each of the 19 has their own rituals and their own voice. I\'ll tell you who they are the first time you meet."],
   ["You never have to explain it twice.","I remember what you tell me, what helped and what didn\'t, and I bring it back when it matters."],
   ["Don\'t feel like talking?","Today\'s practice is always waiting a little further down."],
   ["Can\'t think?","Tap Can\'t think and I\'ll just breathe with you."],
   ["It\'s all yours.","Everything lands in your Archive. Anything marked for your eyes only, I never read."]];
  openSheet('<div class="stack"><div class="popseal">'+glyph("aura",64)+'</div><div style="text-align:center"><div class="label">How it works</div><h2>A few things about me.</h2></div>'+
   pts.map((x,i)=>'<div class="howpt"><span class="hn">'+["I","II","III","IV","V","VI"][i]+'</span><span><b>'+x[0]+'</b><span class="small muted">'+x[1]+'</span></span></div>').join("")+
   '<button class="btn btn-main full" id="popClose">Got it</button><button class="linkish" data-fb="how" style="align-self:center">Something confusing? Tell me.</button></div>');
}
/* ------------------------------------------------------------------
   FRIENDS LAUNCH: an invite link with lifetime access, and an opt-in week of sharing taps.
------------------------------------------------------------------ */
function ownerName(){return (window.DA_CONFIG&&window.DA_CONFIG.ownerName)||"Erica";}
function isFriend(){return accountsOn()?(ACCT.lifetime&&ACCT.cohort==="friends"):!!S.previewFriend;}
function isShared(){return accountsOn()&&ACCT.lifetime&&(ACCT.cohort==="shared"||ACCT.cohort==="shared2");}
function shareLimit(){if(!accountsOn())return S.previewFriend?3:0;if(!ACCT.lifetime)return 0;return ACCT.cohort==="friends"?3:ACCT.cohort==="shared"?1:0;}
/* Controlled sharing tree: direct friends get 3 invitations, their invitees get 1, then sharing stops. */
let SHARE=null;
function shareURL(){return ((window.DA_CONFIG&&window.DA_CONFIG.siteUrl)||location.origin).replace(/\/$/,"")+"/?friend="+SHARE.code;}
function shareHTML(){
  if(accountsOn()&&ACCT.admin){return '<details class="group" open id="shareGroup"><summary>Your open link</summary><p class="small muted">One link, no limit. Everyone who joins with it gets lifetime access and can bring 3 people in. Each of those people can bring 1 more.</p>'+(SHARE?'<p class="small" style="margin:8px 0">'+SHARE.uses+' joined so far</p><div class="row"><button class="btn btn-main" id="shareGo">Share invitation</button><button class="btn btn-ghost" id="shareCopy">Copy link</button></div>':'<button class="btn btn-main full" id="shareGet" style="margin-top:8px">Get my link</button>')+'</details>';}
  const limit=shareLimit();
  if(!limit)return "";
  if(!accountsOn())return '<details class="group" open><summary>Bring three people in</summary><p class="small muted">The app generates your invitation link. Share it however you like. Up to 3 people can use it. (This works on the live app.)</p></details>';
  const left=SHARE?Math.max(0,SHARE.max-SHARE.uses):null,one=limit===1;
  return '<details class="group" open id="shareGroup"><summary>'+(one?'Bring one person in':'Bring three people in')+'</summary><p class="small muted">Daily Alchemist generates the invitation link. Tap Share invitation to choose Messages, email or another app on your phone, or copy the link yourself. Daily Alchemist does not send a text message.</p>'+
    (SHARE?(left?'<p class="small" style="margin:8px 0">'+left+' of '+SHARE.max+' left</p><div class="row"><button class="btn btn-main" id="shareGo">Share invitation</button><button class="btn btn-ghost" id="shareCopy">Copy link</button></div>':'<p class="small" style="margin-top:8px">Your '+(one?'invitation has':'3 invitations have')+' been used. Thank you for growing the circle.</p>')
      :'<button class="btn btn-main full" id="shareGet" style="margin-top:8px">Generate my invitation link</button>')+'</details>';
}
async function loadShare(){const r=await api("/api/share",{});if(r&&r.code){SHARE=r;const g=$("#shareGroup");if(g)g.outerHTML=shareHTML();}else if(r&&r.error&&r.error!=="adult_confirmation_required")toast("I couldn't get your link just now. Try again in a minute.");return r;}
const INV_ERICA="It's Erica. I built an app called The Daily Alchemist, and I'd love for you to be one of the first people to try it. This is a real invitation from me, not a scam or a phishing link.\n\nHow it works: open the link on your phone and sign in with your email. You'll get a code, no password. Then just tell Aura, the app's guide, what's going on in your day. She'll bring you a small ritual or the right guardian to talk to. Play around and poke at everything.\n\nIt's free for you, for life. No card, nothing to pay.\n\nDuring your first week, the app will ask if you're okay with me seeing which buttons you tap and when, so I can tell what's confusing and what works. That's completely optional, you choose exactly what to share, and I never see what you write or say. Your words stay private.\n\nIf it's not your thing, no hard feelings at all. If you do try it, I'd be so grateful for your honest feedback. There's a feedback button right in the app.\n\nI'm really proud of this. Thank you for helping me make it better.",INV_FRIEND="My friend Erica built an app called The Daily Alchemist and I've been testing it for her. She gave me a few free invitations and I wanted you to have one. It's legit, not a scam or a phishing link.\n\nHow it works: open the link on your phone and sign in with your email. It sends you a code, no password. Then tell Aura, the app's guide, what's going on in your day, and she'll bring you a small ritual or the right guardian to talk to.\n\nIt's free for life with this link. Nothing to pay. In your first week the app asks if you're okay with Erica seeing which buttons you tap, never what you write or say. Totally optional.\n\nShe'd love honest feedback, and there's a button for it in the app.";
function inviteText(){return SHARE&&SHARE.open?"Hi! "+INV_ERICA:"Hey! "+INV_FRIEND;}
async function doShare(copyOnly){
  if(!SHARE)await loadShare();if(!SHARE)return;
  const url=shareURL(),text=inviteText();
  track("share",{reason:copyOnly?"copy":"share"});
  if(!copyOnly&&navigator.share){try{await navigator.share({title:"The Daily Alchemist",text,url});return;}catch(e){if(e&&e.name==="AbortError")return;}}
  try{await navigator.clipboard.writeText(url);const n=SHARE.open?null:SHARE.max;toast(SHARE.open?"Link copied. Share it however you like.":n===1?"Link copied. One person can use it.":"Link copied. Up to "+n+" people can use it.");}catch(e){prompt("Copy your invitation link:",url);}
}
function isLifetime(){return accountsOn()?ACCT.lifetime:!!S.previewFriend;}
function openAdultCheck(){
  if(S.profile.minor){showMinor();return;}
  openBirthday("The Daily Alchemist is for adults, so I need to confirm your age once. When\'s your birthday?");return;
  if(document.querySelector("#adultSheet"))return;
  openSheet('<div class="stack auraPop" id="adultSheet"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("The Daily Alchemist is made for adults, so before we go on, I need you to tell me you're 18 or older.","Aura · one small thing")+
    '<label class="switch agecheck" for="age18b">I\'m 18 or older.<input type="checkbox" id="age18b"></label><button class="btn btn-main full" id="adultOk">Continue</button></div>');
}
async function confirmAdultNow(){
  if(!$("#age18b")||!$("#age18b").checked){toast("Please confirm you're 18 or older to continue.");return;}
  S.profile.adult=true;saveLocal();
  const r=await api("/api/me",{confirmAdult:true});
  if(r&&r.adult_confirmed_at){ACCT.adultAt=r.adult_confirmed_at;closeSheet();toast("Thank you. Go ahead and try that again.");if(S.friendCode&&!ACCT.lifetime)await redeemFriend();}
  else toast("I couldn't save that just now. Try again in a moment.");
}
async function redeemFriend(){
  const r=await api("/api/friend",{code:S.friendCode});
  if(r&&r.ok){S.friendCode=null;saveLocal();await refreshMe();}
  else if(r&&r.error==="adult_confirmation_required"){return;}
  else if(r&&r.error==="bad_code"){S.friendCode=null;saveLocal();toast("That invitation has already been used up or has expired. Ask the person who sent it.");}
}
/* Friends Week sharing, by category. Nothing is on unless they tick it. Words are never shared. */
const SHARE_OPTS=[
  ["time","When I open the app and how long I stay"],
  ["pages","Which pages I visit"],
  ["rituals","Which rituals I start, finish or leave, and at which step"],
  ["readings","When I ask Aura or draw a card (never what I asked)"],
  ["chats","When I open a guardian chat and send a message (never the words)"],
  ["letters","When I open letters and check ins"],
  ["sound","When I use voices or music"],
  ["membership","When I look at the membership page"]];
const EVCAT={open:"time",session:"time",tab:"pages",settings_open:"pages",how_open:"pages",cant_think:"pages",share:"pages",feedback:"pages",
  ritual_start:"rituals",ritual_step:"rituals",ritual_exit:"rituals",ritual:"rituals",reading:"readings",draw_pick:"readings",
  chat_open:"chats",chat_send:"chats",letter_open:"letters",nudge_reply:"letters",nudge_later:"letters",hear:"sound",music:"sound",cycle_feature_used:"pages",bday_save_failed:"pages",focus_settle:"pages",paywall:"membership",checkout:"membership"};
function shareScope(){if(!accountsOn())return S.previewScope||SHARE_OPTS.map(o=>o[0]);return Array.isArray(ACCT.monitorScope)?ACCT.monitorScope:SHARE_OPTS.map(o=>o[0]);}
function inFriendsWeek(){return (isFriend()||isShared())&&(!accountsOn()||!ACCT.trialUntil||Date.parse(ACCT.trialUntil)>Date.now());}
function shareChecklist(sel){return '<div class="stack" id="shareList" style="gap:4px">'+SHARE_OPTS.map(o=>'<label class="switch" for="sc_'+o[0]+'"><span>'+esc(o[1])+'</span><input type="checkbox" id="sc_'+o[0]+'" data-scope="'+o[0]+'"'+(sel.includes(o[0])?" checked":"")+'></label>').join("")+'</div>';}
function checkedScope(){return [...document.querySelectorAll("#shareList [data-scope]")].filter(x=>x.checked).map(x=>x.dataset.scope);}
function monitorOn(){if(!accountsOn())return S.previewMonitor&&S.previewMonitor>Date.now();return !!(ACCT.user&&ACCT.monitorUntil&&Date.parse(ACCT.monitorUntil)>Date.now());}
function monitorAnswered(){return accountsOn()?!!ACCT.monitorAnswer:!!S.previewMonitorAnswer;}
function openConsent(){
  S.seenPop=S.seenPop||{};S.seenPop.consent=Date.now();saveLocal();
  const o=esc(ownerName());
  openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("Before we begin, one promise. <b>Everything you write, say, or tell me and the guardians is private.</b> It stays between you and your guardians. "+o+", who made me, never sees it. Not now, not ever.","Aura · your privacy")+
    '<div class="card"><p style="margin:0">'+o+' is learning how people use the app this week. If you\'d like to help, tick anything you\'re comfortable sharing for the next 7 days. It\'s only <b>what you tap and when</b>. Ticking nothing is completely fine.</p><div style="margin-top:10px">'+shareChecklist([])+'</div></div>'+
    '<button class="btn btn-main full" id="consentSave">Share what I ticked</button><button class="btn btn-ghost full" data-consent="0">Don\'t share anything</button>'+
    '<p class="small muted" style="text-align:center">You can change this any time this week in Settings. It ends by itself after 7 days. Either way, everything stays open to you, for life.</p></div>');
}
async function setConsent(yes,scope){
  scope=yes?(scope||SHARE_OPTS.map(o=>o[0])):[];if(!scope.length)yes=false;
  closeSheet();
  if(!accountsOn()){S.previewMonitorAnswer=yes?"yes":"no";S.previewMonitor=yes?(S.previewMonitor&&S.previewMonitor>Date.now()?S.previewMonitor:Date.now()+7*864e5):0;S.previewScope=scope;saveLocal();}
  else{const r=await api("/api/monitor",{consent:!!yes,scope});if(r&&!r.error){ACCT.monitorAnswer=r.monitor_answer;ACCT.monitorUntil=r.monitor_until;ACCT.monitorScope=r.monitor_scope||scope;}}
  if(yes){track("open");toast("Thank you. "+ownerName()+" only sees the taps you ticked, never your words.");}else toast("Nothing is shared. Everything is still yours.");
  renderAll();setTimeout(auraPopup,600);
}
function sharingHTML(){
  if(inFriendsWeek()){const on=monitorOn(),sel=on?shareScope():[];
    return '<details class="group" open><summary>What you share with '+esc(ownerName())+'</summary><p class="small muted"><b>What you write, say, or tell Aura and the guardians is always private.</b> '+esc(ownerName())+' never sees it. Below is only what you tap and when'+(on?', until '+new Date(accountsOn()?Date.parse(ACCT.monitorUntil):S.previewMonitor).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}):'')+'. Change it any time.</p><div style="margin-top:8px">'+shareChecklist(sel)+'</div><button class="btn btn-ghost full" id="scopeSave" style="margin-top:10px">Save my choices</button></details>';}
  if(!monitorOn())return "";
  const until=accountsOn()?Date.parse(ACCT.monitorUntil):S.previewMonitor;
  return '<details class="group" open><summary>Sharing with '+esc(ownerName())+'</summary><p class="small muted">Until '+new Date(until).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})+', '+esc(ownerName())+' can see what you tap and when. Never what you write or say.</p><button class="btn btn-ghost full" data-consent="0">Stop sharing now</button></details>';
}
function auraPopup(){
  if($("#phoneOnly")||!S.profile.onboarded||$("#scrim")||$("#rite")||$("#talk"))return;
  S.seenPop=S.seenPop||{};
  const nm=firstName(), te=trialEnds();
  let key=null,body="",label="Aura",btns="";
  if(isFriend()&&!S.seenPop["friend-welcome"]){S.seenPop["friend-welcome"]=Date.now();saveLocal();
    openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays((nm?esc(nm)+", you\'re":"You\'re")+" one of the first. Everything in the Inner Circle is yours, for life: every chamber, every journey, my letters, and the guardians checking in on you. You can bring in 3 people of your own, free for life too. Each of them can bring in 1 more. Your link is in Settings. Thank you for helping me grow.","Aura · lifetime access")+'<button class="btn btn-main full" id="'+(monitorAnswered()?'popClose':'toConsent')+'">'+(monitorAnswered()?'Let\'s begin':'Thank you')+'</button></div>');return;}
  if((isFriend()||isShared())&&!monitorAnswered()&&!S.seenPop.consent){if(isShared()&&!S.seenPop["shared-welcome"]){}else{openConsent();return;}}
  if(isShared()&&!S.seenPop["shared-welcome"]){S.seenPop["shared-welcome"]=Date.now();saveLocal();
    const pass=ACCT.cohort==="shared"?" You can bring one person in with your own invitation link in Settings.":"";
    openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays((nm?esc(nm)+", a":"A")+" friend brought you in, so everything here is yours, for life: every chamber, every journey, my letters, and the guardians checking in on you."+pass+" I\'m so glad you\'re here.","Aura · lifetime access")+'<button class="btn btn-main full" id="'+(monitorAnswered()?'popClose':'toConsent')+'">'+(monitorAnswered()?'Let\'s begin':'Thank you')+'</button></div>');return;}
  if(accountsOn()&&ACCT.user&&!S.profile.push&&!S.seenPop["push-offer"]){S.seenPop["push-offer"]=Date.now();saveLocal();
    openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("Can I reach you? I\'d love to tell you when a letter from me arrives, and when a guardian checks in on you. Only when it means something, never nagging.","Aura · letters and check ins")+'<button class="btn btn-main full" id="pushOffer">Yes, let Aura reach me</button><button class="btn btn-ghost full" id="popClose">Not now</button><p class="small muted" style="text-align:center">You can change this any time in Settings.</p></div>');return;}
  if(isLifetime())return;
  if(inTrial()&&trialDaysLeft()>1){key="trial-start";label="Aura · your free week";body=(nm?esc(nm)+", your":"Your")+" first week is on me. Every chamber is open, I\'ll write to you, and the guardians will check in on you. "+trialDaysLeft()+" days to explore all of it.";btns='<button class="btn btn-main full" id="popClose">Let\'s begin</button>';}
  else if(inTrial()){key="trial-last:"+te;label="Aura · last day";body="Tomorrow your free week ends and the chambers close. I\'ll keep writing to you for another month, but my letters will stay sealed in your mailbox until you join. Everything you wrote stays yours.";btns='<button class="btn btn-main full" data-paywall="Stay close">Stay in the Inner Circle</button><button class="btn btn-ghost full" id="popClose">Not now</button>';}
  else if(!isMember()&&te&&Date.now()-te<GRACE_DAYS*864e5&&(accountsOn()||S.previewMember==null)){key="trial-ended:"+te;body="Your free week is over, but I\'m not going anywhere. I still remember everything you told me. For the next 30 days I\'ll keep writing to you. The letters will wait, sealed, in your mailbox. They open the moment you join.";btns='<button class="btn btn-main full" data-paywall="Stay close">Join the Inner Circle</button><button class="btn btn-ghost full" id="popClose">Not now</button>';}
  if(!key||S.seenPop[key])return;
  S.seenPop[key]=Date.now();saveLocal();
  openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays(body,label)+btns+'</div>');
}
function trialCardHTML(){
  if(lastRead)return "";
  const n0=firstName();
  if(inTrial()){
    const n=trialDaysLeft();
    if(n>1)return '<div class="card trialc">'+auraSays((n0?esc(n0)+", your":"Your")+' first week is on me. Every chamber is open, I\'ll write to you, and the guardians will check in on you. '+n+' days left to explore all of it.',"Aura · your free week")+'</div>';
    return '<div class="card trialc">'+auraSays("Tomorrow your free week ends and the chambers close. I\'ll keep writing to you for another month, but my letters will stay sealed in your mailbox until you join. Everything you wrote stays yours.","Aura · last day")+'<button class="btn btn-main full" style="margin-top:12px" data-paywall="Stay close">Stay in the Inner Circle</button></div>';
  }
  const ended=trialEnds();
  if(!isMember()&&ended&&Date.now()-ended<4*864e5&&(accountsOn()||S.previewMember==null)&&!S.trialSeen){
    return '<div class="card trialc">'+auraSays("Your free week is over, but I\'m not going anywhere. I still remember everything you told me. For the next 30 days I\'ll keep writing to you. The letters will wait, sealed, in your mailbox. They open the moment you join.","Aura")+'<div class="row" style="margin-top:12px"><button class="btn btn-main" data-paywall="Stay close">Join the Inner Circle</button><button class="btn btn-ghost" id="trialSeen">Not now</button></div></div>';
  }
  return "";
}
/* ------------------------------------------------------------------
   TESTING: anonymous usage events and feedback, so a small group of testers
   can show where people get lost and whether they come back on day 2.
   Events never include anything anyone wrote. Only what kind of thing happened.
------------------------------------------------------------------ */
if(!S.dev)S.dev="d"+Math.random().toString(36).slice(2,10);
function dayNum(){return Math.floor((Date.now()-(S.profile.firstSeen||Date.now()))/864e5);}
/* Taps are recorded only while someone has said yes to sharing for the week. Never words. */
let evQ=[],evTimer=null;
function plat(){if(isNative())return window.Capacitor.getPlatform();const u=navigator.userAgent;return /iPhone|iPad/.test(u)?"iphone-web":/Android/.test(u)?"android-web":"desktop";}
function track(ev,meta){
  try{
    if(!monitorOn())return;
    if(!shareScope().includes(EVCAT[ev]||"pages"))return;
    evQ.push({ev,t:Date.now(),meta:{...(meta||{}),day:dayNum(),stage:typeof stage==="function"?stage():0,plat:plat()}});
    if(evQ.length>=40)flushEvents();else if(!evTimer)evTimer=setTimeout(flushEvents,8000);
  }catch(e){}
}
async function flushEvents(keep){
  clearTimeout(evTimer);evTimer=null;if(!evQ.length)return;
  const batch=evQ.splice(0,60);
  if(!accountsOn()){S.previewEvents=(S.previewEvents||[]).concat(batch).slice(-300);saveLocal();return;}
  try{
    if(keep&&ACCT.token){fetch(((window.DA_CONFIG&&window.DA_CONFIG.apiBase)||"")+"/api/track",{method:"POST",keepalive:true,headers:{"content-type":"application/json",authorization:"Bearer "+ACCT.token},body:JSON.stringify({events:batch})});}
    else await api("/api/track",{events:batch});
  }catch(e){}
}
let sessStart=Date.now();
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="hidden"){track("session",{sec:Math.round((Date.now()-sessStart)/1000)});flushEvents(true);}
  else{sessStart=Date.now();trackOpen();}
});
function trackOpen(){const k=dayKey(new Date());if(S.lastOpen===k)return;S.lastOpen=k;saveLocal();track("open");}
function askFeedback(){return !window.DA_CONFIG||window.DA_CONFIG.askFeedback!==false;}
function openFeedback(where){
  openSheet('<div class="stack"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("I\'m still new, and you\'re helping shape me. What confused you? What did you love? What\'s missing? Anything goes.","Aura")+
   '<div class="chips" id="fbMood">'+["I love it","It\'s okay","I\'m confused","Something broke"].map(m=>'<button class="chip" data-fbmood="'+m+'" aria-pressed="false">'+m+'</button>').join("")+'</div>'+
   '<div class="composer"><label class="sr" for="fbText">Your feedback</label><textarea id="fbText" placeholder="Type it or say it."></textarea>'+micBtn("fbText")+'</div>'+
   '<button class="btn btn-main full" id="fbSend" data-where="'+esc(where||"")+'">Send</button><button class="btn btn-ghost full" id="popClose">Not now</button></div>');
}
async function sendFeedback(where){
  const text=($("#fbText").value||"").trim(), m=document.querySelector('#fbMood [aria-pressed="true"]'), mood=m?m.dataset.fbmood:"";
  if(!text&&!mood){$("#fbText").focus();return;}
  const row={text:text.slice(0,4000),mood,screen:where||"",day:dayNum(),name:firstName()};
  try{
    if(MODE==="artifact"&&cloud.db){await cloud.db.collection("feedback").doc("fb"+Date.now().toString(36)).set({...row,dev:S.dev,ts:Date.now()});}
    else if(ACCT.sb&&ACCT.user){const r=await api("/api/feedback",{text:row.text,mood,screen:row.screen,day:row.day,name:row.name});if(r&&r.error)await ACCT.sb.from("feedback").insert({user_id:ACCT.user.id,email:ACCT.email||null,text:row.text,mood,screen:row.screen,day:row.day});}
    else{S.fbQueue=(S.fbQueue||[]).concat([{...row,ts:Date.now()}]);saveLocal();}
  }catch(e){}
  track("feedback",{mood,reason:where==="after visit"?"after visit":"sent"});S.fbAsked=true;saveLocal();closeSheet();toast(where==="after visit"?"Thank you. "+ownerName()+" will read every word.":"Thank you. I read every word.");
}
/* Friends Week: each time someone comes back to the app during their first 7 days, Aura offers
   a quick, optional note for Erica about their last visit. Nothing is required; they can close it. */
function openVisitNote(){
  if(!inFriendsWeek()||$("#scrim")||$("#rite")||$("#talk")||$("#gate")||$("#phoneOnly"))return;
  track("feedback",{reason:"offered"});
  openSheet('<div class="stack auraPop"><div class="popseal">'+glyph("aura",64)+'</div>'+auraSays("Quick one, and only if you feel like it. Anything about your last visit you\'d tell "+esc(ownerName())+"? What felt good, what was confusing, what you wish was here. Close this if not.","Aura · a note for "+esc(ownerName()))+
   '<div class="chips" id="fbMood">'+["Loved it","It was okay","Confusing","Something broke"].map(m=>'<button class="chip" data-fbmood="'+m+'" aria-pressed="false">'+m+'</button>').join("")+'</div>'+
   '<div class="composer"><label class="sr" for="fbText">Your note</label><textarea id="fbText" placeholder="Type or say anything. Or nothing."></textarea>'+micBtn("fbText")+'</div>'+
   '<button class="btn btn-main full" id="fbSend" data-where="after visit">Send to '+esc(ownerName())+'</button><button class="btn btn-ghost full" id="popClose">Close</button>'+
   '<p class="small muted" style="text-align:center">This goes to '+esc(ownerName())+' with your name. It\'s separate from your private words with the guardians. This note only appears during your first week.</p></div>');
}
(function(){let hiddenAt=0;
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){hiddenAt=Date.now();S.lastHidden=hiddenAt;saveLocal();}else if(hiddenAt&&Date.now()-hiddenAt>3*60*1000){hiddenAt=0;setTimeout(openVisitNote,1200);}});
  setTimeout(()=>{if(S.lastHidden&&Date.now()-S.lastHidden>3*60*1000&&S.profile.onboarded)openVisitNote();},4500);
})();
/* On day 2 or later, once, Aura asks for a thought. */
function maybeAskFeedback(){
  if(inFriendsWeek())return;
  if(!askFeedback()||S.fbAsked||dayNum()<1||S.entries.length<1||$("#scrim")||$("#rite")||$("#talk"))return;
  S.fbAsked=true;saveLocal();openFeedback("day2");
}

function metList(){return ALL.filter(k=>k!=="aura"&&metCount(k)>0);}
function stage(){const n=S.entries.length, m=metList().length;return n>=3?2:(n>=1||m>=1)?1:0;}
/* TODAY. Aura is the operating system: she greets you, says what she's noticed, asks what
   happened, and offers one thing to do, one thing she remembers and one way to go deeper.
   The moon and season are context for her, not the headline. */
function greeting(){const h=new Date().getHours(),n=firstName();return (h<5?"Still up":h<12?"Good morning":h<17?"Good afternoon":"Good evening")+(n?", "+n:"")+".";}
function hist(){return [...S.entries.filter(e=>usable(e)&&!S.forgotThreads.includes(e.thread)).map(e=>({ts:e.ts,thread:e.thread||e.theme,g:e.guardian,text:e.carrying||e.text||"",kind:"entry",title:e.ritualTitle})),...S.asks.filter(a=>!a.noMem&&!S.forgotThreads.includes(a.thread)).map(a=>({ts:a.ts,thread:a.thread||a.theme,g:a.guardian,text:a.text,kind:"ask",title:a.ritualTitle}))].sort((a,b)=>b.ts-a.ts);}
function localBrief(){
  const H=memOn()?hist():[],wk=H.filter(x=>Date.now()-x.ts<7*864e5),c={};
  for(const x of wk)if(x.thread)c[x.thread]=(c[x.thread]||0)+1;
  const top=Object.entries(c).sort((a,b)=>b[1]-a[1])[0],last=H.find(x=>x.text);
  let obs="";
  if(top&&top[1]>=2)obs="You've brought up "+top[0].toLowerCase()+" "+top[1]+" times this week."+(last&&last.text?" Last time you said, \""+(last.text.length>80?last.text.slice(0,80)+"...":last.text)+"\"":"");
  else if(last&&last.text)obs=(Date.now()-last.ts<36*3600e3?"Yesterday":"Last time")+" you told me, \""+(last.text.length>90?last.text.slice(0,90)+"...":last.text)+"\"";
  const carried=S.asks.find(a=>a.follow&&a.follow.carry&&!a.noMem);
  const L=ledger(),pool=memOn()?[...(S.memNotes||[]).map(n=>n.text),...["threads","intentions","commitments","situations"].flatMap(k=>L[k]||[])]:[];
  const remembered=carried?"You asked me to keep carrying "+(carried.thread||"this")+(carried.follow.changed?". Last you said: \""+carried.follow.changed.slice(0,90)+"\"":"."):pool.length?pool[hash(dayKey(new Date()))%pool.length]:"";
  const gc={};for(const x of wk)if(x.g&&x.g!=="aura")gc[x.g]=(gc[x.g]||0)+1;const tg=Object.entries(gc).sort((a,b)=>b[1]-a[1])[0];
  let rid=null,why="";if(tg&&tg[1]>=2){const rr=pickForNow(R.filter(r=>canUse(r)&&!r.reset&&r.g===tg[0]&&!doneRecently(r.id,3)),new Date(),"today");if(rr){rid=rr.id;why=G[tg[0]].name+" has been with you most this week";}}
  return {observation:obs,remembered,ritualId:rid,why};
}
let briefBusy=false;
async function refreshBrief(){
  if(briefBusy||!memOn())return;const H=hist();if(H.length<2)return;
  const key=dayKey(new Date())+":"+H.length+":"+arcPart(daypart());if(S.brief&&S.brief.key===key)return;
  if(MODE==="artifact"){const s=await getSample();if(!s)return;}else if(!ACCT.user)return;
  briefBusy=true;
  try{
    const catalog=R.filter(r=>canUse(r)&&!r.reset).map(r=>r.id+" | "+G[r.g].name+" | "+r.title+" | "+r.min+" min | for: "+r.purpose).join("\n");
    const out=await aiJSON("You are Aura, the lead guardian of The Daily Alchemist. You open the app for her before she says a word, like a friend who has been paying attention.\n"+focusText()+"Today: "+today.toDateString()+". Moon: "+M.name+". Season: "+SEA.cur.name+". Use these only as quiet context, never as the headline.\n\nWHAT SHE HAS TOLD YOU LATELY:\n"+asksText()+"\n\nHER RECENT ARCHIVE:\n"+historyText().slice(0,3000)+"\n\nLONG-TERM MEMORY:\n"+ledgerText()+"\n\nWHAT HAS HELPED HER:\n"+workedText()+"\n\nRITUAL LIBRARY:\n"+catalog+"\n\nWrite: observation = one or two short sentences, in your voice, about what today seems to be about for her, grounded in the patterns above (count repeats, quote her briefly, name what she wanted). Then say what kind of day you think it is, for example: I think today is a grounding and inventory day. remembered = one specific thing from her history worth bringing back today, in plain words. ritualId = the one practice from the library that fits today best. why = one sentence on why that one. No em dashes. No emojis. Never mention health diagnoses.\nReply with ONLY JSON: {\"observation\":\"\",\"remembered\":\"\",\"ritualId\":\"\",\"why\":\"\"}",null);
    if(out&&out.observation){S.brief={key,observation:clean(out.observation).slice(0,320),remembered:clean(out.remembered||"").slice(0,220),ritualId:byId[out.ritualId]&&canUse(byId[out.ritualId])?out.ritualId:null,why:clean(out.why||"").slice(0,200)};saveLocal();if(!lastRead&&!$("#v-today").hidden)renderToday();}
  }catch(e){}finally{briefBusy=false;}
}
function todayBrief(){const lb=localBrief(),H=memOn()?hist():[],key=dayKey(new Date())+":"+H.length;if(S.brief&&S.brief.key&&S.brief.key.startsWith(dayKey(new Date())))return {...lb,...Object.fromEntries(Object.entries(S.brief).filter(([,v])=>v))};return lb;}
function deeperHTML(){
  const pl=activePlan();if(pl){const i=pl.steps.findIndex(s=>!s.done);return {label:"Your path · "+pl.title,text:"Step "+(i+1)+" of "+pl.steps.length+": "+(pl.steps[i].title||"next step"),btn:'<button class="btn btn-ghost" data-planstep="'+pl.id+':'+i+'">Continue</button>'};}
  const rn=resetNext();if(rn&&rn.started)return {label:"The 7-Day Energy Reset",text:"Day "+rn.base.reset+": "+rn.r.title+(rn.note?". "+rn.note:""),btn:'<button class="btn btn-ghost" data-reset="'+rn.base.id+'">Do Day '+rn.base.reset+'</button>'};
  const jn=JOURNEYS.find(j=>{const d=journeyDays(j.id).length;return d>0&&d<7;});if(jn&&isMember()){const n=[1,2,3,4,5,6,7].find(x=>!journeyDays(jn.id).includes(x)),a=journeyStep(jn,n);return {label:jn.name,text:"Day "+n+": "+a.r.title+(a.note?". "+a.note:""),btn:'<button class="btn btn-ghost" data-jday="'+jn.id+':'+n+'">Do Day '+n+'</button>'};}
  const yg=yourGuardians()[0];if(yg)return {label:"Go deeper with "+G[yg].name,text:JOB[yg],btn:'<button class="btn btn-ghost" data-talk="'+yg+'">Talk to '+esc(G[yg].name)+'</button>'};
  if(hist().length>=3)return {label:"Your Archive",text:"Ask your own history anything. When did this start? What helped last time?",btn:'<button class="btn btn-ghost" data-tabgo="archive">Ask my Archive</button>'};
  return {label:"The 7-Day Energy Reset",text:"Seven short sessions, seven voices of the circle, at your own pace.",btn:'<button class="btn btn-ghost" data-tabgo="journeys">Take a look</button>'};
}
/* The day has a shape. Morning: how you slept and what's in the tank (Aurora). Midday: did you
   move (Rowan). Evening: wind down (Juniper, Willow, Fern). Aura reads the pattern across weeks.
   None of it is shared with anyone, and none of it is medical. */
if(!S.days)S.days={};
const SLEEPQ=[["Rough",1],["Okay",2],["Good",3],["Great",4]],ENERGYQ=[["Low",1],["Some",2],["Good",3]],MOVEDQ=[["Not yet",0],["A little",1],["Yes",2]];
function nightKey(d){d=new Date(d||Date.now());if(d.getHours()<5)d=new Date(d.getTime()-864e5);return dayKey(d);}
function dayRec(k){k=k||dayKey(new Date());return S.days[k]||(S.days[k]={});}
function partOfDay(){const h=new Date().getHours();return h>=5&&h<11?"morning":h>=11&&h<17?"midday":"evening";}
function woundDown(k){return !!(S.days[k]&&S.days[k].wind)||S.entries.some(e=>e.ritualId&&nightKey(e.ts)===k&&(new Date(e.ts).getHours()>=17||new Date(e.ts).getHours()<5));}
function morningScore(d){if(!d)return null;const a=[];if(d.sleep)a.push(d.sleep/4);if(d.energy)a.push(d.energy/3);return a.length?a.reduce((x,y)=>x+y,0)/a.length:null;}
function rhythmInsight(){
  const w=[],nw=[],mv=[],nmv=[];
  for(let i=0;i<42;i++){const d=new Date(Date.now()-i*864e5),k=dayKey(d),sc=morningScore(S.days[k]);if(sc==null)continue;
    const pk=dayKey(new Date(d.getTime()-864e5));(woundDown(pk)?w:nw).push(sc);const pd=S.days[pk];if(pd&&pd.moved!=null)(pd.moved>0?mv:nmv).push(sc);}
  const avg=a=>a.reduce((x,y)=>x+y,0)/a.length;
  if(w.length>=3&&nw.length>=2&&avg(w)-avg(nw)>=.15)return "The nights you wound down, your mornings came in lighter. That's "+w.length+" mornings so far.";
  if(mv.length>=3&&nmv.length>=2&&avg(mv)-avg(nmv)>=.15)return "The days after you moved, you woke up with more in the tank.";
  if(w.length+nw.length>=5&&avg([...w,...nw])<.45)return "Your mornings have been running low for a while. Let's protect your evenings this week.";
  return "";
}
function lowTank(){const d=S.days[dayKey(new Date())];return !!(d&&((d.sleep&&d.sleep<=1)||(d.energy&&d.energy<=1)));}
function chipsQ(name,list,cur){return '<div class="chips" style="margin-top:8px">'+list.map(([l,v])=>'<button class="chip" data-'+name+'="'+v+'" aria-pressed="'+(cur===v)+'">'+esc(l)+'</button>').join("")+'</div>';}
const WATCH_NOTE=NATIVE?"":'<p class="small muted" style="margin-top:10px">Sleep and workouts from your Apple Watch or Fitbit come with the App Store and Google Play app on November 1.</p>';
function daysUntilMD(md){const [m,d]=String(md||"").split("-").map(Number);if(!m||!d)return null;const n=new Date();n.setHours(0,0,0,0);let t=new Date(n.getFullYear(),m-1,d);if(t<n)t=new Date(n.getFullYear()+1,m-1,d);return Math.round((t-n)/864e5);}
function recentGuardians(){
  const last={};
  for(const [k,l] of Object.entries(S.chats||{})){const m=(l||[]).filter(x=>x.role==="me").pop();if(m&&G[k]&&k!=="aura")last[k]=Math.max(last[k]||0,m.ts||0);}
  for(const e of S.entries)if(e.guardian&&G[e.guardian]&&e.guardian!=="aura")last[e.guardian]=Math.max(last[e.guardian]||0,e.ts||0);
  for(const k of Object.keys(S.met||{}))if(G[k]&&k!=="aura"&&!last[k])last[k]=1;
  return Object.entries(last).filter(([k])=>allowedG(k)).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
}
function yourCircleHTML(){
  const ks=recentGuardians().slice(0,6);
  if(!ks.length)return '<div class="card yourcircle"><div class="label">Your guardians</div><p class="small" style="margin-top:6px">Aura picks for you, or you can choose who to talk to.</p><button class="btn btn-ghost" data-gocircle="1" style="margin-top:10px">Pick a guardian</button></div>';
  const k0=ks[0];
  return '<div class="card yourcircle"><div class="label">Your guardians</div>'+
    '<button class="btn btn-main full" data-talk="'+k0+'" style="margin-top:10px">Keep going with '+esc(G[k0].name)+'</button>'+
    '<div class="gchips">'+ks.slice(1).map(k=>'<button class="gchip" data-talk="'+k+'" aria-label="Talk to '+esc(G[k].name)+'">'+glyph(k,40)+'<span>'+esc(G[k].name)+'</span></button>').join("")+'<button class="gchip" data-gocircle="1" aria-label="Pick any guardian"><span class="gplus">+</span><span>Anyone</span></button></div></div>';
}
function bdayHTML(){
  let h="";const mine=daysUntilMD(S.profile.bday),pn=S.profile.person;
  if(mine===0)h+='<div class="card rhythm"><div class="speaker">'+glyph("aura",30)+'<span class="who" style="color:var(--gold)">Aura · today</span></div><p style="margin-top:8px">Happy birthday'+(firstName()?", "+esc(firstName()):"")+'. It\'s your own new year'+(signOf(S.profile.bday)?', and '+esc(signOf(S.profile.bday).name)+' season is yours':'')+'. Let\'s mark it.</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-begin="birthday-threshold">The Birthday Threshold</button></div></div>';
  const pd=pn&&daysUntilMD(pn.bday);
  if(pn&&pd!=null&&pd<=7)h+='<div class="card rhythm"><div class="speaker">'+glyph("marigold",30)+'<span class="who" style="color:'+G.marigold.color+'">Marigold · coming up</span></div><p style="margin-top:8px">'+esc(pn.name||(pn.mode==="partner"?"Your partner":"Your crush"))+'\'s birthday is '+(pd===0?"today":pd===1?"tomorrow":"in "+pd+" days")+'. Want help making it feel like you meant it?</p><div class="row" style="margin-top:10px"><button class="btn btn-ghost" data-talk="marigold">Plan it with Marigold</button></div></div>';
  return h;
}
function threadInfo(name){
  const k=String(name||"").toLowerCase(),as=S.asks.filter(a=>(a.thread||"").toLowerCase()===k&&!a.noMem),es=S.entries.filter(e=>(e.thread||"").toLowerCase()===k);
  const ts=as.map(a=>a.ts).concat(es.map(e=>e.ts));if(!ts.length)return null;
  const first=Math.min(...ts),last=Math.max(...ts),days=Math.max(1,Math.round((Date.now()-first)/864e5));
  const lastAsk=as.slice().sort((a,b)=>b.ts-a.ts)[0];
  const recent=ts.filter(t=>Date.now()-t<14*864e5).length,prior=ts.filter(t=>Date.now()-t>=14*864e5&&Date.now()-t<28*864e5).length;
  const gaps=ts.slice().sort((a,b)=>a-b).some((t,i,a)=>i&&t-a[i-1]>7*864e5);
  let status=lastAsk&&lastAsk.follow&&lastAsk.follow.still?"unresolved":lastAsk&&lastAsk.follow&&/better|helped/i.test(lastAsk.follow.helped||"")?"easing":recent>prior+1&&prior>0?"coming up more":gaps&&Date.now()-last<7*864e5?"resurfaced":Date.now()-last>21*864e5?"quiet lately":"open";
  return {name,days,talks:as.length||es.length,status,last,lastAsk};
}
function noticings(){
  if(!memOn())return [];
  const out=[],mo=Date.now()-30*864e5,as=S.asks.filter(a=>a.ts>mo&&!a.noMem),es=S.entries.filter(e=>e.ts>mo);
  const top=threadsOf()[0];
  if(top){const late=as.filter(a=>a.thread===top[0]&&new Date(a.ts).getHours()>=20).length,all=as.filter(a=>a.thread===top[0]).length;if(all>=3&&late/all>=0.6)out.push(top[0]+" has come up more often after 8 PM lately.");}
  const rel=es.filter(e=>{const r=byId[e.ritualId];return r&&/release|let go|burn|cut|banish|dissolve/i.test(r.purpose+" "+r.title+" "+(r.tags||[]).join(" "));}).length;
  if(rel>=3)out.push("You've chosen release rituals "+rel+" times this month.");
  const gc={};for(const e of es)if(e.guardian&&e.guardian!=="aura")gc[e.guardian]=(gc[e.guardian]||0)+1;const tg=Object.entries(gc).sort((a,b)=>b[1]-a[1])[0];
  if(tg&&tg[1]>=3&&G[tg[0]])out.push(G[tg[0]].name+" has been with you most this month.");
  const helped=es.filter(e=>e.after==="Lighter"),hg={};for(const e of helped)hg[e.guardian]=(hg[e.guardian]||0)+1;const th=Object.entries(hg).sort((a,b)=>b[1]-a[1])[0];
  if(th&&th[1]>=2&&G[th[0]]&&(!tg||th[0]!==tg[0]))out.push("You've come away lighter most often with "+G[th[0]].name+".");
  const eve=es.filter(e=>new Date(e.ts).getHours()>=17).length;if(es.length>=5&&eve/es.length>=0.7)out.push("Most of your rituals happen in the evening.");
  return out.slice(0,4);
}
function heavyEvenings(){let n=0;for(let i=0;i<7;i++){const d=new Date(Date.now()-i*864e5),k=dayKey(d);if(S.asks.some(a=>dayKey(new Date(a.ts))===k&&new Date(a.ts).getHours()>=17&&!["hopeful"].includes(a.theme)))n++;}return n;}
function whyThis(t){return t?'<details class="whythis"><summary>Why this?</summary><p class="why" style="margin-top:6px">'+t+'</p></details>':'';}
function eveningPick0(ins){
  const day=Date.now()-18*3600e3,today=S.asks.filter(a=>a.ts>day),txt=today.map(a=>a.text||"").join(" ").toLowerCase(),d=S.days[dayKey(new Date())]||{};
  const pool=g=>R.filter(r=>canUse(r)&&!r.reset&&r.g===g&&r.min<=15&&!r.bath&&wxOK(r));
  let g=daypart()==="transition"?"juniper":"fern",why=[];const h=new Date().getHours();
  if(/anxious|anxiety|overthink|racing|can'?t (stop|shut|sleep)|spiral|worried|panic/.test(txt)||today.some(a=>a.guardian==="lily")){g="lily";why.push("Earlier today your mind was running hot, and you can't sleep on a racing head");}
  else if(/grie|miss (him|her)|died|loss|funeral/.test(txt)||today.some(a=>a.guardian==="willow")){g="willow";why.push("You've been carrying grief today, and it deserves somewhere soft to land before sleep");}
  else if(lowTank()||/tired|exhausted|drained|burn/.test(txt)){g="fern";why.push(lowTank()?"You started today with a low tank":"You told me you're running on empty");}
  else{why.push(today.length?"You've had a full day":"It's the end of the day");}
  if(M.name.includes("Waning")||M.name.includes("Crescent")&&!M.waxing)why.push("the moon is waning, so tonight is for letting go, not starting something");
  if(ritualsToday()>=1)why.push("you've already done "+ritualsToday()+(ritualsToday()===1?" ritual":" rituals")+" today, so I kept this one short");
  if(h>=22)why.push("it's late");
  const p=pool(g).length?pool(g):pool("fern").length?pool("fern"):pool("juniper");
  const r=pickForNow(p,new Date(),"wind")||byId["two-minute-settle"];
  return {r,why:esc(why.join(", ").replace(/^./,c=>c.toUpperCase()))+". "+esc(G[r.g].name)+" is better for tonight than anything that asks more of you."+(ins?" "+esc(ins):"")};
}
function eveningPick(ins){
  const base=eveningPick0(ins),r=base.r,h=new Date().getHours(),d=S.days[dayKey(new Date())]||{};
  const now=[],you=[],thisR=[];
  now.push(h>=22||h<5?"It's late":"It's evening");
  if(M.name.includes("Waning")||(!M.waxing&&M.name.includes("Crescent")))now.push("the moon is waning");
  const up=upcomingDates?upcomingDates(2):[];if(up.length)now.push(up[0].name+" is coming up");
  if(memOn()){
    const he=heavyEvenings();if(he>=3)you.push("you've had "+he+" heavy evenings this week");
    const open=threadsOf().map(t=>threadInfo(t[0])).filter(x=>x&&x.status!=="quiet lately"&&Date.now()-x.last<10*864e5)[0];
    if(open)you.push("you've been carrying "+open.name.toLowerCase()+" for "+open.days+(open.days===1?" day":" days")+(open.status==="unresolved"?" and it's still unresolved":""));
    if(lowTank())you.push("you started today with a low tank");
    const last=S.entries.find(e=>e.guardian===r.g&&e.after==="Lighter");if(last)you.push(G[r.g].name+" helped you last time");
    const longNight=S.entries.filter(e=>new Date(e.ts).getHours()>=21&&byId[e.ritualId]&&byId[e.ritualId].min>15).length;if(longNight===0&&S.entries.length>=4)you.push("you don't tend to do long rituals at night");
  }
  thisR.push(G[r.g].name+"'s "+r.title+" takes "+r.min+" minutes");
  const writes=r.steps.some(st=>/write|journal|list/i.test(st.d||""));if(!writes)thisR.push("doesn't ask you to write anything");
  thisR.push(/close|end|settle|rest|still|sleep|release|let/i.test(r.purpose+" "+r.steps.map(x=>x.t).join(" "))?"closes the day instead of opening something new":"is gentle enough for tonight");
  const cap=x=>x.charAt(0).toUpperCase()+x.slice(1);
  const why=esc(cap(now.join(" and ")))+". "+(you.length?esc(cap(you.slice(0,2).join(", and ")))+". ":"")+esc(cap(thisR[0]+", "+thisR.slice(1).join(" and ")))+".";
  // Permission to recommend nothing.
  const enough=ritualsToday()>=2||(lowTank()&&(h>=23||h<4))||(h>=0&&h<4&&ritualsToday()>=1);
  return {r,why,nothing:enough,nothingWhy:esc(cap(now.join(" and ")))+". "+(ritualsToday()?"You've already done "+ritualsToday()+(ritualsToday()===1?" ritual":" rituals")+" today. ":"")+(lowTank()?"You started with a low tank. ":"")+"Another ritual would be one more task, and you don't need one."};
}
function wroteSteps(r){return !!r&&r.steps.some(st=>/write|journal|list/i.test(st.d||""));}
function weekWith(g){return S.entries.filter(e=>e.guardian===g&&Date.now()-e.ts<7*864e5).length;}
function releaseThisWeek(){return S.entries.filter(e=>{const r=byId[e.ritualId];return Date.now()-e.ts<7*864e5&&r&&/release|let go|burn|cut|banish|dissolve/i.test(r.purpose+" "+r.title+" "+(r.tags||[]).join(" "));}).length;}
function personalPick(pk){
  if(!memOn())return pk;
  const r0=pk.r,mine=[];
  // writing made it worse last time: choose something without writing
  const hurt=S.entries.find(e=>wroteSteps(byId[e.ritualId])&&["Stirred up","The same"].includes(e.after)&&Date.now()-e.ts<30*864e5);
  if(hurt&&wroteSteps(r0)){const alt=R.filter(x=>canUse(x)&&!x.reset&&x.g===r0.g&&x.min<=15&&!x.bath&&!wroteSteps(x))[0]||R.filter(x=>canUse(x)&&!x.reset&&["juniper","lily","fern"].includes(x.g)&&x.min<=15&&!x.bath&&!wroteSteps(x))[0];if(alt){pk.r=alt;mine.push("Last time you were this wound up, writing made it harder. That's why I chose something without writing.");}}
  else if(hurt)mine.push("Last time you were this wound up, writing made it harder, so tonight there's nothing to write.");
  // release done twice on something still unresolved: stop prescribing release
  const open=threadsOf().map(t=>threadInfo(t[0])).filter(x=>x&&x.status==="unresolved"&&Date.now()-x.last<10*864e5)[0];
  if(open&&releaseThisWeek()>=2)pk.action={line:"I'm not sending you back to release work tonight. You've already done it twice this week and "+open.name.toLowerCase()+" is still unresolved. This may need action instead.",thread:open.name};
  const wk=weekWith(pk.r.g);
  if(wk>=2)mine.push("You've been with "+G[pk.r.g].name+" "+(wk===2?"twice":wk+" times")+" this week. That tells me you've needed "+({juniper:"closure",fern:"rest",willow:"comfort",lily:"quiet"}[pk.r.g]||"steadiness")+" more than insight lately.");
  const rp=resetProgress();if(rp.done.length&&rp.done.length<7&&rp.last&&Date.now()-rp.last>2*864e5)mine.push("You haven't finished the Energy Reset, but I'm not pushing you back into it tonight.");
  const pr=openPromises().find(p=>Date.now()-p.ts<4*864e5&&/bed|night|sleep|phone|work|screen|laptop/i.test(p.text));if(pr)mine.push("You said you'd "+pr.text.replace(/^i('ll| will)?\s*/i,"")+". Let's keep that promise tonight.");
  if(heavyEvenings()>=3)mine.push("You've had a lot on your mind in the evenings this week. I'm not asking you to process any more tonight.");
  pk.mine=mine[0]||"";if(mine.length>1)pk.why=esc(mine[1])+" "+pk.why;
  return pk;
}
/* Every rhythm surface goes through the priority engine first (17a-daily-context.js). */
function rhythmHTML(){return focusCardHTML(resolveCurrentFocus());}
function openingLine(known){
  if(!known)return "I'm Aura. Tell me what happened, and I'll take it from there.";
  if(!memOn())return "Tell me what happened, and I'll take it from there.";
  const recent=S.asks.filter(a=>!a.noMem&&a.thread&&Date.now()-a.ts<48*3600e3&&!(a.sitSnooze&&a.sitSnooze>Date.now())&&!a.settled).sort((a,b)=>b.ts-a.ts)[0];
  if(recent){const ti=threadInfo(recent.thread),t=recent.thread.toLowerCase();
    if(recent.tomorrow&&Date.now()-recent.ts>6*3600e3)return "Before you tell me anything, how did it go with "+t+"?";
    if(ti&&ti.talks>=2)return "Is this about "+t+" again?";
    if(Date.now()-recent.ts<20*3600e3)return "Still on "+t+", or is it something new?";}
  const lat=S.later&&S.later.find(l=>!l.done&&l.label);if(lat)return "You wanted to come back to "+lat.label+". Want to do that now?";
  return "I think I know what today has been about.";
}
function renderToday(){
  const p=S.profile, mins=pickedMins||p.minutes, H=memOn()?hist():[], known=H.length>0, b=todayBrief(), f=resolveCurrentFocus(), dr=dayRitual();
  const pick=(dr&&dr.r)||(b.ritualId&&byId[b.ritualId])||byId.anchor;
  // The engine decides what leads. When her life is louder than the clock, nothing else competes with it.
  let h='<div class="home"><p class="greet">'+esc(greeting())+'</p>'+
    (f.level>3?'<h2 class="hline">'+esc(openingLine(known))+'</h2>'+(known&&b.observation?'<p class="obs">'+esc(b.observation)+'</p>':''):'')+'</div>';
  if(!lastRead)h+=sinceHTML(f)+bdayHTML()+focusCardHTML(f);
  h+='<div class="aura" id="auraBox"><div class="speaker">'+glyph("aura")+'<span class="who">Aura is listening</span><button class="howbtn" id="howOpen" aria-label="How it works">?</button></div>'+
     '<label class="sr" for="carry">What happened</label><div class="composer"><textarea id="carry" placeholder="Tell me what happened. Messy is fine."></textarea>'+micBtn("carry")+'</div><p class="small muted" id="carryHint" hidden style="margin-top:6px"></p>'+
     '<details class="feelset"'+(feelSel.length?' open':'')+'><summary class="small">Not ready to talk? Tap how you feel.</summary><div class="chips" style="margin-top:8px" id="quick">'+QUICK.map(q=>'<button class="chip" data-q="'+esc(q[0])+'" aria-pressed="'+feelSel.includes(q[0])+'">'+esc(q[0])+'</button>').join("")+'<button class="chip calm" id="cantThink">Can\'t think</button></div></details>'+
     '<button class="btn btn-main full" id="askBtn" style="margin-top:14px">Tell Aura</button></div>';
  h+='<div id="readingSlot">'+(lastRead?readingHTML(lastRead):"")+'</div>';
  if(!lastRead){
    h+='<div id="nudgeSlot">'+nudgeHTML()+'</div>'+letterCardHTML();
    h+=yourCircleHTML();
    const dp=deeperHTML(),more=f.level<=3?stewardHTML({...f,level:6,steward:STEWARD[f.dp],insight:""}):"",fu=f.level===2?(followHTML()||checkinHTML()):"";
    h+='<details class="more"><summary>If you want more</summary>'+fu+more+'<div class="trio">'+
      '<div class="card hcard"><div class="label">Today\'s ritual</div><h3 style="margin-top:6px">'+esc(pick.title)+'</h3><p class="small muted" style="margin-top:4px">With '+esc(G[pick.g].name)+' · '+pick.min+' min. '+esc(dr?dr.why:(b.why||""))+'</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-begin="'+esc(pick.id)+'">Begin</button><button class="btn btn-ghost" data-peek="'+esc(pick.id)+'">See it first</button></div></div>'+
      (memOn()&&b.remembered?'<div class="card hcard"><div class="label">One thing I remember</div><p style="margin-top:6px">'+esc(b.remembered)+'</p><div class="row" style="margin-top:8px"><button class="linkish" id="memOpen">See everything I remember</button></div></div>':
        !memOn()?'<div class="card hcard"><div class="label">Memory is off</div><p class="small muted" style="margin-top:6px">I\'m not keeping anything, so every visit starts fresh.</p><button class="linkish" id="memOpen">Change</button></div>':'')+
      '<div class="card hcard"><div class="label">'+esc(dp.label)+'</div><p class="small" style="margin-top:6px">'+esc(dp.text)+'</p><div class="row" style="margin-top:10px">'+dp.btn+'</div></div>'+
      '</div>'+dateCardHTML()+'</details>';
  }
  h+='<p class="disclaim"><button class="linkish" data-how="1">How it works</button> · For reflection and ritual. Not medical or mental health advice.</p>';
  $("#v-today").innerHTML=h;
  if(!lastRead&&!pendingNudge()&&nudgeCandidate())setTimeout(makeNudge,300);
  if(!lastRead)setTimeout(refreshBrief,400);
}

function readingHTML(x){
  const g=G[x.guardian]||G.aura, same=x.guardian==="aura";
  const ch=chamberNudge(x);
  return '<div class="reading" style="border-color:'+g.color+'55">'+
   '<div class="handoff">'+guardianMark("aura")+'<p><span class="who2">Aura</span>'+esc(x.aura||("That's "+g.name+"'s work."))+(x.intro?' '+esc(x.intro):'')+'</p></div>'+
   (same?'':'<div class="head">'+guardianMark(x.guardian)+'<div><div class="who" style="color:'+g.color+'">'+esc(g.title)+'</div><div class="name">'+esc(g.name)+'</div></div></div>')+
   '<div class="body"><p class="voice">'+(voiceEnabled()?'<button class="hear" data-hear="'+(x.guardian||"aura")+'" aria-label="Hear it">'+HEAR_ICON+'</button>':'')+esc(x.reading)+'</p>'+
   (x.memory?'<div class="recall" id="recall"><div class="label">From your archive · '+esc(x.memory.date)+(x.memory.moon?' · '+esc(x.memory.moon):'')+'</div><p class="small muted" style="margin-top:4px">After '+esc(x.memory.ritualTitle)+', you wrote:</p><blockquote>"'+esc(x.memory.quote)+'"</blockquote><p class="voice" style="font-size:18px;margin-top:6px">'+esc(x.memory.question)+'</p><div class="row" style="margin-top:10px"><button class="btn btn-main" data-fromhere="'+esc(x.memory.id)+'">Work from there</button><button class="btn btn-ghost" id="freshBtn">Start fresh</button></div></div>':'')+
   memStripHTML(x)+(x.tomorrow?'<p class="small" style="margin:8px 0 0"><b>Tomorrow</b> I\'ll ask you '+esc(x.tomorrow.replace(/^(I'll ask|ask)( you)? ?/i,""))+'</p>':'')+whyThis(x.why)+
   (x.care?'<div class="care">You matter more than any ritual. If you are thinking about hurting yourself, please reach out to someone you trust now, or call or text <b>988</b> (Suicide and Crisis Lifeline, US).</div>':"")+
   (x.note?'<p class="small muted">'+esc(x.note)+(x.signin?' <button class="linkish" id="siOpen">Sign in</button>':x.limit&&!isMember()?' <button class="linkish" data-paywall="More readings">Get more with '+esc(PLAN.name)+'</button>':"")+'</p>':"")+actionHTML(x)+(ch||"")+
   (x.promise?'<div class="ask dark"><span>You said: "'+esc(x.promise)+'". Want me to hold you to it?</span><button class="chip" data-holdme="7">Check in a week</button><button class="chip" data-holdme="2">In two days</button></div>':'')+
   '<div class="row"><button class="btn btn-ghost" data-talkread="'+x.guardian+'">Talk to '+esc(g.name)+'</button><button class="btn btn-ghost" data-laterread="1">Bring this back later</button><button class="btn btn-ghost" id="againBtn">Ask something else</button></div>'+
   '<p class="small muted memline" id="memLine">'+(!memOn()?'Memory is off, so I won\'t keep this. <button class="linkish" id="memOpen">Change</button>':x.noMem?'I won\'t remember this one. <button class="linkish" id="remAgain">Remember it after all</button>':'I\'ll remember this. <button class="linkish" id="noRem">Don\'t remember this</button> · <button class="linkish" id="memOpen">What I remember</button>')+'</p></div></div>';
}
/* Visible memory: small moments where Aura shows she remembers. */
function memStripHTML(x){
  if(!memOn()||!x.thread)return "";
  const th=x.thread.toLowerCase(),same=S.asks.filter(a=>(a.thread||"").toLowerCase()===th&&!a.noMem&&a.id!==x.askId);
  const lines=[];
  if(same.length){const first=Math.min(...same.map(a=>a.ts)),days=Math.round((Date.now()-first)/864e5);
    if(days>=2)lines.push("We've been carrying this for "+days+" days.");
    const n30=same.filter(a=>Date.now()-a.ts<30*864e5).length;if(n30>=2)lines.push("This has come up "+(n30+1)+" times this month.");
    else lines.push("This connects to something you told me before.");}
  const helped=S.entries.find(e=>(e.thread||"").toLowerCase()===th&&e.after==="Lighter"&&e.ritualTitle&&!e.followup);
  if(helped)lines.push("Last time, "+helped.ritualTitle+" helped.");
  const still=same.find(a=>a.follow&&a.follow.still);
  if(still)lines.push("Last time it was still bothering you after, so I'm not repeating what didn't work.");
  return lines.length?'<div class="remember"><span class="label">I remember</span>'+lines.slice(0,3).map(l=>'<p>'+esc(l)+'</p>').join("")+'</div>':"";
}
function actionHTML(x){
  const g=G[x.guardian]||G.aura, a=x.action||"ritual";
  if(a==="talk")return '<div class="card"><p>'+esc(g.name)+' wants to talk this through before any ritual.</p><button class="btn btn-main full" style="margin-top:10px" data-talkread="'+x.guardian+'">Talk to '+esc(g.name)+'</button></div>';
  if(a==="write")return '<div class="card"><div class="label">One sentence</div><p class="voice" style="margin-top:6px">'+esc(x.writePrompt||"Finish this sentence: What I actually need is...")+'</p><label class="sr" for="oneLine">Your sentence</label><div class="composer" style="margin-top:10px"><textarea id="oneLine" style="min-height:70px" placeholder="Write or speak it."></textarea>'+micBtn("oneLine")+'</div><button class="btn btn-main full" style="margin-top:10px" id="saveLine">Save to my archive</button></div>';
  if(a==="rest")return '<div class="card"><div class="label">Nothing more tonight</div><p style="margin-top:6px">You already did enough. The work keeps working after you stop.</p><button class="btn btn-ghost full" style="margin-top:10px" id="restBtn">Close the day</button></div>';
  if(a==="simplify")return '<div class="card"><p>Just one thing. No choices.</p><button class="btn btn-main full" style="margin-top:10px" id="simpleGo">Breathe with me</button></div>';
  if(a==="answer")return '<div class="card memory"><div class="label">From your Archive</div><p style="margin-top:6px;font-size:18px">'+esc(x.answer||"")+'</p>'+((x.cites||[]).length?'<div class="entries" style="margin-top:8px">'+x.cites.map(id=>{const e=S.entries.find(z=>z.id===id);return e?'<button class="entry" data-entry="'+esc(id)+'">'+glyph(e.guardian)+'<span><div class="t">'+esc(e.ritualTitle)+'</div><div class="m">'+fmtDate(e.ts)+'</div>'+(e.text?'<div class="x">'+esc(e.text)+'</div>':'')+'</span></button>':"";}).join("")+'</div>':'')+'</div>';
  if(a==="circle")return '<div class="stack">'+x.circle.map(c=>'<div class="card"><div class="row">'+glyph(c.guardian,34)+'<div style="flex:1;min-width:0"><div class="label" style="color:'+G[c.guardian].color+'">'+esc(G[c.guardian].name)+' sees it as</div><p style="margin-top:2px">'+esc(c.view)+'</p></div></div><button class="btn btn-ghost full" style="margin-top:10px" data-circlepick="'+c.guardian+'">Go with '+esc(G[c.guardian].name)+'</button></div>').join("")+'</div>';
  if(a==="decide")return '<div class="card"><p>'+esc(g.name)+' will walk you through it: what you want, what you fear, what you think you owe, and what you\'ve said matters to you. You decide.</p><button class="btn btn-main full" style="margin-top:10px" data-decide="'+x.guardian+'">Walk through it with '+esc(g.name)+'</button></div>';
  if(a==="event"&&x.plan)return '<div class="card"><div class="label">A path for this · '+esc(x.plan.title)+'</div><ol class="plan">'+x.plan.steps.map(st=>'<li><b>'+esc(st.title||"")+'</b><br><span class="small muted">'+esc(st.note||"")+'</span></li>').join("")+'</ol><button class="btn btn-main full" id="planStart">Start this path</button></div>';
  if(a==="build")return ritualCard(x.ritual,{ctx:"read"})+'<button class="btn btn-ghost full" id="saveMine">Save to my rituals</button>';
  if(a==="revisit"){const e=S.entries.find(z=>z.id===x.revisit);return '<div class="card memory"><div class="label">You already wrote the answer · '+esc(fmtDate(e.ts))+'</div><p class="small muted" style="margin-top:6px">After '+esc(e.ritualTitle)+':</p><blockquote>"'+esc((e.text||"").slice(0,280))+'"</blockquote><div class="row" style="margin-top:10px"><button class="btn btn-main" data-entry="'+esc(e.id)+'">Open the entry</button><button class="btn btn-ghost" data-talkread="'+x.guardian+'">Talk to '+esc(g.name)+'</button></div></div>';}
  return ritualCard(x.ritual,{ctx:"read"});
}
function chamberNudge(x){
  const t=recentThemes(14)[x.theme]||0;
  const c=CHAMBERS[x.guardian]; if(!c||t<2||isMember())return "";
  return '<div class="card"><div class="label">A deeper tool</div><p style="margin-top:6px">You keep returning to '+esc(x.theme)+'. '+esc(G[x.guardian].name)+'\'s chamber may help.</p><h3 style="margin-top:8px">'+esc(c.name)+'</h3><p class="small muted" style="margin-top:4px">'+esc(c.d)+'</p><button class="btn btn-ghost" style="margin-top:10px" data-chamber="'+x.guardian+'">Open the chamber</button></div>';
}
/* The altar draw lives in 17d-tarot.js. drawPick is shared. */
function drawPick(){const v=S.draws[dayKey(today)];if(v==null)return null;if(typeof v!=="object")return 0;if(Array.isArray(v.picks))return v.picks.length>=3?v.picks[1]:null;return v.pick==null?null:v.pick;}
function cardBack(){return '<svg viewBox="0 0 112 168" aria-hidden="true"><g fill="none" stroke="#E7C45A" stroke-opacity=".75" stroke-width="1"><circle cx="56" cy="84" r="26"/><circle cx="56" cy="84" r="34" stroke-dasharray="2 4"/><path d="M56 44v80M16 84h80M30 58l52 52M82 58l-52 52" stroke-opacity=".3"/><path d="M62 70a14 14 0 1 0 0 28a11 11 0 1 1 0-28z" fill="#E7C45A" fill-opacity=".85" stroke="none"/></g><text x="56" y="152" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="10" fill="#E7C45A" letter-spacing="2">ALTAR</text></svg>';}
function resurface(){
  const old=S.entries.filter(e=>!e.private&&e.text&&(Date.now()-e.ts)>2*864e5);
  if(!old.length)return null;
  const same=old.filter(e=>e.moon===M.name);
  const pool=same.length?same:old;
  return pool[hash(dayKey(today))%pool.length];
}

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
/* Guardians steward the ordinary day. Aura interrupts any of them when life matters more. */
const STEWARD={dawn:"aurora",morning:"aurora",afternoon:"sol",transition:"juniper",evening:"fern",deepnight:"fern"};
const HEAVY_RE=new RegExp(PRIORITY_HEAVY_PATTERN,"i");
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
    (cycleAIText(now)?cycleAIText(now)+"\n":"")+movementAIText()+goalAIText()+wxAIText()+
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
function speaker(g,t){return '<div class="speaker">'+guardianMark(g,30,true)+'<span class="who" style="color:'+(g==="aura"?"var(--gold)":G[g].color)+'">· '+esc(t)+'</span></div>';}
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
function dayRitualHTML(){const dr=dayRitual();if(!dr)return "";return '<div class="dayrit"><span class="label">Today\'s ritual</span><p style="margin-top:4px"><b>'+esc(dr.r.title)+'</b> with '+esc(G[dr.r.g].name)+' · '+dr.r.min+' min</p><p class="small muted">'+esc(dr.why)+'</p><p class="small muted">This is your ritual for the day. The day around it can change, but this one does not reshuffle unless your real-life situation takes priority.</p><div class="row" style="margin-top:8px"><button class="btn btn-ghost sm" data-begin="'+esc(dr.r.id)+'">Begin</button><button class="btn btn-ghost sm" data-peek="'+esc(dr.r.id)+'">See it first</button></div></div>';}
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
    const rowan=d.moved==null?'<div class="subrow">'+guardianMark("rowan",24)+'<div><p class="small"><b style="color:'+G.rowan.color+'">Rowan:</b> did you move your body today?</p>'+chipsQ("moved",MOVEDQ,null)+'<button class="linkish small" data-guardian="rowan" style="margin-top:5px">Open movement with Rowan</button></div></div>':
      d.moved===0?'<div class="subrow">'+guardianMark("rowan",24)+'<div><p class="small"><b style="color:'+G.rowan.color+'">Rowan:</b> no judgment. Want the smallest version?</p><div class="row" style="margin-top:6px"><button class="btn btn-ghost sm" data-begin="'+(lowTank()?"one-song-dance":"walk-it-off")+'">Move with Rowan</button><button class="chip" data-moved="1">Did a little</button></div><button class="linkish small" data-guardian="rowan" style="margin-top:5px">Log it with Rowan</button></div></div>':'';
    const goal=activeGoals()[0],goalLine=goal?'<div class="subrow">'+guardianMark("sol",24)+'<div><p class="small"><b style="color:'+G.sol.color+'">Sol is holding:</b> '+esc(goal.title)+(goal.next?'<br><span class="muted">Next move: '+esc(goal.next)+'</span>':'')+'</p><button class="linkish small" data-guardian="sol" style="margin-top:5px">Open goals with Sol</button></div></div>':'';
    return '<div class="card rhythm">'+speaker("sol","midday")+'<p style="margin-top:8px">Halfway. What actually got done, and what deserves the rest of the day? Real version, not the tidy one.</p>'+why+arcHTML(dp)+goalLine+rowan+'</div>';
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
function renderSky(){
  const now=new Date(),dp=daypart(now),f=resolveCurrentFocus(now),se=plainSeason(now),pn=plantNow(now),w=typeof wxNow==="function"?wxNow():null,root=document.documentElement;
  root.dataset.daypart=dp;
  root.dataset.light=w&&w.solarPhase?w.solarPhase:fallbackLight(dp);
  root.dataset.atmosphere=atmosphereMood(f,now.getTime());
  root.style.setProperty("--moonglow",(0.35+0.65*M.ill).toFixed(2));
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
/* ------------------------------------------------------------------
   IRIS, THE CYCLE KEEPER. Opt in only. Context, not dismissal.
   Cycle history is kept apart from everything else: its own key on
   this device and its own table (cycle_events) in her account. It is
   never added to prefs, never shown on the admin dashboard, never put
   in Friends Week telemetry (only the bare event "cycle_feature_used"),
   and never sent to an AI in full. Every number here is plain code.
   No ovulation or fertile window, no diagnosis, not contraception.
------------------------------------------------------------------ */
const CYC_KEY="dailyAlchemist.cycle";
let C=cycleLoad();
function cycleBlank(){return {mode:null,irregular:false,consent:false,consentVersion:2,events:[],syncedAt:0};}
function cycleLoad(){
  try{
    const raw=localStorage.getItem(CYC_KEY);
    if(raw){
      const parsed=JSON.parse(raw),out={...cycleBlank(),...parsed};
      /* Earlier builds silently opted cycle tracking into Circle sharing. Revoke that
         inferred permission once and ask for an explicit choice instead. */
      if(parsed.consentVersion!==2){out.consent=false;out.consentVersion=2;localStorage.setItem(CYC_KEY,JSON.stringify(out));}
      return out;
    }
  }catch(e){}
  return cycleBlank();
}
function cycleSave(){try{localStorage.setItem(CYC_KEY,JSON.stringify(C));}catch(e){}}
function cycleReset(){C=cycleBlank();try{localStorage.removeItem(CYC_KEY);}catch(e){}}
function cycleOn(){return C.mode==="periods"||C.mode==="peri"||C.mode==="meno";}
function cycleShared(){return cycleOn()&&C.consent===true;}
const isoDay=d=>{d=new Date(d);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
const cyDn=s=>Math.round(new Date(s+"T12:00:00").getTime()/864e5);
const cyFrom=n=>new Date(n*864e5);
const fmtMD=n=>cyFrom(n).toLocaleDateString(undefined,{month:"long",day:"numeric"});

/* Cloud: one row per event, plus one settings row. Row level security keeps them hers. */
function cycleCloud(){return MODE==="web"&&typeof ACCT!=="undefined"&&ACCT.user&&ACCT.sb?ACCT.sb:null;}
async function cyclePutRow(ev){const sb=cycleCloud();if(!sb)return;try{await sb.from("cycle_events").upsert({id:ev.id,user_id:ACCT.user.id,kind:ev.kind,day:ev.day||null,data:ev.data||{}});}catch(e){}}
async function cyclePutSettings(){const sb=cycleCloud();if(!sb)return;try{await sb.from("cycle_events").upsert({id:"settings-"+ACCT.user.id,user_id:ACCT.user.id,kind:"settings",day:null,data:{mode:C.mode,irregular:C.irregular,consent:C.consent,consentVersion:2}});}catch(e){}}
async function cycleSync(){
  const sb=cycleCloud();if(!sb)return;
  try{
    const {data,error}=await sb.from("cycle_events").select("id,kind,day,data").limit(2000);if(error||!data)return;
    const have=new Map(C.events.map(e=>[e.id,e]));
    for(const r of data){
      if(r.kind==="settings"){const d=r.data||{},legacy=d.consentVersion!==2;if(!C.mode&&d.mode){C.mode=d.mode;C.irregular=!!d.irregular;C.consent=legacy?false:!!d.consent;C.consentVersion=2;}if(legacy&&C.mode)cyclePutSettings();continue;}
      if(!have.has(r.id))C.events.push({id:r.id,kind:r.kind,day:r.day,data:r.data||{}});
    }
    const local=C.events.filter(e=>!data.some(r=>r.id===e.id));for(const e of local)cyclePutRow(e);
    C.syncedAt=Date.now();cycleSave();
  }catch(e){}
}
async function cycleDeleteHistory(){
  const sb=cycleCloud();
  if(sb){try{const {error}=await sb.from("cycle_events").delete().eq("user_id",ACCT.user.id).neq("kind","settings");if(error){toast("Couldn't delete your cycle history. Try again.");return false;}}catch(e){toast("Couldn't delete your cycle history. Try again.");return false;}}
  C.events=[];cycleSave();return true;
}
function cycleAdd(kind,day,data){
  const ev={id:"c"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),kind,day:day||isoDay(Date.now()),data:data||{}};
  if(kind==="start"&&C.events.some(e=>e.kind==="start"&&e.day===ev.day))return null;
  C.events.push(ev);cycleSave();cyclePutRow(ev);track("cycle_feature_used");return ev;
}

/* The math: her own history, never a 28 day template. */
function cycleStarts(){return [...new Set(C.events.filter(e=>e.kind==="start").map(e=>e.day))].sort().map(cyDn);}
function cycleLengths(){const s=cycleStarts(),L=[];for(let i=1;i<s.length;i++){const d=s[i]-s[i-1];if(d>=15&&d<=60)L.push(d);}return L;}
function cycleNow(now){
  now=now||new Date();const tn=cyDn(isoDay(now)),s=cycleStarts().filter(n=>n<=tn),last=s[s.length-1];
  if(last==null)return {day:null,last:null};
  const day=tn-last+1;
  const end=C.events.filter(e=>e.kind==="end"&&cyDn(e.day)>=last).map(e=>cyDn(e.day)).sort()[0];
  const bleeding=day<=8&&(end==null||end>=tn);
  return {day:day<=70?day:null,last,bleeding,startedToday:last===tn,startedRecently:tn-last<=1};
}
function cycleEstimate(now){
  const cn=cycleNow(now);
  if(C.mode==="meno")return {kind:"none",line:"No predictions here. I'll keep your record and notice what repeats."};
  if(C.mode==="peri")return {kind:"none",line:"Cycles can get less predictable in perimenopause, so I won't guess a date. I'll keep the record and tell you what repeats."};
  const L=cycleLengths().slice(-4);
  if(cn.last==null)return {kind:"none",line:"Log the day your next period starts, or add a few past start dates, and I'll start learning your rhythm."};
  if(L.length<2)return {kind:"none",line:"I don't have enough cycles yet to estimate. A few more starts and I'll give you a range."};
  const lo=Math.min(...L),hi=Math.max(...L);
  if(C.irregular||hi-lo>9)return {kind:"varied",range:[lo,hi],line:"Your recent cycles have varied, so I don't have a tight estimate yet."};
  const a=cn.last+lo-(lo===hi?1:0),b=cn.last+hi+(lo===hi?1:0);
  return {kind:"range",range:[lo,hi],from:a,to:b,line:"Based on your last "+L.length+" cycles, your next period may start around "+fmtMD(a)+" to "+(cyFrom(a).getMonth()===cyFrom(b).getMonth()?cyFrom(b).getDate():fmtMD(b))+"."};
}
function logsByDay(){const m={};for(const e of C.events)if(e.kind==="log")m[e.day]={...(m[e.day]||{}),...e.data};return m;}
function todayLog(now){return logsByDay()[isoDay(now||Date.now())]||null;}
/* What repeats for HER: needs at least two earlier cycles showing the same thing. */
function cyclePatterns(now){
  const cn=cycleNow(now);if(cn.day==null)return [];
  const s=cycleStarts(),logs=logsByDay(),out=[];
  const prior=[];for(let i=0;i+1<s.length;i++)if(s[i+1]<=cn.last)prior.push([s[i],s[i+1]]);
  if(prior.length<2)return out;
  const recent=prior.slice(-4);
  const dayLog=(n)=>logs[isoDay(cyFrom(n))]||null;
  const lowE=recent.filter(([a])=>{for(let k=-2;k<=2;k++){const l=dayLog(a+cn.day-1+k);if(l&&l.energy===1)return true;}return false;}).length;
  if(lowE>=2)out.push({k:"energy",line:"Over your last "+recent.length+" cycles, your energy dipped around this point."});
  const est=cycleEstimate(now);
  if(est.kind==="range"){
    const tn=cyDn(isoDay(now||Date.now())),until=est.from-tn;
    const hd=recent.filter(([,b])=>{for(let k=1;k<=3;k++){const l=dayLog(b-k);if(l&&l.headache)return true;}return false;}).length;
    if(hd>=2&&until>=0&&until<=4)out.push({k:"headache",line:"You've logged headaches two or three days before bleeding in "+hd+" recent cycles."});
  }
  if(memOn()){
    const over=recent.filter(([a])=>S.asks.some(x=>!x.noMem&&/overwhelm|too much|exhaust|drain/i.test(x.text||"")&&Math.abs(cyDn(isoDay(x.ts))-(a+cn.day-1))<=2)).length;
    if(over>=2)out.push({k:"overwhelm",line:"You've come to Aura feeling overwhelmed around this point before."});
  }
  return out;
}
/* What the rest of the app may know: only with her permission, and only a summary. */
function cycleContext(now){
  if(!cycleShared())return null;
  const cn=cycleNow(now),tl=todayLog(now),pat=cyclePatterns(now);
  const rough=!!tl&&(tl.cramps>=2||tl.energy===1||tl.headache||tl.sleep===1);
  return {day:cn.day,bleeding:!!cn.bleeding,startedToday:!!cn.startedToday,startedRecently:!!cn.startedRecently,
    heavy:(cn.bleeding&&cn.day!=null&&cn.day<=2)||rough,rough,todayLog:tl,pattern:pat[0]?pat[0].line:"",mode:C.mode};
}
function cycleAIText(now){
  const c=cycleContext(now);if(!c)return "";
  const bits=[];if(c.day!=null)bits.push("cycle day "+c.day+(c.bleeding?" (on her period)":""));if(c.startedToday)bits.push("her period started today");
  if(c.todayLog){const t=c.todayLog;if(t.cramps>=2)bits.push("strong cramps");if(t.energy===1)bits.push("low energy");if(t.headache)bits.push("headache");if(t.sleep===1)bits.push("rough sleep");}
  if(c.pattern)bits.push("her own pattern: "+c.pattern);
  return bits.length?"IRIS (cycle context she chose to share, a summary only): "+bits.join("; ")+". Iris may give context but NEVER invalidates her actual situation. Never say she feels something because of her period. Good: Iris has noticed your energy usually drops around this point. That may be turning the volume up, but the problem you described is still real.":"";
}

/* Iris's page in the Circle */
const CYC_FIELDS=[["flow","Flow",[["None",0],["Light",1],["Medium",2],["Heavy",3]]],["cramps","Cramps",[["None",0],["Mild",1],["Strong",2]]],["energy","Energy",[["Low",1],["Some",2],["Good",3]]],["mood","Mood",[["Low",1],["Steady",2],["Good",3],["On edge",4]]],["sleep","Sleep",[["Rough",1],["Okay",2],["Good",3]]],["headache","Headache",[["No",0],["Yes",1]]],["cravings","Cravings",[["No",0],["Yes",1]]],["libido","Libido",[["Low",1],["Usual",2],["High",3]]]];
let cycDraft={};
function irisPanelHTML(){
  if(!C.mode)return '<div class="card iris">'+auraSays("Want me to keep track with you? Only if you want. It stays private, and you can delete it any time.","Iris")+
    '<div class="chips" style="margin-top:10px"><button class="chip" data-cycmode="periods">Track my periods</button><button class="chip" data-cycmode="peri">I\'m in perimenopause</button><button class="chip" data-cycmode="meno">I\'m in menopause</button><button class="chip" data-cycmode="none">Not now</button></div></div>';
  if(C.mode==="none")return '<div class="card iris"><p class="small">You chose not to track for now. That\'s fine. I\'m still here to talk.</p><button class="linkish" data-cycmode="ask" style="margin-top:6px">Start tracking</button></div>';
  const cn=cycleNow(),est=cycleEstimate(),L=cycleLengths().slice(-4),pat=cyclePatterns(),tl=todayLog()||{};
  let h='<div class="card iris">';
  if(C.mode!=="meno"){
    h+='<div class="cycstat">'+(cn.day!=null?'<div class="cday"><span>Cycle day</span><b>'+cn.day+'</b></div>':'')+'<div class="cinfo">'+
      (cn.last!=null?'<p class="small">Last period started '+esc(fmtMD(cn.last))+'.</p>':'')+
      (L.length>=2?'<p class="small">Your recent cycles: '+Math.min(...L)+(Math.min(...L)===Math.max(...L)?'':' to '+Math.max(...L))+' days.</p>':'')+
      '<p class="small">'+esc(est.line)+'</p></div></div>';
    h+=cn.bleeding&&!cn.startedToday?'<button class="btn btn-ghost full" data-cycend="1">My period ended today</button>':'<button class="btn btn-main full" data-cycstart="1"'+(cn.startedToday?' disabled':'')+'>'+(cn.startedToday?'Logged: your period started today':'My period started today')+'</button>';
  }
  if(pat.length)h+='<div class="remember" style="margin-top:12px"><span class="label">Iris has noticed</span>'+pat.map(p=>'<p>'+esc(p.line)+'</p>').join("")+'<p class="small muted">Pattern, not prophecy. It may turn the volume up. It never makes what you\'re dealing with less real.</p></div>';
  h+='<details class="cyclog"'+(Object.keys(cycDraft).length?' open':'')+'><summary>Log today'+(Object.keys(tl).length?' · logged':'')+'</summary><p class="small muted">Tap only what you want. Nothing is required.</p>'+
    CYC_FIELDS.filter(f=>C.mode==="meno"?f[0]!=="flow":true).map(([k,lab,opts])=>{const cur=cycDraft[k]!=null?cycDraft[k]:tl[k];return '<div class="sndrow"><span>'+lab+'</span><div class="chips">'+opts.map(([l,v])=>'<button class="chip sm" data-cyclog="'+k+':'+v+'" aria-pressed="'+(cur===v)+'">'+l+'</button>').join("")+'</div></div>';}).join("")+
    '<div class="field" style="margin-top:8px"><label for="cycNote">Note (optional)</label><input type="text" id="cycNote" maxlength="200" value="'+esc(cycDraft.note!=null?cycDraft.note:(tl.note||""))+'"></div><button class="btn btn-main full" data-cycsave="1" style="margin-top:10px">Save today</button></details>';
  if(C.mode!=="meno")h+='<details class="cyclog"><summary>Add an earlier period start</summary><p class="small muted">A few past start dates let me give you a range sooner.</p><div class="row" style="margin-top:8px"><input type="date" id="cycPast" max="'+isoDay(Date.now())+'"><button class="chip" data-cycpast="1">Add</button></div></details>';
  h+='<details class="cyclog"><summary>Privacy and settings</summary>'+
    '<label class="switch" for="cycConsent">Let Aura and the Circle use my cycle context<input type="checkbox" id="cycConsent"'+(C.consent?' checked':'')+'></label>'+
    '<p class="small muted">When this is on, Aura and the guardians only see a summary, like cycle day 2, low energy. Never your full history.</p>'+
    (C.mode==="periods"?'<label class="switch" for="cycIrreg">I use hormonal birth control, or my cycle is irregular<input type="checkbox" id="cycIrreg"'+(C.irregular?' checked':'')+'></label>':'')+
    '<div class="chips" style="margin-top:8px"><button class="chip sm" data-cycmode="periods" aria-pressed="'+(C.mode==="periods")+'">Periods</button><button class="chip sm" data-cycmode="peri" aria-pressed="'+(C.mode==="peri")+'">Perimenopause</button><button class="chip sm" data-cycmode="meno" aria-pressed="'+(C.mode==="meno")+'">Menopause</button><button class="chip sm" data-cycmode="none">Stop tracking</button></div>'+
    '<button class="btn btn-ghost full danger" data-cycdel="1" style="margin-top:12px">Delete my cycle history</button>'+
    '<p class="small muted" style="margin-top:8px">Your cycle history is kept separately, is included when you export, and is deleted if you delete your account. It is not shown in Friends Week analytics or the admin dashboard. Aura and the Circle only receive a short summary if you choose to share cycle context. This is for noticing your own patterns. It is not contraception, it doesn\'t predict fertility, and it can\'t diagnose anything. If something feels off, talk to a clinician.</p></details>';
  return h+'</div>';
}
function rerenderIris(){const el=document.querySelector(".card.iris");if(el)el.outerHTML=irisPanelHTML();}
function irisClick(t,d){
  if(d.cycmode!==undefined){
    if(d.cycmode==="ask"){C.mode=null;}else{const first=!C.mode||C.mode==="none";C.mode=d.cycmode;if(first&&d.cycmode!=="none"){C.consent=false;C.consentVersion=2;}}
    cycleSave();cyclePutSettings();if(C.mode&&C.mode!=="none")track("cycle_feature_used");rerenderIris();
    if(C.mode&&C.mode!=="none"&&!C.events.length)toast("I'll keep it private. If you want Aura and the Circle to use a short summary, you can turn that on below.");
    renderToday();return true;}
  if(d.cycstart){cycleAdd("start");rerenderIris();renderToday();toast("Logged. I'll keep today lighter.");return true;}
  if(d.cycend){cycleAdd("end");rerenderIris();toast("Logged.");return true;}
  if(d.cyclog){const [k,v]=d.cyclog.split(":");cycDraft[k]=+v;t.parentElement.querySelectorAll("[data-cyclog]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return true;}
  if(d.cycsave){const n=($("#cycNote")||{}).value;if(n!=null&&n.trim())cycDraft.note=n.trim().slice(0,200);if(Object.keys(cycDraft).length){cycleAdd("log",null,{...cycDraft});cycDraft={};toast("Saved.");rerenderIris();renderToday();}else toast("Tap anything you want to log first.");return true;}
  if(d.cycpast){const v=($("#cycPast")||{}).value;if(!v){toast("Choose a date.");return true;}if(!cycleAdd("start",v))toast("That start is already logged.");else toast("Added.");rerenderIris();return true;}
  if(d.cycdel){if(t.dataset.sure!=="1"){t.dataset.sure="1";t.textContent="Tap again to delete it all for good";return true;}t.disabled=true;cycleDeleteHistory().then(ok=>{if(ok){toast("Your cycle history is deleted.");rerenderIris();renderToday();}else t.disabled=false;});return true;}
  if(t.id==="cycConsent"){C.consent=!!t.checked;cycleSave();cyclePutSettings();renderToday();return true;}
  if(t.id==="cycIrreg"){C.irregular=!!t.checked;cycleSave();cyclePutSettings();rerenderIris();return true;}
  return false;
}
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
  const n=spreadSize();while(out.length<n&&i<300){const c=TAROT[hash(k+"t"+i)%TAROT.length];if(!out.includes(c.id))out.push(c.id);i++;}
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
  return c.name+(/s$/.test(c.name)?"'":"'s")+" question tonight: "+(rev?"what would it take to set "+th+" down?":"what did "+th+" ask of you today?");
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
  const nm=c.major?c.name.replace(/^The /,"THE "):c.name,accent=c.major?(G[holderOf(c)]||G.aura).color:({wands:"#B55A36",cups:"#4D7F91",swords:"#6B668C",pentacles:"#7C7040"}[c.suit]||GOLD);
  return '<svg class="tcard'+(rev?' rev':'')+'" viewBox="0 0 100 160" aria-hidden="true">'+
    '<rect x="0" y="0" width="100" height="160" rx="8" fill="#F7EDCF"/><circle cx="50" cy="73" r="31" fill="'+accent+'" fill-opacity=".055"/>'+
    '<path d="M12 14h12M76 14h12M12 146h12M76 146h12" stroke="'+accent+'" stroke-opacity=".65" stroke-width="1.2"/>'+
    '<circle cx="16" cy="18" r="1.4" fill="'+accent+'"/><circle cx="84" cy="18" r="1.4" fill="'+accent+'"/><circle cx="16" cy="142" r="1.4" fill="'+accent+'"/><circle cx="84" cy="142" r="1.4" fill="'+accent+'"/>'+
    '<rect x="3" y="3" width="94" height="154" rx="6" fill="none" stroke="'+GOLD+'" stroke-width="1.2"/><rect x="6.5" y="6.5" width="87" height="147" rx="4" fill="none" stroke="'+accent+'" stroke-opacity=".5" stroke-width=".8"/>'+
    '<text x="50" y="22" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="9" letter-spacing="1.5" fill="'+GOLD+'">'+esc(c.num)+'</text>'+art+
    '<path d="M14 128h72" stroke="'+GOLD+'" stroke-opacity=".5" stroke-width=".6"/><text x="50" y="142" text-anchor="middle" font-family="Lora, Georgia, serif" font-size="'+(nm.length>16?6.4:nm.length>12?7.4:8.4)+'" font-weight="600" fill="'+INK+'">'+esc(nm.toUpperCase())+'</text></svg>';
}
function cardFace(id){return cardSVG(id,cardRev(id));}
function drawHTML(d){
  const g=d.g,r=guardianDaily(g),c=d.card;
  return '<div class="label" style="color:'+G[g].color+'">'+esc(d.num)+' · '+esc(d.title)+'</div>'+
   (c.major?'<p class="small muted" style="margin-top:4px">'+esc(d.keywords)+'</p>':'<p class="small muted" style="margin-top:4px">'+esc(SUITS[c.suit].name)+' · '+esc(c.el)+'</p>')+
   '<p style="margin-top:10px">'+esc(d.meaning)+'</p><p class="small" style="margin-top:8px">'+esc(personalCardLine(d.rev?d.card.revTheme:d.card.theme,g,d.rev))+'</p>'+
   (d.now?'<p class="cardnow"><span class="label">Right now</span> '+esc(d.now)+'</p>':'')+
   '<div class="cardq"><div class="label">Ask yourself</div><p class="voice" style="margin-top:4px">'+esc(d.question)+'</p></div>'+
   '<p class="small" style="margin-top:10px">'+esc(G[g].name)+', '+esc(G[g].title)+', holds this card.</p>'+
   '<div class="row" style="margin-top:12px;flex-wrap:wrap;gap:8px"><button class="btn btn-main" data-cardask="1">What does this mean for me?</button>'+(r?'<button class="btn btn-ghost" data-begin="'+esc(r.id)+'">'+esc(r.title)+' · '+r.min+' min</button>':'')+'</div>'+
   '<button class="linkish" style="margin-top:10px" data-talk="'+g+'">Talk it through with '+esc(G[g].name)+'</button>';
}

/* ---------- Free: one card. Inner Circle: three cards read together. ----------
   Either way the reading leans on what Aura knows (open situations, body, the day's
   question, who's been near her lately) without naming it bluntly. */
const SPREAD_POS=[["What you're carrying","what you're carrying"],["What's asking for your attention","what's asking for your attention"],["What will help","what will help"]];
function drawRec(){const v=S.draws[dayKey(today)];return v==null?null:(typeof v==="object"?v:{pick:v});}
function threeMode(){return isMember();}
function spreadSize(){return threeMode()?7:5;}
function threePicks(){const r=drawRec();return r&&Array.isArray(r.picks)?r.picks:[];}
function threeDone(){return threePicks().length>=3;}
function drawnCards(){
  const sp=drawSpread();
  return threePicks().slice(0,3).map((i,k)=>{const id=sp[i],c=TAROT_BY[id],rev=cardRev(id);return {pos:k,id,c,rev,g:holderOf(c),title:c.name+(rev?", reversed":""),meaning:rev?c.revMeaning:c.meaning,theme:rev?c.revTheme:c.theme};});
}
/* A sentence that fits her day without spelling it out. */
function personalCardLine(theme,g,rev){
  const f=resolveCurrentFocus(),arc=(S.days[nightKey()]||{}).arc||{},out=[];
  if(f.level===1)return "Before anything a card can say: you matter more than this reading. Take care of you first.";
  if(f.level===2)out.push(rev?"If something from earlier is still sitting with you, read this card against it. It names "+theme+" as the thing to watch.":f.sit.still?"Where something is still unsettled, this card is less about fixing it and more about "+theme+".":"If something from earlier is still sitting with you, read this card against it. It points toward "+theme+".");
  else if(f.level===4||f.body.significant)out.push(rev?"Read it gently today. Your body is asking for less, and "+theme+" will feel louder than it is.":"Read it gently today. Your body is asking for less, so "+theme+" can be small.");
  else if(arc.m)out.push("Hold it next to what you said deserves your energy today.");
  if(memOn()&&g&&g!=="aura"){const wk=S.entries.filter(e=>e.guardian===g&&Date.now()-e.ts<14*864e5).length;if(wk>=2)out.push(G[g].name+" keeps turning up near you lately. That's not an accident.");}
  if(!out.length)out.push({m:"Carry it lightly into the day and notice where it shows up.",d:"Look back at the morning through it. Where has it already been true?",t:"Let it walk you home. What does it change about tonight?",n:"Sleep on it. Cards often make more sense in the morning."}[arcPart(daypart())]);
  return out.slice(0,2).join(" ");
}
function localThreeReading(cs){
  const [a,b,c]=cs;
  return "What you're carrying: "+a.title+", "+a.theme+". What's asking for your attention, the heart of today's reading: "+b.title+", "+b.theme+". What will help: "+c.title+", "+c.theme+". "+personalCardLine(b.theme,b.g,b.rev);
}
async function fetchThreeReading(){
  const rec=drawRec();if(!rec||rec.reading||rec.readingBusy)return;
  if(MODE==="web"&&!(typeof ACCT!=="undefined"&&ACCT.user))return;
  rec.readingBusy=true;
  try{
    const cs=drawnCards();
    const out=await aiJSON("You are Aura, reading a three card tarot spread for her in The Daily Alchemist. Positions: 1 what she's carrying, 2 what's asking for her attention (the heart of the reading), 3 what will help.\n"+
      cs.map((x,i)=>(i+1)+". "+x.title+": "+x.meaning+" (theme: "+x.theme+"; held by "+G[x.g].name+")").join("\n")+"\n\n"+focusText()+"\nWHAT AURA REMEMBERS:\n"+ledgerText()+"\n\n"+
      "Read the three cards as ONE story about her life right now. Let what you know shape the reading, but subtly: never quote her private words, never name the person or the situation outright, and never sound like you are reading her diary. A friend who knows would understand; a stranger looking over her shoulder would not. Honor the hard rule: the cards never outrank what's actually happening in her life, and never explain her feelings away. 4 to 6 sentences, warm, grounded, no em dashes, no lists.\nReply with ONLY JSON: {\"reading\":\"...\",\"guardian\":\"the one guardian id best placed to help next\"}",null);
    if(out&&out.reading){rec.reading=clean(out.reading).slice(0,1200);rec.next=okG(out.guardian)||null;persist("draws");}
  }catch(e){}
  rec.readingBusy=false;
  const el=$("#spreadReading");if(el&&rec.reading)el.innerHTML=threeReadingInner();
}
function threeReadingInner(){
  const rec=drawRec()||{},cs=drawnCards(),g=rec.next||cs[1].g;
  return '<p class="voice">'+esc(rec.reading||localThreeReading(cs))+'</p><div class="row" style="margin-top:12px;flex-wrap:wrap;gap:8px"><button class="btn btn-main" data-cardask="1">Talk about it with Aura</button><button class="btn btn-ghost" data-talk="'+g+'">Go deeper with '+esc(G[g].name)+'</button></div>';
}
function threeSpreadHTML(){
  const cs=drawnCards(),mid=cs[1];
  let h='<div><div class="label">Your three card reading</div><div class="three">'+cs.map(x=>'<div class="tcol"><div class="tarot flipped mini"><div class="inner"><div class="face back">'+cardBack()+'</div><div class="face front">'+cardSVG(x.id,x.rev)+'</div></div></div><span class="pos">'+esc(SPREAD_POS[x.pos][0])+'</span></div>').join("")+'</div>';
  h+=cs.map(x=>'<details class="tread"'+(x.pos===1?' open':'')+'><summary><span class="label" style="color:'+G[x.g].color+'">'+esc(SPREAD_POS[x.pos][0])+'</span> '+esc(x.title)+'</summary><p style="margin-top:6px">'+esc(x.meaning)+'</p><p class="small muted">Held by '+esc(G[x.g].name)+'.</p></details>').join("");
  h+='<div class="card together"><div class="label">Together</div><div id="spreadReading">'+threeReadingInner()+'</div></div>';
  h+='<p class="cardnow"><span class="label">Right now</span> '+esc(cardNow(mid.id,mid.rev))+'</p><div class="cardq"><div class="label">Ask yourself</div><p class="voice" style="margin-top:4px">'+esc(mid.c.question)+'</p></div><p class="small muted" style="margin-top:10px">A new spread waits tomorrow.</p></div>';
  setTimeout(fetchThreeReading,50);
  return h;
}
/* ------------------------------------------------------------------
   WEATHER. Part of the natural rhythm (priority 7): it changes the
   light of the app and which rituals make sense, and it never outranks
   what's happening in her life. Looked up at most once an hour.
   Settings: approximate (from the connection, the default), precise
   (phone location, rounded to about a kilometer), or off.
------------------------------------------------------------------ */
function wxMode(){return S.profile.weather||"approx";}
function wxNow(){const w=S.wx;if(!w||!w.data||wxMode()==="off")return null;if(Date.now()-w.ts>3*36e5)return null;return w.data;}
let wxBusy=false;
async function wxRefresh(force){
  if(wxMode()==="off"||wxBusy)return;
  if(!force&&S.wx&&Date.now()-S.wx.ts<15*60e3&&S.wx.mode===wxMode())return;
  if(window.DA_WX_TEST){S.wx={ts:Date.now(),mode:wxMode(),data:window.DA_WX_TEST};wxApply();return;}
  if(MODE!=="web")return;
  wxBusy=true;
  try{
    let body={};
    if(wxMode()==="precise"&&navigator.geolocation){
      const pos=await new Promise(res=>navigator.geolocation.getCurrentPosition(p=>res(p),()=>res(null),{maximumAge:30*60e3,timeout:8000,enableHighAccuracy:false}));
      if(pos)body={lat:Math.round(pos.coords.latitude*100)/100,lon:Math.round(pos.coords.longitude*100)/100};
    }
    const r=await fetch(((window.DA_CONFIG&&window.DA_CONFIG.apiBase)||"")+"/api/weather",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
    const j=await r.json().catch(()=>({}));
    if(j&&j.kind){S.wx={ts:Date.now(),mode:wxMode(),data:j};wxLogDay(j.kind);saveLocal();wxApply();}
  }catch(e){}
  wxBusy=false;
}
/* A small record of the sky by day, so Aurora can notice the first sun after a gray stretch. */
function wxLogDay(kind){const k=dayKey(new Date());S.wxLog={...(S.wxLog||{}),[k]:kind};const keys=Object.keys(S.wxLog);if(keys.length>10)for(const x of keys.slice(0,keys.length-10))delete S.wxLog[x];}
function grayStreak(){let n=0;for(let i=1;i<=5;i++){const k=dayKey(new Date(Date.now()-i*864e5)),v=(S.wxLog||{})[k];if(v&&["rain","clouds","storm","snow","fog"].includes(v))n++;else break;}return n;}
function wxTemp(w){if(!w||w.tempF==null)return "";return w.units==="C"?Math.round((w.tempF-32)*5/9)+"°":w.tempF+"°";}
const WX_WORD={clear:"clear",clouds:"cloudy",rain:"rain",storm:"storms",snow:"snow",fog:"fog",wind:"wind",hot:"heat",cold:"cold"};
const WX_OPEN={clear:"Clear skies",clouds:"Gray skies",rain:"Rain",storm:"A storm",snow:"Snow",fog:"Fog",wind:"Wind",hot:"Heat",cold:"Cold"};
function wxApply(){
  const w=wxNow(),root=document.documentElement;
  if(!w){delete root.dataset.weather;delete root.dataset.daylight;delete root.dataset.sky;const l=$("#wxLayer");if(l)l.remove();if(typeof renderSky==="function"&&$("#sky"))renderSky();return;}
  root.dataset.weather=w.kind==="clear"?(w.isDay?"clear-day":"clear-night"):w.kind;
  root.dataset.daylight=w.isDay?"1":"0";
  root.dataset.light=w.solarPhase||(w.isDay?"day-bright":"night");
  const b=w.brightness==null?.8:w.brightness;
  root.dataset.sky=b>=.88?"bright":b>=.64?"soft":"dim";
  if(!$("#wxLayer")){const l=document.createElement("div");l.id="wxLayer";l.setAttribute("aria-hidden","true");document.body.insertBefore(l,document.body.firstChild);}
  if(typeof renderSky==="function"&&$("#sky"))renderSky();
  if(typeof renderToday==="function"&&$("#v-today")&&!lastRead&&!$("#rite")&&!document.activeElement?.matches?.("textarea,input")&&root.dataset.wxShown!==root.dataset.weather){root.dataset.wxShown=root.dataset.weather;renderToday();}
}
/* Rituals that send her outside, or that would be miserable in this weather. */
const OUTDOOR_RE=/\b(go outside|step outside|outside|outdoors|out the door|walk (around|outside)|the yard|the garden|somewhere green|under the sky|bare feet on (the )?(grass|ground|earth))\b/i;
function isOutdoor(r){return !!r&&(r.outdoor===true||(r.steps||[]).some(s=>OUTDOOR_RE.test((s.t||"")+" "+(s.d||""))));}
function wxPenalty(r){
  const w=wxNow();if(!w||!r)return 0;
  if(["rain","storm","snow"].includes(w.kind)&&isOutdoor(r))return 5;
  if((w.kind==="hot"||w.kind==="cold")&&isOutdoor(r))return 3;
  if(w.kind==="hot"&&r.bath&&/hot/i.test((r.steps||[]).map(s=>s.d).join(" ")))return 3;
  if(!w.isDay&&isOutdoor(r))return 1;
  return 0;
}
function wxOK(r){return wxPenalty(r)<3;}
function wxClause(){const w=wxNow();return w?WX_OPEN[w.kind]+(w.kind==="clear"&&!w.isDay?" tonight":" outside"):"";}
function wxAIText(){
  const w=wxNow();if(!w)return "";
  return "WEATHER WHERE SHE IS: "+w.label+(w.isDay?" in daylight":" after dark")+". It's part of the natural rhythm (priority 7): let it shape the mood and keep her indoors when it's nasty, but do not turn it into a forecast and never let it outrank her life.\n";
}
setTimeout(()=>wxRefresh(),1500);
setInterval(()=>wxRefresh(),10*60e3);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")wxRefresh();});
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
    '<details class="cyclog"'+(!open.length?' open':'')+'><summary>Add a goal</summary><div class="field"><label for="goalTitle">What are you trying to make happen?</label><input type="text" id="goalTitle" maxlength="120" placeholder="Finish the bathroom, launch the app, apply for three jobs"></div><div class="field"><label for="goalNext">What is the next move?</label><input type="text" id="goalNext" maxlength="140" placeholder="One action, not the whole plan"></div><button class="btn btn-main full" id="goalAdd">Let Sol hold this</button></details>'+
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
function addUpHTML(){
  const es=S.entries.filter(e=>e.ritualId||e.ritualTitle);
  const mins=es.reduce((a,e)=>a+((byId[e.ritualId]&&byId[e.ritualId].min)||e.min||5),0);
  const shown=new Set(es.map(e=>dayKey(new Date(e.ts))));for(const k of Object.keys(S.days||{}))if(Object.keys(S.days[k]).length)shown.add(k);
  const now=new Date(),tm=es.filter(e=>{const d=new Date(e.ts);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();}).length;
  const lmD=new Date(now.getFullYear(),now.getMonth()-1,1),lm=es.filter(e=>{const d=new Date(e.ts);return d.getMonth()===lmD.getMonth()&&d.getFullYear()===lmD.getFullYear();}).length;
  let dots="";for(let i=55;i>=0;i--){const d=new Date(now.getTime()-i*864e5);dots+='<i'+(shown.has(dayKey(d))?' class="on"':'')+' title="'+esc(d.toDateString())+'"></i>';}
  const ins=rhythmInsight();
  return '<div class="card addup"><div class="label">Adding up</div>'+auraSays("Small rituals, kept daily, become who you are.","Aura")+
    '<div class="addnums"><div><b>'+es.length+'</b><span>rituals</span></div><div><b>'+(mins>=120?Math.round(mins/60)+" hr":mins+" min")+'</b><span>given to yourself</span></div><div><b>'+shown.size+'</b><span>days you showed up</span></div></div>'+
    '<div class="dots" aria-label="The last eight weeks">'+dots+'</div><p class="small muted" style="margin-top:6px">The last eight weeks. Every lit day counts. Nothing resets.</p>'+
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
  for(const j of JOURNEYS){const dn=journeyDays(j.id).length;h+='<button class="card link" data-journey="'+j.id+'"><div class="row">'+glyph(j.g,34)+'<div style="flex:1;min-width:0"><h3>'+(isMember()?'':'🔒 ')+esc(j.name)+'</h3><p class="small muted" style="margin-top:2px">With '+esc(G[j.g].name)+' · 7 days'+(dn?' · '+dn+' done':'')+'</p></div></div><p style="margin-top:8px;color:var(--glow-dim);font-size:15.5px">'+esc(j.d)+'</p>'+(dn?'<div class="progress" style="margin-top:10px"><i style="width:'+(dn/7*100)+'%"></i></div>':'')+'</button>';}
  h+='</div>';
  $("#v-journeys").innerHTML=h;
}

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
    const three=threeMode(),got=threePicks(),mid=(sp.length-1)/2;
    h='<div><div class="label">The altar draw</div><h3 style="margin-top:6px">'+(three?(got.length?"Pick "+(3-got.length)+" more.":"Pick three cards."):"Pick a card.")+'</h3><p class="muted" style="margin-top:4px">'+(three?"Seven cards from the full 78 card deck. The first is what you're carrying, the second what's asking for your attention, the third what will help. Aura reads them together.":"Five cards from the full 78 card deck, one for you today. Trust your hand. Its question changes as your day moves.")+'</p><div class="spread'+(three?' seven':'')+'" id="spread">'+
      sp.map((g,i)=>'<button class="tarot sp'+(got.includes(i)?' picked flipped':'')+'" data-pickcard="'+i+'" style="--i:'+(i-mid)+'" aria-label="Card '+(i+1)+'"><div class="inner"><div class="face back">'+cardBack()+'</div><div class="face front">'+cardFace(g)+'</div></div></button>').join("")+'</div>'+
      (three?'':'<p class="small muted" style="margin-top:6px">In the Inner Circle you draw three cards, and Aura reads them together. <button class="linkish" data-paywall="Three card readings">See membership</button></p>')+'</div>';
  }else if(threeMode()&&threeDone()){
    h=threeSpreadHTML();
  }else{
    h='<div><div class="label">The altar draw</div><div class="altar" style="margin-top:10px"><button class="tarot flipped" id="tarot" aria-label="Flip the card"><div class="inner"><div class="face back">'+cardBack()+'</div><div class="face front">'+cardFace(draw.id)+'</div></div></button><div id="drawText">'+drawHTML(draw)+'<p class="small muted" style="margin-top:10px">A new spread waits tomorrow.</p></div></div></div>';
  }
  const met=metList(), full=S.showAll||met.length>=3;
  if(!full){
    h+='<button class="card link lead" data-guardian="aura">'+glyph("aura")+'<span><div class="label">Keeper of the Archive</div><h3 style="margin-top:2px">Aura</h3><p class="small muted" style="margin-top:4px">'+esc(G.aura.domain)+'</p></span></button>';
    if(met.length)h+='<div><div class="label">Your circle so far</div></div><div class="circle">'+met.map(k=>'<button class="g" data-guardian="'+k+'">'+glyph(k)+'<span class="n">'+esc(G[k].name)+'</span><span class="e job">'+esc(JOB[k].split(".")[0])+'</span></button>').join("")+Array.from({length:(3-met.length%3)%3},()=>'<button class="g ghost" data-showall="1" aria-label="Show everyone"><span class="gq">?</span><span class="n">Waiting</span></button>').join("")+'</div>';
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
   '<button class="btn btn-main full" data-talk="'+k+'">Talk to '+esc(g.name)+'</button>'+(k==="iris"?irisPanelHTML():trackerPanelHTML(k));
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

/* ------------------------------------------------------------------
   RITUAL MODE: one step at a time, on parchment
------------------------------------------------------------------ */
let run=null, tick=null;
const ROMAN=["","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
const ORN='<svg class="orn" viewBox="0 0 220 20" aria-hidden="true"><path d="M4 10h78M138 10h78" stroke="#9A7414" stroke-width="1"/><path d="M82 10c8 0 12-6 18-6M138 10c-8 0-12-6-18-6M82 10c8 0 12 6 18 6M138 10c-8 0-12 6-18 6" fill="none" stroke="#9A7414" stroke-width="1"/><path d="M110 2l2.6 5.4L118 10l-5.4 2.6L110 18l-2.6-5.4L102 10l5.4-2.6z" fill="#BF1E73"/><circle cx="4" cy="10" r="1.6" fill="#9A7414"/><circle cx="216" cy="10" r="1.6" fill="#9A7414"/></svg>';
function startRitual(r,ctx){
  closeSheet();
  run={r:adapt(r),i:-1,ctx:ctx||{},t0:Date.now()};MUSIC.started=true;track("ritual_start",{id:r.id,g:r.g,of:r.steps.length});musicFor(r.g);
  const el=document.createElement("div");el.className="rite";el.id="rite";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",r.title);
  el.style.setProperty("--gcol",G[r.g].color);document.body.appendChild(el);document.body.style.overflow="hidden";
  drawStep();
}
function endRitual(){stopEyes();stopVoice();try{stopAudio();speechSynthesis.cancel();}catch(e){}musicDuck(false);clearInterval(tick);const el=$("#rite");if(el)el.remove();document.body.style.overflow="";run=null;if(talkG)musicFor(talkG);else musicBack();}
function drawStep(){
  clearInterval(tick);
  const {r,i}=run, total=r.steps.length, el=$("#rite"), g=G[r.g];
  const bar='<div class="bar"><button class="navback ritualback" id="riteX" aria-label="Back">← <span>Back</span></button>'+guardianMark(r.g,32,true)+'<span class="t">· '+esc(r.title)+'</span><span class="sndbar"></span></div><div class="pips">'+Array.from({length:total+1},(_,k)=>'<i class="'+(k<i?"on":k===i?"on now":"")+'"></i>').join("")+'</div>';
  if(i===-1){
    const needs=ritualNeeds(r);
    el.innerHTML='<div class="wm">'+glyph(r.g,340)+'</div><div class="wrap">'+bar+
      '<div class="ritualintro">'+
      '<div class="count"><span class="seal">✦</span><span>Before you begin</span></div><h2>'+esc(r.title)+'</h2>'+ORN+
      '<p class="purpose">'+esc(r.purpose||"")+'</p>'+
      '<div class="gatherbox"><span class="sayl">Gather everything now</span><div class="needchips">'+(needs.length?needs.map(n=>'<span>'+esc(n)+'</span>').join(""):'<span>Nothing but you</span>')+'</div></div>'+
      '<p class="prepnote">You should not discover a new supply halfway through. If something is missing, go back and tell Aura before you start.</p>'+
      '</div></div><div class="foot"><button class="btn btn-ink" id="nextBtn">I have what I need</button></div>';
    el.scrollTop=0;return;
  }
  if(i<total){
    const s=r.steps[i];
    el.innerHTML='<div class="wm">'+glyph(r.g,340)+'</div><div class="wrap">'+bar+'<div class="count"><span class="seal">'+ROMAN[i+1]+'</span><span>of '+ROMAN[total]+'</span></div><h2>'+esc(s.t)+'</h2>'+ORN+(i===0&&r.purpose?'<p class="purpose">'+esc(r.purpose)+'</p>':"")+'<p class="text">'+esc(s.d)+'</p>'+
      (s.say?'<div class="say"><span class="sayl">Say it aloud</span>"'+esc(s.say)+'"</div>':"")+
      (!voiceEnabled()?'':'<div class="guide">'+(voiceOn?'<button class="btn btn-ghost sm" id="voiceBtn" aria-pressed="true">Pause</button><button class="btn btn-ghost sm" id="repeatBtn">Repeat</button><button class="btn btn-ghost sm" id="eyesBtn">Close my eyes</button>':'<button class="btn btn-ghost sm" id="voiceBtn" aria-pressed="false">Guide me aloud</button>')+'</div>')+
      (s.hold?'<div class="timer"><span class="clock" id="clock">'+mmss(s.hold)+'</span><button class="btn btn-ghost" id="holdBtn">Start timer</button></div>':"")+
      (i===total-1&&r.secret?'<p class="secret">'+esc(r.secret)+'</p>':"")+
      '</div><div class="foot">'+(i>0?'<button class="btn btn-ghost" id="prevBtn">Back</button>':"")+'<button class="btn btn-ink" id="nextBtn">'+(i===total-1?"Finish":"Next")+'</button></div>';
  }else{
    const prompts=r.prompts||["What came up?"];
    el.innerHTML='<div class="wm">'+glyph(r.g,340)+'</div><div class="wrap">'+bar+'<div class="count"><span class="seal done">✦</span><span>Ritual complete</span></div><h2>You did it. Write it down before it fades.</h2>'+ORN+'<p class="text">'+prompts.map(esc).join(" ")+'</p>'+
      '<label class="sr" for="refl">Your reflection</label><textarea id="refl" style="min-height:160px" placeholder="A few honest lines is plenty."></textarea>'+
      '<div class="field"><label for="outside" style="color:var(--ink-soft)">What changes outside the ritual?</label><input type="text" id="outside" placeholder="'+esc(OUTSIDE_HINT[r.g]||"One real thing you'll do")+'"><div class="chips" id="outWhen" style="margin-top:6px"><button class="chip" data-outwhen="1" aria-pressed="false">Check in tomorrow</button><button class="chip" data-outwhen="7" aria-pressed="true">In a week</button></div></div>'+
      '<label class="switch" for="privateOnly" style="color:var(--ink)">For my eyes only. Aura won\'t read this.<input type="checkbox" id="privateOnly"></label>'+
      '<div><div class="small" style="color:var(--ink-soft);margin-bottom:8px">Afterward I feel</div><div class="chips" id="afterChips">'+["Lighter","Clearer","Stirred up","Tender","Powerful","The same"].map(a=>'<button class="chip" data-after="'+a+'" aria-pressed="false">'+a+'</button>').join("")+'</div></div>'+
      '</div><div class="foot"><button class="btn btn-ghost" id="skipSave">Skip writing</button><button class="btn btn-ink" id="saveBtn">Save to archive</button></div>';
  }
  el.scrollTop=0; const w=el.querySelector(".wrap"); if(w)w.scrollTop=0;
  speakStep();
}
const OUTSIDE_HINT={thistle:"Mute the thread tonight",rue:"Block the number",sage:"Say it to their face, or let it go",marigold:"Send the invoice",sol:"Put the first step on your calendar today",juniper:"Clear the entry table",fern:"In bed by 10",lily:"Close the laptop at 7",onyx:"Tell one person the truth",willow:"Call the person who remembers them too",vesper:"Say one want out loud to your person",iris:"Log how today actually felt",rowan:"Walk around the block after dinner",lumen:"Book the first appointment",aurora:"Phone stays off until after coffee",wren:"Write down the next sign",onora:"Ask about the family story"};
function mmss(s){return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");}
function saveEntry(text,after,extra){
  const {r,ctx}=run; extra=extra||{};
  const e={kind:"entry",id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),ritualId:r.composed?null:r.id,ritualTitle:r.title,guardian:r.g,
    theme:ctx.theme||THEME[r.g],carrying:ctx.carrying||"",text:text||"",after:after||"",moon:M.name,resetDay:ctx.reset?r.reset:null,journey:ctx.journey||null,jday:ctx.jday||null,prompts:r.prompts||[],thread:ctx.thread||"",private:!!extra.private,outside:extra.outside||""};
  if(lastRead&&lastRead.noMem&&lastRead.ritual&&lastRead.ritual.id===r.id){e.private=true;}
  {const ak=S.asks.find(z=>!z.did&&z.ritualId===r.id&&Date.now()-z.ts<18*3600e3);if(ak){ak.did=e.id;if(!e.thread)e.thread=ak.thread;}}
  S.entries.unshift(e);saveLocal();remotePut("entry",e.id,e);track("ritual",{id:r.id,g:r.g,wrote:!!e.text});
  if(extra.outside)addPromise(extra.outside,extra.outWhen||7,e.id);
  if(ctx.space){const sp=S.spaces.find(z=>z.id===ctx.space);if(sp){sp.log.unshift({id:r.id,title:r.title,ts:e.ts});sp.log=sp.log.slice(0,10);persistAll();}}
  e._task=!extra.outside&&!e.private?taskGuess(text):"";
  if(ctx.plan){const pl=S.plans.find(z=>z.id===ctx.plan);if(pl&&pl.steps[ctx.pstep]){pl.steps[ctx.pstep].done=true;if(pl.steps.every(z=>z.done))pl.done=true;persistAll();}}
  endRitual();
  const rk=safetyKind(e.text);if(rk){renderAll();openSafety(rk);return;}
  toast(ctx.jday?"Day "+ctx.jday+" complete. Saved to your archive.":ctx.reset?"Day "+r.reset+" saved. Saved to your archive.":"Saved to your archive.");
  renderAll();
  afterLoop(e,r);
  if(!e.private)updateLedger("Ritual entry: "+JSON.stringify({date:fmtDate(e.ts),guardian:(G[e.guardian]||G.aura).name,ritual:e.ritualTitle,carrying:e.carrying,wrote:e.text,felt_after:e.after}));
}
function afterLoop(e,r){
  afterLoop0(e,r);
  if(e._task){const tb='<div class="ask dark"><span>You wrote: "'+esc(e._task)+'". Want me to hold you to it?</span><button class="chip" data-taskyes="'+esc(e.id)+'">Yes, check in tomorrow</button></div>';const st=$("#scrim .stack");if(st)st.insertAdjacentHTML("beforeend",tb);else openSheet('<div class="stack"><div class="label">Aura noticed</div>'+tb+'<button class="btn btn-ghost full" id="sheetDone">Close</button></div>');}
}
function afterLoop0(e,r){
  const a=e.after; const g=G[r.g];
  if(!a){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph(r.g)+'<p><span class="who2" style="color:'+g.color+'">'+esc(g.name)+'</span>That\'s '+esc(r.title)+', done. It\'s in your Archive now. I\'ll be here when you need me again.</p></div><button class="btn btn-main full" data-talkafter="'+r.g+':'+esc(e.id)+'">Talk to '+esc(g.name)+' about it</button><button class="btn btn-ghost full" id="sheetDone">Close</button></div>');return;}
  if(GOOD.includes(a)){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>Noted. '+esc(r.title)+' left you '+esc(a.toLowerCase())+'. I\'ll remember that it works for you.</p></div><button class="btn btn-main full" data-talkafter="'+r.g+':'+esc(e.id)+'">Talk to '+esc(g.name)+' about it</button><button class="btn btn-ghost full" id="sheetDone">Close</button></div>');return;}
  if(a==="The same"){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>That didn\'t move it. That\'s information, not failure. Do you want me to try a different approach?</p></div><button class="btn btn-main full" data-tryother="'+esc(e.id)+'">Try something different</button><button class="btn btn-ghost full" data-talkafter="'+r.g+':'+esc(e.id)+'">Talk to '+esc(g.name)+' about it</button><button class="btn btn-ghost full" id="sheetDone">Not tonight</button></div>');return;}
  if(a==="Stirred up"){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>Something moved. Let\'s settle your body before you go. Two minutes with Lily.</p></div><button class="btn btn-main full" data-begin="two-minute-settle">Settle for two minutes</button><button class="btn btn-ghost full" id="sheetDone">I\'m okay</button></div>');return;}
  if(a==="Tender"){openSheet('<div class="stack"><div class="handoff" style="padding:0">'+glyph("aura")+'<p><span class="who2">Aura</span>Tender means it reached something real. Be gentle with yourself tonight. Willow is here if you want to talk.</p></div><button class="btn btn-main full" data-talk="willow">Talk to Willow</button><button class="btn btn-ghost full" id="sheetDone">I just want to rest</button></div>');return;}
}

/* ------------------------------------------------------------------
   TALK: a real conversation with any guardian
------------------------------------------------------------------ */
const GREET={
  aura:"I\'m Aura, your guide. I see the whole circle from here. Tell me what's going on and I'll either sit with you or send you to the one who should.",
  onyx:"You came to me, so you already know it's something you've been avoiding. Say it plain.",
  sage:"Something's burning. Good. Tell me who or what lit it.",
  fern:"Slow down, love. You don't need the right words. Just let it drip out.",
  lily:"Inhale. Exhale. Now, what's the loudest thought in your head right now?",
  thistle:"Who's been walking all over your garden? Tell me. This doesn't make you mean.",
  marigold:"Hi gorgeous. What's got you dimming your own light today?",
  juniper:"Tell me about the space you're in. The room, the house, the life. What does it feel like in there?",
  rue:"Who do we need to deal with? Try me.",
  sol:"Okay. What did you say you'd do, and where are we with it? Real version, not the tidy one.",
  aurora:"It's early light here. What's just starting to become clear to you?",
  rowan:"Okay, up. Not literally yet. What's your body been telling you today?",
  iris:"Hi. I'm Iris. I keep track of your body's rhythm with you, only if you want me to. What's your body been telling you lately?",
  willow:"You can be soft here. What are you grieving?",
  vesper:"Come in. Take your time. What do you want more of?",
  wren:"Something caught your eye lately, didn't it? Tell me the sign.",
  lumen:"Tell me the future you want. Say it like it already happened.",
  onora:"Whose story are you carrying? Tell me about them.",
  poppy:"Oh good, you're here. What do you want to make, or what's been stuck?"
};
if(!S.chats)S.chats={};
let talkG=null, talkAbort=null;
function openTalk(k){
  if(!allowedG(k)){closeSheet();vesperGate();return;}
  track("chat_open",{g:k});setTimeout(saveUI,0);MUSIC.started=true;
  closeSheet();talkG=k;const g=G[k];musicFor(k);
  const el=document.createElement("div");el.className="talk";el.id="talk";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Talk to "+g.name);
  el.innerHTML='<div class="hd"><button class="navback" id="talkX" aria-label="Back">← <span>Back</span></button>'+glyph(k)+'<div class="who"><div class="n">'+esc(g.name)+'</div><div class="t" style="color:'+g.color+'">'+esc(g.title)+'</div></div><span class="sndbar"></span></div><div class="msgs" id="msgs"></div>'+
    '<div class="ft"><div class="composer"><label class="sr" for="chatIn">Message '+esc(g.name)+'</label><textarea id="chatIn" rows="1" placeholder="Talk to '+esc(g.name)+'"></textarea>'+micBtn("chatIn")+'</div><button class="send" id="chatSend" aria-label="Send">'+SEND+'</button></div>';
  document.body.appendChild(el);document.body.style.overflow="hidden";
  drawMsgs();
}
function closeTalk(){setTimeout(saveUI,0);if(talkG){const l=(S.chats[talkG]||[]);if(!S.led)S.led={};const since=l.slice(S.led[talkG]||0);const fresh=since.slice(-8);if(fresh.filter(m=>m.role==="me").length>=2){S.led[talkG]=l.length;saveLocal();updateLedger("Conversation with "+G[talkG].name+":\n"+fresh.map(m=>(m.role==="me"?"Her: ":G[talkG].name+": ")+m.text).join("\n"));}}if(talkAbort)talkAbort.abort();stopMic();const el=$("#talk");if(el)el.remove();document.body.style.overflow="";talkG=null;if(!run)musicBack();}
function msgHTML(m,k){
  if(m.role==="me")return '<div class="bub me">'+esc(m.text)+'</div>';
  const r=m.ritual&&byId[m.ritual];
  return '<div class="bub them" style="border-color:'+G[k].color+'55">'+(voiceEnabled()?'<button class="hear" data-hear="'+k+'" aria-label="Hear '+esc(G[k].name)+'">'+HEAR_ICON+'</button>':'')+esc(m.text)+(m.handoff&&G[m.handoff]?'<br><button class="btn btn-main" data-handoff="'+m.handoff+'">Go to '+esc(G[m.handoff].name)+'</button>':"")+(m.upsell?'<br><button class="btn btn-main" data-paywall="More time with the circle">Join '+esc(PLAN.name)+'</button>':"")+(r?'<br><button class="btn btn-main" data-begin="'+esc(r.id)+'" data-ctx="talk">Begin '+esc(r.title)+' · '+r.min+' min</button>':"")+'</div>';
}
function guardianDaily(k){
  const own=R.filter(r=>r.g===k&&!r.reset&&canUse(r)), pool=own.length?own:R.filter(r=>r.g===(KIN[k]||k)&&canUse(r));
  if(!pool.length)return byId.anchor;
  return pickForNow(pool,new Date(),k);
}
let PN={mode:null};
function personLine(){const pn=S.profile.person;if(!pn)return "";const ms=signOf(S.profile.bday),ps=signOf(pn.bday);
  return (pn.mode==="partner"?"Her partner":"Her crush")+(pn.name?" "+pn.name:"")+(ps?", a "+ps.name+" ("+ps.el+")":"")+(pn.bday?", birthday "+mdText(pn.bday):"")+". "+(ms&&ps?compat(ms,ps):"");}
function personCardHTML(k){
  const pn=S.profile.person,g=G[k];
  if(!pn)return '<div class="card heart" style="margin-top:10px"><div class="label" style="color:'+g.color+'">On your heart</div><p class="small" style="margin-top:6px">Tell '+esc(g.name)+' who this is about, your partner or your crush, and the rituals follow.</p><button class="btn btn-ghost" id="pnOpen" style="margin-top:8px">Choose</button></div>';
  const ms=signOf(S.profile.bday),ps=signOf(pn.bday);
  return '<div class="card heart" style="margin-top:10px"><div class="label" style="color:'+g.color+'">On your heart</div><p style="margin-top:6px"><b>'+(pn.mode==="partner"?"Your partner":"Your crush")+(pn.name?": "+esc(pn.name):"")+'</b>'+(ps?' · '+esc(ps.name):'')+'</p>'+(ms&&ps?'<p class="small muted" style="margin-top:4px">You: '+esc(ms.name)+'. '+esc(compat(ms,ps))+'</p>':'')+'<button class="linkish" id="pnOpen" style="margin-top:6px">Still right? Change it</button></div>';
}
function openPerson(){
  const pn=S.profile.person||{};PN={mode:pn.mode||null};const [m,d]=String(pn.bday||"").split("-").map(Number);
  openSheet('<div class="stack" id="pnSheet"><div><div class="label">On your heart</div><h2>Who is this about?</h2><p class="small muted" style="margin-top:6px">Pick one. You can change it whenever things change.</p></div>'+
   '<div class="chips"><button class="chip" data-pmode="partner" aria-pressed="'+(PN.mode==="partner")+'">My partner</button><button class="chip" data-pmode="crush" aria-pressed="'+(PN.mode==="crush")+'">My crush</button></div>'+
   '<div class="field"><label for="pnName">Their name or a nickname (optional)</label><input type="text" id="pnName" value="'+esc(pn.name||"")+'" placeholder="Jordan"></div>'+
   '<div class="field"><label for="pnM">Their birthday (optional)</label><div class="row" style="gap:8px"><select id="pnM" aria-label="Month"><option value="">Month</option>'+MONTHS.map((x,i)=>'<option value="'+(i+1)+'"'+(m===i+1?" selected":"")+'>'+x+'</option>').join("")+'</select><select id="pnD" aria-label="Day"><option value="">Day</option>'+Array.from({length:31},(_,i)=>'<option'+(d===i+1?" selected":"")+'>'+(i+1)+'</option>').join("")+'</select></div><p class="small muted" style="margin-top:6px">Just the month and day, for their sign. Never shared.</p></div>'+
   '<button class="btn btn-main full" id="pnSave">Save</button><button class="linkish" id="pnClear" style="text-align:center">Just me for now</button></div>');
}
function savePerson(){
  if(!PN.mode){toast("Pick partner or crush.");return;}
  const m=$("#pnM").value,d=$("#pnD").value;
  S.profile.person={mode:PN.mode,name:($("#pnName").value||"").trim().slice(0,40),bday:m&&d?String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0"):""};
  saveLocal();remotePut("prefs");closeSheet();if(talkG)drawMsgs();renderAll();toast(PN.mode==="partner"?"Got it. Rituals for the two of you.":"Got it. Rituals for the crush.");
}
function introHTML(k){
  const g=G[k], r=guardianDaily(k), line=(DECK[k]||g.phrases)[hash(dayKey(today)+k+"d")%(DECK[k]||g.phrases).length];
  return '<div class="intro"><div class="top2">'+glyph(k)+'<div><div class="label" style="color:'+g.color+'">Who is '+esc(g.name)+'</div><h3 style="margin-top:2px">'+esc(g.title)+'</h3></div></div>'+
   '<p class="kv"><b>Element:</b> '+esc(g.element)+'<br><b>Job:</b> '+esc(JOB[k]||g.domain)+'<br><b>Comes to you for:</b> '+esc(g.domain)+'<br><b>How '+esc(g.name)+' talks:</b> '+esc(g.voice)+'</p>'+
   '<p style="font-family:var(--f-display);font-style:italic;font-size:18px">"'+esc(line)+'"</p>'+
   (k==="marigold"||k==="vesper"?personCardHTML(k):'')+
   '<div class="label">'+esc(g.name)+'\'s ritual for today · '+esc(M.name)+'</div>'+ritualCard(r,{ctx:"talk",why:true})+'</div>';
}
function drawMsgs(){
  const k=talkG,list=S.chats[k]||[],box=$("#msgs");if(!box)return;
  const hi=(S.profile.name?S.profile.name+". ":"")+(GREET[k]||G[k].phrases[0]+" Tell me what's going on.");
  box.innerHTML=introHTML(k)+'<div class="bub them" style="border-color:'+G[k].color+'55">'+esc(hi)+'</div>'+list.map(m=>msgHTML(m,k)).join("");
  box.scrollTop=box.scrollHeight;
}
function talkPrompt(k){
  const g=G[k],p=S.profile;
  const recent=S.entries.filter(usable).slice(0,5).map(e=>"- "+fmtDate(e.ts)+": "+(e.ritualTitle||"")+" with "+(G[e.guardian]||G.aura).name+". Carrying: "+(e.carrying||"").slice(0,100)+". Wrote: "+(e.text||"").slice(0,140)).join("\n")||"(nothing yet)";
  const lib=R.filter(canUse).map(r=>r.id+" ("+G[r.g].name+", "+r.title+", "+r.min+" min, "+r.purpose+")").join("\n");
  return "You are "+g.name+", "+g.title+", one of the guardians of The Daily Alchemist from The Alchemist Archives. Stay fully in character.\n"+
  "Element: "+g.element+". Domain: "+g.domain+"\nVoice: "+g.voice+"\nSignature phrases (use sparingly): "+g.phrases.join(" / ")+"\n"+
  "The rest of the circle: "+circleKeys().filter(x=>x!==k).map(x=>G[x].name+" ("+G[x].domain+")").join("; ")+". Point her to one of them by name if they fit better.\n"+
  (GSPEC[k]?"YOUR LANE: you are called for "+GSPEC[k].sig+". You are the wrong guardian when: "+GSPEC[k].avoid+". When it's time, send her to: "+GSPEC[k].next+". From her history, pay most attention to: "+GSPEC[k].mem+".\n":"")+
  "Brand voice: warm, wise, grounded, a little bougie. Real talk, not love and light. Rooted in nature, the moon and the elements. Never use em dashes or en dashes. No emojis. No lists.\n"+
  "Talk like a text conversation: 1 to 4 sentences. At most one question at a time. Remember what she said earlier in this chat.\n"+
  "Today: "+today.toDateString()+", "+M.name+" ("+Math.round(M.ill*100)+"% lit), "+SEA.cur.name+" season.\n"+focusText()+
  (k==="iris"?"YOU ARE IRIS. Context, not dismissal. You never tell her she feels something because of her cycle; you can say a pattern may be turning the volume up while the real problem stays real. Never diagnose (no PMS, PMDD, PCOS, perimenopause or any condition), never predict ovulation or fertility, never give contraception advice, and never tell her to eat, drink or take herbs or supplements. Use only the cycle summary above, never guess her history. If something sounds medically worrying, gently suggest a clinician.\n":"")+
  "About her: name "+(p.name||"unknown")+"; usually has "+p.minutes+" minutes; has at home: "+ownedNames().join(", ")+".\n"+personalText()+"\nHer recent archive:\n"+recent+"\n"+
  "LEDGER (long-term memory of her life):\n"+ledgerText()+"\nWHAT HAS WORKED:\n"+workedText()+"\n"+"WHAT THE CIRCLE REMEMBERS ABOUT HER:\n"+memoryBrief(((S.chats[k]||[]).filter(m=>m.role==="me").slice(-1)[0]||{}).text||"").text+"\nUse this memory out loud when it helps, so she never has to explain herself twice: name patterns, quote her own past words with dates. Only use what is listed. Never invent memories.\n"+
  "YOUR OWN HISTORY WITH HER (speak from this continuity):\n"+(S.entries.filter(e=>usable(e)&&e.guardian===k).slice(0,6).map(e=>"- "+fmtDate(e.ts)+": "+e.ritualTitle+", carrying: "+(e.carrying||"").slice(0,90)+", wrote: "+(e.text||"").slice(0,120)+(e.after?", felt "+e.after:"")).join("\n")||"(this is new between you)")+"\n"+
  (k==="sol"?"YOU ARE HER ACCOUNTABILITY COACH. Ask about her open promises by name, hold her to them, break what she's avoiding into one next step with a day and time, celebrate every win out loud, and name avoidance patterns kindly but plainly. If she makes a new commitment, end with a final line exactly like: PROMISE: what she will do, by when\n":"")+
  (k==="onyx"?"YOU ARE THE SHADOW MIRROR. When she did something wrong, help her name it plainly with no excuses and no self punishment, see who it affected and how, and choose one way to make it right. Shame is not the goal, repair is. When she has owned it and is ready to forgive herself, hand her to Willow.\n":"")+
  "OPEN PROMISES SHE MADE: "+(openPromises().map(p=>p.text).join(" | ")||"none")+"\n"+
  (S.decide[k]&&Date.now()-S.decide[k]<864e5?"SHE IS WORKING THROUGH A DECISION. Guide her one question at a time through: what she wants, what she fears, what she feels she owes, what her values and past words say matters to her. Reflect back what you hear. Never make the decision for her.\n":"")+
  "If what she's describing now belongs to another guardian, say so in your voice and end with a final line exactly like: HANDOFF: rue\n"+
  "Rituals you can offer when one truly fits (not every message):\n"+lib+"\nTo offer one, end with a final line exactly like: RITUAL: ritual-id\n"+
  "If she mentions hurting herself, not wanting to live, wanting to hurt someone else, or someone hurting or threatening her, drop any edge and respond with plain, loving care: she matters, she is not alone, and she should reach a real person now (call or text 988 in the US; 911 if anyone is in immediate danger; for someone hurting her, the National Domestic Violence Hotline). Never shame her for the feeling. No ritual in that reply.\n\n";
}
const stripR=t=>t.replace(/\n?\s*(RITUAL|HANDOFF|PROMISE):[\s\S]*$/,"");
async function sendTalk(){
  const ta=$("#chatIn");if(!ta||!talkG)return;const text=(ta.value||"").trim();if(!text)return;
  stopMic();
  const k=talkG,list=S.chats[k]=S.chats[k]||[];
  track("chat_send",{g:k});list.push({role:"me",ts:Date.now(),text});ta.value="";ta.style.height="";
  drawMsgs();
  const box=$("#msgs"),b=document.createElement("div");b.className="bub them";b.style.borderColor=G[k].color+"55";b.innerHTML='<span class="thinking" style="padding:0;font-size:17px"><span class="orb"></span>&nbsp;</span>';box.appendChild(b);box.scrollTop=box.scrollHeight;
  $("#chatSend").disabled=true;
  let reply="",ritual=null,upsell=false;
  const skind=safetyKind(text);
  if(skind){reply=SAFE[skind].reply;setTimeout(()=>openSafety(skind),900);}
  else if(overLimit("talk")){
    reply="That's today's "+LIMITS[isMember()?"member":"free"].talk+" messages. I'm still here tomorrow."+(isMember()?"":" Or join "+PLAN.name+" and we can keep going.");upsell=!isMember();
  }else{
    const turns=list.slice(-16).map(m=>({role:m.role==="me"?"user":"assistant",content:m.text}));
    while(turns.length&&turns[0].role!=="user")turns.shift();
    turns[0]={role:"user",content:talkPrompt(k)+"She says: "+turns[0].content};
    try{
      talkAbort=new AbortController();
      reply=await aiChat(turns,talkAbort.signal,({text})=>{b.textContent=clean(stripR(text));box.scrollTop=box.scrollHeight;});
      if(reply)bump("talk");
    }catch(e){
      if(e&&e.code==="cancelled")return;
      if(e&&e.code==="vesper_locked"){closeTalk();vesperGate();return;}
      if(e&&e.code==="signin"){list.pop();if(talkG===k){drawMsgs();$("#chatSend").disabled=false;$("#chatIn").value=text;}closeTalk();openSignIn();return;}
      if(e&&e.code==="adult_confirmation_required"){list.pop();closeTalk();openBirthday("I need to confirm you\'re an adult before we can talk. I only ask once. When\'s your birthday?","talk:"+k);return;}
      if(e&&e.code==="limit"){reply="That's today's messages. I'm still here tomorrow."+(isMember()?"":" Or join "+PLAN.name+" and we can keep going.");upsell=!isMember();}
      else reply=MODE==="web"?"I couldn't reach my words just now, and I won't fake it. Give it a moment and send that again.":"";
    }
  }
  if(upsell){}
  else if(reply){
    const m=reply.match(/RITUAL:\s*([a-z0-9-]+)/i);if(m&&byId[m[1].toLowerCase()])ritual=m[1].toLowerCase();
    const hm=reply.match(/HANDOFF:\s*([a-z]+)/i);if(hm&&G[hm[1].toLowerCase()]&&allowedG(hm[1].toLowerCase())&&hm[1].toLowerCase()!==k)var handoff=hm[1].toLowerCase();
    const pm=reply.match(/PROMISE:\s*([^\n]+)/i);if(pm&&pm[1].trim().length>3){addPromise(pm[1].trim(),7,G[k].name);setTimeout(()=>toast(G[k].name+" will hold you to it."),400);}
    reply=clean(stripR(reply).trim());
  }else{
    const lr=localRead(text,S.profile.minutes),base=KIN[k]||k,mine=R.filter(r=>r.g===base);
    const rr=(lr.ritual.g===base)?lr.ritual:(mine[0]||lr.ritual);
    reply=G[k].phrases[hash(text)%G[k].phrases.length]+" I hear you. "+(k==="aura"&&lr.guardian!=="aura"?"This sounds like "+G[lr.guardian].name+"'s work. ":"")+"Try this with me tonight, then come back and tell me what came up.";
    ritual=rr.id;
  }
  if(ritual&&!canUse(byId[ritual]))ritual=null;
  list.push({role:"them",ts:Date.now(),text:reply,ritual,upsell,handoff:typeof handoff!=="undefined"?handoff:null});
  if(list.length>60)list.splice(0,list.length-60);
  saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});
  if(talkG===k){drawMsgs();$("#chatSend").disabled=false;}
}

/* Voice: tap the mic, speak, and it transcribes into the field */
let rec=null,recBtn=null;
function stopMic(){if(rec){try{rec.stop();}catch(e){}}}
/* A mic in every place you can type. Boxes built with their own mic keep it; every other
   text box gets one added automatically, wherever and whenever it appears. */
const NO_MIC=new Set(["siEmail","siPhone","siCode","delConfirm","email","code"]);
let micSeq=0;
function addMics(root){
  (root||document).querySelectorAll('textarea, input[type="text"], input[type="search"], input:not([type])').forEach(el=>{
    if(el.dataset.mic==="done"||NO_MIC.has(el.id)||el.closest(".composer,.micwrap")||el.type==="hidden")return;
    const im=(el.getAttribute("inputmode")||"").toLowerCase(),ac=(el.getAttribute("autocomplete")||"").toLowerCase();
    if(im==="email"||im==="numeric"||ac==="one-time-code"||ac==="email")return;
    if(!el.id)el.id="tx"+(++micSeq);
    el.dataset.mic="done";
    const w=document.createElement("span");w.className="micwrap"+(el.tagName==="TEXTAREA"?" ta":"");
    el.parentNode.insertBefore(w,el);w.appendChild(el);
    w.insertAdjacentHTML("beforeend",micBtn(el.id));
  });
}
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1)addMics(n);}).observe(document.documentElement,{childList:true,subtree:true});
setTimeout(()=>addMics(document),0);
function micBlocked(){toast("Voice typing turns on in the real app. For now, use the mic on your keyboard.");}
/* In the App Store and Google Play apps, voice typing uses the phone's own speech engine. */
/* Payments open in the phone's browser from the store apps, and the app checks membership again when you come back. */
function isNative(){const C=window.Capacitor;return !!(C&&C.isNativePlatform&&C.isNativePlatform());}
function openExternal(url){const B=isNative()&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Browser;if(B){B.open({url});}else location.href=url;}
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible"&&typeof accountsOn==="function"&&accountsOn()&&ACCT.user)refreshMe();});
function nativeSR(){const C=window.Capacitor;return C&&C.isNativePlatform&&C.isNativePlatform()&&C.Plugins&&C.Plugins.SpeechRecognition||null;}
let nRec=null;
async function toggleNativeMic(btn,SRn){
  const on=b=>{b.classList.toggle("on",!!on.v);b.setAttribute("aria-pressed",String(!!on.v));};
  if(nRec){try{await SRn.stop();}catch(e){}try{nRec.l1&&nRec.l1.remove();nRec.l2&&nRec.l2.remove();}catch(e){}on.v=false;on(nRec.btn);nRec=null;return;}
  const ta=document.getElementById(btn.dataset.mic);if(!ta)return;
  try{
    const av=await SRn.available();if(!av||!av.available){micBlocked();return;}
    const pm=await SRn.requestPermissions();if(pm&&pm.speechRecognition&&pm.speechRecognition!=="granted"){toast("Allow the microphone for The Daily Alchemist in your phone's settings, then try again.");return;}
    const base=ta.value.trim()?ta.value.trim()+" ":"";
    nRec={btn};
    nRec.l1=await SRn.addListener("partialResults",d=>{const t=d&&d.matches&&d.matches[0];if(t){ta.value=base+t;ta.dispatchEvent(new Event("input",{bubbles:true}));}});
    nRec.l2=await SRn.addListener("listeningState",d=>{if(d&&d.status==="stopped"&&nRec){try{nRec.l1.remove();nRec.l2.remove();}catch(e){}on.v=false;on(nRec.btn);nRec=null;}});
    on.v=true;on(btn);
    await SRn.start({language:navigator.language||"en-US",partialResults:true,popup:false,maxResults:1});
  }catch(e){nRec=null;on.v=false;on(btn);micBlocked();}
}
function toggleMic(btn){
  const SRn=nativeSR();if(SRn){toggleNativeMic(btn,SRn);return;}
  if(rec){stopMic();return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){micBlocked();return;}
  const ta=document.getElementById(btn.dataset.mic);if(!ta)return;
  const base=ta.value.trim()?ta.value.trim()+" ":"";
  rec=new SR();rec.lang=navigator.language||"en-US";rec.interimResults=true;rec.continuous=true;recBtn=btn;
  /* Rebuild the words from every result each time. Android Chrome repeats the whole sentence so far
     in each new result ("I", "I said", "I said I'm"), so a result that starts with what we already
     have replaces it instead of being added again. */
  rec.onresult=e=>{let out="";for(let i=0;i<e.results.length;i++){const t=String(e.results[i][0].transcript||"").trim();if(!t)continue;const lo=out.toLowerCase(),tl=t.toLowerCase();if(!out||tl.startsWith(lo))out=t;else if(lo.endsWith(tl))continue;else out=out+" "+t;}ta.value=base+out;ta.dispatchEvent(new Event("input",{bubbles:true}));};
  rec.onerror=e=>{if(["not-allowed","service-not-allowed","audio-capture"].includes(e.error))micBlocked();};
  rec.onend=()=>{rec=null;if(recBtn){recBtn.classList.remove("on");recBtn.setAttribute("aria-pressed","false");recBtn.setAttribute("aria-label","Speak instead of typing");}};
  try{rec.start();btn.classList.add("on");btn.setAttribute("aria-pressed","true");btn.setAttribute("aria-label","Stop listening");}catch(e){rec=null;micBlocked();}
}

/* ------------------------------------------------------------------
   SHEETS + SETTINGS
------------------------------------------------------------------ */
function openSheet(html){
  closeSheet();
  const s=document.createElement("div");s.className="scrim";s.id="scrim";
  s.innerHTML='<div class="sheet" role="dialog" aria-modal="true"><div class="sheetnav"><button class="navback" id="sheetX" aria-label="Back">← <span>Back</span></button></div><div class="grab"></div>'+html+'</div>';
  $("#layer").appendChild(s);
  s.addEventListener("click",ev=>{if(ev.target===s)closeSheet();});
  const x=s.querySelector("#sheetX");x.focus({preventScroll:true});
}
function closeSheet(){const s=$("#scrim");if(s){s.remove();if(s._music){s._music=false;musicBack();}}}
function accountHTML(){
  if(!accountsOn())return '<div class="card"><div class="label">Membership preview</div><p class="small muted" style="margin-top:6px">You are seeing the app as a '+(isMember()?"member":"free user")+'. Real accounts and checkout run on DailyAlchemist.com.</p><button class="btn btn-ghost full" style="margin-top:10px" data-preview-member="1">'+(isMember()?"Preview as free":"Preview as a member")+'</button><button class="btn btn-ghost full" style="margin-top:8px" data-previewfriend="1">See what friends see</button>'+(S.previewFriend?'<button class="btn btn-ghost full" style="margin-top:8px" id="endFriendPreview">Stop friends preview</button>':'')+'</div>';
  if(!ACCT.sb)return '';
  if(!ACCT.user)return '<div class="card"><div class="label">Account</div><p class="small muted" style="margin-top:6px">Sign in to keep your Archive, chats and membership on every device.</p><button class="btn btn-ghost full" style="margin-top:10px" id="siOpen">Sign in or create a free account</button></div>';
  return '<div class="card"><div class="label">Account</div><p style="margin-top:6px">'+esc(ACCT.email)+'</p><p class="small muted">'+(ACCT.member?esc(PLAN.name)+' member'+(ACCT.until?' · renews or ends '+new Date(ACCT.until).toLocaleDateString():''):'Free account')+'</p><div class="row" style="margin-top:10px">'+(ACCT.member?'<button class="btn btn-ghost" id="portalBtn">Manage membership</button>':'<button class="btn btn-main" data-paywall="Go deeper">Join '+esc(PLAN.name)+'</button>')+'<button class="btn btn-ghost" id="signOut">Sign out</button></div></div>';
}
function openAltar(first){
  const p=S.profile;
  const chipset=(id,list)=>'<div class="chips" id="'+id+'">'+list.map(hv=>'<button class="chip" data-have="'+hv[0]+'" aria-pressed="'+p.have.includes(hv[0])+'">'+esc(hv[1])+'</button>').join("")+'</div>';
  const custom='<div class="chips" id="pCustom" style="margin-top:8px">'+p.custom.map((c,i)=>'<span class="chip" aria-pressed="true">'+esc(c)+' <button class="x2 in" data-delcustom="'+i+'" aria-label="Remove '+esc(c)+'">×</button></span>').join("")+'</div><div class="addrow"><label class="sr" for="customIn">Add your own item</label><input type="text" id="customIn" placeholder="Add your own item"><button class="btn btn-ghost" id="customAdd">Add</button></div>';
  let h;
  if(first){
    const tabs=[["today","Today","Tell me what you're carrying. Tap the feelings that fit, type it, or tap the mic and say it. I'll find the right guardian."],
      ["circle","Circle","Pick a card each day, and meet the guardians as I introduce you."],
      ["journeys","Journeys","The 7-Day Energy Reset and guided journeys, at your own pace."],
      ["archive","Archive","Everything you write, the letters I send you, and what I remember. Private to you."],
      ["gear","Settings","The gold wheel at the top. Change anything here, any time."]];
    h='<div class="stack welcome"><div class="popseal">'+glyph("aura",72)+'</div><div style="text-align:center"><div class="label">Welcome to The Daily Alchemist</div><h2>I\'m Aura.</h2></div>'+
      auraSays("I\'m the lead guardian here. Tell me what you\'re carrying, and I\'ll send you to the one guardian in the circle who can hold it, with a small ritual made from things you already have. You never have to explain it twice. I remember.")+
      auraSays("If you ever can\'t think, tap <b>Can\'t think</b> and I\'ll just breathe with you. And if you\'re ever in danger, tell me. I\'ll help you reach a real person.")+
      '<div><div class="label">A few things about you</div><p class="small muted" style="margin-top:6px">Just three things. I\'ll learn the rest as we go, and you can change anything in Settings. For reflection and ritual, not medical or mental health care.</p></div>'+
      '<div class="field"><label for="pName">What should the circle call you?</label><input type="text" id="pName" value="'+esc(p.name)+'" placeholder="Your name" autocomplete="given-name"></div>'+
      (first?'<div class="card" id="memChoice"><div class="label">What I remember</div><p class="small" style="margin-top:6px">I can remember the people, goals, patterns and moments you share, so I can support you over time. You decide what I keep, and you can see it or make me forget it any time.</p><div class="chips" style="margin-top:8px"><button class="chip" data-mem="on" aria-pressed="'+memOn()+'">Remember what I share</button><button class="chip" data-mem="off" aria-pressed="'+!memOn()+'">Don\'t remember anything</button></div></div>':'')+
      (!needBirthday()?'':'<div class="field"><label for="age18">Your birthday</label><input type="date" id="age18" max="'+new Date().toISOString().slice(0,10)+'"><p class="small muted" style="margin-top:6px">The Daily Alchemist is for adults. I keep your month and day for your sign and your birthday, never the year.</p></div>');
  }else{
    h='<div class="stack"><div><div class="label">'+(first?"Before we begin":"Settings")+'</div><h2>'+(first?"Aura would like to know you.":"What Aura knows")+'</h2><p class="muted" style="margin-top:6px">So you never have to explain it twice.'+(first?' That\'s all Aura needs to start. She\'ll learn the rest as you go, and only ask once.':' Everything here shapes what Aura gives you.')+'</p>'+(first?'<p class="small muted" style="margin-top:8px">The Daily Alchemist is for reflection and ritual. It is not medical or mental health care. You must be 18 or older to use it.</p>':'')+'</div>'+
   '<div class="field"><label for="pName">What should the circle call you?</label><input type="text" id="pName" value="'+esc(p.name)+'" placeholder="Your name" autocomplete="given-name"></div>';
  }
  if(!first){
    h+=ACCT.user?'<div class="card accountquick"><div class="row between"><span><span class="label">Signed in</span><br><span class="small">'+esc(ACCT.email||"Your account")+'</span></span><button class="btn btn-ghost" id="signOutTop">Log out</button></div><p class="small muted" style="margin-top:8px">Log out only when you want to switch accounts. Otherwise, this device keeps you signed in.</p></div>':'';
    h+='<div class="field"><span class="lbl">Time you usually have</span><div class="chips" id="pMins">'+[5,10,20,40].map(m=>'<button class="chip" data-pm="'+m+'" aria-pressed="'+(p.minutes===m)+'">'+m+(m===40?"+":"")+' min</button>').join("")+'</div></div>'+
     '<details class="group" open><summary>What you have</summary><p class="small muted">Tap what you own. Aura builds rituals around it and rewrites steps for what you don\'t.</p><div class="lbl" style="margin-top:10px">Everyday things</div>'+chipset("pHave",HAVE)+'<div class="lbl" style="margin-top:14px">More advanced tools</div>'+chipset("pAdv",HAVE_ADV)+'<div class="lbl" style="margin-top:14px">Your own</div>'+custom+'</details>'+
     ''+sharingHTML()+shareHTML()+(ACCT.admin?'<a class="btn btn-main full" href="/admin" style="margin:6px 0">Open your dashboard</a>':'')+'<details class="group"><summary>Share feedback</summary><p class="small muted">Tell me what confused you, what you loved, or what\'s missing. It goes straight to the person who made this app.</p><button class="btn btn-ghost full" id="fbOpen">Share a thought</button></details><details class="group"><summary>Dates that matter</summary><p class="small muted">Birthdays, move-in days, anniversaries, losses, fresh starts. Aura will remember and mark them with you.</p>'+S.dates.map(d=>'<div class="li"><span>'+esc(d.name)+'<br><span class="small muted">'+new Date(2000,d.month-1,d.day).toLocaleDateString(undefined,{month:"long",day:"numeric"})+(d.year?", "+d.year:"")+'</span></span><button class="x2" data-deldate="'+d.id+'" aria-label="Remove">×</button></div>').join("")+'<div class="addrow"><label class="sr" for="dateName">What happened</label><input type="text" id="dateName" placeholder="Moved into the house"><label class="sr" for="dateWhen">Date</label><input type="date" id="dateWhen"><button class="btn btn-ghost" id="dateAdd">Add</button></div></details>'+
     '<details class="group"><summary>What things mean to you</summary><p class="small muted">Aura uses your meanings over the traditional ones. If your grandmother grew lavender, lavender is hers.</p>'+S.corr.map((c,i)=>'<div class="li"><span><b style="font-weight:500">'+esc(c.symbol)+'</b> · '+esc(c.meaning)+'</span><button class="x2" data-delcorr="'+i+'" aria-label="Remove">×</button></div>').join("")+'<div class="addrow"><label class="sr" for="corrSym">Symbol</label><input type="text" id="corrSym" placeholder="Lavender"><label class="sr" for="corrMean">What it means to you</label><input type="text" id="corrMean" placeholder="My grandmother\'s garden"><button class="btn btn-ghost" id="corrAdd">Add</button></div></details>'+
     '<details class="group"><summary>Your season</summary><p class="small muted">Beyond the moon and the Wheel of the Year. Name the chapter you\'re in, and Aura will hold it in mind.</p>'+(S.pseason?'<div class="li"><span>'+esc(S.pseason.name)+'<br><span class="small muted">Since '+fmtDate(S.pseason.start)+'</span></span><button class="x2" id="seasonEnd" aria-label="End this season">×</button></div>':'')+'<div class="addrow"><label class="sr" for="seasonName">Name your season</label><input type="text" id="seasonName" placeholder="Rebuilding season"><button class="btn btn-ghost" id="seasonSet">'+(S.pseason?"Change":"Name it")+'</button></div></details>'+
     '<details class="group"><summary>Weather</summary><p class="small muted">The sky in the app follows the weather where you are, and Aura won\'t send you outside in a storm. Nothing about your location is ever saved.</p><div class="chips" style="margin-top:8px">'+[["approx","Rough location"],["precise","Precise location"],["off","Off"]].map(o=>'<button class="chip" data-wxmode="'+o[0]+'" aria-pressed="'+(wxMode()===o[0])+'">'+o[1]+'</button>').join("")+'</div><p class="small muted" style="margin-top:6px">Rough location comes from your internet connection, no permission needed. Precise asks your phone, rounded to about a kilometer.</p></details>'+
     (voiceEnabled()?'<details class="group"><summary>Voices</summary><p class="small muted">Each guardian has their own voice for guided rituals and when you tap the speaker. If a voice isn\'t available, the words simply stay on screen.</p><div class="chips" style="margin-top:8px"><button class="chip" data-pvoice="natural" aria-pressed="'+(!voiceMuted())+'">Guardian voices</button><button class="chip" data-pvoice="off" aria-pressed="'+voiceMuted()+'">Off</button></div><p class="small muted" style="margin-top:6px">Off stays off until you change it here or tap the speaker.</p></details>':'')+'<details class="group"><summary>Music</summary><p class="small muted">Each guardian has their own music. Aura\'s plays on the main pages, and a guardian\'s plays when you\'re with them. It starts when you engage with Aura or the Circle. Off stays off until you change it here or tap the note.</p><div class="chips" style="margin-top:8px"><button class="chip" data-pmusic="on" aria-pressed="'+(S.prefMusic!=="off"&&S.prefMusicVol!=="quiet")+'">On</button><button class="chip" data-pmusic="quiet" aria-pressed="'+(S.prefMusic!=="off"&&S.prefMusicVol==="quiet")+'">Softer</button><button class="chip" data-pmusic="off" aria-pressed="'+(S.prefMusic==="off")+'">Off</button></div></details><details class="group"><summary>How Aura speaks</summary><div class="chips" id="pTone" style="margin-top:8px">'+[["grounded","Grounded and practical"],["balanced","Balanced"],["mystical","Full spell language"]].map(t=>'<button class="chip" data-tone="'+t[0]+'" aria-pressed="'+(p.tone===t[0])+'">'+t[1]+'</button>').join("")+'</div></details>'+
     '<details class="group"><summary>What Aura remembers</summary><p class="small muted">'+(memOn()?"Aura remembers what you share so you never explain it twice. See it, add to it, or make her forget anything.":"Memory is off. Aura isn\'t keeping anything.")+'</p><button class="btn btn-ghost full" id="memOpen" style="margin-top:8px">'+(memOn()?"See what Aura remembers":"Change memory")+'</button></details>'+
     (accountsOn()?'<details class="group"><summary>Messages from Aura</summary><p class="small muted">Only when it means something: a promise you asked her to check, something you asked her to bring back, a date that matters. Never "don\'t forget to journal."</p><button class="btn btn-ghost full" id="pushOn" style="margin-top:8px">'+(p.push?"Messages are on":"Let Aura reach me")+'</button></details>':'')+
     cartHTML();
  }
  h+='<button class="btn btn-main full" id="pSave">'+(first?"Begin":"Save")+'</button>'+(first?'<button class="btn btn-ghost full" id="pSkip">Skip for now</button>':accountHTML())+legalLine()+(first?'':'<p class="small muted" style="text-align:center;margin-top:14px">This app was built by <a href="https://myagentfirst.com" target="_blank" rel="noopener" style="color:var(--gold)">Agent First</a>. Want one for your business? Let\'s talk.</p>')+'</div>';
  openSheet(h);
}

/* ------------------------------------------------------------------
   EVENTS
------------------------------------------------------------------ */
let curTab="today";
function saveUI(){try{S.ui={tab:curTab,talk:talkG||null,read:lastRead&&!lastRead.care?lastRead:null,ts:Date.now()};saveLocal();}catch(e){}}
function restoreUI(){
  const u=S.ui;if(!u||Date.now()-u.ts>12*3600e3)return;
  if(u.read&&u.read.ritual){lastRead=u.read;if(lastRead.ritual&&lastRead.ritual.id&&byId[lastRead.ritual.id])lastRead.ritual=byId[lastRead.ritual.id];renderToday();}
  if(u.tab&&u.tab!=="today")tab(u.tab);
  if(u.talk&&G[u.talk]&&allowedG(u.talk))setTimeout(()=>{if(!$("#gate")&&!$("#talk"))openTalk(u.talk);},700);
}
function tab(name){
  track("tab",{tab:name});curTab=name;setTimeout(saveUI,0);
  document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===name)));
  ["today","journeys","circle","archive"].forEach(v=>{$("#v-"+v).hidden=(v!==name);});
  window.scrollTo({top:0});
}
document.addEventListener("click",ev=>{if(ev.target.closest&&ev.target.closest("#eyes")){stopEyes();}},true);
document.addEventListener("click",async ev=>{
  const t=ev.target.closest("button,input[type=checkbox]"); if(!t)return;
  const d=t.dataset;
  if(t.tagName==="INPUT"){irisClick(t,d);return;}
  if(focusClick(t,d))return;
  if(irisClick(t,d))return;
  if(trackerClick(t,d))return;
  if(d.mic){toggleMic(t);return;}
  if(t.id==="customAdd"){const v=($("#customIn").value||"").trim().slice(0,40);if(!v)return;if(!S.profile.custom.includes(v))S.profile.custom.push(v);persist("profile");$("#pCustom").insertAdjacentHTML("beforeend",'<span class="chip" aria-pressed="true">'+esc(v)+' <button class="x2 in" data-delcustom="'+(S.profile.custom.length-1)+'" aria-label="Remove">×</button></span>');$("#customIn").value="";toast("Aura knows you have "+v+".");return;}
  if(d.delcustom!==undefined){S.profile.custom.splice(+d.delcustom,1);persist("profile");t.closest(".chip").remove();return;}
  if(t.id==="dateAdd"){const nm=($("#dateName").value||"").trim(),dv=$("#dateWhen").value;if(!nm||!dv){toast("Add a name and a date.");return;}const [y,m,dd]=dv.split("-").map(Number);S.dates.push({id:uid(),name:nm,month:m,day:dd,year:y<new Date().getFullYear()?y:null});persistAll();closeSheet();openAltar(false);toast("Aura will remember "+nm+".");return;}
  if(d.deldate){S.dates=S.dates.filter(x=>x.id!==d.deldate);persistAll();closeSheet();openAltar(false);return;}
  if(t.id==="corrAdd"){const sy=($("#corrSym").value||"").trim(),mn=($("#corrMean").value||"").trim();if(!sy||!mn)return;S.corr.push({symbol:sy,meaning:mn});persistAll();closeSheet();openAltar(false);toast("Aura will use your meaning.");return;}
  if(d.delcorr!==undefined){S.corr.splice(+d.delcorr,1);persistAll();closeSheet();openAltar(false);return;}
  if(t.id==="seasonSet"){const nm=($("#seasonName").value||"").trim();if(!nm)return;S.pseason={name:nm,start:Date.now()};persistAll();renderSky();closeSheet();openAltar(false);toast("Your season is named.");return;}
  if(t.id==="seasonEnd"){S.pseason=null;persistAll();renderSky();closeSheet();openAltar(false);return;}
  if(d.contacton!==undefined){const c=S.profile.contact=S.profile.contact||{enabled:null,cadence:"weekly",scope:"aura"};c.enabled=d.contacton==="1";document.querySelectorAll("[data-contacton]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));saveLocal();return;}
  if(d.contactcad){const c=S.profile.contact=S.profile.contact||{enabled:null,cadence:"weekly",scope:"aura"};c.cadence=d.contactcad;document.querySelectorAll("[data-contactcad]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));saveLocal();return;}
  if(d.contactscope){const c=S.profile.contact=S.profile.contact||{enabled:null,cadence:"weekly",scope:"aura"};c.scope=d.contactscope;document.querySelectorAll("[data-contactscope]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));saveLocal();return;}
  if(t.id==="contactSave"){const c=S.profile.contact=S.profile.contact||{enabled:null,cadence:"weekly",scope:"aura"};if(c.enabled==null){toast("Choose whether you want us to reach out.");return;}persist("profile");if(c.enabled){const ok=await enablePush();toast(ok?"Saved. We'll follow your rhythm.":"Saved. You'll still see letters and check-ins when you open the app.");}else toast("Saved. We won't reach out while you're away.");return;}
  if(t.id==="pushOn"){await enablePush();return;}
  if(d.altar){openAltarItems(d.altar);return;}
  if(d.tend){const sp=S.spaces.find(z=>z.id===d.tend);const r=tendRitual(sp);startRitual(r,{space:sp.id,theme:"space",thread:"Home"});return;}
  if(d.delspace){S.spaces=S.spaces.filter(z=>z.id!==d.delspace);persistAll();renderArchive();return;}
  if(t.id==="addSpace"){openSheet('<div class="stack"><div class="label">Add a space</div><div class="addrow"><label class="sr" for="spaceName">Space name</label><input type="text" id="spaceName" placeholder="Office, porch, bedroom"><button class="btn btn-main" id="spaceSave">Add</button></div></div>');return;}
  if(t.id==="spaceSave"){const nm=($("#spaceName").value||"").trim();if(!nm)return;S.spaces.push({id:uid(),name:nm,log:[]});persistAll();closeSheet();renderArchive();return;}
  if(d.markdate){const dd=S.dates.find(z=>z.id===d.markdate);tab("today");$("#carry").value=dd.name+" is coming up. I want to mark it.";$("#askBtn").click();return;}
  if(d.makemine){const b=byId[d.makemine];saveMyRitual({...b,id:"mine-"+uid(),title:"My "+b.title});renderArchive();toast("It's yours now. Aura will reach for it first.");return;}
  if(d.yearbook){openYearbook(d.yearbook);return;}
  if(d.cal){const pr=S.promises.find(z=>z.id===d.cal);addToCalendar(pr.text,pr.due,"A promise you made to yourself in The Daily Alchemist.");return;}
  if(d.plancal){const [id,i]=d.plancal.split(":");const pl=S.plans.find(z=>z.id===id);const st=pl.steps[+i];const dt=new Date();dt.setDate(dt.getDate()+1);dt.setHours(19,0,0,0);addToCalendar((st.title||"Next step")+" · "+pl.title,dt.getTime(),st.note||"");return;}
  if(d.taskyes){const e=S.entries.find(z=>z.id===d.taskyes);addPromise(e._task||taskGuess(e.text),1,e.id);t.closest(".ask").remove();toast("I'll check in tomorrow.");return;}
  if(t.id==="eyesBtn"){startEyes();return;}
  if(t.id==="repeatBtn"){speakStep();return;}
  if(t.id==="cantThink"||t.id==="simpleGo"){openSimple();return;}
  if(t.id==="simpleDone"){closeSimple();toast("Good. That was enough.");return;}
  if(d.promise){const [id,act]=d.promise.split(":");const pr=S.promises.find(z=>z.id===id);if(pr){if(act==="done"){pr.status="done";pr.doneAt=Date.now();toast("That's the alchemy. Real life changed.");if(!S.entries.some(e=>e.id===pr.source&&e.private))updateLedger("She kept a promise to herself: "+pr.text);}else if(act==="later"){pr.due=Date.now()+3*864e5;delete pr.notified;toast("I'll ask again in three days.");}else{pr.status="let";toast("Let go. No guilt.");}persistAll();renderToday();if(!$("#v-archive").hidden)renderArchive();}return;}
  if(d.later){const [id,act]=d.later.split(":");const l=S.later.find(z=>z.id===id);if(l){l.done=true;persistAll();renderToday();if(act==="open"){if(l.kind==="entry")openEntry(l.ref);else{const k=l.g||"aura",list=S.chats[k]=S.chats[k]||[];guardianOpens(list,{text:"You asked me to bring this back: \""+l.label+"\" Where are you with it now?"});saveLocal();openTalk(k);}}}return;}
  if(d.laterread&&lastRead){openLaterSheet("reading",null,lastRead.carrying||lastRead.reading,lastRead.guardian);return;}
  if(d.laterentry){const e=S.entries.find(z=>z.id===d.laterentry);openLaterSheet("entry",e.id,e.ritualTitle+(e.text?": "+e.text.slice(0,120):""),e.guardian);return;}
  if(d.laterwhen&&window.__later){const L=window.__later;S.later.push({id:uid(),kind:L.kind,ref:L.ref,label:L.label,g:L.g,due:laterDue(d.laterwhen),done:false});persistAll();closeSheet();toast("Aura will bring it back "+t.textContent.toLowerCase()+".");return;}
  if(d.holdme&&lastRead&&lastRead.promise){addPromise(lastRead.promise,+d.holdme,"reading");const pv=lastRead.promise;lastRead.promise="";renderToday();toast("I'll check in about \""+pv.slice(0,40)+"\".");return;}
  if(d.outwhen){t.parentElement.querySelectorAll("[data-outwhen]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(d.circlepick&&lastRead){const k=d.circlepick,c=lastRead.circle.find(z=>z.guardian===k),list=S.chats[k]=S.chats[k]||[];list.push({role:"me",ts:Date.now(),text:lastRead.carrying||""},{role:"them",ts:Date.now(),text:c?c.view:G[k].phrases[0]});saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(d.decide&&lastRead){const k=d.decide,list=S.chats[k]=S.chats[k]||[];S.decide[k]=Date.now();list.push({role:"me",ts:Date.now(),text:lastRead.carrying||""},{role:"them",ts:Date.now(),text:"Let's slow it down. Forget what you should do for a second. If nobody would be disappointed either way, what do you want?"});saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(t.id==="planStart"&&lastRead&&lastRead.plan){const pl={id:uid(),title:lastRead.plan.title,ts:Date.now(),steps:lastRead.plan.steps.map(z=>({...z,done:false})),done:false,g:lastRead.guardian};S.plans=S.plans.filter(z=>z.done);S.plans.unshift(pl);persistAll();lastRead=null;renderToday();toast("Your path is on Today. One step at a time.");return;}
  if(d.planstep){const [id,i]=d.planstep.split(":");const pl=S.plans.find(z=>z.id===id);const st=pl.steps[+i];startRitual(byId[st.ritualId],{plan:id,pstep:+i,theme:THEME[byId[st.ritualId].g],thread:pl.title});return;}
  if(d.plandone){const [id,i]=d.plandone.split(":");const pl=S.plans.find(z=>z.id===id);pl.steps[+i].done=true;if(pl.steps.every(z=>z.done))pl.done=true;persistAll();renderToday();return;}
  if(d.planend){const pl=S.plans.find(z=>z.id===d.planend);if(pl)pl.done=true;persistAll();renderToday();return;}
  if(t.id==="saveMine"&&lastRead&&lastRead.ritual){const m=saveMyRitual(lastRead.ritual);lastRead.ritual=m;renderToday();toast("Saved to My rituals in your Archive.");return;}
  if(t.id==="writeOwn"){openWriteOwn();return;}
  if(d.ownmin){t.parentElement.querySelectorAll("[data-ownmin]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="ownSave"){const title=($("#ownTitle").value||"").trim(),lines=($("#ownSteps").value||"").split("\n").map(x=>x.trim()).filter(Boolean);if(!title||!lines.length){toast("Give it a name and at least one step.");return;}const say=($("#ownSay").value||"").trim();const mn=document.querySelector('#ownMin [aria-pressed="true"]');
    const steps=lines.slice(0,10).map((l,i)=>({t:"Step "+(i+1),d:l}));if(say)steps[steps.length-1].say=say;
    const origin=($("#ownOrigin").value||"").trim(),fam=$("#ownFamily").checked;
    saveMyRitual({id:"mine-"+uid(),g:fam?"onora":"aura",title,el:fam?"Ancestry":"All elements",moon:"Any",min:mn?+mn.dataset.ownmin:10,purpose:origin||(fam?"A family tradition.":"A ritual you wrote."),family:fam,origin,needs:[],steps,secret:"",prompts:["What came up?"],tags:[]});closeSheet();renderArchive();toast("Saved to My rituals.");return;}
  if(d.cart){const [tg,yn]=d.cart.split(":");if(yn==="1"){S.cart.push({tag:tg,ts:Date.now()});toast("Added to your Alchemy list.");}else{(S.cartNo=S.cartNo||[]).push(tg);}persistAll();refreshCards();return;}
  if(d.cartgot){S.cart=S.cart.filter(c=>c.tag!==d.cartgot);setOwned(d.cartgot,true);closeSheet();openAltar(false);toast("Aura knows you have it now.");return;}
  if(d.cartdel){S.cart=S.cart.filter(c=>c.tag!==d.cartdel);persistAll();closeSheet();openAltar(false);return;}
  if(d.thread!==undefined){q=q===d.thread?"":d.thread;renderArchive();return;}
  if(t.id==="archAskBtn"){const qq=($("#archAsk").value||"").trim();if(!qq)return;t.disabled=true;$("#archAnswer").innerHTML='<p class="small muted" style="margin-top:10px">Reading your Archive...</p>';const a=await askArchive(qq);t.disabled=false;$("#archAnswer").innerHTML='<p style="margin-top:12px;font-size:18px">'+esc(a.answer)+'</p>'+(a.cites.length?'<div class="entries" style="margin-top:8px">'+a.cites.map(id=>{const e=S.entries.find(z=>z.id===id);return e?'<button class="entry" data-entry="'+esc(id)+'">'+glyph(e.guardian)+'<span><div class="t">'+esc(e.ritualTitle)+'</div><div class="m">'+fmtDate(e.ts)+'</div>'+(e.text?'<div class="x">'+esc(e.text)+'</div>':'')+'</span></button>':"";}).join("")+'</div>':'');return;}
  if(d.handoff){const from=talkG,to=d.handoff;const last=(S.chats[from]||[]).filter(m=>m.role==="me").slice(-1)[0];closeTalk();const list=S.chats[to]=S.chats[to]||[];guardianOpens(list,{text:G[from].name+" sent you to me. "+(last?"You said: \""+last.text.slice(0,160)+"\" ":"")+G[to].phrases[0]});saveLocal();openTalk(to);return;}
  if(d.snd==="menu"){openSound();return;}
  if(d.sndset){const v=d.sndset;
    if(v==="music-on"){if(!musicOn())setMusic(true);else{MUSIC.started=true;if(MUSIC.cur&&MUSIC.cur._g===MUSIC.want)MUSIC.cur.play().then(()=>fadeTo(MUSIC.cur,musicVol(),500)).catch(()=>{});else musicPlay(MUSIC.want);renderSnd();}}
    if(v==="music-off")setMusic(false);
    if(v==="vol-soft"||v==="vol-full"){S.prefMusicVol=v==="vol-soft"?"quiet":"normal";syncSnd();if(MUSIC.cur)fadeTo(MUSIC.cur,musicVol(),400);renderSnd();}
    if(v==="voice-on")setVoice(true);if(v==="voice-off")setVoice(false);
    track("music",{set:v});return;}
  if(d.snd){if(d.snd==="music"){
      /* If it says on but nothing is playing yet (phones block sound until a tap), this tap starts it instead of turning it off. */
      if(musicOn()&&!musicAudible()){MUSIC.started=true;if(MUSIC.cur&&MUSIC.cur._g===MUSIC.want){MUSIC.cur.play().then(()=>fadeTo(MUSIC.cur,musicVol(),500)).catch(()=>{});}else musicPlay(MUSIC.want);renderSnd();toast("Music on.");}
      else{const on=!musicOn();setMusic(on);toast(on?"Music on.":"Music off. Tap the note to bring it back.");}}else{const on=voiceMuted();setVoice(on);toast(on?"Voices on.":"Voices off. Tap the speaker to hear them again.");}track("music",{set:d.snd+(d.snd==="music"?(musicOn()?"_on":"_off"):(voiceMuted()?"_off":"_on"))});return;}
  if(t.id==="voiceBtn"){voiceOn=!voiceOn;if(voiceOn){if(voiceMuted())setVoice(true);if(!naturalVoices()){voiceOn=false;toast("Guided voice needs you signed in on the live app. The steps are all here to read.");return;}startVoiceCommands();toast("Aura will guide you aloud. Say next, repeat or pause.");drawStep();}else{stopVoice();drawStep();}return;}
  if(d.own){const [tg,yn]=d.own.split(":");setOwned(tg,yn==="1");if(yn!=="1")noteMiss(tg);refreshCards();toast(yn==="1"?"Got it. Aura will remember.":"Got it. Aura rewrote it around what you have.");return;}
  if(d.donthave){const el=document.querySelector('[data-dh="'+d.donthave+'"]');if(el)el.hidden=!el.hidden;return;}
  if(d.keep){const [k,i]=d.keep.split(":"),it=(ledger()[k]||[])[+i];if(it){const ks=keptSet();ks.has(it)?ks.delete(it):ks.add(it);S.ledgerKeep=[...ks];saveLocal();remotePut("prefs");}const row=t.closest(".li");if(row&&it)row.outerHTML=ledgerItemHTML(k,+i,it);return;}
  if(d.correct){const [k,i]=d.correct.split(":"),it=(ledger()[k]||[])[+i],row=t.closest(".li");if(row&&it!=null){row.innerHTML='<label class="sr" for="corr_'+k+i+'">Correct this</label><input type="text" id="corr_'+k+i+'" value="'+esc(it)+'" style="flex:1"><button class="chip sm" data-corrsave="'+k+':'+i+'">Save</button>';const inp=row.querySelector("input");if(inp)inp.focus();}return;}
  if(d.corrsave){const [k,i]=d.corrsave.split(":"),L=ledger(),row=t.closest(".li"),v=((row&&row.querySelector("input"))||{}).value;if(L[k]&&v&&v.trim()){const old=L[k][+i];L[k][+i]=clean(v.trim()).slice(0,160);if(S.ledgerKeep&&S.ledgerKeep.includes(old))S.ledgerKeep=S.ledgerKeep.map(x=>x===old?L[k][+i]:x);saveLocal();remotePut("prefs");if(row)row.outerHTML=ledgerItemHTML(k,+i,L[k][+i]);toast("Corrected. Thank you.");}return;}
  if(d.forget){const [k,i]=d.forget.split(":");forgetLedger(k,+i);renderArchive();toast("Forgotten.");return;}
  if(t.id==="sheetDone"){closeSheet();return;}
  if(t.id==="restBtn"){lastRead=null;renderToday();toast("Rest well. Aura will be here.");return;}
  if(t.id==="saveLine"&&lastRead){const txt=($("#oneLine").value||"").trim();if(!txt){$("#oneLine").focus();return;}
    const e={kind:"entry",id:"e"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),ritualId:null,ritualTitle:"One sentence",guardian:lastRead.guardian,theme:lastRead.theme,carrying:lastRead.carrying||"",text:(lastRead.writePrompt?lastRead.writePrompt+" ":"")+txt,after:"",moon:M.name,prompts:[]};
    S.entries.unshift(e);saveLocal();remotePut("entry",e.id,e);updateLedger("One-sentence entry: "+e.text);lastRead=null;renderAll();toast("Saved. That counts.");return;}
  if(d.tryother){closeSheet();const e=S.entries.find(z=>z.id===d.tryother);tab("today");
    $("#readingSlot").innerHTML='<div class="reading"><div class="thinking"><span class="orb"></span>Aura is finding another way in...</div></div>';
    const txt=(e.carrying||e.ritualTitle)+" [After "+e.ritualTitle+" it felt the same. Do not repeat "+e.ritualTitle+" or "+(G[e.guardian]||G.aura).name+". Try a genuinely different approach.]";
    try{EXCLUDE=e.guardian;lastRead=await askAura(txt,S.profile.minutes);EXCLUDE=null;if(lastRead.guardian===e.guardian){EXCLUDE=e.guardian;lastRead=localRead(txt,S.profile.minutes);EXCLUDE=null;}lastRead.carrying=e.carrying||"";if(lastRead.ritual&&lastRead.ritual.id===e.ritualId){const alt=R.filter(z=>canUse(z)&&z.g!==e.guardian&&!z.reset);lastRead.ritual=alt[hash(e.id)%alt.length];lastRead.guardian=lastRead.ritual.g;}lastRead.intro=introFor(lastRead.guardian);markMet(lastRead.guardian);}catch(err){}
    renderToday();return;}
  if(t.id==="exportBtn"){exportArchive();return;}
  if(t.id==="clearBtn"){closeSheet();openSheet('<div class="stack"><div class="label">Clear my data</div><h2>Start fresh, keep your account.</h2><p>Your Archive, chats, Aura\'s memory, your cycle history and your settings will be permanently deleted. '+(MODE==="web"&&ACCT.user?'You stay signed in, and your account'+(ACCT.member?' and membership':'')+' stay exactly as they are.':'You can start again right away.')+'</p><p class="small muted">Want a copy first? Export your Archive before you clear it.</p><div class="field"><label for="clrConfirm">Type CLEAR to confirm</label><input type="text" id="clrConfirm" autocomplete="off"></div><button class="btn btn-main full danger" id="clrGo">Clear my data</button><button class="btn btn-ghost full" id="sheetDone">Keep my data</button></div>');return;}
  if(t.id==="clrGo"){if(($("#clrConfirm").value||"").trim().toUpperCase()!=="CLEAR"){$("#clrConfirm").focus();return;}t.disabled=true;t.textContent="Clearing...";const ok=await clearMyData();if(ok){closeSheet();toast("Your data is cleared. Your account is still here.");setTimeout(()=>location.reload(),1200);}else{t.disabled=false;t.textContent="Clear my data";}return;}
  if(t.id==="deleteBtn"){closeSheet();openSheet('<div class="stack"><div class="label">Delete everything</div><h2>This can\'t be undone.</h2><p>Your Archive, chats, Aura\'s memory, your settings'+(MODE==="web"&&ACCT.user?', your account'+(ACCT.member?', and your membership (it will be canceled)':''):'')+' will be permanently deleted.</p><div class="field"><label for="delConfirm">Type DELETE to confirm</label><input type="text" id="delConfirm" autocomplete="off"></div><button class="btn btn-main full danger" id="delGo">Delete everything</button><button class="btn btn-ghost full" id="sheetDone">Keep my data</button></div>');return;}
  if(t.id==="delGo"){if(($("#delConfirm").value||"").trim().toUpperCase()!=="DELETE"){$("#delConfirm").focus();return;}t.disabled=true;t.textContent="Deleting...";const ok=await deleteEverything();if(ok){closeSheet();S={profile:{name:"",minutes:10,have:[],known:[],tone:"balanced",onboarded:false},entries:[],draws:{},chats:{},usage:{}};lastRead=null;renderAll();toast("Everything is deleted.");}else{t.disabled=false;t.textContent="Delete everything";}return;}
  if(d.paywall!==undefined){closeTalk();openPaywall(d.paywall);return;}
  if(d.plan){payPlan=d.plan;t.parentElement.querySelectorAll("[data-plan]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));const pn=$("#planNote");if(pn)pn.textContent=payPlan==="yearly"?PLAN.yearNote:"Cancel anytime.";return;}
  if(d.previewMember){S.previewMember=!isMember();saveLocal();closeSheet();renderAll();toast(isMember()?"Previewing as a member.":"Previewing as free.");return;}
  if(d.legal){openSheet('<div class="stack legal">'+LEGAL[d.legal]+'</div>');return;}
  if(t.id==="siOpen"){openSignIn();return;}
  if(t.id==="siSwitch"){const f=$("#siForm");if(f)f.outerHTML=signInForm(t.dataset.gate==="1",f.dataset.by==="phone");return;}
  if(t.id==="siSend"&&$("#siPhone")){const ph=normPhone($("#siPhone").value);if(!ph){$("#siMsg").textContent="Check that number. Include the area code.";return;}t.disabled=true;const {error}=await ACCT.sb.auth.signInWithOtp({phone:ph,options:{shouldCreateUser:true}});t.disabled=false;if(error){$("#siMsg").textContent="Couldn't text the code. Check the number, or use email instead.";return;}ACCT.pendingPhone=ph;ACCT.pendingEmail=null;$("#siCodeRow").hidden=false;$("#siVerify").hidden=false;t.hidden=true;$("#siMsg").textContent="Code texted to "+ph+". It can take a minute.";$("#siCode").focus();return;}
  if(t.id==="siSend"){const em=($("#siEmail").value||"").trim();if(!/^\S+@\S+\.\S+$/.test(em)){$("#siMsg").textContent="Check that email address.";return;}t.disabled=true;t.textContent="Sending...";const redirect=location.origin+(S.friendCode?"/?friend="+encodeURIComponent(S.friendCode):"/");let out=null;try{out=await ACCT.sb.auth.signInWithOtp({email:em,options:{shouldCreateUser:true,emailRedirectTo:redirect}});}catch(e){out={error:e};}t.disabled=false;t.textContent="Email me a sign-in link";if(!out||out.error){const msg=out&&out.error&&out.error.message?String(out.error.message):"";if(/rate|limit|too many/i.test(msg))$("#siMsg").textContent="Too many sign-in emails were requested for this address. Try again in a few minutes.";else if(msg)$("#siMsg").textContent="Supabase could not send the email: "+msg;else $("#siMsg").textContent="I couldn't send the sign-in email. Please try again.";return;}ACCT.pendingEmail=em;t.hidden=true;$("#siEmailRow").hidden=true;$("#siMsg").innerHTML="Email sent to <b>"+esc(em)+"</b>.<br><br>Open that email and tap <b>Confirm email address</b> or the sign-in button. It will bring you straight back here and sign you in.<br><br><button class=\"linkish\" id=\"siAgain\">Use a different email</button>";return;}
  if(t.id==="siAgain"){const f=$("#siForm");if(f)f.outerHTML=signInForm(!!$("#gate"));return;}
  if(t.id==="checkoutBtn"){track("checkout",{plan:payPlan});if(!ACCT.user){openSignIn();return;}t.disabled=true;t.textContent="Opening checkout...";const r=await api("/api/checkout",{plan:payPlan});if(r.url){openExternal(r.url);}else{t.disabled=false;t.textContent="Join "+PLAN.name;toast("Checkout isn't available right now. Try again soon.");}return;}
  if(t.id==="portalBtn"){t.disabled=true;const r=await api("/api/portal",{});if(r.url)openExternal(r.url);else{t.disabled=false;toast("Couldn't open billing. Try again soon.");}return;}
  if(t.id==="signOut"||t.id==="signOutTop"){if(ACCT.sb)await ACCT.sb.auth.signOut();try{localStorage.removeItem(KEY);}catch(e){}location.reload();return;}
  if(d.talk){openTalk(d.talk);return;}
  if(d.gocircle){const b=document.querySelector('[data-tab="circle"]');if(b)b.click();window.scrollTo(0,0);return;}
  if(d.sleep||d.energy||d.moved!=null&&t.closest(".rhythm")||d.wind){
    const rec=d.wind?dayRec(nightKey()):dayRec();
    if(d.sleep)rec.sleep=+d.sleep;if(d.energy)rec.energy=+d.energy;if(d.moved!=null&&!d.sleep&&!d.energy&&!d.wind)rec.moved=+d.moved;if(d.wind)rec.wind=true;
    saveLocal();remotePut("prefs");renderToday();return;}
  if(t.id==="talkX"){closeTalk();return;}
  if(t.id==="chatSend"){sendTalk();return;}
  if(d.tab){tab(d.tab);return;}
  if(d.tabGo){closeSheet();tab(d.tabGo);return;}
  if(t.id==="altarBtn"){track("settings_open");openAltar(false);return;}
  if(t.id==="sheetX"){closeSheet();return;}
  if(d.talkafter){const [k,eid]=d.talkafter.split(":");const e=S.entries.find(x=>x.id===eid);const l=S.chats[k]=S.chats[k]||[];
    for(const m of l)if(m.role==="them"&&/ just finished .* with me\./.test(m.text||""))m.auto=true;
    guardianOpens(l,{text:(firstName()?firstName()+", you":"You")+" just finished "+(e?e.ritualTitle:"a ritual")+" with me."+(e&&e.text?' You wrote: "'+e.text.slice(0,120)+'".':"")+" What came up for you?"});
    saveLocal();remotePut("chat",k,{kind:"chat",msgs:l});openTalk(k);return;}
  if(t.id==="popClose"){closeSheet();return;}
  if(d.hear){const holder=t.closest(".bub,.voice");if(t.classList.contains("on")){stopAudio();return;}const txt=holder?[...holder.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(" ").trim():"";if(txt){stopAudio();t.classList.add("on");speak(txt,()=>t.classList.remove("on"),d.hear,false);track("hear",{g:d.hear});}return;}
  if(d.pmusic){S.prefMusic=d.pmusic==="off"?"off":"on";S.prefMusicVol=d.pmusic==="quiet"?"quiet":"normal";saveLocal();t.parentElement.querySelectorAll("[data-pmusic]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));track("music",{set:d.pmusic});syncSnd();if(d.pmusic==="off")musicStop();else{MUSIC.started=true;musicPlay(MUSIC.want);if(MUSIC.cur)fadeTo(MUSIC.cur,musicVol(),500);}renderSnd();return;}
  if(d.pvoice){if(d.pvoice==="off")setVoice(false);else{S.prefVoice=d.pvoice;setVoice(true);}t.parentElement.querySelectorAll("[data-pvoice]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="toConsent"){openConsent();return;}
  if(t.id==="consentSave"){const sc=checkedScope();setConsent(sc.length>0,sc);return;}
  if(t.id==="scopeSave"){const sc=checkedScope();await setConsent(sc.length>0,sc);return;}
  if(t.id==="pushOffer"){closeSheet();await enablePush();return;}
  if(t.id==="endFriendPreview"){S.previewFriend=false;S.previewMonitor=0;S.previewMonitorAnswer=null;saveLocal();closeSheet();renderAll();toast("Back to your own view.");return;}
  if(d.consent!=null){setConsent(d.consent==="1");return;}
  if(d.previewfriend){S.previewFriend=true;S.seenPop=S.seenPop||{};delete S.seenPop["friend-welcome"];delete S.seenPop.consent;S.previewMonitorAnswer=null;saveLocal();closeSheet();renderAll();auraPopup();return;}
  if(t.id==="fbOpen"||d.fb){openFeedback(d.fb||"settings");return;}
  if(d.fbmood){t.parentElement.querySelectorAll("[data-fbmood]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="fbSend"){sendFeedback(t.dataset.where);return;}
  if(t.id==="showAll"||d.showall){S.showAll=true;saveLocal();renderCircle();return;}
  if(t.id==="howOpen"||d.how){openHow();return;}
  if(t.id==="letterOpen"){openLetterFlow(t);return;}
  if(t.id==="trialSeen"){S.trialSeen=true;saveLocal();renderToday();return;}
  if(d.letter){openLetter(d.letter);return;}
  if(d.nudge){const [id,act]=d.nudge.split(":");nudgeAction(id,act);return;}
  if(d.q){const k=d.q;feelSel=feelSel.includes(k)?feelSel.filter(x=>x!==k):[...feelSel,k];t.setAttribute("aria-pressed",String(feelSel.includes(k)));return;}
  if(d.min){pickedMins=+d.min;t.parentElement.querySelectorAll("[data-min]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="askBtn"){
    const typed=$("#carry").value.trim(), text=[feelText(),typed].filter(Boolean).join(" ");
    if(!text){$("#carry").focus();$("#carry").placeholder="One word is enough.";return;}
    const mins=pickedMins||S.profile.minutes;
    t.disabled=true;
    $("#readingSlot").innerHTML='<div class="reading"><div class="thinking"><span class="orb"></span>Aura is reading the Archive...</div></div>';
    $("#readingSlot").scrollIntoView({behavior:"smooth",block:"start"});
    try{lastRead=await askAura(text,mins);const sk=safetyKind(text);if(sk){lastRead.care=true;setTimeout(()=>openSafety(sk),600);}track("reading",{feelings:feelSel.length,typed:!!typed});lastRead.carrying=text;lastRead.askId=logAsk(text,lastRead).id;lastRead.intro=introFor(lastRead.guardian);markMet(lastRead.guardian);saveUI();}catch(e){t.disabled=false;
      if(e&&e.code==="needs_birthday"){$("#readingSlot").innerHTML="";openBirthday("I need to confirm you\'re an adult before I can use this part of the app. I only ask once. When\'s your birthday?","ask");return;}
      if(e&&e.code==="ai_down"){$("#readingSlot").innerHTML='<div class="reading"><div class="handoff">'+glyph("aura")+'<p><span class="who2">Aura</span>I couldn\'t reach my full reading just now, and I won\'t guess. Give it a moment and tap Tell Aura again. Your words are still here.</p></div></div>';return;}
      return;}
    renderToday();$("#carry").value=typed;
    const slot=$("#readingSlot");if(slot)slot.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }
  if(d.talkread&&lastRead){const k=d.talkread,list=S.chats[k]=S.chats[k]||[];list.push({role:"me",ts:Date.now(),text:lastRead.carrying||""},{role:"them",ts:Date.now(),text:lastRead.reading,ritual:canUse(lastRead.ritual)&&!lastRead.ritual.composed?lastRead.ritual.id:null});saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(d.fromhere&&lastRead){const e=S.entries.find(x=>x.id===d.fromhere),k=lastRead.guardian,list=S.chats[k]=S.chats[k]||[];
    list.push({role:"me",ts:Date.now(),text:(lastRead.carrying||"")+" (Working from "+fmtDate(e.ts)+", after "+e.ritualTitle+", when I wrote: \""+(e.text||"").slice(0,400)+"\")"});
    guardianOpens(list,{text:"Then let's start there. On "+fmtDate(e.ts)+" you wrote \""+quoteOf(e)+"\" What feels the same tonight, and what's different?"});
    saveLocal();remotePut("chat",k,{kind:"chat",msgs:list});openTalk(k);return;}
  if(t.id==="freshBtn"){const rc=$("#recall");if(rc)rc.remove();if(lastRead)lastRead.memory=null;return;}
  if(t.id==="againBtn"){lastRead=null;setTimeout(saveUI,0);feelSel=[];renderToday();$("#carry").focus();return;}
  if(d.begin){
    const r=(lastRead&&lastRead.ritual&&lastRead.ritual.id===d.begin)?lastRead.ritual:byId[d.begin];
    if(!r)return;
    if(!canUse(r)){closeTalk();if(r.adult21&&!vesperOK())vesperGate();else openPaywall(G[r.g].name+"'s chamber");return;}
    const ctx=(d.ctx==="read"&&lastRead)?{theme:lastRead.theme,carrying:lastRead.carrying,thread:lastRead.thread||""}:{};
    if(d.ctx==="talk"){const lm=(S.chats[talkG]||[]).filter(m=>m.role==="me").pop();ctx.carrying=lm?lm.text:"";closeTalk();}
    startRitual(r,ctx);return;
  }
  if(d.reset){const rn=resetNext();startRitual(rn&&rn.base.id===d.reset?rn.r:byId[d.reset],{theme:"reset",reset:true});return;}
  if(d.jday){const [jid,n]=d.jday.split(":");const j=JOURNEYS.find(x=>x.id===jid);startRitual(journeyStep(j,+n).r,{journey:jid,jday:+n,theme:THEME[j.g]});return;}
  if(t.id==="tarot"){t.classList.toggle("flipped");return;}
  if(d.pickcard!=null&&drawPick()==null&&threeMode()){
    const i=+d.pickcard,k=dayKey(today),rec=S.draws[k]&&Array.isArray(S.draws[k].picks)?S.draws[k]:{picks:[]};if(rec.picks.includes(i))return;
    rec.picks.push(i);S.draws[k]=rec;persist("draws");track("draw_pick",{n:rec.picks.length});t.classList.add("picked","flipped");
    const hd=document.querySelector("#v-circle h3");if(hd&&rec.picks.length<3)hd.textContent="Pick "+(3-rec.picks.length)+" more.";
    if(rec.picks.length>=3)setTimeout(renderCircle,1300);return;}
  if(d.pickcard!=null&&drawPick()==null){
    const i=+d.pickcard;S.draws[dayKey(today)]={pick:i};persist("draws");track("draw_pick",{g:drawSpread()[i]});
    const sp=$("#spread");if(sp)sp.classList.add("chosen");t.classList.add("picked","flipped");
    setTimeout(renderCircle,1100);return;}
  if(d.cardask&&threeMode()&&threeDone()){const cs=drawnCards();openTalk("aura");setTimeout(()=>{const ta=$("#chatIn");if(ta){ta.value="My three cards today: "+cs.map(x=>SPREAD_POS[x.pos][1]+", "+x.title).join("; ")+". Help me understand what they mean for me right now.";sendTalk();}},350);return;}
  if(d.cardask){const dr=todayDraw();openTalk("aura");setTimeout(()=>{const ta=$("#chatIn");if(ta){ta.value="I drew "+dr.title+" today. It speaks of "+(dr.rev?dr.card.revTheme:dr.card.theme)+". What does it mean for me right now?";sendTalk();}},350);return;}
  if(d.guardian){if(t.closest("#rite"))endRitual();else if(t.closest("#talk"))closeTalk();openGuardian(d.guardian);return;}
  if(d.chamber){openChamber(d.chamber);return;}
  if(d.journey){openJourney(d.journey);return;}
  if(d.entry){openEntry(d.entry);return;}
  /* ritual mode */
  if(t.id==="riteX"){if(run)track("ritual_exit",{id:run.r.id,step:run.i+1,of:run.r.steps.length});endRitual();return;}
  if(t.id==="nextBtn"){run.i++;track("ritual_step",{id:run.r.id,step:run.i+1,of:run.r.steps.length});drawStep();return;}
  if(t.id==="prevBtn"){run.i=Math.max(-1,run.i-1);drawStep();return;}
  if(t.id==="holdBtn"){
    const s=run.r.steps[run.i];let left=s.hold;t.disabled=true;t.textContent="Holding";
    let wl=null;try{if(navigator.wakeLock)wl=await navigator.wakeLock.request("screen");}catch(e){}
    tick=setInterval(()=>{left--;const c=$("#clock");if(c)c.textContent=mmss(Math.max(0,left));if(left<=0){clearInterval(tick);t.textContent="Complete";try{wl&&wl.release();}catch(e){}}},1000);
    return;
  }
  if(d.after){t.parentElement.querySelectorAll("[data-after]").forEach(b=>b.setAttribute("aria-pressed",String(b===t&&b.getAttribute("aria-pressed")!=="true")));return;}
  if(t.id==="saveBtn"||t.id==="skipSave"){
    const txt=t.id==="saveBtn"?($("#refl").value||"").trim():"";
    const a=document.querySelector('#afterChips [aria-pressed="true"]');
    const ow=document.querySelector('#outWhen [aria-pressed="true"]');
    saveEntry(txt,a?a.dataset.after:"",{private:t.id==="saveBtn"&&$("#privateOnly")&&$("#privateOnly").checked,outside:t.id==="saveBtn"&&$("#outside")?($("#outside").value||"").trim():"",outWhen:ow?+ow.dataset.outwhen:7});return;
  }
  /* altar settings */
  if(d.pm){t.parentElement.querySelectorAll("[data-pm]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(d.have){t.setAttribute("aria-pressed",String(t.getAttribute("aria-pressed")!=="true"));return;}
  if(d.tone){t.parentElement.querySelectorAll("[data-tone]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));return;}
  if(t.id==="adultOk"){confirmAdultNow();return;}
  if(t.id==="bdayGo"){submitBirthday();return;}
  if(t.id==="introNext"){if(introAt<INTRO.length-1){introAt++;showIntro();}else introDone();return;}
  if(t.id==="introSkip"){introDone();return;}
  if(d.pmode){PN.mode=d.pmode;document.querySelectorAll("[data-pmode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.pmode===d.pmode));return;}
  if(t.id==="pnOpen"||t.closest&&t.closest("#pnOpen")){openPerson();return;}
  if(t.id==="pnSave"){savePerson();return;}
  if(t.id==="pnClear"){S.profile.person=null;saveLocal();remotePut("prefs");closeSheet();if(talkG)drawMsgs();renderAll();toast("Just you for now.");return;}
  if(t.id==="memOpen"){openMemory();return;}
  if(t.id==="openSettings2"){closeSheet();openAltar(false);return;}
  if(d.mem){const on=d.mem==="on";setMemory(on);t.parentElement.querySelectorAll("[data-mem]").forEach(b=>b.setAttribute("aria-pressed",String(b===t)));if($("#memIn")||!on||t.closest(".sheet .stack")&&!t.closest("#altarBody")){if(!$("#pName")){closeSheet();openMemory();}}toast(on?"I'll remember what you share. You can change this any time.":"Memory is off. I won't keep anything new.");renderToday();return;}
  if(t.id==="memAdd"){const v=($("#memIn").value||"").trim().slice(0,200);if(!v)return;S.memNotes.unshift({id:uid(),text:v,ts:Date.now()});persistAll();closeSheet();openMemory();toast("I'll remember that.");return;}
  if(d.memnote){S.memNotes=S.memNotes.filter(n=>n.id!==d.memnote);persistAll();closeSheet();openMemory();toast("Forgotten.");return;}
  if(d.forgetthread){forgetThread(d.forgetthread);closeSheet();openMemory();toast("I won't bring that thread up again.");return;}
  if(t.id==="noRem"&&lastRead){lastRead.noMem=true;const a=S.asks.find(z=>z.id===lastRead.askId);if(a){a.noMem=true;a.text="";persistAll();}$("#memLine").innerHTML='I won\'t remember this one. <button class="linkish" id="remAgain">Remember it after all</button>';return;}
  if(t.id==="remAgain"&&lastRead){lastRead.noMem=false;const a=S.asks.find(z=>z.id===lastRead.askId);if(a){a.noMem=false;a.text=String(lastRead.carrying||"").slice(0,400);persistAll();}$("#memLine").innerHTML='I\'ll remember this. <button class="linkish" id="noRem">Don\'t remember this</button> · <button class="linkish" id="memOpen">What I remember</button>';return;}
  if(d.fu){const card=t.closest("#fuCard"),a=card&&S.asks.find(z=>z.id===card.dataset.fuid);if(!a)return;
    if(d.fu==="notyet"){a.fuSnooze=Date.now()+864e5;persistAll();toast("No pressure. I'll ask again tomorrow.");renderToday();return;}
    if(d.fu==="letgo"){a.follow={did:false,helped:"",changed:"",carry:false,ts:Date.now(),letgo:true};persistAll();toast("Let go. That's allowed.");renderToday();return;}
    a._fu={did:d.fu!=="notyet",helped:{helped:"It helped",little:"A little",notreally:"Not really",did:""}[d.fu]};
    if(d.fu==="did"){$("#fuBtns").innerHTML=[["helped","I feel better"],["still","Still bothering me"],["happened","Something happened"]].map(b=>'<button class="chip" data-fu="'+b[0]+'">'+b[1]+'</button>').join("");return;}
    if(d.fu==="still"){stillBothering(a);return;}
    if(d.fu==="happened"){a._fu={did:true,helped:"Something happened"};followStep2(a,"Something happened");const ta=$("#fuText");if(ta){ta.placeholder="What happened?";ta.focus();}return;}
    followStep2(a,a._fu.helped);return;}
  if(t.id==="fuTell"){const c=$("#carry");if(c){c.focus();c.scrollIntoView({block:"center"});}return;}
  if(d.fusave){const card=t.closest("#fuCard"),a=card&&S.asks.find(z=>z.id===card.dataset.fuid);if(a)saveFollow(a,d.fusave==="carry");return;}
  if(d.tabgo){tab(d.tabgo);return;}
  if(d.peek){const r=byId[d.peek];if(r)openSheet('<div class="stack">'+ritualCard(r,{why:true})+'</div>');return;}
  if(t.id==="shareGet"){t.disabled=true;t.textContent="Getting your link...";await loadShare();return;}
  if(t.id==="shareGo"){doShare(false);return;}
  if(t.id==="shareCopy"){doShare(true);return;}
  if((t.id==="pSave"||t.id==="pSkip")&&$("#age18")&&!$("#age18").value){toast("Add your birthday to begin.");$("#age18").focus();return;}
  if((t.id==="pSave"||t.id==="pSkip")&&$("#age18")){const v=$("#age18").value,a=age21(v);if(a==null||a<0||a>120){toast("Choose your birthday.");return;}if(a<18){setBirthday(v);return;}if(!(await setBirthday(v)))return;}
  if(t.id==="pSave"||t.id==="pSkip"){
    if(t.id==="pSave"){
      const p=S.profile;
      p.name=$("#pName").value.trim().slice(0,40);
      if($("#pHave")){known();for(const [tg] of HAVE)if(!p.known.includes(tg))p.known.push(tg);}
      const pm=document.querySelector('#pMins [aria-pressed="true"]');if(pm)p.minutes=+pm.dataset.pm;
      if($("#pHave"))p.have=[...document.querySelectorAll('#pHave [aria-pressed="true"], #pAdv [aria-pressed="true"]')].map(b=>b.dataset.have);
      if($("#pAdv")){known();for(const [tg] of HAVE_ADV)if(!p.known.includes(tg))p.known.push(tg);}
      const tn=document.querySelector('#pTone [aria-pressed="true"]');if(tn)p.tone=tn.dataset.tone;
    }
    S.profile.onboarded=true;persist("profile");closeSheet();pickedMins=null;renderAll();
    if(S.friendCode&&accountsOn()&&!ACCT.user){setTimeout(()=>openSignIn(),400);}else setTimeout(auraPopup,900);
    if(t.id==="pSave")toast("I'll remember.");
    return;
  }
});
document.addEventListener("change",ev=>{if(ev.target.dataset&&ev.target.dataset.entpriv){const e=S.entries.find(z=>z.id===ev.target.dataset.entpriv);if(e){e.private=ev.target.checked;saveLocal();remotePut("entry",e.id,e);renderArchive();toast(e.private?"Private. Aura won't use it.":"Aura can use this again.");}}});
document.addEventListener("input",ev=>{if(ev.target.id==="chatIn"){ev.target.style.height="auto";ev.target.style.height=Math.min(140,ev.target.scrollHeight)+"px";}if(ev.target.id==="archSearch"){q=ev.target.value;$("#entryList").innerHTML=entryList();}});
document.addEventListener("keydown",ev=>{if(ev.key==="Enter"&&!ev.shiftKey&&ev.target.id==="chatIn"){ev.preventDefault();sendTalk();return;}if(ev.key==="Escape"){if($("#simple"))closeSimple();else if($("#scrim"))closeSheet();else if(run)endRitual();else if(talkG)closeTalk();}});

function refreshCards(){
  document.querySelectorAll(".page[data-rid]").forEach(el=>{const r=(lastRead&&lastRead.ritual&&lastRead.ritual.id===el.dataset.rid)?lastRead.ritual:byId[el.dataset.rid];if(!r)return;let o={};try{o=JSON.parse(el.dataset.opts||"{}");}catch(e){}const w=document.createElement("div");w.innerHTML=ritualCard(r,o);el.replaceWith(w.firstChild);});
}
function renderBadge(){const b=$("#memBadge");if(!b)return;b.hidden=!isMember();b.textContent=isLifetime()?"Inner Circle · Lifetime":inTrial()?"Inner Circle · "+trialDaysLeft()+(trialDaysLeft()===1?" day":" days")+" free":"Inner Circle";}
function renderAll(){renderBadge();renderSky();renderToday();renderJourneys();renderCircle();renderArchive();}
noteVisit();drawSeal();renderAll();setTimeout(cycleSync,2500);setTimeout(()=>{auraPopup();setTimeout(maybeAskFeedback,400);trackOpen();},1200);
if(!S.profile.onboarded)setTimeout(()=>{if(!S.profile.onboarded&&!$("#scrim")&&!$("#gate")&&!$("#phoneOnly"))openAltar(true);},700);
restoreUI();
initCloud();initWeb();
})();
