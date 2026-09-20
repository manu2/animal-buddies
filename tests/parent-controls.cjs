// Explicitly opt into the retained short-visit policy in its regression suites.
exports.enableLimits=async page=>{
 await page.locator('#parent').click();
 const ns=(await page.locator('label[for=answer]').textContent()).match(/[0-9]+/g).map(Number);
 await page.locator('#answer').fill(String(ns[0]+ns[1]));await page.locator('#gate button').click();
 await page.locator('#limits-enabled').selectOption('on');
 // dialog.close() queues a close event which redraws Levels; wait for it before measuring cards.
 const closed=page.locator('#grownup-dialog').evaluate(dialog=>new Promise(resolve=>dialog.addEventListener('close',()=>resolve(true),{once:true})));
 await page.locator('#close-parent').click();await closed;
};
