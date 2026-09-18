
const $ = (id) => document.getElementById(id);
const ANIMALS = [
 {id:'cow',name:'Cow',hi:'गाय',letter:'C',sentence:'The cow eats grass.'},
 {id:'dog',name:'Dog',hi:'कुत्ता',letter:'D',sentence:'The dog can run.'},
 {id:'fish',name:'Fish',hi:'मछली',letter:'F',sentence:'The fish can swim.'},
 {id:'cat',name:'Cat',hi:'बिल्ली',letter:'C',sentence:'The cat says meow.'},
 {id:'duck',name:'Duck',hi:'बत्तख',letter:'D',sentence:'The duck says quack.'},
 {id:'rabbit',name:'Rabbit',hi:'खरगोश',letter:'R',sentence:'The rabbit can hop.'},
 {id:'elephant',name:'Elephant',hi:'हाथी',letter:'E',sentence:'The elephant has a trunk.'},
 {id:'lion',name:'Lion',hi:'शेर',letter:'L',sentence:'The lion can roar.'},
];
const GROUPS = [['cow','dog','fish'],['cat','duck','rabbit'],['elephant','lion','cow']];
const MODES = {actions:{title:'Animal stories',description:'Choose an action and talk together'},names:{title:'Find a friend',icon:'◎',description:'Listen & pick an animal'},sentences:{title:'Little sentences',icon:'“ ”',description:'Listen to what animals do'},letters:{title:'Letter play',icon:'Aa',description:'Match a starting letter'}};
const STORY_ANIMALS=['cow','dog','rabbit'];
const STORY_ACTIONS={walk:{column:0,label:'Walk',verb:'walking',hi:'चल'},eat:{column:1,label:'Eat',verb:'eating',hi:'खा'},sleep:{column:2,label:'Sleep',verb:'sleeping',hi:'सो'}};
const STORY_PAIRS=[['walk','eat'],['sleep','walk'],['eat','sleep'],['eat','sleep'],['walk','eat'],['sleep','walk']];
let storyFlow=0;
const storyAnimations=new Set();
const STORE='animal-buddies-v1';
let storageWorks=true;
function read(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}}
let saved=read();
let settings={minutes:5,group:0,instructionLanguage:'en',...saved.settings};
if(![3,5,7].includes(settings.minutes))settings.minutes=5;
if(![0,1,2].includes(settings.group))settings.group=0;
if(!['en','hi'].includes(settings.instructionLanguage))settings.instructionLanguage='en';
let mode=saved.curriculumVersion===3 && MODES[saved.mode]?saved.mode:'actions';
let session=saved.session;
if(session && (!Number.isFinite(session.deadline)||!Number.isInteger(session.round)||session.round<0||session.round>6||!Array.isArray(session.targets)||session.targets.length!==6||!session.targets.every(id=>ANIMALS.some(a=>a.id===id))||!['active','ended'].includes(session.status)))session=null;
let screen='home', phase='learn', hint=false, choiceOrder=[], wrong='', correct=false, offlineReady=false;
let audioContext, audioSource, audioGeneration=0, audioBusy=false;
const decoded=new Map();
let registration, installPrompt;
function localDay(time=Date.now()){
 const d=new Date(time);
 return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function resetForNewDay(){
 if(!session)return false;
 // Older versions saved only a deadline. Recover the visit's starting day.
 const day=session.day || localDay(session.deadline-settings.minutes*60000);
 if(localDay()<=day)return false;
 stopStory();stopAudio();session=null;persist();
 const dialog=$('grownup-dialog');if(dialog){dialog.close();dialog.remove();}
 return true;
}
function persist(){try{localStorage.setItem(STORE,JSON.stringify({settings,mode,session,curriculumVersion:3}));}catch{storageWorks=false;}}
function animal(id){return ANIMALS.find(a=>a.id===id);}
function target(){return animal(session.targets[session.round]);}
function picture(a,klass=''){return '<img class="animal '+klass+'" src="./animals/'+a.id+'.svg" alt="'+a.name+'" draggable="false">';}
function stopAudio(){audioGeneration++;if(audioSource){try{audioSource.stop()}catch{}audioSource=null;}audioBusy=false;}
async function unlockAudio(){try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state!=='running')await audioContext.resume();}catch{showAudioError();}}
function showAudioError(){const el=$('audio-note');if(el)el.textContent='Sound unavailable. Tap Listen to retry, or read together.';}
async function play(clips){
 stopAudio();const run=audioGeneration;audioBusy=true;
 try{
  await unlockAudio();if(!audioContext||audioContext.state!=='running')throw Error('sound locked');
  for(const [index,clip] of clips.entries()){
   if(index)await new Promise(resolve=>setTimeout(resolve,1200));
   if(run!==audioGeneration)break;
   let buffer=decoded.get(clip);
   if(!buffer){const response=await fetch('./audio/'+clip+'.m4a');if(!response.ok)throw Error('Missing sound');buffer=await audioContext.decodeAudioData(await response.arrayBuffer());decoded.set(clip,buffer);}
   if(run!==audioGeneration)break;
   await new Promise(resolve=>{const source=audioContext.createBufferSource();source.buffer=buffer;source.connect(audioContext.destination);source.onended=resolve;audioSource=source;source.start();});
  }
 }catch{if(run===audioGeneration)showAudioError();}
 finally{if(run===audioGeneration)audioBusy=false;}
}
function instruction(clip){return clip+'-'+settings.instructionLanguage;}
function modeAudio(a){
 if(mode==='letters')return [a.id+'-letter-pick-'+settings.instructionLanguage];
 return [a.id+(settings.instructionLanguage==='hi'?'-hint':'-find')];
}
function lessonAudio(a){
 return [a.id+(mode==='letters'?'-letter-model':mode==='sentences'?'-model':'-name')];
}
function rewardAudio(a){return [instruction('yes'),a.id+'-name',instruction('forward')];}
function hearMeaning(){
 stopStory();
 const a=target();
 if(mode==='actions')return session.storyAction?play(['story-'+a.id+'-'+session.storyAction+'-hi']):play([a.id+'-hi']);
 return play([a.id+(mode==='sentences'?'-model-hi':'-hi')]);
}
function listen(){
 if(screen==='done')return play([instruction(mode==='actions'?'story-goodbye':'goodbye')]);
 if(screen==='game'&&mode==='actions')return storyNarrate();
 if(screen!=='game')return play([instruction('welcome')]);
 const a=target();
 if(phase==='learn')return play([...lessonAudio(a),instruction('forward')]);
 if(correct)return play(rewardAudio(a));
 return play(modeAudio(a));
}
function shuffle(xs){const x=[...xs];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function home(){
 stopStory();stopAudio();screen='home';
 $('main').innerHTML='<section class="welcome '+(mode==='actions'?'story-home':'')+'"><p class="eyebrow">A SMALL ADVENTURE TOGETHER</p><h1>Hello, little explorer!</h1><p class="hindi" lang="hi">चलो, जानवरों से दोस्ती करें!</p><div class="friends">'+visibleFriends().map(id=>'<div class="friend">'+(mode==='actions'?storySprite(id,'walk'):picture(animal(id)))+'<span>'+animal(id).name+'</span></div>').join('')+'</div><button class="primary" id="start"><span class="play-symbol" aria-hidden="true">▶</span><span class="play-label">Let’s play</span></button><p class="session-note">'+settings.minutes+' minutes at most · 6 little turns · Hindi help</p><p id="audio-note" class="audio-note" role="status"></p></section>';
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;persist();home();});
 $('start').onclick=start;
}
async function start(){
 await unlockAudio();
 resetForNewDay();
 // An unfinished session keeps its original deadline across reloads.
 if(session?.status==='ended')return finish(false);
 if(!session){const ids=visibleFriends();session={day:localDay(),storyPairs:STORY_PAIRS.map(shuffle),status:'active',round:0,targets:[...ids,...ids],deadline:Date.now()+settings.minutes*60000,mode};persist();}
 mode=MODES[session.mode]?session.mode:mode;
 if(expired())return finish();
 screen='game';phase='learn';hint=false;correct=false;renderGame();listen();
}
function expired(){return session?.status==='active' && (Date.now()>=session.deadline||session.round>=6);}
function prepareChoices(){
 const a=target();
 if(mode==='letters'){const alternatives=['C','D','F','R','E','L'].filter(x=>x!==a.letter);choiceOrder=shuffle([a.letter,alternatives[Math.floor(Math.random()*alternatives.length)]]);}
 else{const candidates=GROUPS[settings.group].filter(id=>id!==a.id);choiceOrder=shuffle([a.id,candidates[Math.floor(Math.random()*candidates.length)]]);}
}
function check(){if(expired())return finish();phase='pick';hint=false;wrong='';correct=false;prepareChoices();renderGame();listen();}
function choose(value){
 if(expired())return finish();
 if(correct)return;
 const a=target(),answer=mode==='letters'?a.letter:a.id;
 if(value===answer){correct=true;wrong='';renderGame();play(rewardAudio(a));}
 else{wrong=value;hint=true;renderGame();play([instruction('try'),...modeAudio(a)]);}
}
function next(){
 if(mode==='actions')return nextStory();
 if(expired())return finish();
 if(!correct)return;
 stopAudio();session.round++;persist();
 if(session.round>=6)return finish();
 phase='learn';hint=false;wrong='';correct=false;renderGame();listen();
}
function renderGame(){
 if(mode==='actions')return renderStory();
 screen='game';const a=target();
 const prompt=mode==='letters'?'Find '+a.letter:mode==='sentences'?a.sentence:'Where is the '+a.name.toLowerCase()+'?';
 const dots=Array.from({length:6},(_,i)=>'<span class="step '+(i<session.round?'complete':i===session.round?'current':'')+'"></span>').join('');
 $('main').innerHTML='<section class="game"><div class="game-top"><button class="quiet" id="stop">Finish for now</button><div class="steps" aria-label="Turn '+(session.round+1)+' of 6">'+dots+'</div><span class="time-note" id="time-note"></span></div><p class="eyebrow">'+(phase==='learn'?'MEET A FRIEND':correct?'HELLO, FRIEND!':'LISTEN & CHOOSE')+'</p><h1 class="question">'+(phase==='learn'?(mode==='letters'?a.letter+' is for '+a.name:a.name):correct?'You found '+(a.id==='elephant'?'an ':'a ')+a.name.toLowerCase()+'!':prompt)+'</h1>'+
 (phase==='learn'?'<div class="learn-card">'+(mode==='letters'?'<span class="big-letter">'+a.letter+'<small>'+a.letter.toLowerCase()+'</small></span>':'')+picture(a)+'<p class="animal-name">'+(mode==='letters'?a.name:'<b>'+a.name[0]+'</b>'+a.name.slice(1))+'</p><p class="hindi" lang="hi">'+a.hi+'</p>'+(mode==='sentences'?'<p class="sentence">'+a.sentence+'</p>':'')+'</div>':
 '<div class="choices '+(mode==='letters'?'letter-choices':'')+'">'+choiceOrder.map(value=>'<button class="choice '+(correct&&(mode==='letters'?value===a.letter:value===a.id)?'found':'')+' '+(wrong===value?'try-again':'')+'" data-choice="'+value+'" aria-label="'+(mode==='letters'?'Letter '+value:animal(value).name)+'" '+(correct?'disabled':'')+'>'+(mode==='letters'?'<span class="letter">'+value+'</span>':picture(animal(value)))+(correct&&(mode==='letters'?value===a.letter:value===a.id)?'<span class="found-label">✓ '+a.name+'</span>':'')+'</button>').join('')+'</div>')+
 '<div class="feedback" aria-live="polite">'+(correct?'<p>'+a.sentence+'</p><p class="hindi" lang="hi">'+a.hi+'</p>':wrong?'<p>Let’s look again. You can try another.</p>':phase==='pick'?'<p>'+(mode==='sentences'?'Find the '+a.name.toLowerCase()+'.':'Tap a picture'+(mode==='letters'?' of the letter.':'.'))+'</p>':'')+'</div>'+
 '<div class="sound-controls"><button class="sound" id="listen"><span class="speaker-icon" aria-hidden="true">🔊</span><span>Listen</span></button><button class="sound hindi-help" id="hint" lang="hi" aria-label="Hear Hindi meaning only"><span aria-hidden="true">🗣️</span> अर्थ</button></div><p class="audio-note" id="audio-note" role="status"></p>'+
 (phase==='learn'?'<button class="primary" id="choose"><span class="big-arrow" aria-hidden="true">→</span><span class="play-label">Find our friend</span></button>':correct?'<button class="primary" id="next"><span class="big-arrow" aria-hidden="true">→</span><span class="play-label">'+(session.round===5?'Say goodbye':'Next friend')+'</span></button>':'')+'</section>';
 $('stop').onclick=()=>finish();$('listen').onclick=listen;
 if($('hint'))$('hint').onclick=hearMeaning;
 if($('choose'))$('choose').onclick=check;
 if($('next'))$('next').onclick=next;
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>choose(b.dataset.choice));
 updateTime();
}
function updateTime(){
 if($('time-note')&&session)$('time-note').textContent=Math.ceil(Math.max(0,session.deadline-Date.now())/60000)+' min left';
}
function finish(speak=true){
 stopStory();stopAudio();if(session){session.status='ended';persist();}
 screen='done';
 $('main').innerHTML='<section class="welcome goodbye"><p class="eyebrow">ALL DONE FOR TODAY</p><h1>See you, animal friends.</h1><div class="friends">'+visibleFriends().map(id=>'<div class="friend">'+(mode==='actions'?storySprite(id,'walk'):picture(animal(id)))+'</div>').join('')+'</div><p class="hindi" lang="hi">अब फोन रखकर साथ खेलें।</p><p class="offline-activity">Can you pretend to walk,<br>eat, or sleep?</p><button class="sound" id="listen"><span aria-hidden="true">🔊</span> Listen</button><p id="audio-note" class="audio-note" role="status"></p><p class="session-note">A fresh visit unlocks tomorrow. A grown-up can restart now.</p></section>';
 $('listen').onclick=listen;if(speak)listen();
}
function tick(){if(resetForNewDay()){home();return;}if(expired())finish();else updateTime();}
setInterval(tick,500);
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopStory();stopAudio();}else tick();});
window.addEventListener('pageshow',tick);
$('parent').onclick=parentGate;
document.querySelector('.brand').onclick=e=>{e.preventDefault();if(session?.status==='active')return;session?.status==='ended'?finish(false):home();};
function parentGate(){
 stopStory();stopAudio();
 const existing=$('grownup-dialog');if(existing)existing.remove();
 const dialog=document.createElement('dialog');dialog.id='grownup-dialog';
 const x=8+Math.floor(Math.random()*5),y=6+Math.floor(Math.random()*5);
 dialog.innerHTML='<div class="dialog-top"><h2>For grown-ups</h2><button class="quiet" id="close-parent" aria-label="Close grown-up settings">Close</button></div><form id="gate"><p>To open the grown-up controls, enter the answer.</p><label for="answer">'+x+' + '+y+' =</label><input id="answer" inputmode="numeric" autocomplete="off" required aria-describedby="gate-error"><p id="gate-error" role="status"></p><button class="primary" type="submit">Continue</button></form>';
 document.body.append(dialog);dialog.showModal();$('close-parent').onclick=()=>dialog.close();
 $('gate').onsubmit=e=>{e.preventDefault();if($('answer').value.trim()!==String(x+y)){$('gate-error').textContent='Please try again.';return;}parentSettings(dialog);};
}
function parentSettings(dialog){
 const active=session?.status==='active';
 dialog.innerHTML='<div class="dialog-top"><h2>A little guide</h2><button class="quiet" id="close-parent">Close</button></div><p>Try <b>Animal stories</b>: he chooses between two action pictures, then hears a short sentence. Both choices work. Pause and talk together: if he says “eat”, you can model “The cow is eating.” Hindi is welcome; repeating is optional.</p><div class="setting-row"><label for="activity">Activity</label><select id="activity" '+(active?'disabled':'')+'>'+Object.entries(MODES).map(([key,m])=>'<option value="'+key+'" '+(mode===key?'selected':'')+'>'+m.title+'</option>').join('')+'</select></div><div class="setting-row"><label for="instruction-language">Spoken instructions</label><select id="instruction-language"><option value="en" '+(settings.instructionLanguage==='en'?'selected':'')+'>English</option><option value="hi" '+(settings.instructionLanguage==='hi'?'selected':'')+'>हिन्दी</option></select></div><p class="small">Instructions use one language only. Learning words and model sentences stay in English. Tap अर्थ for a Hindi meaning, without an English replay. Pauses give you time to listen.</p><div class="setting-row"><label for="minutes">Session limit</label><select id="minutes" '+(active?'disabled':'')+'>'+[3,5,7].map(n=>'<option value="'+n+'" '+(settings.minutes===n?'selected':'')+'>'+n+' minutes</option>').join('')+'</select></div><div class="setting-row"><label for="group">Animal friends</label><select id="group" '+(active||mode==='actions'?'disabled':'')+'>'+(mode==='actions'?'<option selected>Cow, Dog, Rabbit</option>':'')+GROUPS.map((g,i)=>'<option value="'+i+'" '+(mode!=='actions'&&settings.group===i?'selected':'')+'>'+g.map(id=>animal(id).name).join(', ')+'</option>').join('')+'</select></div><p class="small">Each visit ends after 6 turns or the time limit. The timer includes time away from the app. A fresh visit unlocks each new day using this phone’s local date. '+(active?'Finish this visit to change its settings.':'')+'</p><button class="primary compact" id="new-visit">Restart visit now</button><p class="small">Testing? Restart immediately, or simulate a new day below. Neither changes your phone’s clock or language settings.</p><button class="sound" id="test-next-day" '+(!session?'disabled':'')+'>Test next-day reset</button><hr><h3>Save to your phone</h3><p><b>iPhone:</b> Open in Safari → Share → Add to Home Screen → Add.</p><p><b>Android:</b> Open in Chrome → menu → Install app or Add to Home screen.</p><button class="sound" id="install-app" '+(!installPrompt?'hidden':'')+'>Install Animal Buddies</button><p><b>Open from the new home-screen icon while online.</b> Wait for “Ready for offline play”, then try airplane mode. No computer or running server is needed.</p><button class="sound" id="save-offline">Check offline download</button><p id="download-detail" role="status">'+(offlineReady?'Ready for offline play.':'Preparing offline files…')+'</p><p class="small">If you clear website data, remove the app, or the phone clears its storage, reconnect once to download again. No sign-in is needed. Browser storage keeps settings on this phone only.</p><hr><h3>Why this game?</h3><p>At 3–4, familiar words, simple sentences, playful listening, and noticing a few letters are useful goals. Whole-word spelling is not required here. Keep speaking Hindi together; it supports language learning.</p><p class="small">The five-minute limit is our design choice, not a developmental prescription. Play together when possible. No ads, scores, streaks, background music, or microphone recording.</p><p class="small">Sources: <a href="https://headstart.gov/school-readiness/article/literacy-preschool" target="_blank" rel="noopener">Head Start literacy guidance</a> · <a href="https://www.healthychildren.org/English/ages-stages/gradeschool/school/Pages/7-Myths-Facts-Bilingual-Children-Learning-Language.aspx" target="_blank" rel="noopener">AAP multilingual guidance</a> · <a href="https://www.cdc.gov/act-early/milestones/3-years.html" target="_blank" rel="noopener">CDC age-three milestones</a></p><p class="small">Action illustrations generated for this game. Other animal illustrations: <a href="https://openmoji.org/" target="_blank" rel="noopener">OpenMoji</a>, CC BY-SA 4.0. Recorded synthetic voices. Hindi meanings use familiar everyday animal names.</p>'+(!storageWorks?'<p>Settings could not be saved by this browser. Session limits may reset when you close the app.</p>':'');
 $('close-parent').onclick=()=>dialog.close();
 $('activity').onchange=e=>{mode=e.target.value;persist();parentSettings(dialog);};
 $('instruction-language').onchange=e=>{stopStory();stopAudio();settings.instructionLanguage=e.target.value;persist();};
 $('minutes').onchange=e=>{settings.minutes=Number(e.target.value);persist();};
 $('group').onchange=e=>{settings.group=Number(e.target.value);persist();};
 $('new-visit').onclick=()=>{stopStory();stopAudio();session=null;persist();dialog.close();home();};
 $('test-next-day').onclick=()=>{
  if(!session)return;
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  session.day=localDay(yesterday.getTime());persist();tick();
 };
 $('save-offline').onclick=async()=>{await navigator.storage?.persist?.().catch(()=>false);await prepareOffline(true);};
 $('install-app').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null;$('install-app').hidden=true;}};
 dialog.onclose=()=>{if(screen==='home')home();};
}
function offlineStatus(message,ready=false){
 offlineReady=ready;$('offline-status').textContent=message;
 if($('download-detail'))$('download-detail').textContent=message;
}
async function checkOffline(){
 const controller=navigator.serviceWorker.controller;
 if(!controller)return false;
 return new Promise(resolve=>{
  const ch=new MessageChannel();const timeout=setTimeout(()=>resolve(false),15000);
  ch.port1.onmessage=e=>{clearTimeout(timeout);resolve(e.data?.ready===true);};
  controller.postMessage({type:'VERIFY_OFFLINE'},[ch.port2]);
 });
}
async function prepareOffline(retry=false){
 if(!('serviceWorker' in navigator)||!window.isSecureContext){offlineStatus('Offline setup needs Safari or Chrome over a secure connection.');return;}
 offlineStatus('Saving pictures & voices for offline play…');
 try{
  registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
  if(retry)await registration.update();
  await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('Download taking too long')),45000))]);
  if(!navigator.serviceWorker.controller)await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Not controlled')),8000);navigator.serviceWorker.addEventListener('controllerchange',()=>{clearTimeout(timer);resolve();},{once:true});});
  let ready=await checkOffline();
  if(!ready&&retry){const channel=new MessageChannel();await new Promise(resolve=>{const timer=setTimeout(resolve,45000);channel.port1.onmessage=()=>{clearTimeout(timer);resolve();};navigator.serviceWorker.controller.postMessage({type:'REPAIR_OFFLINE'},[channel.port2]);});ready=await checkOffline();}
  offlineStatus(ready?'✓ Ready for offline play':'Download incomplete. Reconnect and use For grown-ups → Check offline download.',ready);
 }catch{offlineStatus('Offline download not ready. Reconnect and check again in For grown-ups.');}
}
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;});
window.addEventListener('online',()=>{if(!offlineReady)prepareOffline();});
navigator.serviceWorker?.addEventListener('message',e=>{if(e.data?.type==='OFFLINE_READY')checkOffline().then(ready=>{if(ready)offlineStatus('✓ Ready for offline play',true);});});
resetForNewDay();
if(session?.status==='ended')finish(false);else if(session?.status==='active'){mode=MODES[session.mode]?session.mode:mode;if(expired())finish(false);else{screen='game';phase='learn';renderGame();}}else home();
prepareOffline();
if(document.modelContext?.registerTool){
 try{Promise.resolve(document.modelContext.registerTool({name:'get_animal_game_status',description:'Read the current activity, session and offline readiness. Does not start play or change parental controls.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute(input){if(!input||typeof input!=='object'||Object.keys(input).length)throw Error('No inputs expected');return {activity:mode,screen,sessionStatus:session?.status||'not-started',turn:session?Math.min(session.round+1,6):null,offlineReady};}})).catch(()=>{});}catch{}
}

// Action play is choice-led: both pictures are valid, with no speech assessment.
function visibleFriends(){return mode==='actions'?STORY_ANIMALS:GROUPS[settings.group];}
function storyChoices(){return session.storyPairs?.[session.round] || STORY_PAIRS[session.round];}
function stopStory(){
 storyFlow++;
 for(const animation of storyAnimations)animation.cancel();
 storyAnimations.clear();
 document.querySelectorAll('.action-tile').forEach(el=>el.classList.remove('demonstrating'));
}
function storySprite(id,action,extra=''){
 const spec=STORY_ACTIONS[action];
 return '<span class="action-sprite '+extra+'" role="img" aria-label="'+animal(id).name+' '+spec.verb+'" data-action="'+action+'" style="--sheet:url(./stories/'+id+'.png);--column:'+spec.column+'"></span>';
}
function storySentence(id,action){return 'The '+id+' is '+STORY_ACTIONS[action].verb+'.';}
function storyHindi(id,action){return animal(id).hi+' '+STORY_ACTIONS[action].hi+' '+(id==='cow'?'रही':'रहा')+' है।';}
function animateStory(sprite){
 if(!sprite || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return Promise.resolve();
 const x=STORY_ACTIONS[sprite.dataset.action].column*50;
 const keyframes=[0,1,0,1,0].map((row,i)=>({backgroundPosition:x+'% '+row*100+'%',offset:i/4}));
 const animation=sprite.animate(keyframes,{duration:2200,easing:'steps(1,end)',iterations:1});
 storyAnimations.add(animation);
 return animation.finished.catch(()=>{}).finally(()=>storyAnimations.delete(animation));
}
async function storyNarrate(){
 if(screen!=='game'||mode!=='actions'||session?.status!=='active')return;
 stopStory();stopAudio();
 const run=storyFlow,id=target().id,chosen=session.storyAction;
 const valid=()=>run===storyFlow&&screen==='game'&&session?.status==='active'&&!document.hidden;
 if(chosen){
  const clips=['story-'+id+'-'+chosen+'-en'];
  await Promise.all([play(clips),animateStory(document.querySelector('.story-stage .action-sprite'))]);
  if(!valid())return;
  await new Promise(resolve=>setTimeout(resolve,1800));
  if(!valid())return;
  await play([instruction('story-'+id+'-question')]);
  if(!valid())return;
  // Quiet time is an invitation to talk, never a listening/recording state.
  const invite=$('talk-invitation');
  if(invite)invite.dataset.ready='true';
 }else{
  await play([instruction('story-'+id+'-choose')]);
  await new Promise(resolve=>setTimeout(resolve,1200));
  if(!valid())return;
  for(const action of storyChoices()){
   const tile=document.querySelector('[data-story-choice="'+action+'"]');
   tile?.classList.add('demonstrating');
   const clips=['story-'+action+'-en'];
   await Promise.all([play(clips),animateStory(tile?.querySelector('.action-sprite'))]);
   tile?.classList.remove('demonstrating');
   if(!valid())return;
   await new Promise(resolve=>setTimeout(resolve,1200));
   if(!valid())return;
  }
  await play([instruction('story-choose')]);
 }
}
function chooseStory(action){
 if(expired())return finish();
 if(session?.status!=='active'||session.storyAction||!storyChoices().includes(action))return;
 stopStory();stopAudio();
 session.storyAction=action;persist();renderStory();storyNarrate();
}
function nextStory(){
 if(expired())return finish();
 if(!session?.storyAction)return;
 stopStory();stopAudio();
 session.round++;delete session.storyAction;persist();
 if(session.round>=6)return finish();
 hint=false;renderStory();storyNarrate();
}
function renderStory(){
 screen='game';const a=target(),selected=session.storyAction;
 const dots=Array.from({length:6},(_,i)=>'<span class="step '+(i<session.round?'complete':i===session.round?'current':'')+'"></span>').join('');
 $('main').innerHTML='<section class="game story-game"><div class="game-top"><button class="quiet" id="stop">Finish for now</button><div class="steps" aria-label="Turn '+(session.round+1)+' of 6">'+dots+'</div><span class="time-note" id="time-note"></span></div><p class="eyebrow">'+(selected?'YOU CHOSE THE STORY':'CHOOSE WHAT HAPPENS')+'</p><h1 class="question">'+(selected?storySentence(a.id,selected):'What shall the '+a.id+' do?')+'</h1>'+
 (selected?'<div class="story-stage">'+storySprite(a.id,selected)+'<span class="stage-line" aria-hidden="true"></span></div><div class="talk-invitation" id="talk-invitation"><span class="talk-symbol" aria-hidden="true">💬</span><span>What is the '+a.id+' doing?</span></div><p class="parent-prompt">Together: “'+STORY_ACTIONS[selected].verb[0].toUpperCase()+STORY_ACTIONS[selected].verb.slice(1)+'.” → “'+storySentence(a.id,selected)+'”</p>':
 '<div class="story-choices">'+storyChoices().map(action=>'<button class="action-tile" data-story-choice="'+action+'" aria-label="Let the '+a.id+' '+action+'">'+storySprite(a.id,action)+'<span class="action-label">'+STORY_ACTIONS[action].label+'</span></button>').join('')+'</div><p class="choice-note">Two choices. Your little story.</p>')+
 '<div class="sound-controls"><button class="sound" id="listen" aria-label="'+(selected?'Watch and hear the sentence again':'Hear and watch both choices')+'"><span class="speaker-icon" aria-hidden="true">🔊</span><span>'+(selected?'Again':'Listen')+'</span></button><button class="sound hindi-help" id="hint" lang="hi" aria-label="Hear Hindi meaning only"><span aria-hidden="true">🗣️</span> अर्थ</button></div><p class="audio-note" id="audio-note" role="status"></p>'+
 (selected?'<button class="primary" id="next"><span class="big-arrow" aria-hidden="true">→</span><span class="play-label">'+(session.round===5?'Say goodbye':'Next friend')+'</span></button>':'')+'</section>';
 $('stop').onclick=()=>finish();
 $('listen').onclick=()=>storyNarrate();
 $('hint').onclick=hearMeaning;
 document.querySelectorAll('[data-story-choice]').forEach(button=>button.onclick=()=>chooseStory(button.dataset.storyChoice));
 if($('next'))$('next').onclick=nextStory;
 updateTime();
}
