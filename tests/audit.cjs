const {chromium}=require('./runtime.cjs'),assert=require('assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const c=await b.newContext({viewport:{width:360,height:740}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});await c.setOffline(true);
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
 async function parent(){await p.locator('#parent').click();const ns=(await p.locator('label[for=answer]').textContent()).match(/[0-9]+/g).map(Number);await p.locator('#answer').fill(String(ns[0]+ns[1]));await p.locator('#gate button').click();}
 await p.locator('[data-activity=day]').click();assert.match(await p.locator('#day-resume').textContent(),/Start our morning/);
 assert.notEqual(await p.locator('[data-chapter=morning] img').getAttribute('src'),await p.locator('[data-chapter=home] img').getAttribute('src'));
 await p.locator('#day-resume').click();await p.locator('[data-day-choice=wake]').click();await p.locator('#day-next').click();
 assert.equal(await p.locator('.toothbrush').count(),0,'Brush does not appear in mouth before selection');await p.locator('[data-day-choice=brush]').click();const deadline=(await state()).session.deadline;
 await p.locator('#day-back').click();await p.reload();await p.locator('#day-resume').waitFor();assert.match(await p.locator('#day-resume').textContent(),/Brush/,'Reload stays in chapter chooser');
 await p.locator('[data-chapter=school]').click();await p.locator('#day-back').click();await p.locator('[data-chapter=morning]').click();assert.equal((await state()).journey.bookmarks.rabbit.node,'brush');await p.locator('#day-next').waitFor();assert.equal((await state()).session.deadline,deadline);
 await p.locator('#day-back').click();await p.locator('[data-chapter=home]').click();assert.match(await p.locator('.day-background').getAttribute('src'),/lakeside/,'Walk home starts at school');await p.locator('[data-day-choice=walk]').click();assert.match(await p.locator('.day-background').first().getAttribute('src'),/animal-home/,'Arrival is visibly home');
 await p.locator('#day-next').click();assert.match(await p.locator('.day-background').getAttribute('src'),/bedtime/);assert.equal(await p.locator('.day-actor .action-sprite').getAttribute('data-action'),'walk','Not already asleep before choosing');await p.locator('[data-day-choice=sleep]').click();assert.equal(await p.locator('.day-actor .action-sprite').getAttribute('data-action'),'sleep');
 for(const url of ['./scenes/animal-morning-v1.png','./scenes/animal-bedtime-v1.png'])assert.ok(await p.evaluate(async url=>{const i=new Image();i.src=url;await i.decode();return i.naturalWidth;},url));
 await parent();assert.match(await p.locator('#grownup-dialog').textContent(),/Our animal days/);assert.match(await p.locator('#grownup-dialog').textContent(),/Brush|Good night/);await p.locator('[data-observe="day:rabbit"]').selectOption('comfortable');await p.locator('#close-parent').click();await parent();assert.equal(await p.locator('[data-observe="day:rabbit"]').inputValue(),'comfortable');await p.locator('#new-visit').click();
 await p.reload();assert.equal(await p.locator('.level-card').count(),3);await p.locator('[data-activity=actions]').click();await p.locator('#library').click();await p.reload();assert.equal(await p.locator('.level-card').count(),3,'Reload stays in levels chooser');
 await p.locator('[data-activity=names]').click();assert.ok((await state()).session.targets.every(id=>['cow','dog','fish'].includes(id)),'Return to names restores configured animals');
 // Hold audio startup open, then navigate away before it resolves.
 const race=await b.newContext({serviceWorkers:'block'}),r=await race.newPage();
 await r.route('**/app.js',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text())+'\nwindow.appEval = code => eval(code);'});});
 await r.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');await r.locator('[data-activity=day]').waitFor();
 await r.evaluate(()=>window.appEval("mode='day';dayRuntime.lobby();unlockAudio=()=>new Promise(resolve=>window.releaseAudio=resolve);window.pendingBegin=dayRuntime.begin();home();"));
 await r.evaluate(async()=>{window.releaseAudio();await window.pendingBegin;});
 assert.equal(await r.locator('.level-card').count(),3,'Delayed audio startup cannot reopen a scene after leaving');assert.equal(await r.evaluate(()=>window.appEval('session')),null,'Canceled start does not create a hidden visit');for(const entry of ['start()','startSchool(\'help\')']){
 await r.evaluate(entry=>window.appEval("mode='actions';session=null;unlockAudio=()=>new Promise(resolve=>window.releaseAudio=resolve);window.pendingBegin="+entry+";home();"),entry);
 await r.evaluate(async()=>{window.releaseAudio();await window.pendingBegin;});assert.equal(await r.locator('.level-card').count(),3);assert.equal(await r.evaluate(()=>window.appEval('session')),null,'Legacy entry also respects cancellation');
 }await race.close();
 assert.deepEqual(errors,[]);console.log('PASS audit: clear start/continue; different chapter imagery; props follow choice; per-chapter resume; chooser survives reload; visual travel and bedtime states; offline new art; parent day observations; cross-level target compatibility.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
