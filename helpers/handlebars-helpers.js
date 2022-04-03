const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const localizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  relativeTimeFromNow: a => dayjs(a).fromNow(),
  arrayLength: a => a.length,
  customTimeFormat: a => dayjs(a).format('LT．YYYY年MM月DD日')
}
