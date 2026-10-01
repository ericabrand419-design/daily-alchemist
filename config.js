// Public settings (safe to publish). Fill these in from SETUP.md.
window.DA_CONFIG = {
  phoneSignIn: false, // true once Twilio texting is connected in Supabase (see SETUP.md)
  guardianVoiceEnabled: false, // spoken guardian/ritual voices are parked for now; mic dictation is separate
  supabaseUrl: "https://binpldnaxhbmikjhlwhp.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbnBsZG5heGhibWlramhsd2hwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3Njg3NjUsImV4cCI6MjEwNjM0NDc2NX0.UUtZXMyjQxM865BQofCMSVfl4xhnQGvl4YN6GIwj8NU",
  vapidPublicKey: "BBJb2k2UXrIK2CH9_XPJ6CW__hXQmMTQeBl92gwX1rzFTnYwKEG048PAnP-1_tLhTTx7I4t-rnzEmPsKy-j_ATU",
  // While you test with a small group, Aura asks each person once, on day 2, what they think.
  // Set to false when you launch publicly.
  askFeedback: true,
  // Your first name, used when Aura asks friends to share their taps with you.
  ownerName: "Erica"
};
