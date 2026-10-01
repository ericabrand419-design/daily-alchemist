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
