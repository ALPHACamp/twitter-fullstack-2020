const moment = require('moment')

module.exports = {
  moment: function(time) {
    return moment(time).fromNow()
  },
  ifEqual: function (v1, v2, options) {
    if (Number(v1) === Number(v2)) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
}