const {chromium}=require('./runtime.cjs');
const {execFileSync}=require('child_process'),fs=require('fs'),http=require('http'),assert=require('assert/strict');
const root=require('path').resolve(__dirname,'..');
const old={};
for(const f of ['app.js','sw.js','index.html'])old[f]=execFileSync('git',['show','31601a9:'+f],{cwd:root});
const v10={};
for(const f of execFileSync('git',['ls-tree','-r','--name-only','5513061'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(f=>/\.(js|json|html|css)$/.test(f)&&!f.startsWith('tests/')&&!f.startsWith('docs/')))v10[f]=execFileSync('git',['show','5513061:'+f],{cwd:root});
const v11={};
for(const f of Object.keys(v10))try{v11[f]=execFileSync('git',['show','680f297:'+f],{cwd:root,stdio:['pipe','pipe','ignore']});}catch{}
const v12={};
for(const f of execFileSync('git',['ls-tree','-r','--name-only','fc0df1f'],{cwd:root,encoding:'utf8'}).trim().split('\n').filter(f=>/\.(js|json|html|css)$/.test(f)&&!f.startsWith('tests/')&&!f.startsWith('docs/')))v12[f]=execFileSync('git',['show','fc0df1f:'+f],{cwd:root});
const v13={};
for(const f of Object.keys(v12))try{v13[f]=execFileSync('git',['show','7476872:'+f],{cwd:root,stdio:['pipe','pipe','ignore']});}catch{}
let modern=false,revision=0,baseline=old;
const server=http.createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
 const type=path.endsWith('.js')?'application/javascript':path.endsWith('.json')||path.endsWith('.webmanifest')?'application/json':path.endsWith('.css')?'text/css':path.endsWith('.html')?'text/html':path.endsWith('.m4a')?'audio/mp4':path.endsWith('.svg')?'image/svg+xml':'image/png';
 try{let body=!modern&&baseline[path]?baseline[path]:fs.readFileSync(root+'/'+path);if(modern&&path==='sw.js'&&revision)body=Buffer.from(body.toString().replace(/offline-v[0-9]+/, '$&-upgrade-test-'+revision));res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(404);res.end();}
});
(async()=>{await new Promise(r=>server.listen(4175,'127.0.0.1',r));const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
for(const status of ['ended','active']){
console.log('case',status);
modern=false;
const c=await b.newContext(),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(({status})=>{
 if(localStorage.getItem('animal-buddies-v1'))return;
 const time=Date.now()+(status==='active'?240000:-86400000);
 localStorage.setItem('animal-buddies-v1',JSON.stringify({curriculumVersion:3,mode:'actions',settings:{minutes:5,group:0,instructionLanguage:'hi'},session:{status,round:1,targets:['cow','dog','rabbit','cow','dog','rabbit'],deadline:time,mode:'actions',storyAction:'eat'}}));
},{status});
await p.goto('http://127.0.0.1:4175/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
console.log('offline ready');
const before=await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
if(status==='ended')await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();
let navigations=0;p.on('framenavigated',f=>{if(f===p.mainFrame())navigations++;});
modern=true;
await p.evaluate(()=>{navigator.serviceWorker.getRegistration().then(r=>r.update()).catch(()=>{});});
console.log('requested update');
await p.waitForFunction(()=>document.querySelector('#start')||document.querySelector('.action-scene'),{},{timeout:60000});
console.log('new UI');await p.waitForTimeout(1000);
assert.equal(navigations,1,'Exactly one automatic refresh');
const after=await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
assert.deepEqual(after.settings,{...before.settings,limitsEnabled:false});
if(status==='ended'){assert.equal(after.session,null);await p.locator('#start').waitFor();}
else{assert.deepEqual(after.session,{...before.session,view:'game'});await p.locator('#next').waitFor();}
await c.setOffline(true);await p.reload();
await p.locator(status==='ended'?'#start':'#next').waitFor();assert.deepEqual(errors,[]);await c.close();
}
// Previous names outcome must upgrade without replaying or losing its turn.
baseline=v11;modern=false;
const familiarContext=await b.newContext(),familiarPage=await familiarContext.newPage();
await familiarPage.goto('http://127.0.0.1:4175/');await familiarPage.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
await familiarPage.locator('[data-activity=names]').click();await familiarPage.locator('#choose').click();
const target=await familiarPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')).session.targets[0]);await familiarPage.locator('[data-choice="'+target+'"]').click();
const familiarBefore=await familiarPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));modern=true;
const familiarMoved=familiarPage.waitForEvent('framenavigated',{predicate:f=>f===familiarPage.mainFrame(),timeout:60000});await familiarPage.evaluate(()=>navigator.serviceWorker.getRegistration().then(r=>r.update()));await familiarMoved;
await familiarPage.locator('.familiar-outcome').waitFor();const familiarAfter=await familiarPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
assert.deepEqual(familiarAfter.settings,{...familiarBefore.settings,limitsEnabled:false});assert.equal(familiarAfter.session.deadline,familiarBefore.session.deadline);assert.equal(familiarAfter.session.round,familiarBefore.session.round);assert.equal(familiarAfter.session.pendingTurn,true);
await familiarContext.setOffline(true);await familiarPage.reload();await familiarPage.locator('#next').click();assert.equal(await familiarPage.locator('[data-choice]').count(),2);assert.equal(await familiarPage.locator('#choose').count(),0);assert.equal(await familiarPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')).session.round),1);await familiarContext.close();
console.log('PASS: actual v11 names outcome upgrades to direct illustrated choices offline, preserving settings, deadline and exact turn receipt');

// Actual v12 story presentation upgrades with saved outcomes and language intact.
for(const scene of ['sleep','hello']){
 baseline=v12;modern=false;
 const prior=await b.newContext(),page=await prior.newPage();await page.goto('http://127.0.0.1:4175/');await page.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
 await page.locator('[data-activity=day]').click();await page.locator('[data-day-hero=cow]').click();await page.locator('[data-chapter='+ (scene==='sleep'?'home':'school') +']').click();await page.locator('[data-day-choice=walk]').click();await page.locator('#day-next').click();
 if(scene==='sleep')await page.locator('[data-day-choice=sleep]').click();else{await page.locator('[data-day-choice=go]').click();await page.locator('[data-day-choice=finish]').click();}
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));modern=true;const moved=page.waitForEvent('framenavigated',{predicate:f=>f===page.mainFrame(),timeout:60000});await page.evaluate(()=>navigator.serviceWorker.getRegistration().then(r=>r.update()));await moved;await page.locator('#day-next').waitFor();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1'))),{...before,schemaVersion:4,settings:{...before.settings,limitsEnabled:false}},'Policy migration preserves saved visit and adds free-play default');await prior.setOffline(true);await page.reload();await page.locator('#day-next').waitFor();
 if(scene==='sleep')assert.equal(await page.locator('.bedroom-scene').getAttribute('data-bedding'),'asleep');else{assert.equal(await page.locator('.school-hero [data-pose=wave]').count(),1);assert.equal(await page.locator('.school-classmate').count(),2);}
 await prior.close();
}
console.log('PASS: actual v12 bedtime and school greeting outcomes retain complete state during v13 presentation upgrade and offline reopen');

// A same-day completed visit from the actual previous release unlocks by default.
baseline=v13;modern=false;
const locked=await b.newContext(),lockedPage=await locked.newPage();await lockedPage.goto('http://127.0.0.1:4175/');await lockedPage.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
await lockedPage.locator('[data-activity=day]').click();await lockedPage.locator('[data-chapter=morning]').click();await lockedPage.locator('[data-day-choice=wake]').click();await lockedPage.locator('#stop').click();await lockedPage.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();const lockedBefore=await lockedPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
modern=true;const unlocked=lockedPage.waitForEvent('framenavigated',{predicate:f=>f===lockedPage.mainFrame(),timeout:60000});await lockedPage.evaluate(()=>navigator.serviceWorker.getRegistration().then(r=>r.update()));await unlocked;await lockedPage.locator('.level-card').first().waitFor();
const unlockedSave=await lockedPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));assert.equal(unlockedSave.settings.limitsEnabled,false);assert.equal(unlockedSave.session,null);assert.deepEqual(unlockedSave.journey,lockedBefore.journey);assert.deepEqual(unlockedSave.settings,{...lockedBefore.settings,limitsEnabled:false});assert.ok(await lockedPage.evaluate(()=>localStorage.getItem('animal-buddies-v1-backup-v3')));
await locked.setOffline(true);await lockedPage.reload();await lockedPage.locator('[data-activity=actions]').click();await lockedPage.locator('[data-story-choice]').first().waitFor();await locked.close();console.log('PASS: actual v13 same-day lock upgrades to free play offline, retaining story progress/settings and schema-3 backup');

// Upgrade the actual previous story engine/schema, not only a synthetic worker.
baseline=v10;modern=false;
const previous=await b.newContext(),previousPage=await previous.newPage();
await previousPage.goto('http://127.0.0.1:4175/');await previousPage.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
await previousPage.locator('[data-activity=day]').click();await previousPage.locator('[data-chapter=morning]').click();await previousPage.locator('[data-day-choice=wake]').click();await previousPage.locator('#day-next').click();await previousPage.locator('[data-day-choice=brush]').click();
const v2Before=await previousPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));assert.equal(v2Before.schemaVersion,2);
modern=true;const upgraded=previousPage.waitForEvent('framenavigated',{predicate:f=>f===previousPage.mainFrame(),timeout:60000});await previousPage.evaluate(()=>navigator.serviceWorker.getRegistration().then(r=>r.update()));await upgraded;
await previousPage.locator('#day-next').waitFor();const v3After=await previousPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
assert.equal(v3After.schemaVersion,4);assert.deepEqual(v3After.journey.bookmarks,v2Before.journey.bookmarks);assert.deepEqual(v3After.journey.completed,v2Before.journey.completed);assert.equal(v3After.session.deadline,v2Before.session.deadline);assert.equal(v3After.session.round,v2Before.session.round);assert.deepEqual(v3After.settings,{...v2Before.settings,limitsEnabled:false});assert.deepEqual(v3After.journey.chapters.rabbit.morning,v2Before.journey.bookmarks.rabbit);
assert.ok(await previousPage.evaluate(()=>localStorage.getItem('animal-buddies-v1-backup-v2')));await previous.setOffline(true);await previousPage.reload();await previousPage.locator('#day-next').waitFor();await previous.close();
console.log('PASS: actual v10/schema-2 story migrates to current schema with deadline, outcome receipt, per-hero progress and versioned backup intact offline');
modern=true;
const c=await b.newContext(),p=await c.newPage();
await p.goto('http://127.0.0.1:4175/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
await require('./parent-controls.cjs').enableLimits(p);await p.locator('[data-activity=day]').click();await p.locator('.day-practice summary').click();await p.locator('#school-entry').click();await p.locator('[data-hero=cow]').click();await p.locator('[data-mission=help]').click();await p.locator('[data-school-choice=go]').click();
const beforeSchool=await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
revision=1;
const moved=p.waitForEvent('framenavigated',{predicate:f=>f===p.mainFrame(),timeout:60000});
await p.evaluate(()=>{navigator.serviceWorker.getRegistration().then(r=>r.update()).catch(()=>{});});await moved;
await p.locator('[data-school-choice=finish]').waitFor();
assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1'))),beforeSchool,'Mission checkpoint, progress and entire stored visit survive upgrade');
await c.setOffline(true);await p.reload();await p.locator('[data-school-choice=finish]').waitFor();await c.close();
console.log('PASS: school checkpoint and stored progress survive an automatic upgrade and offline reopen');
const dayContext=await b.newContext(),dayPage=await dayContext.newPage();
await dayPage.goto('http://127.0.0.1:4175/');await dayPage.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
await require('./parent-controls.cjs').enableLimits(dayPage);await dayPage.locator('[data-activity=day]').click();await dayPage.locator('[data-day-hero=cow]').click();await dayPage.locator('[data-chapter=morning]').click();await dayPage.locator('[data-day-choice=wake]').click();await dayPage.locator('#day-next').click();await dayPage.locator('[data-day-choice=brush]').click();
const dayBefore=await dayPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));revision=2;
const refreshed=dayPage.waitForEvent('framenavigated',{predicate:f=>f===dayPage.mainFrame(),timeout:60000});await dayPage.evaluate(()=>{navigator.serviceWorker.getRegistration().then(r=>r.update());});await refreshed;
await dayPage.locator('#day-next').waitFor();assert.deepEqual(await dayPage.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1'))),dayBefore);
await dayContext.setOffline(true);await dayPage.reload();await dayPage.locator('#day-next').waitFor();await dayContext.close();console.log('PASS: saved day outcome, per-hero checkpoints, settings and deadline survive worker upgrade and offline reopen');

console.log('PASS: old cached completed visit automatically refreshes and unlocks, active visit/deadline preserved, no reload loop, settings preserved, offline restart');
}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
