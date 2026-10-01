/* ------------------------------------------------------------------
   EVERY RITUAL HOLDS SOMETHING. Rituals that used to need "nothing but
   you" now each have one real object at the center: lit at the start,
   used in the middle, closed at the end. Always ordinary household
   things, with the usual substitutes if she doesn't have them.
   [tag, what she needs, opening step title, opening step, closing step title, closing step]
------------------------------------------------------------------ */
const RITUAL_OBJECTS={
 "rootprint":["salt","A pinch of salt","Salt the doorway","Sprinkle a small line of salt just inside your door. You'll sweep it out at the end.","Sweep it out","Brush the salt out the door with your hand or a broom. What you stomped off goes with it."],
 "unsent-letter":["candle","A candle, or any small light","Light it low","Light a candle and turn off the brighter lights. Shadow work goes easier by small light.","Blow it out","Blow the candle out over the folded paper. It stays in the dark now."],
 "four-count":["bowl","A bowl of water","Fill the bowl","Fill a bowl with cool water and set it where you can see it. Let your breath match how still it is.","Pour it out","Pour the water down the drain and watch it go. The tide went out. It will come back clearer."],
 "ledger":["candle","A candle","Light it","Light a candle before you write your three intentions. It burns while you plan.","Blow it out","Sign the page, then blow the candle out. The plan is real now."],
 "anchor":["stone","A smooth stone","Hold the stone","Hold a stone in your closed hand. You are as here as it is.","Set it down","Put the stone where you'll see it today. When you do, come back to this moment."],
 "first-light":["water","A glass of water","Water first","Pour a glass of water before you touch your phone. Hold it up to the window light.","Drink the light","Drink the water slowly. That's the first thing you take in today, not a screen."],
 "dawn-question":["jar","A jar or a cup with a lid","Fold it in","Write the question on a slip of paper, fold it and put it in a jar by your bed.","Open it","In the morning, open the jar and read the question once before you check anything else."],
 "morning-oath":["candle","A candle","Light it","Light a candle before the first page. It burns while you write.","Seal the oath","Say the oath, then blow the candle out. The day starts now."],
 "sun-hype":["oil","Body oil or lotion","Warm your hands","Rub a little oil or lotion between your palms until they're warm.","Press it in","Press your warm hands over your heart and your stomach. Carry that heat out the door."],
 "empty-chair":["candle","A candle","A light on the empty chair","Set a lit candle on the floor in front of the empty chair. The other you sits by that light.","Put it out","Blow out the candle when you move the chair back. The conversation is over, the answer stays."],
 "green-nap":["rosemary","A sprig of something green, or a tea bag","Something green near you","Set a sprig of rosemary, a leaf from a plant, or an open tea bag by your head. Breathe it in.","Keep it close","Put the green thing on your nightstand or desk. When you smell it later, your body will remember this rest."],
 "sign-log":["candle","A candle","Light it","Light a candle so the sign has somewhere to land while you write it down.","Blow it out","Close the log and blow out the candle. The answer you got first is the one to keep."],
 "ask-the-sky":["bowl","A bowl of water","Set the bowl outside","Set a bowl of water outside, or on a windowsill, and look into it before you ask.","Pour it at the roots","Pour the water onto a plant or into the ground. The sky's answer goes back to the earth."],
 "future-letter":["candle","A candle","Light the future","Light a candle before you write. You're writing to the woman who lives a year from this light.","Seal by flame","Seal the letter, then blow out the candle. Write the opening date on the envelope."],
 "vision-board":["thread","String or ribbon","Lay the thread","Lay a piece of string across your table. Everything you put on the board will be tied to it.","Tie it on","Tie the string to the corner of the board, or around a rolled page, with one knot for each star."],
 "ancestor-plate":["candle","A candle","Light it for them","Light a candle on the table before you cook. Someone is being remembered tonight.","Let it burn down a little","Let the candle burn while you eat. Blow it out only when the plates are cleared."],
 "heirloom-blessing":["oil","A drop of oil or lotion","Anoint it","Put one drop of oil on your fingertip and touch the object with it, the way people bless what matters.","Wrap it","Wrap the object in a cloth or set it somewhere special. It's carrying your chapter now."],
 "weekly-weave":["thread","Three pieces of thread or string","Three strands","Cut three pieces of string, one for each thread of your week.","Braid it","Braid the three strands together and knot the end. Keep it with your journal for the week ahead."],
 "four-winds":["candle","A candle","Light it","Light a candle in front of you. Each breath should make the flame bend, never blow it out.","Last breath","Turn back to face the flame and blow it out with one long exhale."],
 "boundary-script":["salt","A pinch of salt","Salt in your palm","Hold a pinch of salt in your palm while you write the line. Salt keeps what it's around.","Sprinkle it","Sprinkle the salt across your doorway or into a tissue in your bag. The line goes where you go."],
 "quarter-review":["candle","A candle","Light it","Light a candle before you look back at the last three months.","Blow it out","Once it's on the calendar, blow the candle out. The next quarter starts with a plan."],
 "ten-minute-muse":["candle","A candle","Light the studio","Light a candle and start the timer when the flame steadies. The flame is the only audience.","Blow it out","Blow out the candle when the timer goes off. That counts as making something."],
 "color-spell":["thread","A thread or ribbon in your color","Find the color","Find a thread, ribbon or scrap of fabric in the color you choose.","Tie it on","Tie it around your wrist or your bag strap. Wear the color until it wears off."],
 "unfinished-thing":["candle","A candle","A light beside it","Set a lit candle next to the unfinished thing. It deserves a little light again.","Blow it out","Leave your note, then blow out the candle. You'll light it again for the next tiny move."],
 "two-minute-settle":["stone","A stone, a coin, or anything heavy","Something heavy","Hold a stone or something heavy in your lap. Feel it pulling down.","Put it down","Set it down slowly. The heavy part can stay there."],
 "walk-it-off":["stone","A small stone","Pick up a stone","Before you go, put a small stone in your pocket. That's the thing you're walking off.","Leave it","Halfway back, set the stone down somewhere outside and keep walking without it."],
 "one-song-dance":["candle","A candle or a low lamp","Low light","Light a candle or turn on one low lamp and turn off the rest. Nobody's watching.","Blow it out","When the song ends, blow out the candle. Let the quiet land on you."],
 "root-and-rise":["salt","A pinch of salt","Salt the floor","Sprinkle a pinch of salt where your feet will be. You're rooting into it.","Sweep it up","Sweep the salt up with your hand and toss it outside. What you shook loose goes with it."],
 "movement-pact":["thread","A piece of string","Tie it on","Tie a piece of string loosely around your wrist before you write the pact.","Keep it on","Leave the string on until you've done the smallest version three times."],
 "yes-no-maybe":["candle","A candle","Light it between you","Light a candle and set it where you can both see it. It's the third one in the room.","Blow it out together","Blow the candle out together when you've picked one."],
 "sensate-focus":["candle","A candle","Light the pact","Light one candle before you begin. When it's lit, the agreement holds.","Out together","Blow it out together. That ends the giving and the receiving."],
 "breathe-together":["candle","A candle","One flame","Light one candle between you. Watch the flame move with your breath.","Watch it settle","Let the flame settle while you sit, then blow it out together."],
 "pelvic-power":["oil","Body oil or lotion","Warm the body","Rub a little warm oil or lotion on your belly and lower back before you start.","Press and rest","Rest with your warm hands low on your belly for three breaths."],
 "hip-opening":["oil","Body oil or lotion","Oil the hips","Rub warm oil or lotion into your hips and thighs. Tell them they're allowed to open.","Rest with it","Lie back for a minute with your hands on your hips."],
 "love-map":["candle","A candle","Light it between you","Light a candle on the table between you. Talk by its light.","Blow it out together","Plan the date, then blow it out together."],
 "first-move":["honey","A spoon of honey or something sweet","Taste something sweet","Put a little honey or something sweet on your tongue. You're allowed to want sweetness.","One more taste","After you take the small step, taste it again. That was brave."],
 "magnetic-hour":["oil","Your favorite oil, lotion or scent","Anoint yourself","Put a drop of oil or your favorite scent on your wrists and the base of your throat.","Breathe it in","Breathe in your wrist before you go out. That's your scent now."],
 "own-it":["bowl","A bowl of water","Bowl of water","Set a bowl of water beside you. You're cleaning something up, not punishing yourself.","Rinse your hands","After you name the repair, rinse your hands in the bowl and pour it away."],
 "push-hour":["candle","A candle","Light it","Light a candle and start the clock when the flame steadies. Push until it burns a little lower.","Blow it out","Blow out the candle and celebrate out loud. That was the push."],
 "promise-pact":["candle","A candle","Light it","Light a candle before you name the promise. Sol's here.","Out on the first ten minutes","Do the first ten minutes, then blow the candle out. It's started."],
 "sunday-reckoning":["candle","A candle","Light the reckoning","Light a candle before you look back at your week.","Blow it out","Write your three, then blow it out. The week ahead is set."],
 "heart-gate":["honey","A spoon of honey","Honey on the lips","Touch a little honey to your lips. Love starts sweet and stays honest.","Share it","Share something sweet with someone today, even a text."]
};
for(const [id,o] of Object.entries(RITUAL_OBJECTS)){
  const r=R.find(x=>x.id===id);if(!r||(r.needs&&r.needs.length))continue;
  r.needs=[[o[0],o[1]]];r.steps=[{t:o[2],d:o[3]},...r.steps,{t:o[4],d:o[5]}];
}
