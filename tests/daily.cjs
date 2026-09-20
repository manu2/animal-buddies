const {chromium}=require('./runtime.cjs');
const assert=require('node:assert/strict');
(async()=>{
const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
const c=await b.newContext({timezoneId:'Asia/Kolkata',viewport:{width:390,height:844}}),p=await c.newPage(),errors=[];
p.on('pageerror',e=>errors.push(e.message));
await p.clock.install({time:new Date('2026-09-18T23:58:00+05:30')});
await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');
await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});
await c.setOffline(true);
await p.locator('#start').click();await p.locator('#stop').click();await p.reload();
assert.equal(await p.locator('#start').count(),0,'Same-day lock');
await p.clock.fastForward(3*60000);
await p.locator('#start').waitFor();
await p.locator('#start').click();
assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')).session.day),'2026-09-19','Uses local calendar day');
async function parent(){await p.locator('#parent').click();const n=(await p.locator('label[for=answer]').textContent()).match(/\d+/g).map(Number);await p.locator('#answer').fill(String(n[0]+n[1]));await p.locator('#gate button').click();}
await parent();await p.locator('#instruction-language').selectOption('hi');await p.locator('#new-visit').click();await p.locator('#start').waitFor();
await p.locator('#start').click();await p.locator('#stop').click();await parent();await p.locator('#test-next-day').click();await p.locator('#start').waitFor();
assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')).settings.instructionLanguage),'hi');
await p.locator('#start').click();await p.locator('#stop').click();
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('animal-buddies-v1'));delete d.session.day;d.session.deadline-=86400000;localStorage.setItem('animal-buddies-v1',JSON.stringify(d));});
await p.reload();await p.locator('#start').waitFor();
await p.locator('#start').click();
await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('animal-buddies-v1'));d.session.day='2026-09-18';localStorage.setItem('animal-buddies-v1',JSON.stringify(d));});
await p.reload();await p.locator('#start').waitFor();
assert.deepEqual(errors,[]);
console.log('PASS: same-day lock, local midnight unlock offline, immediate parent restart, simulate-next-day button, legacy migration, stale active visit, settings preserved');
}finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
