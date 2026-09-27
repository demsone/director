// Director desktop app: a native window around the same app the web version serves.
import { app, BrowserWindow, shell, nativeTheme } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = 4747;
const HOST = `http://127.0.0.1:${PORT}`;

app.setName('Director');
nativeTheme.themeSource = 'dark';

if (!app.requestSingleInstanceLock()) app.quit();

let win = null;
let baseUrl = HOST;

async function alreadyRunning() {
  try {
    const res = await fetch(`${HOST}/api/settings`, { signal: AbortSignal.timeout(800) });
    return res.ok;
  } catch {
    return false;
  }
}

async function ensureServer() {
  // If the web version is already running, share it; both use the same data either way.
  if (await alreadyRunning()) return;
  const { startServer } = await import(path.join(here, '..', 'server', 'index.js'));
  try {
    await startServer({ port: PORT });
  } catch (e) {
    if (e.code !== 'EADDRINUSE') throw e;
    // Another program holds the usual port: run on any free one.
    const server = await startServer({ port: 0 });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1512,
    height: 980,
    minWidth: 1024,
    minHeight: 680,
    title: 'Director',
    backgroundColor: '#171717',
    show: false,
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  win.once('ready-to-show', () => win.show());
  // Links to other sites open in the normal browser, not inside Director.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(baseUrl)) { e.preventDefault(); shell.openExternal(url); }
  });
  win.loadURL(baseUrl);
  // Test hook: DIRECTOR_CAPTURE=/path.png saves a screenshot of the window once loaded.
  if (process.env.DIRECTOR_CAPTURE) {
    win.webContents.once('did-finish-load', () => setTimeout(async () => {
      const img = await win.webContents.capturePage();
      (await import('node:fs')).writeFileSync(process.env.DIRECTOR_CAPTURE, img.toPNG());
    }, 2500));
  }
  win.on('closed', () => { win = null; });
}

app.on('second-instance', () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

app.whenReady().then(async () => {
  try {
    await ensureServer();
  } catch (e) {
    const { dialog } = await import('electron');
    dialog.showErrorBox('Director could not start', String(e.message || e));
    app.quit();
    return;
  }
  createWindow();
  app.on('activate', () => { if (!win) createWindow(); });
});

app.on('window-all-closed', () => app.quit());
