import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {chromium}=await import(pathToFileURL(process.env.DIRECTOR_PLAYWRIGHT).href);
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1512,height:1000},deviceScaleFactor:1});
const page=await context.newPage(),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)requests.push({url:r.url(),status:r.status()});});
const manifest=JSON.parse(fs.readFileSync(path.join(root,'screens.json'),'utf8')),report=[];
for(const s of manifest){
 await page.setViewportSize({width:Math.ceil(s.width),height:Math.ceil(s.height)});
 await page.goto('http://127.0.0.1:4184/'+s.path);await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
 const result=await page.evaluate(()=>{const frame=document.querySelector('main').getBoundingClientRect();return {width:frame.width,height:frame.height,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),fonts:document.fonts.status,links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),storage:localStorage.length,textNodes:document.querySelectorAll('.text-content').length};});
 const brokenLinks=result.links.filter(h=>!fs.existsSync(path.join(root,h)));
 await page.screenshot({path:path.join(root,'verification','browser-'+s.key+'.png'),animations:'disabled'});
 report.push({key:s.key,...result,brokenLinks,pass:Math.abs(result.width-s.width)<.02&&Math.abs(result.height-s.height)<.02&&!result.images.length&&!brokenLinks.length&&result.storage===0});
}
await page.setViewportSize({width:1512,height:1000});
const journeys=[];
for(const [start,selector,end]of [
 ['feedback-new','a[aria-label="compare-new"]','compare-new'],
 ['darkroom','a[aria-label="darkroom-quick"]','darkroom-quick'],
 ['darkroom-quick','a[aria-label="darkroom-detail"]','darkroom-detail'],
 ['design-studio','a[aria-label="design-studio-quick"]','design-studio-quick'],
 ['compare-library','a[aria-label="compare-library-detail"]','compare-library-detail'],
 ['projects','a[aria-label="project-overview"]','project-overview'],
 ['project-overview','a[aria-label="project-feedback"]','project-feedback'],
 ['prompts','a[aria-label="prompt-edit"]','prompt-edit'],
 ['settings-models','a[aria-label="settings-appearance"]','settings-appearance']
]){await page.goto(`http://127.0.0.1:4184/${start}.html`);try{await page.locator(selector).first().click({timeout:3000});await page.waitForURL(`**/${end}.html`,{timeout:3000});journeys.push({start,end,pass:true});}catch(e){journeys.push({start,end,pass:false,error:e.message.slice(0,150)});}}
await page.goto('http://127.0.0.1:4184/feedback-new.html');await page.setViewportSize({width:800,height:900});
const narrow=await page.evaluate(()=>({viewport:innerWidth,frame:document.querySelector('main').getBoundingClientRect().width,scroll:document.documentElement.scrollWidth}));
await browser.close();
const result={screens:report,journeys,narrow,pageErrors:errors,failedRequests:requests,pass:report.every(r=>r.pass)&&journeys.every(j=>j.pass)&&!errors.length&&!requests.length&&narrow.frame===1512};
fs.writeFileSync(path.join(root,'verification/browser-report.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({screens:report.length,screenFailures:report.filter(r=>!r.pass).map(r=>r.key),journeys,pageErrors:errors,failedRequests:requests,narrow,pass:result.pass},null,2));
if(!result.pass)process.exitCode=1;
