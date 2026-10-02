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
  el.style.setProperty("--talk-accent",g.color);
  el.innerHTML='<header class="hd"><button class="navback" id="talkX" aria-label="Back">← <span>Back</span></button><div class="talkportrait">'+glyph(k)+'</div><div class="who"><span class="talkeyebrow">Private conversation</span><div class="n">'+esc(g.name)+'</div><div class="t">'+esc(g.title)+'</div></div><span class="sndbar"></span></header><div class="msgs" id="msgs"></div>'+
    '<footer class="ft"><div class="composer"><label class="sr" for="chatIn">Message '+esc(g.name)+'</label><textarea id="chatIn" rows="1" placeholder="Tell '+esc(g.name)+' what happened…"></textarea>'+micBtn("chatIn")+'</div><button class="send" id="chatSend" aria-label="Send">'+SEND+'</button></footer>';
  document.body.appendChild(el);document.body.style.overflow="hidden";
  drawMsgs();
}

function closeTalk(){setTimeout(saveUI,0);if(talkG){const l=(S.chats[talkG]||[]);if(!S.led)S.led={};const since=l.slice(S.led[talkG]||0);const fresh=since.slice(-8);if(fresh.filter(m=>m.role==="me").length>=2){S.led[talkG]=l.length;saveLocal();updateLedger("Conversation with "+G[talkG].name+":\n"+fresh.map(m=>(m.role==="me"?"Her: ":G[talkG].name+": ")+m.text).join("\n"));}}if(talkAbort)talkAbort.abort();stopMic();const el=$("#talk");if(el)el.remove();document.body.style.overflow="";talkG=null;if(!run)musicBack();}
function msgHTML(m,k){
  if(m.role==="me")return '<div class="bub me"><span class="msgwho">You</span><p>'+esc(m.text)+'</p></div>';
  const r=m.ritual&&byId[m.ritual];
  return '<div class="bub them"><span class="msgwho">'+esc(G[k].name)+'</span><p>'+(voiceEnabled()?'<button class="hear" data-hear="'+k+'" aria-label="Hear '+esc(G[k].name)+'">'+HEAR_ICON+'</button>':'')+esc(m.text)+'</p>'+(m.handoff&&G[m.handoff]?'<button class="btn btn-main" data-handoff="'+m.handoff+'">Go to '+esc(G[m.handoff].name)+'</button>':"")+(m.upsell?'<button class="btn btn-main" data-paywall="More time with the circle">Join '+esc(PLAN.name)+'</button>':"")+(r?'<button class="btn btn-main" data-begin="'+esc(r.id)+'" data-ctx="talk">Begin '+esc(r.title)+' · '+r.min+' min</button>':"")+'</div>';
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
  box.innerHTML=introHTML(k)+'<div class="bub them"><span class="msgwho">'+esc(G[k].name)+'</span><p>'+esc(hi)+'</p></div>'+list.map(m=>msgHTML(m,k)).join("");
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

