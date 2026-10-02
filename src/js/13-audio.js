/* Music: every guardian has an instrumental theme, made once and stored with the app.
   Aura's plays on Today and the main pages; a guardian's plays on their page, in their
   rituals and in their chats. Music starts only after a meaningful app action, a ritual,
   or an explicit choice in Sound. It never starts from an arbitrary tap. */
/* Spoken guardian voice (hear buttons, Guide me aloud, eyes closed, spoken ritual commands) is
   switched off for now. The code stays here behind this flag. Only the owner can try it, by
   setting localStorage "da.voiceDev" to "1". Speaking into the mic to type is separate and stays on. */
const GUARDIAN_VOICE_ENABLED=!!(window.DA_CONFIG&&window.DA_CONFIG.guardianVoiceEnabled);
function voiceEnabled(){if(GUARDIAN_VOICE_ENABLED)return true;try{return typeof ACCT!=="undefined"&&!!ACCT.admin&&localStorage.getItem("da.voiceDev")==="1";}catch(e){return false;}}
const MUSIC={cur:null,want:"aura",base:"aura",duck:false,started:false,all:new Set(),suspended:false,resume:false};
function musicOn(){return S.prefMusic!=="off";}
function musicVol(){const h=new Date().getHours();return (S.prefMusicVol==="normal"?0.26:0.12)*(MUSIC.duck?0.25:1)*(h>=21||h<5?0.7:1);}
function musicSrc(g){const u=window.DA_CONFIG&&window.DA_CONFIG.supabaseUrl;return u?u.replace(/\/$/,"")+"/storage/v1/object/public/music/"+g+".mp3":null;}
function fadeTo(el,v,ms,done){if(!el)return;clearInterval(el._fade);const from=el.volume,t0=Date.now();el._fade=setInterval(()=>{const k=Math.min(1,(Date.now()-t0)/ms);try{el.volume=Math.max(0,Math.min(1,from+(v-from)*k));}catch(e){}if(k>=1){clearInterval(el._fade);done&&done();}},50);}
function pauseMusicEl(el){if(!el)return;clearInterval(el._fade);try{el.pause();}catch(e){}}
function silenceOtherMusic(keep){for(const el of [...MUSIC.all])if(el!==keep){pauseMusicEl(el);MUSIC.all.delete(el);}}
function musicPlay(g){
  MUSIC.want=g||MUSIC.base;
  if(!musicOn()||!MUSIC.started||MUSIC.suspended||document.visibilityState==="hidden")return;
  if(MUSIC.cur&&MUSIC.cur._g===MUSIC.want){
    silenceOtherMusic(MUSIC.cur);
    fadeTo(MUSIC.cur,musicVol(),350);
    if(MUSIC.cur.paused)MUSIC.cur.play().catch(()=>{});
    return;
  }
  const src=musicSrc(MUSIC.want);if(!src)return;
  /* One guardian, one soundtrack. Never crossfade two guardians over each other. */
  silenceOtherMusic(null);
  const el=new Audio();el._g=MUSIC.want;el.loop=true;el.preload="auto";el.volume=0;el.src=src;MUSIC.all.add(el);
  el.onerror=()=>{MUSIC.all.delete(el);if(MUSIC.cur===el)MUSIC.cur=null;if(el._g!=="aura"&&MUSIC.want===el._g){MUSIC.want="aura";musicPlay("aura");}};
  el.onplay=()=>renderSnd();el.onpause=()=>{if(MUSIC.cur===el)renderSnd();};
  MUSIC.cur=el;el.play().then(()=>fadeTo(el,musicVol(),700)).catch(()=>{});
}
function musicStop(){for(const el of [...MUSIC.all])pauseMusicEl(el);MUSIC.all.clear();MUSIC.cur=null;MUSIC.resume=false;renderSnd();}
function musicFor(g){musicPlay(g||MUSIC.base);}
function musicBack(){musicPlay(MUSIC.base);}
function musicDuck(on){if(on&&!voiceEnabled())on=false;MUSIC.duck=!!on;if(MUSIC.cur&&!MUSIC.cur.paused)fadeTo(MUSIC.cur,musicVol(),on?250:500);}
function musicSuspend(){
  if(MUSIC.suspended)return;
  MUSIC.resume=musicAudible();
  MUSIC.suspended=true;
  for(const el of MUSIC.all)pauseMusicEl(el);
  renderSnd();
}
function musicResume(){
  const shouldResume=MUSIC.resume;
  MUSIC.suspended=false;MUSIC.resume=false;
  if(shouldResume&&musicOn()&&MUSIC.started&&document.visibilityState!=="hidden")musicPlay(MUSIC.want);
}
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
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden")musicSuspend();else musicResume();});
window.addEventListener("pagehide",musicSuspend);
window.addEventListener("pageshow",()=>{if(document.visibilityState!=="hidden")musicResume();});
window.addEventListener("blur",musicSuspend);
window.addEventListener("focus",()=>{if(document.visibilityState!=="hidden")musicResume();});
document.addEventListener("freeze",musicSuspend);
document.addEventListener("resume",()=>{if(document.visibilityState!=="hidden")musicResume();});

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

