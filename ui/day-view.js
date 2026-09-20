import {ROOMS} from '../content/rooms.js';
import {routineSprite} from './animal-view.js';
import {DAY,CHAPTERS,HEROES,choicesFor} from '../content/day.js';
import {currentBeat} from '../engine/journey.js';
import {SCHOOL,prop,schoolScene,schoolFriend,schoolIcon} from '../school.js';
const names={rabbit:'Rabbit',cow:'Cow'};
export function routineIcon(kind,hero='rabbit'){
 if(kind==='wave'||kind==='teacher')return schoolIcon(kind,hero);
 if(kind==='food')return routineSprite(hero,'eat','day-choice-sprite');
 if(kind==='walk')return '<span class="action-sprite day-choice-sprite" role="img" aria-label="'+(kind==='food'?'Eating':'Walking')+'" data-action="'+(kind==='food'?'eat':'walk')+'" style="--sheet:url(./stories/'+hero+'.png);--column:'+(kind==='food'?1:0)+'"></span>';
 const paths={
 sun:'<circle cx="50" cy="50" r="22" fill="#ffdc71"/><path d="M50 5v12m0 66v12M5 50h12m66 0h12M18 18l9 9m46 46 9 9M18 82l9-9m46-46 9-9"/>',
 moon:'<path d="M64 10C19 7 9 54 38 78q29 20 48-8C52 83 33 37 64 10Z" fill="#e9d398"/>',
 brush:'<path d="M12 65h66q10 0 10 9t-10 9H12q-9 0-9-9t9-9Z" fill="#64c5bc"/><path d="M13 65V36h30v29" fill="#fffdf2"/><path d="M20 38v21m8-21v21m8-21v21" stroke="#98a7a0"/><path d="M12 35q3-16 15-10t17 9" fill="#c8efe6"/>',
 bed:'<path d="M10 84V30m80 54V48M10 73h80"/><path d="M12 50h75v20H12Z" fill="#ecb799"/><rect x="14" y="34" width="26" height="17" rx="7" fill="#fff6dc"/>'
 };
 return paths[kind]?'<svg viewBox="0 0 100 100" fill="none" stroke="#365e51" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>':kind==='teacher'?schoolFriend('dog'):prop(kind);
}
// Two authored frames integrate pillow, animal and quilt; no free-floating sleep sprite.
export function bedroomScene(hero,action,outcome){
 const morning=action==='wake',room=morning?'morning':'bedtime';
 const description=outcome?(morning?'awake in bed, waving good morning with their own paw':'asleep in bed, head on the pillow and body tucked under the quilt'):(morning?'asleep in bed in the morning':'awake in bed, ready to tuck in');
 return '<div class="day-scene bedroom-scene routine-'+action+' hero-'+hero+' '+(outcome?'is-outcome':'is-prompt')+'" data-room="'+room+'" data-bedding="'+(outcome?(morning?'greeting':'asleep'):(morning?'asleep':'awake'))+'" role="img" aria-label="'+names[hero]+' '+description+'" style="--bedroom-sheet:url(./scenes/'+hero+'-'+room+'-v2.png)"><span class="bedroom-frame bedroom-before" aria-hidden="true"></span>'+(outcome?'<span class="bedroom-frame bedroom-after" aria-hidden="true"></span>':'')+'</div>';
}
export function routineScene(hero,node,phase){
 const outcome=phase==='outcome',action=node.action,travel=action==='walk';
 if(action==='sleep'||action==='wake')return bedroomScene(hero,action,outcome);
 const pose=action==='eat'&&outcome?'eat':(action==='sleep'&&outcome)||(action==='wake'&&!outcome)?'sleep':'walk';
 const col={walk:0,eat:1,sleep:2}[pose];
 const destination=ROOMS[node.room].art,source=ROOMS[node.from||node.room].art;
 const background=travel&&!outcome?source:destination;
 const upright=action==='brush'||action==='eat'||action==='wake'&&outcome;
 const routinePose=action==='eat'?'eat':action==='brush'&&outcome?'brush':'idle';
 const description=travel?(outcome?'arrived '+(node.id==='walk-school'?'at school':'home'):'getting ready to walk '+(node.id==='walk-school'?'to school':'home')):action==='sleep'?(outcome?'sleeping on the bed':'awake on the bed at night'):action==='brush'?(outcome?'holding a toothbrush and brushing in the bathroom':'standing in the bathroom, ready to choose a toothbrush'):action==='wake'?(outcome?'awake, saying good morning to you':'asleep on the bed in the morning'):outcome?'eating breakfast at the dining table':'sitting at the dining table, ready for breakfast';
 return '<div class="day-scene routine-'+action+' hero-'+hero+' '+(upright?'upright-routine ':'')+' '+(outcome?'is-outcome':'is-prompt')+'" data-room="'+(travel&&!outcome?node.from:node.room)+'" role="img" aria-label="'+names[hero]+' '+description+'"><img class="day-background" src="'+background+'" alt="">'+
 (travel&&outcome?'<img class="day-background travel-origin" src="'+source+'" alt="">':'')+
 '<span class="day-actor">'+(upright?routineSprite(hero,routinePose):'<span class="action-sprite" data-action="'+pose+'" style="--sheet:url(./stories/'+hero+'.png);--column:'+col+'"></span>')+'</span>'+
 (travel?'<span class="travel-destination" aria-hidden="true"><img src="'+destination+'" alt=""><span>→</span></span>':'')+'</div>';
}
export function dayLobby(journey){
 const b=currentBeat(journey),hero=journey.hero,node=DAY[b.node];
 const started=Object.keys(journey.completed).some(k=>k.startsWith(hero+':'))||b.node!=='wake'||b.phase!=='choose';
 return '<section class="day-lobby"><p class="eyebrow">LEVEL 3 · MY LITTLE DAY</p><h1>A day with '+names[hero]+'</h1><div class="hero-picker" aria-label="Choose your animal">'+HEROES.map(id=>'<button class="hero-option" data-day-hero="'+id+'" aria-pressed="'+(hero===id)+'" aria-label="Play as '+names[id]+'">'+routineSprite(id)+'<span>'+names[id]+'</span></button>').join('')+'</div><button class="primary compact day-resume" id="day-resume">'+routineIcon(b.finished?'sun':node.icon||SCHOOL[node.mission].symbol,hero)+'<span>▶ '+(b.finished?'Play another day':started?'Continue: '+node.title:'Start our morning')+'</span></button><div class="day-chapters">'+CHAPTERS.map(c=>{
  const saved=journey.chapters[hero][c.id],label=saved?.finished?'Play again':saved&&(saved.node!==c.start||saved.phase!=='choose')?'Continue':'Start';
  return '<button class="day-chapter" data-chapter="'+c.id+'" aria-label="'+c.title+' — '+label+'"><span class="chapter-picture"><img src="'+c.art+'" alt=""><span class="chapter-symbol">'+routineIcon(c.symbol)+'</span></span><strong>'+c.title+'</strong><small>'+label+'</small></button>';
 }).join('')+'</div><div class="support-picker"><button data-day-support="explore" aria-pressed="'+(journey.support==='explore')+'">'+prop('wave')+'Explore</button><button data-day-support="listen" aria-pressed="'+(journey.support==='listen')+'">'+prop('ear')+'Listen</button></div><p class="support-note">'+(journey.support==='explore'?'A gentle picture hint after the spoken cue.':'The spoken cue, with time to choose together.')+'</p><button class="sound" id="day-lobby-listen">🔊 Listen</button><p class="session-note">Each part remembers your place. Finished parts can be played again.</p><details class="day-practice"><summary>School activities to revisit</summary><button class="sound" id="school-entry">Visit Lakeside School</button></details><p class="audio-note" id="audio-note"></p></section>';
}
export function dayScreen(journey){
 const b=currentBeat(journey),node={...DAY[b.node],id:b.node},done=b.phase==='outcome',school=node.kind==='school',m=school?SCHOOL[node.mission]:node;
 const prompt=done?(school?m.phrase:node.model):b.phase==='help'?m.next:m.prompt;
 return '<section class="game school-game day-game"><div class="game-top"><button class="quiet" id="day-back">← My day</button><span class="time-note" id="time-note"></span><button class="quiet" id="stop">Finish</button></div><p class="eyebrow">'+names[journey.hero].toUpperCase()+' · '+node.title.toUpperCase()+'</p><h1 class="question">'+prompt+'</h1>'+
 (school?schoolScene(journey.hero,node.mission,done?2:b.phase==='help'?1:0):routineScene(journey.hero,node,b.phase))+
 (done?'<p class="parent-prompt">'+m.bridge+'</p>':'<div class="school-actions">'+(node.action==='brush'||node.action==='sleep'?[...choicesFor(node,b.phase)].reverse():choicesFor(node,b.phase)).map(c=>'<button class="school-action" data-day-choice="'+c.id+'" aria-label="'+c.label+'">'+routineIcon(c.icon,journey.hero)+'<span>'+c.label+'</span></button>').join('')+'</div>')+
 '<p class="mission-feedback" id="day-feedback" role="status"></p><div class="sound-controls"><button class="sound" id="listen">🔊 '+(done?'Again':'Listen')+'</button><button class="sound" id="hint" aria-label="Hear Hindi meaning only">🗣️ अर्थ</button></div><p class="audio-note" id="audio-note"></p>'+
 (done?'<button class="primary" id="day-next"><span class="big-arrow" aria-hidden="true">→</span><span class="play-label">'+(node.next?'Next in our day':'Rest for now')+'</span></button>':'')+'</section>';
}
