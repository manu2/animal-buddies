import {ROOMS} from './rooms.js';
// Stable story IDs are saved on devices. Never rename them without a migration.
export const HEROES = ['rabbit','cow'];
export const CHAPTERS = [
 {id:'morning',title:'Good morning',start:'wake',art:'./scenes/animal-morning-v1.png',symbol:'sun'},
 {id:'school',title:'Off to school',start:'walk-school',art:'./scenes/lakeside-classroom-v2.png',symbol:'school'},
 {id:'home',title:'Home and bedtime',start:'walk-home',art:'./scenes/animal-bedtime-v1.png',symbol:'moon'}
];
export const DAY = {
 wake:{chapter:'morning',room:'morning',kind:'routine',action:'wake',next:'brush',title:'Good morning!',prompt:'Wake up our friend.',model:'Good morning!',icon:'sun',choice:'wake',label:'Wake up',bridge:'Wave and say good morning to each other.'},
 brush:{chapter:'morning',room:'bathroom',kind:'routine',action:'brush',next:'breakfast',title:'Brush together',prompt:'Help our friend brush.',model:'Brush your teeth.',icon:'brush',choice:'brush',label:'Brush teeth',bridge:'Point to your own toothbrush. A grown-up helps you brush.'},
 breakfast:{chapter:'morning',room:'dining',kind:'routine',action:'eat',next:'walk-school',title:'Breakfast time',prompt:'Our friend is hungry. Choose breakfast.',model:'I am eating.',icon:'food',choice:'eat',label:'Eat breakfast',bridge:'At your next meal, try “I am eating.”'},
 'walk-school':{chapter:'school',room:'school',from:'dining',kind:'routine',action:'walk',next:'school-hello',title:'Off to school',prompt:'Let’s walk to meet our friends.',model:'Let’s go to school.',icon:'walk',choice:'walk',label:'Walk to school',bridge:'Talk about who you will meet at your school.'},
 'school-hello':{chapter:'school',kind:'school',mission:'hello',next:'school-help',title:'Meet our teacher'},
 'school-help':{chapter:'school',kind:'school',mission:'help',next:'school-water',title:'Snack with friends'},
 'school-water':{chapter:'school',kind:'school',mission:'water',next:'walk-home',title:'A drink of water'},
 'walk-home':{chapter:'home',room:'home',from:'school',kind:'routine',action:'walk',next:'sleep',title:'Time to go home',prompt:'Let’s walk home together.',model:'Let’s go home.',icon:'walk',choice:'walk',label:'Walk home',bridge:'Tell each other one thing you did today.'},
 sleep:{chapter:'home',room:'bedtime',kind:'routine',action:'sleep',next:null,title:'Good night',prompt:'Our friend is sleepy. Choose the bed.',model:'Good night!',icon:'bed',choice:'sleep',label:'Go to sleep',bridge:'At bedtime, say good night to each other.'}
};
export function choicesFor(node,phase){
 if(node.kind!=='school'){
  const choices=[{id:node.choice,icon:node.icon,label:node.label}];
  // Joining a routine is not a test: wake/travel need only one invitation.
  const alternative={brush:{icon:'ball',label:'Ball'},eat:{icon:'brush',label:'Toothbrush'},sleep:{icon:'ball',label:'Ball'}}[node.action];
  if(alternative)choices.push({id:'retry',...alternative});
  return choices;
 }
 if(phase==='help')return [{id:'finish',icon:node.mission==='hello'?'wave':node.mission==='help'?'box':'cup',label:node.mission==='hello'?'Wave hello':node.mission==='help'?'Open the lunchbox':'Drink water'}];
 return node.mission==='hello'?[{id:'go',icon:'wave',label:'Wave hello'},{id:'go-wave',icon:'teacher',label:'Greet our teacher'}]:node.mission==='help'?[{id:'go',icon:'teacher',label:'Ask our teacher'},{id:'retry',icon:'box',label:'Try the lunchbox'}]:[{id:'go',icon:'bottle',label:'Water'},{id:'retry',icon:'ball',label:'Ball'}];
}
export function storyClips(node,id,phase,language,meaning=false){
 if(node.kind==='school')return ['school-'+node.mission+'-'+(phase==='outcome'?'model':phase==='help'?'step1':'step0')+'-'+(meaning?'hi':phase==='outcome'?'en':language)];
 return ['day-'+id+'-'+(phase==='outcome'?'model':'prompt')+'-'+(meaning?'hi':phase==='outcome'?'en':language)];
}
export function validateStory(nodes=DAY){
 const errors=[];for(const [id,n] of Object.entries(nodes)){
  if(!CHAPTERS.some(c=>c.id===n.chapter))errors.push(id+': unknown chapter');
  if(n.next!==null&&!nodes[n.next])errors.push(id+': missing next node');
  if(!['routine','school'].includes(n.kind))errors.push(id+': unknown kind');
  if(n.kind==='routine'&&(!ROOMS[n.room]||(n.action==='walk'&&!ROOMS[n.from])))errors.push(id+': missing room');
  if(n.kind==='routine'&&(!['wake','brush','eat','walk','sleep'].includes(n.action)||!n.prompt||!n.model||!n.bridge||!n.choice||!n.icon))errors.push(id+': incomplete or unsupported routine');
  if(n.kind==='school'&&!['hello','help','water'].includes(n.mission))errors.push(id+': unknown school mission');
 }
 for(const c of CHAPTERS){const seen=new Set();let id=c.start;while(id&&nodes[id]){if(seen.has(id)){errors.push('cycle at '+id);break;}seen.add(id);id=nodes[id].next;}}
 return errors;
}

export function retryFor(node,id,language){
 if(node.kind==='school')return {text:node.mission==='help'?'The lunchbox is stuck. Our teacher can help.':'That is a ball. Our friend needs water.',clip:'school-'+node.mission+'-retry-'+language};
 const text={brush:'That is a ball. Choose the toothbrush.',breakfast:'That is a toothbrush. Our friend needs breakfast.',sleep:'That is a ball. Our friend is sleepy.'}[id];
 return {text,clip:'day-'+id+'-retry-'+language};
}
