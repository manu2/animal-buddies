import {DAY,CHAPTERS,HEROES,choicesFor} from '../content/day.js';
import {currentBeat} from '../engine/journey.js';
import {SCHOOL,prop,schoolScene,schoolFriend} from '../school.js';
const names={rabbit:'Rabbit',cow:'Cow'};
export function routineIcon(kind,hero='rabbit'){
 if(kind==='food'||kind==='walk')return '<span class="action-sprite day-choice-sprite" role="img" aria-label="'+(kind==='food'?'Eating':'Walking')+'" data-action="'+(kind==='food'?'eat':'walk')+'" style="--sheet:url(./stories/'+hero+'.png);--column:'+(kind==='food'?1:0)+'"></span>';
 const paths={
 sun:'<circle cx="50" cy="50" r="22" fill="#ffdc71"/><path d="M50 5v12m0 66v12M5 50h12m66 0h12M18 18l9 9m46 46 9 9M18 82l9-9m46-46 9-9"/>',
 moon:'<path d="M64 10C19 7 9 54 38 78q29 20 48-8C52 83 33 37 64 10Z" fill="#e9d398"/>',
 brush:'<path d="M12 65h66q10 0 10 9t-10 9H12q-9 0-9-9t9-9Z" fill="#64c5bc"/><path d="M13 65V36h30v29" fill="#fffdf2"/><path d="M20 38v21m8-21v21m8-21v21" stroke="#98a7a0"/><path d="M12 35q3-16 15-10t17 9" fill="#c8efe6"/>',
 bed:'<path d="M10 84V30m80 54V48M10 73h80"/><path d="M12 50h75v20H12Z" fill="#ecb799"/><rect x="14" y="34" width="26" height="17" rx="7" fill="#fff6dc"/>'
 };
 return paths[kind]?'<svg viewBox="0 0 100 100" fill="none" stroke="#365e51" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[kind]+'</svg>':kind==='teacher'?schoolFriend('dog'):prop(kind);
}
export function routineScene(hero,node,phase){
 const outcome=phase==='outcome',action=node.action;
 const pose=action==='eat'&&outcome?'eat':action==='sleep'||action==='wake'&&!outcome?'sleep':'walk';
 const col={walk:0,eat:1,sleep:2}[pose];
 const school=node.id==='walk-school';
 return '<div class="day-scene routine-'+action+' hero-'+hero+'" role="img" aria-label="'+names[hero]+(school?' walking to the lakeside classroom':' at home')+'"><img class="day-background" src="./scenes/'+(school?'lakeside-classroom-v2.png':'animal-home-v1.png')+'" alt=""><span class="day-actor"><span class="action-sprite" data-action="'+pose+'" style="--sheet:url(./stories/'+hero+'.png);--column:'+col+'"></span></span>'+
 (action==='brush'?'<span class="toothbrush" aria-hidden="true">'+routineIcon('brush')+'</span><span class="brush-foam" aria-hidden="true">○</span>':'')+
 (action==='wake'&&outcome?'<span class="morning-wave" aria-hidden="true">'+prop('wave')+'</span>':'')+'</div>';
}
export function dayLobby(journey){
 const b=currentBeat(journey),hero=journey.hero;
 return '<section class="day-lobby"><p class="eyebrow">LEVEL 3 · MY LITTLE DAY</p><h1>A day with '+names[hero]+'</h1><div class="hero-picker" aria-label="Choose your animal">'+HEROES.map(id=>'<button class="hero-option" data-day-hero="'+id+'" aria-pressed="'+(hero===id)+'" aria-label="Play as '+names[id]+'">'+schoolFriend(id)+'<span>'+names[id]+'</span></button>').join('')+'</div><button class="primary compact" id="day-resume">▶ '+(b.finished?'Play another day':'Continue with '+names[hero])+'</button><div class="day-chapters">'+CHAPTERS.map(c=>'<button class="day-chapter" data-chapter="'+c.id+'" aria-label="'+c.title+'"><img src="'+c.art+'" alt=""><span>'+c.title+'</span></button>').join('')+'</div><div class="support-picker"><button data-day-support="explore" aria-pressed="'+(journey.support==='explore')+'">'+prop('wave')+'Explore</button><button data-day-support="listen" aria-pressed="'+(journey.support==='listen')+'">'+prop('ear')+'Listen</button></div><button class="sound" id="day-lobby-listen">🔊 Listen</button><p class="session-note">Choose any part of the day. Your friend remembers where you stopped.</p><details class="day-practice"><summary>School activities to revisit</summary><button class="sound" id="school-entry">Visit Lakeside School</button></details><p class="audio-note" id="audio-note"></p></section>';
}
export function dayScreen(journey){
 const b=currentBeat(journey),node={...DAY[b.node],id:b.node},done=b.phase==='outcome',school=node.kind==='school',m=school?SCHOOL[node.mission]:node;
 const prompt=done?(school?m.phrase:node.model):b.phase==='help'?m.next:m.prompt;
 return '<section class="game school-game day-game"><div class="game-top"><button class="quiet" id="day-back">← My day</button><span class="time-note" id="time-note"></span><button class="quiet" id="stop">Finish</button></div><p class="eyebrow">'+names[journey.hero].toUpperCase()+' · '+node.title.toUpperCase()+'</p><h1 class="question">'+prompt+'</h1>'+
 (school?schoolScene(journey.hero,node.mission,done?2:b.phase==='help'?1:0):routineScene(journey.hero,node,b.phase))+
 (done?'<p class="parent-prompt">'+m.bridge+'</p>':'<div class="school-actions">'+choicesFor(node,b.phase).map(c=>'<button class="school-action" data-day-choice="'+c.id+'" aria-label="'+c.label+'">'+routineIcon(c.icon,journey.hero)+'<span>'+c.label+'</span></button>').join('')+'</div>')+
 '<p class="mission-feedback" id="day-feedback" role="status"></p><div class="sound-controls"><button class="sound" id="listen">🔊 '+(done?'Again':'Listen')+'</button><button class="sound" id="hint" aria-label="Hear Hindi meaning only">🗣️ अर्थ</button></div><p class="audio-note" id="audio-note"></p>'+
 (done?'<button class="primary" id="day-next"><span class="big-arrow" aria-hidden="true">→</span><span class="play-label">'+(node.next?'Next in our day':'Rest for now')+'</span></button>':'')+'</section>';
}
