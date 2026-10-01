/* ------------------------------------------------------------------
   AURA: the routing intelligence. Real reading when Claude is
   available on this view, a careful local reading when it isn't.
------------------------------------------------------------------ */
const KW = {
  sage:["angry","anger","pissed","rage","mad","furious","betray","resent","unfair","hate them","livid","fed up","disrespect"],
  onyx:["shame","guilt","ashamed","truth","lie","lying","hiding","secret","shadow","regret","trauma","i was wrong","my fault","messed up","screwed up","fucked up","hurt someone","i hurt","apologize","apology","amends","cheated","made a mistake","owe an apology","make it right","shadow work"],
  willow:["grief","grieving","died","death","passed away","loss","miss her","miss him","funeral","forgive"],
  wren:["sign","coincidence","dream","keep seeing","synchronicity","111","222","333","444"],
  lumen:["future","vision","manifest","dream life","goals"],
  onora:["grandmother","grandma","grandfather","ancestor","heritage","family history"],
  poppy:["creative","creativity","art","paint","draw","write","writing","writer's block","music","song","blocked","muse","make something","project","inspired","uninspired"],
  ember:["scared","afraid","fear","courage","leap","quit my","confront"],
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
const THEME = {poppy:"creativity",aurora:"awakening",rowan:"movement",ember:"courage",willow:"grief",vesper:"desire",wren:"signs",lumen:"vision",onora:"ancestry",sage:"fire",onyx:"shadow",fern:"rest",lily:"clarity",thistle:"boundaries",marigold:"worth",juniper:"space",rue:"protection",sol:"follow through",aura:"centering"};
function score(r,mins){
  let s=outcomeBonus(r.id); if(r.min<=mins)s+=3; else s-=Math.ceil((r.min-mins)/5);
  s-=missingFor(r).length*1.5;
  return s;
}
function recentThemes(days){const cut=Date.now()-days*864e5,c={};for(const e of S.entries)if(e.ts>cut&&e.theme&&e.theme!=="reset")c[e.theme]=(c[e.theme]||0)+1;return c;}
