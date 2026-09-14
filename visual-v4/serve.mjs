import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ttf':'font/ttf'};
http.createServer((req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(pathname==='/__director_v4'){res.writeHead(200,{'Content-Type':'text/plain'});res.end('director-v4-visual');return;}
 const shared=pathname.startsWith('/assets/icons/');const base=shared?path.resolve(root,'../assets/icons'):root;
 const relative=shared?pathname.slice('/assets/icons/'.length):pathname==='/'?'index.html':pathname.slice(1);
 const file=path.resolve(base,relative);
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return;}
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(4184,'127.0.0.1',()=>console.log('Director v4 visual review: http://127.0.0.1:4184'));
