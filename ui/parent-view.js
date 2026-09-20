import {DAY,CHAPTERS,HEROES} from '../content/day.js';
export function dayProgress(journey){
 return '<h3>Our animal days</h3><p class="small">Completed scenes record practice, not understanding or spoken ability. Observations are yours; nothing is unlocked or graded.</p>'+HEROES.map(hero=>{
  const b=journey.bookmarks[hero],name=hero==='rabbit'?'Rabbit':'Cow';
  return '<div class="day-progress-row"><strong>'+name+'</strong><p class="small">'+(b.finished?'Day finished — ready to revisit.':'Saved place: '+DAY[b.node].title+(b.phase==='outcome'?' (action completed)':''))+'</p>'+CHAPTERS.map(c=>'<small>'+c.title+': '+Object.entries(DAY).filter(([,n])=>n.chapter===c.id).reduce((sum,[id])=>sum+(journey.completed[hero+':'+id]||0),0)+' scenes completed</small>').join('')+'<label class="small">Your observation for '+name+'<select data-observe="day:'+hero+'"><option value="">No observation yet</option><option value="help">Needed help</option><option value="comfortable">Comfortable</option><option value="more">Try something harder</option></select></label></div>';
 }).join('');
}
