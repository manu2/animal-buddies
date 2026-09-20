import assert from 'node:assert/strict';
import {migrateSave,createSaveStore,SAVE_KEY} from '../engine/save-store.js';
import {reduceJourney,currentBeat} from '../engine/journey.js';
const legacy={curriculumVersion:3,mode:'school',settings:{minutes:7,group:1,instructionLanguage:'hi',limitsEnabled:true},school:{hero:'cow',support:'listen',mission:'help',step:1,counted:false},progress:{completed:{help:2},observations:{help:'comfortable'}},session:{status:'active',round:0,day:'2026-09-21',deadline:20000,targets:['cow','dog','rabbit','cow','dog','rabbit'],mode:'school'}};
const original=structuredClone(legacy);let s=migrateSave(legacy);
assert.deepEqual(s.settings,legacy.settings);assert.deepEqual(s.session,legacy.session);assert.deepEqual(s.school,legacy.school);assert.deepEqual(s.progress,legacy.progress);assert.equal(s.journey.hero,'cow');assert.deepEqual(legacy,original);
function send(event){s=reduceJourney(s,event,1000);}
send({type:'CHAPTER',node:'brush'});send({type:'ACT',choice:'invalid'});assert.equal(currentBeat(s.journey).phase,'choose');send({type:'ACT',choice:'retry'});assert.equal(s.session.round,0);
send({type:'ACT',choice:'brush'});assert.equal(s.journey.completed['cow:brush'],1);assert.equal(currentBeat(s.journey).phase,'outcome');
send({type:'ACT',choice:'brush'});assert.equal(s.journey.completed['cow:brush'],1,'duplicate completion ignored');
s=migrateSave(JSON.parse(JSON.stringify(s)));send({type:'SETTLE'});send({type:'SETTLE'});assert.equal(s.session.round,1,'saved outcome charged once');
send({type:'NEXT'});assert.equal(currentBeat(s.journey).node,'breakfast');assert.equal(s.session.round,1);send({type:'NEXT'});assert.equal(currentBeat(s.journey).node,'breakfast');
send({type:'HERO',hero:'rabbit'});assert.equal(currentBeat(s.journey).node,'wake');send({type:'CHAPTER',node:'school-help'});send({type:'ACT',choice:'go'});assert.equal(currentBeat(s.journey).phase,'help');
send({type:'HERO',hero:'cow'});assert.equal(currentBeat(s.journey).node,'breakfast');send({type:'HERO',hero:'rabbit'});assert.equal(currentBeat(s.journey).phase,'help');
send({type:'ACT',choice:'finish'});assert.equal(s.journey.completed['rabbit:school-help'],1);s.session.round=5;send({type:'NEXT'});assert.equal(s.session.round,6);assert.equal(currentBeat(s.journey).node,'school-water');const atLimit=structuredClone(s);send({type:'ACT',choice:'go'});assert.deepEqual(s,atLimit);
s.session.round=1;s.session.deadline=900;const timedOut=structuredClone(s);send({type:'ACT',choice:'go'});assert.deepEqual(s,timedOut,'expired visit cannot act');
assert.equal(migrateSave(null).journey.hero,'rabbit');assert.equal(migrateSave({session:{},school:null,settings:{minutes:NaN},journey:{bookmarks:{rabbit:{node:'deleted'}}}}).session,null);
const mem=new Map([[SAVE_KEY,JSON.stringify(legacy)]]),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)};const store=createSaveStore(storage);assert.equal(mem.get(SAVE_KEY+'-backup'),JSON.stringify(legacy));const snap=store.getState();snap.settings.minutes=3;assert.equal(store.getState().settings.minutes,7,'snapshots do not mutate saved state');
const future=JSON.stringify({schemaVersion:999,settings:{minutes:7}});mem.set(SAVE_KEY,future);const futureStore=createSaveStore(storage);futureStore.commitLegacy({mode:'day'});assert.equal(mem.get(SAVE_KEY),future,'never overwrite future-version saves');
const denied=createSaveStore({getItem(){throw Error('denied')},setItem(){throw Error('denied')}});denied.dispatch({type:'HERO',hero:'cow'},1000);assert.equal(denied.getState().journey.hero,'cow');assert.equal(denied.isHealthy(),false);
console.log('PASS state: migration, old fields, per-hero checkpoints, legal choices, duplicate/reload receipts, sixth-turn continuation, timeout, future schema and unavailable storage.');
// Audit regressions: chapter revisits, stale input, and backup quota failure.
let chapterState=migrateSave({...legacy,journey:{hero:'rabbit'}});
const advance=event=>chapterState=reduceJourney(chapterState,event,1000);
advance({type:'ACT',choice:'wake'});advance({type:'NEXT'});advance({type:'ACT',choice:'brush'});advance({type:'SETTLE'});
const morning=structuredClone(currentBeat(chapterState.journey)),round=chapterState.session.round;
advance({type:'CHAPTER',node:'walk-school',resume:true});advance({type:'CHAPTER',node:'wake',resume:true});
assert.deepEqual(currentBeat(chapterState.journey),morning,'Chapter selection resumes a completed-but-not-advanced action');assert.equal(chapterState.session.round,round);
advance({type:'NEXT'});const beforeStale=structuredClone(chapterState);
advance({type:'ACT',choice:'eat',at:{hero:'cow',node:'breakfast',phase:'choose'}});assert.deepEqual(chapterState,beforeStale,'Stale hero input ignored');
advance({type:'ACT',choice:'eat'});advance({type:'NEXT'});assert.equal(chapterState.journey.chapters.rabbit.morning.finished,true,'Chapter completed on crossing boundary');
advance({type:'CHAPTER',node:'wake',resume:true});assert.equal(currentBeat(chapterState.journey).node,'wake','Completed chapter can be replayed');
const quota=createSaveStore({getItem:k=>k===SAVE_KEY?JSON.stringify(legacy):null,setItem(){throw Error('quota')}});
assert.deepEqual(quota.getState().session,legacy.session,'A failed backup retains loaded deadline and progress');assert.deepEqual(quota.getState().progress,legacy.progress);
const broken=new Map([[SAVE_KEY,'{broken']]);createSaveStore({getItem:k=>broken.get(k),setItem:(k,v)=>broken.set(k,v)}).commitLegacy({mode:'day'});assert.equal(broken.get(SAVE_KEY+'-invalid-backup'),'{broken');
console.log('PASS audit state: chapter restore/replay, stale input rejection, quota-safe migration and corrupt-save recovery backup.');

// Continuing in story order must also preserve an unfinished later chapter.
let crossing=migrateSave({...legacy,journey:{hero:'rabbit'}});
for(const e of [{type:'CHAPTER',node:'school-help'},{type:'ACT',choice:'go'},{type:'CHAPTER',node:'breakfast'},{type:'ACT',choice:'eat'},{type:'NEXT'}])crossing=reduceJourney(crossing,e,1000);
assert.equal(currentBeat(crossing.journey).node,'school-help');assert.equal(currentBeat(crossing.journey).phase,'help');
console.log('PASS chapter boundary resumes unfinished later work, including story-order continuation.');

assert.equal(migrateSave({}).settings.limitsEnabled,false,'Fresh installs default to free play');
assert.equal(migrateSave({settings:{minutes:7}}).settings.limitsEnabled,false,'Existing users gain free play by default');
let free=migrateSave({...legacy,settings:{...legacy.settings,limitsEnabled:false},session:{...legacy.session,round:12,deadline:0}});
free=reduceJourney(free,{type:'CHAPTER',node:'brush'},30000);free=reduceJourney(free,{type:'ACT',choice:'brush'},30000);free=reduceJourney(free,{type:'NEXT'},30000);
assert.equal(free.session.round,13);assert.equal(currentBeat(free.journey).node,'breakfast');assert.equal(migrateSave(free).session.round,13,'Unlimited rounds survive reload');
console.log('PASS policy: free play default and migration, unlimited reducer beyond six turns and expired deadline; optional limits retained.');
