const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')

require('dayjs/locale/zh-tw')

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

module.exports = {
  relativeTimeFromNow: time => dayjs(time).locale('zh-tw').fromNow(true),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  localizedTimeFormat: time => {
    return dayjs(time).format('H') < 12 ? dayjs(time).format('上午 h:mm ‧ YYYY年MM月DD日') : dayjs(time).format('下午 h:mm ‧ YYYY年MM月DD日')
  }
}