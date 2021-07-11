const moment = require('moment')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } return options.inverse(this)
  },
  moment: function (a) {
    moment.locale('zh-cn')
    return moment(a).fromNow()
  },
  momentA: function (a) {
    return moment(a).format("YYYY-MM-DD LT")
  }
}
