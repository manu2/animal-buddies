// Browser installation is optional and separate from game saves and visit policy.
export function createInstallUI({beforeOpen=()=>{}}={}) {
 const display=matchMedia('(display-mode: standalone)');
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const android=/Android/.test(navigator.userAgent);
 let deferred=null,installed=false,busy=false,dismissed=false,expanded=null,message='';
 const isInstalled=()=>installed||display.matches||navigator.standalone===true;
 function help(){
  const iphone='<p><b>On iPhone or iPad, open this link in Safari.</b></p><ol><li>Tap <b>Share</b> (the square with an up arrow). It may be inside the browser’s menu.</li><li>Choose <b>Add to Home Screen</b>. If missing, look under <b>Edit Actions</b>.</li><li>Leave <b>Open as Web App</b> on if shown, then tap <b>Add</b>.</li></ol>';
  const chrome='<p><b>On Android, open this link in Chrome.</b> Use the browser menu <b>⋮ → Add to Home screen</b> or <b>Install app</b>, then confirm.</p>';
  return (ios?iphone:android?chrome:iphone+chrome+'<p>On a computer, look for an install option in the address bar or browser menu.</p>')+'<p>Opened inside a messaging app? Open this link in your phone’s browser first.</p><p><b>After adding it:</b> open the new Animal Buddies icon while online and wait for “Ready for offline play”. Then it works without internet or a running computer.</p>';
 }
 function render(){
  for(const place of ['home','parent']){
   const host=document.getElementById('install-'+place);if(!host)continue;
   host.hidden=isInstalled()||(place==='home'&&dismissed);
   if(host.hidden){host.replaceChildren();continue;}
   const open=expanded===place;
   host.innerHTML='<div class="install-row"><div><strong>Keep Animal Buddies</strong><p class="small">Open it from your home screen.</p></div><button class="sound" data-install '+(busy?'disabled':'')+' aria-expanded="'+open+'" aria-controls="install-help-'+place+'">'+(busy?'Opening…':deferred?'Install app':'Add to Home Screen')+'</button></div>'+(place==='home'?'<button class="quiet install-dismiss" data-dismiss>Not now</button>':'')+'<div id="install-help-'+place+'" class="install-help" '+(!open?'hidden':'')+'>'+(open?'<p role="status">'+message+'</p>'+help()+'<button class="sound" data-close>Got it</button>':'')+'</div>';
   host.querySelector('[data-install]').onclick=()=>start(place);
   const close=host.querySelector('[data-close]');if(close)close.onclick=()=>{expanded=null;render();document.querySelector('#install-'+place+' [data-install]')?.focus();};
   const dismiss=host.querySelector('[data-dismiss]');if(dismiss)dismiss.onclick=()=>{dismissed=true;expanded=null;render();document.getElementById('library-listen')?.focus();};
  }
 }
 async function start(place){
  if(busy||isInstalled())return;
  beforeOpen();
  if(!deferred){expanded=expanded===place?null:place;message='';render();return;}
  const event=deferred;deferred=null;busy=true;render();
  try{
   // Call synchronously in the click's user activation; an event is usable once.
   await event.prompt();
   const result=await event.userChoice;
   message=result?.outcome==='accepted'?'Installation requested. Look for Animal Buddies on your home screen.':'No problem. You can keep playing here or add the app later using your browser menu.';
  }catch{message='The browser could not open installation. You can use its menu instead.';}
  finally{busy=false;expanded=place;render();}
 }
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();if(!isInstalled()){deferred=event;render();}});
 window.addEventListener('appinstalled',()=>{installed=true;deferred=null;expanded=null;render();});
 display.addEventListener?.('change',render);
 return {render};
}
