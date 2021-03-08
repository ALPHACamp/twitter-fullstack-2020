const moment = require('moment');

module.exports = {
  moment(a) {
    return moment(a).fromNow();
  },
  isdefined(value) {
    return value !== undefined;
  },
  ifEqual(item1, item2, options) {
    if (item1 !== item2) {
      return options.inverse(this);
    }
    return options.fn(this);
  },
};
