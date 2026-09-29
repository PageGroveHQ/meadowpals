window.MEADOW_DATA = {
  numbers: Array.from({length:11},(_,n)=>({word:String(n),speech:String(n),picture:n===0?'○':Array.from({length:n},()=>['●','◆','♥','★'][n%4]).join(' '),detail:n===0?'Zero means none yet!':`${n} ${n===1?'little shape':'little shapes'}`})),
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
