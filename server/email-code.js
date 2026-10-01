import crypto from "node:crypto";
import { json, env, siteUrl } from "../api/_lib.js";

const secret = () => env("SUPABASE_SERVICE_ROLE_KEY");
const sign = (email, code, exp) => crypto.createHmac("sha256", secret()).update(email+"|"+code+"|"+exp).digest("base64url");

export async function POST(request) {
  let body={}; try { body=await request.json(); } catch {}
  const action=String(body.action||"send");
  const email=String(body.email||"").trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email)) return json({error:"invalid_email"},400);
  if(!secret()) return json({error:"auth_not_configured"},500);

  if(action==="send"){
    if(!env("RESEND_API_KEY")) return json({error:"email_not_configured"},500);
    const code=String(crypto.randomInt(100000,1000000));
    const exp=Date.now()+10*60*1000;
    const challenge=Buffer.from(JSON.stringify({email,exp,sig:sign(email,code,exp)})).toString("base64url");
    const from=env("AUTH_FROM")||env("NOTIFY_FROM")||"Aura at The Daily Alchemist <onboarding@resend.dev>";
    const r=await fetch("https://api.resend.com/emails",{
      method:"POST",
      headers:{authorization:"Bearer "+env("RESEND_API_KEY"),"content-type":"application/json"},
      body:JSON.stringify({from,to:[email],subject:"Your Daily Alchemist sign-in code",text:"Your Daily Alchemist code is "+code+".\n\nIt expires in 10 minutes. If you did not request this, you can ignore this email."})
    });
    const detail=await r.text();
    if(!r.ok){console.error("auth email failed",r.status,detail);return json({error:"email_delivery_failed"},502);}
    return json({ok:true,challenge});
  }

  if(action==="verify"){
    const code=String(body.code||"").replace(/\D/g,"");
    let c; try { c=JSON.parse(Buffer.from(String(body.challenge||""),"base64url").toString("utf8")); } catch {}
    if(!c||c.email!==email||!c.exp||Date.now()>c.exp||!c.sig) return json({error:"code_expired"},400);
    const expected=sign(email,code,c.exp);
    try { if(!crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(c.sig))) return json({error:"invalid_code"},400); }
    catch { return json({error:"invalid_code"},400); }

    const r=await fetch(env("SUPABASE_URL")+"/auth/v1/admin/generate_link",{
      method:"POST",
      headers:{apikey:secret(),authorization:"Bearer "+secret(),"content-type":"application/json"},
      body:JSON.stringify({type:"magiclink",email,options:{redirectTo:siteUrl(request)}})
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok){console.error("auth link failed",r.status,JSON.stringify(data));return json({error:"signin_failed"},502);}
    const link=data.action_link||data.properties?.action_link;
    if(!link) return json({error:"signin_failed"},502);
    return json({ok:true,url:link});
  }
  return json({error:"bad_action"},400);
}

export { preflight as OPTIONS } from "../api/_lib.js";
