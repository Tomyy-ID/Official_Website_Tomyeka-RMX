/*
  KONFIGURASI PUBLIK WEBSITE.
  Supabase anon key memang dipakai di browser; keamanan ditentukan oleh RLS.
  JANGAN pernah menaruh service_role key, password, atau token rahasia di file ini.
*/
window.APP_CONFIG = {
  SUPABASE_URL: "https://mgbosxgfqgfztascbksf.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_W5qMfEgbfNsVzb1MIeyWjA_LtEfopck",
  YOUTUBE_API_KEY: "AIzaSyBJT03o2pl_2wSE54mWpoITz8a1zHrKi3A"
};

window.isSupabaseConfigured = function () {
  const c = window.APP_CONFIG || {};
  return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY &&
    !c.SUPABASE_URL.startsWith("ISI_") && !c.SUPABASE_ANON_KEY.startsWith("ISI_"));
};

window.getSupabaseClient = function () {
  if (!window.isSupabaseConfigured() || !window.supabase?.createClient) return null;
  if (!window.__flmSupabase) {
    window.__flmSupabase = window.supabase.createClient(
      window.APP_CONFIG.SUPABASE_URL,
      window.APP_CONFIG.SUPABASE_ANON_KEY
    );
  }
  return window.__flmSupabase;
};
