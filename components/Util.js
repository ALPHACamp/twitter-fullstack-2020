const cover = [
  'https://i.imgur.com/wGkpw1M.jpg',
  'https://i.imgur.com/xZ6qKDb.jpg',
  'https://i.imgur.com/c4lrfFo.jpg',
  'https://i.imgur.com/4Saup98.jpg',
  'https://i.imgur.com/yKt1j8t.jpg',
  'https://i.imgur.com/Ky64Alo.jpg',
];

const avater = [
  'https://i.imgur.com/lX1p1p1.jpg',
  'https://imgur.com/PS4yRak.jpg',
  'https://i.imgur.com/uRNcL5L.jpg',
  'https://i.imgur.com/EkrFu0B.jpg',
  'https://i.imgur.com/vDlIZHV.jpg',
  'https://imgur.dcard.tw/FTTspcJ.jpg',
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
