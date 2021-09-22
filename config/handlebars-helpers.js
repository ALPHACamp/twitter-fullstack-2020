const moment = require('moment')
module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },
  moment: function (a) {
    moment.locale('zh-tw')
    return moment(a).fromNow()
  },
  momentA: function (a) {
    return moment(a).format("YYYY-MM-DD LT")
  },
  thousandComma: function (num) {

    let result = '', counter = 0

    num = (num || 0).toString()
    for (let i = num.length - 1; i >= 0; i--) {
      counter++
      result = num.charAt(i) + result
      if (!(counter % 3) && i !== 0) { result = ',' + result }
    }
    return result
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