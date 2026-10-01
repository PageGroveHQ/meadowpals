import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(import.meta.dirname,'..');
const args=Object.fromEntries(process.argv.slice(2).map(arg=>{const [key,...rest]=arg.replace(/^--/,'').split('=');return [key,rest.join('=')||true]}));
const configPath=path.resolve(root,String(args.config||'tools/fish-voices.example.json'));
const config=JSON.parse(await fs.readFile(configPath,'utf8'));
const apiKey=process.env.FISH_AUDIO_API_KEY;
if(!apiKey)throw new Error('Set FISH_AUDIO_API_KEY in your shell before running this tool.');

const context={window:{}};
vm.runInNewContext(await fs.readFile(path.join(root,'data.js'),'utf8'),context);
const data=context.window.MEADOW_DATA;
const categories=String(args.categories||config.categories||'words').split(',').map(value=>value.trim()).filter(Boolean);
const requestedVoices=String(args.voices||'').split(',').map(value=>value.trim()).filter(Boolean);
const assignedOnly=String(args.assigned||'').toLowerCase()==='true';
const onlyCards=new Set(String(args.only||'').split(',').map(value=>value.trim().toLowerCase()).filter(Boolean));
const force=String(args.force||'').toLowerCase()==='true';
const language=String(args.language||'en').toLowerCase();
if(!['en','es'].includes(language))throw new Error(`Unsupported language: ${language}`);
const voices=config.voices.filter(voice=>!requestedVoices.length||requestedVoices.includes(voice.name));
if(!voices.length)throw new Error('No matching voices were found in the config file.');

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const slug=value=>value.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'card';
const exists=async file=>fs.access(file).then(()=>true,()=>false);

async function synthesize({text,referenceId,file}){
  for(let attempt=1;attempt<=4;attempt++){
    const response=await fetch('https://api.fish.audio/v1/tts',{
      method:'POST',
      headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json',model:config.model||'s2.1-pro-free'},
      body:JSON.stringify({text,reference_id:referenceId,format:'mp3'})
    });
    if(response.ok){await fs.writeFile(file,Buffer.from(await response.arrayBuffer()));return}
    const message=await response.text();
    if(attempt===4||![408,429,500,502,503,504].includes(response.status))throw new Error(`${response.status}: ${message}`);
    await sleep(750*2**attempt);
  }
}

for(const voice of voices){
  if(!voice.referenceId||voice.referenceId.startsWith('REPLACE_'))throw new Error(`Add a Fish Audio referenceId for ${voice.name} in ${configPath}`);
  for(const category of categories){
    if(!data[category])throw new Error(`Unknown category: ${category}`);
    const localizedCategory=language==='es'?`${category}-es`:category;
    const directory=path.join(root,'audio','voice-packs',voice.name,localizedCategory);
    await fs.mkdir(directory,{recursive:true});
    for(const [index,card] of data[category].entries()){
      if(onlyCards.size&&!onlyCards.has(String(card.word).toLowerCase()))continue;
      if(assignedOnly&&card.character!==voice.name)continue;
      const file=path.join(directory,`${String(index+1).padStart(3,'0')}-${slug(card.word)}.mp3`);
      if(!force&&await exists(file)){console.log(`skip ${path.relative(root,file)}`);continue}
      const localized=language==='es'?card.spanish:card;
      if(!localized?.speech)throw new Error(`Missing ${language} speech for ${category}/${card.word}`);
      const text=localized.speech;
      console.log(`make ${voice.name}/${localizedCategory}: ${text}`);
      await synthesize({text,referenceId:voice.referenceId,file});
      await sleep(Number(config.delayMs||350));
    }
  }
}

console.log('Voice pack generation complete. Existing files were preserved.');
