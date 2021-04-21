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
  fullTime: function (a) {
    let hour = a.getHours(a)
    if (Number(hour) > 12) {
      hour = `下午 ${('0' + (Number(hour) - 12)).substr(-2)}`
    } else {
      hour = `上午 ${('0' + Number(hour)).substr(-2)}`
    }
    return `${hour}:${('0' + (a.getMinutes())).substr(-2)} · ${a.getFullYear()}年${('0' + Number(a.getMonth() + 1)).substr(-2)}月${('0' + Number(a.getDate())).substr(-2)}日`
  }
}