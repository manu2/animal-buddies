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
 school:'<path d="M9 40 50 9l41 31" fill="#dcaa86"/><path d="M15 40h70v49H15Z" fill="#fff0c4"/><path d="M41 89V60h20v29" fill="#74a99b"/><path d="M23 50h11v13H23Zm44 0h11v13H67Z" fill="#b8e0e3"/>',
 book:'<path d="M10 17q25-7 40 8 15-15 40-8v63q-25-7-40 8-15-15-40-8Z" fill="#f7d999"/><path d="M50 25v62" fill="none"/>'
 };
 return '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false" fill="none" stroke="#285b50" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">'+(paths[kind]||paths.school)+'</svg>';
}
export function schoolScene(hero,id,step){
 const done=step===2,water=id==='water',hello=id==='hello';
 return '<div class="school-scene" role="img" aria-label="School beside a lake. '+(hero==='cow'?'Cow':'Rabbit')+' and their dog teacher. '+(done?SCHOOL[id].done:'')+'">'+
 '<svg class="school-landscape" viewBox="0 0 600 310" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="600" height="310" fill="#e9f2ed"/><circle cx="520" cy="48" r="24" fill="#f5dda0"/><path d="M0 170Q160 75 320 175T600 152V310H0Z" fill="#c0d6ac"/><ellipse cx="493" cy="190" rx="137" ry="40" fill="#96c8cd"/><path d="M391 187h41m35 17h39m11-36h39" stroke="#d4ebdf" stroke-width="4" stroke-linecap="round"/><path d="M35 158 154 57l120 101" fill="#d0a58b" stroke="#587965" stroke-width="4"/><rect x="59" y="145" width="190" height="118" rx="7" fill="#fff0c9" stroke="#587965" stroke-width="4"/><rect x="130" y="174" width="46" height="89" rx="20" fill="#7aa994"/><rect x="80" y="169" width="32" height="34" rx="4" fill="#a9d3cf"/><rect x="193" y="169" width="32" height="34" rx="4" fill="#a9d3cf"/><path d="M153 263q-4 26-52 47h255q-120-14-160-47" fill="#e7d6ad"/><path d="M311 244V147" stroke="#967956" stroke-width="9"/><circle cx="311" cy="129" r="41" fill="#91b68e"/></svg>'+
 '<img class="school-hero '+(done?(hello?'greeting':water?'drinking':'delighted'):'')+'" src="./animals/'+hero+'.svg" alt=""><img class="school-teacher '+(done&&hello?'greeting':'')+'" src="./animals/dog.svg" alt="">'+
 '<span class="school-prop '+(done&&water?'drinking-prop':'')+'">'+prop(hello?'wave':water?(step===0?'bottle':'cup'):(done?'openbox':'box'))+'</span>'+
 (done?'<span class="school-bubble">'+SCHOOL[id].phrase+'</span>':'')+'</div>';
}
