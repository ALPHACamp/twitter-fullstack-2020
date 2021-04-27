const cover = [
  'https://i.imgur.com/cnBNVbd.png',
  'https://i.imgur.com/wBchs5v.png',
  'https://imgur.com/mH7hHXf.png',
  'https://imgur.com/pxnjHp2.png',
  'https://imgur.com/0CGIDdt.png',
  'https://imgur.com/ZY0x8fr.png',
];

const avater = [
  'https://imgur.com/oIHzSzT.png',
  'https://imgur.com/cx7DELP.png',
  'https://imgur.com/yJdr67o.png',
  'https://imgur.com/4hp8mGO.png',
  'https://imgur.com/j3PiLUf.png',
  'https://imgur.com/MZJl7tv.png',
];

module.exports = {
  randomCover: () => {
    let length = cover.length;
    let index = Math.floor(Math.random() * length);

    return cover[index];
  },
  randomAvater: () => {
    let length = avater.length;
    let index = Math.floor(Math.random() * length);

    return avater[index];
  },
  randomNums: (count, scope) => {
    let arr = [];
    while (arr.length < count) {
      let num = parseInt(Math.random() * scope);
      if (arr.indexOf(num) == -1) {
        arr.push(num);
      }
    }

    return arr;
  },
};
