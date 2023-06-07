// modules
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

dayjs.extend(relativeTime)
// exports
module.exports = {
  currentYear: () => dayjs().year(),
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  formatRelativeTime: targetTime => {
    const currentTime = dayjs()
    if ((currentTime - targetTime) < 0) {
      console.log(currentTime)
      return '-'
    }
    const diffInMilliseconds = (currentTime - targetTime)
    const second = Math.floor(diffInMilliseconds / 1000)
    const minutes = Math.floor(diffInMilliseconds / 60000)
    const hours = Math.floor(minutes / 60)

    if (second < 60) {
      return `${second} 秒`
    } else if (minutes < 60) {
      return `${minutes} 分鐘`
    } else if (hours < 24) {
      return `${hours} 小時`
    } else if (dayjs(targetTime).year() === dayjs().year()) {
      return dayjs(targetTime).format('M月D日')
    } else {
      return dayjs(targetTime).format('YYYY年M月D日')
    }
  },
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
