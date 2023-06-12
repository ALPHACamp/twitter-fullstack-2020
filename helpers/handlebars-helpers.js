// modules
const dayjs = require('dayjs')

const formatRelativeTime = targetTime => {
  const currentTime = dayjs()
  if (currentTime - targetTime < 0) {
    return '-'
  }
  const diffInMilliseconds = currentTime - targetTime
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
}

const formatDateTime = targetTime => {
  if (dayjs(targetTime).format('A') === 'AM') {
    return `上午 ${dayjs(targetTime).format('h:mm・YYYY年M月D日')}`
  } else {
    return `下午 ${dayjs(targetTime).format('h:mm・YYYY年M月D日')}`
  }
}

// exports
module.exports = {
  currentYear: () => dayjs().year(),
  formatRelativeTime,
  formatDateTime,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifQuery: function (a, b) {
    return a?.includes('?') ? `${a}&${b}` : `${a}?${b}`
  }
}
