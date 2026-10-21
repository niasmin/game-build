import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root=process.cwd(), types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.json':'application/json','.ttf':'font/ttf'};
http.createServer(async(req,res)=>{try {const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root+'/')||path.split('/').some(part=>part.startsWith('.'))||!Object.hasOwn(types,extname(file))){res.writeHead(403).end('Forbidden');return;} const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)],'X-Content-Type-Options':'nosniff'}).end(body);}catch {res.writeHead(404).end('Not found');}}).listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Samkok web on port '+(process.env.PORT||3000)));
