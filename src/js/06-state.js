/* ------------------------------------------------------------------
   STATE: the Archive is memory. Saved to her account when available,
   mirrored on this device so the app works offline and instantly.
------------------------------------------------------------------ */
const KEY="dailyAlchemist.v1";
let S = {profile:{name:"",minutes:10,have:[],known:[],tone:"balanced",appearance:"auto",fontSize:"standard",onboarded:false},entries:[],draws:{}};
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
function applyDisplayPrefs(){
  const p=S.profile||{},root=document.documentElement;
  const appearance=["auto","light","dark"].includes(p.appearance)?p.appearance:"auto";
  const font=["standard","large","xlarge"].includes(p.fontSize)?p.fontSize:"standard";
  root.dataset.appearance=appearance;root.dataset.font=font;
  if(appearance==="auto")delete root.dataset.theme;else root.dataset.theme=appearance;
  setTimeout(()=>{if(typeof skyTick==="function")skyTick();},0);
}
applyDisplayPrefs();
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

