const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const root=require('path').join(__dirname,'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(require('path').join(root,'data.js'),'utf8'),context);
const data=context.window.MEADOW_DATA;
const groups=context.window.MEADOW_WORD_GROUPS;
assert.equal(data.numbers.length,11,'numbers must cover 0–10');
assert.equal(data.letters.length,26,'letters must cover A–Z');
assert.equal(data.numbers[0].word,'0','numbers must begin with zero');
assert.equal(data.numbers.at(-1).word,'10','numbers must end with ten');
assert.equal(data.letters[0].word,'A','letters must begin with A');
assert.equal(data.letters.at(-1).word,'Z','letters must end with Z');
assert.equal(data.colors.length,9,'nine requested colors must be present');
assert.equal(data.words.length,100,'first-word deck must contain 100 cards');
for(const [key,cards] of Object.entries(data))cards.forEach((card,index)=>{assert(card.word,`${key} card ${index} needs a word`);assert(card.picture||card.image,`${key} card ${index} needs a picture cue`)});
for(const card of data.numbers){
  assert(card.image,`number ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing number art ${card.image}`);
  assert(card.audio,`number ${card.word} needs a Meadow Pals voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing number audio ${card.audio}`);
}
for(const card of data.letters){
  assert(card.audio,`letter ${card.word} needs Poppy's voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing letter audio ${card.audio}`);
}
for(const card of data.colors){
  assert(card.audio,`color ${card.word} needs Doodle's voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing color audio ${card.audio}`);
}
assert.equal(groups.people.words.length,5,'people sub-deck must contain five words');
assert.equal(groups.animals.words.length,15,'animals sub-deck must contain fifteen words');
assert.equal(groups.food.words.length,10,'food sub-deck must contain ten words');
assert.equal(Object.keys(groups).length,11,'all eleven first-word sub-decks must be present');
for(const [key,size] of Object.entries({things:5,play:5,home:10,body:10,clothing:10,nature:10,social:10,feelings:10}))assert.equal(groups[key].words.length,size,`${key} sub-deck must contain ${size} words`);
for(const group of Object.values(groups))for(const word of group.words)assert(data.words.some(card=>card.word===word),`${word} must exist in the first-word deck`);
const groupedWords=Object.values(groups).flatMap(group=>group.words);
assert.equal(groupedWords.length,100,'sub-decks must collectively contain 100 words');
assert.equal(new Set(groupedWords).size,100,'each first word must belong to exactly one sub-deck');
for(const word of groups.body.words){
  const card=data.words.find(item=>item.word===word);
  assert(card.image,`${word} needs custom Body Parts art`);
  const imagePath=require('path').join(root,card.image);
  assert(fs.existsSync(imagePath),`missing Body Parts art ${card.image}`);
  assert(fs.statSync(imagePath).size>100000,`Body Parts art is unexpectedly small: ${card.image}`);
}
const app=fs.readFileSync(require('path').join(root,'app.js'),'utf8');
const serviceWorker=fs.readFileSync(require('path').join(root,'sw.js'),'utf8');
assert(app.includes("letters:{title:'Letters',kicker:'READ WITH POPPY',size:26"),'letter sessions must include all 26 letters');
assert(app.includes("words:{title:'First Words',kicker:'EXPLORE TOGETHER',size:100"),'word sessions must include all 100 words');
assert(app.includes("if(key==='colors'||key==='words')shuffle(cards)"),'colors and word decks must shuffle');
assert(app.includes("const APP_VERSION='46'"),'app and cache version must be current');
assert(serviceWorker.includes("const CACHE='meadow-pals-v46'"),'service worker cache must match the app version');
assert(app.includes('checkForUpdate'),'parent settings must provide an app update check');
const html=fs.readFileSync(require('path').join(root,'index.html'),'utf8');
for(const id of ['parentHub','pinModal','profileGrid','flashCard','openWordGroups','wordGroupModal','wordGroupGrid'])assert(html.includes(`id="${id}"`),`missing ${id}`);
assert(fs.existsSync(require('path').join(root,'assets','meadow-pals','app-icon.png')),'missing redesigned app icon');
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
