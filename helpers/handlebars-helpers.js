const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
require('dayjs/locale/zh-tw')

// 時區與本地同步
const timezoneOffset = dayjs().utcOffset()

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).locale('zh-tw').add(timezoneOffset).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
