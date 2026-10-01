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

