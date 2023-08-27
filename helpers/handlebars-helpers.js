const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
require('dayjs/locale/zh-tw')

module.exports = {
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  localTime: a => dayjs(a).format('A HH:mm・YYYY年MM月DD日'),
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  }
}
