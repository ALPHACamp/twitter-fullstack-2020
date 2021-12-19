const moment = require('moment')

module.exports = {
  moment: function (a) {
    if (moment().format('Y') === moment(a).format('Y')) {
      if ((moment().format('YMD') - moment(a).format('YMD')) < 7) {
        return moment(a).locale('zh_TW').fromNow(true)
      }
      return moment(a).locale('zh_TW').format('MMM Do')
    }
    return moment(a).locale('zh_TW').format('YYYY年 MMM Do')
  },
  ifCond: (a, b, options) => {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  timeFormat: function (a) {
    return moment(a).locale('zh_TW').format('a h:m · YYYY年 MMM Do')
  }
}