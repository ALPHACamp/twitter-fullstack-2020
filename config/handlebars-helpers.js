const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  moment: function (a) {
    return moment(a).fromNow()
  },

  momentDay: function (b) {
    return moment(b).format('a h:mm•LL')
  },

  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
}