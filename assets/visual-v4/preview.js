// Visual-stage affordances only. No API, model calls, storage or data mutations.
(() => {
 const screen=document.body.dataset.screen;
 const nodes=[...document.querySelectorAll('[data-name]')];
 if(screen.endsWith('-thinking')){
  for(const n of nodes)if(n.children.length===1&&/^(WRITING FEEDBACK|COMPARING IMAGES|\.{3,})$/.test(n.textContent.trim()))n.classList.add('thinking');
 }
 // Supplied fields can be edited transiently to inspect text fit. A reload resets
 // the visual fixture. Save and model actions stay inactive at this approval gate.
 for(const n of nodes){
  if(['prompt-textarea','textarea','prompt-textarea-group'].includes(n.dataset.name)){
   const t=n.querySelector('.text-content');if(t){t.contentEditable='true';t.setAttribute('role','textbox');t.setAttribute('aria-label','Prompt preview');t.spellcheck=false;}
  }
 }
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&/quick|prompt-edit|project-settings/.test(screen)){const close=document.querySelector('[data-name="button-close"]');if(close?.closest('a'))location.href=close.closest('a').href;}});
})();
