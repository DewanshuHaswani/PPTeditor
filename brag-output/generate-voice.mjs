import { readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const scenes=JSON.parse(await readFile('brag-output/scenes.json','utf8'));
const env={...process.env}; // Run with Node >=22 and HYPERFRAMES_PYTHON pointing to a Kokoro-enabled Python.
const metadata=[];
for(const scene of scenes){
 await writeFile(`brag-output/composition/assets/voice/${scene.id}.txt`,scene.voice);
 const dest=`brag-output/composition/assets/voice/${scene.id}.wav`;
 const result=spawnSync('npx',['hyperframes','tts',`brag-output/composition/assets/voice/${scene.id}.txt`,'--voice','af_heart','--speed','1.08','--output',dest,'--json'],{env,encoding:'utf8',maxBuffer:1024*1024*10});
 if(result.status!==0)throw new Error(result.stdout+result.stderr);
 const duration=Number(spawnSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',dest],{encoding:'utf8'}).stdout);
 console.log(scene.id,duration,`slot=${scene.duration}`);
 metadata.push({id:scene.id,duration,slotStart:scene.start,slotDuration:scene.duration,path:`assets/voice/${scene.id}.wav`,voice:'af_heart',speed:1.08,text:scene.voice});
}
await writeFile('brag-output/composition/assets/voice/manifest.json',JSON.stringify(metadata,null,2));
