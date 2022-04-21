const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')
require('dayjs/locale/zh-tw')

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).locale('zh-tw').fromNow(),
  arrayLength: a => a.length,
  customTimeFormat: a => {
    return dayjs(a).format('H') < 12 ? dayjs(a).format('上午 h:mm．YYYY年MM月DD日') : dayjs(a).format('下午 h:mm．YYYY年MM月DD日')
  },
  textLength: t => t.length
}
