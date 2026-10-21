import {cp,mkdir,rm,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),out=new URL('../dist/',import.meta.url);
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const file of ['index.html','app.js','game.js','characters.js','systems.js','coupons.js','style.css','public'])await cp(new URL(file,root),new URL(file,out),{recursive:true});
await writeFile(new URL('.nojekyll',out),'');
console.log('Static site built: '+fileURLToPath(out));
