const moment = require('moment')
require('../node_modules/moment/locale/zh-tw')
moment.locale('zh-tw')

module.exports = {
  ifCond: function (a, b, options) {
    if (a !== b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  moment: function (a) {
    return moment(a).fromNow()
  }
}