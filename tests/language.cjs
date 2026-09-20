
const {chromium}=require('./runtime.cjs');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{const c=await b.newContext({viewport:{width:360,height:740}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.route('**/app.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.appEval=code=>eval(code);'});});
const ev=fn=>p.evaluate(code=>window.appEval(code),'('+fn.toString()+')()');
await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');
await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});
assert.equal(await ev(()=>settings.instructionLanguage),'en');
await p.locator('#start').click();
async function parent(){await p.locator('#parent').click();const n=(await p.locator('label[for=answer]').textContent()).match(/\d+/g).map(Number);await p.locator('#answer').fill(String(n[0]+n[1]));await p.locator('#gate button').click();}
await parent();assert.equal(await p.locator('#instruction-language').inputValue(),'en');await p.locator('#instruction-language').selectOption('hi');await p.locator('#close-parent').click();
await c.setOffline(true);assert.equal(await ev(()=>settings.instructionLanguage),'hi');
const count=await ev(async()=>{const a=new AudioContext(),list=await(await fetch('./audio-list.json')).json();for(const n of list){const r=await fetch('./audio/'+n+'.m4a');if(!r.ok)throw Error(n);await a.decodeAudioData(await r.arrayBuffer());}await a.close();return list.length;});assert.ok(count>=197);
const timing=await ev(async()=>{
stopStory();stopAudio();await unlockAudio();const starts=[],ends=[],original=audioContext.createBufferSource.bind(audioContext);
audioContext.createBufferSource=()=>{const s=original(),start=s.start.bind(s);s.start=(...args)=>{starts.push(performance.now());return start(...args)};s.addEventListener('ended',()=>ends.push(performance.now()));return s;};
await play(['cow-name','forward-en']);audioContext.createBufferSource=original;return starts[1]-ends[0];});
assert.ok(timing>=1150,'Audio prompts must have a real pause: '+timing);
const queues=await ev(async()=>{
window.realPlay=play;window.calls=[];play=async clips=>{calls.push(clips)};
const result={};
for(const lang of ['en','hi']){settings.instructionLanguage=lang;for(const m of ['names','sentences','letters']){
mode=m;screen='game';phase='learn';correct=false;calls=[];await listen();result[m+'-'+lang]=calls.flat();
phase='pick';calls=[];await listen();result[m+'-pick-'+lang]=calls.flat();correct=true;calls=[];await listen();result[m+'-outcome-'+lang]=calls.flat();correct=false;
calls=[];hearMeaning();result[m+'-meaning-'+lang]=calls.flat();
}}
mode='actions';session.storyAction='eat';settings.instructionLanguage='hi';calls=[];await storyNarrate();result.story=calls.flat();calls=[];hearMeaning();result.meaning=calls.flat();
for(const lang of ['en','hi']){
 settings.instructionLanguage=lang;mode='school';screen='game';school.mission='help';
 school.step=1;calls=[];await narrateSchool();result['school-step1-'+lang]=calls.flat();
 school.step=2;calls=[];await hearMeaning();result['school-meaning-'+lang]=calls.flat();
 school.step=0;school.support='listen';calls=[];await narrateSchool();result['school-listen-'+lang]=calls.flat();
 school.support='explore';calls=[];await narrateSchool();result['school-explore-'+lang]=calls.flat();
}
for(const lang of ['en','hi']){
 settings.instructionLanguage=lang;mode='day';dispatchDay({type:'CHAPTER',node:'brush'});dispatchDay({type:'SUPPORT',support:'listen'});dayRuntime.render();calls=[];await dayRuntime.narrate();result['day-prompt-'+lang]=calls.flat();calls=[];document.querySelector('[data-day-choice=retry]').click();result['day-retry-'+lang]=calls.flat();
 dispatchDay({type:'ACT',choice:'brush'});dayRuntime.render();calls=[];await dayRuntime.narrate();result['day-model-'+lang]=calls.flat();calls=[];dayRuntime.meaning();result['day-meaning-'+lang]=calls.flat();
}
return result;});
assert.deepEqual(queues['names-en'],['cow-find']);assert.deepEqual(queues['names-hi'],['cow-hint']);
for(const m of ['names','sentences','letters']){assert.equal(queues[m+'-en'].length,m==='sentences'?2:1);assert.equal(queues[m+'-meaning-en'].length,1);}
assert.deepEqual(queues['letters-pick-hi'],['cow-letter-pick-hi']);for(const lang of ['en','hi']){assert.deepEqual(queues['names-outcome-'+lang],['cow-name']);assert.deepEqual(queues['sentences-outcome-'+lang],['cow-model']);assert.deepEqual(queues['letters-outcome-'+lang],['cow-letter-model']);}
for(const lang of ['en','hi']){
 assert.deepEqual(queues['school-step1-'+lang],['school-help-model-en','school-help-step1-'+lang]);
 assert.deepEqual(queues['school-meaning-'+lang],['school-help-model-hi']);
 assert.deepEqual(queues['school-listen-'+lang],['school-help-step0-'+lang]);
 assert.deepEqual(queues['school-explore-'+lang],['school-help-step0-'+lang,'school-help-example-'+lang]);
}
for(const lang of ['en','hi']){assert.deepEqual(queues['day-retry-'+lang],['day-brush-retry-'+lang]);assert.deepEqual(queues['day-prompt-'+lang],['day-brush-prompt-'+lang]);assert.deepEqual(queues['day-model-'+lang],['day-brush-model-en']);assert.deepEqual(queues['day-meaning-'+lang],['day-brush-model-hi']);}
assert.deepEqual(queues.story,['story-cow-eat-en','story-cow-question-hi']);assert.deepEqual(queues.meaning,['story-cow-eat-hi']);
await ev(()=>{play=realPlay;mode='actions';renderStory();});await p.locator('#listen').click();await p.waitForTimeout(2500);await p.locator('#hint').click();await p.waitForTimeout(3500);assert.equal(await ev(()=>audioBusy),false);
await p.screenshot({path:'/tmp/language-game.png',fullPage:true});
await p.reload();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')).settings.instructionLanguage),'hi');assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,offlineClips:count,pauseMs:Math.round(timing),checks:['English default','Hindi setting persists offline','static modes choose one instruction language','Hindi meaning only','story model English and selected question language','meaning interrupts pending question']}));}
finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
