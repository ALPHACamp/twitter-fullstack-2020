const moment = require('moment')

module.exports = {
  // ifCond: function (a, b, options) {
  //   if (a === b) {
  //     return options.fn(this)
  //   }
  //   return options.inverse(this)
  // },

  //人性化時間顯示
  moment: function (a) {
    return moment(a).fromNow()
  }
}
