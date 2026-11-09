/* FLM public data + YouTube view helpers */
(function(){
  const fallback = () => (window.LEGACY_PROJECTS || []).filter(p => p.published !== false);
  window.loadFlmProjects = async function(){
    const client = window.getSupabaseClient?.();
    if (!client) return fallback();
    try {
      const { data, error } = await client.from('projects').select('*').eq('published', true).order('sort_order', {ascending:true});
      if (error) throw error;
      return (data || []).map((p,i)=>({...p, no:p.no || i+1, link:p.safelink_url || p.link || ''}));
    } catch(err) {
      console.warn('Supabase project load failed; using local fallback.', err);
      return fallback();
    }
  };
  const viewCache = window.__flmViewCache || (window.__flmViewCache = {});
  window.getFlmViews = async function(videoId){
    if (!videoId) return 0;
    if (Object.prototype.hasOwnProperty.call(viewCache, videoId)) return viewCache[videoId];
    const key = window.APP_CONFIG?.YOUTUBE_API_KEY || '';
    if (!key || key.startsWith('ISI_')) return null;
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/videos');
      url.search = new URLSearchParams({id:videoId, part:'statistics', key});
      const response = await fetch(url);
      if (!response.ok) throw new Error('YouTube API HTTP '+response.status);
      const result = await response.json();
      if (!result.items?.length) return 0;
      const views = Number(result.items[0].statistics.viewCount || 0);
      viewCache[videoId] = views;
      return views;
    } catch(err) {
      console.warn('YouTube views unavailable:', err);
      return null;
    }
  };
  window.escapeFlmHtml = function(value){
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  };
})();
