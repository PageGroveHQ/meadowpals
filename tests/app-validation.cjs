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
assert.equal(data.lettersEs.length,27,'Spanish letters must cover the 27-letter alphabet');
assert.equal(data.numbers[0].word,'0','numbers must begin with zero');
assert.equal(data.numbers.at(-1).word,'10','numbers must end with ten');
assert.equal(data.letters[0].word,'A','letters must begin with A');
assert.equal(data.letters.at(-1).word,'Z','letters must end with Z');
assert.equal(data.lettersEs[0].word,'A','Spanish letters must begin with A');
assert.equal(data.lettersEs[14].word,'Ñ','Spanish letters must place Ñ after N');
assert.equal(data.lettersEs.at(-1).word,'Z','Spanish letters must end with Z');
assert.equal(data.colors.length,9,'nine requested colors must be present');
assert.equal(data.shapes.length,9,'nine requested shapes must be present');
assert.equal(data.colorsShapes.length,18,'mixed colors and shapes deck must contain all 18 cards');
assert.equal(data.words.length,100,'first-word deck must contain 100 cards');
assert.equal(data.words.filter(card=>card.spanish?.word&&card.spanish?.audio).length,100,'all first words must include Spanish text and audio');
assert.equal(new Set(data.words.map(card=>card.spanish.word)).size,100,'Spanish first-word labels must be unique');
assert.equal(data.words[0].spanish.word,'Mamá','the Spanish word bank must begin with Mamá');
assert.equal(data.words.at(-1).spanish.word,'Suave','the Spanish word bank must end with Suave');
for(const [key,cards] of Object.entries(data))cards.forEach((card,index)=>{assert(card.word,`${key} card ${index} needs a word`);assert(card.picture||card.image,`${key} card ${index} needs a picture cue`)});
for(const card of data.numbers){
  assert(card.image,`number ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing number art ${card.image}`);
  assert(card.audio,`number ${card.word} needs a Meadow Pals voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing number audio ${card.audio}`);
  assert(card.spanish?.audio?.includes(`/voice-packs-es/${card.character}/numbers-es/`),`number ${card.word} needs its native-Spanish character voice`);
  assert(fs.existsSync(require('path').join(root,card.spanish.audio)),`missing Spanish number audio ${card.spanish.audio}`);
}
for(const card of data.letters){
  assert(card.image,`letter ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing letter art ${card.image}`);
  assert(card.audio,`letter ${card.word} needs Poppy's voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing letter audio ${card.audio}`);
}
for(const card of data.lettersEs){
  assert(card.image,`Spanish letter ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing Spanish letter art ${card.image}`);
  assert(card.audio?.includes(`/voice-packs-es/${card.character}/letters-es/`),`Spanish letter ${card.word} needs its native-Spanish character voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing Spanish letter audio ${card.audio}`);
}
for(const card of data.colors){
  assert(card.image,`color ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing color art ${card.image}`);
  assert(card.audio,`color ${card.word} needs Doodle's voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing color audio ${card.audio}`);
  assert(card.spanish?.audio?.includes('/voice-packs-es/doodle/colors-es/'),`color ${card.word} needs Doodle's native-Spanish voice`);
  assert(fs.existsSync(require('path').join(root,card.spanish.audio)),`missing Spanish color audio ${card.spanish.audio}`);
}
for(const card of data.shapes){
  assert(card.image,`shape ${card.word} needs custom Meadow Pals art`);
  assert(fs.existsSync(require('path').join(root,card.image)),`missing shape art ${card.image}`);
  assert(card.audio,`shape ${card.word} needs an assigned Meadow Pal voice`);
  assert(fs.existsSync(require('path').join(root,card.audio)),`missing shape audio ${card.audio}`);
  assert(card.spanish?.audio?.includes(`/voice-packs-es/${card.character}/shapes-es/`),`shape ${card.word} needs its native-Spanish character voice`);
  assert(fs.existsSync(require('path').join(root,card.spanish.audio)),`missing Spanish shape audio ${card.spanish.audio}`);
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
const expectedCharacters={Head:'pip',Eyes:'poppy',Nose:'pip',Mouth:'pip',Ears:'poppy',Hands:'poppy',Feet:'doodle',Tummy:'doodle',Hair:'pip',Teeth:'poppy',Dog:'pip',Cat:'poppy',Bird:'poppy',Fish:'doodle',Duck:'doodle',Bear:'pip',Bunny:'poppy',Cow:'pip',Pig:'poppy',Horse:'pip',Lion:'pip',Monkey:'doodle',Frog:'doodle',Bug:'poppy',Butterfly:'poppy'};
Object.assign(expectedCharacters,{Apple:'pip',Banana:'doodle',Orange:'poppy',Berry:'pip',Milk:'doodle',Water:'poppy',Bread:'pip',Cheese:'doodle',Egg:'poppy',Cookie:'doodle',Happy:'doodle',Sad:'poppy',Mad:'pip',Sleepy:'doodle',Hungry:'pip',Big:'pip',Little:'doodle',Hot:'poppy',Cold:'pip',Gentle:'poppy'});
Object.assign(expectedCharacters,{Mommy:'poppy',Daddy:'pip',Baby:'doodle',Family:'pip',Friend:'poppy',Car:'pip',Truck:'poppy',Train:'doodle',Boat:'poppy',Plane:'pip',Ball:'doodle',Book:'poppy',Bike:'pip',Doll:'poppy',Blocks:'doodle'});
Object.assign(expectedCharacters,{Sun:'doodle',Moon:'poppy',Star:'pip',Cloud:'doodle',Rain:'poppy',Snow:'pip',Tree:'pip',Flower:'poppy',Grass:'doodle',Sky:'poppy',Hi:'poppy',Bye:'doodle',Yes:'pip',No:'poppy',Please:'doodle',Thanks:'poppy',More:'pip','All done':'doodle',Help:'pip',Love:'poppy'});
Object.assign(expectedCharacters,{Cup:'pip',Spoon:'doodle',Plate:'poppy',Chair:'pip',Bed:'doodle',Bath:'poppy',Door:'pip',Light:'doodle',Clock:'poppy',Phone:'pip',Shirt:'pip',Pants:'doodle',Shoes:'poppy',Socks:'doodle',Hat:'pip',Coat:'poppy',Dress:'poppy',Pajamas:'doodle',Diaper:'doodle',Boots:'pip'});
for(const word of groupedWords){
  const card=data.words.find(item=>item.word===word);
  assert.equal(card.character,expectedCharacters[word],`${word} must be assigned to the illustrated Meadow Pal`);
}
for(const word of groupedWords){
  const card=data.words.find(item=>item.word===word);
  assert(card.image,`${word} needs custom sub-deck art`);
  const imagePath=require('path').join(root,card.image);
  assert(fs.existsSync(imagePath),`missing sub-deck art ${card.image}`);
  assert(fs.statSync(imagePath).size>100000,`sub-deck art is unexpectedly small: ${card.image}`);
  assert(card.audio,`${word} needs assigned-character audio`);
  const audioPath=require('path').join(root,card.audio);
  assert(fs.existsSync(audioPath),`missing First Words audio ${card.audio}`);
  assert(fs.statSync(audioPath).size>1000,`First Words audio is unexpectedly small: ${card.audio}`);
  assert(card.spanish?.audio,`${word} needs Spanish assigned-character audio`);
  assert(card.spanish.audio.includes(`/voice-packs-es/${card.character}/words-es/`),`${word} Spanish audio must use its assigned character`);
  const spanishAudioPath=require('path').join(root,card.spanish.audio);
  assert(fs.existsSync(spanishAudioPath),`missing Spanish First Words audio ${card.spanish.audio}`);
  assert(fs.statSync(spanishAudioPath).size>1000,`Spanish First Words audio is unexpectedly small: ${card.spanish.audio}`);
}
const app=fs.readFileSync(require('path').join(root,'app.js'),'utf8');
const serviceWorker=fs.readFileSync(require('path').join(root,'sw.js'),'utf8');
assert(app.includes("letters:{title:'Letters',kicker:'READ WITH POPPY',size:26"),'letter sessions must include all 26 letters');
assert(app.includes("lettersEs:{title:'Alfabeto español',kicker:'APRENDE CON POPPY',size:27"),'Spanish sessions must include all 27 letters');
assert(app.includes("shapes:{title:'Shapes',spanishTitle:'Formas'")&&app.includes("size:9,color:'#e7edf8'"),'shape sessions must include all nine shapes');
assert(app.includes("colorsShapes:{title:'Colors & Shapes',spanishTitle:'Colores y formas'")&&app.includes("size:18,color:'#eef0dc'"),'mixed sessions must include all colors and shapes');
assert(app.includes("words:{title:'First Words',kicker:'EXPLORE TOGETHER',size:100"),'word sessions must include all 100 words');
assert(app.includes("['colors','shapes','colorsShapes','words'].includes(key)"),'colors, shapes, mixed, and word decks must shuffle');
assert(app.includes("const APP_VERSION='59'"),'app and cache version must be current');
assert(serviceWorker.includes("const CACHE='meadow-pals-v59'"),'service worker cache must match the app version');
for(const cacheGroup of ['...LETTER_ART','...COLOR_ART','...SHAPE_ART','...SPANISH_LETTER_ART'])assert(serviceWorker.includes(cacheGroup),`${cacheGroup} must be cached for offline use`);
assert(serviceWorker.includes('...SHAPE_AUDIO_FILES'),'all shape audio must be cached for offline use');
assert(serviceWorker.includes('...WORD_AUDIO'),'all First Words audio must be cached for offline use');
assert(serviceWorker.includes('...SPANISH_WORD_AUDIO'),'all Spanish First Words audio must be cached for offline use');
for(const cacheGroup of ['...SPANISH_NUMBER_AUDIO_FILES','...SPANISH_LETTER_AUDIO_FILES','...SPANISH_COLOR_AUDIO','...SPANISH_SHAPE_AUDIO_FILES'])assert(serviceWorker.includes(cacheGroup),`${cacheGroup} must be cached for offline use`);
assert(app.includes("category==='words'"),'First Words must block generic synthesized voice fallback');
assert(app.includes('store.wordLanguage'),'First Words must remember the English or Spanish selection');
assert(app.includes('store.conceptLanguage'),'Colors and Shapes must remember the English or Spanish selection');
assert(app.includes("startCategory('numbers',null,'','explore',button.dataset.numberLanguage)"),'Numbers must provide English and Spanish decks');
assert(app.includes('cardLanguage'),'First Words must switch text and character audio by language');
assert(app.includes('selectedWordGroups'),'First Words must support selecting multiple sub-decks');
assert(app.includes('renderFindRound'),'Find It mode must be implemented');
assert(app.includes('togetherPrompt'),'Together mode must be implemented');
assert(app.includes('checkForUpdate'),'parent settings must provide an app update check');
const html=fs.readFileSync(require('path').join(root,'index.html'),'utf8');
for(const id of ['parentHub','pinModal','profileGrid','flashCard','openNumbers','numberLanguageModal','openLetters','letterLanguageModal','openWordGroups','wordGroupModal','wordGroupGrid','startWordGroups','openColorShapes','colorShapeModal','findChoices'])assert(html.includes(`id="${id}"`),`missing ${id}`);
assert(html.includes('data-word-language="en"')&&html.includes('data-word-language="es"'),'First Words must provide an English/Spanish toggle');
assert(html.includes('data-number-language="en"')&&html.includes('data-number-language="es"'),'Numbers must provide an English/Spanish choice');
assert(html.includes('data-concept-language="en"')&&html.includes('data-concept-language="es"'),'Colors and Shapes must provide an English/Spanish toggle');
for(const title of ['Numbers · Números','Letters · Letras','Colors &amp; Shapes · Colores y formas','First Words · Primeras palabras'])assert(html.includes(title),`home path needs bilingual title: ${title}`);
assert.equal((html.match(/English or Español/g)||[]).length,4,'all four home paths must use the same language description');
assert(html.includes('id="closeParent" aria-label="Back to the learning center">← Back to Learning</button>'),'Parent Hub must show a visible return label');
assert(fs.readFileSync(require('path').join(root,'styles.css'),'utf8').includes('.parent-hub header button{border:0;background:white;color:var(--ink);'),'Parent Hub return label must contrast with its white button');
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
