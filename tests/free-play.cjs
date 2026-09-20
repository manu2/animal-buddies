const {chromium}=require('./runtime.cjs'),assert=require('assert/strict'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const c=await b.newContext({viewport:{width:360,height:740}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});await c.setOffline(true);
const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
async function parent(){await p.locator('#parent').click();const ns=(await p.locator('label[for=answer]').textContent()).match(/[0-9]+/g).map(Number);await p.locator('#answer').fill(String(ns[0]+ns[1]));await p.locator('#gate button').click();}
await parent();assert.equal(await p.locator('#limits-enabled').inputValue(),'off');assert.equal(await p.locator('#minutes').isVisible(),false);assert.equal(await p.locator('#test-next-day').isVisible(),false);await p.locator('#instruction-language').selectOption('hi');
if(process.env.CAPTURE_VISUALS==='1')await p.screenshot({path:path.join(__dirname,'../docs/evidence/free-play-settings.png'),fullPage:true});await p.locator('#close-parent').click();
// More than six rounds in every old activity, no broken indices or forced ending.
for(const mode of ['names','actions','sentences','letters']){
 await p.locator('[data-activity='+mode+']').click();const round=(await state()).session.round;
 for(let i=0;i<8;i++){
  assert.equal(await p.locator('#time-note').isVisible(),false);assert.equal(await p.locator('[aria-label$="of 6"]').count(),0);
  if(mode==='actions')await p.locator('[data-story-choice]').first().click();else{const s=await state(),id=s.session.targets[s.session.round%6];await p.locator('[data-choice="'+(mode==='letters'?{cow:'C',dog:'D',fish:'F'}[id]:id)+'"]').click();}
  if(i===6){const before=await state();await p.reload();await p.locator('#next').waitFor();assert.equal((await state()).session.round,before.session.round);assert.equal((await state()).session.pendingTurn,before.session.pendingTurn);}
  await p.locator('#next').click();
 }
 assert.equal((await state()).session.round,round+8);await p.locator('#library').click();assert.equal(await p.locator('.level-card').count(),3);
}
// A full nine-beat day is playable continuously, despite an expired old deadline.
await p.locator('[data-activity=day]').click();await p.locator('[data-day-hero=cow]').click();await p.locator('[data-chapter=morning]').click();
await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('animal-buddies-v1'));s.session.deadline=Date.now()-86400000;s.session.day='2020-01-01';localStorage.setItem('animal-buddies-v1',JSON.stringify(s));});await p.reload();await p.locator('[data-day-choice=wake]').click();await p.locator('#day-next').click();
for(const action of ['brush','eat','walk']){await p.locator('[data-day-choice='+action+']').click();await p.locator('#day-next').click();}
for(let i=0;i<3;i++){await p.locator('[data-day-choice=go]').click();await p.locator('[data-day-choice=finish]').click();await p.locator('#day-next').click();}
await p.locator('[data-day-choice=walk]').click();await p.locator('#day-next').click();await p.locator('[data-day-choice=sleep]').click();await p.locator('#day-next').click();await p.locator('#day-resume').waitFor();assert.ok((await state()).journey.bookmarks.cow.finished);assert.ok((await state()).session.round>40);
await p.locator('[data-chapter=home]').click();await p.locator('#stop').click();assert.equal(await p.locator('.level-card').count(),3,'Finish permits immediate return');assert.equal((await state()).session,null);
// Standalone school practice also stays available past its former shared cap.
await p.locator('[data-activity=day]').click();await p.locator('.day-practice summary').click();await p.locator('#school-entry').click();
for(let i=0;i<8;i++){await p.locator('[data-mission=hello]').click();await p.locator('[data-school-choice=go]').click();await p.locator('[data-school-choice=finish]').click();await p.locator('#school-next').click();}
assert.equal((await state()).session.round,8);await p.locator('#library').click();assert.equal(await p.locator('.level-card').count(),3);
// Opt-in starts a new budget; opt-out unlocks a stopped visit and retains progress.
const completed=(await state()).journey.completed;await parent();await p.locator('#limits-enabled').selectOption('on');assert.equal(await p.locator('#minutes').isVisible(),true);await p.locator('#minutes').selectOption('3');await p.locator('#close-parent').click();await p.locator('[data-activity=actions]').click();assert.equal(await p.locator('#time-note').isVisible(),true);
for(let i=0;i<6;i++){await p.locator('[data-story-choice]').first().click();await p.locator('#next').click();}await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();await p.reload();await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();
await parent();assert.equal(await p.locator('#limits-enabled').inputValue(),'on');await p.locator('#limits-enabled').selectOption('off');await p.locator('#close-parent').click();assert.equal(await p.locator('.level-card').count(),3);assert.deepEqual((await state()).journey.completed,completed);assert.equal((await state()).settings.instructionLanguage,'hi');await p.reload();assert.equal((await state()).settings.limitsEnabled,false);
// Toggling during an outcome settles it exactly once, without erasing chapter receipts.
await p.locator('[data-activity=day]').click();await p.locator('[data-chapter=morning]').click();await p.locator('[data-day-choice=wake]').click();const beforeToggle=(await state()).journey.completed;await parent();await p.locator('#limits-enabled').selectOption('on');await p.locator('#close-parent').click();await p.locator('[data-activity=day]').click();await p.locator('#day-resume').click();await p.locator('#day-next').click();assert.equal((await state()).session.round,0,'Previously settled outcome not charged again');assert.deepEqual((await state()).journey.completed,beforeToggle);
await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('animal-buddies-v1'));s.session.deadline=Date.now()-1;localStorage.setItem('animal-buddies-v1',JSON.stringify(s));});await p.reload();await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();
// Old completed v13-style save with no preference defaults to unlocked free play.
await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('animal-buddies-v1'));delete s.settings.limitsEnabled;s.schemaVersion=3;localStorage.setItem('animal-buddies-v1',JSON.stringify(s));});await p.reload();await p.locator('.level-card').first().waitFor();assert.equal((await state()).settings.limitsEnabled,false);assert.deepEqual((await state()).journey.completed,beforeToggle);assert.equal((await state()).settings.minutes,3);
assert.deepEqual(errors,[]);console.log('PASS free play: default off, 32 old-activity turns, eight standalone missions and complete nine-beat day, offline reload beyond sixth turn/deadline/midnight, immediate restart, optional turn/time/day limits, mid-outcome toggle receipts, saved language/progress and old completed-save unlock.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
