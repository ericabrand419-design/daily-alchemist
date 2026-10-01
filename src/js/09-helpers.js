/* Journeys progress */
function journeyDays(id){return [...new Set(S.entries.filter(e=>e.journey===id).map(e=>e.jday))];}

const MIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/></svg>';
const SEND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
/* One rule for every chat: when a guardian opens the conversation (after a ritual, a check in,
   a handoff, something you asked to bring back), any earlier opening you never answered is
   replaced, never stacked. */
function guardianOpens(list,msg){while(list.length&&list[list.length-1].role==="them"&&list[list.length-1].auto)list.pop();list.push({...msg,role:"them",auto:true,ts:Date.now()});return list;}
function micBtn(id){return '<button class="mic" data-mic="'+id+'" aria-pressed="false" aria-label="Speak instead of typing">'+MIC+'</button>';}
/* helpers */
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=new Date();
const dayKey=d=>d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
const fmtDate=ts=>new Date(ts).toLocaleDateString(undefined,{month:"short",day:"numeric",year:new Date(ts).getFullYear()===today.getFullYear()?undefined:"numeric"});
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);$("#live").textContent=msg;setTimeout(()=>t.remove(),2600);}
const M = moon(today), SEA = season(today);

/* Wax seal emblem, drawn with an uneven edge so it reads as pressed wax */
function drawSeal(){
  if(!$("#seal"))return;
  const c=$("#seal"),x=c.getContext("2d"),W=c.width,cx=W/2,cy=W/2;
  x.clearRect(0,0,W,W);
  x.beginPath();
  for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,r=W*.44+Math.sin(a*7)*2.2+Math.sin(a*13+1)*1.6+Math.cos(a*5)*1.4;x.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);}
  const g=x.createRadialGradient(cx*.8,cy*.7,4,cx,cy,W*.5);g.addColorStop(0,"#E6559A");g.addColorStop(.55,"#BF1E73");g.addColorStop(1,"#6E0F42");
  x.fillStyle=g;x.fill();
  x.lineWidth=2;x.strokeStyle="rgba(60,5,30,.5)";x.stroke();
  const fg=x.createLinearGradient(0,0,W,W);fg.addColorStop(0,"#FFF1B8");fg.addColorStop(.45,"#D9AE3B");fg.addColorStop(1,"#8A6512");
  x.strokeStyle=fg;x.lineWidth=3;x.beginPath();x.arc(cx,cy,W*.33,0,Math.PI*2);x.stroke();
  x.lineWidth=1.4;x.beginPath();x.arc(cx,cy,W*.29,0,Math.PI*2);x.stroke();
  x.fillStyle=fg;x.beginPath();x.arc(cx-4,cy,W*.19,0,Math.PI*2);x.fill();
  x.globalCompositeOperation="destination-out";x.beginPath();x.arc(cx+8,cy-6,W*.17,0,Math.PI*2);x.fill();
  x.globalCompositeOperation="source-over";
  x.fillStyle=fg;const sx=cx+18,sy=cy+14,s=8;x.beginPath();x.moveTo(sx,sy-s);x.lineTo(sx+2.2,sy-2.2);x.lineTo(sx+s,sy);x.lineTo(sx+2.2,sy+2.2);x.lineTo(sx,sy+s);x.lineTo(sx-2.2,sy+2.2);x.lineTo(sx-s,sy);x.lineTo(sx-2.2,sy-2.2);x.fill();
}

/* The sky strip lives in 17b-plants-and-alchemy.js as the Daily Alchemy strip. */

