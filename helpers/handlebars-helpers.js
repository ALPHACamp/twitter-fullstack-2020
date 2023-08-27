const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localeData = require('dayjs/plugin/localeData')
const zhTW = require('dayjs/locale/zh-tw')

dayjs.locale(zhTW)
dayjs.extend(localeData)
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
