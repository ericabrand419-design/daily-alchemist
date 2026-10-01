# The Daily Alchemist: going live

This folder is the whole app. It runs on Vercel. Accounts and data live in Supabase, payments run through Stripe, and the guardians talk through Anthropic's API.

## 1. Supabase (accounts and data). The free tier is fine.
1. Create a project at supabase.com.
2. SQL Editor: paste everything in `supabase/schema.sql` and click Run. (Safe to run again after updates.)
3. Authentication > Sign In / Providers: make sure Email is on.
4. Authentication > Email Templates > Magic Link: make sure the email includes `{{ .Token }}`. That is the 6-digit code people type into the app.
5. Project Settings > API: copy the Project URL, the anon key and the service_role key.
6. Open `config.js` and paste in the Project URL and anon key. The service_role key never goes in this file.

## 2. Stripe (payments)
1. Product catalog > Add product: "The Inner Circle". Add two recurring prices: $6.99 monthly and $49 yearly. Copy both price IDs (they start with `price_`).
2. Developers > API keys: copy the Secret key.
3. Developers > Webhooks > Add endpoint: `https://dailyalchemist.com/api/stripe-webhook`. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the signing secret (`whsec_...`).
4. Settings > Billing > Customer portal: turn it on so members can cancel on their own.
5. Do all of this in Test mode first. Pay with card 4242 4242 4242 4242, any future date, any CVC. Switch to Live mode once that works.

## 3. Anthropic (the guardians' voices)
1. console.anthropic.com > API Keys: create a key.
2. Set a monthly spend limit under Billing. Free users get 3 readings and 10 messages a day; members get 40 and 150.

## 4. Vercel
Project > Settings > Environment Variables:

| Name | Value |
|---|---|
| SUPABASE_URL | Supabase Project URL |
| SUPABASE_ANON_KEY | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service_role key |
| STRIPE_SECRET_KEY | Stripe secret key |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret |
| STRIPE_PRICE_MONTHLY | price ID for $6.99/month |
| STRIPE_PRICE_YEARLY | price ID for $49/year |
| ANTHROPIC_API_KEY | Anthropic API key |
| SITE_URL | https://dailyalchemist.com |
| ANTHROPIC_MODEL (optional) | defaults to claude-haiku-4-5-20251001 |
| VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY | from step 5 |
| CRON_SECRET | any long random string |
| SUPPORT_EMAIL | where people can reach you |
| ADMIN_EMAIL | your own email (the one you sign into the app with). Opens your dashboard and sends you alerts |
| ELEVENLABS_API_KEY | the guardians' voices (elevenlabs.io > Developers > API Keys) |
| RESEND_API_KEY (optional) | only if you also want alerts by email (resend.com, free tier) |

Then deploy this folder: replace the contents of the `daily-alchemist` GitHub repo with it (Vercel redeploys on push), or ask Claude to deploy it. Add dailyalchemist.com under Settings > Domains.

## 5. Messages from Aura (optional, but worth it)
1. Make keys once, in any terminal with Node: `npx web-push generate-vapid-keys`
2. Put the public key in `config.js` as `vapidPublicKey`, and in Vercel as `VAPID_PUBLIC_KEY`. Put the private key in Vercel as `VAPID_PRIVATE_KEY`. Never put the private key in `config.js`.
3. In Vercel, add `CRON_SECRET` (any long random string) and `SUPPORT_EMAIL`.
4. Aura's daily messages go out at 9 am Eastern all year. Vercel calls `/api/cron-reminders` at 13:00 and 14:00 UTC, and the job only sends on whichever call lands at 9 am Eastern, so it stays right through daylight saving changes. It sends only meaningful messages: promises due, things someone asked Aura to bring back, and dates that matter tomorrow. (Everyone gets 9 am Eastern for now, whatever their own time zone.)

## 6. The App Store and Google Play
The Daily Alchemist ships as a real app in both stores. People download it like any other app. Nobody has to add anything to a Home Screen.

What you need:
1. Apple Developer Program: $99 a year, at developer.apple.com. Enroll as an individual or as your business (a business needs a free D-U-N-S number, which takes a few days).
2. Google Play Console: $25 once, at play.google.com/console. New personal accounts must run a closed test with 12 testers for 14 days before going public.
3. A way to build the app files. Either a Mac with Xcode and Android Studio, or a cloud build service like Codemagic, which works from any computer.
4. The live site from steps 1 to 5 above, because the store app talks to it for accounts, payments and the guardians.

Claude can prepare the store project (the app wrapper, icons, splash screen, store listing text and privacy answers). You create the two developer accounts yourself, since they are in your name and take your payment.

About payments in the store apps: Apple and Google normally require their own in-app purchase for subscriptions and take 15% for small businesses. In the US, Apple currently allows a link out to your own Stripe checkout with no Apple fee, but that rule came from a court case and could change. Decide before you submit which one you want.

## 7. Friends week (November 1)
Your friends get everything, for life, free.
1. In Vercel, set `ADMIN_EMAIL` to your email. Redeploy.
2. **Invitations, one per friend.** Open your dashboard (`https://dailyalchemist.com/admin`), type a friend's name under Invitations, and tap "Create invitation link." Each link carries its own long random code, works once for one account, and expires after 30 days. Send each link only to the friend it's for. If one gets shared by mistake, tap Revoke.
3. A friend opens their link, meets Aura, confirms they're 18 or older, and makes an account with their email. Lifetime access turns on by itself.

**Adults only, enforced on the server.** The 18+ confirmation is saved to the account (`adult_confirmed_at`). Until it exists, the server refuses Aura and guardian replies, guardian voices, membership checkout and invitation links with `adult_confirmation_required`, and the app asks the person to confirm. A blocked invitation is not used up.
4. Aura then asks each friend, once, whether you can see **what they tap and when** for 7 days. Never what they write or say. It ends by itself after a week, and they can stop it any time in Settings. If they say no, nothing is recorded.
5. **Alerts:** sign into the app with your ADMIN_EMAIL, open Settings, and turn on "Let Aura reach me." You'll get a notification when someone signs up, when a friend uses their invitation, and when a friend says yes to sharing. (Add `RESEND_API_KEY` for email alerts too.)
6. **Your dashboard** shows your invitations, who joined, who said yes to sharing, who came back on day 2, each sharing friend's week of taps, and where rituals get left. It shows how they used Aura and the guardians, never what they wrote, said or told them. It also shows any feedback a friend chose to send you. You can download the taps as a spreadsheet file.

## Before you take real money
- Have someone review the Terms and Privacy text (in the app, under the Terms and Privacy links). It's a solid start, not legal advice.
- Add a support email to the Privacy text.

## Guardian music

Each guardian has a 90 second instrumental theme made with ElevenLabs Music (about 1,350 credits each, roughly 25,650 for all 19). Once the site is live, open **dailyalchemist.com/admin**, sign in, and press **Make all missing tracks** in the Music section. Listen to each one there and press **Remake** on any you don't like. The tracks are stored in Supabase Storage (public bucket `music`) and play for everyone: Aura's on the main pages, a guardian's on their page, rituals and chats. People can choose On, Softer or Off in Settings.

## Sign in by text message (Twilio)

1. Make an account at twilio.com and add a payment method. Twilio Verify costs about 6 cents per sign-in code in the US.
2. In Twilio, open **Verify > Services**, click **Create new**, name it "The Daily Alchemist", turn on **SMS**, and create it. Copy its **Service SID** (starts with VA).
3. From the Twilio console home, copy your **Account SID** (starts with AC) and **Auth Token**.
4. In Supabase: **Authentication > Sign In / Providers > Phone**. Turn Phone on, choose **Twilio Verify**, paste the Account SID, Auth Token and Verify Service SID, and save. These stay in Supabase; never put them in config.js.
5. Tell Claude (or set `phoneSignIn: true` in config.js). The app then asks for a mobile number first, with "Use email instead" underneath.


## Editing the app (source files)

The app's code lives in `src/`, one file per area:

- `src/js/` holds the app logic, one file per area (guardians, rituals, state, account, audio, Today, Circle, Archive, ritual mode, talk, settings, events). `src/js/ORDER.txt` is the order they're joined in.
- `src/styles.css` holds all the styles.
- `src/shell/` holds the page skeleton.

After editing, run `node build.mjs`. It writes `index.html`, `app.js` and `styles.css` for the live site, and `preview/daily-alchemist.html` for the Claude preview. Commit the built files with the source. `src/`, `preview/` and `build.mjs` aren't deployed (see `.vercelignore`).

## AI provider (optional)
The app works with no new settings (Anthropic, Haiku). To compare or switch later, add in Vercel:
- `AI_PROVIDER` = `anthropic` or `openai`
- `AI_FAST_MODEL`, `AI_DEEP_MODEL` (optional model names for the active provider)
- `OPENAI_API_KEY` (only if you want to try OpenAI)
The owner account can send `{compare:true}` to `/api/ai` to run one scenario through both and see text, tokens, speed and whether the JSON parsed.

## Voices
Guardian voices now use ElevenLabs `eleven_multilingual_v2` (more natural than flash). Override with `ELEVENLABS_MODEL` in Vercel.

## Weather
Works with no setup inside the US (National Weather Service). Location comes from the visitor's connection, or the phone if she turns on precise location in Settings; nothing is stored.
Outside the US, add Apple WeatherKit once the Apple developer account exists: in the Apple developer site make a WeatherKit key and a Services ID, then add to Vercel
`WEATHERKIT_TEAM_ID`, `WEATHERKIT_KEY_ID`, `WEATHERKIT_SERVICE_ID`, `WEATHERKIT_PRIVATE_KEY` (the .p8 file's contents).

## Spoken voice is off
Guardians no longer speak aloud (no hear buttons, no Guide me aloud, no eyes closed mode, no spoken ritual commands, no music ducking, no /api/voice for customers). Typing by voice with the mic still works.
The code stays behind `GUARDIAN_VOICE_ENABLED` in src/js/13-audio.js and the `GUARDIAN_VOICE_ENABLED=true` env var for /api/voice. The owner can try it on her own phone by setting localStorage `da.voiceDev` to `1`.

## Claude vs OpenAI comparison
/admin has a "Claude vs OpenAI" section. It needs `OPENAI_API_KEY` in Vercel. Defaults: Claude Haiku 4.5 vs GPT-5.6 Luna (fast), and the deep models for the hard moments. OpenAI uses the Responses API with low reasoning effort (`OPENAI_REASONING_EFFORT` to change).
The moments live in server/compare-scenarios.json and are rebuilt with tools/capture-scenarios.mjs whenever the app's prompts change.
