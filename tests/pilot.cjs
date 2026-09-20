const {chromium}=require('./runtime.cjs'),assert=require('assert/strict'),fs=require('fs');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const c=await b.newContext({viewport:{width:360,height:740},timezoneId:'Asia/Kolkata'}),p=await c.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');
 await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});
 await c.setOffline(true);
 // Every new raster must really decode from the offline cache, including CSS sprites.
 await p.evaluate(async()=>{for(const url of ['./scenes/lakeside-classroom-v2.png',...['cow','dog','rabbit'].map(id=>'./stories/'+id+'.png')]){
  const response=await fetch(url);if(!response.ok)throw Error('Missing offline artwork: '+url);
  const bitmap=await createImageBitmap(await response.blob());if(!bitmap.width||!bitmap.height)throw Error('Invalid artwork: '+url);bitmap.close();
 }});
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
 async function parent(){
  await p.locator('#parent').click();const ns=(await p.locator('label[for=answer]').textContent()).match(/[0-9]+/g).map(Number);
  await p.locator('#answer').fill(String(ns[0]+ns[1]));await p.locator('#gate button').click();
 }
 async function restart(){await parent();await p.locator('#new-visit').click();await p.locator('#school-entry').click();}
 await p.locator('#library').click();
 assert.equal(await p.locator('[data-activity]').count(),5);
 for(const id of ['names','actions','sentences','letters','school'])assert.equal(await p.locator('[data-activity="'+id+'"]').count(),1);
 await p.screenshot({path:'/tmp/buddies-library.png',fullPage:true});
 await p.locator('[data-activity=school]').click();
 await p.screenshot({path:'/tmp/buddies-school-lobby.png',fullPage:true});
 let count=0,deadline=null;
 for(const support of ['explore','listen'])for(const hero of ['cow','rabbit'])for(const mission of ['hello','help','water']){
  if(count===6){await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();await restart();deadline=null;}
  await p.locator('[data-hero="'+hero+'"]').click();await p.locator('[data-support="'+support+'"]').click();
  await p.locator('[data-mission="'+mission+'"]').click();
  const initial=await state();deadline??=initial.session.deadline;assert.equal(initial.session.deadline,deadline);
  assert.equal(initial.school.hero,hero);assert.equal(initial.school.support,support);
  const before=initial.progress.completed[mission]||0;
  if(mission!=='hello'){await p.locator('[data-school-choice=try]').click();assert.equal((await state()).school.step,0);}
  await p.locator('[data-school-choice=go]').click();
  assert.equal((await state()).school.step,1);
  await p.reload();await p.locator('[data-school-choice=finish]').waitFor();
  assert.equal((await state()).session.deadline,deadline);
  await p.locator('[data-school-choice=finish]').click();
  await p.locator('#school-next').waitFor();
  assert.equal((await state()).progress.completed[mission],before+1);
  const box=await p.locator('#school-next').boundingBox();assert.ok(box.y+box.height<=740,'School next fits small screen');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No horizontal overflow');
  if(count===0)await p.screenshot({path:'/tmp/buddies-school-complete.png',fullPage:true});
  if(mission==='help'&&hero==='rabbit'&&support==='explore')await p.screenshot({path:'/tmp/buddies-school-help.png',fullPage:true});
  await p.reload();await p.locator('#school-next').waitFor();
  assert.equal((await state()).progress.completed[mission],before+1,'Reload does not count twice');
  await p.locator('#school-next').click();count++;
 }
 await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();await parent();
 await p.locator('[data-observe=help]').selectOption('comfortable');
 await p.locator('#instruction-language').selectOption('hi');await p.locator('#new-visit').click();
 await p.locator('#library').click();await p.locator('[data-activity=names]').click();
 const d=(await state()).session.deadline;
 await p.locator('#choose').click();await p.locator('[data-choice=cow]').click();await p.reload();
 await p.locator('#next').waitFor();assert.equal((await state()).session.pendingTurn,true);
 await p.locator('#library').click();assert.equal((await state()).session.round,1);
 await p.locator('[data-activity=school]').click();await p.locator('[data-mission=help]').click();
 assert.equal((await state()).session.deadline,d,'Cross-activity shared deadline');
 assert.equal((await state()).session.round,1);
 await p.locator('[data-school-choice=go]').click();
 await p.locator('#library').click();await p.locator('[data-activity=letters]').click();
 await p.locator('#choose').click();await p.locator('[data-choice=D]').click();await p.locator('#next').waitFor();
 await p.locator('#library').click();await p.locator('[data-activity=school]').click();await p.locator('[data-mission=help]').click();
 assert.equal((await state()).school.step,1,'Checkpoint survives other activities');
 await p.locator('#parent').click();assert.equal(await p.evaluate(()=>document.getAnimations().length),0);await p.locator('#close-parent').click();
 await p.evaluate(()=>{const d=JSON.parse(localStorage.getItem('animal-buddies-v1'));d.session.deadline=Date.now()-1;localStorage.setItem('animal-buddies-v1',JSON.stringify(d));});
 await p.reload();await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();
 assert.equal((await state()).school.step,1,'Timer preserves unfinished mission');
 await parent();await p.locator('#test-next-day').click();await p.locator('#school-entry').click();await p.locator('[data-mission=help]').click();
 assert.equal((await state()).school.step,1,'New day can resume checkpoint');
 assert.equal((await state()).progress.observations.help,'comfortable');assert.equal((await state()).settings.instructionLanguage,'hi');
 await p.setViewportSize({width:1200,height:900});await p.screenshot({path:'/tmp/buddies-school-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS pilot: 12 mission/hero/support combinations offline; gentle recovery; every checkpoint reload; completion deduplication; shared six turns/deadline; all prior activities visible; pending legacy reward; parent observation; day/timeout checkpoint; 360px layout.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
