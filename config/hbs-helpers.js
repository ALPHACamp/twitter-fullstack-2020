const moment = require('moment')
moment.locale('zh-tw')

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
  },
  moment_format: function (a) {
    return moment(a).format('a h:mm．YYYY年MMMDo')
  },
  moment_message: function (a) {
    return moment(a).format('a h.mm')
  },
}
