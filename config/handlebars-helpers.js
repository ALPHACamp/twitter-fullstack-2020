const moment = require('moment')

module.exports = {
  //...
  fromNow: function (a) {
    return moment(a).locale('zh-tw').fromNow()
  },

  date: function (a) {
    return moment(a).locale('zh-tw').format('LLLL')
  },

  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  }
}