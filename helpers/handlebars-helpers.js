const dayjs = require('dayjs')
const moment = require('moment')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifCondFalse: function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).fromNow()
  ,
  // {{momentNow this.createdAt}}  ex.10小時前
  momentNow: function (timeNow) {
    moment.locale('zh-tw')
    return moment(timeNow).fromNow()
  },
  momentYear: function (year) {
    return moment(year).format("YYYY-MM-DD LT")
  },
  // {{momentTime tweet.createdAt}} ex.上午 10:53
  momentTime: function (time) {
    moment.locale('zh-tw')
    return moment(time).format('a h:mm')
  },
  // {{momentDate tweet.createdAt}}  ex.2022年7月29日
  momentDate: function (date) {
    moment.locale('zh-tw')
    return moment(date).format("LL")
  }
}
