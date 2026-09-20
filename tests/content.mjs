import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DAY,HEROES,validateStory,storyClips,choicesFor,retryFor} from '../content/day.js';
assert.deepEqual(validateStory(),[]);
const clips=new Set(JSON.parse(fs.readFileSync(new URL('../audio-list.json',import.meta.url)))),assets=new Set(JSON.parse(fs.readFileSync(new URL('../asset-list.json',import.meta.url))));
for(const [id,node] of Object.entries(DAY))for(const phase of ['choose','help','outcome'])for(const lang of ['en','hi']){
 if(node.kind==='routine'&&phase==='help')continue;
 for(const meaning of [false,true])for(const clip of storyClips(node,id,phase,lang,meaning))assert.ok(clips.has(clip),'Missing story recording '+clip);
 const choices=choicesFor(node,phase);if(choices.some(c=>c.id==='retry'))assert.ok(clips.has(retryFor(node,id,lang).clip));assert.ok(choices.length>=1&&choices.length<=2);assert.equal(new Set(choices.map(c=>c.id)).size,choices.length);
}
for(const id of ['day-levels','day-lobby','day-retry'])for(const lang of ['en','hi'])assert.ok(clips.has(id+'-'+lang));
for(const path of ['./content/day.js','./engine/journey.js','./engine/save-store.js','./engine/day-controller.js','./ui/day-view.js','./day.css','./ui/parent-view.js','./scenes/animal-morning-v1.png','./scenes/animal-bedtime-v1.png','./scenes/animal-home-v1.png','./scenes/lakeside-classroom-v2.png',...HEROES.map(h=>'./stories/'+h+'.png')])assert.ok(assets.has(path),'Not cached '+path);
for(const path of assets)assert.ok(fs.existsSync(new URL('../'+path,import.meta.url)),'Asset absent '+path);
assert.ok(validateStory({...DAY,wake:{...DAY.wake,action:'fly'}}).some(e=>e.includes('unsupported')));
assert.ok(validateStory({...DAY,wake:{...DAY.wake,next:'deleted'}}).some(e=>e.includes('missing next')));
assert.ok(validateStory({...DAY,wake:{...DAY.wake,next:'wake'}}).some(e=>e.includes('cycle')));
console.log('PASS content: stable graph, bounded choices, both languages, recording and offline inventory coverage.');
