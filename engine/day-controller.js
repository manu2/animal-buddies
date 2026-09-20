import {DAY,CHAPTERS,storyClips,retryFor} from '../content/day.js';
import {currentBeat} from './journey.js';
import {dayLobby,dayScreen} from '../ui/day-view.js';
// Runtime effects are injected. Content and reducers remain independently testable.
export function createDayController(host){
 const $=id=>document.getElementById(id);
 let screen='lobby',generation=0;
 const cancel=()=>{generation++;host.cancel();};
 const journey=()=>host.read().journey;
 function lobby(){cancel();screen='lobby';host.setScreen('day-lobby');$('main').innerHTML=dayLobby(journey());
  document.querySelectorAll('[data-day-hero]').forEach(el=>el.onclick=()=>{host.send({type:'HERO',hero:el.dataset.dayHero});lobby();host.play([el.dataset.dayHero+'-name']);});
  document.querySelectorAll('[data-day-support]').forEach(el=>el.onclick=()=>{host.send({type:'SUPPORT',support:el.dataset.daySupport});lobby();});
  document.querySelectorAll('[data-chapter]').forEach(el=>el.onclick=()=>{host.send({type:'CHAPTER',node:CHAPTERS.find(c=>c.id===el.dataset.chapter).start,resume:true});begin();});
  $('day-resume').onclick=()=>{if(currentBeat(journey()).finished)host.send({type:'CHAPTER',node:'wake'});begin();};
  $('day-lobby-listen').onclick=()=>host.play(['day-lobby-'+host.language()]);
  $('school-entry').onclick=()=>host.schoolPractice(journey().hero);
 }
 async function begin(){cancel();const run=generation,token=host.token();const valid=()=>run===generation&&token===host.token();if(!await host.ensureVisit(valid)||!valid())return;render();narrate();}
 function render(){cancel();screen='beat';host.setScreen('game');$('main').innerHTML=dayScreen(journey());
  $('day-back').onclick=()=>{host.send({type:'SETTLE'});if(!host.stopIfExpired())lobby();};
  $('stop').onclick=host.finish;$('listen').onclick=narrate;$('hint').onclick=meaning;
  const b=currentBeat(journey()),at={hero:journey().hero,node:b.node,phase:b.phase};
  document.querySelectorAll('[data-day-choice]').forEach(el=>el.onclick=()=>choose(el.dataset.dayChoice,at));
  if($('day-next'))$('day-next').onclick=()=>{cancel();host.send({type:'NEXT',at});if(host.stopIfExpired())return;if(currentBeat(journey()).finished)lobby();else{render();narrate();}};
  host.updateTime();
 }
 function choose(choice,at){
  const current=currentBeat(journey());if(!host.isActive()||at.hero!==journey().hero||at.node!==current.node||at.phase!==current.phase)return;
  if(host.stopIfExpired())return;
  if(choice==='retry'){cancel();const b=currentBeat(journey()),feedback=retryFor(DAY[b.node],b.node,host.language());$('day-feedback').textContent=feedback.text;host.play([feedback.clip]);return;}
  host.send({type:'ACT',choice,at});render();narrate();
 }
 async function narrate(){
  if(screen!=='beat'||!host.isActive())return;cancel();const run=generation,token=host.token(),j=journey(),b=currentBeat(j),node=DAY[b.node];
  const valid=()=>run===generation&&token===host.token()&&screen==='beat'&&host.isActive()&&!document.hidden;
  const clips=storyClips(node,b.node,b.phase,host.language());
  if(node.kind==='school'&&b.phase==='help')clips.unshift('school-'+node.mission+'-model-en');
  if(b.phase==='outcome')await Promise.all([host.play(clips),host.animate(node,b)]);else await host.play(clips);
  if(!valid()||b.phase==='outcome'||j.support!=='explore')return;
  const option=document.querySelector('[data-day-choice]:not([data-day-choice="retry"])');option?.classList.add('demonstrating');
  await host.pause(1200);if(!valid())return;
  if(node.kind==='routine'&&node.action==='walk')await host.preview(option?.querySelector('.action-sprite'));
  if(!valid())return;
  if(node.kind==='school'&&b.phase==='choose')await host.play(['school-'+node.mission+'-example-'+host.language()]);
  option?.classList.remove('demonstrating');
 }
 function meaning(){cancel();const b=currentBeat(journey());host.play(storyClips(DAY[b.node],b.node,b.phase,host.language(),true));}
 return {lobby,begin,render,narrate,meaning,cancel};
}
