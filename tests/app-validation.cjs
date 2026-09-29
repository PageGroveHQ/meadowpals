const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const root=require('path').join(__dirname,'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require('path').join(root,'data.js'),'utf8'),context);
const data=context.window.MEADOW_DATA;
assert.equal(data.numbers.length,11,'numbers must cover 0–10');
assert.equal(data.letters.length,26,'letters must cover A–Z');
assert.equal(data.colors.length,9,'nine requested colors must be present');
assert.equal(data.words.length,100,'first-word deck must contain 100 cards');
for(const [key,cards] of Object.entries(data))cards.forEach((card,index)=>{assert(card.word,`${key} card ${index} needs a word`);assert(card.picture||card.image,`${key} card ${index} needs a picture cue`)});
for(const card of data.numbers){
  assert(card.image,`number ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing number art ${card.image}`);
  assert(card.audio,`number ${card.word} needs a Meadow Pals voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing number audio ${card.audio}`);
}
const app=fs.readFileSync(require('path').join(root,'app.js'),'utf8');
assert(app.includes("letters:{title:'Letters',kicker:'READ WITH POPPY',size:26"),'letter sessions must include all 26 letters');
assert(app.includes("words:{title:'First Words',kicker:'EXPLORE TOGETHER',size:100"),'word sessions must include all 100 words');
const html=fs.readFileSync(require('path').join(root,'index.html'),'utf8');
for(const id of ['parentHub','pinModal','profileGrid','flashCard'])assert(html.includes(`id="${id}"`),`missing ${id}`);
for(const track of ['calm-playtime.mp3','cozy-lullaby.mp3','little-steps.mp3','sweet-kindergarten.mp3']){
  assert(fs.existsSync(require('path').join(root,'audio','meadow-pals',track)),`missing music track ${track}`);
  assert(app.includes(track),`music track ${track} is not wired into the app`);
}
for(const legacy of ['assets/characters','assets/backgrounds','assets/icons','assets/ui','templates','vendor'])assert(!fs.existsSync(require('path').join(root,legacy)),`legacy Learning Arcade path remains: ${legacy}`);
for(const file of ['app.js','data.js','index.html','styles.css','README.md']){
  const source=fs.readFileSync(require('path').join(root,file),'utf8');
  assert(!/Asher|Circuit Sentinel|Professor Volt|Learning Arcade/i.test(source),`${file} still contains Learning Arcade references`);
}
console.log('Meadow Pals content and app shell validated.');
