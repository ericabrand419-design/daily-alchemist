// Production email OTP delivery.
// Supabase creates and verifies the secure OTP; Resend delivers it.
import { json, env } from "../api/_lib.js";

const recent=new Map();
function cleanEmail(value){
  const email=String(value||"").trim().toLowerCase();
  return /^\S+@\S+\.\S+$/.test(email)&&email.length<=254?email:"";
}
function rateKey(request,email){
  const ip=(request.headers.get("x-forwarded-for")||request.headers.get("x-real-ip")||"").split(",")[0].trim();
  return (ip||"unknown")+"|"+email;
}
function recentlySent(key){
  const now=Date.now(),prev=recent.get(key)||0;
  if(recent.size>500){for(const [k,t] of recent)if(now-t>3600000)recent.delete(k);}
  return !!prev&&now-prev<60000;
}
function markSent(key){recent.set(key,Date.now());}

export async function POST(request){
  let body={};try{body=await request.json();}catch{}
  const email=cleanEmail(body.email);
  if(!email)return json({error:"bad_email"},400);
  const key=rateKey(request,email);
  if(recentlySent(key))return json({error:"rate_limited",sent:true},429);

  const supabaseUrl=env("SUPABASE_URL");
  const serviceKey=env("SUPABASE_SERVICE_ROLE_KEY");
  const resendKey=env("RESEND_API_KEY");
  if(!supabaseUrl||!serviceKey||!resendKey){
    console.error("auth-code: required mail configuration missing");
    return json({error:"mail_unavailable"},503);
  }

  let generated={};
  try{
    const res=await fetch(supabaseUrl.replace(/\/$/,"")+"/auth/v1/admin/generate_link",{
      method:"POST",
      headers:{apikey:serviceKey,authorization:"Bearer "+serviceKey,"content-type":"application/json"},
      body:JSON.stringify({type:"magiclink",email,redirect_to:env("SITE_URL")||"https://dailyalchemist.com"})
    });
    const raw=await res.text();
    try{generated=raw?JSON.parse(raw):{};}catch{}
    if(!res.ok||!generated.email_otp){
      console.error("auth-code: Supabase OTP generation failed",res.status,String(raw||"").slice(0,300));
      return json({error:"otp_unavailable"},503);
    }
  }catch(err){
    console.error("auth-code: Supabase exception",String(err&&err.message||err));
    return json({error:"otp_unavailable"},503);
  }

  const code=String(generated.email_otp||"").replace(/\D/g,"");
  if(code.length!==8){
    console.error("auth-code: OTP length mismatch",code.length);
    return json({error:"otp_config"},503);
  }

  const from=env("AUTH_FROM")||env("NOTIFY_FROM")||"The Daily Alchemist <hello@dailyalchemist.com>";
  try{
    const res=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{authorization:"Bearer "+resendKey,"content-type":"application/json"},
      body:JSON.stringify({
        from,
        to:[email],
        subject:code+" is your Daily Alchemist sign-in code",
        text:"Your Daily Alchemist sign-in code is "+code+".\n\nEnter this 8-digit code in the app. It expires shortly. If you did not request it, you can ignore this email.",
        html:'<div style="font-family:Georgia,serif;background:#171328;color:#f4efe8;padding:32px"><div style="max-width:520px;margin:auto"><p style="color:#d6b650;letter-spacing:.12em;text-transform:uppercase;font:600 13px Arial,sans-serif">The Daily Alchemist</p><h1 style="font-size:28px;font-weight:400">Your sign-in code</h1><div style="font:700 34px/1.2 Arial,sans-serif;letter-spacing:.18em;color:#f1ce63;margin:28px 0">'+code+'</div><p style="font-size:17px;line-height:1.5">Enter this 8-digit code in the app. It expires shortly.</p><p style="font:14px/1.5 Arial,sans-serif;color:#aaa3b4;margin-top:28px">If you did not request this, you can ignore this email.</p></div></div>'
      })
    });
    const raw=await res.text();
    let sent={};try{sent=raw?JSON.parse(raw):{};}catch{}
    if(!res.ok||!sent.id){
      console.error("auth-code: Resend rejected delivery",res.status,String(raw||"").slice(0,300));
      return json({error:"mail_unavailable"},503);
    }
  }catch(err){
    console.error("auth-code: Resend exception",String(err&&err.message||err));
    return json({error:"mail_unavailable"},503);
  }
  markSent(key);
  return json({ok:true});
}

export { preflight as OPTIONS } from "../api/_lib.js";
