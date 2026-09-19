import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { randomUUID } from 'node:crypto';
import { SessionStore } from '../src/store.mjs';
import { v3Modules } from './helpers/v3-fixture.mjs';

if (!process.env.PLAYWRIGHT_PATH) throw new Error('Set PLAYWRIGHT_PATH to an installed Playwright index.mjs.');
const { chromium } = await import(pathToFileURL(resolve(process.env.PLAYWRIGHT_PATH)));
const port = Number(process.env.DIRECTOR_V4_TEST_PORT || 4185), base = `http://127.0.0.1:${port}`;
const directory = await mkdtemp(join(tmpdir(), 'director-v4-live-')), evidence = resolve('verification/v4');
await mkdir(evidence, { recursive: true });
const old = await v3Modules(directory), legacy = new old.SessionStore(join(directory, 'sessions.sqlite'));
const feedbackReport = JSON.parse(await readFile('verification/v2/persistence-browser-report.json', 'utf8'));
const compareReport = JSON.parse(await readFile('verification/v4/v3-regression/compare-browser-report.json', 'utf8'));
assert.equal(compareReport.passed, true, 'Run the real V3 regression first to supply verified comparison output.');
const sourceA = `data:image/jpeg;base64,${(await readFile('assets/img/image.jpg.jpg')).toString('base64')}`;
const sourceB = `data:image/png;base64,${(await readFile('verification/v4/v3-regression/image-b-test-fixture.png')).toString('base64')}`;
function fixture(type) {
  const now = new Date().toISOString(), comparison = type === 'compare';
  return { id: randomUUID(), type, title: comparison ? 'Old Compare' : 'Old Feedback', createdAt: now, updatedAt: now, image: { name: 'source-a.jpg', dataUrl: sourceA, sourceDataUrl: sourceA }, ...(comparison ? { imageB: { name: 'source-b.png', dataUrl: sourceB, sourceDataUrl: sourceB } } : {}), prompt: old.getPrompt(comparison ? 'compare-general' : 'photography-review', type), systemInstruction: old.systemInstruction, model: 'qwen3-vl-8b-instruct', feedback: comparison ? compareReport.feedback : feedbackReport.feedback, chat: comparison ? compareReport.chat : feedbackReport.priorChat };
}
const single = legacy.create(fixture('feedback')), pair = legacy.create(fixture('compare'));
legacy.close();
let server, browser, page, logs = '', singleUpdated, pairUpdated;
const result = { passed: false, date: new Date().toISOString(), steps: [], replies: [], pids: [] }, errors = [];
async function start() {
  server = spawn(process.execPath, ['server.mjs'], { cwd: resolve('.'), env: { ...process.env, PORT: String(port), DIRECTOR_DATA_DIR: directory }, stdio: ['ignore', 'pipe', 'pipe'] });
  result.pids.push(server.pid); server.stdout.on('data', b => { logs += b; }); server.stderr.on('data', b => { logs += b; });
  for (let i=0;i<100;i++) { if(server.exitCode!==null) throw new Error(logs); try { if((await (await fetch(base+'/api/health')).json()).app==='director-v4') return; } catch {} await delay(50); }
  throw new Error('Server did not start. '+logs);
}
async function stop() { if(!server || server.exitCode!==null) return; const done=once(server,'exit');server.kill('SIGTERM');const timeout=setTimeout(()=>server.kill('SIGKILL'),5000);await done;clearTimeout(timeout);await assert.rejects(fetch(base+'/api/health')); }
async function openBrowser() {
  browser=await chromium.launch({headless:true});page=await browser.newPage({viewport:{width:1440,height:1100}});page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  await page.waitForFunction(()=>document.querySelectorAll('#prompt option').length===3 && document.querySelectorAll('#organisation-view option').length===3);
}
async function restart() { await browser.close();await stop();await start();await openBrowser(); }
async function settled() { await page.waitForFunction(()=>document.querySelector('#cancel').hidden && !document.querySelector('#refresh-history').disabled); }
async function action(path,fn,method='POST') { const pending=page.waitForResponse(r=>r.url().endsWith(path)&&r.request().method()===method,{timeout:260000});await fn();const response=await pending,data=await response.json();assert.equal(response.status(),200,data.error);await settled();return data; }
async function get(id) { const response=await fetch(base+'/api/sessions/'+id);assert.equal(response.status,200);return (await response.json()).session; }
const historyRow=id=>page.locator(`[data-session-id="${id}"]`), organisedRow=id=>page.locator(`[data-organised-session-id="${id}"]`);
async function open(id,organised=false) { await action('/api/sessions/'+id,()=> (organised?organisedRow(id):historyRow(id)).getByRole('button',{name:'Open',exact:true}).click(),'GET'); }
async function view(target) { await page.locator('#organisation-panel').evaluate(e=>{e.open=true;});await action('/api/'+target,()=>page.selectOption('#organisation-view',target),'GET');await page.waitForFunction(t=>document.querySelector('#organisation-view').value===t,target); }
async function createProject(name) { page.once('dialog',d=>d.accept(name));return (await action('/api/projects',()=>page.click('#create-project'))).project; }
async function organise(id,current=false) { await action('/api/sessions/'+id+'/memberships',()=>current?page.click('#organise-current'):historyRow(id).getByRole('button',{name:'Organise',exact:true}).click(),'GET'); }
async function membership(target,id,present=true) { await action('/api/'+target+'/sessions/'+id,()=>page.locator(`[data-membership="${target}"]`).setChecked(present),present?'PUT':'DELETE'); }
async function chat(message) { await page.fill('#message',message);const data=await action('/api/chat',()=>page.click('#send'));result.replies.push(data.turn.content);return data.session; }
try {
  let occupied=false;try {await fetch(base+'/api/health');occupied=true;}catch{}assert.equal(occupied,false,'Choose an unused V4 test port.');
  await start();await openBrowser();
  await open(single.id);assert.deepEqual(await get(single.id),single);await open(pair.id);assert.deepEqual(await get(pair.id),pair);
  assert.equal(await page.locator('#preview-b').getAttribute('src'),sourceB);
  result.steps.push('Authentic tagged V3 Feedback and Compare migrate and open with exact images, prompts, feedback and prior chats');
  await page.locator('#organisation-panel').evaluate(e=>{e.open=true;});
  const project=await createProject('Test Project'), second=await createProject('Second Project');
  await organise(pair.id,true);await membership('projects/'+project.id,pair.id);await membership('libraries/design',pair.id);await page.click('#close-organise');
  await organise(single.id);await membership('projects/'+project.id,single.id);await membership('projects/'+second.id,single.id);await membership('libraries/photography',single.id);await page.click('#close-organise');
  await view('projects/'+project.id);assert.equal(await page.locator('#organisation-list li').count(),2);
  await open(single.id,true);
  singleUpdated=await chat('What is the colour of the hanging fabric, and where is the chair in relation to it? Answer in one short sentence based on the image.');
  assert.match(result.replies[0],/yellow|mustard/i);assert.match(result.replies[0],/right/i);
  await open(single.id);assert.equal(await page.locator('.turn').count(),singleUpdated.chat.length);
  await open(single.id,true);assert.equal(await page.locator('.turn').count(),singleUpdated.chat.length);
  await open(pair.id,true);
  pairUpdated=await chat('For Image B only, identify the colour and shape at the right edge. Do not describe Image A. One sentence.');
  assert.match(result.replies[1],/blue/i);assert.match(result.replies[1],/circle/i);assert.doesNotMatch(result.replies[1],/yellow|chair/i);
  result.steps.push('Both sessions assigned to Test Project; Feedback belongs to a second Project simultaneously; real Feedback and Compare chat continues from Project and is the same canonical chat in History');
  page.once('dialog',d=>d.accept('Renamed Feedback'));
  await action('/api/sessions/'+single.id,()=>historyRow(single.id).getByRole('button',{name:'Rename',exact:true}).click(),'PATCH');
  await page.waitForFunction(id=>document.querySelector(`[data-organised-session-id="${id}"]`).textContent.includes('Renamed Feedback'),single.id);
  assert.match(await historyRow(single.id).innerText(),/Renamed Feedback/);
  singleUpdated=await get(single.id);
  page.once('dialog',d=>d.accept('Renamed Test Project'));await action('/api/projects/'+project.id,()=>page.click('#rename-project'),'PATCH');
  await view('libraries/photography');await open(single.id,true);assert.equal(await historyRow(single.id).count(),1);
  await view('libraries/design');await open(pair.id,true);assert.equal(await historyRow(pair.id).count(),1);
  result.steps.push('Canonical rename updates History and Project; Project rename works; both built-in Libraries open the same sessions without removing History entries');
  await restart();await view('projects/'+project.id);assert.match(await page.locator('#organisation-status').textContent(),/Renamed Test Project/);assert.equal(await page.locator('#organisation-list li').count(),2);
  await open(single.id,true);assert.deepEqual(await get(single.id),singleUpdated);
  await open(pair.id,true);assert.deepEqual(await get(pair.id),pairUpdated);assert.equal(await page.locator('#preview-b').getAttribute('src'),sourceB);
  await view('libraries/photography');assert.equal(await organisedRow(single.id).count(),1);await view('libraries/design');assert.equal(await organisedRow(pair.id).count(),1);
  await page.screenshot({path:join(evidence,'organisation-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:join(evidence,'organisation-mobile.png'),fullPage:true});await page.setViewportSize({width:1440,height:1100});
  result.steps.push('Complete browser/server shutdown and relaunch preserves Projects, all memberships, exact original images, comparison and both updated chats; desktop/mobile render without horizontal overflow');
  await view('projects/'+project.id);await action('/api/projects/'+project.id+'/sessions/'+single.id,()=>organisedRow(single.id).getByRole('button',{name:'Remove',exact:true}).click(),'DELETE');
  await open(single.id);assert.deepEqual(await get(single.id),singleUpdated);
  await view('libraries/design');await action('/api/libraries/design/sessions/'+pair.id,()=>organisedRow(pair.id).getByRole('button',{name:'Remove',exact:true}).click(),'DELETE');await open(pair.id);assert.deepEqual(await get(pair.id),pairUpdated);
  // Keep Compare in Photography when its Project is deleted, then delete the canonical session from that Library.
  await organise(pair.id,true);await membership('libraries/photography',pair.id);await membership('projects/'+second.id,pair.id);await page.click('#close-organise');
  await view('projects/'+project.id);page.once('dialog',d=>d.accept());await action('/api/projects/'+project.id,()=>page.click('#delete-project'),'DELETE');
  assert.deepEqual(await get(pair.id),pairUpdated);await view('libraries/photography');assert.equal(await organisedRow(pair.id).count(),1);
  await open(pair.id,true);page.once('dialog',d=>d.accept());await action('/api/sessions/'+pair.id,()=>organisedRow(pair.id).getByRole('button',{name:'Delete',exact:true}).click(),'DELETE');
  assert.equal(await historyRow(pair.id).count(),0);assert.equal(await page.locator('#preview-b').isHidden(),true);
  await view('projects/'+second.id);assert.equal(await organisedRow(pair.id).count(),0);assert.equal(await organisedRow(single.id).count(),1);
  await restart();assert.equal(await historyRow(pair.id).count(),0);assert.equal(await page.locator(`#organisation-view option[value="projects/${project.id}"]`).count(),0);
  await view('libraries/design');assert.equal(await page.locator('#organisation-list li').count(),0);await view('libraries/photography');assert.equal(await organisedRow(single.id).count(),1);assert.equal(await organisedRow(pair.id).count(),0);
  await open(single.id,true);assert.deepEqual(await get(single.id),singleUpdated);
  result.steps.push('Project and Library removal preserve canonical sessions; deleting a populated Project preserves its session in History/Library; canonical Compare deletion removes all memberships/assets; final restart restores no deleted data and preserves unrelated Feedback');
  await browser.close();browser=null;await stop();
  const store=new SessionStore(join(directory,'sessions.sqlite'));
  try {assert.equal(store.db.prepare('SELECT count(*) n FROM assets').get().n,2);assert.deepEqual(store.db.prepare('PRAGMA foreign_key_check').all(),[]);assert.equal(store.db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');result.assetCount=2;result.integrityCheck='ok';}finally{store.close();}
  assert.deepEqual(errors,[]);result.passed=true;result.consoleErrors=errors;result.model='qwen3-vl-8b-instruct';
} catch(error) {result.error=error.stack;console.error(error);process.exitCode=1;if(browser)await page.screenshot({path:join(evidence,'organisation-failure.png'),fullPage:true}).catch(()=>{});}
finally {await browser?.close();await stop();await writeFile(join(evidence,'organisation-browser-report.json'),JSON.stringify(result,null,2));if(result.passed)await rm(directory,{recursive:true,force:true});else console.log('Retained test data: '+directory);}
console.log(JSON.stringify(result,null,2));
