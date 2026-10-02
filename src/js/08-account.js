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
    '<button class="btn btn-main full" id="siSend" style="margin-top:12px">Email my code</button>'+
    '<div class="field" id="siCodeRow" hidden style="margin-top:14px"><label for="siCode">8-digit code from your email</label><input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" id="siCode" placeholder="12345678"></div>'+
    '<button class="btn btn-main full" id="siVerify" hidden style="margin-top:12px">'+(gate?"Come in":"Sign in")+'</button>'+
    '<p class="small muted" id="siMsg" style="text-align:center;margin-top:10px">'+(invite?"Your invitation came by link. Enter your email and we\'ll email you an 8-digit sign-in code. No password and no text messages from us.":"Enter your email and we\'ll email you an 8-digit sign-in code. No password.")+'</p>'+
    '</div>';
}
/* On the live app everyone signs in or makes a free account first, so Aura can give her
   full reading from the very first question. */
function showGate(){
  if(MODE!=="web"||!ACCT.sb||$("#gate"))return;
  if(!S.seenIntro&&!S.profile.onboarded){showIntro();return;}
  const g=document.createElement("div");g.className="gate";g.id="gate";g.setAttribute("role","dialog");g.setAttribute("aria-modal","true");g.setAttribute("aria-label","Sign in");
  g.innerHTML='<div class="sndbar gatesnd"></div><div class="in auraPop"><div class="popseal">'+glyph("aura",72)+'</div><h1 class="foil shine">The Daily Alchemist</h1>'+
    auraSays(S.friendCode?"I\'m Aura, your guide here. Erica invited you in. Enter your email to claim your invitation and I\'ll email you an 8-digit sign-in code. No password and no text messages from us.":"I\'m Aura, your guide here. Tell me what happened in your day and I\'ll bring you the guardian and the small ritual that fits. Sign in, or make your free account, so I can remember it for you.","Aura · welcome")+
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
    if(p.data&&p.data.data){S.profile={...S.profile,...(p.data.data.profile||{})};applyDisplayPrefs();if(S.profile.snd)applySnd(S.profile.snd);S.draws={...S.draws,...(p.data.data.draws||{})};if(p.data.data.ledger)S.ledger=p.data.data.ledger;if(p.data.data.extras)mergeExtras(p.data.data.extras);}
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

