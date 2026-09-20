// Build-time inventory, not part of the offline runtime. Retain approved old assets.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const list=path.join(root,'asset-list.json'),assets=new Set(JSON.parse(fs.readFileSync(list)));
for(const folder of ['audio','animals','stories','scenes','engine','content','ui'])for(const name of fs.readdirSync(path.join(root,folder))){if(/\.(m4a|png|svg|js)$/.test(name))assets.add('./'+folder+'/'+name);}
for(const name of ['day.css','school.css','school.js','app.js'])assets.add('./'+name);
for(const name of assets)if(!fs.existsSync(path.join(root,name)))throw Error('Missing approved asset: '+name);
fs.writeFileSync(list,JSON.stringify([...assets].sort(),null,2)+'\n');
fs.writeFileSync(path.join(root,'audio-list.json'),JSON.stringify(fs.readdirSync(path.join(root,'audio')).filter(n=>n.endsWith('.m4a')).map(n=>n.slice(0,-4)).sort(),null,2)+'\n');
console.log('Offline inventory refreshed. Bump sw.js for a release; run npm test.');
