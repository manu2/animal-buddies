const {chromium}=require('./runtime.cjs'),assert=require('assert/strict'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
 const c=await b.newContext({viewport:{width:320,height:568}}),p=await c.newPage(),errors=[],rows=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');await p.locator('#offline-status').filter({hasText:'Ready for offline play'}).waitFor({timeout:90000});await c.setOffline(true);
 const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('animal-buddies-v1')));
 async function inspect(name,shot=false){
  const result=await p.evaluate(()=>({scroll:scrollY,overflow:document.documentElement.scrollWidth>innerWidth,controls:[...document.querySelectorAll('.game button')].map(el=>{const r=el.getBoundingClientRect();return {label:el.id||el.getAttribute('aria-label'),width:r.width,height:r.height,top:r.top,bottom:r.bottom,viewport:innerHeight};}).filter(r=>r.height>0)}));
  assert.equal(result.scroll,0,name+': starts at heading');assert.equal(result.overflow,false,name+': no horizontal overflow');
  for(const r of result.controls){assert.ok(r.width>=44&&r.height>=44,name+': touch size '+r.label);assert.ok(r.top>=0&&r.bottom<=r.viewport,name+': control off-screen '+JSON.stringify(r));}
  rows.push({name,...result});
  if(shot&&process.env.CAPTURE_VISUALS==='1'){
   await p.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));const urls=[...document.querySelectorAll('*')].flatMap(e=>[...getComputedStyle(e).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]));await Promise.all([...new Set(urls)].map(async src=>{const i=new Image();i.src=src;await i.decode();}));});
   await p.screenshot({path:path.join(__dirname,'../docs/evidence/review-'+name+'.png'),fullPage:true});
  }
 }
 // Scrolled entry into standalone school, stale/double events and exact receipts.
 await p.locator('[data-activity=day]').click();await p.locator('.day-practice summary').click();await p.locator('#school-entry').click();assert.equal(await p.evaluate(()=>scrollY),0);
 await p.locator('[data-mission=help]').click();await inspect('small-school-help');await p.locator('[data-school-choice=go]').evaluate(el=>{el.click();el.click();});assert.equal((await saved()).school.step,1,'An old go button cannot perform finish');
 await p.locator('[data-school-choice=finish]').evaluate(el=>{el.click();el.click();});assert.equal((await saved()).progress.completed.help,1);
 await p.locator('#school-next').click();await p.locator('#library').click();
 await p.locator('[data-activity=actions]').click();await p.locator('[data-story-choice]').first().evaluate(el=>window.oldChoice=el);await p.locator('#story-back').click();const before=await saved();await p.evaluate(()=>window.oldChoice.click());assert.equal(await p.locator('.level-card').count(),3);assert.deepEqual(await saved(),before);
 // An old Next must not reopen/advance a chapter after navigation.
 await p.locator('[data-activity=day]').click();await p.locator('[data-chapter=morning]').click();await p.locator('[data-day-choice=wake]').click();await p.locator('#day-next').evaluate(el=>window.oldNext=el);await p.locator('#library').click();const atChooser=await saved();await p.evaluate(()=>window.oldNext.click());assert.equal(await p.locator('.level-card').count(),3);assert.deepEqual(await saved(),atChooser);
 for(const size of [{width:320,height:568},{width:360,height:640},{width:1200,height:900}]){
  await p.setViewportSize(size);const prefix=size.width+'x'+size.height;
  for(const mode of ['names','letters','sentences','actions']){
   await p.locator('[data-activity='+mode+']').click();await inspect(prefix+'-'+mode+'-prompt');
   if(mode==='actions')await p.locator('[data-story-choice]').first().click();else{const s=await saved(),id=s.session.targets[s.session.round%6],value=mode==='letters'?id[0].toUpperCase():id;await p.locator('[data-choice='+value+']').click();}
   await p.locator('#hint').click();await inspect(prefix+'-'+mode+'-outcome',size.width===320);await p.locator('#library').click();
  }
  for(const hero of ['rabbit','cow']){
   await p.locator('[data-activity=day]').click();await p.locator('[data-day-hero='+hero+']').click();
   // Restart this test hero's chapter through the visible complete-day replay route.
   await p.locator('[data-chapter=morning]').click();
   for(let steps=0;steps<9;steps++){
    let s=await saved(),beat=s.journey.bookmarks[hero],name=prefix+'-'+hero+'-'+beat.node;
    if(beat.phase!=='outcome'){
     await inspect(name+'-prompt');
     const retry=p.locator('[data-day-choice=retry]');if(await retry.count()){const completed=s.journey.completed;await retry.click();assert.deepEqual((await saved()).journey.completed,completed);await inspect(name+'-retry');}
     await p.locator('[data-day-choice]:not([data-day-choice=retry])').first().click();
     if(await p.locator('[data-day-choice=finish]').count()){await inspect(name+'-help');await p.locator('[data-day-choice=finish]').click();}
    }
    await p.locator('#hint').click();await inspect(name+'-outcome',size.width===320);
    if(beat.node==='brush'){const checkpoint=await saved();await p.reload();await p.locator('#day-next').waitFor();assert.deepEqual(await saved(),checkpoint);}
    await p.locator('#day-next').click();
   }
   await p.locator('#day-resume').filter({hasText:'Play another day'}).waitFor();await p.locator('#library').click();
  }
 }
 assert.deepEqual(errors,[]);if(process.env.CAPTURE_VISUALS==='1')require('fs').writeFileSync(path.join(__dirname,'../docs/evidence/review-layout.json'),JSON.stringify(rows,null,2));
 console.log('PASS usability: '+rows.length+' screen states, 320x568/360x640/desktop; all gameplay targets at least 44px and visible; scroll resets; all legacy modes; both complete animal days; retries, offline outcome reload, duplicate and detached taps, unchanged saved progress.');
 }finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
