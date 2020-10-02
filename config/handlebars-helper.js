const moment = require('moment');

module.exports = {
  Equal: (a, b, options) => {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: (a) => {
    return moment(a).fromNow();
  },
  subText: (content, num) => {
    let count = Number(num) ? Number(num) : 50;
    if (content.length < count) {
      return content;
    }

    return content.substring(0, count) + '...';
  },
};
