const {chromium}=require('./runtime.cjs');
const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const c=await b.newContext({viewport:{width:390,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});await c.setOffline(true);
await p.locator('#start').click();
for(const action of ['walk','eat','sleep']){
await p.evaluate(action=>{const d=JSON.parse(localStorage.getItem('animal-buddies-v1'));d.session.storyAction=action;localStorage.setItem('animal-buddies-v1',JSON.stringify(d));},action);
await p.reload();await p.locator('#listen').click();
const sprite=p.locator('.story-stage .action-sprite');
const initial=await sprite.evaluate(el=>getComputedStyle(el).backgroundPosition);await p.waitForFunction(initial=>getComputedStyle(document.querySelector('.story-stage .action-sprite')).backgroundPosition!==initial,initial); // Body motion alone does not prove the sprite frames advance.
await p.waitForTimeout(500);const a=await sprite.evaluate(el=>({t:getComputedStyle(el).transform,p:getComputedStyle(el).backgroundPosition}));
await p.waitForTimeout(1100);const z=await sprite.evaluate(el=>({t:getComputedStyle(el).transform,p:getComputedStyle(el).backgroundPosition}));
assert.notEqual(a.t,z.t,action+' visibly moves');await p.screenshot({path:'/tmp/action-'+action+'.png',fullPage:true});
await p.waitForTimeout(3200);assert.equal(await p.evaluate(()=>document.getAnimations().length),0,action+' stops');
}
await p.locator('#listen').click();await p.locator('#hint').click();assert.equal(await p.evaluate(()=>document.getAnimations().length),0,'Meaning cancels animation');
await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#listen').click();assert.equal(await p.evaluate(()=>document.getAnimations().length),0,'Reduced motion');
const audio=await p.evaluate(async()=>{const list=await(await fetch('./audio-list.json')).json(),ctx=new AudioContext();for(const n of list){const r=await fetch('./audio/'+n+'.m4a');const a=await ctx.decodeAudioData(await r.arrayBuffer());if(a.duration<=0)throw Error(n);}await ctx.close();return list.length;});
assert.ok(audio>=197);assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,actions:['walk','eat','sleep'],audio,offline:true}));}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
