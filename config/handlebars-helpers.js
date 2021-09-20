const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
      }
    return options.inverse(this)
  },
  moment: function (a) {
    return moment(a).fromNow()
  },
  momentDetailTime: function (a) {
    moment.locale('zh-tw')
    return moment(a).format('a h:mm')
  },
  momentDetailDate: function (a) {
    moment.locale('zh-tw')
    return moment(a).format("LL")
  }
}