const {chromium}=require('./runtime.cjs');
const {execFileSync}=require('child_process'),fs=require('fs'),http=require('http'),assert=require('assert/strict');
const root=require('path').resolve(__dirname,'..');
const old={};
for(const f of ['app.js','sw.js','index.html'])old[f]=execFileSync('git',['show','31601a9:'+f],{cwd:root});
let modern=false,revision=0;
const server=http.createServer((req,res)=>{
 const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
 const type=path.endsWith('.js')?'application/javascript':path.endsWith('.json')||path.endsWith('.webmanifest')?'application/json':path.endsWith('.css')?'text/css':path.endsWith('.html')?'text/html':path.endsWith('.m4a')?'audio/mp4':path.endsWith('.svg')?'image/svg+xml':'image/png';
 try{let body=!modern&&old[path]?old[path]:fs.readFileSync(root+'/'+path);if(modern&&path==='sw.js'&&revision)body=Buffer.from(body.toString().replace('offline-v8','offline-v8-upgrade-test'));res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);}catch{res.writeHead(404);res.end();}
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
assert.deepEqual(after.settings,before.settings);
if(status==='ended'){assert.equal(after.session,null);await p.locator('#start').waitFor();}
else{assert.deepEqual(after.session,before.session);await p.locator('#next').waitFor();}
await c.setOffline(true);await p.reload();
await p.locator(status==='ended'?'#start':'#next').waitFor();assert.deepEqual(errors,[]);await c.close();
}
modern=true;
const c=await b.newContext(),p=await c.newPage();
await p.goto('http://127.0.0.1:4175/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:60000});
await p.locator('#school-entry').click();await p.locator('[data-hero=cow]').click();await p.locator('[data-mission=help]').click();await p.locator('[data-school-choice=go]').click();
const beforeSchool=await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
revision=1;
const moved=p.waitForEvent('framenavigated',{predicate:f=>f===p.mainFrame(),timeout:60000});
await p.evaluate(()=>{navigator.serviceWorker.getRegistration().then(r=>r.update()).catch(()=>{});});await moved;
await p.locator('[data-school-choice=finish]').waitFor();
assert.deepEqual(await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1'))),beforeSchool,'Mission checkpoint, progress and entire stored visit survive upgrade');
await c.setOffline(true);await p.reload();await p.locator('[data-school-choice=finish]').waitFor();await c.close();
console.log('PASS: school checkpoint and stored progress survive an automatic upgrade and offline reopen');
console.log('PASS: old cached completed visit automatically refreshes and unlocks, active visit/deadline preserved, no reload loop, settings preserved, offline restart');
}finally{await b.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exit(1)});
