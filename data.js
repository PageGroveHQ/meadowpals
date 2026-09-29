const NUMBER_CARDS = [
  {word:'0',speech:'Zero',image:'assets/meadow-pals/numbers/0-empty-basket.png',detail:'An empty basket means zero.'},
  {word:'1',speech:'One',image:'assets/meadow-pals/numbers/1-apple.png',detail:'Pip is holding one apple.'},
  {word:'2',speech:'Two',image:'assets/meadow-pals/numbers/2-birds.png',detail:'Poppy found two birds.'},
  {word:'3',speech:'Three',image:'assets/meadow-pals/numbers/3-ducklings.png',detail:'Three ducklings are together.'},
  {word:'4',speech:'Four',image:'assets/meadow-pals/numbers/4-blocks.png',detail:'Pip has four blocks.'},
  {word:'5',speech:'Five',image:'assets/meadow-pals/numbers/5-flowers.png',detail:'Poppy sees five flowers.'},
  {word:'6',speech:'Six',image:'assets/meadow-pals/numbers/6-bubbles.png',detail:'Doodle counts six bubbles.'},
  {word:'7',speech:'Seven',image:'assets/meadow-pals/numbers/7-strawberries.png',detail:'Pip found seven strawberries.'},
  {word:'8',speech:'Eight',image:'assets/meadow-pals/numbers/8-balloons.png',detail:'Poppy has eight balloons.'},
  {word:'9',speech:'Nine',image:'assets/meadow-pals/numbers/9-balls.png',detail:'Doodle counts nine balls.'},
  {word:'10',speech:'Ten',image:'assets/meadow-pals/numbers/10-stars.png',detail:'The pals found ten stars!'}
];

window.MEADOW_DATA = {
  numbers: NUMBER_CARDS,
  letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter,index)=>({word:letter,picture:['🍎','🐻','🐱','🐶','🥚','🐸','🍇','🏠','🍦','🧃','🔑','🍃','🌙','🌙','🍊','🐷','👑','🌈','☀️','🐯','☂️','🎻','🐳','📦','🪀','🦓'][index],detail:`${letter} is for ${['apple','bear','cat','dog','egg','frog','grapes','house','ice cream','juice','key','leaf','moon','night','orange','pig','queen','rainbow','sun','tiger','umbrella','violin','whale','box','yo-yo','zebra'][index]}`,speech:`${letter}. ${['apple','bear','cat','dog','egg','frog','grapes','house','ice cream','juice','key','leaf','moon','night','orange','pig','queen','rainbow','sun','tiger','umbrella','violin','whale','box','yo-yo','zebra'][index]}`})),
  colors: [['Red','#ef5d5d','🍓'],['Orange','#f59c45','🍊'],['Yellow','#f6cf4a','☀️'],['Pink','#f49abb','🌸'],['Purple','#9b79d1','🍇'],['Green','#70b978','🌿'],['Blue','#5b9bd5','🐳'],['Black','#343643','🐈‍⬛'],['Brown','#95664b','🐻']].map(([word,color,picture])=>({word,picture,detail:`${word} is a wonderful color`,color,speech:word})),
  words: [
    ['Mommy','👩'],['Daddy','👨'],['Baby','👶'],['Family','👨‍👩‍👧'],['Friend','🧒'],['Dog','🐶'],['Cat','🐱'],['Bird','🐦'],['Fish','🐟'],['Duck','🦆'],
    ['Bear','🐻'],['Bunny','🐰'],['Cow','🐮'],['Pig','🐷'],['Horse','🐴'],['Lion','🦁'],['Monkey','🐵'],['Frog','🐸'],['Bug','🐞'],['Butterfly','🦋'],
    ['Ball','⚽'],['Book','📖'],['Car','🚗'],['Truck','🚚'],['Train','🚂'],['Boat','⛵'],['Plane','✈️'],['Bike','🚲'],['Doll','🪆'],['Blocks','🧱'],
    ['Cup','🥤'],['Spoon','🥄'],['Plate','🍽️'],['Chair','🪑'],['Bed','🛏️'],['Bath','🛁'],['Door','🚪'],['Light','💡'],['Clock','🕰️'],['Phone','📱'],
    ['Apple','🍎'],['Banana','🍌'],['Orange','🍊'],['Berry','🍓'],['Milk','🥛'],['Water','💧'],['Bread','🍞'],['Cheese','🧀'],['Egg','🥚'],['Cookie','🍪'],
    ['Head','🙂'],['Eyes','👀'],['Nose','👃'],['Mouth','👄'],['Ears','👂'],['Hands','🙌'],['Feet','🦶'],['Tummy','🧸'],['Hair','💇'],['Teeth','🦷'],
    ['Shirt','👕'],['Pants','👖'],['Shoes','👟'],['Socks','🧦'],['Hat','🧢'],['Coat','🧥'],['Dress','👗'],['Pajamas','🥱'],['Diaper','🧷'],['Boots','🥾'],
    ['Sun','☀️'],['Moon','🌙'],['Star','⭐'],['Cloud','☁️'],['Rain','🌧️'],['Snow','❄️'],['Tree','🌳'],['Flower','🌼'],['Grass','🌱'],['Sky','🌤️'],
    ['Hi','👋'],['Bye','👋'],['Yes','👍'],['No','🙅'],['Please','🙏'],['Thanks','💛'],['More','➕'],['All done','✅'],['Help','🤝'],['Love','❤️'],
    ['Happy','😊'],['Sad','😢'],['Mad','😠'],['Sleepy','😴'],['Hungry','😋'],['Big','🐘'],['Little','🐭'],['Hot','🔥'],['Cold','🧊'],['Gentle','🤲']
  ].map(([word,picture])=>({word,picture,detail:word,speech:word}))
};
