const moment = require('moment')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifNotCond: function (a, b, options) {
    return a === b ? options.inverse(this) : options.fn(this)
  },
  momentTime: function (a) {
    moment.locale('zh-tw')
    return moment(a).format('a h:mm')
  },
  momentDate: function (a) {
    moment.locale('zh-tw')
    return moment(a).format('LL')
  }
}
