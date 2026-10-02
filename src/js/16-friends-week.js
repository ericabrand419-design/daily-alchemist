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
async function loadShare(){const r=await api("/api/share",{});if(r&&r.code){SHARE=r;const g=$("#shareGroup");if(g)g.outerHTML=shareHTML();}else if(r&&r.error==="adult_confirmation_required"){openBirthday("Before I can make an invitation link, I need to confirm you're an adult. What's your birthday?");}else if(r&&r.error)toast("I couldn't get your link just now. Try again in a minute.");return r;}
const INV_ERICA="It's Erica. I built an app called The Daily Alchemist, and I'd love for you to be one of the first people to try it. This is a real invitation from me, not a scam or a phishing link.\n\nHow it works: open the link on your phone and enter your email. Daily Alchemist will email you an 8-digit sign-in code. No password and no text messages from the app. Then just tell Aura, the app's guide, what's going on in your day. She'll bring you a small ritual or the right guardian to talk to. Play around and poke at everything.\n\nIt's free for you, for life. No card, nothing to pay.\n\nDuring your first week, the app will ask if you're okay with me seeing basic usage activity, like which parts you use and when, so I can tell what's confusing and what works. That's completely optional, you choose exactly what to share, and I never see what you write or say. Your words stay private.\n\nIf it's not your thing, no hard feelings at all. If you do try it, I'd be so grateful for your honest feedback. There's a feedback button right in the app.\n\nI'm really proud of this. Thank you for helping me make it better.",INV_FRIEND="My friend Erica built an app called The Daily Alchemist and I've been testing it for her. She gave me a few free invitations and I wanted you to have one. It's legit, not a scam or a phishing link.\n\nHow it works: open the link on your phone and enter your email. Daily Alchemist emails you an 8-digit sign-in code. No password and no text messages from the app. Then tell Aura, the app's guide, what's going on in your day, and she'll bring you a small ritual or the right guardian to talk to.\n\nIt's free for life with this link. Nothing to pay. In your first week the app asks if you're okay with Erica seeing basic usage activity, never what you write or say. Totally optional.\n\nShe'd love honest feedback, and there's a button for it in the app.";
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
  if(!S.friendCode||ACCT.lifetime)return true;
  const r=await api("/api/friend",{code:S.friendCode});
  if(r&&r.ok){S.friendCode=null;saveLocal();await refreshMe();return true;}
  if(r&&r.error==="adult_confirmation_required"){
    if(S.profile.onboarded&&!$("#scrim"))openBirthday("Before I can finish claiming your invitation, I need to confirm you're an adult. What's your birthday?");
    return false;
  }
  if(r&&r.error==="bad_code"){S.friendCode=null;saveLocal();toast("That invitation has already been used up or has expired. Ask the person who sent it.");return false;}
  if(r&&r.error){toast("I couldn't finish claiming your invitation. Your link is still saved. Try again in a moment.");return false;}
  return false;
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
  chat_open:"chats",chat_send:"chats",letter_open:"letters",nudge_reply:"letters",nudge_later:"letters",hear:"sound",music:"sound",paywall:"membership",checkout:"membership"};
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
    '<div class="card"><p style="margin:0">'+o+' is learning how people use the app this week. If you\'d like to help, tick anything you\'re comfortable sharing for the next 7 days. It\'s only basic usage activity: what you open or tap, how long a visit lasts, and how far you get in a ritual. <b>Never your words.</b> Ticking nothing is completely fine.</p><div style="margin-top:10px">'+shareChecklist([])+'</div></div>'+
    '<button class="btn btn-main full" id="consentSave">Share what I ticked</button><button class="btn btn-ghost full" data-consent="0">Don\'t share anything</button>'+
    '<p class="small muted" style="text-align:center">You can change this any time this week in Settings. It ends by itself after 7 days. Either way, everything stays open to you, for life.</p></div>');
}
async function setConsent(yes,scope){
  scope=yes?(scope||SHARE_OPTS.map(o=>o[0])):[];if(!scope.length)yes=false;
  closeSheet();
  if(!accountsOn()){S.previewMonitorAnswer=yes?"yes":"no";S.previewMonitor=yes?(S.previewMonitor&&S.previewMonitor>Date.now()?S.previewMonitor:Date.now()+7*864e5):0;S.previewScope=scope;saveLocal();}
  else{const r=await api("/api/monitor",{consent:!!yes,scope});if(r&&!r.error){ACCT.monitorAnswer=r.monitor_answer;ACCT.monitorUntil=r.monitor_until;ACCT.monitorScope=r.monitor_scope||scope;}}
  if(yes){track("open");toast("Thank you. "+ownerName()+" only sees the usage categories you ticked, never your words.");}else toast("Nothing is shared. Everything is still yours.");
  renderAll();setTimeout(auraPopup,600);
}
function sharingHTML(){
  if(inFriendsWeek()){const on=monitorOn(),sel=on?shareScope():[];
    return '<details class="group" open><summary>What you share with '+esc(ownerName())+'</summary><p class="small muted"><b>What you write, say, or tell Aura and the guardians is always private.</b> '+esc(ownerName())+' never sees it. Below is only the usage activity you chose to share'+(on?', until '+new Date(accountsOn()?Date.parse(ACCT.monitorUntil):S.previewMonitor).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}):'')+'. Change it any time.</p><div style="margin-top:8px">'+shareChecklist(sel)+'</div><button class="btn btn-ghost full" id="scopeSave" style="margin-top:10px">Save my choices</button></details>';}
  if(!monitorOn())return "";
  const until=accountsOn()?Date.parse(ACCT.monitorUntil):S.previewMonitor;
  return '<details class="group" open><summary>Sharing with '+esc(ownerName())+'</summary><p class="small muted">Until '+new Date(until).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"})+', '+esc(ownerName())+' can see the usage activity you chose to share. Never what you write or say.</p><button class="btn btn-ghost full" data-consent="0">Stop sharing now</button></details>';
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
