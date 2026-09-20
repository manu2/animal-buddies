const {chromium}=require('./runtime.cjs'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});try{
const c=await b.newContext({viewport:{width:360,height:740}}),p=await c.newPage();
await p.goto(process.env.GAME_URL||'http://127.0.0.1:4173/');
await p.getByText('Ready for offline play',{exact:false}).waitFor({timeout:90000});
await p.locator('#library').click();await p.screenshot({path:path.join(__dirname,'../docs/evidence/activity-library.png'),fullPage:true});
await p.locator('[data-activity=school]').click();await p.screenshot({path:path.join(__dirname,'../docs/evidence/school-lobby.png'),fullPage:true});
await p.locator('[data-mission=help]').click();await p.locator('[data-school-choice=go]').click();
await p.screenshot({path:path.join(__dirname,'../docs/evidence/school-help.png'),fullPage:true});
await p.locator('[data-school-choice=finish]').click();await p.screenshot({path:path.join(__dirname,'../docs/evidence/school-outcome.png'),fullPage:true});
await p.setViewportSize({width:1200,height:900});await p.screenshot({path:path.join(__dirname,'../docs/evidence/school-desktop.png'),fullPage:true});
console.log('Saved mobile and desktop review screenshots.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1)});
