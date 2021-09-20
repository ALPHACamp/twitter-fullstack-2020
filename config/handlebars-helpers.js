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

  date: function(a) {
    let Y = a.getFullYear()
    let M = a.getMonth() + 1
    let D = a.getDate()
    let h = a.getHours()
    let m = a.getMinutes()
    let t
    if (h >= 12) {
      t = '下午'
      h = h - 12
    } else {
      t = '上午'
    }
    return t + h + ':' + m + ' • ' + Y + '年' + M + '月' + D + '日'

  },

  time: function(a) {
    let h = a.getHours()
    let m = a.getMinutes()
    let t
    if (h >= 12) {
      t = '下午'
      h = h - 12
    } else {
      t = '上午'
    }
    return t + h + ':' + m
  }
}
