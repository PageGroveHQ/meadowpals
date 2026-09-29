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
for(const [key,cards] of Object.entries(data))cards.forEach((card,index)=>{assert(card.word,`${key} card ${index} needs a word`);assert(card.picture,`${key} card ${index} needs a picture cue`)});
const html=fs.readFileSync(require('path').join(root,'index.html'),'utf8');
for(const id of ['parentHub','pinModal','profileGrid','flashCard'])assert(html.includes(`id="${id}"`),`missing ${id}`);
for(const track of ['calm-playtime.mp3','cozy-lullaby.mp3','little-steps.mp3','sweet-kindergarten.mp3']){
  assert(fs.existsSync(require('path').join(root,'audio','meadow-pals',track)),`missing music track ${track}`);
  assert(fs.readFileSync(require('path').join(root,'app.js'),'utf8').includes(track),`music track ${track} is not wired into the app`);
}
console.log('Meadow Pals content and app shell validated.');
