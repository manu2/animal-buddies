// Authored offline content. IDs remain stable for saved checkpoints.
export const SCHOOL = {
 hello:{title:'Meet a friend',symbol:'wave',phrase:'Hello!',meaning:'नमस्ते!',prompt:'Say hello to our teacher.',next:'Wave to our teacher.',done:'You said hello.',bridge:'Wave and say hello to someone together.'},
 help:{title:'Ask for help',symbol:'box',phrase:'Help me, please.',meaning:'मेरी मदद करो, प्लीज़।',prompt:'The lunchbox is stuck. Ask our teacher for help.',next:'Our teacher can help. Open the lunchbox.',done:'We opened it together.',bridge:'Try asking for help with a real bag or box.'},
 water:{title:'Ask for water',symbol:'bottle',phrase:'I want water.',meaning:'मुझे पानी चाहिए।',prompt:'Our friend is thirsty. Choose some water.',next:'Here is your water. Tap the cup to drink.',done:'Our friend had a drink.',bridge:'At snack time, try asking for water together.'}
};
export function prop(kind){
 const paths={
 wave:'<path d="M28 66V38q0-9 8-7V14q0-8 7-8t7 8v16-20q0-8 7-7t6 8v20-15q0-8 7-7t6 8v22-10q0-8 7-6t6 8v24q0 31-30 31-19 0-31-20Z" fill="#f7cf83"/><path d="M13 31Q5 45 14 58M91 12q9 9 5 20" fill="none"/>',
 box:'<rect x="12" y="32" width="76" height="50" rx="12" fill="#efab75"/><path d="M12 49h76M36 32v-9q0-10 14-10t14 10v9" fill="none"/><rect x="43" y="42" width="14" height="17" rx="4" fill="#ffefb3"/>',
 openbox:'<path d="M14 48 7 22q0-9 10-9h59q9 0 10 9l-1 26" fill="#f1c9a2"/><rect x="12" y="42" width="76" height="42" rx="12" fill="#efab75"/><path d="M35 61h30" fill="none"/><path d="m37 38 15-12 13 12" fill="#fff1c1"/>',
 bottle:'<path d="M39 24V10h22v14l9 12v47q0 8-9 8H39q-9 0-9-8V36Z" fill="#b7e3e5"/><path d="M31 53h38v29H31" fill="#65b7cf"/><rect x="37" y="6" width="26" height="13" rx="4" fill="#348875"/><path d="M42 34v10" stroke="#fff"/>',
 cup:'<path d="M20 26h49l-5 57H27Z" fill="#b7e3e5"/><path d="M69 35h9q20 0 9 23-6 8-20 6" fill="none"/><path d="M25 49h40l-3 30H29Z" fill="#65b7cf"/>',
 ball:'<circle cx="50" cy="50" r="36" fill="#f4c868"/><path d="M17 35q32 8 45-20M28 80q7-36 56-36M51 15q-10 30 21 63" fill="none" stroke="#cd815f"/>',
 teacher:'<circle cx="50" cy="31" r="19" fill="#d7b28c"/><path d="M22 91V74q0-22 28-22t28 22v17" fill="#73a88f"/><path d="M39 30h5m12 0h5M43 41q7 6 14 0" fill="none"/><path d="m14 56 13 12M13 42v12m-8-6 8 6" fill="none"/>',
 ear:'<path d="M30 71q0-13-9-25C1 11 70-7 78 33q3 18-15 31-9 5-11 18-4 18-21 6" fill="#f7d5a0"/><path d="M34 45q-10-22 12-24 22 0 13 23l-13 8v14" fill="none"/>',
 school:'<ellipse cx="55" cy="78" rx="38" ry="12" fill="#f1c58c"/><path d="M7 31q37-12 86 0v19H7" fill="#9bd4df" stroke="none"/><path d="m16 86 7-69m33 69-6-69" fill="none"/><rect x="13" y="12" width="49" height="48" rx="5" fill="#476e60" stroke="#b98a58" stroke-width="7"/><circle cx="37" cy="34" r="8" stroke="#f9df91"/><path d="M37 20v-3m0 34v-3M23 34h-3m34 0h-3" stroke="#f9df91"/>',
 book:'<path d="M10 17q25-7 40 8 15-15 40-8v63q-25-7-40 8-15-15-40-8Z" fill="#f7d999"/><path d="M50 25v62" fill="none"/>'
 };
 return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" stroke="#285b50" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">'+(paths[kind]||paths.school)+'</svg>';
}
// Reuse the original illustrated action characters, not the unrelated icon set.
export function schoolFriend(id,extra=''){
 return '<span class="school-character '+extra+'" role="img" aria-label="'+({cow:'Cow',rabbit:'Rabbit',dog:'Dog teacher'}[id])+'" style="--friend-sheet:url(./stories/'+id+'.png)"></span>';
}
export function schoolScene(hero,id,step,preview=false){
 const done=step===2,water=id==='water',hello=id==='hello';
 return '<div class="school-scene '+(preview?'school-preview':'')+'" role="img" aria-label="An outdoor classroom under a tree beside a blue lake, with a picture board, books and a story rug. '+(hero==='cow'?'Cow':'Rabbit')+' and their dog teacher on the dry classroom rug. '+(done?SCHOOL[id].done:'')+'">'+
 '<img class="school-landscape" src="./scenes/lakeside-classroom-v2.png" alt="">'+
 '<span class="school-hero">'+schoolFriend(hero)+'</span><span class="school-teacher">'+schoolFriend('dog')+'</span>'+
 (!preview?'<span class="school-prop '+(done&&water?'drinking-prop':'')+'">'+prop(hello?'wave':water?(step===0?'bottle':'cup'):(done?'openbox':'box'))+'</span>':'')+
 (done?'<span class="school-bubble">'+SCHOOL[id].phrase+'</span>':'')+'</div>';
}
