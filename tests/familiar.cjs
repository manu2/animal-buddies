const {chromium}=require('./runtime.cjs'),assert=require('assert/strict'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const c=await b.newContext({viewport:{width:360,height:740}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});await c.setOffline(true);
 const state=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
 async function parent(){await p.locator('#parent').click();const ns=(await p.locator('label[for=answer]').textContent()).match(/[0-9]+/g).map(Number);await p.locator('#answer').fill(String(ns[0]+ns[1]));await p.locator('#gate button').click();}
 async function restart(){await parent();await p.locator('#new-visit').click();}
 async function shot(name){if(process.env.CAPTURE_VISUALS!=='1')return;await p.evaluate(async()=>{
  const urls=new Set([...document.querySelectorAll('image')].map(e=>e.getAttribute('href')));
  for(const el of document.querySelectorAll('*'))for(const m of getComputedStyle(el).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.add(m[1]);
  await Promise.all([...document.images].map(i=>i.decode()));await Promise.all([...urls].map(async src=>{const i=new Image();i.src=src;await i.decode();}));
 });await p.screenshot({path:path.join(__dirname,'../docs/evidence/familiar-'+name+'.png'),fullPage:true});}
 const seen=new Set();
 for(let group=0;group<3;group++){
  await parent();await p.locator('#group').selectOption(String(group));await p.locator('#new-visit').click();await p.locator('[data-activity=names]').click();
  const deadline=(await state()).session.deadline;
  for(let turn=0;turn<6;turn++){
   const s=await state(),id=s.session.targets[turn];assert.equal(await p.locator('[data-choice]').count(),2);assert.equal(await p.locator('#choose').count(),0,'No extra Next-to-question step');
   const choices=await p.locator('[data-choice]').evaluateAll(es=>es.map(e=>e.dataset.choice));
   const image=p.locator('[data-choice="'+id+'"] image');assert.match(await image.getAttribute('href'),/stories\/|friends-toons/,'Actual choices use illustrated assets');
   assert.equal(await p.locator('img[src$=".svg"]').count(),0,'Old icon animal art is not used');
   if(turn===0){await shot('choices-'+group);await p.locator('[data-choice="'+choices.find(x=>x!==id)+'"]').click();assert.equal((await state()).session.round,turn);await p.reload();await p.locator('[data-choice]').first().waitFor();assert.deepEqual(await p.locator('[data-choice]').evaluateAll(es=>es.map(e=>e.dataset.choice)),choices,'Picture locations survive reload');}
   await p.locator('[data-choice="'+id+'"]').click();assert.equal((await state()).session.pendingTurn,true);assert.equal(await p.locator('[data-choice]').count(),0,'Quiet single-animal outcome');
   assert.equal(await p.locator('.familiar-outcome .toon-portrait').count(),1);assert.equal(await p.locator('.familiar-outcome .toon-portrait > svg').getAttribute('overflow'),'hidden','Atlas cell clips adjacent animals even in a wide outcome');const next=await p.locator('#next').boundingBox();assert.ok(next.y+next.height<=740,'Next fits phone');
   if(!seen.has(id)){await shot(id);seen.add(id);}await p.reload();await p.locator('#next').waitFor();assert.equal((await state()).session.round,turn);assert.equal((await state()).session.deadline,deadline);
   await p.locator('#next').click();
  }
  await p.getByText('ALL DONE FOR TODAY',{exact:true}).waitFor();
 }
 assert.equal(seen.size,8);
 for(const mode of ['sentences','letters']){await restart();await p.locator('[data-activity="'+mode+'"]').click();assert.equal(await p.locator('[data-choice]').count(),2);const s=await state(),id=s.session.targets[0],value=mode==='letters'?({elephant:'E',lion:'L',cow:'C'})[id]:id;await p.locator('[data-choice="'+value+'"]').click();await shot(mode);await p.locator('#familiar-back').click();assert.equal((await state()).session.round,1);assert.equal(await p.locator('.level-card').count(),3);}
 for(const hero of ['rabbit','cow']){
  await restart();await p.locator('[data-activity=day]').click();await p.locator('[data-day-hero="'+hero+'"]').click();await p.locator('[data-chapter=morning]').click();await p.locator('[data-day-choice=wake]').click();await p.locator('#day-next').click();
  assert.equal(await p.locator('.day-scene').getAttribute('data-room'),'bathroom');assert.equal(await p.locator('.day-actor .routine-sprite').getAttribute('data-pose'),'idle');await shot(hero+'-bathroom-choice');
  await p.locator('[data-day-choice=brush]').click();await p.locator('#listen').click();assert.equal(await p.locator('.day-actor .routine-sprite').getAttribute('data-pose'),'brush');assert.match(await p.locator('.day-actor .routine-sprite').getAttribute('style'),new RegExp(hero+'-routines-v1'));
  const first=await p.locator('.day-actor .routine-sprite').evaluate(e=>getComputedStyle(e).backgroundPosition);await p.waitForFunction(first=>getComputedStyle(document.querySelector('.day-actor .routine-sprite')).backgroundPosition!==first,first);await p.locator('#hint').click();assert.equal(await p.evaluate(()=>document.getAnimations().length),0);await shot(hero+'-brushing');
  await p.locator('#day-next').click();assert.equal(await p.locator('.day-scene').getAttribute('data-room'),'dining');await p.locator('[data-day-choice=eat]').click();await p.locator('#listen').click();const eat=await p.locator('.day-actor .routine-sprite').evaluate(e=>getComputedStyle(e).backgroundPosition);await p.waitForFunction(first=>getComputedStyle(document.querySelector('.day-actor .routine-sprite')).backgroundPosition!==first,eat);await p.locator('#hint').click();await shot(hero+'-dining');
  await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#listen').click();assert.equal(await p.evaluate(()=>document.getAnimations().length),0);await p.emulateMedia({reducedMotion:'no-preference'});
  if(hero==='cow'){await p.setViewportSize({width:1200,height:900});await shot('dining-desktop');await p.setViewportSize({width:360,height:740});}
  await p.locator('#day-next').click();assert.equal(await p.locator('.day-scene').getAttribute('data-room'),'dining','Travel to school starts in the dining room');
 }
 await p.evaluate(async()=>{for(const url of ['./animals/friends-toons-v1.png','./stories/cow-routines-v1.png','./stories/rabbit-routines-v1.png','./scenes/animal-bathroom-v1.png','./scenes/animal-dining-v1.png']){const r=await fetch(url),i=await createImageBitmap(await r.blob());if(i.width!==1536||i.height!==1024)throw Error(url);i.close();}});
 assert.deepEqual(errors,[]);console.log('PASS familiar: all eight illustrated animals; direct picture/letter choices and quiet outcomes; fixed choice order across offline reload; exact turn receipts; preserved older levels; both heroes hold brushes and eat at a table in correct rooms; frame animation, cancellation, reduced motion; offline atlas/background decode.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
