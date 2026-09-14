import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

// Source-bound visual compiler. Figma is build-time input, never persisted app data.
// The geometry/text renderer carries forward the existing Director transcription
// pattern, updated to the live v4 source, explicit trim metadata and original fills.
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const source=read('source/figma.json'), collections=read('source/variables.json');
const contexts=read('source/design-contexts.json');
const all=new Map();
function walk(n,fn){fn(n);for(const c of n.children||[])walk(c,fn);}
for(const p of source.pages)for(const n of p.nodes)walk(n,n=>all.set(n.id,n));
const clone=id=>structuredClone(all.get(id));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const px=x=>`${Math.round((x||0)*1000)/1000}px`;
const variables=new Map(),names=new Map();
for(const c of collections)for(const v of c.variables){variables.set(v.id,v);names.set(v.id,'--'+slug(c.name+'/'+v.name));}
const rgba=p=>{const c=p.color||p;return `rgba(${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)},${(c.a??1)*(p.opacity??1)})`;};
function color(p){const id=p.boundVariables?.color?.id;return names.has(id)&&(p.opacity??1)===1?`var(${names.get(id)},${rgba(p)})`:rgba(p);}
function token(v){let x=Object.values(v.valuesByMode)[0];if(x?.type==='VARIABLE_ALIAS')return `var(${names.get(x.id)})`;if(x&&typeof x==='object'&&'r'in x)return rgba(x);return typeof x==='string'?JSON.stringify(x):String(x);}
fs.writeFileSync(path.join(ROOT,'tokens.css'),`/* Exact v4 collection/path names, no substituted nearby tokens. */\n:root{\n${[...variables.values()].map(v=>`${names.get(v.id)}:${token(v)};`).join('\n')}\n}`);
const imageMap={};
for(const f of fs.readdirSync(path.join(ROOT,'assets/images'))){const data=fs.readFileSync(path.join(ROOT,'assets/images',f));imageMap[crypto.createHash('sha1').update(data).digest('hex')]='assets/images/'+f;}
fs.writeFileSync(path.join(ROOT,'source/image-map.json'),JSON.stringify(imageMap,null,2));
const iconNames=new Set(fs.readdirSync(path.join(ROOT,'../assets/icons')).filter(f=>f.endsWith('.svg')).map(f=>f.slice(0,-4)));
const weights={Light:300,Regular:400,Medium:500,SemiBold:600,Bold:700,ExtraBold:800};
const metricCache=new Map();
function metrics(font){const key=JSON.stringify(font);if(metricCache.has(key))return metricCache.get(key);
 const stem={'Plus Jakarta Sans':'PlusJakartaSans','IBM Plex Mono':'IBMPlexMono'}[font.family];
 const file=path.join(ROOT,'assets/fonts',font.family==='JetBrains Mono'?'JetBrainsMono-Variable.ttf':`${stem}-${font.style}.ttf`);
 if(!fs.existsSync(file))return {cap:.72,asc:1,desc:-.25};
 const b=fs.readFileSync(file),tables={};for(let i=0;i<b.readUInt16BE(4);i++){const off=12+i*16;tables[b.toString('ascii',off,off+4)]=b.readUInt32BE(off+8);}
 const units=b.readUInt16BE(tables.head+18),m={cap:b.readInt16BE(tables['OS/2']+88)/units,asc:b.readInt16BE(tables.hhea+4)/units,desc:b.readInt16BE(tables.hhea+6)/units};metricCache.set(key,m);return m;
}
function textStyle(s){const f=s.fontName||{family:'Plus Jakarta Sans',style:'Regular'},size=s.fontSize||14,lh=s.lineHeight||{},ls=s.letterSpacing||{};
 const line=lh.unit==='PIXELS'?lh.value:lh.unit==='PERCENT'?size*lh.value/100:size*1.3;
 const d={'font-family':`"${f.family}"${f.family==='SF Pro'?',-apple-system,BlinkMacSystemFont':''}`,'font-size':px(size),'font-weight':f.variationSettings?.wght||s.fontWeight||weights[f.style]||400,'line-height':px(line),'letter-spacing':px((ls.value||0)*(ls.unit==='PERCENT'?size/100:1))};
 const fills=(s.fills||[]).filter(p=>p.visible!==false);if(fills.length)d.color=color(fills.at(-1));
 if(f.variationSettings)d['font-variation-settings']=Object.entries(f.variationSettings).map(([k,v])=>`"${k}" ${v}`).join(',');
 if(s.textCase&&s.textCase!=='ORIGINAL')d['text-transform']=({UPPER:'uppercase',LOWER:'lowercase',TITLE:'capitalize'})[s.textCase]||'none';
 if(s.textDecoration==='UNDERLINE')d['text-decoration']='underline';return d;
}
const styles=new Map();function css(d){const str=Object.entries(d).map(([k,v])=>`${k}:${v}`).join(';');if(!styles.has(str))styles.set(str,'f'+styles.size);return styles.get(str);}
const text=n=>n.type==='TEXT'?(n.characters||''):(n.children||[]).map(text).join('');
const screens=[];
function add(key,name,id,section,options={}){screens.push({key,name,nodeId:id,section,root:clone(id),...options});}
add('feedback-new','Director / New Feedback','93:11963','Director');
add('feedback-thinking','Director / Feedback — generating','93:10481','Director');
add('feedback-complete','Director / Feedback + Chat','8013:1517','Director');
add('feedback-detail','Director / Saved Feedback Detail','8025:2480','Director');
add('compare-new','Director / New Compare','93:12069','Director Compare');
add('compare-thinking','Director / Compare — generating','8021:1073','Director Compare');
add('compare-complete','Director / Comparison + Chat','93:10140','Director Compare');
add('compare-detail','Director / Saved Comparison Result','8021:2789','Director Compare');
add('darkroom','Darkroom / Library','93:10790','Darkroom');
add('darkroom-quick','Darkroom / Quick View','4008:2124','Darkroom');
add('darkroom-detail','Darkroom / Feedback Detail','8025:2480','Darkroom',{reuse:'Director canonical Feedback Detail; route context only',referenceId:'4008:1981'});
add('compare-library','Compare / Library','8025:4252','Compare Library');
add('compare-library-detail','Compare / Saved Comparison Result','8021:2789','Compare Library',{reuse:'Canonical saved Comparison Result per contract 8025:5622; replaces misleading single-feedback fixture',referenceId:'8021:2789'});
add('projects','Projects / Library','93:11329','Projects');
add('project-overview','Projects / Detail / Overview','4011:5891','Projects');
add('project-feedback','Projects / Detail / Feedback','93:11503','Projects');
add('project-quick','Projects / Quick View','4008:2124','Projects',{reuse:'Shared Darkroom Quick View / Drawer',referenceId:'93:11705'});
add('project-settings','Project / Settings','4008:1817','Projects');
add('design-studio','Design Studio / Library','93:10790','Design Studio',{domain:'design',reuse:'Clone Darkroom Library per contract 10005:3477'});
add('design-studio-quick','Design Studio / Quick View','4008:2124','Design Studio',{domain:'design',reuse:'Clone shared Darkroom Quick View per contract 10005:3477'});
add('design-studio-detail','Design Studio / Feedback Detail','8025:2480','Design Studio',{domain:'design',reuse:'Clone canonical Feedback Detail per contracts 10005:3477 and 8025:5650'});
add('prompts','Prompts / Library','2001:3499','Prompts');
add('prompt-edit','Prompts / Edit','4013:3610','Prompts');
add('settings-personalisation','Settings / Personalisation','2001:3674','Settings');
add('settings-appearance','Settings / Appearance','4016:4128','Settings');
add('settings-models','Settings / Models','4016:4265','Settings');
add('prompt-editor-reference','Prompt editor / All controls','8025:905','Component reference');

// Explicit reuse is resolved here once. The same renderer and node template serve
// all domains; only approved domain/context copy changes. No extra screens inferred.
function domainText(s){return s.replace(/Darkroom Feedback/g,'Design Studio Feedback').replace(/DARKROOM/g,'DESIGN STUDIO').replace(/Saved photography feedback and comparisons\./g,'Saved design feedback and comparisons.').replace(/photography/gi,'design').replace(/photograph/gi,'design').replace(/FOTO/g,'DESIGN');}
for(const s of screens){if(s.domain==='design'){
 walk(s.root,n=>{if(n.type==='TEXT'){n.characters=domainText(n.characters);n.segments?.forEach(seg=>seg.characters=domainText(seg.characters));}});
 // Switch the cloned sidebar with the exact existing active/inactive type styles.
 let active,inactive;walk(s.root,n=>{if(n.name==='Navigation / Item'){if(text(n).trim()==='Darkroom')active=n;if(text(n).trim()==='Design Studio')inactive=n;}});
 if(active&&inactive){let activeText,inactiveText;walk(active,n=>{if(n.type==='TEXT')activeText=n;});walk(inactive,n=>{if(n.type==='TEXT')inactiveText=n;});
  const a=structuredClone(activeText),b=structuredClone(inactiveText);
  for(const [target,style]of [[activeText,b],[inactiveText,a]]){for(const k of ['fontName','fontWeight','textStyleId','fills'])target[k]=structuredClone(style[k]);target.segments?.forEach(seg=>{for(const k of ['fontName','fontWeight','fills'])seg[k]=structuredClone(style[k]);});}
 }
}}

function route(n,s,anc){const copy=text(n).trim(),up=copy.toUpperCase();
 if(n.name==='Navigation / Item')return {Director:'feedback-new','Design Studio':'design-studio',Darkroom:'darkroom',Compare:'compare-library',Projects:'projects',Prompts:'prompts',Settings:'settings-models'}[copy];
 if(n.name==='Navigation / Tab'||n.name==='Tab'||(n.type==='TEXT'&&anc.some(a=>/navigation|tabs|settings/i.test(a)))){
  if(s.key.startsWith('settings-'))return {Model:'settings-models',Models:'settings-models',Personalisation:'settings-personalisation',Appearance:'settings-appearance',Prompts:'prompts'}[copy];
  if(s.key.startsWith('project-'))return {Overview:'project-overview',Feedback:'project-feedback'}[copy];
  if(s.section==='Director'||s.section==='Director Compare')return {Feedback:'feedback-new','Single Feedback':'feedback-new',Compare:'compare-new'}[copy];
 }
 if(n.name==='UI / File Thumb')return s.section==='Projects'?'project-quick':s.domain==='design'?'design-studio-quick':'darkroom-quick';
 if(n.name==='UI / Card'&&s.key==='prompts')return 'prompt-edit';
 if(n.name==='UI / Card'&&s.key==='projects')return 'project-overview';
 if(s.key==='compare-library'&&n.type==='TEXT'&&copy==='Need to compare two images for gallery')return 'compare-library-detail';
 if(n.name==='button-close')return {'prompt-edit':'prompts','project-quick':'project-feedback','darkroom-quick':'darkroom','design-studio-quick':'design-studio'}[s.key];
 if(n.name==='pencil')return s.key==='prompts'?'prompt-edit':s.section==='Projects'?'project-settings':undefined;
 if(n.name==='UI / Button'||(n.type==='TEXT'&&up.startsWith('BACK TO'))){
  if(up.includes('BACK TO DARKROOM'))return 'darkroom';
  if(up.includes('BACK TO DESIGN STUDIO'))return 'design-studio';
  if(up.includes('BACK TO PROJECTS'))return 'projects';
  if(up==='NEW FEEDBACK'||up==='ADD NEW FEEDBACK'||up==='ASK FOR NEW FEEDBACK')return s.key.includes('compare')?'compare-new':'feedback-new';
  if(up==='NEW COMPARISON'||up==='CLEAR')return 'compare-new';
  if(up==='ADD NEW'&&s.key==='compare-library')return 'compare-new';
  if(up==='ADD NEW PROJECT')return 'project-settings';
  if(up==='VIEW PROJECT')return 'project-overview';
  if(up==='ADD PROMPT')return 'prompt-edit';
  if(up==='VIEW FULL FEEDBACK'||up==='VIEW FFULL FEEDBACK')return s.domain==='design'?'design-studio-detail':s.section==='Projects'?'feedback-detail':'darkroom-detail';
  if(up==='CANCEL')return s.key==='prompt-edit'?'prompts':s.key==='project-settings'?'project-overview':undefined;
 }
 if(n.type==='TEXT'&&copy==='See all'&&s.key==='project-overview')return 'project-feedback';
}
const issues=new Set();
function render(n,parent,s,anc=[],linked=false){if(n.visible===false)return '';
 const b=n.absoluteBoundingBox||{x:n.x,y:n.y,width:n.width,height:n.height},isText=n.type==='TEXT';
 const d={left:px(b.x-parent.x),top:px(b.y-parent.y),width:px(b.width),height:px(b.height)};
 const icon=iconNames.has(n.name)&&['VECTOR','BOOLEAN_OPERATION','STAR','FRAME','INSTANCE'].includes(n.type);
 if(n.opacity!==1&&n.opacity!==undefined)d.opacity=n.opacity;
 if(n.clipsContent)d.overflow='hidden';
 if(n.type==='ELLIPSE')d['border-radius']='50%';else if(n.cornerRadius!==undefined)d['border-radius']=px(n.cornerRadius);else if(n.topLeftRadius!==undefined)d['border-radius']=[n.topLeftRadius,n.topRightRadius,n.bottomRightRadius,n.bottomLeftRadius].map(px).join(' ');
 let inner='',backgrounds=[];
 if(!isText&&!icon){for(const f of (n.fills||[]).filter(p=>p.visible!==false).toReversed()){
  if(f.type==='SOLID')backgrounds.push(`linear-gradient(${color(f)},${color(f)})`);
  else if(f.type==='IMAGE'){
   const url=imageMap[f.imageHash];if(!url){issues.add('Missing image '+f.imageHash);continue;}
   const t=f.imageTransform;if(f.scaleMode==='CROP'&&t&&t[0][1]===0&&t[1][0]===0){
    const a=t[0][0],z=t[1][1];inner+=`<div class="image-clip"><img class="source-image" alt="" draggable="false" src="${url}" style="width:${100/a}%;height:${100/z}%;left:${-100*t[0][2]/a}%;top:${-100*t[1][2]/z}%"></div>`;
   }else {backgrounds.push(`url("${url}")`);d['background-size']=f.scaleMode==='FIT'?'contain':'cover';d['background-position']='center';d['background-repeat']='no-repeat';}
  }else if(f.type==='GRADIENT_LINEAR'){const t=f.gradientTransform;let angle=180;if(t)angle=90+Math.atan2(-t[0][1],t[0][0])*180/Math.PI;backgrounds.push(`linear-gradient(${angle}deg,${f.gradientStops.map(st=>`${rgba(st.color)} ${st.position*100}%`).join(',')})`);}
 }
 if(backgrounds.length)d['background-image']=backgrounds.join(',');
 const strokes=(n.strokes||[]).filter(p=>p.visible!==false);if(strokes.length){const c=color(strokes.at(-1));const w=n.strokeWeight;
  if(n.type==='LINE'){d.height=px(w||1);d['background-color']=c;}
  else if(w!==undefined&&w>0)d['box-shadow']=`inset 0 0 0 ${px(w)} ${c}`;
  else {const edges=[['Top',0,1],['Right',-1,0],['Bottom',0,-1],['Left',1,0]];d['box-shadow']=edges.filter(([e])=>n['stroke'+e+'Weight']>0).map(([e,x,y])=>`inset ${px(x*n['stroke'+e+'Weight'])} ${px(y*n['stroke'+e+'Weight'])} ${c}`).join(',')||'none';}
 }
 const shadows=[];for(const fx of n.effects||[]){if(fx.visible===false)continue;
  if(['DROP_SHADOW','INNER_SHADOW'].includes(fx.type))shadows.push(`${fx.type==='INNER_SHADOW'?'inset ':''}${px(fx.offset?.x)} ${px(fx.offset?.y)} ${px(fx.radius)} ${px(fx.spread)} ${rgba(fx.color)}`);
  if(fx.type==='LAYER_BLUR')d.filter=`blur(${px(fx.radius)})`;
  if(fx.type==='BACKGROUND_BLUR')d['backdrop-filter']=`blur(${px(fx.radius)})`;
 }if(shadows.length)d['box-shadow']=[d['box-shadow'],...shadows].filter(Boolean).join(',');
 }
 if(isText){const first=n.segments?.[0]||n;Object.assign(d,textStyle(first));d['white-space']='pre-wrap';d['text-align']=(n.textAlignHorizontal||'left').toLowerCase();
  const size=first.fontSize||14,line=parseFloat(textStyle(first)['line-height']),m=metrics(first.fontName||{family:'Plus Jakarta Sans',style:'Regular'});
  const trimmed=n.leadingTrim==='CAP_HEIGHT'||(n.leadingTrim===undefined&&(b.height<line-2||Math.abs(b.height%line-size*m.cap)<1.1));
  const offset=trimmed?(line-size*(m.asc-m.desc))/2+size*m.asc-size*m.cap:0;
  if(n.textAutoResize==='TRUNCATE'){d.overflow='hidden';}
  const spans=(n.segments?.length?n.segments:[{...n,characters:n.characters||''}]).map(seg=>`<span class="${css(textStyle(seg))}">${escape(seg.characters)}</span>`).join('');
  const clamp=n.textAutoResize==='TRUNCATE'?`display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:${Math.max(1,Math.round((b.height+line-size*m.cap)/line))};overflow:hidden;`:'';
  inner=`<span class="text-content" style="top:${px(-offset)};width:calc(100% + 1px);${clamp}">${spans}</span>`;
 }else if(icon){if(n.name==='status-active'){d.left=px(b.x-parent.x-3);d.top=px(b.y-parent.y-3);d.width=px(b.width+6);d.height=px(b.height+6);}inner=`<img class="icon" src="/assets/icons/${escape(n.name)}.svg" alt="" draggable="false">`;}
 const target=linked?undefined:route(n,s,anc);
 if(!isText&&!icon)inner+=(n.children||[]).map(c=>render(c,b,s,[...anc,n.name],linked||!!target)).join('');
 if(s.domain==='design'&&n.name==='Navigation / Item'){
  const t=text(n).trim();if(t==='Design Studio'){d['box-shadow']='inset 2px 0 var(--color-ui-accent-primary)';d.color='var(--color-ui-text-primary)';}
  else if(t==='Darkroom')d['box-shadow']='none';
 }
 const tag=target?'a':'div',attrs=target?` href="${target}.html" aria-label="${escape(target)}"`:'';
 return `<${tag} class="node ${css(d)}" data-node="${escape(n.id)}" data-name="${escape(n.name)}"${attrs}>${inner}</${tag}>`;
}
const manifest=[];
for(const s of screens){const root=s.root,b=root.absoluteBoundingBox;const html=render(root,b,s);
 const doc=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(s.name)} — Director v4 visual review</title><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="visual.css"><script defer src="preview.js"></script></head><body data-screen="${s.key}" data-visual-only="true"><main class="source-frame" aria-label="${escape(s.name)}" style="width:${px(b.width)};height:${px(b.height)}">${html}</main></body></html>`;
 fs.writeFileSync(path.join(ROOT,s.key+'.html'),doc);
 manifest.push({key:s.key,name:s.name,path:s.key+'.html',section:s.section,nodeId:s.nodeId,referenceId:s.referenceId||s.nodeId,width:b.width,height:b.height,reuse:s.reuse||null,domain:s.domain||null});
}
let fontCSS='';for(const f of fs.readdirSync(path.join(ROOT,'assets/fonts')).filter(f=>f.endsWith('.ttf'))){const family=f.startsWith('Plus')?'Plus Jakarta Sans':f.startsWith('IBM')?'IBM Plex Mono':'JetBrains Mono';const weight=f.startsWith('Jet')?'100 800':weights[f.split('-')[1].replace('.ttf','')];fontCSS+=`@font-face{font-family:"${family}";src:url("assets/fonts/${f}") format("truetype");font-weight:${weight};font-style:normal;font-display:block}\n`;}
fs.writeFileSync(path.join(ROOT,'visual.css'),`/* Real HTML/CSS from the authoritative v4 source. Fixed Figma geometry. */
*{box-sizing:border-box}html,body{margin:0;padding:0;background:#171717;color:#f2f0ed;-webkit-font-smoothing:antialiased}body{font-family:"Plus Jakarta Sans",sans-serif}.source-frame{position:relative;isolation:isolate}.node{position:absolute;margin:0;padding:0;border:0;color:inherit;text-decoration:none}.text-content{display:block;position:relative}.image-clip{position:absolute;inset:0;overflow:hidden}.source-image{position:absolute;max-width:none}.icon{display:block;width:100%;height:100%}a.node{cursor:pointer}a.node:focus-visible{outline:2px solid #b95a36;outline-offset:2px}.thinking{animation:thinking-pulse 1.6s ease-in-out infinite}@keyframes thinking-pulse{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){.thinking{animation:none}}
${fontCSS}${[...styles].map(([rule,name])=>`.${name}{${rule}}`).join('\n')}`);
fs.writeFileSync(path.join(ROOT,'screens.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(ROOT,'verification/source-issues.json'),JSON.stringify([...issues],null,2));
for(const [id,c]of Object.entries(contexts))if(c.image)fs.writeFileSync(path.join(ROOT,'verification',`figma-${id.replace(':','-')}.png`),Buffer.from(c.image.data,'base64'));
const sections=[...new Set(manifest.map(s=>s.section))];
const links=sections.map(section=>`<h2>${escape(section)}</h2><ul>${manifest.filter(s=>s.section===section).map(s=>`<li><a href="${s.path}">${escape(s.name)}</a> <small>${s.width} × ${s.height}${s.reuse?' · shared pattern':''}</small></li>`).join('')}</ul>`).join('');
fs.writeFileSync(path.join(ROOT,'index.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Director v4 — Visual review</title><link rel="stylesheet" href="visual.css"><style>body{padding:40px;max-width:1100px}h1{font-size:28px;font-weight:500}h2{margin-top:32px;font-size:18px}p{line-height:1.7;color:#a8a6a3}li{margin:12px 0}a{color:#f2f0ed}small{color:#a8a6a3;margin-left:12px}</style></head><body><h1>Director v4 — Visual review</h1><p>Review index, outside the product interface. All supplied product states and explicit clones are available below. Screens keep their Figma dimensions; narrower windows scroll. Navigation and transient field editing are available for review. Generation, saves, deletes and connection tests are inactive; nothing is persisted. Model status, text, images and repeated cards are visual fixtures.</p><p>27 views · 25 Build Contracts · 520 exact source tokens. <a href="source/BUILD-CONTRACTS.md">Read contracts</a> · <a href="SOURCE-NOTES.md">Source and reuse notes</a></p>${links}</body></html>`);
const notes=read('source/build-contracts.json');const contracts=notes.flatMap(p=>p.notes.filter(n=>n.text?.includes('BUILD CONTRACT')).map(n=>`## ${p.page} — ${n.id}\n\n${n.text}\n`));
fs.writeFileSync(path.join(ROOT,'source/BUILD-CONTRACTS.md'),'# Director v4 — Build Contracts\n\nRead before implementation. Source file '+source.fileKey+'.\n\n'+contracts.join('\n'));
console.log(JSON.stringify({screens:manifest.length,tokens:variables.size,styles:styles.size,contracts:contracts.length,issues:[...issues]},null,2));
if(issues.size)process.exitCode=1;
