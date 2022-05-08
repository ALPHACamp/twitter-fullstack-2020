const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
// const { options } = require('../routes')
dayjs.extend(relativeTime)
module.exports = {
  relativeTimeFromNow: date => dayjs(date).fromNow,
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  ifNotCond: function (a, b, options) {
    return a !== b ? options.fn(this) : options.inverse(this)
  }
}
