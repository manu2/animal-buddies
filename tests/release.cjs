const {spawnSync}=require('child_process'),path=require('path'),fs=require('fs');
const results=[];
for(const test of ['pilot','daily','language','motion','upgrade']){
 const r=spawnSync(process.execPath,[path.join(__dirname,test+'.cjs')],{env:process.env,encoding:'utf8',timeout:180000});
 const row={test,passed:r.status===0,stdout:r.stdout,stderr:r.stderr,error:r.error?.message};
 results.push(row);console.log(JSON.stringify(row));
 if(!row.passed)break;
}
const out=process.env.RELEASE_REPORT||'/tmp/animal-buddies-release.json';
fs.writeFileSync(out,JSON.stringify({date:new Date().toISOString(),target:process.env.GAME_URL||'local',results},null,2));
if(results.length!==5||results.some(r=>!r.passed))process.exit(1);
