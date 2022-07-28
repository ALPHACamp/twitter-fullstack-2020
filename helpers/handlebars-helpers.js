const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

const localeObject = {
  name: 'es', // name String
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: ' 1 秒鐘',
    m: ' 1 分鐘',
    mm: '%d 分鐘',
    h: '1 小時',
    hh: '%d 小時',
    d: '1 天',
    dd: '%d 天',
    M: '1 個月',
    MM: '%d 個月',
    y: '1 年',
    yy: '%d 年'
  }
}

dayjs.locale('en-my-settings', localeObject)
dayjs.extend(relativeTime)

module.exports = {
  relativeTimeFromNow: theTime => dayjs(theTime).fromNow(),

  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
