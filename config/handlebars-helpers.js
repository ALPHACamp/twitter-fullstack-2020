const moment = require('moment')

module.exports = {
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
  changeTime: function (a) {
    let hour = a.getHours()
    if (Number(hour) > 12) {
      hour = `下午 ${Number(hour) - 12}`
    } else {
      hour = `上午 ${hour}`
    }
    return `${hour}:${a.getMinutes()} · ${a.getFullYear()} 年 ${a.getMonth() + 1} 月 ${a.getDate()} 日`
  }
}