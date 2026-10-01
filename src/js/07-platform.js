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
function okG(k){return G[k]?(allowedG(k)?k:"marigold"):null;}
function canUse(r){return !!r&&(!r.member||isMember())&&(!r.adult21||vesperOK())&&(!r.explicit||!NATIVE)&&(!r.love||!S.profile.person||r.love===S.profile.person.mode);}
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const SIGNS=[["Capricorn",120,"earth"],["Aquarius",219,"air"],["Pisces",321,"water"],["Aries",420,"fire"],["Taurus",521,"earth"],["Gemini",621,"air"],["Cancer",723,"water"],["Leo",823,"fire"],["Virgo",923,"earth"],["Libra",1023,"air"],["Scorpio",1122,"water"],["Sagittarius",1222,"fire"],["Capricorn",1300,"earth"]];
function signOf(md){if(!md)return null;const [m,d]=String(md).split("-").map(Number);if(!m||!d)return null;const n=m*100+d;const x=SIGNS.find(z=>n<z[1]);return {name:x[0],el:x[2]};}
function mdText(md){const [m,d]=String(md||"").split("-").map(Number);return m&&d?MONTHS[m-1]+" "+d:"";}
function compat(a,b){if(!a||!b)return "";const pair=[a.el,b.el].sort().join("+");
  if(a.el===b.el)return "You're both "+a.el+" signs. You get each other without trying.";
  if(pair==="air+fire"||pair==="earth+water")return "Your elements feed each other.";
  return "Your elements balance each other. It takes a little more talking, and that's where the heat is.";}
function needBirthday(){if(S.profile.minor)return false;if(!S.profile.bday)return true;return accountsOn()&&ACCT.user&&!ACCT.adult21&&!ACCT.under21;}
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
  S.profile.bday=v.slice(5,10);S.profile.adult21=a>=21;S.profile.under21=a<21;
  if(a<18){S.profile.minor=true;S.profile.adult=false;saveLocal();if(accountsOn()&&ACCT.user)await api("/api/me",{dob:v});showMinor();return false;}
  S.profile.adult=true;saveLocal();remotePut("prefs");
  if(accountsOn()&&ACCT.user){S.pendingDob=v;saveLocal();const r=await api("/api/me",{dob:v});
    if(r&&!r.error){delete S.pendingDob;saveLocal();ACCT.adultAt=r.adult_confirmed_at||ACCT.adultAt;ACCT.adult21=!!r.adult21_at;ACCT.under21=!!r.under21_at;if(S.friendCode&&!ACCT.lifetime)redeemFriend();}}
  return true;
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
  const g=G.vesper;
  if(accountsOn()&&ACCT.under21||S.profile.under21){openSheet('<div class="stack">'+glyph("vesper",56)+'<h2>Vesper is for 21 and older</h2><p>Marigold is here for love, dating and feeling good in your skin.</p><button class="btn btn-main full" data-talk="marigold">Talk to Marigold</button></div>');return;}
  if(!(accountsOn()?ACCT.adult21:S.profile.adult21)){openBirthday("Vesper\'s room is for 21 and older. When\'s your birthday?","vesper");return;}
  if(false){openSheet('<div class="stack">'+glyph("vesper",56)+'<div><div class="label" style="color:'+g.color+'">'+esc(g.title)+'</div><h2>Vesper\'s room is for 21 and older</h2></div><p>Enter your date of birth to continue.</p><label class="sr" for="dob21">Date of birth</label><input type="date" id="dob21" max="'+new Date().toISOString().slice(0,10)+'"><button class="btn btn-main full" id="dob21Go">Continue</button><p class="small muted">We only keep whether you are 21 or older, not your birthday.</p></div>');return;}
  closeSheet();openPaywall("Vesper's room is for members");
}
function age21(v){const d=new Date(v+"T12:00:00");if(isNaN(d))return null;const n=new Date();let a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))a--;return a;}
async function submitDob(){
  const v=($("#dob21")||{}).value;const a=age21(v);if(a==null||a<0||a>120){toast("Choose your date of birth.");return;}
  if(accountsOn()&&ACCT.user){const r=await api("/api/me",{dob:v});if(r&&!r.error){ACCT.adult21=!!r.adult21_at;ACCT.under21=!!r.under21_at;}}
  else{if(a>=21)S.profile.adult21=true;else S.profile.under21=true;saveLocal();}
  closeSheet();renderAll();
  if(vesperOK())openTalk("vesper");else vesperGate();
}
function usedToday(kind){const u=S.usage[dayKey(new Date())]||{};return u[kind]||0;}
function bump(kind){const k=dayKey(new Date());const cur=S.usage[k]||{};S.usage={[k]:{...cur,[kind]:(cur[kind]||0)+1}};saveLocal();}
function overLimit(kind){if(accountsOn()&&ACCT.admin)return false;return usedToday(kind)>=LIMITS[isMember()?"member":"free"][kind];}
function synced(){return MODE==="artifact"?cloud.on:!!ACCT.user;}

async function remotePut(kind,id,data){
  if(MODE==="artifact"){return cloudPut(kind==="chat"?"chat-"+id:kind==="prefs"?"profile":id,kind==="prefs"?S.profile:data).then(()=>{if(kind==="prefs"){cloudPut("draws",{draws:S.draws});if(S.ledger)cloudPut("ledger",{ledger:S.ledger});cloudPut("extras",{extras:{asks:(S.asks||[]).slice(0,150),memNotes:S.memNotes||[],promises:S.promises,later:S.later,myRituals:S.myRituals,cart:S.cart,misses:S.misses,plans:S.plans,days:S.days,spaces:S.spaces,dates:S.dates,corr:S.corr,pseason:S.pseason,letters:S.letters,nudges:S.nudges}});}});}
  if(!ACCT.user||!ACCT.sb)return;
  const sb=ACCT.sb,uid=ACCT.user.id;
  try{
    if(kind==="entry")await sb.from("entries").upsert({id,user_id:uid,data});
    else if(kind==="chat")await sb.from("chats").upsert({user_id:uid,guardian:id,msgs:data.msgs,updated_at:new Date().toISOString()});
    else await sb.from("prefs").upsert({user_id:uid,data:{profile:S.profile,draws:S.draws,ledger:S.ledger||null,extras:{asks:(S.asks||[]).slice(0,150),memNotes:S.memNotes||[],promises:S.promises,later:S.later,myRituals:S.myRituals,cart:S.cart,misses:S.misses,plans:S.plans,days:S.days,spaces:S.spaces,dates:S.dates,corr:S.corr,pseason:S.pseason,letters:S.letters,nudges:S.nudges}},updated_at:new Date().toISOString()});
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
