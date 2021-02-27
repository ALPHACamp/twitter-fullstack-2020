const moment = require('moment')
moment.locale('zh-tw')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment_fromNow: function (a) {
    return moment(a).fromNow()
  },
  moment_format: function (a) {
    return moment(a).format('a h:mm · LL')
  },
}