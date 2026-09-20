import {normalizeJourney,reduceJourney} from './journey.js';
export const SAVE_KEY='animal-buddies-v1',SCHEMA_VERSION=2;
const object=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
export function migrateSave(raw){
 const old=object(raw),settings={minutes:5,group:0,instructionLanguage:'en',...object(old.settings)};
 if(![3,5,7].includes(settings.minutes))settings.minutes=5;
 if(![0,1,2].includes(settings.group))settings.group=0;
 if(!['en','hi'].includes(settings.instructionLanguage))settings.instructionLanguage='en';
 const modes=['day','school','actions','names','sentences','letters'];
 const school={hero:'rabbit',support:'explore',mission:null,step:0,counted:false,...object(old.school)};
 if(!['cow','rabbit'].includes(school.hero))school.hero='rabbit';
 if(!['explore','listen'].includes(school.support))school.support='explore';
 if(!['hello','help','water'].includes(school.mission)||![0,1,2].includes(school.step)){school.mission=null;school.step=0;}
 let session=old.session?structuredClone(old.session):null;
 const animals=['cow','dog','fish','cat','duck','rabbit','elephant','lion'];
 if(session&&(!Number.isFinite(session.deadline)||!Number.isInteger(session.round)||session.round<0||session.round>6||!['active','ended'].includes(session.status)||!Array.isArray(session.targets)||session.targets.length!==6||session.targets.some(id=>!animals.includes(id))))session=null;
 return {...old,schemaVersion:SCHEMA_VERSION,curriculumVersion:3,settings,mode:modes.includes(old.mode)?old.mode:'actions',session,school,progress:{completed:object(old.progress?.completed),observations:object(old.progress?.observations)},journey:normalizeJourney(old.journey,school.hero)};
}
export function createSaveStore(storage){
 let state,healthy=true,readOnly=false;
 try{const raw=storage.getItem(SAVE_KEY);const parsed=JSON.parse(raw||'{}');state=migrateSave(parsed);readOnly=Number(parsed?.schemaVersion)>SCHEMA_VERSION;if(readOnly)healthy=false;if(raw&&parsed?.schemaVersion!==SCHEMA_VERSION&&!storage.getItem(SAVE_KEY+'-backup'))storage.setItem(SAVE_KEY+'-backup',raw);}catch{state=migrateSave({});healthy=false;}
 const save=()=>{if(readOnly)return;try{storage.setItem(SAVE_KEY,JSON.stringify(state));}catch{healthy=false;}};
 return {
  getState:()=>structuredClone(state),isHealthy:()=>healthy,
  // Compatibility boundary for original activities. New story code must use events.
  commitLegacy(fields){state={...state,...structuredClone(fields)};save();},
  dispatch(event,now=Date.now()){state=reduceJourney(state,event,now);save();return structuredClone(state);}
 };
}
