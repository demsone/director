// Phase A regression: real production UI, HTTP handlers and SQLite; deterministic model only.
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { createApp } from '../server.mjs';
import { SessionStore } from '../src/store.mjs';

if (process.argv.includes('--server')) {
  const client = {
    models: async () => [{ id: 'visual-test', name: 'Visual regression fixture', contextLength: 8192 }, { id: 'visual-test-2', name: 'Second fixture', contextLength: 8192 }],
    complete: async request => {
      await delay(300);
      const images = request.messages.flatMap(m => Array.isArray(m.content) ? m.content.filter(c => c.type === 'image_url') : []);
      assert.ok(images.length === 1 || images.length === 2);
      if (images.length === 2) assert.notEqual(images[0].image_url.url, images[1].image_url.url);
      const last = request.messages.at(-1).content;
      if (last === 'Trigger test error') throw Object.assign(new Error('Test model unavailable; saved conversation unchanged.'), {status:503});
      return { raw: request.format ? JSON.stringify(Object.fromEntries(request.format.json_schema.schema.required.map((key, index) => [key, `Test observation ${index + 1}. The image has visible relationships of light, colour and shape. This is deterministic browser regression content, not a live model critique.`]))) : `Test reply with ${images.length === 2 ? 'Image A and Image B' : 'the original image'} and ${request.messages.length} context messages.`, model:request.model };
    }
  };
  const server=createApp({client});server.listen(Number(process.env.PORT),'127.0.0.1');
  process.on('SIGTERM',()=>server.close(()=>process.exit(0)));
} else {
  const playwright=process.env.PLAYWRIGHT_PATH || '/Users/diego/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
  const {chromium}=await import(pathToFileURL(playwright));
  const directory=await mkdtemp(join(tmpdir(),'director-v5-regression-'));
  const evidence=resolve(process.env.DIRECTOR_EVIDENCE_DIR || 'verification/v5');await mkdir(evidence,{recursive:true});
  const port=Number(process.env.DIRECTOR_V5_TEST_PORT || 4188),base=`http://127.0.0.1:${port}`;
  let child,browser,page,logs='';const errors=[];const result={passed:false,model:'deterministic test client; live inference not tested',checks:[],pids:[]};
  async function start(){child=spawn(process.execPath,['test/visual-browser.mjs','--server'],{env:{...process.env,PORT:String(port),DIRECTOR_DATA_DIR:directory},stdio:['ignore','pipe','pipe']});result.pids.push(child.pid);child.stdout.on('data',b=>logs+=b);child.stderr.on('data',b=>logs+=b);for(let i=0;i<100;i++){try{if((await (await fetch(base+'/api/health')).json()).app==='director-v4')return;}catch{}if(child.exitCode!==null)throw Error(logs);await delay(50);}throw Error(logs);}
  async function stop(){if(child&&child.exitCode===null){const done=once(child,'exit');child.kill('SIGTERM');await done;}}
  async function openBrowser(){browser=await chromium.launch();page=await browser.newPage({viewport:{width:1512,height:1321}});page.setDefaultTimeout(10000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('503'))errors.push(m.text());});await page.goto(base);await page.waitForFunction(()=>document.querySelector('#model').value==='visual-test');await page.evaluate(()=>document.fonts.ready);}
  async function settled(){await page.waitForFunction(()=>document.querySelector('#cancel').hidden&&!document.querySelector('#refresh-history').disabled);}
  async function shot(name){await page.evaluate(()=>window.scrollTo(0,0));await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:join(evidence,name+'.png'),fullPage:true});}
  async function nav(view){await page.locator(`.sidebar [data-view="${view}"]`).click();await settled();await page.waitForFunction(v=>document.body.dataset.view===v,view);}
  async function action(path,fn,method='POST'){const pending=page.waitForResponse(r=>new URL(r.url()).pathname===path&&r.request().method()===method);await fn();const response=await pending;const data=await response.json();assert.equal(response.status(),200,data.error);await settled();return data;}
  async function get(id){const response=await fetch(base+'/api/sessions/'+id);return (await response.json()).session;}
  const row=id=>page.locator(`[data-session-id="${id}"]`);
  const organised=id=>page.locator(`[data-organised-session-id="${id}"]`);
  async function open(id,fromOrganisation=false){await action('/api/sessions/'+id,()=> (fromOrganisation?organised(id):row(id)).getByRole('button',{name:'Open',exact:true}).click(),'GET');await page.waitForFunction(()=>!document.querySelector('#review-view').hidden);}
  async function chat(text){await page.fill('#message',text);return (await action('/api/chat',()=>page.click('#send'))).session;}
  async function member(target,id,present=true){await action('/api/'+target+'/sessions/'+id,()=>page.locator(`[data-membership="${target}"]`).setChecked(present),present?'PUT':'DELETE');}
  try {
    await assert.rejects(fetch(base+'/api/health'),'Test port must be unused');
    await start();await openBrowser();
    assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('.sidebar button')).fontFamily),'"Plus Jakarta Sans", sans-serif');
    assert.equal(await page.evaluate(()=>document.fonts.check('13px "IBM Plex Mono"')),true);
    const css=await fetch(base+'/style.css');assert.equal(css.status,200);
    for(const path of ['/visual/PlusJakartaSans-Regular.ttf','/visual/IBMPlexMono-Regular.ttf','/visual/arrow-up.svg'])assert.equal((await fetch(base+path)).status,200);
    for(const path of ['/assets/visual-v4/index.html','/src/store.mjs','/visual/unknown.ttf'])assert.equal((await fetch(base+path)).status,404);
    await shot('feedback-initial-test');
    const a=resolve('assets/img/image.jpg.jpg'), b=join(directory,'image-b.png');
    await page.evaluate(()=>{const c=document.createElement('canvas');c.width=240;c.height=160;const x=c.getContext('2d');x.fillStyle='#3344dd';x.fillRect(0,0,240,160);window.fixtureB=c.toDataURL('image/png');});
    await writeFile(b,Buffer.from((await page.evaluate(()=>window.fixtureB)).split(',')[1],'base64'));
    await page.setInputFiles('#image-file',a);await page.selectOption('#prompt','photography-review');await page.selectOption('#model','visual-test-2');
    const response=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/feedback'&&r.request().method()==='POST');await page.click('#review');await shot('feedback-thinking');let single=(await (await response).json()).session;await settled();assert.equal(single.model,'visual-test-2');assert.equal(single.feedback.sections.length,11);assert.equal(await page.locator('#feedback section').count(),11);await shot('feedback-generated');
    single=await chat('What do you see?');assert.equal(await page.locator('.turn').count(),2);await shot('feedback-chat');
    await page.fill('#message','Trigger test error');const failed=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/chat');await page.click('#send');assert.equal((await failed).status(),503);await settled();assert.equal(await page.inputValue('#message'),'Trigger test error');assert.deepEqual(await get(single.id),single);await page.fill('#message','');
    result.checks.push('Upload, prompt/model selection, 11-section Feedback, autosave, contextual chat, failure preserves draft and stored session');
    await nav('projects');page.once('dialog',d=>d.accept('Visual review project'));const {project}=await action('/api/projects',()=>page.click('#create-project'));await nav('projects');await shot('projects');await action('/api/projects/'+project.id,()=>page.locator('#project-list button').click(),'GET');await page.waitForFunction(()=>document.querySelector('#organisation-status').textContent.includes('session'));
    await nav('history');await open(single.id);await action(`/api/sessions/${single.id}/memberships`,()=>page.click('#organise-current'),'GET');await member('projects/'+project.id,single.id);await member('libraries/photography',single.id);await page.click('#close-organise');
    await nav('photography');await page.waitForFunction(()=>document.querySelector('#organisation-list li'));await shot('photography-library');await open(single.id,true);assert.deepEqual(await get(single.id),single);
    await nav('compare');await page.setInputFiles('#image-file',a);await page.setInputFiles('#image-file-b',b);await page.selectOption('#prompt','compare-general');await shot('compare-initial');let pair=(await action('/api/compare',()=>page.click('#review'))).session;assert.notEqual(pair.image.dataUrl,pair.imageB.dataUrl);await shot('compare-generated');pair=await chat('Compare A and B.');assert.match(pair.chat.at(-1).content,/Image A and Image B/);await shot('compare-chat');
    await action(`/api/sessions/${pair.id}/memberships`,()=>page.click('#organise-current'),'GET');await member('libraries/design',pair.id);await member('projects/'+project.id,pair.id);await page.click('#close-organise');
    await nav('design');await page.waitForFunction(()=>document.querySelector('#organisation-list li'));await shot('design-library');await open(pair.id,true);assert.deepEqual(await get(pair.id),pair);
    await page.fill('#message','Unsent draft');page.once('dialog',d=>d.dismiss());await page.locator('.sidebar [data-view="feedback"]').click();assert.equal(await page.inputValue('#message'),'Unsent draft');assert.equal(await page.locator('body').getAttribute('data-mode'),'compare');await page.fill('#message','');
    result.checks.push('Exactly two labelled Compare images, comparison chat, cancelled mode switch retains draft; Projects and both Libraries reopen canonical sessions');
    await nav('history');page.once('dialog',d=>d.accept('Renamed visual feedback'));single=(await action('/api/sessions/'+single.id,()=>row(single.id).getByRole('button',{name:'Rename',exact:true}).click(),'PATCH')).session;await shot('history');
    await nav('projects');await action('/api/projects/'+project.id,()=>page.locator('#project-list button').click(),'GET');await page.waitForFunction(()=>document.querySelector('#organisation-status').textContent.includes('session'));page.once('dialog',d=>d.accept('Renamed visual project'));await action('/api/projects/'+project.id,()=>page.click('#rename-project'),'PATCH');await shot('project-detail');
    await browser.close();browser=null;await stop();await start();await openBrowser();
    await nav('history');await open(single.id);assert.deepEqual(await get(single.id),single);assert.equal(await page.locator('.turn').count(),single.chat.length);await shot('feedback-reopened');await nav('history');await open(pair.id);assert.deepEqual(await get(pair.id),pair);assert.equal(await page.locator('#preview-b').getAttribute('src'),pair.imageB.sourceDataUrl);
    pair=await chat('Continue after restart.');await shot('compare-reopened');
    await nav('projects');await action('/api/projects/'+project.id,()=>page.locator('#project-list button').click(),'GET');await page.waitForFunction(()=>document.querySelector('#organisation-status').textContent.includes('session'));assert.match(await page.locator('#page-title').textContent(),/Renamed visual project/);assert.equal(await page.locator('#organisation-list li').count(),2);
    result.checks.push('Full browser and server-process restart preserves renamed Project, exact sessions/images/chat, memberships and continuing comparison');
    await action(`/api/projects/${project.id}/sessions/${single.id}`,()=>organised(single.id).getByRole('button',{name:'Remove',exact:true}).click(),'DELETE');assert.deepEqual(await get(single.id),single);
    page.once('dialog',d=>d.accept());await action('/api/projects/'+project.id,()=>page.click('#delete-project'),'DELETE');assert.deepEqual(await get(pair.id),pair);
    await nav('design');await page.waitForFunction(()=>document.querySelector('#organisation-list li'));await action(`/api/libraries/design/sessions/${pair.id}`,()=>organised(pair.id).getByRole('button',{name:'Remove',exact:true}).click(),'DELETE');assert.deepEqual(await get(pair.id),pair);
    await nav('history');page.once('dialog',d=>d.accept());await action('/api/sessions/'+pair.id,()=>row(pair.id).getByRole('button',{name:'Delete',exact:true}).click(),'DELETE');assert.equal(await row(pair.id).count(),0);assert.deepEqual(await get(single.id),single);
    await nav('photography');await page.waitForFunction(()=>document.querySelector('#organisation-list li'));await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await shot('photography-mobile');await open(single.id,true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await shot('feedback-mobile');
    await browser.close();browser=null;await stop();await start();await openBrowser();await nav('history');assert.equal(await row(pair.id).count(),0);await open(single.id);assert.deepEqual(await get(single.id),single);await browser.close();browser=null;await stop();
    const store=new SessionStore(join(directory,'sessions.sqlite'));try{assert.equal(store.db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');assert.deepEqual(store.db.prepare('PRAGMA foreign_key_check').all(),[]);assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n,2);}finally{store.close();}
    result.checks.push('Membership removal and Project deletion preserve canonical data; session deletion persists across restart; unrelated session survives; SQLite integrity/foreign keys and two remaining assets verified; 390px layouts do not overflow');
    assert.deepEqual(errors,[]);result.passed=true;result.consoleErrors=errors;
  } catch(e){result.error=e.stack;process.exitCode=1;if(page&&browser)await shot('failure').catch(()=>{});}
  finally{await browser?.close();await stop();await writeFile(join(evidence,'browser-report.json'),JSON.stringify(result,null,2));if(result.passed)await rm(directory,{recursive:true,force:true});else result.retainedData=directory;console.log(JSON.stringify(result,null,2));}
}
