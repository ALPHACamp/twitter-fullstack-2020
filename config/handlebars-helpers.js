const moment = require('moment');

module.exports = {
  moment(a) {
    return moment(a).fromNow();
  },
  isdefined(value) {
    return value !== undefined;
  },
};
