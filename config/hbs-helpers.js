const moment = require('moment')
module.exports = {
  // a,b檢查是否相等
  ifEqual: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  moment: function (a) {
    return moment(a).fromNow()
  }
}
