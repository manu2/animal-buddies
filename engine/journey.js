import {DAY,HEROES,CHAPTERS,choicesFor} from '../content/day.js';
const fresh=(node='wake')=>({node,phase:'choose',counted:false,finished:false});
function normalizeBeat(b,fallback='wake'){
 if(!b||!Object.hasOwn(DAY,b.node))return fresh(fallback);
 const phase=['choose','help','outcome'].includes(b.phase)&&!(b.phase==='help'&&DAY[b.node].kind!=='school')?b.phase:'choose';
 return {node:b.node,phase,counted:phase==='outcome'&&b.counted===true,finished:phase==='outcome'&&b.finished===true};
}
export function normalizeJourney(value,legacyHero='rabbit'){
 const raw=value&&typeof value==='object'?value:{};
 const hero=HEROES.includes(raw.hero)?raw.hero:HEROES.includes(legacyHero)?legacyHero:'rabbit';
 const bookmarks={},chapters={};
 for(const id of HEROES){
  bookmarks[id]=normalizeBeat(raw.bookmarks?.[id]);chapters[id]={};
  for(const c of CHAPTERS){const b=raw.chapters?.[id]?.[c.id];if(b&&DAY[b.node]?.chapter===c.id)chapters[id][c.id]=normalizeBeat(b,c.start);}
  // Version 2 had one bookmark per hero: seed its chapter without losing it.
  chapters[id][DAY[bookmarks[id].node].chapter]={...bookmarks[id]};
 }
 const completed={};for(const [id,count] of Object.entries(raw.completed||{}))if(Number.isInteger(count)&&count>=0&&count<1e9)completed[id]=count;
 return {hero,support:raw.support==='listen'?'listen':'explore',bookmarks,chapters,completed};
}
export function currentBeat(journey){return journey.bookmarks[journey.hero];}
export function visitExpired(session,now){return session?.status==='active'&&(session.round>=6||now>=session.deadline);}
// All durable story changes are pure events. Effects cannot advance the story.
export function reduceJourney(state,event,now){
 const next=structuredClone(state),j=next.journey,b=currentBeat(j);
 const remember=()=>{j.chapters[j.hero][DAY[b.node].chapter]={...b};};
 const settle=()=>{if(next.session?.status==='active'&&b.phase==='outcome'&&!b.counted){b.counted=true;next.session.round=Math.min(6,next.session.round+1);}remember();};
 if(event.type==='SETTLE'){settle();return next;}
 if(event.type==='HERO'&&HEROES.includes(event.hero)){settle();j.hero=event.hero;return next;}
 if(event.type==='SUPPORT'&&['explore','listen'].includes(event.support)){j.support=event.support;return next;}
 if(event.type==='CHAPTER'&&Object.hasOwn(DAY,event.node)){
  settle();const chapter=DAY[event.node].chapter,saved=j.chapters[j.hero][chapter];
  j.bookmarks[j.hero]=event.resume&&saved&&!saved.finished?{...saved}:fresh(event.node);
  return next;
 }
 if(next.session?.status!=='active'||visitExpired(next.session,now))return state;
 // Reject events from detached buttons or an async callback for an older beat.
 if(event.at&&(event.at.hero!==j.hero||event.at.node!==b.node||event.at.phase!==b.phase))return state;
 const node=DAY[b.node];
 if(event.type==='ACT'&&b.phase!=='outcome'){
  if(!choicesFor(node,b.phase).some(c=>c.id===event.choice)||event.choice==='retry')return state;
  b.phase=node.kind==='school'&&b.phase==='choose'?'help':'outcome';
  if(b.phase==='outcome'){b.counted=false;const key=j.hero+':'+b.node;j.completed[key]=Math.min(999999999,(j.completed[key]||0)+1);}
  remember();
 }else if(event.type==='NEXT'&&b.phase==='outcome'){
  settle();
  if(node.next){
   const nextChapter=DAY[node.next].chapter,crossing=nextChapter!==node.chapter;
   if(crossing)j.chapters[j.hero][node.chapter]={...b,finished:true};
   const saved=crossing&&j.chapters[j.hero][nextChapter];
   j.bookmarks[j.hero]=saved&&!saved.finished?{...saved}:fresh(node.next);
  }else{b.finished=true;remember();}
 }
 return next;
}
