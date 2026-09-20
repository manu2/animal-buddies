// Shared illustrated identity across picture choices, outcomes and goodbye screens.
// Atlas viewports are authored so ears, trunks and tails remain inside the crop.
const EXTRA={fish:[0,0,512,512],cat:[512,0,512,512],duck:[1024,0,512,512],elephant:[0,512,540,512],lion:[535,512,489,512]};
const ORIGINAL=['cow','dog','rabbit'];
export function animalPortrait(id,name,extra=''){
 const original=ORIGINAL.includes(id),box=original?[0,0,512,512]:EXTRA[id];
 if(!box)throw Error('Missing illustrated animal: '+id);
 // Clip the atlas cell itself: a wide outer SVG otherwise exposes its neighbours
 // in the letterboxed area even when the outer viewport has overflow:hidden.
 return '<svg class="animal toon-portrait '+extra+'" role="img" aria-label="'+name+'" viewBox="'+box.join(' ')+'" xmlns="http://www.w3.org/2000/svg"><svg x="'+box[0]+'" y="'+box[1]+'" width="'+box[2]+'" height="'+box[3]+'" viewBox="'+box.join(' ')+'" overflow="hidden"><image href="'+(original?'./stories/'+id+'.png':'./animals/friends-toons-v1.png')+'" width="1536" height="1024"/></svg></svg>';
}
export function routineSprite(hero,pose='idle',extra=''){
 const columns={idle:0,wave:0,brush:1,eat:2};
 return '<span class="routine-sprite '+extra+'" data-pose="'+pose+'" style="--routine-sheet:url(./stories/'+hero+'-routines-v1.png);--routine-column:'+columns[pose]+';--routine-row:'+(pose==='wave'?100:0)+'%" aria-hidden="true"></span>';
}

export function classroomSprite(role,pose='idle'){
 const column={teacher:0,cat:1,duck:2}[role];
 return '<span class="classroom-sprite" data-cast="'+role+'" data-pose="'+pose+'" role="img" aria-label="'+({teacher:'Dog teacher with glasses and a book',cat:'Cat classmate with a book',duck:'Duck classmate with a school bag'}[role])+'" style="--cast-column:'+column+';--cast-row:'+(pose==='wave'?100:0)+'%"></span>';
}
export function drinkingSprite(hero,done=false){
 return '<span class="drinking-sprite" data-drink-hero="'+hero+'" data-pose="'+(done?'drank':'holding-cup')+'" style="--drink-row:'+(hero==='cow'?0:100)+'%;--drink-column:'+(done?100:0)+'%" aria-hidden="true"></span>';
}
