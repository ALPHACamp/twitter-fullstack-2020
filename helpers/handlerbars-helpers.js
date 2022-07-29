const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  timeFormat: a => {
    const day = dayjs(a).format('a h:mm．YYYY年M月D日')
    return day.slice(0, 2) === 'am'
      ? '上午' + day.slice(2)
      : '下午' + day.slice(2)
  }
}
