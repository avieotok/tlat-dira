/* תלת־דירה: עבודה גם בלי אינטרנט. קודם מנסים את הרשת, ואם אין חיבור משתמשים בעותק השמור. */
const CACHE='tlat-dira-v2';
const CORE=['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{}));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=='GET')return;
  const sameOrigin=url.origin===location.origin,lib=/^https:\/\/(cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com)\//.test(req.url);
  if(!sameOrigin&&!lib)return;
  e.respondWith(fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})
    .catch(()=>caches.match(req).then(r=>r||(sameOrigin&&req.mode==='navigate'?caches.match('./index.html'):undefined))));
});
