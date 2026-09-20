import {animalPortrait} from './animal-view.js';
// Same prompt -> choice -> quiet outcome rhythm as the day story.
export function familiarView({mode,animal,choices,animals,correct,wrong,round}){
 const letters=mode==='letters',sentences=mode==='sentences';
 const heading=correct?(letters?animal.letter+' is for '+animal.name:sentences?animal.sentence:animal.name):letters?'Find '+animal.letter:sentences?animal.sentence:'Where is the '+animal.name.toLowerCase()+'?';
 const dots=Array.from({length:6},(_,i)=>'<span class="step '+(i<round?'complete':i===round?'current':'')+'"></span>').join('');
 return '<section class="game familiar-game"><div class="game-top"><button class="quiet" id="familiar-back">← Levels</button><span class="time-note" id="time-note"></span><button class="quiet" id="stop">Finish</button></div><p class="eyebrow">'+(letters?'LETTER PLAY':sentences?'LITTLE SENTENCES':'MEET THE ANIMALS')+'</p><h1 class="question">'+heading+'</h1>'+
 (correct?'<div class="familiar-outcome">'+(letters?'<span class="familiar-letter">'+animal.letter+'<small>'+animal.letter.toLowerCase()+'</small></span>':'')+animalPortrait(animal.id,animal.name)+'</div><p class="parent-prompt">'+(letters?'Notice this letter together. No reading needed.':sentences?'Act it out together, or just watch and listen.':'Point, wave, or say hello together.')+'</p>':
 '<div class="choices '+(letters?'letter-choices':'')+'">'+choices.map(value=>'<button class="choice" data-choice="'+value+'" aria-label="'+(letters?'Letter '+value:animals.find(a=>a.id===value).name)+'">'+(letters?'<span class="letter">'+value+'</span>':animalPortrait(value,animals.find(a=>a.id===value).name))+'</button>').join('')+'</div>')+
 '<p class="familiar-feedback" role="status">'+(wrong?'Let’s listen and look again.':'')+'</p><div class="sound-controls"><button class="sound" id="listen">🔊 '+(correct?'Again':'Listen')+'</button><button class="sound" id="hint" lang="hi" aria-label="Hear Hindi meaning only">🗣️ अर्थ</button></div><p class="audio-note" id="audio-note" role="status"></p>'+
 (correct?'<button class="primary" id="next"><span class="big-arrow" aria-hidden="true">→</span><span class="play-label">'+(round===5?'Say goodbye':'Next friend')+'</span></button>':'')+
 '<div class="steps familiar-progress" aria-label="Turn '+(round+1)+' of 6">'+dots+'</div></section>';
}
