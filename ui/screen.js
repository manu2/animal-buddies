// A new screen starts at its heading, even after entering from a scrolled lobby.
export function renderMain(markup){
 document.getElementById('main').innerHTML=markup;
 window.scrollTo({top:0,left:0,behavior:'instant'});
}

// A queued event from a replaced screen must never act on the current story.
export function onTap(element,handler){
 if(element)element.onclick=event=>{
  if(!element.isConnected||document.hidden||document.querySelector('dialog[open]'))return;
  handler(event);
 };
}
