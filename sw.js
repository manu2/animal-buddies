
const CACHE='animal-buddies-offline-v3';
const ROOT=new URL('./',self.location.href);
const CORE=['./','./index.html','./style.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./audio-list.json','./asset-list.json'];
async function allPaths(){
 const response=await fetch(new URL('asset-list.json',ROOT),{cache:'no-store',credentials:'same-origin'});
 if(!response.ok||!response.headers.get('content-type')?.includes('json'))throw Error('Cannot load offline inventory');
 const list=await response.json();
 if(!Array.isArray(list)||!list.every(p=>typeof p==='string'&&!p.includes('..')&&p.startsWith('./')))throw Error('Bad inventory');
 return [...new Set([...CORE,...list])];
}
async function fill(){
 const list=await allPaths();
 const cache=await caches.open(CACHE);
 // Each response must be the actual asset, never a sign-in redirect.
 for(let i=0;i<list.length;i+=5){
  await Promise.all(list.slice(i,i+5).map(async path=>{
   const url=new URL(path,ROOT);
   const response=await fetch(url,{cache:'reload',credentials:'same-origin'});
   if(!response.ok||response.redirected)throw Error('Offline asset unavailable: '+path);
   const type=response.headers.get('content-type')||'';
   if(path.endsWith('.m4a')&&!/audio|video|octet-stream/.test(type))throw Error('Invalid audio');
   if(path.endsWith('.svg')&&!type.includes('svg'))throw Error('Invalid image');
   if(path.endsWith('.js')&&!/javascript/.test(type))throw Error('Invalid script');
   if(path==='./'||path.endsWith('index.html')){
    if(!(await response.clone().text()).includes('animal-buddies-app'))throw Error('Invalid game page');
   }
   await cache.put(url,response);
  }));
 }
 await cache.put(new URL('offline-complete',ROOT),new Response(JSON.stringify(list),{headers:{'Content-Type':'application/json'}}));
}
async function verify(){
 const cache=await caches.open(CACHE),marker=await cache.match(new URL('offline-complete',ROOT));
 if(!marker)return false;
 try{const paths=await marker.json();for(const path of paths)if(!await cache.match(new URL(path,ROOT)))return false;return true;}catch{return false;}
}
self.addEventListener('install',event=>event.waitUntil(fill().then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await self.clients.claim();
 for(const client of await self.clients.matchAll())client.postMessage({type:'OFFLINE_READY'});
})()));
self.addEventListener('message',event=>{
 if(event.data?.type==='VERIFY_OFFLINE')event.waitUntil(verify().then(ready=>event.ports[0]?.postMessage({ready})));
 if(event.data?.type==='REPAIR_OFFLINE')event.waitUntil(fill().then(()=>event.ports[0]?.postMessage({ready:true})).catch(()=>event.ports[0]?.postMessage({ready:false})));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // Only the app entry uses the navigation fallback; never cache account pages.
  const isEntry=event.request.mode==='navigate'&&(url.pathname===ROOT.pathname||url.pathname===new URL('index.html',ROOT).pathname);
  let response=isEntry?await cache.match(ROOT):await cache.match(event.request,{ignoreSearch:false});
  if(response){
   // Media range support for browsers that request byte ranges.
   const range=event.request.headers.get('range');
   if(range&&url.pathname.endsWith('.m4a')){
    const data=await response.arrayBuffer(),match=/^bytes=(\d*)-(\d*)$/.exec(range);
    if(!match)return new Response(null,{status:416});
    const start=match[1]?Number(match[1]):Math.max(0,data.byteLength-Number(match[2]));
    const end=match[1]?(match[2]?Math.min(Number(match[2]),data.byteLength-1):data.byteLength-1):data.byteLength-1;
    if(start>end||start>=data.byteLength)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+data.byteLength}});
    return new Response(data.slice(start,end+1),{status:206,headers:{'Content-Type':'audio/mp4','Content-Range':'bytes '+start+'-'+end+'/'+data.byteLength,'Content-Length':String(end-start+1),'Accept-Ranges':'bytes'}});
   }
   return response;
  }
  return fetch(event.request);
 })());
});
