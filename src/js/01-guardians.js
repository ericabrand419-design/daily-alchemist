
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

