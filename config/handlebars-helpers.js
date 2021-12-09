const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },

  moment: function (a) {
    moment.updateLocale('zh-tw', { meridiem: a })
    return moment(a).fromNow()
  }
}
