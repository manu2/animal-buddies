import {DAY,HEROES,choicesFor} from '../content/day.js';
const fresh=()=>({node:'wake',phase:'choose',counted:false,finished:false});
export function normalizeJourney(value,legacyHero='rabbit'){
 const raw=value&&typeof value==='object'?value:{};
 const hero=HEROES.includes(raw.hero)?raw.hero:HEROES.includes(legacyHero)?legacyHero:'rabbit';
 const bookmarks={};for(const id of HEROES){const b=raw.bookmarks?.[id];bookmarks[id]=b&&DAY[b.node]?{node:b.node,phase:['choose','help','outcome'].includes(b.phase)?b.phase:'choose',counted:b.counted===true,finished:b.finished===true}:fresh();if(DAY[bookmarks[id].node].kind!=='school'&&bookmarks[id].phase==='help')bookmarks[id].phase='choose';}
 const completed={};for(const [id,count] of Object.entries(raw.completed||{}))if(Number.isInteger(count)&&count>=0&&count<1e9)completed[id]=count;
 return {hero,support:raw.support==='listen'?'listen':'explore',bookmarks,completed};
}
export function currentBeat(journey){return journey.bookmarks[journey.hero];}
export function visitExpired(session,now){return session?.status==='active'&&(session.round>=6||now>=session.deadline);}
// Pure transition: state and time in, new state out. Never audio, DOM, storage or timers.
export function reduceJourney(state,event,now){
 const next=structuredClone(state),j=next.journey,b=currentBeat(j);
 const settle=()=>{if(next.session?.status==='active'&&b.phase==='outcome'&&!b.counted){b.counted=true;next.session.round=Math.min(6,next.session.round+1);}};
 if(event.type==='SETTLE'){settle();return next;}
 if(event.type==='HERO'&&HEROES.includes(event.hero)){settle();j.hero=event.hero;return next;}
 if(event.type==='SUPPORT'&&['explore','listen'].includes(event.support)){j.support=event.support;return next;}
 if(event.type==='CHAPTER'&&DAY[event.node]){settle();j.bookmarks[j.hero]={...fresh(),node:event.node};return next;}
 if(next.session?.status!=='active'||visitExpired(next.session,now))return state;
 const node=DAY[b.node];
 if(event.type==='ACT'&&b.phase!=='outcome'){
  if(!choicesFor(node,b.phase).some(c=>c.id===event.choice)||event.choice==='retry')return state;
  b.phase=node.kind==='school'&&b.phase==='choose'?'help':'outcome';
  if(b.phase==='outcome'){b.counted=false;const key=j.hero+':'+b.node;j.completed[key]=(j.completed[key]||0)+1;}
 }else if(event.type==='NEXT'&&b.phase==='outcome'){
  settle();if(node.next)j.bookmarks[j.hero]={...fresh(),node:node.next};else b.finished=true;
 }
 return next;
}
